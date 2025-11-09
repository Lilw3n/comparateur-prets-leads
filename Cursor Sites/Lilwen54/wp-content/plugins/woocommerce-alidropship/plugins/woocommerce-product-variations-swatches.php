<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * WooCommerce Orders Tracking
 */
if ( ! class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_Plugins_WooCommerce_Product_Variations_Swatches' ) ) {
	class VI_WOOCOMMERCE_ALIDROPSHIP_Plugins_WooCommerce_Product_Variations_Swatches {
		protected static $settings;

		public function __construct() {
			add_action( 'ald_create_custom_product_attributes', array( $this, 'add_to_variation_swatches_attribute_mapping' ) );
		}

		public function add_to_variation_swatches_attribute_mapping( $attr_data ) {
			if ( ! empty( $attr_data ) && is_array( $attr_data ) ) {
				$swatches_settings            = get_option( 'vi_woo_product_variation_swatches_params' );
				$current_names = $swatches_settings['custom_attribute_name'] ?? [];

				foreach ( $attr_data as $attribute ) {
					$name = $attribute->get_name();

					if ( in_array( $name, $current_names ) ) {
						continue;
					}

					$swatches_settings['custom_attribute_id'][]           = time();
					$swatches_settings['custom_attribute_name'][]         = $name;
					$swatches_settings['custom_attribute_type'][]         = 'button';
					$swatches_settings['custom_attribute_profiles'][]     = 'variationswatchesdesign';
					$swatches_settings['custom_attribute_loop_enable'][]  = false;
					$swatches_settings['custom_attribute_display_type'][] = 'vertical';
				}

				update_option( 'vi_woo_product_variation_swatches_params', $swatches_settings );
			}
		}
	}
}
