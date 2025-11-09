<?php
defined( 'ABSPATH' ) || exit;
?>
    <div class="tmds-modal-popup-container tmds-hidden">
        <div class="tmds-overlay"></div>
        <div class="tmds-modal-popup-content tmds-modal-popup-content-set-price">
            <div class="tmds-modal-popup-header">
                <h2><?php esc_html_e( 'Set price', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
                <span class="tmds-modal-popup-close"> </span>
            </div>
            <div class="tmds-modal-popup-content-body">
                <div class="tmds-modal-popup-content-body-row">
                    <div class="tmds-set-price-action-wrap">
                        <label for="tmds-set-price-action"><?php esc_html_e( 'Action', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                        <select id="tmds-set-price-action"
                                class="tmds-set-price-action">
                            <option value="set_new_value"><?php esc_html_e( 'Set to this value', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
                            <option value="increase_by_fixed_value">
								<?php esc_html_e( 'Increase by fixed value', 'tmds-woocommerce-temu-dropshipping' );
								echo esc_html( '(' . get_woocommerce_currency_symbol() . ')' ) ?>
                            </option>
                            <option value="increase_by_percentage"><?php esc_html_e( 'Increase by percentage(%)', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
                        </select>
                    </div>
                    <div class="tmds-set-price-amount-wrap">
                        <label for="tmds-set-price-amount"><?php esc_html_e( 'Amount', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                        <input type="text"
                               id="tmds-set-price-amount"
                               class="tmds-set-price-amount">
                    </div>
                </div>
            </div>
            <div class="tmds-modal-popup-content-footer">
                        <span class="button button-primary tmds-set-price-button-set">
                            <?php esc_html_e( 'Set', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
                <span class="button tmds-bulk-action-button-cancel tmds-set-price-button-cancel">
                            <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
            </div>
        </div>
        <div class="tmds-modal-popup-content tmds-modal-popup-content-remove-attribute">
            <div class="tmds-modal-popup-header">
                <h2><?php esc_html_e( 'Please select default value to import after this attribute is removed', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
                <span class="tmds-modal-popup-close"> </span>
            </div>
            <div class="tmds-modal-popup-content-body">
                <div class="tmds-modal-popup-content-body-row tmds-modal-popup-select-attribute">
                </div>
            </div>
        </div>
        <div class="tmds-modal-popup-content tmds-modal-popup-content-set-shipping_class">
            <div class="tmds-modal-popup-header">
                <h2><?php esc_html_e( 'Bulk set product shipping class', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
                <span class="tmds-modal-popup-close"> </span>
            </div>
            <div class="tmds-modal-popup-content-body">
                <div class="tmds-modal-popup-content-body-row tmds-modal-popup-set-shipping_class">
                    <div class="tmds-modal-popup-set-shipping_class-select-wrap">
                        <select name="bulk_set_shipping_class"
                                class="vi-ui dropdown fluid search tmds-modal-popup-set-shipping_class-select">
                            <option value=""><?php esc_html_e( 'No shipping class', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
							<?php
							if ( is_array( $shipping_class_options ) && ! empty( $shipping_class_options ) ) {
								foreach ( $shipping_class_options as $shipping_class_id => $shipping_class_name ) {
									printf( "<option value='%s' >%s</option>", esc_attr( $shipping_class_id ), esc_html( $shipping_class_name ) );
								}
							}
							?>
                        </select>
                    </div>
                </div>
            </div>
            <div class="tmds-modal-popup-content-footer">
                <span class="button button-primary tmds-set-shipping_class-button-set">
	                <?php esc_html_e( 'Set', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="button vi-ui mini tmds-bulk-action-button-cancel tmds-set-shipping_class-button-cancel">
	                <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
            </div>
        </div>
        <div class="tmds-modal-popup-content tmds-modal-popup-content-set-categories">
            <div class="tmds-modal-popup-header">
                <h2><?php esc_html_e( 'Bulk set product categories', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
                <span class="tmds-modal-popup-close"> </span>
            </div>
            <div class="tmds-modal-popup-content-body">
                <div class="tmds-modal-popup-content-body-row tmds-modal-popup-set-categories">
                    <div class="tmds-modal-popup-set-categories-select-wrap">
                        <select name="bulk_set_categories"
                                class="vi-ui dropdown fluid search tmds-modal-popup-set-categories-select"
                                multiple>
							<?php
							if ( ! empty( $category_options ) ) {
								foreach ( $category_options as $cat_id => $cat_name ) {
									printf( "<option value='%s'>%s</option>", esc_attr( $cat_id ), esc_html( $cat_name ) );
								}
							}
							?>
                        </select>
                        <span class="vi-ui black button mini tmds-modal-popup-set-categories-clear">
	                        <?php esc_html_e( 'Clear selected', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
                    </div>
                </div>
            </div>
            <div class="tmds-modal-popup-content-footer">
                    <span class="button button-primary tmds-set-categories-button-add"
                          title="<?php esc_attr_e( 'Add selected and keep existing categories', 'tmds-woocommerce-temu-dropshipping' ) ?>">
	                    <?php esc_html_e( 'Add', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </span>
                <span class="button button-primary tmds-set-categories-button-set"
                      title="<?php esc_attr_e( 'Remove existing categories and add selected', 'tmds-woocommerce-temu-dropshipping' ) ?>">
	                <?php esc_html_e( 'Set', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="button tmds-bulk-action-button-cancel tmds-set-categories-button-cancel">
	                <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
            </div>
        </div>
        <div class="tmds-modal-popup-content tmds-modal-popup-content-set-tags">
            <div class="tmds-modal-popup-header">
                <h2><?php esc_html_e( 'Bulk set product tags', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
                <span class="tmds-modal-popup-close"> </span>
            </div>
            <div class="tmds-modal-popup-content-body">
                <div class="tmds-modal-popup-content-body-row tmds-modal-popup-set-tags">
                    <div class="tmds-modal-popup-set-tags-select-wrap">
                        <select name="bulk_set_tags"
                                class="vi-ui dropdown fluid search tmds-modal-popup-set-tags-select" multiple>
							<?php
							if ( ! empty( $tags_options ) ) {
								foreach ( $tags_options as $tag ) {
									printf( "<option value='%s'>%s</option>", esc_attr( $tag ), esc_html( $tag ) );
								}
							}
							?>
                        </select>
                        <span class="vi-ui black button mini tmds-modal-popup-set-tags-clear">
	                        <?php esc_html_e( 'Clear selected', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        </span>
                    </div>
                </div>
            </div>
            <div class="tmds-modal-popup-content-footer">
                    <span class="button button-primary tmds-set-tags-button-add"
                          title="<?php esc_attr_e( 'Add selected and keep existing tags', 'tmds-woocommerce-temu-dropshipping' ) ?>">
	                    <?php esc_html_e( 'Add', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </span>
                <span class="button button-primary tmds-set-tags-button-set"
                      title="<?php esc_attr_e( 'Remove existing tags and add selected', 'tmds-woocommerce-temu-dropshipping' ) ?>">
	                <?php esc_html_e( 'Set', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
                <span class="button tmds-bulk-action-button-cancel tmds-set-tags-button-cancel">
	                <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </span>
            </div>
        </div>
        <div class="tmds-saving-overlay tmds-hidden"></div>
    </div>
<?php