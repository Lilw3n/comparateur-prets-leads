<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Frontend_Product {
	private static $settings;
	private $video;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		if ( self::$settings->get_params( 'enable' ) ) {
			add_filter( 'woocommerce_product_tabs', array( $this, 'show_video_tab' ) );
		}
	}

	/**
	 * Filter WooCommerce tabs to show video tab when available and enabled
	 *
	 * @param $tabs
	 *
	 * @return mixed
	 */
	public function show_video_tab( $tabs ) {
		global $product;
		$product_video_tab = $product->get_meta( '_tmds_show_product_video_tab', true );
		if ( ! $product_video_tab ) {
			if ( ! self::$settings->get_params( 'product_video_tab' ) ) {
				return $tabs;
			}
		} else {
			if ( $product_video_tab === 'hide' ) {
				return $tabs;
			}
		}

		if ( $product ) {
			$this->video = $product->get_meta( '_tmds_product_video' );
			if ( $this->video ) {
				$tabs['tmds_video_tab'] = array(
					'title'    => esc_html__( 'Video', 'tmds-woocommerce-temu-dropshipping' ),
					'priority' => self::$settings->get_params( 'product_video_tab_priority' ),
					'callback' => array( $this, 'show_video' )
				);
			}
		}

		return $tabs;
	}

	/**
	 * Callback function of video tab
	 */
	public function show_video() {
		if ( self::$settings->get_params( 'product_video_full_tab' ) ) {
			echo do_shortcode( '[video src="' . $this->video . '" width=""]' );
		} else {
			echo do_shortcode( '[video src="' . $this->video . '"]' );
		}
	}
}