<?php
defined( 'ABSPATH' ) || exit;
$all_options = array(
	'overriding_keep_product'   => esc_html__( 'Keep Woo product', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_find_in_orders' => esc_html__( 'Find in unfulfilled orders', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_sku'            => esc_html__( 'Replace product SKU', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_title'          => esc_html__( 'Replace product title', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_images'         => esc_html__( 'Replace product image and gallery', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_description'    => esc_html__( 'Replace description and short description', 'tmds-woocommerce-temu-dropshipping' ),
	'overriding_hide'           => wp_kses_post( __( 'Save my choices and do not show these options again(you can still change this in <a target="_blank" href="admin.php?page=tmds#/override">plugin settings</a>).', 'tmds-woocommerce-temu-dropshipping' ) ),
);
?>
<div class="tmds-override-product-options-container tmds-hidden">
    <div class="tmds-override-product-overlay"></div>
    <div class="tmds-override-product-options-content">
        <div class="tmds-override-product-options-content-header">
            <h2>
                <span class="tmds-override-product-text-override">
                    <?php esc_html_e( 'Override: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="tmds-override-product-text-reimport">
                    <?php esc_html_e( 'Reimport: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="tmds-override-product-text-map-existing">
                    <?php esc_html_e( 'Import & map existing Woo product: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="tmds-override-product-title"> </span>
            </h2>
            <span class="tmds-override-product-options-close"> </span>
            <div class="vi-ui message warning tmds-override-product-remove-warning">
				<?php esc_html_e( 'Overridden product and all of its data(including variations, reviews, metadata...) will be deleted. Please make sure you had backed up those kinds of data before continuing!', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </div>
        </div>
		<?php
		if ( ! $settings->get_params( 'overriding_hide' ) ) {
			?>
            <div class="tmds-override-product-options-content-body tmds-override-product-options-content-body-option">
				<?php
				foreach ( $all_options as $option_key => $option_value ) {
					?>
                    <div class="tmds-override-product-options-content-body-row tmds-override-product-options-content-body-row-<?php echo esc_attr( $option_key ) ?>">
                        <div class="tmds-override-product-options-option-wrap">
                            <input type="checkbox" data-order_option="<?php echo esc_attr( $option_key ) ?>"
                                   value="1" <?php checked( 1, $settings->get_params( str_replace( '-', '_', $option_key ) ) ) ?>
                                   id="tmds-override-product-options-<?php echo esc_attr( $option_key ) ?>"
                                   class="override-product-options-option tmds-override-product-options-<?php echo esc_attr( $option_key ) ?>">
                            <label for="tmds-override-product-options-<?php echo esc_attr( $option_key ) ?>"><?php echo wp_kses_post( $option_value ) ?></label>
                        </div>
                    </div>
					<?php
				}
				?>
            </div>
			<?php
		}
		?>
        <div class="tmds-override-product-options-content-body tmds-override-product-options-content-body-override-old">
        </div>
        <div class="tmds-override-product-options-content-footer">
                    <span class="vi-ui button mini positive tmds-override-product-options-button-override"
                          data-override_product_id="">
                            <span class="tmds-override-product-text-override">
                                <?php esc_html_e( 'Override', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </span>
                        <span class="tmds-override-product-text-map-existing">
                            <?php esc_html_e( 'Import & Map', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
                        <span class="tmds-override-product-text-reimport">
                            <?php esc_html_e( 'Reimport', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
                        </span>
            <span class="vi-ui button mini tmds-override-product-options-button-cancel">
                <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </span>
        </div>
    </div>
    <div class="tmds-override-product-overlay"></div>
</div>
