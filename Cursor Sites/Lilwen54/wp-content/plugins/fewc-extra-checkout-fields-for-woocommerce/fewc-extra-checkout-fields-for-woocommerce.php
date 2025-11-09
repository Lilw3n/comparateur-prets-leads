<?php
/**
 * Plugin Name: FEWC - Extra Checkout Fields For WooCommerce
 * Plugin URI:  https://villatheme.com/extensions/
 * Description: Easily customize your checkout page: add custom fields, enable/disable fields, rearrange their positions, and preview changes in the WP Customizer.
 * Version: 1.0.12
 * Author: VillaTheme
 * Author URI: https://villatheme.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: fewc-extra-checkout-fields-for-woocommerce
 * Domain Path: /languages
 * Copyright 2022-2025 VillaTheme.com. All rights reserved.
 * Requires Plugins: woocommerce
 * Requires PHP: 7.0
 * Requires at least: 5.0
 * Tested up to: 6.8
 * WC requires at least: 7.0
 * WC tested up to: 10.1
 **/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if (!defined('VIFEWC_VERSION')){
	define( 'VIFEWC_VERSION', '1.0.12' );
	define( 'VIFEWC_DIR', plugin_dir_path( __FILE__ ) );
	define( 'VIFEWC_LANGUAGES', VIFEWC_DIR . "languages" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_COMPATIBLE', VIFEWC_DIR . "compatible" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_INCLUDES', VIFEWC_DIR . "includes" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_ADMIN', VIFEWC_INCLUDES . "admin" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_FRONTEND', VIFEWC_INCLUDES . "frontend" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_TEMPLATES', VIFEWC_INCLUDES . "templates" . DIRECTORY_SEPARATOR );
	define( 'VIFEWC_URL', plugins_url( '', __FILE__ ) );
	$plugin_url = plugins_url( 'assets/', __FILE__ );
	define( 'VIFEWC_CSS', $plugin_url . "css/" );
	define( 'VIFEWC_JS', $plugin_url . "js/" );
	define( 'VIFEWC_IMAGES', $plugin_url . "images/" );
}
/**
 * Class VIFEWC_INIT
 */
class VIFEWC_INIT {

	public function __construct() {
		//compatible with 'High-Performance order storage (COT)'
		add_action( 'before_woocommerce_init', array( $this, 'before_woocommerce_init' ) );
		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}
	public function before_woocommerce_init() {
		if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
		}
	}
	public function init() {
		if ( ! class_exists( 'VillaTheme_Require_Environment' ) ) {
			include_once VIFEWC_INCLUDES . 'support.php';
		}

		$environment = new VillaTheme_Require_Environment( [
				'plugin_name'     => 'FEWC - Extra Checkout Fields For WooCommerce',
				'php_version'     => '7.0',
				'wp_version'      => '5.0',
				'require_plugins' => [
					[
						'slug' => 'woocommerce',
						'name' => 'WooCommerce' ,
						'defined_version' => 'WC_VERSION',
						'required_version' => '7.0',
					]
				]
			]
		);

		if ( $environment->has_error() ) {
			return;
		}

		$this->includes();
	}



	protected function includes() {
		$files = array(
			VIFEWC_INCLUDES . 'data.php',
			VIFEWC_INCLUDES . 'functions.php',
			VIFEWC_INCLUDES . 'support.php',
			VIFEWC_INCLUDES . 'check_update.php',
			VIFEWC_INCLUDES . 'update.php',
			VIFEWC_INCLUDES . 'customize-settings.php',
			VIFEWC_INCLUDES . 'customize-controls.php',
		);
		foreach ( $files as $file ) {
			if ( file_exists( $file ) ) {
				require_once $file;
			}
		}
		villatheme_include_folder( VIFEWC_ADMIN, 'VIFEWC_Admin_' );
		villatheme_include_folder( VIFEWC_COMPATIBLE, 'VIFEWC_Compatible_' );
		if (apply_filters('vifewc_frontend_callback',! is_admin() || wp_doing_ajax() )) {
			villatheme_include_folder( VIFEWC_FRONTEND, 'VIFEWC_Frontend_' );
		}
	}



}

new VIFEWC_INIT();