<?php
defined( 'ABSPATH' ) || exit;
?>
    <thead>
    <tr>
        <td width="1%"></td>
        <td class="tmds-fix-width">
            <input type="checkbox" checked class="<?php echo esc_attr( 'tmds-variations-bulk-enable tmds-variations-bulk-enable-' . $key ) ?>">
        </td>
        <td class="tmds-fix-width">
            <input type="checkbox" checked class="tmds-variations-bulk-select-image">
        </td>
        <th class="tmds-fix-width"><?php esc_html_e( 'Default variation', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th><?php esc_html_e( 'Sku', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
		<?php
		if ( is_array( $parent ) && ! empty( $parent ) ) {
			foreach ( $parent as $parent_k => $parent_v ) {
				if ( empty( $attributes[ $parent_k ]['set_variation'] ) ) {
					continue;
				}
				?>
                <th class="tmds-attribute-filter-list-container">
					<?php
					$attribute_name = isset( $attributes[ $parent_k ]['name'] ) ? $attributes[ $parent_k ]['name'] : TMDSPRO_Admin_Import_List::$settings::get_attribute_name_by_slug( $parent_v );
					echo esc_html( $attribute_name );
					$attribute_values = isset( $attributes[ $parent_k ]['values'] ) ? $attributes[ $parent_k ]['values'] : [];
					if ( ! empty( $attribute_values ) ) {
						?>
                        <ul class="tmds-attribute-filter-list" data-attribute_slug="<?php echo esc_attr( $parent_v ) ?>">
							<?php
							foreach ( $attribute_values as $attribute_value ) {
								?>
                                <li class="tmds-attribute-filter-item" title="<?php echo esc_attr( $attribute_value['title'] ?? '' ) ?>"
                                    data-attribute_slug="<?php echo esc_attr( $parent_v ) ?>" data-attribute_value="<?php echo esc_attr( trim( $attribute_value['id'] ?? $attribute_value['title'] ?? '' ) ) ?>">
									<?php echo esc_html( $attribute_value['title'] ?? '' ) ?>
                                </li>
								<?php
							}
							?>
                        </ul>
						<?php
					}
					?>
                </th>
				<?php
			}
		}
		?>
        <th>
			<?php esc_html_e( 'Cost', 'tmds-woocommerce-temu-dropshipping' ) ?>
        </th>
        <th class="tmds-sale-price-col">
			<?php esc_html_e( 'Sale price', 'tmds-woocommerce-temu-dropshipping' ) ?>
            <div class="tmds-set-price" data-set_price="sale_price">
				<?php esc_html_e( 'Set price', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </div>
        </th>
        <th class="tmds-regular-price-col">
			<?php esc_html_e( 'Regular price', 'tmds-woocommerce-temu-dropshipping' ) ?>
            <div class="tmds-set-price ?>" data-set_price="regular_price">
				<?php esc_html_e( 'Set price', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </div>
        </th>
		<?php
		if ( $manage_stock ) {
			?>
            <th class="tmds-inventory-col"><?php esc_html_e( 'Inventory', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
			<?php
		}
		?>
    </tr>
    </thead>
    <tbody>
	<?php
	$split_variations = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_split_variations', true );
	foreach ( $variations as $variation_key => $variation ) {
		$variation_image         = $variation['image'] ?? '';
		$inventory               = min( floatval( $variation['stock'] ), floatval( $variation['limit_qty'] ) );
		$variation_sale_price    = $variation['sale_price'] ? TMDSPRO_Admin_Import_List::$settings::string_to_float( $variation['sale_price'] ) : '';
		$variation_regular_price = TMDSPRO_Admin_Import_List::$settings::string_to_float( $variation['regular_price'] );
		if ( ! empty( $variation['is_on_sale'] ) && $variation_sale_price ) {
			$import_price      = $variation_sale_price;
			$import_price_html = $variation['sale_price_html'] ?? '';
		} else {
			$import_price      = $variation_regular_price;
			$import_price_html = $variation['regular_price_html'] ?? '';
		}
		$price     = TMDSPRO_Price::process_exchange_price( $import_price, $currency );
		$cost_html = wc_price( $price );
		if ( $use_different_currency ) {
			$cost_html = $import_price_html ? "{$import_price_html}({$cost_html})" : wc_price( $import_price, [
					'currency'     => $currency,
					'decimals'     => $decimals,
					'price_format' => '%1$s&nbsp;%2$s'
				] ) . '(' . $cost_html . ')';
		}
		$sale_price            = TMDSPRO_Price::process_price( $price, true );
		$regular_price         = TMDSPRO_Price::process_price( $price );
		$image_src             = $variation_image ? $variation_image : wc_placeholder_img_src();
		$checked               = '';
		$variation_image_class = array( 'tmds-variation-image' );
		if ( empty( $split_variations ) || in_array( $variation['skuId'], $split_variations ) ) {
			$checked                 = 'checked';
			$variation_image_class[] = 'tmds-selected-item';
			TMDSPRO_Admin_Import_List::$variations_count ++;
		}
		?>
        <tr class="tmds-product-variation-row">
            <td class="tmds-product-variation-row-number"><?php echo esc_html( $variation_key + 1 ) ?></td>
            <td>
                <input type="checkbox" <?php echo esc_attr( $checked ) ?>
                       class="<?php echo esc_attr( implode( ' ', array(
					       'tmds-variation-enable',
					       'tmds-variation-enable-' . $key,
					       'tmds-variation-enable-' . $key . '-' . $variation_key
				       ) ) ) ?>">
            </td>
            <td>
                <div class="<?php echo esc_attr( implode( ' ', $variation_image_class ) ) ?>">
                    <span class="tmds-selected-item-icon-check"> </span>
					<?php // The displayed images are not yet saved to the WP media library — they are only shown for user selection. ?>
                    <img data-image_src="<?php echo esc_url( $image_src ) // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                         src="<?php echo esc_url( $image_src ) ?>"
                         class="tmds-import-data-variation-image">
                    <input type="hidden" value="<?php echo esc_attr( $variation_image ? $variation_image : '' ) ?>"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][image]' ) ?>">
                </div>
            </td>
            <td><input type="radio" value="<?php echo esc_attr( $variation['skuId'] ) ?>"
                       class="tmds-import-data-variation-default"
                       name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][default_variation]' ) ?>">
            </td>
            <td>
                <div>
                    <input type="text" value="<?php echo esc_attr( $variation['skuId'] ) ?>"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][sku]' ) ?>"
                           class="tmds-import-data-variation-sku">
                    <input type="hidden" value="<?php echo esc_attr( $variation['skuId'] ) ?>"
                           class="tmds-import-data-variation-skuId"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][skuId]' ) ?>">

                </div>
            </td>
			<?php
			if ( is_array( $parent ) && ! empty( $parent ) ) {
				foreach ( $parent as $parent_k => $parent_v ) {
					if ( empty( $attributes[ $parent_k ]['set_variation'] ) ) {
						continue;
					}
					$tmp_title = isset( $variation['attributes'][ $parent_k ]['title'] ) ? $variation['attributes'][ $parent_k ]['title'] : '';
					$tmp_id    = isset( $variation['attributes'][ $parent_k ]['id'] ) ? $variation['attributes'][ $parent_k ]['id'] : '';
					?>
                    <td>
                        <input type="hidden" data-attribute_slug="<?php echo esc_attr( $parent_v ) ?>"
                               data-attribute_value="<?php echo esc_attr( $tmp_id ) ?>"
                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][attributes][' . $parent_k . '][' . $tmp_id . ']' ) ?>"
                               class="tmds-import-data-variation-attribute"
                               value="<?php echo esc_attr( $tmp_title ) ?>">
						<?php echo wp_kses_post( $tmp_title ); ?>
                    </td>
					<?php
				}
			}
			?>
            <td>
                <div class="tmds-price-field">
                        <span class="tmds-import-data-variation-cost">
                            <?php echo wp_kses( $cost_html, TMDSPRO_DATA::filter_allowed_html() ) ?>
                        </span>
                </div>
            </td>
            <td>
                <div class="vi-ui left labeled input">
                    <label for="amount"
                           class="vi-ui label"><?php echo esc_html( $wc_currency_symbol ) ?></label>
                    <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                           value="<?php echo esc_attr( is_numeric( $sale_price ) ? $sale_price : '' ) ?>" data-allow_empty="1"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][sale_price]' ) ?>"
                           class="tmds-import-data-variation-sale-price">
                </div>
            </td>
            <td>
                <div class="vi-ui left labeled input">
                    <label for="amount"
                           class="vi-ui label"><?php echo esc_html( $wc_currency_symbol ) ?></label>
                    <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                           value="<?php echo esc_attr( $regular_price ) ?>"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][regular_price]' ) ?>"
                           class="tmds-import-data-variation-regular-price">
                </div>
            </td>
			<?php
			if ( $manage_stock ) {
				?>
                <td>
                    <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                           value="<?php echo esc_attr( $inventory ) ?>"
                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][' . $variation_key . '][stock]' ) ?>"
                           class="tmds-import-data-variation-inventory">
                </td>
				<?php
			}
			?>
        </tr>
		<?php
	}
	?>
    </tbody>
<?php