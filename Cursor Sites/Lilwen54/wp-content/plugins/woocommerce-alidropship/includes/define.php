<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_ADMIN', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "admin" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_FRONTEND', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "frontend" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_LANGUAGES', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "languages" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_TEMPLATES', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "templates" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_CLASS', VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES . "class" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_PLUGINS', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "plugins" . DIRECTORY_SEPARATOR );
if ( ! defined( 'VI_WOOCOMMERCE_ALIDROPSHIP_CACHE' ) ) {
	define( 'VI_WOOCOMMERCE_ALIDROPSHIP_CACHE', WP_CONTENT_DIR . '/cache/woo-alidropship/' );
}
/*Constants for AliExpress dropshipping API*/
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_APP_KEY', '29126830' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_PRODUCT_URL', 'https://api.villatheme.com/wp-json/aliexpress/get_products/v4' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_SHIPPING_URL', 'https://api.villatheme.com/wp-json/aliexpress/get_shipping/v2' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_SEARCH_PRODUCT', 'https://api.villatheme.com/wp-json/aliexpress/search' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_PLACE_ORDER_URL', 'https://api.villatheme.com/wp-json/aliexpress/create_order/v2' );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_ORDER_URL', 'https://api.villatheme.com/wp-json/aliexpress/get_orders/v4' );
$plugin_url = plugins_url( '', __FILE__ );
$plugin_url = str_replace( '/includes', '', $plugin_url );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS', $plugin_url . "/assets/" );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS_DIR', VI_WOOCOMMERCE_ALIDROPSHIP_DIR . "assets" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_PACKAGES', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS_DIR . "packages" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_CSS', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS . "css/" );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_CSS_DIR', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS_DIR . "css" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_JS', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS . "js/" );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_JS_DIR', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS_DIR . "js" . DIRECTORY_SEPARATOR );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_IMAGES', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS . "images/" );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_IMAGES_DIR', VI_WOOCOMMERCE_ALIDROPSHIP_ASSETS_DIR . "images/" );
define( 'VI_WOOCOMMERCE_ALIDROPSHIP_EXTENSION_VERSION', '1.0' );


/*Include functions file*/
$require_files=[
	VI_WOOCOMMERCE_ALIDROPSHIP_INCLUDES =>[
		'functions.php',
		'class-ald-post.php',
		'support.php',
		'check_update.php',
		'update.php',
		'wp-async-request.php',
		'wp-background-process.php',
		'data.php',
		'ali-product-query.php',
		'class-vi-wad-draft-product.php',
		'class-vi-wad-error-images-table.php',
		'class-vi-wad-background-download-images.php',
		'class-vi-wad-background-ali-api-get-product-data.php',
		'class-vi-wad-background-ali-api-get-order-data.php',
		'class-vi-wad-background-migrate-new-table.php',
		'setup-wizard.php',
	]
];
foreach ($require_files as $k => $v){
	foreach ($v as $file_name){
		$file = "{$k}{$file_name}";
		if ( file_exists( $file ) ) {
			require_once $file;
		}
	}
}

vi_include_folder( VI_WOOCOMMERCE_ALIDROPSHIP_ADMIN, 'VI_WOOCOMMERCE_ALIDROPSHIP_Admin_' );
vi_include_folder( VI_WOOCOMMERCE_ALIDROPSHIP_CLASS );
vi_include_folder( VI_WOOCOMMERCE_ALIDROPSHIP_FRONTEND, 'VI_WOOCOMMERCE_ALIDROPSHIP_Frontend_' );
vi_include_folder( VI_WOOCOMMERCE_ALIDROPSHIP_PLUGINS, 'VI_WOOCOMMERCE_ALIDROPSHIP_Plugins_' );
