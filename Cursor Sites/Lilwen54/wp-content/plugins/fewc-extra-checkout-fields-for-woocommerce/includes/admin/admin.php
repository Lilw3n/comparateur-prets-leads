<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VIFEWC_Admin_Admin {
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_filter(
			'plugin_action_links_fewc-extra-checkout-fields-for-woocommerce/fewc-extra-checkout-fields-for-woocommerce.php', array(
				$this,
				'settings_link'
			)
		);
	}

	public function settings_link( $links ) {
		$settings_link = sprintf( '<a href="%s" title="%s">%s</a>', esc_url( admin_url( 'admin.php?page=vifewc' ) ),
			esc_attr__( 'Settings', 'fewc-extra-checkout-fields-for-woocommerce' ),
			esc_html__( 'Settings', 'fewc-extra-checkout-fields-for-woocommerce' )
		);
		array_unshift( $links, $settings_link );

		return $links;
	}

	public function load_plugin_textdomain() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'fewc-extra-checkout-fields-for-woocommerce' );
		load_textdomain( 'fewc-extra-checkout-fields-for-woocommerce', VIFEWC_LANGUAGES . "fewc-extra-checkout-fields-for-woocommerce-$locale.mo" );
		load_plugin_textdomain( 'fewc-extra-checkout-fields-for-woocommerce', false, VIFEWC_LANGUAGES );
	}

	public function init() {
		load_plugin_textdomain( 'fewc-extra-checkout-fields-for-woocommerce' );
		$this->load_plugin_textdomain();
		if ( class_exists( 'VillaTheme_Support' ) ) {
			new VillaTheme_Support(
				array(
					'support'    => 'https://wordpress.org/support/plugin/fewc-extra-checkout-fields-for-woocommerce/',
					'docs'       => 'https://docs.villatheme.com/?item=fewc',
					'review'     => 'https://wordpress.org/support/plugin/fewc-extra-checkout-fields-for-woocommerce/reviews/?rate=5#rate-response',
					'pro_url'    => '',
					'css'        => VIFEWC_CSS,
					'image'      => VIFEWC_IMAGES,
					'slug'       => 'fewc-extra-checkout-fields-for-woocommerce',
					'menu_slug'  => 'vifewc',
					'survey_url' => 'https://script.google.com/macros/s/AKfycbxTiku5iNq_HXGC7Y2btqou8FbdMjWXnKEti7wy2aYRn8iY6GPX6fUHqY95NXLhWAxH/exec',
					'version'    => VIFEWC_VERSION
				)
			);
		}
	}
}