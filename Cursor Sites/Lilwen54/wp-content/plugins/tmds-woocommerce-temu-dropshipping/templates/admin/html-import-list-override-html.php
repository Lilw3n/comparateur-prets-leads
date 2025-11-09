<?php
defined( 'ABSPATH' ) || exit;
$current     = '';
$woo_product = wc_get_product( $woo_product );
if ( ! $is_simple ) {
	$woo_product_child = wc_get_product( $woo_product_id );
	if ( ! $woo_product_child ) {
		return;
	}
	$current     = [];
	$child_attrs = $woo_product_child->get_attributes();
	$attrs       = $woo_product->get_attributes();
	foreach ( $attrs as $attr_key => $option ) {
		$tmp = $child_attrs[ $attr_key ] ?? '';
		if ( ! $tmp ) {
			continue;
		}
		if ( substr( $attr_key, 0, 3 ) === 'pa_' ) {
			$attribute_id  = wc_attribute_taxonomy_id_by_name( $option['name'] );
			$attribute_obj = wc_get_attribute( $attribute_id );
			if ( $attribute_obj ) {
				$attribute_value = get_term_by( 'slug', $tmp, $attribute_obj->slug );
				if ( ! $attribute_value ) {
					$attribute_value = get_term_by( 'name', $tmp, $attribute_obj->slug );
				}
				if ( $attribute_value ) {
					$tmp = $attribute_value->name;
				}
			}
		}
		$current[] = $tmp;
	}
	$current = implode( ', ', $current );
}
?>
<tr class="tmds-override-order-container" data-replace_item_id="<?php echo esc_attr( $woo_product_id ) ?>">
    <td class="tmds-override-from-td">
        <div class="tmds-override-from">
			<?php
			if ( ! empty( $woo_product_child ) && $woo_product_child->get_image_id() ) {
				$image_src = wp_get_attachment_thumb_url( $woo_product_child->get_image_id() );
			} elseif ( $woo_product->get_image_id() ) {
				$image_src = wp_get_attachment_thumb_url( $woo_product->get_image_id() );
			} else {
				$image_src = wc_placeholder_img_src();
			}
			if ( $image_src ) {
				?>
                <div class="tmds-override-from-image">
                    <img src="<?php echo esc_url( $image_src ) ?>" width="30px" height="30px">
                </div>
				<?php
			}
			?>
            <div class="tmds-override-from-title">
				<?php
				echo wp_kses( $current ?: $woo_product->get_title(), TMDSPRO_DATA::filter_allowed_html() );
				?>
            </div>
        </div>
    </td>
    <td class="tmds-override-unfulfilled-items-count"><?php echo esc_html( $found_item_count ); ?></td>
    <td class="tmds-override-with-attributes">
		<?php
		if ( $is_simple ) {
			?>
            <select class="vi-ui fluid dropdown tmds-override-with">
                <option value="none">
					<?php esc_html_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </option>
                <option value="<?php echo esc_attr( $variations[0]['skuId'] ) ?>">
					<?php esc_html_e( 'Replace with new product', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </option>
            </select>
			<?php
		} else {
			?>
            <select class="vi-ui fluid dropdown tmds-override-with">
                <option value=""><?php esc_html_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
				<?php
				foreach ( $variations as $variation ) {
					if ( empty( $variation['skuId'] ) ) {
						continue;
					}
					$attribute = '';
					if ( ! empty( $variation['attributes'] ) ) {
						$attribute = [];
						foreach ( $variation['attributes'] as $attr_item ) {
							$attribute[] = $attr_item['title'];
						}
						$attribute = implode( ', ', $attribute );
					}
					if ( ! $attribute ) {
						$attribute = $variation['skuId'];
					}
					$selected = TMDSPRO_Admin_Import_List::is_attribute_value_equal( $current, $attribute ) ? 'selected' : '';
					?>
                    <option value="<?php echo esc_attr( $variation['skuId'] ) ?>" <?php echo esc_attr( $selected ) ?>><?php echo esc_html( $attribute ) ?></option>
					<?php
				}
				?>
            </select>
			<?php
		}
		?>
    </td>
</tr>