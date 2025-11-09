<?php
/**
 * Plugin Name: ALD - Aliexpress Dropshipping and Fulfillment for WooCommerce
 * Plugin URI: https://villatheme.com/extensions/aliexpress-dropshipping-and-fulfillment-for-woocommerce/
 * Description: Transfer data from AliExpress products to WooCommerce effortlessly and fulfill WooCommerce order to AliExpress automatically.
 * Version: 2.2.1
 * Author: VillaTheme(villatheme.com)
 * Author URI: http://villatheme.com
 * Text Domain: woocommerce-alidropship
 * Copyright 2020-2025 VillaTheme.com. All rights reserved.
 * Requires Plugins: woocommerce
 * Tested up to: 6.8
 * WC tested up to: 10.3
 * Requires PHP: 7.0
 **/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_VERSION', '2.2.1' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_DIR', plugin_dir_path( __FILE__ ) );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "includes" . DIRECTORY_SEPARATOR );

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

if ( is_file( VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "class-vi-wad-ali-orders-info-table.php" ) ) {
	require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "class-vi-wad-ali-orders-info-table.php";
}

if ( is_file( VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "class-vi-wad-ali-shipping-info-table.php" ) ) {
	require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "class-vi-wad-ali-shipping-info-table.php";
}

if ( is_file( VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "ali-product-table.php" ) ) {
	require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "ali-product-table.php";
}

/**
 * Class VI_WOOCOMMERCE_ALIDROPSHIP
 */
class VI_WOOCOMMERCE_ALIDROPSHIP {
	public function __construct() {
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		add_action( 'plugins_loaded', array( $this, 'check_environment' ) );
		add_action( 'before_woocommerce_init', [ $this, 'custom_order_tables_declare_compatibility' ] );
	}

	public function check_environment( $recent_activate = false ) {
		if ( ! class_exists( 'VillaTheme_Require_Environment' ) ) {
			include_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . 'support.php';
		}

		$environment = new \VillaTheme_Require_Environment( [
				'plugin_name'     => 'ALD - Aliexpress Dropshipping and Fulfillment for WooCommerce',
				'php_version'     => '7.0',
				'wp_version'      => '5.0',
				'require_plugins' => [
                    [
                        'slug' => 'woocommerce',
                        'name' => 'WooCommerce',
						'defined_version' => 'WC_VERSION',
                        'version' => '7.0',
                    ],
				]
			]
		);

		if ( $environment->has_error() ) {
			return;
		}
		if ( get_option( 'viwad_setup_wizard' ) &&
		     ( $recent_activate || ( ! empty( $_GET['page'] ) && strpos( wc_clean( wp_unslash( $_GET['page'] ) ), "woocommerce-alidropship" ) === 0 ) ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$url = add_query_arg( array( 'vi_wad_setup_wizard' => true, '_wpnonce' => wp_create_nonce( 'vi_wad_setup' ) ), admin_url() );
			wp_safe_redirect( $url );
			exit();
		}

		global $wpdb;

		$tables = array(
			'ald_posts'    => 'ald_posts',
			'ald_postmeta' => 'ald_postmeta'
		);

		foreach ( $tables as $name => $table ) {
			$wpdb->$name    = $wpdb->prefix . $table;
			$wpdb->tables[] = $table;
		}

		require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "define.php";
		add_action( 'admin_init', array( $this, 'update_db_new_version' ), 0 );
		add_filter( 'cron_schedules', [ $this, 'cron_schedules' ] );
	}

	public function custom_order_tables_declare_compatibility() {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
		}
	}

	public function update_db_new_version() {
		$option = 'vi_wad_add_shipping_info_table_version_1.0.3';
		if ( ! get_option( $option ) ) {
			VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Orders_Info_Table::create_table();
			VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table::create_table();
			VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table::add_column( 'ali_id' );
			update_option( $option, time() );
		}
		$option = 'vi_wad_update_access_token_new_app_1.1.0';
		if ( ! get_option( $option ) ) {
			$args = get_option( 'wooaliexpressdropship_params' );
			if ( isset( $args['access_tokens'] ) && is_array( $args['access_tokens'] ) && $args['access_tokens'] ) {
				foreach ( $args['access_tokens'] as &$access_token ) {
					$access_token['expire_time'] = 1000 * ( time() - DAY_IN_SECONDS );
				}
				update_option( 'wooaliexpressdropship_params', $args );
			}
			update_option( $option, time() );
		}
	}

	/**
	 * When active plugin Function will be call
	 */
	public function activate() {
		ALD_Product_Table::create_table();
		VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Orders_Info_Table::create_table();
		VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table::create_table();

		if ( class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_Error_Images_Table' ) ) {
			VI_WOOCOMMERCE_ALIDROPSHIP_Error_Images_Table::create_table();
		}

		$check_active = get_option( 'wooaliexpressdropship_params' );
		if ( ! $check_active ) {
			update_option( 'vi_wad_update_access_token_new_app_1.1.0', time() );

			if ( ! class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA' ) ) {
				require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "data.php";
			}

			$settings             = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();
			$accept_currencies    = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_accept_currencies();
			$params               = $settings->get_params();
			$params['secret_key'] = md5( time() );

			foreach ( $accept_currencies as $currency ) {
				if ( empty( $params["import_currency_rate_{$currency}"] ) ) {
					$rate = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_exchange_rate( 'google', $currency, $currency === 'CNY' ? 2 : 3 );

					$params["import_currency_rate_{$currency}"] = $rate;
				}
			}

			if ( is_plugin_active( 'woocommerce-extra-checkout-fields-for-brazil/woocommerce-extra-checkout-fields-for-brazil.php' ) ) {
				/*Set default custom fields if Brazilian Market on WooCommerce plugin is active*/
				$params['cpf_custom_meta_key']            = '_billing_cpf';
				$params['billing_number_meta_key']        = '_billing_number';
				$params['shipping_number_meta_key']       = '_shipping_number';
				$params['billing_neighborhood_meta_key']  = '_billing_neighborhood';
				$params['shipping_neighborhood_meta_key'] = '_shipping_neighborhood';
			}

			$posts = get_posts( [ 'post_type' => 'vi_wad_draft_product', 'numberposts' => 1, 'post_status' => 'any' ] );
			if ( empty( $posts ) ) {
				update_option( 'ald_deleted_old_posts_data', true );
				update_option( 'ald_migrated_to_new_table', true );
				$params['ald_table'] = 1;
			}

			update_option( 'wooaliexpressdropship_params', $params );
			add_action( 'activated_plugin', array( $this, 'after_activated' ) );
		} else {
			if ( wp_next_scheduled( 'vi_wad_update_aff_urls' ) ) {
				wp_unschedule_hook( 'vi_wad_update_aff_urls' );
			}

			if ( ! class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA' ) ) {
				require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "data.php";
			}

			$settings = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();
			$args     = $settings->get_params();

			if ( $args['exchange_rate_auto'] && ! wp_next_scheduled( 'vi_wad_auto_update_exchange_rate' ) ) {
				$schedule_time = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_schedule_time_from_local_time( $args['exchange_rate_hour'], $args['exchange_rate_minute'], $args['exchange_rate_second'] );
				wp_schedule_event( $schedule_time, 'vi_wad_exchange_rate_interval', 'vi_wad_auto_update_exchange_rate' );
			}

			if ( $args['update_product_auto'] && ! wp_next_scheduled( 'vi_wad_auto_update_product' ) ) {
				$schedule_time = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_schedule_time_from_local_time( $args['update_product_hour'], $args['update_product_minute'], $args['update_product_second'] );
				wp_schedule_event( $schedule_time, 'vi_wad_update_product_interval', 'vi_wad_auto_update_product' );
			}

			if ( $args['update_order_auto'] && ! wp_next_scheduled( 'vi_wad_auto_update_order' ) ) {
				$schedule_time = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_schedule_time_from_local_time( $args['update_order_hour'], $args['update_order_minute'], $args['update_order_second'] );
				wp_schedule_event( $schedule_time, 'vi_wad_update_order_interval', 'vi_wad_auto_update_order' );
			}
		}
	}

	/**
	 * When plugin is deactivated, unschedule hook and disable update rate option
	 */
	public function deactivate() {
		wp_unschedule_hook( 'vi_wad_auto_update_exchange_rate' );
		wp_unschedule_hook( 'vi_wad_auto_update_product' );
		wp_unschedule_hook( 'vi_wad_auto_update_order' );
	}

	public function after_activated( $plugin ) {
		if ( $plugin === plugin_basename( __FILE__ ) ) {
			update_option( 'viwad_setup_wizard', 1, 'no' );
			$this->check_environment( true );
		}
	}

	public function cron_schedules( $schedules ) {
		if ( ! class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA' ) ) {
			require_once VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "data.php";
		}

		$settings = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();

		$schedules['vi_wad_update_product_interval'] = array(
			'interval' => DAY_IN_SECONDS * absint( $settings->get_params( 'update_product_interval' ) ),
			'display'  => esc_html__( 'Product auto-sync', 'woocommerce-alidropship' ),
		);

		$schedules['vi_wad_update_order_interval'] = array(
			'interval' => DAY_IN_SECONDS * absint( $settings->get_params( 'update_order_interval' ) ),
			'display'  => esc_html__( 'Auto update order', 'woocommerce-alidropship' ),
		);

		$schedules['vi_wad_exchange_rate_interval'] = array(
			'interval' => DAY_IN_SECONDS * absint( $settings->get_params( 'exchange_rate_interval' ) ),
			'display'  => esc_html__( 'Auto update exchange rate', 'woocommerce-alidropship' ),
		);

		return $schedules;
	}
}

new VI_WOOCOMMERCE_ALIDROPSHIP();