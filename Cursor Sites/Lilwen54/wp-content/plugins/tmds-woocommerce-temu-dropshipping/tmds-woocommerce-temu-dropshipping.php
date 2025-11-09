<?php
/**
 * Plugin Name: TMDS - WooCommerce Temu Droshipping Premium
 * Plugin URI: https://villatheme.com/extensions/tmds/
 * Description: Transfer data from Temu products to WooCommerce effortlessly and fulfill WooCommerce order to Temu automatically.
 * Version: 1.0.3
 * Author: VillaTheme
 * Author URI: https://villatheme.com
 * Copyright 2025 VillaTheme.com. All rights reserved.
 * Text-domain: tmds-woocommerce-temu-dropshipping
 * Requires Plugins: woocommerce
 * Tested up to: 6.8
 * WC requires at least: 7.0
 * WC tested up to: 10.3
 * Requires PHP: 7.0
 * Requires at least: 6.2
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'TMDSPRO_VERSION' ) ) {
	define( 'TMDSPRO_VERSION', '1.0.3' );
	define( 'TMDSPRO_NAME', 'TMDS - WooCommerce Temu droshipping' );
	define( 'TMDSPRO_BASENAME', plugin_basename( __FILE__ ) );
	define( 'TMDSPRO_DIR', plugin_dir_path( __FILE__ ) );
	define( 'TMDSPRO_LANGUAGES', TMDSPRO_DIR . "languages" . DIRECTORY_SEPARATOR );
	define( 'TMDSPRO_INCLUDES', TMDSPRO_DIR . "includes" . DIRECTORY_SEPARATOR );
	define( 'TMDSPRO_ADMIN', TMDSPRO_DIR . "admin" . DIRECTORY_SEPARATOR );
	define( 'TMDSPRO_FRONTEND', TMDSPRO_DIR . "frontend" . DIRECTORY_SEPARATOR );
	define( 'TMDSPRO_TEMPLATES', TMDSPRO_DIR . "templates" . DIRECTORY_SEPARATOR );
	define( 'TMDSPRO_COMPATIBLE', TMDSPRO_DIR . "compatible" . DIRECTORY_SEPARATOR );
	$plugin_url = plugins_url( 'assets/', __FILE__ );
	define( 'TMDSPRO_CSS', $plugin_url . "css/" );
	define( 'TMDSPRO_JS', $plugin_url . "js/" );
	define( 'TMDSPRO_IMAGES', $plugin_url . "images/" );
	define( 'TMDSPRO_Admin_Class_Prefix', "TMDSPRO_Admin_" );
	define( 'TMDSPRO_Frontend_Class_Prefix', "TMDSPRO_Frontend_" );
	define( 'TMDSPRO_Compatible_Class_Prefix', "TMDSPRO_Compatible_" );
}
if ( ! class_exists( 'TMDSPRO_INIT' ) ) {
	/**
	 * Class TMDSPRO_INIT
	 */
	class TMDSPRO_INIT {
		public function __construct() {
			add_action( 'before_woocommerce_init', array( $this, 'before_woocommerce_init' ) );
			add_action( 'plugins_loaded', [ $this, 'check_environment' ] );
			add_action( 'activated_plugin', array( $this, 'after_activated' ), 10, 2 );
		}

		public function after_activated( $plugin, $network_wide ) {
			if ( $plugin !== TMDSPRO_BASENAME ) {
				return;
			}
			global $wpdb;
			if ( function_exists( 'is_multisite' ) && is_multisite() && $network_wide ) {
				$current_blog = $wpdb->blogid;
				$blogs        = $wpdb->get_col( $wpdb->prepare( 'SELECT blog_id FROM %i', [ $wpdb->blogs ] ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

				//Multi site activate action
				foreach ( $blogs as $blog ) {
					switch_to_blog( $blog );
					$this->create_table();
				}
				switch_to_blog( $current_blog );
			} else {
				//Single site activate action
				$this->create_table();
			}
			if ( ! get_option( 'tmds_params' ) ) {
				update_option( 'tmds_setup_wizard', 1, 'no' );
				$this->check_environment();
			}
			if ( ! class_exists( 'TMDSPRO_DATA' ) ) {
				include_once TMDSPRO_INCLUDES . 'data.php';
			}
			$settings = TMDSPRO_DATA::get_instance();
			if ( $settings->get_params( 'exchange_rate_auto' ) && ! wp_next_scheduled( 'villatheme_' . ( $settings::$prefix ) . '_auto_update_exchange_rate' ) ) {
				$schedule_time = $settings::get_schedule_time_from_local_time( $settings->get_params( 'exchange_rate_hour' ), $settings->get_params( 'exchange_rate_minute' ), $settings->get_params( 'exchange_rate_second' ) );
				wp_schedule_event( $schedule_time, 'villatheme_' . ( $settings::$prefix ) . '_exchange_rate_interval', 'villatheme_' . ( $settings::$prefix ) . '_auto_update_exchange_rate' );
			}
		}

		public function create_table() {
			if ( ! class_exists( 'TMDSPRO_Error_Images_Table' ) ) {
				require_once TMDSPRO_INCLUDES . "class" . DIRECTORY_SEPARATOR . 'error-images-table.php';
			}
			if ( ! class_exists( 'TMDSPRO_Products_Table' ) ) {
				require_once TMDSPRO_INCLUDES . "class" . DIRECTORY_SEPARATOR . 'tmds-products-table.php';
			}
			TMDSPRO_Products_Table::maybe_create_table();
			TMDSPRO_Error_Images_Table::create_table();
		}

		public function check_environment( $recent_activate = false ) {
			if ( ! class_exists( 'VillaTheme_Require_Environment' ) ) {
				require_once TMDSPRO_INCLUDES . 'support.php';
			}
			$environment = new \VillaTheme_Require_Environment( [
					'plugin_name'     => TMDSPRO_NAME,
					'php_version'     => '7.0',
					'wp_version'      => '5.0',
					'require_plugins' => [
						[
							'slug'            => 'woocommerce',
							'name'            => 'WooCommerce',
							'defined_version' => 'WC_VERSION',
							'version'         => '7.0',
						]
					]
				]
			);
			if ( $environment->has_error() ) {
				return;
			}
			if ( get_option( 'tmds_setup_wizard' ) &&
			     ( ! empty( $_GET['page'] ) && ( ( $page = sanitize_text_field( wp_unslash( $_GET['page'] ) ) ) != "tmds-auth" ) && strpos( $page, "tmds" ) === 0 ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$url = add_query_arg( [
					'tmds_setup_wizard' => true,
					'_wpnonce'          => wp_create_nonce( 'tmds_setup' )
				], admin_url() );
				wp_safe_redirect( $url );
				exit();
			}
			global $wpdb;
			$tables = array(
				'tmds_posts'    => 'tmds_posts',
				'tmds_postmeta' => 'tmds_postmeta'
			);
			foreach ( $tables as $name => $table ) {
				$wpdb->$name    = $wpdb->prefix . $table;
				$wpdb->tables[] = $table;
			}
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );
			$this->includes();
			add_action( 'init', array( $this, 'support' ) );
			add_action( 'init', array( $this, 'register_post_status' ) );
			add_filter( 'plugin_action_links_' . TMDSPRO_BASENAME, array( $this, 'settings_link' ) );
			add_action( 'admin_init', [ $this, 'check_update' ], 20 );
		}
		public function register_post_status() {
			register_post_status( 'override', array(
				'label'                     => _x( 'Override', 'Tmds product status', 'tmds-woocommerce-temu-dropshipping' ),
				'public'                    => true,
				'exclude_from_search'       => false,
				'show_in_admin_all_list'    => false,
				'show_in_admin_status_list' => false,
				/* translators: %s: number of orders */
				'label_count'               => '',
			) );
		}

		public function admin_notices() {
			$errors              = [];
			$permalink_structure = get_option( 'permalink_structure' );
			if ( ! $permalink_structure ) {
				$errors[] = sprintf( "%s <a href='%s' target='_blank'>%s</a> %s",
					esc_html__( 'You are using Permalink structure as Plain. Please go to', 'tmds-woocommerce-temu-dropshipping' ),
					esc_html( admin_url( 'options-permalink.php' ) ),
					esc_html__( 'Permalink Settings', 'tmds-woocommerce-temu-dropshipping' ),
					esc_html__( 'to change it', 'tmds-woocommerce-temu-dropshipping' )
				);
			}

			if ( ! is_ssl() ) {
				$errors[] = sprintf( "%s <a href='https://wordpress.org/documentation/article/https-for-wordpress/' target='_blank'>%s</a>",
					esc_html__( 'Your site is not using HTTPS. For more details, please read', 'tmds-woocommerce-temu-dropshipping' ),
					esc_html__( 'HTTPS for WordPress', 'tmds-woocommerce-temu-dropshipping' )
				);
			}
			if ( ! empty( $errors ) ) {
				?>
                <div class="error">
                    <h3>
						<?php
						echo esc_html( TMDSPRO_NAME ) . ': ' . esc_html( _n( 'you can not import products unless below issue is resolved',
								'you can not import products unless below issues are resolved',
								count( $errors ), 'tmds-woocommerce-temu-dropshipping' ) );
						?>
                    </h3>
					<?php
					foreach ( $errors as $error ) {
						echo wp_kses_post( "<p>{$error}</p>" );
					}
					?>
                </div>
				<?php
			}
		}

		protected function includes() {
			$files = array(
				TMDSPRO_INCLUDES => [
					'file_name' => [
						'update.php',
						'check_update.php',
						'support.php',
						'data.php',
						'background-process/wp-async-request.php',
						'background-process/wp-background-process.php',
						'class/handle-price.php',
						'class/handle-file.php',
						'class/error-images-table.php',
						'class/download-images.php',
						'class/tmds-post.php',
						'class/tmds-post-query.php',
						'class/tmds-products-table.php',
					]
				],
				TMDSPRO_ADMIN    => [
					'class_prefix' => TMDSPRO_Admin_Class_Prefix,
					'file_name'    => [
						'api.php',
						'auth.php',
						'log.php',
						'error-images.php',
						'import-list.php',
						'imported.php',
						'sync-product.php',
						'product.php',
						'order.php',
						'fulfill-orders.php',
						'settings.php',
						'setup-wizard.php',
						'recommend.php',
						'transfer-settings.php',
					]
				],
				TMDSPRO_FRONTEND => [
					'class_prefix' => TMDSPRO_Frontend_Class_Prefix,
					'file_name'    => [
						'product.php',
					]
				],
			);
			foreach ( $files as $path => $items ) {
				if ( empty( $items['file_name'] ) || ! is_array( $items['file_name'] ) ) {
					continue;
				}
				$class_prefix = $items['class_prefix'] ?? '';
				foreach ( $items['file_name'] as $file_name ) {
					$file = $path . '/' . $file_name;
					if ( ! file_exists( $file ) ) {
						continue;
					}
					require_once $file;
					$ext_file   = pathinfo( $file );
					$class_name = $ext_file['filename'] ?? '';
					if ( $class_prefix ) {
						$class_name = preg_replace( '/\W/i', '_', $class_prefix . ucfirst( $class_name ) );
					}
					if ( $class_name && class_exists( $class_name ) ) {
						new $class_name;
					}
				}
			}
		}

		public function settings_link( $links ) {
			$settings_link = sprintf( '<a href="%s" title="%s">%s</a>', esc_attr( admin_url( 'admin.php?page=tmds' ) ),
				esc_attr__( 'Settings', 'tmds-woocommerce-temu-dropshipping' ),
				esc_html__( 'Settings', 'tmds-woocommerce-temu-dropshipping' )
			);
			array_unshift( $links, $settings_link );

			return $links;
		}

		public function support() {
			$this->load_plugin_textdomain();
			if ( class_exists( 'VillaTheme_Support_Pro' ) ) {
				new \VillaTheme_Support_Pro(
					array(
						'support'   => 'https://villatheme.com/supports/forum/plugins/tmds-dropshipping-for-temu-and-woocommerce/',
						'docs'      => 'https://docs.villatheme.com/?item=tmds',
						'review'    => 'https://codecanyon.net/downloads',
						'css'       => TMDSPRO_CSS,
						'image'     => TMDSPRO_IMAGES,
						'slug'      => 'tmds-woocommerce-temu-dropshipping',
						'menu_slug' => 'tmds',
						'version'   => TMDSPRO_VERSION,
					)
				);
			}
		}

		public function check_update() {
			if ( class_exists( 'VillaTheme_Plugin_Check_Update' ) ) {
				$setting_url = admin_url( 'admin.php?page=vargal' );
				$key         = TMDSPRO_DATA::get_instance()->get_params( 'key' );
				new \VillaTheme_Plugin_Check_Update (
					TMDSPRO_VERSION,                    // current version
					'https://villatheme.com/wp-json/downloads/v3',  // update path
					TMDSPRO_BASENAME,                  // plugin file slug
					'tmds-woocommerce-temu-dropshipping', '223584', $key, $setting_url
				);
				new \VillaTheme_Plugin_Updater( TMDSPRO_BASENAME, 'tmds-woocommerce-temu-dropshipping', $setting_url );
			}
		}

		public function load_plugin_textdomain() {
			/**
			 * load Language translate
			 */
			$locale = apply_filters( 'plugin_locale', get_locale(), 'tmds-woocommerce-temu-dropshipping' );
			load_textdomain( 'tmds-woocommerce-temu-dropshipping', TMDSPRO_LANGUAGES . "tmds-woocommerce-temu-dropshipping-$locale.mo" );
		}

		public function before_woocommerce_init() {
			if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
				\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			}
		}

	}

	new TMDSPRO_INIT();
}