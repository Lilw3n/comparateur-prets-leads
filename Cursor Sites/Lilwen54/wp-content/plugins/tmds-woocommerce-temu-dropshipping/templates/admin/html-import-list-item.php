<?php
defined( 'ABSPATH' ) || exit;
$allow_import      = true;
$is_edit_attribute = false;
if ( $is_variable && ! empty( $attributes ) ) {
	foreach ( $attributes as $attributes_key => $attribute ) {
		if ( ! empty( $attribute['set_variation'] ) ) {
			$is_edit_attribute = true;
			break;
		}
	}
}
if ( ! $is_edit_attribute ) {
	$is_variable = false;
}
?>

<div class="<?php echo esc_attr( implode( ' ', $accordion_class ) ) ?>"
     id="tmds-product-item-id-<?php echo esc_attr( $product_id ) ?>">
    <div class="title active">
        <input type="checkbox" class="tmds-accordion-bulk-item-check">
        <i class="dropdown icon tmds-accordion-title-icon"> </i>
        <div class="tmds-accordion-product-image-title-container">
            <div class="tmds-accordion-product-image-title">
				<?php
				if ( $image ) {
					// The displayed images are not yet saved to the WP media library — they are only shown for user selection.
					?>
                    <img src="<?php echo esc_url( $image ); // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage
					?>"
                         class="tmds-accordion-product-image">
					<?php
				} else {
					echo wp_kses( wc_placeholder_img( 'woocommerce_thumbnail', [ 'class' => 'tmds-accordion-product-image' ] ), TMDSPRO_DATA::filter_allowed_html() );
				}
				?>
                <div class="tmds-accordion-product-title-container">
                    <div class="tmds-accordion-product-title"
                         title="<?php echo esc_attr( $product->post_title ) ?>"><?php echo esc_html( $product->post_title ) ?></div>
					<?php
					if ( ! empty( $store_info['title'] ) ) {
						$store_name = $store_info['title'];
						if ( ! empty( $store_info['url'] ) ) {
							$store_info_url = TMDSPRO_DATA::get_temu_url( '', $store_info['url'] );
							$store_name     = '<a class="tmds-accordion-store-url" href="' . esc_attr( $store_info_url ) . '" target="_blank">' . $store_name . '</a>';
						}
						?>
                        <div>
							<?php
							esc_html_e( 'Store: ', 'tmds-woocommerce-temu-dropshipping' );
							echo wp_kses( $store_name, TMDSPRO_DATA::filter_allowed_html() );
							?>
                        </div>
						<?php
					}
					?>
                    <div class="tmds-accordion-product-date">
						<?php esc_html_e( 'Date: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        <span><?php echo esc_html( $product->post_date ) ?></span>
                    </div>
					<?php do_action( 'tmds_import_list_product_information', $product ); ?>
                </div>
            </div>
        </div>

        <div class="tmds-button-view-and-edit">
            <a href="<?php echo esc_url( TMDSPRO_DATA::get_temu_url( $product_id ) ); ?>"
               target="_blank" class="vi-ui button mini" rel="nofollow"
               title="<?php esc_attr_e( 'View this product on Temu', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                <i class="icon external"></i>
				<?php esc_html_e( 'View on Temu', 'tmds-woocommerce-temu-dropshipping' ) ?></a>
            <span class="vi-ui button mini negative tmds-button-remove"
                  data-product_id="<?php echo esc_attr( $product_id ) ?>"
                  title="<?php esc_attr_e( 'Remove this product from import list', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                <?php esc_html_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </span>

            <span class="vi-ui button mini positive <?php echo esc_attr( $override_product_id ? 'tmds-button-override' : ( $allow_import ? 'tmds-button-import' : 'disabled' ) ) ?>"
                  data-product_id="<?php echo esc_attr( $product_id ) ?>"
                  data-override_product_id="<?php echo esc_attr( $override_product_id ?: '' ) ?>"
                  data-override_title="<?php esc_attr_e( 'Import & Override', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                  data-import_title="<?php esc_attr_e( 'Import Now', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                  title="<?php echo $override_product_id ? '' : esc_attr__( 'Import this product to your WooCommerce store', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    <?php
                    if ( $override_product_id && $product_sku == TMDSPRO_Post::get_post_meta( $override_product_id, '_tmds_sku', true ) ) {
	                    esc_html_e( 'Reimport', 'tmds-woocommerce-temu-dropshipping' );
                    } elseif ( $override_product_id ) {
	                    esc_html_e( 'Import & Override', 'tmds-woocommerce-temu-dropshipping' );
                    } else {
	                    esc_html_e( 'Import Now', 'tmds-woocommerce-temu-dropshipping' );
                    }
                    ?>
            </span>
        </div>
    </div>

    <div class="content active">
		<?php
		if ( ! empty( $import_info ) ) {
			printf( '<div class="vi-ui warning message">%s <b>%s</b></div>',
				esc_html__( 'Price of the product applicable to the', 'tmds-woocommerce-temu-dropshipping' ), esc_html( implode( ' | ', $import_info ) ) );
		}
		if ( $override_product ) {
			$woo_override_product_title = wc_get_product( TMDSPRO_Post::get_post_meta( $override_product_id, '_tmds_woo_id', true ) )->get_title();
			?>
            <div class="vi-ui message tmds-override-product-message">
				<?php esc_html_e( 'This product will override: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                <strong class="tmds-override-product-product-title">
					<?php echo wp_kses_post( $override_product->post_title ) ?>
                    (<?php echo wp_kses_post( $woo_override_product_title ) ?>)
                </strong>
            </div>
			<?php
		}
		if ( $price_alert ) {
			?>
            <div class="vi-ui warning message">
				<?php esc_html_e( 'First-purchase discount may apply to this product, please check its price carefully or import with consideration.', 'tmds-woocommerce-temu-dropshipping' ); ?>
            </div>
			<?php
		}
		do_action( 'villatheme_' . TMDSPRO_DATA::$prefix . '_import_list_product_message', $product );
		?>
        <div class="tmds-message"></div>
        <form class="vi-ui form tmds-product-container" method="post">
            <div class="vi-ui attached tabular menu">
                <div class="item active" data-tab="<?php echo esc_attr( 'product-' . $key ) ?>">
					<?php esc_html_e( 'Product', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </div>
                <div class="item tmds-description-tab-menu"
                     data-tab="<?php echo esc_attr( 'description-' . $key ) ?>">
					<?php esc_html_e( 'Description', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </div>

				<?php
				if ( $specifications ) {
					?>
                    <div class="item tmds-specifications-tab-menu"
                         data-tab="<?php echo esc_attr( 'specifications-' . $key ) ?>">
						<?php esc_html_e( 'Specifications', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </div>
					<?php
				}
				if ( $is_edit_attribute ) {
					?>
                    <div class="item tmds-attributes-tab-menu"
                         data-tab="<?php echo esc_attr( 'attributes-' . $key ) ?>">
						<?php esc_html_e( 'Attributes', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </div>
					<?php
				}
				if ( $is_variable ) {
					?>
                    <div class="item tmds-variations-tab-menu"
                         data-tab="<?php echo esc_attr( 'variations-' . $key ) ?>">
						<?php
						printf( '%s(<span class="tmds-selected-variation-count">%s</span>)',
							esc_html__( 'Variations', 'tmds-woocommerce-temu-dropshipping' ),
							esc_html( count( $variations ) ) ); ?>
                    </div>
					<?php
				}

				if ( ! empty( $gallery ) ) {
					$gallery_count = $default_select_image ? count( $gallery ) : 0;
					?>
                    <div class="item tmds-lazy-load tmds-gallery-tab-menu"
                         data-tab="<?php echo esc_attr( 'gallery-' . $key ) ?>">
						<?php
						printf( '%s(<span class="tmds-selected-gallery-count">%s</span>)',
							esc_html__( 'Gallery', 'tmds-woocommerce-temu-dropshipping' ),
							esc_html( $gallery_count ) );
						?>
                    </div>
					<?php
				}
				if ( $video ) {
					?>
                    <div class="item tmds-lazy-load tmds-video-tab-menu"
                         data-tab="<?php echo esc_attr( 'video-' . $key ) ?>">
						<?php esc_html_e( 'Video', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </div>
					<?php
				}
				if ( $reviews && ! $override_product ) {
					?>
                    <div class="item tmds-lazy-load tmds-reviews-tab-menu"
                         data-tab="<?php echo esc_attr( 'reviews-' . $key ) ?>">
						<?php
						printf( '%s(<span class="tmds-selected-review-count"></span>)',
							esc_html__( 'Reviews', 'tmds-woocommerce-temu-dropshipping' ) );
						?>
                    </div>
					<?php
				}
				?>
            </div>
            <div class="vi-ui bottom attached tab segment active tmds-product-tab"
                 data-tab="<?php echo esc_attr( 'product-' . $key ) ?>">
                <div class="field">
                    <div class="fields">
                        <div class="three wide field">
                            <div class="tmds-product-image <?php echo( $default_select_image ? 'tmds-selected-item' : '' ); ?>">
                                <span class="tmds-selected-item-icon-check"> </span>
								<?php
								if ( $image ) {
									// The displayed images are not yet saved to the WP media library — they are only shown for user selection.
									?>
                                    <img src="<?php echo esc_url( $image ) // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                                         class="tmds-import-data-image">
                                    <input type="hidden"
                                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][image]' ) ?>"
                                           value="<?php echo esc_attr( $default_select_image ? $image : '' ) ?>">
									<?php
								} else {
									echo wp_kses( wc_placeholder_img( 'woocommerce_thumbnail', [ 'class' => 'tmds-import-data-image' ] ), TMDSPRO_DATA::filter_allowed_html() );
									?>
                                    <input type="hidden"
                                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][image]' ) ?>"
                                           value="">
									<?php
								}
								?>

                            </div>
                        </div>
                        <div class="thirteen wide field">
                            <div class="field">
                                <label><?php esc_html_e( 'Product title', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                <input type="text" value="<?php echo esc_attr( $product->post_title ) ?>"
                                       class="tmds-import-data-title"
                                       name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][title]' ) ?>">
                            </div>
                            <div class="field tmds-import-data-sku-status-visibility">
                                <div class="equal width fields">
                                    <div class="field">
                                        <label><?php esc_html_e( 'Sku', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <input type="text" value="<?php echo esc_attr( $product_sku ) ?>"
                                               class="tmds-import-data-sku"
                                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][sku]' ) ?>">
                                    </div>
                                    <div class="field">
                                        <label><?php esc_html_e( 'Product status', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][status]' ) ?>"
                                                class="tmds-import-data-status vi-ui fluid dropdown">
											<?php
											foreach ( $product_status_options as $value => $text ) {
												printf( "<option value='%s' %s>%s</option>", esc_attr( $value ), selected( $product_status, $value, false ), esc_html( $text ) );
											}
											?>
                                        </select>

                                    </div>
                                    <div class="field">
                                        <label><?php esc_html_e( 'Catalog visibility', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][catalog_visibility]' ) ?>"
                                                class="tmds-import-data-catalog-visibility vi-ui fluid dropdown">
											<?php
											foreach ( $catalog_visibility_options as $value => $text ) {
												printf( "<option value='%s' %s>%s</option>", esc_attr( $value ), selected( $catalog_visibility, $value, false ), esc_html( $text ) );
											}
											?>
                                        </select>
                                    </div>
                                </div>
                            </div>
							<?php
							if ( ! $is_variable ) {
								TMDSPRO_Admin_Import_List::simple_product_price_field_html( $key, $manage_stock, $variations, $use_different_currency, $currency, $decimals, $product_id, $wc_currency_symbol, $wc_decimals );
							}
							?>
                            <div class="field">
                                <div class="equal width fields">
                                    <div class="field">
                                        <label><?php esc_html_e( 'Categories', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][categories][]' ) ?>"
                                                multiple class="vi-ui dropdown search tmds-import-data-categories">
											<?php
											if ( ! empty( $category_options ) ) {
												foreach ( $category_options as $cat_id => $cat_name ) {
													printf( "<option value='%s' %s>%s</option>",
														esc_attr( $cat_id ),
														selected( in_array( $cat_id, $product_categories ), 1, false ),
														esc_html( $cat_name ) );
												}
											}
											?>
                                        </select>
                                    </div>
                                    <div class="field">
                                        <label><?php esc_html_e( 'Tags', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][tags][]' ) ?>"
                                                class="vi-ui dropdown search tmds-import-data-tags" multiple>
											<?php
											if ( ! empty( $tags_options ) ) {
												foreach ( $tags_options as $tag_id => $tag ) {
													printf( "<option value='%s' %s>%s</option>",
														esc_attr( $tag_id ),
														selected( in_array( $tag_id, $product_tags ), 1, false ),
														esc_html( $tag ) );
												}
											}
											?>
                                        </select>
                                    </div>
                                    <div class="field">
                                        <label><?php esc_html_e( 'Shipping class', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                        <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][shipping_class]' ) ?>"
                                                class="vi-ui dropdown search tmds-import-data-shipping-class">
                                            <option value=""><?php esc_html_e( 'No shipping class', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
											<?php
											if ( is_array( $shipping_class_options ) && ! empty( $shipping_class_options ) ) {
												foreach ( $shipping_class_options as $shipping_class_id => $shipping_class_name ) {
													$selected = $product_shipping_class == $shipping_class_id ? 'selected' : '';
													printf( "<option value='%s' %s>%s</option>", esc_attr( $shipping_class_id ), esc_attr( $selected ), esc_html( $shipping_class_name ) );
												}
											}
											?>
                                        </select>
                                    </div>
                                </div>
                            </div>
							<?php
							do_action( 'tmds_import_list_product_settings', $product_id, $product, $override_product, $is_variable );
							if ( ! $override_product ) {
								?>
                                <div class="field">
                                    <label><?php esc_html_e( 'Override existing Woo product', 'tmds-woocommerce-temu-dropshipping' ); ?></label>
									<?php
									TMDSPRO_DATA::villatheme_render_field( 'tmds_product[' . $product_id . '][override_woo_id]', [
										'type'              => 'select2',
										'custom_attributes' => [
											'data-type_select2' => 'product'
										],
										'id'                => 'tmds-override-woo-id-' . $product_id,
										'class'             => 'tmds-override-woo-id',
										'value'             => TMDSPRO_Post::get_post_meta( $product_id, '_tmds_map_woo_id', true ),
									] );
									?>
                                </div>
								<?php
							}
							?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vi-ui bottom attached tab segment tmds-description-tab"
                 data-tab="<?php echo esc_attr( 'description-' . $key ) ?>">
				<?php
				$short_description   = TMDSPRO_Post::get_post_meta( $product_id, '_' . ( TMDSPRO_DATA::$prefix ) . '_short_description', true );
				$description         = TMDSPRO_Post::get_post_meta( $product_id, '_' . ( TMDSPRO_DATA::$prefix ) . '_description', true );
				$description_setting = TMDSPRO_DATA::get_instance()->get_params( 'product_description' );
				switch ( $description_setting ) {
					case 'none':
						$description = '';
						break;
					case 'item_specifics':
						$description = $short_description;
						break;
					case 'item_specifics_and_description':
						$description = $short_description . $description;
						break;
				}
				$description = apply_filters( "villatheme_" . ( TMDSPRO_DATA::$prefix ) . "_import_product_description", $description, $product_id );
				wp_editor( $description, 'tmds-product-description-' . $product_id,
					[
						'default_editor' => 'html',
						'media_buttons'  => false,
						'tinymce'        => true,
						'quicktags'      => true,
						'editor_class'   => 'tmds-import-data-description',
						'textarea_name'  => 'tmds_product[' . esc_attr( $product_id ) . '][description]',
					]
				);
				?>
            </div>
			<?php
			if ( $is_edit_attribute ) {
				?>
                <div class="vi-ui bottom attached tab segment tmds-attributes-tab"
                     data-tab="<?php echo esc_attr( 'attributes-' . $key ) ?>"
                     data-product_id="<?php echo esc_attr( $product_id ) ?>">
                    <table class="vi-ui celled table">
                        <thead>
                        <tr>
                            <th class="tmds-attributes-attribute-col-position">
								<?php esc_html_e( 'Position', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </th>
                            <th class="tmds-attributes-attribute-col-name">
								<?php esc_html_e( 'Name', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </th>
                            <th class="tmds-attributes-attribute-col-slug">
								<?php esc_html_e( 'Slug', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </th>
                            <th class="tmds-attributes-attribute-col-values">
								<?php esc_html_e( 'Values', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </th>
                            <th class="tmds-attributes-attribute-col-action">
								<?php esc_html_e( 'Action', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </th>
                        </tr>
                        </thead>
                        <tbody class="ui sortable">
						<?php
						$position = 1;
						foreach ( $attributes as $attributes_key => $attribute ) {
							if ( empty( $attribute['set_variation'] ) ) {
								continue;
							}
							$attribute_name = isset( $attribute['name'] ) ? $attribute['name'] : TMDSPRO_DATA::get_attribute_name_by_slug( $attribute['slug'] );
							?>
                            <tr class="tmds-attributes-attribute-row">
                                <td><?php echo esc_html( $position ) ?></td>
                                <td>
                                    <input type="text" class="tmds-attributes-attribute-name"
                                           value="<?php echo esc_attr( $attribute_name ) ?>"
                                           data-attribute_name="<?php echo esc_attr( $attribute_name ) ?>"
                                           name="<?php echo esc_attr( "tmds_product[{$product_id}][attributes][{$attributes_key}][name]" ) ?>">
                                </td>
                                <td>
                                    <span class="tmds-attributes-attribute-slug"
                                          data-attribute_slug="<?php echo esc_attr( $attribute['slug'] ?? '' ) ?>">
                                        <?php echo esc_html( $attribute['slug'] ?? '' ) ?>
                                    </span>
                                </td>
                                <td>
                                    <div class="tmds-attributes-attribute-values">
										<?php
										foreach ( $attribute['values'] as $values_k => $values_v ) {
											$tmp_values_v_id = $values_v['id'] ?? $values_k;
											?>
                                            <input type="text" class="tmds-attributes-attribute-value"
                                                   value="<?php echo esc_attr( $tmp_values_v = $values_v['title'] ?? $tmp_values_v_id ) ?>"
                                                   data-attribute_value="<?php echo esc_attr( $tmp_values_v ) ?>"
                                                   data-attribute_value_id="<?php echo esc_attr( $values_v['id'] ?? '' ) ?>"
                                                   name="<?php echo esc_attr( "tmds_product[{$product_id}][attributes][{$attributes_key}][values][{$tmp_values_v_id}]" ) ?>">
											<?php
										}
										?>
                                    </div>
                                </td>
                                <td>
                                    <span class="vi-ui button mini green icon tmds-attributes-button-save tmds-hidden"
                                          title="<?php esc_attr_e( 'Save', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                            <i class="icon save"> </i>
                                    </span>
                                    <span class="vi-ui button mini negative icon tmds-attributes-attribute-remove"
                                          title="<?php esc_attr_e( 'Remove this attribute', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                            <i class="icon trash"> </i>
                                    </span>
                                </td>
                            </tr>
							<?php
							$position ++;
						}
						?>
                        </tbody>
                    </table>
                    <div class="tmds-button-split-container tmds-attribite-button-action-container">
                        <span class="vi-ui button mini green tmds-button-save-attribute tmds-hidden">
                            <i class="icon save"> </i>
                            <?php esc_html_e( 'Save attributes', 'tmds-woocommerce-temu-dropshipping' ); ?>
                        </span>
                    </div>
                </div>
				<?php
			}
			if ( $is_variable ) {
				?>
                <div class="vi-ui bottom attached tab segment tmds-variations-tab"
                     data-tab="<?php echo esc_attr( 'variations-' . $key ) ?>"
                     data-product_id="<?php echo esc_attr( $product_id ) ?>">
					<?php
					if ( $is_edit_attribute ) {
						?>
                        <div class="vi-ui positive message">
                            <div class="header">
                                <p><?php esc_html_e( 'You can edit product attributes on Attributes tab', 'tmds-woocommerce-temu-dropshipping' ) ?></p>
                            </div>
                        </div>
						<?php
					}
					if ( ! empty( $variations ) ) {
						?>
                        <table class="form-table tmds-variations-table tmds-table-fix-head tmds-variation-table-attributes-count-<?php echo esc_attr( count( $attributes ) ) ?>">
                        </table>
						<?php
					}
					?>
                    <div class="tmds-button-split-container"></div>
                </div>
				<?php
			}
			$default_gallery = $gallery;
			$gallery         = array_unique( array_merge( $gallery, $desc_images, $variation_images ) );
			if ( ! empty( $gallery ) ) {
				?>
                <div class="vi-ui bottom attached tab segment tmds-product-gallery tmds-lazy-load-tab-data"
                     data-tab="gallery-<?php echo esc_attr( $key ) ?>">
                    <div class="segment ui-sortable">
						<?php
						if ( $default_select_image ) {
							foreach ( $gallery as $gallery_k => $gallery_v ) {
								if ( in_array( $gallery_v, $default_gallery ) ) {
									$item_class = '';
									if ( $gallery_k === 0 ) {
										$item_class = 'tmds-is-product-image';
									}
									?>
                                    <div class="tmds-product-gallery-item tmds-selected-item <?php echo esc_attr( $item_class ) ?>">
                                        <span class="tmds-selected-item-icon-check"> </span>
                                        <i class="tmds-set-product-image star icon"> </i>
                                        <i class="tmds-set-variation-image hand outline up icon"
                                           title="<?php esc_attr_e( 'Set image for selected variation(s)', 'tmds-woocommerce-temu-dropshipping' ) ?>"> </i>
										<?php //The displayed images represent loading states and are stored directly within the plugin folder. ?>
                                        <img src="<?php echo esc_url( TMDSPRO_IMAGES . 'loading.gif' )  // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                                             data-image_src="<?php echo esc_url( $gallery_v ) ?>"
                                             class="tmds-product-gallery-image">
                                        <input type="hidden"
                                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][gallery][]' ) ?>"
                                               value="<?php echo esc_attr( $gallery_v ) ?>">
                                    </div>
									<?php
								} else {
									?>
                                    <div class="tmds-product-gallery-item">
                                        <span class="tmds-selected-item-icon-check"> </span>
                                        <i class="tmds-set-product-image star icon"> </i>
                                        <i class="tmds-set-variation-image hand outline up icon"
                                           title="<?php esc_attr_e( 'Set image for selected variation(s)', 'tmds-woocommerce-temu-dropshipping' ) ?>"> </i>
										<?php //The displayed images represent loading states and are stored directly within the plugin folder. ?>
                                        <img src="<?php echo esc_url( TMDSPRO_IMAGES . 'loading.gif' ) // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                                             data-image_src="<?php echo esc_url( $gallery_v ) ?>"
                                             class="tmds-product-gallery-image">
                                        <input type="hidden"
                                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][gallery][]' ) ?>"
                                               value="">
                                    </div>
									<?php
								}
							}
						} else {
							foreach ( $gallery as $gallery_k => $gallery_v ) {
								?>
                                <div class="tmds-product-gallery-item">
                                    <span class="tmds-selected-item-icon-check"> </span>
                                    <i class="tmds-set-product-image star icon"> </i>
                                    <i class="tmds-set-variation-image hand outline up icon"
                                       title="<?php esc_attr_e( 'Set image for selected variation(s)', 'tmds-woocommerce-temu-dropshipping' ) ?>"> </i>
									<?php //The displayed images represent loading states and are stored directly within the plugin folder. ?>
                                    <img src="<?php echo esc_url( TMDSPRO_IMAGES . 'loading.gif' ) // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                                         data-image_src="<?php echo esc_url( $gallery_v ) ?>"
                                         class="tmds-product-gallery-image">
                                    <input type="hidden"
                                           name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][gallery][]' ) ?>"
                                           value="">
                                </div>
								<?php
							}
						}
						?>
                    </div>
                </div>
				<?php
			}
			if ( ! empty( $specifications ) ) {
				?>
                <div class="vi-ui bottom attached tab segment tmds-specifications-tab"
                     data-tab_name="specifications"
                     data-tab="<?php echo esc_attr( 'specifications-' . $key ) ?>"
                     data-product_id="<?php echo esc_attr( $product_id ) ?>">
                    <table class="vi-ui celled table">
                        <thead>
                        <tr>
                            <th class="tmds-attributes-attribute-col-name"><?php esc_html_e( 'Name', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th class="tmds-attributes-attribute-col-values"><?php esc_html_e( 'Values', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th class="tmds-attributes-attribute-col-action"><?php esc_html_e( 'Action', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                        </tr>
                        </thead>
                        <tbody class="ui sortable tmds-attributes-table-body">
						<?php
						foreach ( $specifications as $attributes_key => $attribute ) {
							if ( ! isset( $attribute['attrName'] ) || ! isset( $attribute['attrValue'] ) ) {
								continue;
							}
							?>
                            <tr class="tmds-attributes-attribute-row tmds-specification-attribute-row">
                                <td>
                                    <input type="text"
                                           class="tmds-attributes-attribute-name"
                                           value="<?php echo esc_attr( $attribute['attrName'] ) ?>"
                                           data-attribute_name="<?php echo esc_attr( $attribute['attrName'] ) ?>"
                                           name="<?php echo esc_attr( "tmds_product[{$product_id}][specifications][{$attributes_key}][attrName]" ) ?>">
                                </td>
                                <td><input type="text"
                                           class="tmds-attributes-attribute-name"
                                           value="<?php echo esc_attr( $attribute['attrValue'] ) ?>"
                                           data-attribute_name="<?php echo esc_attr( $attribute['attrValue'] ) ?>"
                                           name="<?php echo esc_attr( "tmds_product[{$product_id}][specifications][{$attributes_key}][attrValue]" ) ?>">
                                </td>
                                <td>
                                    <span class="vi-ui button mini negative icon tmds-specification-attribute-remove"
                                          title="<?php esc_attr_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                        <i class="icon trash"> </i>
                                    </span>
                                </td>
                            </tr>
							<?php
						}
						?>
                        </tbody>
                    </table>
                </div>
				<?php
			}
			if ( ! empty( $video ) ) {
				$video_tab = TMDSPRO_DATA::get_instance()->get_params( 'product_video_tab' ) ? esc_html__( 'Show', 'tmds-woocommerce-temu-dropshipping' ) : esc_html__( 'Hide', 'tmds-woocommerce-temu-dropshipping' );
				?>
                <div class="vi-ui bottom attached tab segment tmds-video-tab tmds-lazy-load-tab-data"
                     data-tab_name="video"
                     data-tab="<?php echo esc_attr( 'video-' . $key ) ?>"
                     data-product_id="<?php echo esc_attr( $product_id ) ?>">
                    <table class="form-table">
                        <tbody>
                        <tr>
                            <th><?php esc_html_e( 'Product video tab', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <td>
                                <select name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][product_video_tab]' ) ?>"
                                        class="vi-ui dropdown tmds-product_video_tab">
                                    <option value=""><?php echo wp_kses_post( sprintf( esc_html__( 'Global setting', 'tmds-woocommerce-temu-dropshipping' ) . '(%s)', $video_tab ) ); ?></option>
                                    <option value="show"><?php esc_html_e( 'Show', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
                                    <option value="hide"><?php esc_html_e( 'Hide', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <br>
                                <div class="tmds-video-wrap">
									<?php
									$video_url = $video[0]['videoUrl'] ?? '';
									echo do_shortcode( '[video src="' . esc_url( $video_url ) . '"]' );

									?>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
				<?php
			}
			if ( ! empty( $reviews ) && ! $override_product ) {
				?>
                <div class="vi-ui bottom attached tab segment tmds-reviews-tab"
                     data-tab_name="reviews"
                     data-tab="<?php echo esc_attr( 'reviews-' . $key ) ?>"
                     data-product_id="<?php echo esc_attr( $product_id ) ?>">
                </div>
				<?php
			}
			?>
        </form>
    </div>
    <div class="tmds-product-overlay tmds-hidden"></div>
</div>

