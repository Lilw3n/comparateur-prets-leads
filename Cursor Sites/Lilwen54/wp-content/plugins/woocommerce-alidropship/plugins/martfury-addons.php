<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

//Plugin Name: Martfury Addons
class VI_WOOCOMMERCE_ALIDROPSHIP_Plugins_Martfury_Addons {
	private static $brand_options;

	public function __construct() {
		if ( ! is_plugin_active( 'martfury-addons/martfury-addons.php' ) ) {
			return;
		}
		add_action( 'vi_wad_import_list_product_settings', [ $this, 'viwad_import_list_product_settings' ], 10, 4 );
		add_action( 'vi_wad_import_list_after_create_product', [ $this, 'viwad_import_list_after_create_product' ], 10, 3 );
	}

	/**
	 * Set tags when importing products
	 *
	 * @param $product_id
	 * @param $wc_product WC_Product
	 * @param $product_data
	 */
	public function viwad_import_list_after_create_product( $product_id, $wc_product, $product_data ) {
		if ( ! $product_id || ! $wc_product || empty( $product_data['brands'] ) ) {
			return;
		}
		$brands = $product_data['brands'];
		if ( ! is_array( $brands ) ) {
			return;
		}
		wp_set_post_terms( $product_id, $brands, 'product_brand', true );
	}

	public function viwad_import_list_product_settings( $product_id, $product, $override_product, $is_variable ) {
		if ( ! $product_id ) {
			return;
		}
		if ( self::$brand_options === null ) {
			self::$brand_options = VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Import_List::dropdown_categories( array(
				'name'  => 'vi_wad_product[{ali_product_id}][brands][]',
				'class' => 'vi-ui dropdown search fluid viwad-import-data-categories'
			), true, 'product_brand' );
		}
		if ( ! empty( self::$brand_options ) ) {
			?>
            <div class="field">
                <label><?php esc_html_e( 'Brands', 'woocommerce-alidropship' ) ?></label>
                <div class="ald-product-brands">
					<?php echo wp_kses( str_replace( '{ali_product_id}', esc_attr( $product_id ), self::$brand_options ), VI_WOOCOMMERCE_ALIDROPSHIP_DATA::filter_allowed_html() ); ?>
                </div>
            </div>
			<?php
		}
	}
}