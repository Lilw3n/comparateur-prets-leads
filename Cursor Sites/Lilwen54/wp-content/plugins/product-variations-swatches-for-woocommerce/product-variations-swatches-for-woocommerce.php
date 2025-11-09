<?php
/**
 * Plugin Name: Product Variations Swatches for WooCommerce
 * Plugin URI: https://villatheme.com/extensions/woocommerce-product-variations-swatches
 * Description: Showcase variations and impress your customers with beautiful swatches such as color, button, image, and more.
 * Version: 1.1.13
 * Author: VillaTheme
 * Author URI: https://villatheme.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: product-variations-swatches-for-woocommerce
 * Domain Path: /languages
 * Copyright 2020-2025 VillaTheme.com. All rights reserved.
 * Tested up to: 6.8
 * WC requires at least: 7.0
 * WC tested up to: 10.1
 * Requires PHP: 7.0
 * Requires at least: 5.0
 * Requires Plugins: woocommerce
 **/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'VI_WOO_PRODUCT_VARIATIONS_SWATCHES_VERSION', '1.1.13' );
/**
 * Return if the premium version is active
 */
include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
//compatible with 'High-Performance order storage (COT)'
add_action( 'before_woocommerce_init', function () {
	if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
	}
});
if ( is_plugin_active( 'woocommerce-product-variations-swatches/woocommerce-product-variations-swatches.php' ) ) {
	return;
}

/**
 * Class VI_WOO_PRODUCT_VARIATIONS_SWATCHES
 */
class VI_WOO_PRODUCT_VARIATIONS_SWATCHES {
	public function __construct() {

		add_action( 'plugins_loaded',[$this,'check_environment'] );
//		add_action( 'activated_plugin', array( $this, 'activated_plugin' ) );
	}
	public function check_environment( $recent_activate = false ) {
		if ( ! class_exists( 'VillaTheme_Require_Environment' ) ) {
			include_once  WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . "product-variations-swatches-for-woocommerce" . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . 'support.php';
		}
		$environment = new \VillaTheme_Require_Environment( [
				'plugin_name'     => 'Product Variations Swatches for WooCommerce',
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
//		if ( get_option( 'vi_woo_product_variation_swatches_setup_wizard','' ) &&
//		     ( $recent_activate || ( ! empty( $_GET['page'] ) && strpos( wc_clean( wp_unslash( $_GET['page'] ) ), "woocommerce-product-variations-swatches" ) === 0 ) ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
//			delete_option('vi_woo_product_variation_swatches_setup_wizard');
//			if (! get_option( 'vi_woo_product_variation_swatches_params', '' ) ){
//				$json_data  = '{"ids":["vi_wpvs_button_design","vi_wpvs_color_design","vi_wpvs_image_design"],"names":["Button Design","Color Design","Image Design"],"attribute_reduce_size_mobile":["85","85","85"],"attribute_width":[false,"32","50"],"attribute_height":[false,"32","50"],"attribute_fontsize":["13","13","13"],"attribute_padding":["10px 20px","3px","3px"],"attribute_transition":["30","30","30"],"attribute_default_box_shadow_color":[false,"rgba(238, 238, 238, 1)",false],"attribute_default_color":["rgba(33, 33, 33, 1)",false,false],"attribute_default_bg_color":["#ffffff","rgba(0, 0, 0, 0)","rgba(255, 255, 255, 1)"],"attribute_default_border_color":["#cccccc",false,"rgba(238, 238, 238, 1)"],"attribute_default_border_radius":[false,"20",false],"attribute_default_border_width":["1","0","1"],"attribute_hover_scale":["1","1","1"],"attribute_hover_box_shadow_color":[false,false,false],"attribute_hover_color":["rgba(255, 255, 255, 1)",false,false],"attribute_hover_bg_color":["rgba(33, 33, 33, 1)","rgba(0, 0, 0, 0.06)",false],"attribute_hover_border_color":["rgba(33, 33, 33, 1)",false,"rgba(33, 33, 33, 1)"],"attribute_hover_border_radius":[false,"20",false],"attribute_hover_border_width":["1","0","1"],"attribute_selected_scale":["1","1","1"],"attribute_selected_icon_enable":[],"attribute_selected_icon_type":[],"attribute_selected_icon_color":[],"attribute_selected_box_shadow_color":[false,false,false],"attribute_selected_color":["rgba(255, 255, 255, 1)",false,false],"attribute_selected_bg_color":["rgba(33, 33, 33, 1)","rgba(0, 0, 0, 0.06)",false],"attribute_selected_border_color":["rgba(33, 33, 33, 1)",false,"rgba(33, 33, 33, 1)"],"attribute_selected_border_radius":[false,"20",false],"attribute_selected_border_width":["1","0","1"],"attribute_out_of_stock":["blur","blur","blur"],"attribute_tooltip_enable":[false,false,false],"attribute_tooltip_type":[],"attribute_tooltip_position":["top","top","top"],"attribute_tooltip_width":[],"attribute_tooltip_height":[],"attribute_tooltip_fontsize":["14","14","14"],"attribute_tooltip_border_radius":["3","3","3"],"attribute_tooltip_bg_color":["#ffffff","#ffffff","#ffffff"],"attribute_tooltip_color":["#222222","#222222","#222222"],"attribute_tooltip_border_color":["#cccccc","#cccccc","#cccccc"],"attribute_display_default":"button","attribute_double_click":"","taxonomy_profiles":[],"taxonomy_display_type":[],"check_swatches_settings":1}';
//				update_option( 'vi_woo_product_variation_swatches_params', json_decode( $json_data, true ) );
////				$taxonomies = wc_get_attribute_taxonomies();
////				if ( $taxonomies ) {
////					exit ( wp_redirect( admin_url( 'admin.php?page=woocommerce-product-variations-swatches-global-attrs' ) ) );
////				}
//			}
//		}
		$init_file = WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . "product-variations-swatches-for-woocommerce" . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "define.php";
		require_once $init_file;
	}

	function activated_plugin( $plugin ) {
		if ( $plugin === 'product-variations-swatches-for-woocommerce/product-variations-swatches-for-woocommerce.php' ) {
			update_option( 'vi_woo_product_variation_swatches_setup_wizard', 1, 'no' );
			$this->check_environment( true );
		}
	}
}

new VI_WOO_PRODUCT_VARIATIONS_SWATCHES();