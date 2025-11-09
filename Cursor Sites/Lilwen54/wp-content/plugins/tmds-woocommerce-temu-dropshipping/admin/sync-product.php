<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Sync_Product {
	protected static $settings, $is_excluded;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
	}

	/**
	 * @param $product_ids
	 * @param $data
	 */
	public static function update_product_by_id( $product_ids, $data, &$status, &$message ) {
		if ( ! self::$settings ) {
			self::$settings = TMDSPRO_DATA::get_instance();
		}
		$product_id = $product_ids['id'] ?? '';
		if ( ! $product_id ) {
			$message = esc_html__( 'Not find product_id', 'tmds-woocommerce-temu-dropshipping' );

			return;
		}
		$prefix = self::$settings::$prefix;
		if ( empty( $product_ids['woo_product_id'] ) ) {
			$product_ids['woo_product_id'] = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_woo_id', true );
		}
		if ( empty( $product_ids['update_sku'] ) ) {
			$product_ids['update_sku'] = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_sku', true );
		}
		self::$settings::villatheme_set_time_limit();
		$woo_product_id = $product_ids['woo_product_id'];
		$update_sku     = $product_ids['update_sku'];
		do_action( 'villatheme_' . $prefix . '_before_sync_product', $product_ids );
		$view_url             = admin_url( "admin.php?page=tmds-imported&{$prefix}_search_woo_id={$woo_product_id}" );
		$imported_product_url = self::$settings::get_temu_pd_url( $product_id );
		$log_level            = WC_Log_Levels::INFO;
		$log                  = "Product <a href='{$view_url}' target='_blank'>#{$woo_product_id}</a>(Temu ID <a href='{$imported_product_url}' target='_blank'>{$update_sku}</a>): ";
		$log                  .= ob_get_clean();
		$update               = array(
			'time'          => time(),
			'status'        => 'hide',
			'not_available' => array(),
			'out_of_stock'  => array(),
			'price_changes' => array(),
			'price_exceeds' => array(),
		);
		$woo_product          = wc_get_product( $woo_product_id );
		$latest_variations    = $data['variations'] ?? array();
		if ( is_array( $latest_variations ) && ! empty( $latest_variations ) && $woo_product && $woo_product->get_meta( '_' . $prefix . '_product_id' ) == $update_sku ) {
			$excl_products           = self::$settings->get_params( 'sync_exclude_products' );
			$excl_categories         = self::$settings->get_params( 'sync_exclude_cat' );
			$categories              = $woo_product->get_category_ids();
			self::$is_excluded       = in_array( $woo_product_id, $excl_products ) || ! empty( array_intersect( $categories, $excl_categories ) );
			$variations              = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_variations', true );
			$item_log                = array();
			$product_log             = '';
			$all_variations_change   = false;
			$is_purchase             = true;
			$variations_skuId        = array_column( $variations, 'skuId' );
			$latest_variations_skuId = array_column( $latest_variations, 'skuId' );
			$currency                = $data['import_info']['currency_code'] ?? get_woocommerce_currency();
			switch ( $woo_product->get_type() ) {
				case 'variable':
					$woo_variations = $woo_product->get_children();
					if ( empty( $woo_variations ) ) {
						break;
					}
					$is_sync_variation = 0;
					$used_variations   = array();
					foreach ( $woo_variations as $variation_id ) {
						$woo_variation = wc_get_product( $variation_id );
						if ( ! $woo_variation ) {
							continue;
						}
						$sync_variation_id = $woo_variation->get_meta( '_' . $prefix . '_variation_id' );
						if ( ! $sync_variation_id ) {
							continue;
						}
						$is_sync_variation ++;
						$sync_variation_index   = array_search( $sync_variation_id, $variations_skuId );
						$latest_variation_index = array_search( $sync_variation_id, $latest_variations_skuId );
						if ( $latest_variation_index !== false && $sync_variation_index !== false ) {
							$used_variations[ $variation_id ] = $latest_variations[ $latest_variation_index ];
							self::process_product_to_update( $woo_variation, $sync_variation_index, $latest_variations[ $latest_variation_index ], $currency, $variations, $update, $item_log );
						} else {
							$update['not_available'][] = $variation_id;
							$item_log[]                = "#{$variation_id} original variation not found";
							self::update_product_if( $woo_variation, self::$settings->get_params( 'update_variation_if_not_available' ), $product_log );
						}
					}
					if ( $is_sync_variation > 0 ) {
						if ( $is_sync_variation === count( $update['not_available'] ) ) {
							$all_variations_change = true;
						}
						if ( $is_sync_variation === count( $update['out_of_stock'] ) ) {
							$update['status'] = 'is_out_of_stock';
						}
					}
					break;
				case 'simple':
					$sync_variation_id = $woo_product->get_meta( '_' . $prefix . '_variation_id' );
					if ( $sync_variation_id ) {
						$sync_variation_index   = array_search( $sync_variation_id, $variations_skuId );
						$latest_variation_index = array_search( $sync_variation_id, $latest_variations_skuId );
						if ( $latest_variation_index !== false && $sync_variation_index !== false ) {
							self::process_product_to_update( $woo_product, $sync_variation_index, $latest_variations[ $latest_variation_index ], $currency, $variations, $update, $item_log );
						} else {
							$update['not_available'][] = $woo_product_id;
							$all_variations_change     = true;
							$item_log[]                = "#{$woo_product_id} original variation not found";
						}
					} else {
						self::process_product_to_update( $woo_product, 0, $latest_variations[0], $currency, $variations, $update, $item_log );
					}
					if ( ! empty( $update['out_of_stock'] ) ) {
						$update['status'] = 'is_out_of_stock';
					}
					break;
			}
			if ( $update['status'] === 'is_offline' ) {
				$is_purchase = false;
				$log_level   = WC_Log_Levels::ALERT;
				$product_log = "Temu product is no longer available";
				self::update_product_if( $woo_product, self::$settings->get_params( 'update_product_if_not_available' ), $product_log );
			} elseif ( ! empty( $update['not_available'] ) ) {
				if ( $all_variations_change ) {
					$is_purchase = false;
					$log_level   = WC_Log_Levels::ALERT;
					self::update_product_if( $woo_product, self::$settings->get_params( 'update_product_if_not_available' ), $product_log );
				}
			} elseif ( $update['status'] === 'is_out_of_stock' ) {
				$is_purchase = false;
				$log_level   = WC_Log_Levels::WARNING;
				$product_log = "Temu product is out of stock";
				self::update_product_if( $woo_product, self::$settings->get_params( 'update_product_if_out_of_stock' ), $product_log );
			}
			if ( $is_purchase ) {
				$update_product_if_available_purchase = self::$settings->get_params( 'update_product_if_available_purchase' );
				if ( $woo_product->get_status( 'edit' ) !== $update_product_if_available_purchase ) {
					$product_log = "Temu product is available for purchase";
					self::update_product_if( $woo_product, $update_product_if_available_purchase, $product_log );
				}
			}
			$status  = 'success';
			$message = $log;
			if ( $product_log ) {
				$log     .= $product_log;
				$message .= $product_log;
			} elseif ( ! empty( $item_log ) ) {
				$message .= implode( '<br>', $item_log );
				$log     .= implode( PHP_EOL, $item_log );
			} else {
				$log     .= 'OK';
				$message .= 'OK';
			}
			TMDSPRO_Post::update_post_meta( $product_id, '_' . $prefix . '_variations', $variations );
			do_action( 'villatheme_' . $prefix . '_sync_product_successful', $product_ids, $latest_variations, $data );
		} else {
			$update['status'] = 'not_available';
			$message          = "Temu product is no longer available";
			$log              .= $message;
			if ( $woo_product ) {
				self::update_product_if( $woo_product, self::$settings->get_params( 'update_product_if_not_available' ), $log );
			}
		}
		if ( get_transient( 'villatheme_' . $prefix . '_start_sync_products' ) ) {
			$synced_ids = get_transient( 'villatheme_' . $prefix . '_synced_product_ids' );
			$synced_ids = $synced_ids ? villatheme_json_decode( $synced_ids ) : array();
			if ( ! in_array( $product_id, $synced_ids ) ) {
				$synced_ids[] = $product_id;
			}
			set_transient( 'villatheme_' . $prefix . '_synced_product_ids', villatheme_json_encode( $synced_ids ), 86400 );
			if ( TMDSPRO_Post::count_posts()->publish == count( $synced_ids ) ) {
				delete_transient( 'villatheme_' . $prefix . '_synced_product_ids' );
				delete_transient( 'villatheme_' . $prefix . '_start_sync_products' );
			}
		}
		do_action( 'villatheme_' . $prefix . '_after_sync_product', $product_ids );
		TMDSPRO_Admin_Log::wc_log( $log, 'manual-products-sync', $log_level );
		TMDSPRO_Post::update_post_meta( $product_id, '_' . $prefix . '_update_product_notice', $update );
	}

	/**
	 * Sync products
	 *
	 * @param $product WC_Product
	 * @param $sync_variation_index
	 * @param $latest_variation
	 * @param $variations
	 * @param $update
	 * @param $log
	 */
	private static function process_product_to_update( $product, $sync_variation_index, $latest_variation, $currency, &$variations, &$update, &$log ) {
		$update_product_price = self::$settings->get_params( 'sync_product_price' );
		$save                 = false;
		$woo_id               = $product->get_id();
		if ( isset( $latest_variation['stock'] ) ) {
			$new_stock = floatval( $latest_variation['stock'] );
			if (isset($latest_variation['limit_qty'])){
				$new_stock = min( $new_stock, floatval( $latest_variation['limit_qty'] ) );
			}
			$variations[ $sync_variation_index ]['stock'] = $new_stock;
			if ( ! $new_stock ) {
				$update['out_of_stock'][] = $woo_id;
				$log[]                    = "#{$woo_id} Temu product is out of stock";
			}
			if ( self::$settings->get_params( 'sync_product_qty' ) && $product->managing_stock() ) {
				$old_stock = $product->get_stock_quantity();
				if ( $old_stock != $new_stock ) {
					$product->set_stock_quantity( $new_stock );
					$log[] = "#{$woo_id} has stock quantity changed from {$old_stock} to {$new_stock }";
					$save  = true;
				}
			}
		}
		$variations[ $sync_variation_index ]['sale_price']    = $latest_variation['sale_price'] ?? '';
		$variations[ $sync_variation_index ]['regular_price'] = $latest_variation['regular_price'] ?? '';
		$variation_sale_price                                 = self::$settings::string_to_float( $variations[ $sync_variation_index ]['sale_price'] ?? 0 );
		$variation_regular_price                              = self::$settings::string_to_float( $variations[ $sync_variation_index ]['regular_price'] );
		if ( ! empty( $variations[ $sync_variation_index ]['is_on_sale'] ) && $variation_sale_price ) {
			$import_price = $variation_sale_price;
		} else {
			$import_price = $variation_regular_price;
		}
		$price        = TMDSPRO_Price::process_exchange_price( $import_price, $currency );
		$price_change = self::handle_price( $product, $woo_id, $update_product_price, $price, $save, $log );
		if ( $price_change === 'skip' ) {
			$update['price_exceeds'][] = $woo_id;
		} elseif ( $price_change ) {
			$update['price_changes'][] = $woo_id;
			if ( ! $update_product_price ) {
				$log[] = "#{$woo_id} Temu product may have price changed";
			} else if ( self::$is_excluded === true ) {
				$log[] = "#{$woo_id} Temu product may have price changed but it's excluded from being synced";
			}
		}
		if ( $save ) {
			$product->save();
		}
	}

	/**
	 * @param $product WC_Product
	 * @param $woo_id
	 * @param $update_product_price
	 * @param float $price
	 * @param $save
	 * @param $log
	 *
	 * @return bool
	 */
	public static function handle_price( $product, $woo_id, $update_product_price, $price, &$save, &$log ) {
		$price_change      = false;
		$regular_price_old = $product->get_regular_price();
		$sale_price_old    = $product->get_sale_price();
		$sale_price        = TMDSPRO_Price::process_price( $price, true, $woo_id );
		$regular_price     = TMDSPRO_Price::process_price( $price, false, $woo_id );
		/*Compare old and new regular prices*/
		if ( $regular_price_old != $regular_price && $regular_price > 0 ) {
			if ( $update_product_price && ! self::$is_excluded ) {
				/*Update price if enabled*/
				$product->set_regular_price( $regular_price );
				$product->set_price( $regular_price );
				$log[] = "#{$woo_id} regular price changed from {$regular_price_old} to {$regular_price}";
				$save  = true;
			} else {
				$price_change = true;
			}
		}
		if ( $sale_price ) {
			/*If has sale price according to the new pricing rules*/
			if ( $sale_price_old != $sale_price && $sale_price < $regular_price ) {
				/*New sale price is valid and different from old sale price*/
				if ( $update_product_price && ! self::$is_excluded ) {
					$product->set_sale_price( $sale_price );
					$product->set_price( $sale_price );
					$log[] = "#{$woo_id} sale price changed from {$sale_price_old} to {$sale_price}";
					$save  = true;
				} else {
					$price_change = true;
				}
			} else {
				$sale_price_old = floatval( $sale_price_old );
				if ( $sale_price_old < $sale_price || $sale_price >= $regular_price ) {
					/*Remove old sale price*/
					if ( $update_product_price && ! self::$is_excluded ) {
						$product->set_sale_price( '' );
						$log[] = "#{$woo_id} sale price changed from {$sale_price_old} to null";
						$save  = true;
					}
				}
			}
		} elseif ( $sale_price_old !== '' ) {
			/*If there's no sale price after applying new pricing rules and old sale price exists, remove it*/
			$sale_price_old = floatval( $sale_price_old );
			if ( $update_product_price && ! self::$is_excluded ) {
				$product->set_sale_price( '' );
				$log[] = "#{$woo_id} sale price changed from {$sale_price_old} to null";
				$save  = true;
			}
		}

		return $price_change;
	}

	/**
	 * @param $woo_product WC_Product
	 * @param $option
	 * @param $log
	 */
	public static function update_product_if( $woo_product, $option, &$log ) {
		switch ( $option ) {
			case 'publish':
			case 'pending':
			case 'draft':
			case 'private':
			case 'trash':
				if ( ! $woo_product->is_type( 'variation' ) ) {
					$woo_product->set_status( $option );
					$woo_product->save();
					$log = "{$log}, Woo product status changed to {$option}";
				}
				break;
			case 'outofstock':
				if ( $woo_product->is_type( 'variable' ) ) {
					$variations = $woo_product->get_children();
					foreach ( $variations as $variation_id ) {
						$variation = wc_get_product( $variation_id );
						if ( ! $variation->managing_stock() ) {
							$variation->set_stock_status( 'outofstock' );
							$variation->save();
						} else {
							$variation->set_stock_quantity( 0 );
							$variation->save();
						}
					}
					$log = "{$log}, Woo product's stock status changed to out-of-stock";
				} elseif ( $woo_product->is_type( 'variation' ) ) {
					if ( ! $woo_product->managing_stock() ) {
						$woo_product->set_stock_status( 'outofstock' );
						$woo_product->save();
					} else {
						$woo_product->set_stock_quantity( 0 );
						$woo_product->save();
					}
				} else {
					if ( ! $woo_product->managing_stock() ) {
						$woo_product->set_stock_status( 'outofstock' );
						$woo_product->save();
						$log = "{$log}, Woo product's stock status changed to out-of-stock";
					} else {
						$woo_product->set_stock_quantity( 0 );
						$woo_product->save();
						$log = "{$log}, Woo product's stock status changed to out-of-stock";
					}
				}
				break;
			case 'disable':
				if ( $woo_product->is_type( 'variation' ) ) {
					$woo_product->set_status( 'private' );
					$woo_product->save();
				}
				break;
			default:
		}
	}

}