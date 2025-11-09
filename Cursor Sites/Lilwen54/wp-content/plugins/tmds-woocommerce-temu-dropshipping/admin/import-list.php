<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Import_List {
	public static $settings, $prefix;
	public static $variations_count, $reviews_count;
	public static $process_image;

	public function __construct() {
		self::$variations_count = self::$reviews_count = 0;
		self::$settings         = TMDSPRO_DATA::get_instance();
		self::$prefix           = self::$settings::$prefix;
		add_action( 'init', array( $this, 'background_process' ) );
		add_action( 'admin_init', array( $this, 'move_queued_images' ) );
		add_action( 'admin_init', array( $this, 'empty_import_list' ) );
		add_action( 'admin_head', array( $this, 'menu_product_count' ), 999 );
		add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		add_action( 'wc_marketplace_suggestions_products_empty_state', array( $this, 'marketplace_suggestions_products_empty_state' ) );
		add_filter( 'tmds_admin_ajax_events', [ $this, 'ajax_events' ], 10, 2 );
	}

	public function ajax_events( $events, $prefix ) {
		if ( ! is_array( $events ) ) {
			$events = [];
		}
		$events += [
			$prefix . '_override'              => array(
				'function' => 'override',
				'class'    => $this,
			),
			$prefix . '_import'                => array(
				'function' => 'import',
				'class'    => $this,
			),
			$prefix . '_remove'                => array(
				'function' => 'remove',
				'class'    => $this,
			),
			$prefix . '_save_attributes'       => array(
				'function' => 'save_attributes',
				'class'    => $this,
			),
			$prefix . '_remove_attribute'      => array(
				'function' => 'remove_attribute',
				'class'    => $this,
			),
			$prefix . '_load_product_reviews'  => array(
				'function' => 'load_product_reviews',
				'class'    => $this,
			),
			$prefix . '_load_variations_table' => array(
				'function' => 'load_variations_table',
				'class'    => $this,
			),
			$prefix . '_split_product'         => array(
				'function' => 'split_product',
				'class'    => $this,
			),
		];

		return $events;
	}

	public static function override() {
		$prefix   = self::$settings::$prefix;
		$response = array(
			'status' => 'error',
		);
		$action   = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		TMDSPRO_DATA::villatheme_set_time_limit();
		if ( ! isset( $_POST['form_data']['z_check_max_input_vars'] ) ) {
			/*z_check_max_input_vars is the last key of POST data. If it does not exist in $form_data after using parse_str(), some data may also be missing*/
			$response['message'] = esc_html__( 'PHP max_input_vars is too low, please increase it in php.ini', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$data = isset( $_POST['form_data']['tmds_product'] ) ? (array) self::$settings::json_decode( wc_clean( wp_unslash( $_POST['form_data']['tmds_product'] ) ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( empty( $data ) ) {
			$response['message'] = esc_html__( 'Please select product to override', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$update_settings       = isset( $_POST['update_settings'] ) ? wc_clean( wp_unslash( $_POST['update_settings'] ) ) : [];//phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$override_product_id   = isset( $_POST['override_product_id'] ) ? absint( $_POST['override_product_id'] ) : '';
		$override_woo_id       = isset( $_POST['override_woo_id'] ) ? absint( $_POST['override_woo_id'] ) : '';
		$override_options      = [
			'overriding_title'       => $update_settings['overriding_title'] ?? '',
			'overriding_images'      => $update_settings['overriding_images'] ?? '',
			'overriding_description' => $update_settings['overriding_description'] ?? '',
			'overriding_sku'         => $update_settings['overriding_sku'] ?? '',
		];
		$override_keep_product = $update_settings['overriding_keep_product'] ?? '';
		if ( ! empty( $update_settings ) ) {
			$args = self::$settings->get_params();
			foreach ( $update_settings as $override_option_k => $override_option_v ) {
				$args[ $override_option_k ] = $override_option_v;
			}
			update_option( 'tmds_params', $args, 'no' );
		} elseif ( self::$settings->get_params( 'overriding_hide' ) ) {
			foreach ( $override_options as $override_option_k => $override_option_v ) {
				$override_options[ $override_option_k ] = self::$settings->get_params( $override_option_k );
			}
		}
		if ( ! $override_product_id && ! $override_woo_id ) {
			$response['message'] = esc_html__( 'Product is deleted from your store', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$selected         = isset( $_POST['selected'] ) ? wc_clean( wp_unslash( $_POST['selected'] ) ) : [];//phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$data             = isset( $_POST['form_data']['tmds_product'] ) ? wc_clean( wp_unslash( $_POST['form_data']['tmds_product'] ) ) : [];//phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product_draft_id = array_keys( $data )[0];
		if ( ! $product_draft_id ) {
			$response['message'] = esc_html__( 'Invalid data', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		if ( empty( $selected[ $product_draft_id ] ) ) {
			$response['message'] = esc_html__( 'Please select at least 1 variation to import this product.', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$product_data = array_values( $data )[0];
		if ( $override_product_id ) {
			$woo_product_id = TMDSPRO_Post::get_post_meta( $override_product_id, '_tmds_woo_id', true );
		} else {
			$woo_product_id      = $override_woo_id;
			$override_product_id = TMDSPRO_Post::get_post_id_by_woo_id( $woo_product_id, [ 'publish', 'override' ] );
		}
		if ( ! self::$settings->get_params( 'auto_generate_unique_sku' ) && self::$settings::sku_exists( $product_data['sku'] )
		     && $product_data['sku'] != get_post_meta( $woo_product_id, '_sku', true )
		) {
			$response['message'] = esc_html__( 'Sku exists.', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		if ( TMDSPRO_Post::get_post_id_by_temu_id( TMDSPRO_Post::get_post_meta( $product_draft_id, '_tmds_sku', true ), array( 'publish' ) ) ) {
			$response['message'] = esc_html__( 'This product has already been imported', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}

		if ( ! $override_product_id ||
		     TMDSPRO_Post::get_post_meta( $override_product_id, '_tmds_sku', true ) == TMDSPRO_Post::get_post_meta( $product_draft_id, '_tmds_sku', true ) ) {
			$override_keep_product = '1';
		}
		$product_data['description'] = isset( $_POST['form_data']['tmds_product'][ $product_draft_id ]['description'] )
			? wp_kses_post( wp_unslash( $_POST['form_data']['tmds_product'][ $product_draft_id ]['description'] ) ) : '';

		$check_orders = isset( $_POST['check_orders'] ) ? sanitize_text_field( wp_unslash( $_POST['check_orders'] ) ) : '';
		$found_items  = isset( $_POST['found_items'] ) ? wc_clean( wp_unslash( $_POST['found_items'] ) ) : [];//phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$attributes   = self::get_product_attributes( $product_draft_id );

		$woo_product = wc_get_product( $woo_product_id );
		if ( $woo_product ) {
			if ( ! $check_orders && ( ! empty( $update_settings['overriding_find_in_orders'] ) || $override_keep_product ) ) {
				$is_simple = false;
				if ( ! is_array( $attributes ) || empty( $attributes )
				     || ( isset( $product_data['variations'] ) && count( $selected[ $product_draft_id ] ) === 1
				          && self::$settings->get_params( 'simple_if_one_variation' ) )
				) {
					$is_simple = true;
				}
				if ( $is_simple ) {
					$variations = array( array_values( $product_data['variations'] )[0] );
				} else {
					if ( isset( $product_data['variations'] ) ) {
						$variations = array_values( $product_data['variations'] );
					} else {
						$variations = self::get_product_variations( $product_draft_id );
					}
				}
				$replace_order_html = '';
				if ( $woo_product->is_type( 'variable' ) && ! $is_simple ) {
					$woo_product_children = $woo_product->get_children();
					if ( ! empty( $woo_product_children ) ) {
						$replace_order_html_t = [];
						foreach ( $woo_product_children as $woo_product_child ) {
							$found_item = self::query_order_item_meta( [ 'order_item_type' => 'line_item' ], [ 'meta_key' => '_variation_id', 'meta_value' => $woo_product_child ] );// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key,WordPress.DB.SlowDBQuery.slow_db_query_meta_value

							self::skip_item_with_dropship_order_id( $found_item );

							if ( $override_keep_product || ! empty( $found_item ) ) {
								$found_items[ $woo_product_child ]          = $found_item;
								$found_item_count                           = count( $found_item );
								$tmp_html                                   = wc_get_template_html( 'admin/html-import-list-override-html.php',
									array(
										'woo_product'      => $woo_product,
										'woo_product_id'   => $woo_product_child,
										'variations'       => $variations,
										'found_item_count' => $found_item_count,
										'is_simple'        => $is_simple,
									),
									'',
									TMDSPRO_TEMPLATES );
								$replace_order_html_t[ $woo_product_child ] = array(
									'found_item' => $found_item_count,
									'html'       => $tmp_html
								);
								$replace_order_html                         .= $tmp_html;
							}
						}
						if ( ! empty( $replace_order_html_t ) ) {
							array_multisort( array_column( $replace_order_html_t, 'found_item' ), SORT_DESC, $replace_order_html_t );
							$replace_order_html = implode( '', array_column( $replace_order_html_t, 'html' ) );
						}
					}
				} else {
					$found_item = self::query_order_item_meta( array( 'order_item_type' => 'line_item' ), array( 'meta_key'   => '_product_id', 'meta_value' => $woo_product_id, ) );//phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key , WordPress.DB.SlowDBQuery.slow_db_query_meta_value

					self::skip_item_with_dropship_order_id( $found_item );
					if ( ! empty( $found_item ) ) {
						$found_items[ $woo_product_id ] = $found_item;

						$replace_order_html = wc_get_template_html( 'admin/html-import-list-override-html.php',
							array(
								'woo_product'      => $woo_product,
								'woo_product_id'   => $woo_product_id,
								'variations'       => $variations,
								'found_item_count' => count( $found_item ),
								'is_simple'        => $is_simple,
							),
							'',
							TMDSPRO_TEMPLATES );
					}
				}

				if ( ! empty( $found_items ) ) {
					$message = '';
					if ( $override_keep_product ) {
						$message = sprintf( '<div class="vi-ui message warning">%s</div>',
							__( 'By selecting a replacement, a new variation will be created by modifying the respective overridden variation. Overridden variations with no replacement selected will be deleted', 'tmds-woocommerce-temu-dropshipping' ) );
					}
					ob_start();
					?>
                    <table class="vi-ui celled table">
                        <thead>
                        <tr>
                            <th><?php esc_html_e( 'Overridden items', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th width="1%"><?php esc_html_e( 'Found in unfulfilled orders', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Replacement', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                        </tr>
                        </thead>
                        <tbody>
						<?php echo wp_kses( $replace_order_html, self::$settings::filter_allowed_html() ) ?>
                        </tbody>
                    </table>
					<?php
					$message  .= ob_get_clean();
					$response = wp_parse_args( [
						'status'             => 'checked',
						'message'            => '',
						'found_items'        => $found_items,
						'replace_order_html' => $message,
					], $response );
					wp_send_json( $response );
				}
			}
		} else {
			$response['message'] = esc_html__( 'Overridden product does not exists', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$variations_attributes = [];
		$import_info           = TMDSPRO_Post::get_post_meta( $product_draft_id, "_{$prefix}_import_info", true );
		$currency              = $import_info['currency_code'] ?? $import_info['temu_locale_settings']['currency']['code'] ?? get_woocommerce_currency();
		$replace_items         = isset( $_POST['replace_items'] ) ? wc_clean( wp_unslash( $_POST['replace_items'] ) ) : [];//phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( isset( $product_data['variations'] ) ) {
			$variations = array_values( $product_data['variations'] );
			if ( ! empty( $variations ) ) {
				$var_default = isset( $product_data['default_variation'] ) ? $product_data['default_variation'] : '';

				foreach ( $variations as $variations_k => $variations_v ) {
					$variations_attribute = isset( $variations_v['attributes'] ) ? $variations_v['attributes'] : [];
					if ( $var_default === $variations_v['skuId'] ) {
						$product_data['variation_default'] = $variations_attribute;
					}

					if ( is_array( $variations_attribute ) && ! empty( $variations_attribute ) ) {
						foreach ( $variations_attribute as $variations_attribute_k => $variations_attribute_v ) {
							if ( ! isset( $variations_attributes[ $variations_attribute_k ] ) ) {
								$variations_attributes[ $variations_attribute_k ] = [ $variations_attribute_v ];
							} elseif ( ! in_array( $variations_attribute_v, $variations_attributes[ $variations_attribute_k ] ) ) {
								$variations_attributes[ $variations_attribute_k ][] = $variations_attribute_v;
							}
							if ( is_array( $variations_attribute_v ) ) {
								foreach ( $variations_attribute_v as $k => $v ) {
									$variations_attribute[ $variations_attribute_k ] = [
										'id'    => $k,
										'title' => $v,
									];
								}
							}
						}
					}
					$variations[ $variations_k ]['attributes'] = $variations_attribute;
				}

				if ( is_array( $attributes ) && ! empty( $attributes ) ) {
					foreach ( $attributes as $attributes_k => $attributes_v ) {
						if ( empty( $attributes_v['set_variation'] ) ) {
							unset( $attributes[ $attributes_k ] );
						}
						if ( ! empty( $variations_attributes[ $attributes_k ] ) ) {
							$tmp = [];
							foreach ( $variations_attributes[ $attributes_k ] as $variations_attribute_v ) {
								if ( is_array( $variations_attribute_v ) ) {
									foreach ( $variations_attribute_v as $k => $v ) {
										$tmp[] = [
											'id'    => $k,
											'title' => $v,
										];
									}
								}
							}
							$attributes[ $attributes_k ]['values'] = $tmp;
						}
					}
				}
			}
		} else {
			$variations = self::get_product_variations( $product_draft_id );
			foreach ( $variations as $variations_k => $variations_v ) {
				$variation_sale_price                         = self::$settings::string_to_float( $variations_v['sale_price'] );
				$variation_regular_price                      = self::$settings::string_to_float( $variations_v['regular_price'] );
				$price                                        = $variation_sale_price ?: $variation_regular_price;
				$price                                        = TMDSPRO_Price::process_exchange_price( $price, $currency );
				$variations[ $variations_k ]['regular_price'] = TMDSPRO_Price::process_price( $price );
				$variations[ $variations_k ]['sale_price']    = TMDSPRO_Price::process_price( $price, true );
			}
			if ( is_array( $attributes ) && ! empty( $attributes ) ) {
				foreach ( $attributes as $attributes_k => $attributes_v ) {
					if ( empty( $attributes_v['set_variation'] ) ) {
						unset( $attributes[ $attributes_k ] );
					}
				}
			}
		}
		if ( ! empty( $variations ) ) {
			if ( empty( $override_options['overriding_title'] ) ) {
				$product_data['title'] = $woo_product->get_title( 'edit' );
			}
			if ( empty( $override_options['overriding_images'] ) ) {
				$product_data['old_product_image']   = $woo_product->get_image_id();
				$product_data['old_product_gallery'] = $woo_product->get_gallery_image_ids();
			}
			if ( empty( $override_options['overriding_description'] ) ) {
				$product_data['short_description'] = $woo_product->get_short_description();
				$product_data['description']       = $woo_product->get_description();
			}
			if ( isset( $product_data['gallery'] ) ) {
				$product_data['gallery'] = array_values( array_filter( $product_data['gallery'] ) );
				if ( $product_data['image'] ) {
					$product_image_key = array_search( $product_data['image'], $product_data['gallery'] );
					if ( $product_image_key !== false ) {
						unset( $product_data['gallery'][ $product_image_key ] );
						$product_data['gallery'] = array_values( $product_data['gallery'] );
					}
				}
			} else {
				$product_data['gallery'] = [];
			}

			$variation_images                        = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_variation_images', true );
			$product_data['variation_images']        = $variation_images;
			$product_data['attributes']              = $attributes;
			$product_data['variations']              = $variations;
			$product_data['parent_id']               = $product_draft_id;
			$product_data[ $prefix . '_product_id' ] = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_sku', true );
			$disable_background_process              = self::$settings->get_params( 'disable_background_process' );
			$override_sku                            = ! empty( $override_options['overriding_sku'] );

			if ( $override_keep_product ) {
				$is_simple = false;
				if ( ! is_array( $attributes ) || empty( $attributes ) || ( count( $variations ) === 1 && self::$settings->get_params( 'simple_if_one_variation' ) ) ) {
					$is_simple = true;
				}

				$woo_product->set_status( $product_data['status'] );
				if ( ! empty( $product_data['sku'] ) && $override_sku ) {
					try {
						$woo_product->set_sku( wc_product_generate_unique_sku( $woo_product_id, $product_data['sku'] ) );
					} catch ( \WC_Data_Exception $e ) {
					}
				}

				if ( ! empty( $override_options['override_title'] ) && $product_data['title'] ) {
					$woo_product->set_name( $product_data['title'] );
				}

				$dispatch = false;
				if ( ! empty( $override_options['overriding_images'] ) ) {
					if ( $product_data['image'] ) {
						$thumb_id = TMDSPRO_File::download_image( $image_id, $product_data['image'], $woo_product_id );
						if ( ! is_wp_error( $thumb_id ) ) {
							$woo_product->set_image_id( $thumb_id );
						}
					}
					if ( ! empty( $woo_product->get_meta( '_' . $prefix . '_product_video' ) ) ) {
						$video_url = '';
						$video     = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_video', true );
						if ( is_array( $video ) && ! empty( $video ) ) {
							$video_url = $video[0]['videoUrl'] ?? '';
						}
						if ( $video_url ) {
							$woo_product->update_meta_data( '_' . $prefix . '_product_video', $video_url );
						}
					}
					$woo_product->set_gallery_image_ids( [] );
					self::process_gallery_images( $product_data['gallery'], $disable_background_process, $woo_product_id, $product_draft_id, $dispatch );
				}

				if ( ! empty( $override_options['overriding_description'] ) ) {
					$woo_product->set_description( $product_data['description'] );
					self::process_description_images( $product_data['description'], $disable_background_process, $woo_product_id, $product_draft_id, $dispatch );
				}

				/*Set product tag*/
				if ( ! empty( $product_data['tags'] ) && is_array( $product_data['tags'] ) ) {
					$woo_product->set_tag_ids( $product_data['tags'] );
				}

				/*Set product categories*/
				if ( ! empty( $product_data['categories'] ) && is_array( $product_data['categories'] ) ) {
					$woo_product->set_category_ids( $product_data['categories'] );
				}

				/*Set product shipping class*/
				if ( ! empty( $product_data['shipping_class'] ) && get_term_by( 'id', $product_data['shipping_class'], 'product_shipping_class' ) ) {
					$woo_product->set_shipping_class_id( $product_data['shipping_class'] );
				}
				$woo_product->update_meta_data( '_' . $prefix . '_product_id', $product_data[ $prefix . '_product_id' ] );
				$woo_product->set_catalog_visibility( $product_data['catalog_visibility'] ?: 'visible' );
				$manage_stock = self::$settings->get_params( 'manage_stock' );
				$manage_stock = $manage_stock ? 'yes' : 'no';
				if ( $is_simple ) {
					if ( ! empty( $variations[0]['skuId'] ) ) {
						$woo_product->update_meta_data( '_' . $prefix . '_variation_id', $variations[0]['skuId'] );
					}
					$woo_product->save_meta_data();
					if ( $woo_product->is_type( 'variable' ) ) {
						$woo_product->set_attributes( [] );
						$woo_product->save();
						$children = $woo_product->get_children();
						if ( ! empty( $children ) ) {
							foreach ( $children as $variation_id ) {
								wp_delete_post( $variation_id, true );
							}
						}
						wp_set_object_terms( $woo_product_id, 'simple', 'product_type' );
					}

					$sale_price    = isset( $variations[0]['sale_price'] ) ? floatval( $variations[0]['sale_price'] ) : '';
					$regular_price = isset( $variations[0]['regular_price'] ) ? floatval( $variations[0]['regular_price'] ) : '';
					$price         = $regular_price;
					if ( $sale_price && $sale_price > 0 && $regular_price && $sale_price < $regular_price ) {
						$price = $sale_price;
					} else {
						$sale_price = '';
					}

					$woo_product->set_regular_price( $regular_price );
					$woo_product->set_sale_price( $sale_price );
					$woo_product->set_price( $price );
					$woo_product->set_manage_stock( $manage_stock );
					$woo_product->set_stock_status( 'instock' );
					if ( ! empty( $variations[0]['stock'] ) && $manage_stock === 'yes' ) {
						$woo_product->set_stock_quantity( absint( $variations[0]['stock'] ) );
					}
					$woo_product->save();
					wp_set_object_terms( $woo_product_id, 'simple', 'product_type' );
					if ( $dispatch ) {
						self::$process_image->save()->dispatch();
					}
				} else {
					$attr_additional = [];
					$attr_data       = self::create_product_attributes( $attributes, $default_attr, $attributes_info );
					if ( ! empty( $attr_data ) ) {
						$attr_data = array_merge( $attr_data, $attr_additional );
						$woo_product->set_attributes( $attr_data );
						if ( $default_attr ) {
							$woo_product->set_default_attributes( $default_attr );
						}
					} elseif ( ! empty( $attr_additional ) ) {
						$woo_product->set_attributes( $attr_additional );
					}
					$woo_product->save_meta_data();
					$woo_product->save();
					wp_set_object_terms( $woo_product_id, 'variable', 'product_type' );
					$children = [];
					if ( $woo_product->is_type( 'variable' ) ) {
						$children = $woo_product->get_children();
					}
					$use_global_attributes = self::$settings->get_params( 'use_global_attributes' );
					if ( ! empty( $children ) ) {
						$skuIdArray = array_column( $variations, 'skuId' );
						foreach ( $children as $variation_id ) {
							if ( ! empty( $replace_items[ $variation_id ] ) ) {
								$variations_key = array_search( $replace_items[ $variation_id ], $skuIdArray );
								if ( $variations_key !== false ) {
									$variation = new \WC_Product_Variation( $variation_id );
									if ( $variation ) {
										$product_data['variations'][ $variations_key ]['variation_id'] = $variation_id;
										if ( 1 != $override_options['override_images'] && ! $variation->get_image_id() ) {
											$product_data['variations'][ $variations_key ]['image'] = '';
										}
										$product_variation = $variations[ $variations_key ];
										$stock_quantity    = isset( $product_variation['stock'] ) ? absint( $product_variation['stock'] ) : 0;
										$v_attributes      = [];
										if ( $use_global_attributes ) {
											foreach ( $product_variation['attributes'] as $option_k => $attr ) {
												$attribute_id  = wc_attribute_taxonomy_id_by_name( $option_k );
												$attribute_obj = wc_get_attribute( $attribute_id );
												if ( $attribute_obj ) {
													$attribute_value = self::get_term_by_name( $attr, $attribute_obj->slug );
													if ( $attribute_value ) {
														$v_attributes[ strtolower( rawurlencode( $attribute_obj->slug ) ) ] = $attribute_value->slug;
													}
												}
											}
										} else {
											foreach ( $product_variation['attributes'] as $option_k => $attr ) {
												$v_attributes[ strtolower( rawurlencode( $option_k ) ) ] = $attr;
											}
										}
										$variation->set_attributes( $v_attributes );
										$fields = array(
											'regular_price'  => $product_variation['regular_price'],
											'price'          => $product_variation['regular_price'],
											'sale_price'     => '',
											'manage_stock'   => $manage_stock,
											'stock_status'   => 'instock',
											'stock_quantity' => $stock_quantity,
										);
										if ( $override_sku && ! empty( $product_variation['sku'] ) ) {
											$fields['sku'] = wc_product_generate_unique_sku( $variation_id, $product_variation['sku'] );
										}

										if ( isset( $product_variation['sale_price'] ) && $product_variation['sale_price']
										     && $product_variation['sale_price'] < $product_variation['regular_price']
										) {
											$fields['sale_price'] = $product_variation['sale_price'];
											$fields['price']      = $product_variation['sale_price'];
										}

										foreach ( $fields as $field => $value ) {
											$variation->{"set_$field"}( wc_clean( $value ) );
										}
										$variation->update_meta_data( '_' . $prefix . '_variation_id', $product_variation['skuId'] );
										$variation->save();
									}
								} else {
									wp_delete_post( $variation_id, true );
								}
							} else {
								wp_delete_post( $variation_id, true );
							}
						}
					}
					/*Create product variation*/
					self::import_product_variation( $woo_product_id, $product_data, $attributes_info, $dispatch, $disable_background_process );
				}

				TMDSPRO_Post::update_post( [ 'ID' => $product_draft_id, 'post_status' => 'publish' ] );

				TMDSPRO_Post::update_post_meta( $product_draft_id, '_' . $prefix . '_woo_id', $woo_product_id );

				if ( $override_product_id ) {
					TMDSPRO_Post::delete_post( $override_product_id );
				}
				$response['status']      = 'success';
				$response['product_id']  = $woo_product_id;
				$response['button_html'] = self::get_button_view_edit_html( $woo_product_id );
			} else {
				$product_data['replace_items'] = $replace_items;
				$product_data['replace_title'] = $override_options['override_title'];
				$product_data['found_items']   = $found_items;
				$woo_product_id_new            = self::import_product( $product_data );

				$response = array(
					'status'     => 'error',
					'message'    => '',
					'product_id' => '',
				);

				if ( ! is_wp_error( $woo_product_id_new ) ) {
					if ( $override_product_id ) {
						TMDSPRO_Post::delete_post( $override_product_id );
					}
					wp_delete_post( $woo_product_id );
					$response['status']      = 'success';
					$response['product_id']  = $woo_product_id_new;
					$response['button_html'] = self::get_button_view_edit_html( $woo_product_id_new );
				} else {
					$response['message'] = $woo_product_id_new->get_error_messages();
				}
			}
		} else {
			$response['message'] = esc_html__( 'Please select at least 1 variation to import this product.', 'tmds-woocommerce-temu-dropshipping' );
		}
		wp_send_json( $response );
	}

	/**
	 * @param $items
	 *
	 * @throws Exception
	 */
	public static function skip_item_with_dropship_order_id( &$items ) {
		foreach ( $items as $key => $item ) {
			if ( wc_get_order_item_meta( $item['order_item_id'], '_' . self::$settings::$prefix . '_order_id', true ) ) {
				unset( $items[ $key ] );
			}
		}
		$items = array_values( $items );
	}

	/**
	 * @param array $args1 $key=>$value are key and value of woocommerce_order_items table
	 * @param array $args2 $key=>$value are key and value of woocommerce_order_itemmeta table
	 *
	 * @return array|null|object
	 */
	protected static function query_order_item_meta( $args1 = [], $args2 = [] ) {
		global $wpdb;

		$sql = "SELECT * FROM {$wpdb->prefix}woocommerce_order_items as woocommerce_order_items 
                JOIN {$wpdb->prefix}woocommerce_order_itemmeta as woocommerce_order_itemmeta 
                WHERE woocommerce_order_items.order_item_id=woocommerce_order_itemmeta.order_item_id";

		$args = [];

		if ( ! empty( $args1 ) ) {
			foreach ( $args1 as $key => $value ) {
				if ( is_array( $value ) ) {
					$sql .= " AND woocommerce_order_items.{$key} IN (" . implode( ', ', array_fill( 0, count( $value ), '%s' ) ) . ")";
					foreach ( $value as $v ) {
						$args[] = $v;
					}
				} else {
					$sql    .= " AND woocommerce_order_items.{$key}='%s'";
					$args[] = $value;
				}
			}
		}

		if ( ! empty( $args2 ) ) {
			foreach ( $args2 as $key => $value ) {
				if ( is_array( $value ) ) {
					$sql .= " AND woocommerce_order_itemmeta.{$key} IN (" . implode( ', ', array_fill( 0, count( $value ), '%s' ) ) . ")";
					foreach ( $value as $v ) {
						$args[] = $v;
					}
				} else {
					$sql    .= " AND woocommerce_order_itemmeta.{$key}='%s'";
					$args[] = $value;
				}
			}
		}

		$query      = $wpdb->prepare( $sql, $args );//phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$line_items = $wpdb->get_results( $query, ARRAY_A );//phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery , WordPress.DB.DirectDatabaseQuery.NoCaching , WordPress.DB.PreparedSQL.NotPrepared

		return $line_items;
	}

	public static function import() {
		$response = array(
			'status'         => 'error',
			'woo_product_id' => '',
			'button_html'    => '',
		);
		$action   = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		TMDSPRO_DATA::villatheme_set_time_limit();
		if ( ! isset( $_POST['form_data']['z_check_max_input_vars'] ) ) {
			/*z_check_max_input_vars is the last key of POST data. If it does not exist in $form_data after using parse_str(), some data may also be missing*/
			$response['message'] = esc_html__( 'PHP max_input_vars is too low, please increase it in php.ini', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$data = isset( $_POST['form_data']['tmds_product'] ) ? (array) self::$settings::json_decode( wc_clean( wp_unslash( $_POST['form_data']['tmds_product'] ) ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( empty( $data ) ) {
			$response['message'] = esc_html__( 'Please select product to import', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}
		$selected                    = isset( $_POST['selected'] ) ? array_map( 'TMDSPRO_DATA::json_decode', (array) self::$settings::json_decode( wc_clean( wp_unslash( $_POST['selected'] ) ) ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product_data                = array_values( $data )[0];
		$product_draft_id            = array_keys( $data )[0];
		$product_data['description'] = isset( $_POST['form_data'][ 'description_' . $product_draft_id ] ) ? wp_kses_post( wp_unslash( $_POST['form_data'][ 'description_' . $product_draft_id ] ) ) : '';

		if ( ! isset( $selected[ $product_draft_id ] ) || ! is_array( $selected[ $product_draft_id ] ) || empty( $selected[ $product_draft_id ] ) ) {
			$response['message'] = esc_html__( 'Please select at least 1 variation to import this product.', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}

		if ( ! $product_draft_id || (!self::$settings->get_params( 'auto_generate_unique_sku' ) && self::$settings::sku_exists( $product_data['sku'] )) ) {
			$response['message'] = esc_html__( 'Sku exists.', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $response );
		}

		$prefix = self::$prefix;
		if ( ! is_array( TMDSPRO_Post::get_post_meta( $product_draft_id, "_{$prefix}_split_variations", true ) ) && TMDSPRO_Post::get_post_id_by_temu_id( TMDSPRO_Post::get_post_meta( $product_draft_id, "_{$prefix}_sku", true ), [ 'publish' ] ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => esc_html__( 'This product has already been imported', 'tmds-woocommerce-temu-dropshipping' ),
			) );
		}
		$import_info           = TMDSPRO_Post::get_post_meta( $product_draft_id, "_{$prefix}_import_info", true );
		$currency              = $import_info['currency_code'] ?? $import_info['temu_locale_settings']['currency']['code'] ?? get_woocommerce_currency();
		$variations_attributes = [];
		$attributes            = self::get_product_attributes( $product_draft_id );
		if ( isset( $product_data['reviews'] ) ) {
			$reviews = [];
		} else {
			$reviews = self::get_product_reviews( $product_draft_id );
		}
		if ( isset( $product_data['variations'] ) ) {
			$variations = array_values( $product_data['variations'] );
			if ( ! empty( $variations ) ) {
				$var_default = isset( $product_data['default_variation'] ) ? $product_data['default_variation'] : '';

				foreach ( $variations as $variations_k => $variations_v ) {
					$variations_attribute = isset( $variations_v['attributes'] ) ? $variations_v['attributes'] : [];
					if ( $var_default === $variations_v['skuId'] ) {
						$product_data['variation_default'] = $variations_attribute;
					}

					if ( is_array( $variations_attribute ) && ! empty( $variations_attribute ) ) {
						foreach ( $variations_attribute as $variations_attribute_k => $variations_attribute_v ) {
							if ( ! isset( $variations_attributes[ $variations_attribute_k ] ) ) {
								$variations_attributes[ $variations_attribute_k ] = [ $variations_attribute_v ];
							} elseif ( ! in_array( $variations_attribute_v, $variations_attributes[ $variations_attribute_k ] ) ) {
								$variations_attributes[ $variations_attribute_k ][] = $variations_attribute_v;
							}
							if ( is_array( $variations_attribute_v ) ) {
								foreach ( $variations_attribute_v as $k => $v ) {
									$variations_attribute[ $variations_attribute_k ] = [
										'id'    => $k,
										'title' => $v,
									];
								}
							}
						}
					}
					$variations[ $variations_k ]['attributes'] = $variations_attribute;
				}

				if ( is_array( $attributes ) && ! empty( $attributes ) ) {
					foreach ( $attributes as $attributes_k => $attributes_v ) {
						if ( empty( $attributes_v['set_variation'] ) ) {
							unset( $attributes[ $attributes_k ] );
						}
						if ( ! empty( $variations_attributes[ $attributes_k ] ) ) {
							$tmp = [];
							foreach ( $variations_attributes[ $attributes_k ] as $variations_attribute_v ) {
								if ( is_array( $variations_attribute_v ) ) {
									foreach ( $variations_attribute_v as $k => $v ) {
										$tmp[] = [
											'id'    => $k,
											'title' => $v,
										];
									}
								}
							}
							$attributes[ $attributes_k ]['values'] = $tmp;
						}
					}
				}
			}
		} else {
			$variations = self::get_product_variations( $product_draft_id );
			foreach ( $variations as $variations_k => $variations_v ) {
				$variation_sale_price                         = self::$settings::string_to_float( $variations_v['sale_price'] );
				$variation_regular_price                      = self::$settings::string_to_float( $variations_v['regular_price'] );
				$price                                        = $variation_sale_price ?: $variation_regular_price;
				$price                                        = TMDSPRO_Price::process_exchange_price( $price, $currency );
				$variations[ $variations_k ]['regular_price'] = TMDSPRO_Price::process_price( $price );
				$variations[ $variations_k ]['sale_price']    = TMDSPRO_Price::process_price( $price, true );
			}
			if ( is_array( $attributes ) && ! empty( $attributes ) ) {
				foreach ( $attributes as $attributes_k => $attributes_v ) {
					if ( empty( $attributes_v['set_variation'] ) ) {
						unset( $attributes[ $attributes_k ] );
					}
				}
			}
		}
		if ( ! empty( $variations ) ) {
			$product_data['gallery'] = array_values( array_filter( $product_data['gallery'] ?? [] ) );

			if ( ! empty( $product_data['image'] ) ) {
				$product_image_key = array_search( $product_data['image'], $product_data['gallery'] );
				if ( $product_image_key !== false ) {
					unset( $product_data['gallery'][ $product_image_key ] );
					$product_data['gallery'] = array_values( $product_data['gallery'] );
				}
			}

			$gallery          = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_gallery', true );
			$desc_images      = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_description_images', true );
			$variation_images = TMDSPRO_Post::get_post_meta( $product_draft_id, '_' . $prefix . '_variation_images', true );
			if ( ! $gallery || ! is_array( $gallery ) ) {
				$gallery = [];
			}
			if ( ! $variation_images || ! is_array( $variation_images ) ) {
				$variation_images = [];
			}
			if ( ! $desc_images || ! is_array( $desc_images ) ) {
				$desc_images = [];
			}
			$variation_images                        = array_unique( array_merge( $gallery, $desc_images, $variation_images ) );
			$product_data['attributes']              = $attributes;
			$product_data['variation_images']        = $variation_images;
			$product_data['variations']              = $variations;
			$product_data['reviews']                 = $reviews;
			$product_data['parent_id']               = $product_draft_id;
			$product_data[ $prefix . '_product_id' ] = TMDSPRO_Post::get_post_meta( $product_draft_id, "_{$prefix}_sku", true );
			$woo_product_id                          = self::import_product( $product_data );
			if ( is_wp_error( $woo_product_id ) ) {
				$response['message'] = $woo_product_id->get_error_messages();
			} elseif ( ! $woo_product_id ) {
				$response['message']        = esc_html__( 'Can not create product', 'tmds-woocommerce-temu-dropshipping' );
				$response['woo_product_id'] = $woo_product_id;
			} else {
				$response['status']         = 'success';
				$response['message']        = esc_html__( 'Import successfully', 'tmds-woocommerce-temu-dropshipping' );
				$response['woo_product_id'] = $woo_product_id;

				$response['button_html'] = self::get_button_view_edit_html( $woo_product_id );
			}
		} else {
			$response['message'] = esc_html__( 'Please select at least 1 variation to import this product.', 'tmds-woocommerce-temu-dropshipping' );
		}
		wp_send_json( $response );
	}

	/**
	 * Import a product from Import list
	 *
	 * @param $product_data
	 *
	 * @return int|WP_Error
	 * @throws Exception
	 */
	public static function import_product( $product_data ) {
		$prefix       = self::$prefix;
		$product_data = apply_filters( 'villatheme_' . $prefix . '_import_list_product_data', $product_data, $product_data );
		do_action( 'villatheme_' . $prefix . '_import_list_before_import', $product_data );
		TMDSPRO_DATA::villatheme_set_time_limit();
		$tmds_product_id = $product_data[ $prefix . '_product_id' ];
		$parent_id       = $product_data['parent_id'];
		$image           = $product_data['image'];
		$categories      = $product_data['categories'] ?? [];
		$shipping_class  = $product_data['shipping_class'] ?? '';
		$title           = $product_data['title'];
		$sku             = $product_data['sku'] ?? '';
		if ( $sku && self::$settings->get_params( 'auto_generate_unique_sku' ) ) {
			$sku = wc_product_generate_unique_sku( 0, $sku );
		}
		$status                     = $product_data['status'];
		$tags                       = $product_data['tags'] ?? [];
		$description                = $product_data['description'];
		$variations                 = $product_data['variations'];
		$gallery                    = $product_data['gallery'];
		$attributes                 = $product_data['attributes'];
		$catalog_visibility         = $product_data['catalog_visibility'];
		$default_attr               = $product_data['variation_default'] ?? [];
		$manage_stock               = self::$settings->get_params( 'manage_stock' );
		$disable_background_process = self::$settings->get_params( 'disable_background_process' );
		$video_to_description       = self::$settings->get_params( 'product_video_to_desc' );
		$specifications             = $product_data['specifications'] ?? TMDSPRO_Post::get_post_meta( $parent_id, '_' . $prefix . '_specifications', true );
		$video_url                  = '';
		$video                      = TMDSPRO_Post::get_post_meta( $parent_id, '_' . $prefix . '_video', true );
		if ( is_array( $video ) && ! empty( $video ) ) {
			$video_url = $video[0]['videoUrl'] ?? '';
		}
		if ( $video_to_description && $video_url ) {
			if ( $video_to_description === 'before' ) {
				$description = "[video src='{$video_url}']" . $description;
			} elseif ( $video_to_description === 'after' ) {
				$description .= "[video src='{$video_url}']";
			}
		}
		$attr_additional = [];
		if ( self::$settings->get_params( 'product_import_specifications' ) && is_array( $specifications ) && ! empty( $specifications ) ) {
			foreach ( $specifications as $option ) {
				$attribute_object = new WC_Product_Attribute();
				$attribute_object->set_name( $option['attrName'] );
				$attribute_object->set_options( (array) $option['attrValue'] );
				$attribute_object->set_visible( apply_filters( 'vi_wad_create_product_attribute_set_visible', 1, $option ) );
				$attribute_object->set_variation( 0 );
				$attr_additional[] = $attribute_object;
			}
		}
		$create_as_wc_variable = is_array( $attributes ) && ! empty( $attributes ) && ( count( $variations ) > 1 || ! self::$settings->get_params( 'simple_if_one_variation' ) );
		if ( $create_as_wc_variable ) {
			$wc_product = new WC_Product_Variable();
		} else {
			$wc_product = new WC_Product_Simple();
		}
		$wc_product->set_name( $title );
		$wc_product->set_description( $description );
		$wc_product->set_status( $status );
		$wc_product->set_sku( $sku );
		/*Set product categories*/
		if ( is_array( $categories ) && ! empty( $categories ) ) {
			$wc_product->set_category_ids( $categories );
		}
		/*Set product shipping class*/
		if ( $shipping_class && get_term_by( 'id', $shipping_class, 'product_shipping_class' ) ) {
			$wc_product->set_shipping_class_id( $shipping_class );
		}
		$wc_product->set_catalog_visibility( $catalog_visibility ?: 'visible' );
		$product_id = $wc_product->save();
		$wc_product = wc_get_product( $product_id );
		if ( ! $wc_product ) {
			return $product_id;
		}
		if ( $parent_id ) {
			$update_data = array(
				'ID'          => $parent_id,
				'post_status' => 'publish',
				'post_author' => get_current_user_id(),
			);
			TMDSPRO_Post::update_post( $update_data );
			TMDSPRO_Post::update_post_meta( $parent_id, '_' . $prefix . '_woo_id', $product_id );
		}
		$wc_product->add_meta_data( '_' . $prefix . '_product_id', $tmds_product_id, true );
		/*Set product tag*/
		if ( is_array( $tags ) && ! empty( $tags ) ) {
			$wc_product->set_tag_ids( $tags );
		}
		/*download image gallery*/
		$dispatch = false;
		if ( isset( $product_data['old_product_image'] ) ) {
			if ( $product_data['old_product_image'] ) {
				$wc_product->set_image_id( $product_data['old_product_image'] );
			}
			if ( isset( $product_data['old_product_gallery'] ) && $product_data['old_product_gallery'] ) {
				$wc_product->set_gallery_image_ids( $product_data['old_product_gallery'] );
			}
		} else {
			if ( $image ) {
				$thumb_id = TMDSPRO_File::download_image( $image_id, $image, $product_id );
				if ( ! is_wp_error( $thumb_id ) ) {
					$wc_product->set_image_id( $thumb_id );
				}
			}
			self::process_gallery_images( $gallery, $disable_background_process, $product_id, $parent_id, $dispatch );
		}
		self::process_description_images( $description, $disable_background_process, $product_id, $parent_id, $dispatch );
		if ( $create_as_wc_variable ) {
			$attr_data = self::create_product_attributes( $attributes, $default_attr, $attributes_info );
			if ( ! empty( $attr_data ) ) {
				$attr_data = array_merge( $attr_data, $attr_additional );
				$wc_product->set_attributes( $attr_data );
				if ( $default_attr ) {
					$wc_product->set_default_attributes( $default_attr );
				}
			} elseif ( ! empty( $attr_additional ) ) {
				$wc_product->set_attributes( $attr_additional );
			}
			$wc_product->save_meta_data();
			$wc_product->save();
			/*Create product variation*/
			self::import_product_variation( $product_id, $product_data, $attributes_info, $dispatch, $disable_background_process );
		} else {
			if ( $dispatch ) {
				self::$process_image->save()->dispatch();
			}
			if ( ! empty( $attr_additional ) ) {
				$wc_product->set_attributes( $attr_additional );
			}
			$sale_price    = isset( $variations[0]['sale_price'] ) ? floatval( $variations[0]['sale_price'] ) : '';
			$regular_price = isset( $variations[0]['regular_price'] ) ? floatval( $variations[0]['regular_price'] ) : 0;
			$wc_product->set_price( $regular_price );
			$wc_product->set_regular_price( $regular_price );
			if ( $sale_price ) {
				$wc_product->set_price( $sale_price );
				$wc_product->set_sale_price( $sale_price );
			}
			$wc_product->set_manage_stock( $manage_stock ? 'yes' : 'no' );
			$wc_product->set_stock_status( 'instock' );
			if ( ! empty( $variations[0]['stock'] ) && $manage_stock ) {
				$wc_product->set_stock_quantity( absint( $variations[0]['stock'] ) );
			}
			$wc_product->add_meta_data( '_' . $prefix . '_variation_id', $variations[0]['skuId'], true );
		}
		if ( ! empty( $product_data['custom_pd_options'][0] ) ) {
			$custom_pd_options = $product_data['custom_pd_options'][0];
			$epow_form_data    = [
				[
					'sectionId' => 'section_' . current_time( 'timestamp' ),
					'label'     => '',
					'enable'    => 1,
					'elements'  => [
						[
							'enable'      => 1,
							'elementId'   => 'tmds_personalization_field',
							'label'       => $custom_pd_options['label'] ?? '',
							'description' => $custom_pd_options['desc'] ?? '',
							'maxlength'   => $custom_pd_options['maxlength'] ?? '',
							'max'         => $custom_pd_options['maxlength'] ?? '',
							'type'        => $custom_pd_options['type'] ?? 'textarea',
							'required'    => $custom_pd_options['required'] ?? '',
						]
					],
				]
			];
			$wc_product->update_meta_data( 'epow_form_data', $epow_form_data );
		}
		if ( self::$settings->get_params( 'product_import_video' ) && $video_url ) {
			$wc_product->add_meta_data( '_' . $prefix . '_product_video', $video_url );
			$wc_product->add_meta_data( '_' . $prefix . '_show_product_video_tab', $product_data['product_video_tab'] ?? '' );
		}
		$wc_product->save_meta_data();
		$wc_product->save();
		if ( ! empty( $product_data['reviews'] ) && is_array( $product_data['reviews'] ) ) {
			$review_verified = self::$settings->get_params( 'product_review_verified' );
			$comment_args    = array(
				'comment_post_ID'      => $product_id,
				'comment_author'       => '',
				'comment_author_email' => '',
				'comment_author_url'   => '',
				'comment_content'      => '',
				'comment_approved'     => self::$settings->get_params( 'product_review_status' ) ? '1' : '0',
				'comment_parent'       => '',
				'user_id'              => '',
				'comment_author_IP'    => '',
				'comment_agent'        => '',
				'comment_date'         => '',
				'comment_date_gmt'     => '',
			);
			foreach ( $product_data['reviews'] as $review ) {
				$tmp                     = $comment_args;
				$tmp['comment_author']   = $review['name'] ?? '';
				$tmp['comment_content']  = $review['tmds_comment'] ?? '';
				$tmp['comment_date']     = wp_date( 'Y-m-d H:j:s', $review['time'] ?? '' );
				$tmp['comment_date_gmt'] = $tmp['comment_date'];
				$comment_id              = self::insert_comment( $tmp );
				if ( $comment_id ) {
					if ( $review_verified ) {
						update_comment_meta( $comment_id, 'verified', 1 );
					}
					if ( ! empty( $review['score'] ) ) {
						update_comment_meta( $comment_id, 'rating', $review['score'] );
					}
					$media_urls = [];
					if ( ! empty( $review['video']['url'] ) ) {
						$media_urls[] = $review['video']['url'];
					}
					if ( ! empty( $review['pictures'] ) ) {
						foreach ( $review['pictures'] as $item ) {
							if ( ! empty( $item['url'] ) ) {
								$media_urls[] = $item['url'];
							}
						}
					}
					if ( ! empty( $media_urls ) ) {
						update_comment_meta( $comment_id, 'reviews-images', $media_urls );
					}
				}
				do_action( 'tmds_review_after_insert', $comment_id, $product_id );
			}
			WC_Comments::clear_transients( $product_id );
		}

		return $product_id;
	}

	public static function insert_comment( $commentdata ) {
		global $wpdb;
		$comment_ID = wp_insert_comment( $commentdata );
		if ( ! $comment_ID ) {
			$fields = array( 'comment_author', 'comment_content' );
			foreach ( $fields as $field ) {
				if ( isset( $commentdata[ $field ] ) ) {
					$commentdata[ $field ] = $wpdb->strip_invalid_text_for_column( $wpdb->comments, $field, $commentdata[ $field ] );
				}
			}
			$comment_ID = wp_insert_comment( $commentdata );
			if ( ! $comment_ID ) {
				return false;
			}
		}

		return $comment_ID;
	}

	public static function import_product_variation( $product_id, $product_data, $attributes_info, $dispatch, $disable_background_process ) {
		$product = wc_get_product( $product_id );
		if ( ! $product ) {
			return;
		}
		$prefix = self::$prefix;
		if ( is_array( $product_data['variations'] ) && ! empty( $product_data['variations'] ) ) {
			$variation_ids         = [];
			$use_global_attributes = self::$settings->get_params( 'use_global_attributes' );
			$manage_stock          = self::$settings->get_params( 'manage_stock' ) ? 'yes' : 'no';
			foreach ( $product_data['variations'] as $pos => $product_variation ) {
				if ( ! empty( $product_variation['variation_id'] ) ) {
					$variation_id = $product_variation['variation_id'];
				} else {
					$stock_quantity = isset( $product_variation['stock'] ) ? absint( $product_variation['stock'] ) : 0;
					$variation      = new \WC_Product_Variation();
					$variation->set_parent_id( $product_id );
					$attributes     = [];
					$get_attr_value = $use_global_attributes ? 'slug' : 'title';
					foreach ( $product_variation['attributes'] as $option_k => $attr ) {
						if ( ! isset( $attributes_info[ $option_k ]['slug'], $attributes_info[ $option_k ]['values'] ) || ! isset( $attr['id'] ) ) {
							continue;
						}
						$options_v = $attributes_info[ $option_k ]['values'];
						if ( is_array( $options_v ) ) {
							foreach ( $options_v as $option_v ) {
								if ( isset( $option_v['id'], $option_v[ $get_attr_value ] ) && $option_v['id'] == $attr['id'] ) {
									$attributes[ $attributes_info[ $option_k ]['slug'] ] = $option_v[ $get_attr_value ];
									break;
								}
							}
						}
					}
					$variation->set_attributes( $attributes );
					$sale_price    = isset( $product_variation['sale_price'] ) && is_numeric( $product_variation['sale_price'] ) ? floatval( $product_variation['sale_price'] ) : '';
					$regular_price = isset( $product_variation['regular_price'] ) ? floatval( $product_variation['regular_price'] ) : '';

					/*Set metabox for variation . Check field name at woocommerce/includes/class-wc-ajax.php*/
					$fields = array(
						'sku'            => $product_variation['sku'] ? wc_product_generate_unique_sku( 0, $product_variation['sku'] ) : '',
						'regular_price'  => $regular_price,
						'price'          => $regular_price,
						'manage_stock'   => $manage_stock,
						'stock_status'   => 'instock',
						'stock_quantity' => $stock_quantity,
					);

					if ( is_numeric( $sale_price ) && $sale_price < $regular_price ) {
						$fields['sale_price'] = $sale_price;
						$fields['price']      = $sale_price;
					}

					foreach ( $fields as $field => $value ) {
						$variation->{"set_$field"}( wc_clean( $value ) );
					}
					$variation->add_meta_data( '_' . $prefix . '_variation_id', $product_variation['skuId'] ?? '', true );
					do_action( 'tmds_product_variation_linked', $variation->save() );
					$variation_id = $variation->get_id();
				}
				if ( $product_variation['image'] ?? '' ) {
					if ( in_array( $product_variation['image'], $product_data['variation_images'] ) ) {
						$variation_ids[ $pos ] = [
							'src'          => $product_variation['image'],
							'variation_id' => [ $variation_id ],
						];
					}
				}
				$dispatch = apply_filters( 'tmds_dispatch_after_make_variation_data', $dispatch, $variation_id, $product_variation, $disable_background_process );
			}
			if ( ! empty( $variation_ids ) ) {
				if ( $disable_background_process ) {
					foreach ( $variation_ids as $values ) {
						if ( ! empty( $values ) && ! empty( $values['src'] ) ) {
							$image_data = array(
								'woo_product_id' => $product_id,
								'parent_id'      => '',
								'src'            => $values['src'],
								'product_ids'    => $values['variation_id'],
								'set_gallery'    => 0,
							);
							TMDSPRO_Error_Images_Table::insert( $product_id, implode( ',', $image_data['product_ids'] ), $image_data['src'], intval( $image_data['set_gallery'] ) );
						}
					}
				} else {
					foreach ( $variation_ids as $key => $values ) {
						if ( ! empty( $values ) && ! empty( $values['src'] ) ) {
							$dispatch   = true;
							$image_data = array(
								'woo_product_id' => $product_id,
								'parent_id'      => '',
								'src'            => $values['src'],
								'product_ids'    => $values['variation_id'],
								'set_gallery'    => 0,
							);
							self::$process_image->push_to_queue( $image_data );
						}
					}
				}
			}
		}
		$data_store = $product->get_data_store();
		$data_store->sort_all_product_variations( $product->get_id() );
		if ( $dispatch ) {
			self::$process_image->save()->dispatch();
		}
	}

	public static function get_term_by_name( $value, $taxonomy = '', $output = OBJECT, $filter = 'raw' ) {
		// 'term_taxonomy_id' lookups don't require taxonomy checks.
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return false;
		}

		// No need to perform a query for empty 'slug' or 'name'.
		$value = (string) $value;

		if ( 0 === strlen( $value ) ) {
			return false;
		}

		$args = array(
			'get'                    => 'all',
			'name'                   => $value,
			'number'                 => 0,
			'taxonomy'               => $taxonomy,
			'update_term_meta_cache' => false,
			'orderby'                => 'none',
			'suppress_filter'        => true,
		);

		$terms = get_terms( $args );
		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			return false;
		}
		$check_slug = sanitize_title( $value );
		if ( count( $terms ) > 1 ) {
			foreach ( $terms as $term ) {
				if ( $term->slug == $check_slug ) {
					return get_term( $term, $taxonomy, $output, $filter );
				}
				if ( $term->name === $value ) {
					return get_term( $term, $taxonomy, $output, $filter );
				}
			}
		}
		$term = array_shift( $terms );

		return get_term( $term, $taxonomy, $output, $filter );
	}

	public static function process_description_images( $description, $disable_background_process, $product_id, $parent_id, &$dispatch ) {
		if ( $description && ! self::$settings->get_params( 'use_external_image' ) && self::$settings->get_params( 'download_description_images' ) ) {
			preg_match_all( '/src="([\s\S]*?)"/im', $description, $matches );

			if ( isset( $matches[1] ) && is_array( $matches[1] ) && count( $matches[1] ) ) {
				$description_images = array_unique( $matches[1] );

				if ( $disable_background_process ) {
					foreach ( $description_images as $description_image ) {
						TMDSPRO_Error_Images_Table::insert( $product_id, '', $description_image, 2 );
					}
				} else {
					foreach ( $description_images as $description_image ) {
						$images_data = array(
							'woo_product_id' => $product_id,
							'parent_id'      => $parent_id,
							'src'            => $description_image,
							'product_ids'    => [],
							'set_gallery'    => 2,
						);
						self::$process_image->push_to_queue( $images_data );
					}
					$dispatch = true;
				}
			}
		}
	}

	public static function process_gallery_images( $gallery, $disable_background_process, $product_id, $parent_id, &$dispatch ) {
		if ( is_array( $gallery ) && count( $gallery ) ) {
			if ( $disable_background_process ) {
				foreach ( $gallery as $image_url ) {
					$image_data = array(
						'woo_product_id' => $product_id,
						'parent_id'      => $parent_id,
						'src'            => $image_url,
						'product_ids'    => [],
						'set_gallery'    => 1,
					);
					TMDSPRO_Error_Images_Table::insert( $product_id, implode( ',', $image_data['product_ids'] ), $image_data['src'], intval( $image_data['set_gallery'] ) );
				}
			} else {
				$dispatch = true;
				foreach ( $gallery as $image_url ) {
					$image_data = array(
						'woo_product_id' => $product_id,
						'parent_id'      => $parent_id,
						'src'            => $image_url,
						'product_ids'    => [],
						'set_gallery'    => 1,
					);
					self::$process_image->push_to_queue( $image_data );
				}
			}
		}
	}

	public static function create_product_attributes( $attributes, &$default_attr, &$attributes_info ) {
		global $wp_taxonomies;
		$position  = 0;
		$attr_data = [];
		if ( ! $attributes_info ) {
			$attributes_info = [];
		}
		$variation_visible = self::$settings->get_params( 'variation_visible' );
		if ( self::$settings->get_params( 'use_global_attributes' ) ) {
			foreach ( $attributes as $key => $attr ) {
				if ( ! isset( $attr['slug'] ) ) {
					$attr['slug'] = self::$settings::sanitize_taxonomy_name( $attr['title'] ?? $key );
				}
				$attributes_info[ $key ] = [
					'slug'   => 'pa_' . $attr['slug'],
					'values' => []
				];
				$attribute_name          = isset( $attr['title'] ) ? $attr['title'] : self::$settings::get_attribute_name_by_slug( $attr['slug'] );
				$attribute_id            = wc_attribute_taxonomy_id_by_name( $attribute_name );
				if ( ! $attribute_id ) {
					$attribute_id = wc_create_attribute( array(
						'name'         => $attribute_name,
						'slug'         => $attr['slug'],
						'type'         => 'select',
						'order_by'     => 'menu_order',
						'has_archives' => false,
					) );
				}
				if ( $attribute_id && ! is_wp_error( $attribute_id ) ) {
					$attribute_obj     = wc_get_attribute( $attribute_id );
					$attribute_options = [];
					if ( ! empty( $attribute_obj ) ) {
						$taxonomy = $attribute_obj->slug; // phpcs:ignore
						if ( isset( $default_attr[ $key ] ) ) {
							$default_attr[ $taxonomy ] = $default_attr[ $key ];
							unset( $default_attr[ $key ] );
						}
						/*Update global $wp_taxonomies for latter insert attribute values*/
						$wp_taxonomies[ $taxonomy ] = new \WP_Taxonomy( $taxonomy, 'product' );
						if ( ! empty( $attr['values'] ) ) {
							$attributes_info_values = [];
							foreach ( $attr['values'] as $attr_value ) {
								if ( empty( $attr_value['title'] ) ) {
									continue;
								}
								$tmp         = $attr_value;
								$attr_value  = strval( wc_clean( $attr_value['title'] ) );
								$insert_term = wp_insert_term( $attr_value, $taxonomy );
								if ( ! is_wp_error( $insert_term ) ) {
									$attribute_options[] = $insert_term['term_id'];
									$term_exists         = get_term_by( 'id', $insert_term['term_id'], $taxonomy );
									if ( $term_exists ) {
										if ( isset( $default_attr[ $taxonomy ] ) ) {
											$default_attr[ $taxonomy ] = $term_exists->slug;
										}
										$tmp['slug'] = $term_exists->slug;
									}
								} elseif ( isset( $insert_term->error_data ) && isset( $insert_term->error_data['term_exists'] ) ) {
									$attribute_options[] = $insert_term->error_data['term_exists'];
									$term_exists         = get_term_by( 'id', $insert_term->error_data['term_exists'], $taxonomy );
									if ( $term_exists ) {
										if ( isset( $default_attr[ $taxonomy ] ) ) {
											$default_attr[ $taxonomy ] = $term_exists->slug;
										}
										$tmp['slug'] = $term_exists->slug;
									}
								}
								$attributes_info_values[] = $tmp;
							}
							$attributes_info[ $key ]['values'] = $attributes_info_values;
						}
					}
					$attribute_object = new \WC_Product_Attribute();
					$attribute_object->set_id( $attribute_id );
					$attribute_object->set_name( wc_attribute_taxonomy_name_by_id( $attribute_id ) );
					if ( ! empty( $attribute_options ) ) {
						$attribute_object->set_options( $attribute_options );
					} else {
						$attribute_object->set_options( array_column( $attr['values'], 'title' ) );
					}
					$attribute_object->set_position( isset( $attr['position'] ) ? $attr['position'] : $position );
					$attribute_object->set_visible( $variation_visible ? 1 : '' );
					$attribute_object->set_variation( 1 );
					$attr_data[] = $attribute_object;
				}
				$position ++;
			}
		} else {
			foreach ( $attributes as $key => $attr ) {
				if ( ! isset( $attr['slug'] ) ) {
					$attr['slug'] = self::$settings::sanitize_taxonomy_name( $attr['title'] ?? $key );
				}
				$attribute_name   = isset( $attr['title'] ) ? $attr['title'] : self::$settings::get_attribute_name_by_slug( $attr['slug'] );
				$attribute_object = new \WC_Product_Attribute();
				$attribute_object->set_name( $attribute_name );
				$attribute_object->set_options( array_column( $attr['values'], 'title' ) );
				$attribute_object->set_position( isset( $attr['position'] ) ? $attr['position'] : $position );
				$attribute_object->set_visible( $variation_visible ? 1 : '' );
				$attribute_object->set_variation( 1 );
				$attr_data[]             = $attribute_object;
				$attributes_info[ $key ] = [
					'slug'   => $attr['slug'],
					'values' => array_values( $attr['values'] )
				];
				$position ++;
			}
		}

		return $attr_data;
	}

	/**
	 * @param $woo_product_id
	 *
	 * @return false|string
	 */

	public static function get_button_view_edit_html( $woo_product_id ) {
		ob_start();
		?>
        <a href="<?php echo esc_url( get_post_permalink( $woo_product_id ) ) ?>"
           target="_blank" class="vi-ui mini button labeled icon"
           rel="nofollow"><i class="icon eye"></i><?php esc_html_e( 'View', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
        <a href="<?php echo esc_url( admin_url( "post.php?post={$woo_product_id}&action=edit" ) ) ?>"
           target="_blank" class="vi-ui mini button labeled icon primary"
           rel="nofollow"><i class="icon edit"></i><?php esc_html_e( 'Edit', 'tmds-woocommerce-temu-dropshipping' ) ?></a>
		<?php
		return apply_filters( 'villatheme_' . self::$prefix . '_import_list_button_view_edit_html', ob_get_clean(), $woo_product_id );
	}

	public static function remove() {
		$result = array(
			'status'  => 'error',
			'message' => esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' ),
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		TMDSPRO_DATA::villatheme_set_time_limit();
		$product_id = isset( $_POST['product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_POST['product_id'] ) ) ) : '';
		$result     = array(
			'status'  => 'error',
			'message' => esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' ),
		);
		if ( $product_id ) {
			if ( TMDSPRO_Post::delete_post( $product_id, true ) ) {
				$result['status']  = 'success';
				$result['message'] = esc_html__( 'Removed', 'tmds-woocommerce-temu-dropshipping' );
			} else {
				$result['message'] = esc_html__( 'Error in deleting the item', 'tmds-woocommerce-temu-dropshipping' );
			}
		}
		wp_send_json( $result );
	}

	public static function save_attributes() {
		$result = array(
			'status'       => 'error',
			'new_slug'     => '',
			'change_value' => false,
			'message'      => '',
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		$prefix        = self::$prefix;
		$data          = isset( $_POST['form_data']["{$prefix}_product"] ) ? self::$settings::json_decode( wc_clean( wp_unslash( $_POST['form_data']["{$prefix}_product"] ) ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product_data  = array_values( $data )[0];
		$product_id    = array_keys( $data )[0];
		$new_attribute = $product_data['attributes'] ?? [];
		$attributes    = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_attributes", true );
		$variations    = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_variations", true );
		$change_slug   = '';
		$change_value  = false;
		$message_error = '';
		if ( ! empty( $new_attribute ) && is_array( $new_attribute ) && ! empty( $attributes ) ) {
			foreach ( $new_attribute as $attribute_k => $new_attribute_v ) {
				if ( ! isset( $attributes[ $attribute_k ] ) || empty( $new_attribute_v['name'] ) ) {
					$message_error = esc_html__( 'Attribute name can not be empty', 'tmds-woocommerce-temu-dropshipping' );
					break;
				}
				$new_slug       = self::$settings::sanitize_taxonomy_name( $new_attribute_v['name'] );
				$attribute_slug = $attributes[ $attribute_k ]['slug_edited'] ?? $attributes[ $attribute_k ]['slug'] ?? '';
				if ( ! self::is_attribute_value_equal( $new_slug, $attribute_slug ) ||
				     ( isset( $attributes[ $attribute_k ]['name_edited'] ) && $attributes[ $attribute_k ]['name_edited'] != $new_attribute_v['name'] ) ) {
					$change_slug                                = $new_slug;
					$attributes[ $attribute_k ]['slug_edited']  = $new_slug;
					$attributes[ $attribute_k ]['name_edited']  = $new_attribute_v['name'];
					$attributes[ $attribute_k ]['title_edited'] = $new_attribute_v['name'];
				}
				if ( ! empty( $new_attribute_v['values'] ) ) {
					$new_values    = $new_attribute_v['values'];
					$values_edited = $attributes[ $attribute_k ]['values_edited'] ?? $attributes[ $attribute_k ]['values'] ?? [];
					foreach ( $values_edited as $value_k => $value ) {
						$value_id    = $value['id'] ?? '';
						$value_title = $value['title'] ?? '';
						if ( isset( $value_id ) && isset( $new_values[ $value_id ] ) ) {
							$new_value_title = trim( $new_values[ $value_id ] );
							if ( $value_title != $new_value_title ) {
								$change_value                       = true;
								$values_edited[ $value_k ]['title'] = $new_value_title;
								foreach ( $variations as $variation_k => $variation ) {
									$v_attributes = $variation['attributes_edited'] ?? $variation['attributes'] ?? [];
									if ( isset( $v_attributes[ $attribute_k ]['id'] ) && $v_attributes[ $attribute_k ]['id'] == $value_id ) {
										$v_attributes[ $attribute_k ]                    = $values_edited[ $value_k ];
										$variations[ $variation_k ]['attributes_edited'] = $v_attributes;
									}
								}
								$attributes[ $attribute_k ]['values_edited'] = $values_edited;
							}
						}
					}
				}
			}
		}

		if ( $message_error ) {
			$result['message'] = $message_error;
		} else {
			if ( $change_slug || $change_value ) {
				$result['status'] = 'success';
				TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_attributes", $attributes );
				TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_variations", $variations );
			}
			$result['new_slug']     = $change_slug;
			$result['change_value'] = $change_value;
		}
		wp_send_json( $result );
	}

	public static function remove_attribute() {
		$result = array(
			'status'  => 'error',
			'html'    => '',
			'message' => esc_html__( 'Invalid data', 'tmds-woocommerce-temu-dropshipping' ),
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		$prefix           = self::$prefix;
		$data             = isset( $_POST['form_data']["{$prefix}_product"] ) ? TMDSPRO_DATA::json_decode( wc_clean( wp_unslash( $_POST['form_data']["{$prefix}_product"] ) ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product_data     = array_values( $data )[0];
		$product_id       = array_keys( $data )[0];
		$remove_attribute = $product_data['attributes'] ?? [];
		$attribute_value  = isset( $_POST['attribute_value'] ) ? sanitize_text_field( wp_unslash( $_POST['attribute_value'] ) ) : '';
		$product          = TMDSPRO_Post::get_post( $product_id );
		if ( $product && $product->post_type === "{$prefix}_draft_product" && in_array( $product->post_status, [ 'draft', 'override' ] ) ) {
			$attributes = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_attributes", true );
			$variations = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_variations", true );

			if ( self::remove_product_attribute( $product_id, $remove_attribute, $attribute_value, '', $attributes, $variations ) ) {
				$result['status']  = 'success';
				$result['message'] = esc_html__( 'Remove attribute successfully', 'tmds-woocommerce-temu-dropshipping' );
			}
		} else {
			$result['message'] = esc_html__( 'Invalid product', 'tmds-woocommerce-temu-dropshipping' );
		}
		wp_send_json( $result );
	}

	public static function remove_product_attribute( $product_id, $remove_attribute, $attribute_value, $split_variations, &$attributes, &$variations ) {
		$remove = false;
		$prefix = self::$prefix;
		if ( ! empty( $remove_attribute ) && ! empty( $attributes ) ) {
//			$new_attribute_v = array_values( $remove_attribute )[0];
			$attribute_k = array_keys( $remove_attribute )[0];
			if ( isset( $attributes[ $attribute_k ] ) ) {
				foreach ( $variations as $variation_k => $variation ) {
					$v_attributes = $variation['attributes_edited'] ?? $variation['attributes'] ?? [];
					if ( isset( $v_attributes[ $attribute_k ]['id'] ) && $v_attributes[ $attribute_k ]['id'] == $attribute_value ) {
						unset( $v_attributes[ $attribute_k ] );
						$variations[ $variation_k ]['attributes_edited'] = $v_attributes;
						if ( is_array( $split_variations ) && ! empty( $split_variations ) ) {
							$search = array_search( $variation['skuId'], $split_variations );
							if ( $search !== false ) {
								unset( $split_variations[ $search ] );
							}
						}
					} else {
						unset( $variations[ $variation_k ] );
					}
				}
				if ( is_array( $split_variations ) ) {
					TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_split_attribute", $attributes[ $attribute_k ]['title'] ?? $attribute_k );
					TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_split_variations", $split_variations );
				}
				unset( $attributes[ $attribute_k ] );
				$variations = array_values( $variations );
				TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_attributes", $attributes );
				TMDSPRO_Post::update_post_meta( $product_id, "_{$prefix}_variations", $variations );
				$remove = true;
			}
		}

		return $remove;
	}

	public static function is_attribute_value_equal( $value_1, $value_2 ) {
		return self::$settings::strtolower( $value_1 ) === self::$settings::strtolower( $value_2 );
	}

	/**
	 * Ajax split product
	 */
	public function split_product() {
		$result = array(
			'status'  => 'error',
			'message' => esc_html__( 'Can not split this product', 'tmds-woocommerce-temu-dropshipping' )
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_woocommerce', 'tmds-import-list' ) ) ) {
			$result['message'] = 'Missing role';
			wp_send_json( $result );
		}
		$product_id           = isset( $_POST['product_id'] ) ? sanitize_text_field(wp_unslash( $_POST['product_id'])) : '';
		$split_attribute_id   = isset( $_POST['split_attribute_id'] ) ? sanitize_text_field(wp_unslash( $_POST['split_attribute_id']) ) : '';
		$split_variations_ids = isset( $_POST['split_variations_ids'] ) ? wc_clean(wp_unslash( $_POST['split_variations_ids']) ) : array();// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$product              = TMDSPRO_Post::get_post( $product_id );
		if ( $product ) {
			$attributes    = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_attributes', true );
			$variations    = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_variations', true );
			$product_title = $product->post_title;
			if ( $split_attribute_id ) {
				if ( ! empty( $attributes ) && count( $variations ) > 1 ) {
					$split_attribute = isset( $attributes[ $split_attribute_id ] ) ? $attributes[ $split_attribute_id ] : array();
					if ( ! empty( $split_attribute['values'] ) && isset( $split_attribute['values'][1] ) ) {
						$split_variations = array();
						foreach ( $split_attribute['values'] as $split_attribute_v ) {
							$new_variations = array(
								'images'          => array(),
								'skuId'           => array(),
								'attribute_value' => $split_attribute_v,
								'variations'      => array(),
							);
							foreach ( $variations as $variation_v ) {
								if ( $variation_v['attributes'][ $split_attribute_id ]['id'] == $split_attribute_v['id'] ) {
									$new_variations['skuId'][] = $variation_v['skuId'];
									if ( $variation_v['image'] ) {
										$new_variations['images'][] = $variation_v['image'];
									}
									$new_variations['variations'][] = $variation_v;
								}
							}
							if ( ! empty( $new_variations['skuId'] ) ) {
								$new_variations['images'] = array_unique( $new_variations['images'] );
								$split_variations[]       = $new_variations;
							}
						}
						if ( isset( $split_variations[1] ) ) {
							$split_variation = array_shift( $split_variations );
							TMDSPRO_Post::update_post_meta( $product_id, '_tmds_split_variations', $split_variation['skuId'] );

							if ( ! empty( $split_variation['images'] ) ) {
								$gallery = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_gallery', true );
								TMDSPRO_Post::update_post_meta( $product_id, '_tmds_gallery', array_merge( $split_variation['images'], $gallery ) );
							}
							$meta             = TMDSPRO_Post::get_post_meta( $product_id );
							$split_success    = 1;
							$clone_variations = $variations;
							$clone_attributes = $attributes;
							if ( self::$settings->get_params( 'split_auto_remove_attribute' ) ) {
								if ( self::remove_product_attribute( $product_id,
									array( $split_attribute_id => $split_attribute ),
									$split_variation['attribute_value']['id'],
									$split_variation['skuId'],
									$clone_attributes,
									$clone_variations ) ) {
									TMDSPRO_Post::update_post(
										array(
											'ID'         => $product_id,
											'post_title' => "{$product_title} - {$split_variation['attribute_value']['title']}"
										) );
								}
							}

							foreach ( $split_variations as $split_variation ) {
								$split_product = TMDSPRO_Post::insert_post( array(
									'post_title'   => $product->post_title,
									'post_type'    => 'tmds_draft_product',
									'post_status'  => 'draft',
									'post_excerpt' => '',
									'post_content' => $product->post_content,
									'post_date'    => $product->post_date,
								), true );

								if ( $split_product && ! is_wp_error( $split_product ) ) {
									$split_success ++;
									foreach ( $meta as $meta_key => $meta_value ) {
										$meta_value = maybe_unserialize( $meta_value[0] );
										if ( $meta_key === '_tmds_split_variations' ) {
											continue;
										}
										if ( $meta_key === '_tmds_gallery' ) {
											if ( ! empty( $split_variation['images'] ) ) {
												$meta_value = array_merge( $split_variation['images'], $meta_value );
											}
										}
										TMDSPRO_Post::update_post_meta( $split_product, $meta_key, $meta_value );
									}

									TMDSPRO_Post::update_post_meta( $split_product, '_tmds_split_variations', $split_variation['skuId'] );
									$clone_variations = $variations;
									$clone_attributes = $attributes;
									if ( self::$settings->get_params( 'split_auto_remove_attribute' ) ) {
										if ( self::remove_product_attribute( $split_product, array( $split_attribute_id => $split_attribute ),
											$split_variation['attribute_value']['id'],
											$split_variation['skuId'],
											$clone_attributes, $clone_variations ) ) {
											TMDSPRO_Post::update_post(
												array(
													'ID'         => $split_product,
													'post_title' => "{$product_title} - {$split_variation['attribute_value']['title']}"
												) );
										}
									}
								}
							}
							$result['status']  = 'success';
							$result['message'] = sprintf( _n( 'Split %s product successfully', 'Split %s products successfully', $split_success, 'tmds-woocommerce-temu-dropshipping' ), $split_success, 'tmds-woocommerce-temu-dropshipping' );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
						}
					}
				}
			} elseif ( ! empty( $split_variations_ids ) && count( $split_variations_ids ) < count( $variations ) ) {
				$new_variations_1 = $new_variations_2 = array(
					'images'     => array(),
					'skuId'      => array(),
					'variations' => array(),
				);
				foreach ( $variations as $variation_v ) {
					$variation_sku_id = $variation_v['skuId'];
					if ( in_array( $variation_sku_id, $split_variations_ids ) ) {
						$new_variations_1['skuId'][] = $variation_sku_id;
						if ( $variation_v['image'] ) {
							$new_variations_1['images'][] = $variation_v['image'];
						}
						$new_variations_1['variations'][] = $variation_v;
					} else {
						$new_variations_2['skuId'][]      = $variation_sku_id;
						$new_variations_2['variations'][] = $variation_v;
					}
				}
				if ( ! empty( $new_variations_1['skuId'] ) && ! empty( $new_variations_2['skuId'] ) ) {
					$new_variations_1['images'] = array_unique( $new_variations_1['images'] );
					TMDSPRO_Post::update_post_meta( $product_id, '_tmds_split_variations', $new_variations_2['skuId'] );
					if ( self::$settings->get_params( 'split_auto_remove_attribute' ) ) {
						TMDSPRO_Post::update_post_meta( $product_id, '_tmds_variations', $new_variations_2['variations'] );
					}
					$meta          = TMDSPRO_Post::get_post_meta( $product_id );
					$split_product = TMDSPRO_Post::insert_post( array(
						'post_title'   => $product->post_title,
						'post_type'    => 'tmds_draft_product',
						'post_status'  => 'draft',
						'post_excerpt' => '',
						'post_content' => $product->post_content,
					), true );
					$split_success = 1;
					if ( $split_product && ! is_wp_error( $split_product ) ) {
						$split_success ++;
						foreach ( $meta as $meta_key => $meta_value ) {
							$meta_value = maybe_unserialize( $meta_value[0] );
							if ( $meta_key === '_tmds_split_variations' ) {
								continue;
							}
							if ( $meta_key === '_tmds_gallery' ) {
								if ( ! empty( $new_variations_1['images'] ) ) {
									$meta_value = array_merge( $new_variations_1['images'], $meta_value );
								}
							}
							if ( self::$settings->get_params( 'split_auto_remove_attribute' ) ) {
								TMDSPRO_Post::update_post_meta( $split_product, '_tmds_variations', $new_variations_1['variations'] );
							}
							TMDSPRO_Post::update_post_meta( $split_product, $meta_key, $meta_value );
						}
						TMDSPRO_Post::update_post_meta( $split_product, '_tmds_split_variations', $new_variations_1['skuId'] );
					}
					$result['status']  = 'success';
					$result['message'] = sprintf( _n( 'Split %s product successfully', 'Split %s products successfully', $split_success, 'tmds-woocommerce-temu-dropshipping' ), $split_success );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
				}
			}
		}
		wp_send_json( $result );
	}

	public static function load_product_reviews() {
		$result = array(
			'status'  => 'error',
			'message' => esc_html__( 'Missing required arguments', 'tmds-woocommerce-temu-dropshipping' )
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		$key        = isset( $_GET['product_index'] ) ? absint( sanitize_text_field( wp_unslash( $_GET['product_index'] ) ) ) : '';
		$product_id = isset( $_GET['product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_GET['product_id'] ) ) ) : '';
		if ( $key > - 1 && $product_id ) {
			$result['status']        = 'success';
			$result['data']          = wc_get_template_html( 'admin/html-import-list-reviews-html.php',
				array(
					'key'        => $key,
					'product_id' => $product_id,
					'reviews'    => self::get_product_reviews( $product_id ),
				),
				'',
				TMDSPRO_TEMPLATES );
			$result['reviews_count'] = self::$reviews_count;
		}
		wp_send_json( $result );
	}

	public static function load_variations_table() {
		$result = array(
			'status'  => 'error',
			'message' => esc_html__( 'Missing required arguments', 'tmds-woocommerce-temu-dropshipping' )
		);
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = 'Invalid nonce';
			wp_send_json( $result );
		}
		$key        = isset( $_GET['product_index'] ) ? absint( sanitize_text_field( wp_unslash( $_GET['product_index'] ) ) ) : '';
		$product_id = isset( $_GET['product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_GET['product_id'] ) ) ) : '';
		if ( $key > - 1 && $product_id ) {
			$wc_currency            = get_woocommerce_currency();
			$wc_currency_symbol     = get_woocommerce_currency_symbol();
			$wc_decimals            = wc_get_price_decimals();
			$wc_decimals            = $wc_decimals < 1 ? 1 : pow( 10, ( - 1 * $wc_decimals ) );
			$use_different_currency = false;
			$import_info            = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_import_info', true );
			$currency               = $import_info['currency_code'] ?? $wc_currency;
			$decimals               = $import_info['currency_decimals'] ?? $import_info['temu_locale_settings']['currency']['number_precision'] ?? 2;
			$decimals               = $decimals < 1 ? 1 : pow( 10, ( - 1 * $decimals ) );
			if ( self::$settings::strtolower( $wc_currency ) != self::$settings::strtolower( $currency ) ) {
				$use_different_currency = true;
			}
			$parent       = [];
			$attributes   = self::get_product_attributes( $product_id );
			$split_option = '';
			if ( is_array( $attributes ) && ! empty( $attributes ) ) {
				foreach ( $attributes as $attribute_k => $attribute_v ) {
					$parent[ $attribute_k ] = $attribute_v['slug'] ?? '';
					$attribute_values_count = is_array( $attribute_v['values'] ) ? count( $attribute_v['values'] ) : 0;
					$attribute_name         = isset( $attribute_v['name'] ) ? $attribute_v['name'] : ucfirst( $attribute_v['slug'] );
					if ( $attribute_values_count > 1 ) {
						$split_option .= '<span class="vi-ui button mini green tmds-button-split" data-split_product_message="' . sprintf( _n( 'Split to %1$s product by %2$s?', 'Split to %1$s products by %2$s?', $attribute_values_count, 'tmds-woocommerce-temu-dropshipping' ), $attribute_values_count, $attribute_name ) . '" data-product_id="' . $product_id . '" data-split_attribute_id="' . $attribute_k . '">' . sprintf( __( 'Split product by %1$s(%2$s)', 'tmds-woocommerce-temu-dropshipping' ), $attribute_name, $attribute_values_count ) . '</span>';//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
					}
				}
			}
			if ( $split_option ) {
				$split_option .= '<span class="vi-ui button mini green tmds-button-split"
                                      data-product_id="' . esc_attr( $product_id ) . '">' . esc_html__( 'Split product by selected variation(s)', 'tmds-woocommerce-temu-dropshipping' ) . '</span>';
			}
			$manage_stock               = self::$settings->get_params( 'manage_stock' );
			$variations                 = self::get_product_variations( $product_id );
			$result['status']           = 'success';
			$result['data']             = wc_get_template_html( 'admin/html-import-list-variation-html.php',
				array(
					'key'                    => $key,
					'parent'                 => $parent,
					'attributes'             => $attributes,
					'manage_stock'           => $manage_stock,
					'variations'             => $variations,
					'use_different_currency' => $use_different_currency,
					'currency'               => $currency,
					'decimals'               => $decimals,
					'product_id'             => $product_id,
					'wc_currency_symbol'     => $wc_currency_symbol,
					'wc_decimals'            => $wc_decimals,
				),
				'',
				TMDSPRO_TEMPLATES );
			$result['split_option']     = $split_option;
			$result['variations_count'] = self::$variations_count;
		}
		wp_send_json( $result );
	}

	/**
	 * @return mixed|void
	 */
	public static function get_url() {
		return apply_filters( 'villetheme_' . self::$prefix . '_import_list_page_url', add_query_arg( array( 'page' => self::$prefix ), admin_url( 'admin.php' ) ) );
	}

	public static function page_callback() {
		$user     = wp_get_current_user();
		$per_page = (int) $user->get( self::$prefix . '_import_list_per_page' );
		if ( empty ( $per_page ) || $per_page < 1 ) {
			$per_page = 20;
		}
		$paged     = isset( $_GET['paged'] ) ? (int) sanitize_text_field( wp_unslash( $_GET['paged'] ) ) : 1;// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$args      = array(
			'post_type'      => self::$prefix . '_draft_product',
			'post_status'    => array( 'draft', 'override' ),
			'order'          => 'DESC',
			'orderby'        => 'date',
			'fields'         => 'ids',
			'posts_per_page' => $per_page,
			'paged'          => $paged,
		);
		$search_id = isset( $_GET[ self::$prefix . '_search_id' ] ) ? sanitize_text_field( wp_unslash( $_GET[ self::$prefix . '_search_id' ] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$keyword   = isset( $_GET[ self::$prefix . '_search' ] ) ? sanitize_text_field( wp_unslash( $_GET[ self::$prefix . '_search' ] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( $search_id ) {
			$args['post__in']       = array( $search_id );
			$args['posts_per_page'] = 1;
			$keyword                = '';
		} else if ( $keyword ) {
			$args['s'] = $keyword;
		}
		$the_query   = TMDSPRO_Post::query( $args );
		$product_ids = $the_query->get_posts();
		$count       = $the_query->found_posts;
		$total_page  = $the_query->max_num_pages;
		wp_reset_postdata();
		?>
        <div class="wrap tmds-import-list-wrap">
            <h2 class="tmds-import-list-head">
				<?php
				esc_html_e( 'Import List', 'tmds-woocommerce-temu-dropshipping' );
				if ( ! $search_id && ! $keyword && $paged === 1 ) {
					?>
                    <div class="tmds-import-list-head-action">
						<?php self::$settings::chrome_extension_buttons(); ?>
                    </div>
					<?php
				}
				?>
            </h2>
			<?php
			if ( is_array( $product_ids ) && ! empty( $product_ids ) ) {
				/*After a product is imported, its html content(Import list) will be removed*/
				/*The first wp_editor call includes css file for all editors so call it here and hide it so that editor css is not removed after the first product is imported*/
				wc_get_template( 'admin/html-import-list-header-section.php',
					array(
						'count'      => $count,
						'total_page' => $total_page,
						'paged'      => $paged,
						'per_page'   => $per_page,
						'keyword'    => $keyword,
					),
					'',
					TMDSPRO_TEMPLATES );
				$wc_decimals            = wc_get_price_decimals();
				$wc_decimals            = $wc_decimals < 1 ? 1 : pow( 10, ( - 1 * $wc_decimals ) );
				$key                    = 0;
				$currency               = 'USD';
				$wc_currency            = get_woocommerce_currency();
				$wc_currency_symbol     = get_woocommerce_currency_symbol( $wc_currency );
				$use_different_currency = false;
				extract( [
					'product_import_video'          => self::$settings->get_params( 'product_import_video' ),
					'product_import_review'         => self::$settings->get_params( 'product_import_review' ),
					'product_import_specifications' => self::$settings->get_params( 'product_import_specifications' ),
					'default_select_image'          => self::$settings->get_params( 'product_gallery' ),
					'product_status'                => self::$settings->get_params( 'product_status' ),
					'product_sku'                   => self::$settings->get_params( 'product_sku' ),
					'product_shipping_class'        => self::$settings->get_params( 'product_shipping_class' ),
					'catalog_visibility'            => self::$settings->get_params( 'catalog_visibility' ),
					'manage_stock'                  => self::$settings->get_params( 'manage_stock' ),
					'product_tags'                  => self::$settings->get_params( 'product_tags' ),
					'product_categories'            => self::$settings->get_params( 'product_categories' ),
					'product_import_cat'            => self::$settings->get_params( 'product_import_cat' ),
					'category_options'              => self::$settings::get_product_categories(),
					'tags_options'                  => self::$settings::get_product_tags(),
					'shipping_class_options'        => self::$settings::get_shipping_class_options(),
					'catalog_visibility_options'    => self::$settings::get_catalog_visibility_options(),
					'product_status_options'        => self::$settings::get_product_status_options(),
				] );
				do_action( 'tmds_import_list_before_products_list' );
				printf( '<div class="vi-ui segment tmds-import-list">' );
				foreach ( $product_ids as $product_id ) {
					$parent     = [];
					$product    = TMDSPRO_Post::get_post( $product_id );
					$attributes = self::get_product_attributes( $product_id );
					if ( is_array( $attributes ) && count( $attributes ) ) {
						foreach ( $attributes as $attribute_k => $attribute_v ) {
							$parent[ $attribute_k ] = $attribute_v['slug'] ?? '';
						}
					}
					$import_info     = TMDSPRO_Post::get_post_meta( $product_id, '_' . self::$settings::$prefix . '_import_info', true );
					$currency        = $import_info['currency_code'] ?? $currency;
					$currency_symbol = $import_info['currency_symbol'] ?? '';
					$decimals        = $import_info['currency_decimals'] ?? 2;
					$decimals        = $decimals < 1 ? 1 : pow( 10, ( - 1 * $decimals ) );
					if ( self::$settings::strtolower( $wc_currency ) != self::$settings::strtolower( $currency ) ) {
						$use_different_currency = true;
					}
					$custom_pd_options = [];
					$gallery           = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_gallery', true );
					if ( ! $gallery || ! is_array( $gallery ) ) {
						$gallery = [];
					}
					$desc_images      = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_description_images', true );
					$variation_images = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_variation_images', true );
					$price_alert      = false;
					$accordion_class  = [
						'vi-ui',
						'styled',
						'fluid',
						'accordion',
						'active',
						'tmds-accordion',
						'tmds-product-row'
					];
					if ( $price_alert ) {
						$accordion_class['personalization'] = 'tmds-product-price-alert';
					}
					$product_type        = $product->post_status;
					$override_product_id = $product->post_parent;
					$override_product    = '';
					if ( $product_type === 'override' && $override_product_id ) {
						$override_product = TMDSPRO_Post::get_post( $override_product_id );
						if ( ! $override_product || $product_id != TMDSPRO_Post::get_post_meta( $override_product_id, '_tmds_override_id', true ) ) {
							$product_type        = 'draft';
							$override_product_id = $override_product = '';
							TMDSPRO_Post::update_post( array(
								'ID'          => $product_id,
								'post_parent' => 0,
								'post_status' => $product_type,
							) );
						}
					}
					$reviews = $specifications = $video = '';
					if ( $product_import_specifications ) {
						$specifications = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_specifications', true );
						if ( ! is_array( $specifications ) || empty( $specifications ) ) {
							$specifications = '';
						}
					}
					if ( $product_import_review && ! $override_product ) {
						$reviews = self::get_product_reviews( $product_id );
						if ( ! is_array( $reviews ) || empty( $reviews ) ) {
							$reviews = '';
						}
					}
					if ( $product_import_video ) {
						$video = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_video', true );
						if ( ! is_array( $video ) || empty( $video ) ) {
							$video = '';
						}
					}
					if ( $product_import_cat ) {
						$tmp_cats = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_categories', true );
						if ( is_array( $tmp_cats ) && ! empty( $tmp_cats ) ) {
							$product_categories = $tmp_cats;
						}
					}
					$arg = array(
						'wc_decimals'                => $wc_decimals,
						'wc_currency_symbol'         => $wc_currency_symbol,
						'currency'                   => $currency,
						'decimals'                   => $decimals,
						'use_different_currency'     => $use_different_currency,
						'product_shipping_class'     => $product_shipping_class,
						'shipping_class_options'     => $shipping_class_options,
						'catalog_visibility_options' => $catalog_visibility_options,
						'catalog_visibility'         => $catalog_visibility,
						'category_options'           => $category_options,
						'tags_options'               => $tags_options,
						'product_status_options'     => $product_status_options,
						'product_status'             => $product_status,
						'product_tags'               => $product_tags,
						'product_categories'         => $product_categories,
						'accordion_class'            => $accordion_class,
						'product_id'                 => $product_id,
						'product'                    => $product,
						'override_product'           => $override_product,
						'override_product_id'        => $override_product_id,
						'price_alert'                => $price_alert,
						'key'                        => $key,
						'sku'                        => TMDSPRO_Post::get_post_meta( $product_id, '_tmds_sku', true ),
						'store_info'                 => TMDSPRO_Post::get_post_meta( $product_id, '_tmds_store_info', true ),
						'import_info'                => [
							$import_info['region_name'] ?? $import_info['region_code'] ?? $import_info['temu_locale_settings']['region']['name'] ?? '',
							$import_info['language_name'] ?? $import_info['temu_locale_settings']['language']['name'] ?? '',
							$currency_symbol ? $currency_symbol . '(' . $currency . ')' : $currency
						],
						'gallery'                    => $gallery,
						'default_select_image'       => $default_select_image,
						'image'                      => isset( $gallery[0] ) ? $gallery[0] : '',
						'variations'                 => self::get_product_variations( $product_id ),
						'variation_images'           => ! $variation_images ? [] : array_values( array_unique( $variation_images ) ),
						'desc_images'                => ! $desc_images ? [] : array_values( array_unique( $desc_images ) ),
						'is_variable'                => is_array( $parent ) && ! empty( $parent ),
						'manage_stock'               => $manage_stock,
						'attributes'                 => $attributes,
						'specifications'             => $specifications,
						'video'                      => $video,
						'reviews'                    => $reviews,
						'custom_pd_options'          => $custom_pd_options,
					);
					if ( empty( $arg['is_variable'] ) && ! empty( $arg['variations'][0]['sku'] ) ) {
						$product_sku_tmp = $arg['variations'][0]['sku'];
					} else {
						$product_sku_tmp = $arg['sku'] ?? '';
					}
					$product_sku_tmp = str_replace( '{temu_product_id}', $product_sku_tmp, $product_sku );
					$split_attribute = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_split_attribute', true );
					if ( $split_attribute ) {
						$product_sku_tmp .= '-' . $split_attribute;
					}
					$arg['product_sku'] = $product_sku_tmp;
					wc_get_template( 'admin/html-import-list-item.php', $arg, '', TMDSPRO_TEMPLATES );
					$key ++;
				}
				printf( '</div>' );
				wc_get_template( 'admin/html-import-list-bulk-action-modal.php',
					array(
						'category_options'       => $category_options,
						'tags_options'           => $tags_options,
						'shipping_class_options' => $shipping_class_options,
					),
					'',
					TMDSPRO_TEMPLATES );
				wc_get_template( 'admin/html-import-list-override-options.php',
					array(
						'settings' => self::$settings,
					),
					'',
					TMDSPRO_TEMPLATES );
			} else {
				?>
                <div class="vi-ui small segment">
                    <p><?php esc_html_e( 'No products found', 'tmds-woocommerce-temu-dropshipping' ); ?></p>
                </div>
				<?php
			}
			?>
        </div>
		<?php
	}

	public static function simple_product_price_field_html( $key, $manage_stock, $variations, $use_different_currency, $currency, $decimals, $product_id, $wc_currency_symbol, $wc_decimals ) {
		if ( empty( $variations ) ) {
			return;
		}
		$variation               = $variations[0];
		$inventory               = min( floatval( $variation['stock'] ), floatval( $variation['limit_qty'] ) );
		$variation_sale_price    = self::$settings::string_to_float( $variation['sale_price'] ?? 0 );
		$variation_regular_price = self::$settings::string_to_float( $variation['regular_price'] );
		if ( ! empty( $variation['is_on_sale'] ) && $variation_sale_price ) {
			$import_price      = $variation_sale_price;
			$import_price_html = $variation['sale_price_html'] ?? '';
		} else {
			$import_price      = $variation_regular_price;
			$import_price_html = $variation['regular_price_html'] ?? '';
		}
		$price     = TMDSPRO_Price::process_exchange_price( $import_price, $currency );
		$cost_html = $import_price_html;
		if ( $use_different_currency ) {
			$cost_html = wc_price( $price );
			$cost_html = $import_price_html ? "{$import_price_html}({$cost_html})" : wc_price( $import_price, [
					'currency'     => $currency,
					'decimals'     => $decimals,
					'price_format' => '%1$s&nbsp;%2$s'
				] ) . '(' . $cost_html . ')';
		}
		$sale_price    = TMDSPRO_Price::process_price( $price, true );
		$regular_price = TMDSPRO_Price::process_price( $price );
		?>
        <div class="field tmds-simple-product-price-field">
            <input type="hidden"
                   name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][0][skuId]' ) ?>"
                   value="<?php echo esc_attr( $variation['skuId'] ?? '' ) ?>">
            <div class="equal width fields">
                <div class="field">
                    <label><?php esc_html_e( 'Cost', 'tmds-woocommerce-temu-dropshipping' ); ?></label>
                    <div class="tmds-price-field">
						<?php echo wp_kses( $cost_html, TMDSPRO_DATA::filter_allowed_html() ) ?>
                    </div>
                </div>
                <div class="field">
                    <label><?php esc_html_e( 'Sale price', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                    <div class="vi-ui left labeled input">
                        <label for="amount"
                               class="vi-ui label"><?php echo esc_html( $wc_currency_symbol ) ?></label>
                        <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                               value="<?php echo esc_attr( is_numeric( $sale_price ) ? $sale_price : '' ) ?>"
                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][0][sale_price]' ) ?>"
                               class="tmds-import-data-variation-sale-price">
                    </div>
                </div>
                <div class="field">
                    <label><?php esc_html_e( 'Regular price', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                    <div class="vi-ui left labeled input">
                        <label for="amount"
                               class="vi-ui label"><?php echo esc_html( $wc_currency_symbol ) ?></label>
                        <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                               value="<?php echo esc_attr( $regular_price ) ?>"
                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][0][regular_price]' ) ?>"
                               class="tmds-import-data-variation-regular-price">
                    </div>
                </div>
				<?php
				if ( $manage_stock ) {
					?>
                    <div class="field">
                        <label><?php esc_html_e( 'Inventory', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                        <input type="number" min="0" step="<?php echo esc_attr( $wc_decimals ) ?>"
                               value="<?php echo esc_attr( $inventory ) ?>"
                               name="<?php echo esc_attr( 'tmds_product[' . $product_id . '][variations][0][stock]' ) ?>"
                               class="tmds-import-data-variation-inventory">
                    </div>
					<?php
				}
				?>
            </div>
        </div>
		<?php
	}

	public static function get_product_reviews( $product_id ) {
		if ( ! self::$settings->get_params( 'product_import_review' ) ) {
			return [];
		}
		$tmp = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_review', true );
		if ( ! empty( $tmp['reviews'] ) && is_array( $tmp['reviews'] ) ) {
			$reviews = [];
			$limit   = self::$settings->get_params( 'product_review_limit' );
			if ( ! $limit ) {
				return [];
			}
			$limit = intval( $limit );
			$rates = self::$settings->get_params( 'product_review_rating' );
			if ( empty( $rates ) || ! is_array( $rates ) ) {
				$rates = [ 5, 4, 3, 2, 1 ];
			}
			$skip_empty = self::$settings->get_params( 'product_review_skip_empty' );
			foreach ( $tmp['reviews'] as $review ) {
				if ( empty( $review['review_id'] ) ) {
					continue;
				}
				$comment = ! empty( $review['review_lang']['translate_comment'] ) ? $review['review_lang']['translate_comment'] : ( $review['comment'] ?? '' );
				if ( ! $comment && $skip_empty ) {
					continue;
				}
				$review['tmds_comment'] = $comment;
				$rate                   = $review['score'] ?? '5';
				if ( ! in_array( $rate, $rates ) ) {
					continue;
				}
				$reviews[ $review['review_id'] ] = $review;
				$limit --;
				if ( ! $limit ) {
					break;
				}
			}
		}

		return $reviews ?? [];
	}

	public static function get_product_variations( $product_id ) {
		$variations = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_variations', true );
		if ( is_array( $variations ) && ! empty( $variations ) ) {
			foreach ( $variations as $key => $value ) {
				if ( ! empty( $value['attributes_edited'] ) ) {
					$variations[ $key ]['attributes'] = $value['attributes_edited'];
					unset( $variations[ $key ]['attributes_edited'] );
				}
			}
		}

		return $variations;
	}

	public static function get_product_attributes( $product_id ) {
		$attributes = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_attributes', true );
		if ( is_array( $attributes ) && ! empty( $attributes ) ) {
			foreach ( $attributes as $key => $value ) {
				if ( ! empty( $value['slug_edited'] ) ) {
					$attributes[ $key ]['slug'] = $value['slug_edited'];
					unset( $attributes[ $key ]['slug_edited'] );
				}
				if ( ! empty( $value['name_edited'] ) ) {
					$attributes[ $key ]['name'] = $value['name_edited'];
					unset( $attributes[ $key ]['name_edited'] );
				}
				if ( ! empty( $value['title_edited'] ) ) {
					$attributes[ $key ]['title'] = $value['title_edited'];
					unset( $attributes[ $key ]['title_edited'] );
				}
				if ( ! empty( $value['values_edited'] ) ) {
					$attributes[ $key ]['values'] = $value['values_edited'];
					unset( $attributes[ $key ]['values_edited'] );
				}
			}
		}

		return $attributes;
	}

	public static function screen_options_page() {
		add_screen_option( 'per_page', array(
			'label'   => esc_html__( 'Number of items per page', 'tmds-woocommerce-temu-dropshipping' ),
			'default' => 5,
			'option'  => self::$prefix . '_import_list_per_page'
		) );
	}

	public function marketplace_suggestions_products_empty_state() {
		self::$settings::enqueue_script(
			array( self::$prefix . '-admin-settings' ),
			array( 'admin-settings' ),
		);
		wp_localize_script( self::$prefix . '-admin-settings', 'tmds_params', array(
			'go_to_tmds_bt' => sprintf( '<a target="_blank" href="https://www.temu.com/" class="woocommerce-BlankState-cta button tmds-import-products">%s</a>', esc_html__( 'Go to Temu Products', 'tmds-woocommerce-temu-dropshipping' ) )
		) );
	}

	/**
	 * Add notices when images are being imported, when images are in the queue but not processed, when images are all imported or when cron is late
	 */
	public function admin_notices() {
		if ( self::$process_image->is_process_running() ) {
			$is_late = false;
			$next    = wp_next_scheduled( 'wp_' . self::$prefix . '_background_download_images_cron' );
			if ( $next ) {
				$late = $next - time();
				if ( $late < - 300 ) {
					$is_late = true;
				}
			}
			if ( $is_late ) {
				?>
                <div class="notice notice-error">
                    <p>
						<?php
						/* translators: 1: plugin name. 2: href */
						printf( wp_kses_post( __( '<strong>%1$s</strong>: <i>wp_%2$s_background_download_images_cron</i> is late, queued product images may not be processed. If you want to move all queued images to Failed images page to handle them manually, please click <a href="%3$s">Move</a>',
							'tmds-woocommerce-temu-dropshipping' ) ), esc_attr( TMDSPRO_NAME ), esc_html( self::$prefix ), esc_url( wp_nonce_url( add_query_arg( array( self::$prefix . '_move_queued_images' => 1 ) ) ) ) );
						?>
                    </p>
                </div>
				<?php
			} else {
				?>
                <div class="notice notice-warning">
                    <p>
						<?php
						/* translators: %s: plugin name */
						printf( wp_kses_post( __( '<strong>%s</strong>: Product images are still being processed in the background, please do not edit products/go to product edit page until all images are processed completely.',
							'tmds-woocommerce-temu-dropshipping' ) ), wp_kses_post( TMDSPRO_NAME ) );
						?>
                    </p>
                </div>
				<?php
			}
		} else {
			if ( self::$process_image->is_queue_empty() ) {
				if ( get_transient( 'villatheme_' . self::$prefix . '_background_download_images_complete' ) ) {
					delete_transient( 'villatheme_' . self::$prefix . '_background_download_images_complete' );
					?>
                    <div class="updated">
                        <p>
							<?php
							/* translators: %s: plugin name*/
							printf( wp_kses_post( __( '<strong>%s</strong>: Finish processing product images', 'tmds-woocommerce-temu-dropshipping' ) ), wp_kses_post( TMDSPRO_NAME ) );
							?>
                        </p>
                    </div>
					<?php
				}
			} else {
				?>
                <div class="notice notice-warning">
                    <p>
						<?php
						/* translators: 1: plugin name. 2: href */
						printf( wp_kses_post( __( '<strong>%1$s</strong>: There are still images in the queue but background process is not running. <a href="%2$s">Run</a> or <a href="%3$s">Move to Failed images</a>',
							'tmds-woocommerce-temu-dropshipping' ) ), wp_kses_post( TMDSPRO_NAME ), esc_url( wp_nonce_url( add_query_arg( array( self::$prefix . '_run_download_product_image' => 1 ) ) ) ),
							esc_url( wp_nonce_url( add_query_arg( array( self::$prefix . '_move_queued_images' => 1 ) ) ) ) ) ?>
                    </p>
                </div>
				<?php
			}
		}
	}

	public function menu_product_count() {
		global $submenu;
		if ( isset( $submenu[ self::$prefix ] ) ) {
			// Add count if user has access.
			if ( apply_filters( 'villatheme_' . self::$prefix . '_product_count_in_menu', true )
			     || current_user_can( apply_filters( 'villatheme_' . self::$prefix . '_admin_sub_menu_capability', 'manage_woocommerce', self::$prefix . '-import-list' ) )
			) {
				$count         = TMDSPRO_Post::count_posts( 'tmds_draft_product', 'readable' );
				$product_count = floatval( $count->draft ?? 0 ) + floatval( $count->override ?? 0 );
				foreach ( $submenu[ self::$prefix ] as $key => $menu_item ) {
					if ( ! empty( $menu_item[2] ) && $menu_item[2] === self::$prefix ) {
						$count_label                         = sprintf( " <span class='update-plugins count-%s'><span class='%s-import-list-count'>%s</span></span>",
							esc_attr( $product_count ), esc_attr( self::$prefix ), esc_html( number_format_i18n( $product_count ) ) );
						$submenu[ self::$prefix ][ $key ][0] .= $count_label;
					}
				}
			}
		}
	}

	public function empty_import_list() {
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( ! empty( $_GET[ self::$prefix . '_empty_product_list' ] ) && $page === self::$prefix ) {
			if ( isset( $_GET['_wpnonce'] ) && wp_verify_nonce( sanitize_key( $_GET['_wpnonce'] ) ) ) {
				TMDSPRO_Post::empty_import_list();
				wp_safe_redirect( admin_url( "admin.php?page={$page}" ) );
				exit();
			}
		}
	}

	/**
	 * Move all images that are process in the background to Failed images so that they can be imported manually
	 */
	public function move_queued_images() {
		global $wpdb;
		$prefix = self::$prefix;
		if ( ! empty( $_GET[ $prefix . '_move_queued_images' ] ) ) {
			$nonce = isset( $_GET['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ) : '';
			if ( wp_verify_nonce( $nonce ) ) {
				$results = $wpdb->get_results(// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
					$wpdb->prepare( 'select * from %i where option_name like %s', [ "{$wpdb->prefix}options", "%{$prefix}_background_download_images_batch%" ] )
					, ARRAY_A );
				foreach ( $results as $result ) {
					$images = maybe_unserialize( $result['option_value'] );
					$delete = false;
					foreach ( $images as $image ) {
						if ( get_post_type( $image['woo_product_id'] ) === 'product' ) {
							if ( TMDSPRO_Error_Images_Table::insert( $image['woo_product_id'], implode( ',', $image['product_ids'] ), $image['src'],
								intval( $image['set_gallery'] ) )
							) {
								$delete = true;
							}
						} else {
							$delete = true;
						}
					}
					if ( $delete ) {
						delete_option( $result['option_name'] );
					}
				}
				wp_safe_redirect( remove_query_arg( array( $prefix . '_move_queued_images', '_wpnonce' ) ) );
				exit();
			}
		}
	}

	public function background_process() {
		self::$process_image = TMDSPRO_Download_Images::instance();

		$nonce = isset( $_REQUEST['_wpnonce'] ) ? sanitize_key( wp_unslash( $_REQUEST['_wpnonce'] ) ) : '';

		if ( wp_verify_nonce( $nonce ) ) {
			if ( ! empty( $_REQUEST[ self::$prefix . '_cancel_download_product_image' ] ) ) {
				self::$process_image->kill_process();
				wp_safe_redirect( @remove_query_arg( array( self::$prefix . '_cancel_download_product_image', '_wpnonce' ) ) );
				exit;
			}

			if ( ! empty( $_REQUEST[ self::$prefix . '_run_download_product_image' ] ) ) {
				if ( ! self::$process_image->is_process_running() && ! self::$process_image->is_queue_empty() ) {
					self::$process_image->dispatch();
				}
				wp_safe_redirect( @remove_query_arg( array( self::$prefix . '_run_download_product_image', '_wpnonce' ) ) );
				exit;
			}
		}
	}
}