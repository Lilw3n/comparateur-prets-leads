<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Admin_Fulfill_Orders {
	private static $settings, $menu_slug;
	public static $order_status = 'to_order';

	public function __construct() {
		self::$settings  = TMDSPRO_DATA::get_instance();
		self::$menu_slug = self::$settings::$prefix . '-orders';
		add_action( 'admin_head', array( $this, 'menu_order_count' ) );
		add_filter( 'woocommerce_get_country_locale', array( $this, 'woocommerce_get_countries_locale' ),10,1 );
        foreach (['woocommerce_states','woocommerce_countries_allowed_country_states', 'woocommerce_countries_shipping_country_states'] as $hook) {
	        add_filter( $hook, array( $this, 'woocommerce_states' ), 10, 1 );
        }
	}
    public function woocommerce_states($states){
	    $enable_state = $this->enable_state();
	    if (is_array($enable_state) && !empty($enable_state)){
		    foreach ($enable_state as $country){
			    if (isset($states[$country]) && empty($states[$country])){
				    unset($states[$country]);
			    }
		    }
	    }
        return $states;
    }
    public function woocommerce_get_countries_locale($locale){
        $enable_state = $this->enable_state();
        if (is_array($enable_state) && !empty($enable_state)){
            foreach ($enable_state as $country){
	            if (isset($locale[$country]['state']['hidden'])){
		            unset( $locale[$country]['state']['hidden']);
	            }
            }
        }
        return $locale;
    }
    public function enable_state(){
        return ['CZ', 'KR'];
    }

	/**
	 * Menu count for fulfill orders
	 */
	public function menu_order_count() {
		global $submenu;
		if ( isset( $submenu['tmds'] ) ) {
			// Add count if user has access.
			if ( apply_filters( 'tmds_order_count_in_menu', true )
			     || current_user_can( apply_filters( 'tmds_admin_sub_menu_capability', 'manage_options', self::$menu_slug ) )
			) {
				$orders_count = self::$settings::get_fulfill_orders();
				foreach ( $submenu['tmds'] as $key => $menu_item ) {
					if ( ! empty( $menu_item[2] ) && $menu_item[2] === self::$menu_slug ) {
						$submenu['tmds'][ $key ][0] .= sprintf( '<span class="update-plugins count-%s"><span class="tmds-orders-count">%s</span></span>',
							esc_attr( $orders_count ), number_format_i18n( $orders_count ) ); // phpcs:ignoreStandard.Category.SniffName.ErrorCode
						break;
					}
				}
			}
		}
	}

	public static function page_callback() {
		$is_main = true;
		$user_id = get_current_user_id();
		$prefix  = self::$settings::$prefix;
		if ( $is_main ) {
			$screen   = get_current_screen();
			$option   = $screen->get_option( 'per_page', 'option' );
			$per_page = get_user_meta( $user_id, $option, true );
			if ( empty ( $per_page ) || $per_page < 1 ) {
				$per_page = $screen->get_option( 'per_page', 'default' );
			}
		} else {
			$per_page = get_user_meta( $user_id, $prefix . '_imported_per_page', true );
			if ( empty ( $per_page ) || $per_page < 1 ) {
				$per_page = 20;
			}
		}
		$paged = isset( $_GET['paged'] ) ? sanitize_text_field( wp_unslash( $_GET['paged'] ) ) : 1;// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		add_filter( 'posts_where', array( __CLASS__, 'filter_where' ), 10, 2 );
		add_filter( 'woocommerce_orders_table_query_clauses', [ __CLASS__, 'add_items_query' ] );
		$fulfill_order_status = self::$settings->get_params( 'fulfill_order_status' );
		$args                 = array(
			'post_type'      => 'shop_order',
			'post_status'    => 'any',
			'order'          => 'DESC',
			'return'         => 'ids',
			'posts_per_page' => $per_page,
			'paged'          => $paged,
			'paginate'       => true,
		);
		if ( $fulfill_order_status ) {
			$args['post_status'] = $fulfill_order_status;
		}
		$tmds_search_id = isset( $_GET['tmds_search_id'] ) ? sanitize_text_field( wp_unslash( $_GET['tmds_search_id'] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$keyword        = isset( $_GET['tmds_search'] ) ? sanitize_text_field( wp_unslash( $_GET['tmds_search'] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( $tmds_search_id ) {
			$args['post__in'] = array( $tmds_search_id );
			$keyword          = '';
		} else if ( $keyword ) {
			$order_ids = wc_order_search( $keyword );

			if ( ! empty( $order_ids ) ) {
				$args['post__in'] = array_merge( $order_ids, array( 0 ) );
			}
		}
		$query  = wc_get_orders( $args );
		$orders = $query->orders ?? [];
		$count  = $query->total ?? count( $orders );
		remove_filter( 'woocommerce_orders_table_query_clauses', array( __CLASS__, 'add_items_query' ), 10 );
		remove_filter( 'posts_where', array( __CLASS__, 'filter_where' ), 10 );
		remove_filter( 'posts_join', array( __CLASS__, 'posts_join' ), 10 );
		remove_filter( 'posts_distinct', array( __CLASS__, 'posts_distinct' ), 10 );
		$page_content = '';
		if ( ! empty( $orders ) ) {
			ob_start();
			?>
            <form method="get" class="vi-ui segment tmds-pagination-form">
                <input type="hidden" name="page" value="<?php echo esc_attr( self::$menu_slug ); ?>">
                <input type="hidden" name="order_status" value="<?php echo esc_attr( self::$order_status ) ?>">
                <div class="tablenav top">
                    <div class="tablenav-pages">
                        <div class="pagination-links">
							<?php
							$total_page = ceil( $count / $per_page );
							if ( $paged > 2 ) {
								?>
                                <a class="prev-page button" href="<?php echo esc_url( add_query_arg(
									array(
										'page'         => self::$menu_slug,
										'paged'        => 1,
										'tmds_search'  => $keyword,
										'order_status' => self::$order_status,
									), admin_url( 'admin.php' )
								) ) ?>"><span
                                            class="screen-reader-text"><?php esc_html_e( 'First Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span><span
                                            aria-hidden="true">«</span></a>
								<?php
							} else {
								?>
                                <span class="tablenav-pages-navspan button disabled" aria-hidden="true">«</span>
								<?php
							}
							/*Previous button*/
							if ( $per_page * $paged > $per_page ) {
								$p_paged = $paged - 1;
							} else {
								$p_paged = 0;
							}
							if ( $p_paged ) {
								$p_url = add_query_arg(
									array(
										'page'         => self::$menu_slug,
										'paged'        => $p_paged,
										'tmds_search'  => $keyword,
										'order_status' => self::$order_status,
									), admin_url( 'admin.php' )
								);
								?>
                                <a class="prev-page button" href="<?php echo esc_url( $p_url ) ?>"><span
                                            class="screen-reader-text"><?php esc_html_e( 'Previous Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span><span
                                            aria-hidden="true">‹</span></a>
								<?php
							} else {
								?>
                                <span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
								<?php
							}
							?>
                            <span class="screen-reader-text"><?php esc_html_e( 'Current Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                            <span id="table-paging" class="paging-input">
                                    <input class="current-page" type="text" name="paged" size="1"
                                           value="<?php echo esc_html( $paged ) ?>"><span class="tablenav-paging-text"> of <span
                                            class="total-pages"><?php echo esc_html( $total_page ) ?></span></span>
                                    </span>
							<?php /*Next button*/
							if ( $per_page * $paged < $count ) {
								$n_paged = $paged + 1;
							} else {
								$n_paged = 0;
							}
							if ( $n_paged ) {
								$n_url = add_query_arg(
									array(
										'page'         => self::$menu_slug,
										'paged'        => $n_paged,
										'tmds_search'  => $keyword,
										'order_status' => self::$order_status,
									), admin_url( 'admin.php' )
								); ?>
                                <a class="next-page button" href="<?php echo esc_url( $n_url ) ?>"><span
                                            class="screen-reader-text"><?php esc_html_e( 'Next Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span><span
                                            aria-hidden="true">›</span></a>
								<?php
							} else {
								?>
                                <span class="tablenav-pages-navspan button disabled" aria-hidden="true">›</span>
								<?php
							}
							if ( $total_page > $paged + 1 ) {
								?>
                                <a class="next-page button" href="<?php echo esc_url( add_query_arg(
									array(
										'page'         => self::$menu_slug,
										'paged'        => $total_page,
										'tmds_search'  => $keyword,
										'order_status' => self::$order_status,
									), admin_url( 'admin.php' )
								) ) ?>"><span
                                            class="screen-reader-text"><?php esc_html_e( 'Last Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span><span
                                            aria-hidden="true">»</span></a>
								<?php
							} else {
								?>
                                <span class="tablenav-pages-navspan button disabled" aria-hidden="true">»</span>
								<?php
							}
							?>
                        </div>
                    </div>
                    <p class="search-box">
                        <input type="search" class="text short" name="tmds_search"
                               placeholder="<?php esc_attr_e( 'Search order', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                               value="<?php echo esc_attr( $keyword ) ?>">
                        <input type="submit" name="submit" class="button"
                               value="<?php esc_attr_e( 'Search order', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    </p>
                </div>
            </form>
			<?php
			$pagination_html = ob_get_clean();
			$is_wpml         = false;
			global $sitepress;
			if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) ) {
				$default_lang     = apply_filters( 'wpml_default_language', null );
				$current_language = apply_filters( 'wpml_current_language', null );
				if ( $current_language && $current_language !== $default_lang ) {
					$is_wpml = true;
				}
			}
			$key                  = 0;
			$woocommerce_currency = get_option( 'woocommerce_currency' );
			foreach ( $orders as $order_id ) {
				$order = wc_get_order( $order_id );
				if ( ! $order ) {
					continue;
				}
				$order_id    = $order->get_id();
				$order_items = $order->get_items();
				if ( empty( $order_items ) ) {
					continue;
				}
				$fulfill_pid      = '';
				$order_currency   = $order->get_currency() ? $order->get_currency() : $woocommerce_currency;
				$order_items_html = '';
				$product_cost     = $shipping_total = $woo_line_total = $placeable_items_count = 0;
				foreach ( $order_items as $item_id => $item ) {
					$fulfill_order_id     = $item->get_meta( '_tmds_order_id', true );
					$fulfill_order_detail = $tracking_url = $tracking_url_btn = '';
					if ( $fulfill_order_id ) {
						$fulfill_order_detail = self::$settings::get_temu_url();//self::$settings::get_taobao_order_detail_url( $fulfill_order_id );
					}
					$item_tracking_data = $item->get_meta( '_vi_wot_order_item_tracking_data', true );
					$tracking_number    = '';
					if ( $item_tracking_data ) {
						$item_tracking_data    = TMDSPRO_DATA::json_decode( $item_tracking_data );
						$current_tracking_data = array_pop( $item_tracking_data );
						$tracking_number       = $current_tracking_data['tracking_number'];
					}
					$get_tracking = array( 'tmds-item-actions' );
					if ( ! $fulfill_order_id ) {
						$get_tracking[] = 'tmds-invisible';
					}
					$woo_product        = is_callable( array( $item, 'get_product' ) ) ? $item->get_product() : null;
					$is_fulfill_product = false;
					if ( $woo_product ) {
						$woo_product_id   = $item->get_product_id();
						$woo_variation_id = $item->get_variation_id();
						$wpml_product_id  = $wpml_variation_id = '';
						if ( $is_wpml ) {
							/*If this product is translated by WPML, only the original product has connection with Temu*/
							$wpml_object_id = apply_filters( 'wpml_object_id', $woo_product_id, 'product', false, $sitepress->get_default_language() );
							if ( $wpml_object_id != $woo_product_id ) {
								$wpml_product = wc_get_product( $wpml_object_id );
								if ( $wpml_product ) {
									$wpml_product_id = $wpml_object_id;
								}
							}
							if ( $woo_variation_id ) {
								$wpml_object_id = apply_filters( 'wpml_object_id', $woo_variation_id, 'product', false, $sitepress->get_default_language() );
								if ( $wpml_object_id != $woo_variation_id ) {
									$wpml_variation = wc_get_product( $wpml_object_id );
									if ( $wpml_variation ) {
										$wpml_variation_id = $wpml_object_id;
									}
								}
							}
						}
						$fulfill_product_id = get_post_meta( $wpml_product_id ?: $woo_product_id, "_{$prefix}_product_id", true );
						if ( $fulfill_product_id ) {
							$product_id = TMDSPRO_Post::get_post_id_by_woo_id( $wpml_product_id ?: $woo_product_id );
							if ( $product_id ) {
								$product_obj = TMDSPRO_Post::get_post( $product_id );
								if ( $product_obj ) {
									if ( $woo_variation_id ) {
										$fulfill_variation_id = wc_get_product( $wpml_variation_id ?: $woo_variation_id )->get_meta( '_tmds_variation_id' );
									} else {
										$fulfill_variation_id = wc_get_product( $wpml_product_id ?: $woo_product_id )->get_meta( '_tmds_variation_id' );
										//update_post_meta( $product_id, '_tmds_variation_id', $variations[0]['skuId'] );
									}
									$variations = (array) TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_variations", true );
									if ( ! empty( $variations ) ) {
										$is_fulfill_product = true;
										$import_info        = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_import_info", true );
										if ( count( $variations ) > 1 ) {
											$variation = [];
											foreach ( $variations as $variation_v ) {
												if ( isset( $variation_v['skuId'] ) && $variation_v['skuId'] == $fulfill_variation_id ) {
													$variation = $variation_v;
													break;
												}
											}
										} else {
											$variation = (array) $variations[0];
											if ( ! $fulfill_variation_id && ! empty( $variation['skuId'] ) ) {
												$fulfill_variation_id = $variation['skuId'];
											}
											if ( ! $fulfill_variation_id && ! empty( array_keys( $import_info['temu_variations'] ) ) ) {
												$fulfill_variation_id = array_keys( $import_info['temu_variations'] )[0];
											}
										}
										$order_item_class = array( 'tmds-order-item' );
										if ( ! empty( $variation ) ) {
											$currency = $order_currency;
											if ( ! empty( $import_info ) ) {
												$currency                = $import_info['currency_code'] ?? $currency;
												$product_import_info_tmp = [
													$import_info['region_name'] ?? $import_info['region_code'] ?? $import_info['temu_locale_settings']['region']['name'] ?? '',
												];
												$product_import_info     = implode( ' | ', $product_import_info_tmp );
											}
											$image                   = $woo_product->get_image();
											$quantity                = $item->get_quantity() + $order->get_qty_refunded_for_item( $item_id );
											$variation_sale_price    = ( $variation['sale_price'] ?? 0 );
											$variation_regular_price = ( $variation['regular_price'] ?? 0 );
											if ( ! empty( $variation['is_on_sale'] ) && $variation_sale_price ) {
												$import_price      = $variation_sale_price;
												$import_price_html = $variation['sale_price_html'] ?? '';
											} else {
												$import_price      = $variation_regular_price;
												$import_price_html = $variation['regular_price_html'] ?? '';
											}
											$price                = TMDSPRO_Price::process_exchange_price( $import_price, $currency );
											$cost_html            = wc_price( $price );
											$product_cost         += ( $price * $quantity );
											$item_sub_total       = $order->get_item_subtotal( $item, true, true ) * $quantity;
											$woo_line_total       += $item_sub_total;
											$woo_shipping_display = '-';
											$shipping_column_html = '';
											if ( ! $fulfill_order_id ) {
												if ( ! $fulfill_pid ) {
													$fulfill_pid = $wpml_product_id ?: $woo_product_id;
												}
												$placeable_items_count += 1;
											} else {
												$order_item_class[] = 'order-item-can-not-be-ordered';
											}
											ob_start();
											?>
                                            <tr class="<?php echo esc_attr( trim( implode( ' ', $order_item_class ) ) ); ?>"
                                                data-fulfill_variation_id="<?php echo esc_attr( $fulfill_variation_id ); ?>"
                                                data-fulfill_product_id="<?php echo esc_attr( $fulfill_product_id ); ?>"
                                                data-fulfill_region="<?php echo esc_attr( $import_info['region_code'] ?? '' ); ?>"
                                                data-order_currency="<?php echo esc_attr( $order_currency ); ?>"
                                                data-quantity="<?php echo esc_attr( $quantity ); ?>"
                                                data-order_item_id="<?php echo esc_attr( $item_id ); ?>">
                                                <td class="tmds-order-table-column"
                                                    data-column_name="check">
                                                    <input class="tmds-order-item-check"
                                                           type="checkbox" <?php echo esc_attr( $fulfill_order_id ? 'disabled' : '' ) ?>>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="image">
                                                    <div class="tmds-order-item-image">
														<?php echo wp_kses( $image, self::$settings::filter_allowed_html() ); ?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="name">
                                                    <div class="tmds-order-item-name"
                                                         title="<?php echo esc_attr( $product_obj->post_title ); ?>">
                                                        <a target="_blank"
                                                           href="<?php echo esc_url( self::$settings::get_temu_pd_url( $woo_product_id, true ) ) ?>">
															<?php echo esc_html( $product_obj->post_title ); ?>
                                                        </a>
                                                    </div>
													<?php
													$attribute = [];
													if ( isset( $variation['attributes'] ) && is_array( $variation['attributes'] ) ) {
														$attributes = $variation['attributes'];
														if ( ! empty( $attributes ) ) {
															foreach ( $attributes as $attribute_item ) {
																$attribute[] = $attribute_item['title'] ?? $attribute_item['id'];
															}
														}
														if ( ! empty( $attribute ) ) {
															$attribute = implode( ', ', $attribute );
														}
													}
													if ( $attribute ) {
														?>
                                                        <div class="tmds-order-item-variation">
                                                            <strong><?php echo esc_html( $attribute ); ?></strong>
                                                        </div>
														<?php
													}
													if ( $fulfill_variation_id ) {
														?>
                                                        <div class="tmds-order-item-sku">
                                                            <strong><?php esc_html_e( 'Sku: ', 'tmds-woocommerce-temu-dropshipping' ); ?></strong>
															<?php echo esc_html( $fulfill_variation_id ); ?>
                                                        </div>
														<?php
													}
													$notice_time    = '';
													$message_status = 'warning';
													$product_notice = (array) TMDSPRO_Post::get_post_meta( $product_id, '_tmds_update_product_notice', true );
													$message        = '';
													if ( ! empty( $product_notice ) ) {
														/*Notice generated are syncing products*/
														$notice_time = $product_notice['time'] ?? '';
														switch ( $product_notice['status'] ?? '' ) {
															case 'not_available':
																$message_status = 'negative';
																$message        = esc_html__( 'Temu product is no longer available', 'tmds-woocommerce-temu-dropshipping' );
																break;
															case 'is_out_of_stock':
																$message_status = 'negative';
																$message        = esc_html__( 'Temu product is out of stock', 'tmds-woocommerce-temu-dropshipping' );
																break;
															case 'hide':
																$tmp_product_ids = array( $wpml_product_id ?: $woo_product_id, $wpml_variation_id ?: $woo_variation_id );
																if ( ! empty( $product_notice['not_available'] ) && is_array( $product_notice['not_available'] ) &&
																     count( array_intersect( $product_notice['not_available'], $tmp_product_ids ) )
																) {
																	$message = esc_html__( 'Temu product is no longer available', 'tmds-woocommerce-temu-dropshipping' );
																} elseif ( ! empty( $product_notice['out_of_stock'] ) && is_array( $product_notice['out_of_stock'] ) &&
																           count( array_intersect( $product_notice['out_of_stock'], $tmp_product_ids ) )
																) {
																	$message = esc_html__( 'Temu product is out of stock', 'tmds-woocommerce-temu-dropshipping' );
																} elseif ( ! empty( $product_notice['price_changes'] ) && is_array( $product_notice['price_changes'] ) &&
																           count( array_intersect( $product_notice['price_changes'], $tmp_product_ids ) )
																) {
																	$message = esc_html__( 'Temu product has price changed', 'tmds-woocommerce-temu-dropshipping' );
																}
																break;
														}
													}
													if ( $message ) {
														?>
                                                        <div class="vi-ui message tmds-product-notice-message <?php echo esc_attr( $message_status ) ?>">
                                                            <div>
                                                <span>
                                                    <?php
                                                    echo esc_html( $message );
                                                    if ( $notice_time ) {
	                                                    $date_format = get_option( 'date_format' );
	                                                    if ( ! $date_format ) {
		                                                    $date_format = 'F j, Y';
	                                                    }
	                                                    ?>
                                                        <span class="tmds-product-notice-time">
                                                            <?php printf( esc_html__( '(%s)', 'tmds-woocommerce-temu-dropshipping' ),//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
	                                                            wp_kses( date_i18n( "{$date_format}", $notice_time ), self::$settings::filter_allowed_html() ) ); ?>
                                                        </span>
	                                                    <?php
                                                    }
                                                    ?>
                                                    <a href="<?php echo esc_url( admin_url( "admin.php?page=tmds-imported&post_status=publish&tmds_search_woo_id={$woo_product_id}" ) ) ?>"
                                                       target="_blank"
                                                       class="tmds-view-item-on-imported-page"
                                                       title="<?php esc_attr_e( 'View item on Imported page', 'tmds-woocommerce-temu-dropshipping' ); ?>">
                                                        <i class="icon eye"></i>
                                                    </a>
                                                </span>
                                                            </div>
                                                        </div>
														<?php
													}
													?>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="subtotal">
                                                    <div class="tmds-order-item-subtotal">
														<?php echo wp_kses( wc_price( $item_sub_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ); ?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="woo_shipping_cost">
                                                    <div class="tmds-woo-item-shipping">
														<?php
														echo wp_kses( $woo_shipping_display, self::$settings::filter_allowed_html() );
														?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="import_info">
                                                    <div class="tmds-order-item-import_info">
														<?php
														echo wp_kses( $product_import_info ?? '-', self::$settings::filter_allowed_html() );
														?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="cost">
                                                    <div class="tmds-order-item-cost">
														<?php
														if ( $currency != $order_currency ) {
															$cost_html = $import_price_html ? "{$import_price_html}( {$cost_html} )" :
																wc_price( TMDSPRO_Price::get_price_with_temu_decimals( $import_price, $currency ), [ 'currency' => $currency, ] ) . '( ' . $cost_html . ' )';
														}
														echo wp_kses( $cost_html, self::$settings::filter_allowed_html() );
														?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="quantity">
                                                    <div class="tmds-order-item-quantity">
                                                        <div>
                                                            <span>× </span><span><?php echo esc_html( $quantity ) ?></span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column tmds-hidden"
                                                    data-column_name="shipping">
                                                    <div class="tmds-order-item-shipping">
														<?php echo wp_kses( $shipping_column_html ?: '-', self::$settings::filter_allowed_html() ); ?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="fulfill_order">
                                                    <div class="tmds-item-order-container">
                                                        <div class="tmds-item-order-details tmds-item-order-id"
                                                             data-product_item_id="<?php echo esc_attr( $item_id ) ?>">
                                                            <div class="tmds-item-order-label">
                                                                <span><?php esc_html_e( 'Temu Order ID', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                                            </div>
                                                            <div class="tmds-item-order-value">
                                                                <a class="tmds-order-id"
                                                                   href="<?php echo esc_url( $fulfill_order_detail ) ?>"
                                                                   data-old_fulfill_order_id="<?php echo esc_attr( $fulfill_order_id ) ?>"
                                                                   target="_blank">
                                                                    <input readonly
                                                                           class="tmds-order-id-input"
                                                                           value="<?php echo esc_attr( $fulfill_order_id ) ?>">
                                                                </a>
                                                                <div class="tmds-item-actions">
                                                    <span class="dashicons dashicons-edit tmds-item-actions-edit"
                                                          title="<?php esc_attr_e( 'Edit', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                    <span class="dashicons dashicons-yes tmds-item-actions-save tmds-hidden"
                                                                          title="<?php esc_attr_e( 'Save', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                    <span class="dashicons dashicons-no-alt tmds-item-actions-cancel tmds-hidden"
                                                                          title="<?php esc_attr_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                </div>
                                                            </div>
                                                            <div class="tmds-item-order-value-overlay tmds-hidden"></div>
                                                        </div>
                                                        <div class="tmds-item-order-details tmds-item-tracking-number"
                                                             data-product_item_id="<?php echo esc_attr( $item_id ) ?>">
                                                            <div class="tmds-item-order-label">
                                                                <span><?php esc_html_e( 'Tracking number', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                                            </div>
                                                            <div class="tmds-item-order-value">
                                                                <a class="tmds-tracking-number"
                                                                   href="<?php echo esc_url( $tracking_url ) ?>"
                                                                   target="_blank">
                                                                    <input readonly
                                                                           class="tmds-tracking-number-input"
                                                                           value="<?php echo esc_attr( $tracking_number ) ?>">
                                                                </a>
                                                                <div class="<?php echo esc_attr( trim( implode( ' ', $get_tracking ) ) ) ?>">
                                                                    <a href="<?php echo esc_url( $tracking_url_btn ) ?>"
                                                                       target="_blank">
                                                        <span class="dashicons dashicons-arrow-down-alt tmds-item-actions-get-tracking"
                                                              title="<?php esc_attr_e( 'Get tracking', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
											<?php
											$order_items_html .= ob_get_clean();
										} else {
											$order_item_class[] = 'tmds-order-item-can-not-be-ordered';
											if ( ! $fulfill_pid ) {
												$fulfill_pid = $wpml_product_id ?: $woo_product_id;
											}
											$image          = $woo_product->get_image();
											$quantity       = $item->get_quantity();
											$item_sub_total = $order->get_item_subtotal( $item, true, true ) * $quantity;
											$woo_line_total += $item_sub_total;
											ob_start();
											?>
                                            <tr class="<?php echo esc_attr( trim( implode( ' ', $order_item_class ) ) ); ?>"
                                                data-cost=""
                                                data-quantity="<?php echo esc_attr( $quantity ); ?>"
                                                data-order_item_id="<?php echo esc_attr( $item_id ); ?>">
                                                <td class="tmds-order-table-column"
                                                    data-column_name="check">
                                                    <input class="tmds-order-item-check" type="checkbox" disabled>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="image">
                                                    <div class="tmds-order-item-image">
														<?php echo wp_kses( $image, self::$settings::filter_allowed_html() ); ?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="name">
                                                    <div class="tmds-order-item-name"
                                                         title="<?php echo esc_attr( $item->get_name() ); ?>">
                                                        <a target="_blank"
                                                           href="<?php echo esc_url( self::$settings::get_temu_pd_url( $wpml_product_id ?: $woo_product_id, true ) ) ?>">
															<?php echo esc_html( $item->get_name() ); ?>
                                                        </a>
                                                    </div>
													<?php
													if ( $woo_product->get_sku() ) {
														?>
                                                        <div class="tmds-order-item-sku">
                                                            <strong><?php esc_html_e( 'Sku: ', 'tmds-woocommerce-temu-dropshipping' ); ?></strong>
															<?php echo esc_html( $woo_product->get_sku() ); ?>
                                                        </div>
														<?php
													}
													if ( ! $fulfill_order_id ) {
														?>
                                                        <div class="vi-ui message negative"><?php esc_html_e( 'This item may be no longer available to order.',
																'tmds-woocommerce-temu-dropshipping' ); ?>
                                                            <a href="<?php echo esc_url( admin_url( "admin.php?page=tmds-imported&post_status=publish&tmds_search_woo_id={$woo_product_id}" ) ) ?>"
                                                               target="_blank"
                                                               class="tmds-view-item-on-imported-page"
                                                               title="<?php esc_attr_e( 'View item on Imported page', 'tmds-woocommerce-temu-dropshipping' ); ?>"><i
                                                                        class="icon eye"></i></a>
                                                        </div>
														<?php
													}
													?>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="subtotal">
                                                    <div class="tmds-order-item-subtotal">
														<?php echo wp_kses( wc_price( $item_sub_total, array( 'currency' => $order_currency ) ), self::$settings::filter_allowed_html() ); ?>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="woo_shipping_cost">
                                                    <div class="tmds-woo-item-shipping">
                                                        -
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="import_info">
                                                    <div class="tmds-order-item-import_info">
                                                        -
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column" data-column_name="cost">
                                                    <div class="tmds-order-item-cost">
                                                        -
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-column"
                                                    data-column_name="quantity">
                                                    <div class="tmds-order-item-quantity">
                                                        <div>
                                                            <span>× </span><span><?php echo esc_html( $item->get_quantity() ) ?></span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="tmds-order-table-colum tmds-hidden"
                                                    data-column_name="shipping">
                                                    <div class="tmds-order-item-shipping"></div>
                                                </td>
                                                <td class="vichiands-order-table-column"
                                                    data-column_name="fulfill_order">
                                                    <div class="tmds-item-order-container">
                                                        <div class="tmds-item-order-details tmds-item-order-id"
                                                             data-product_item_id="<?php echo esc_attr( $item_id ) ?>">
                                                            <div class="vichiands-item-order-label">
                                                                <span><?php esc_html_e( 'Temu Order ID', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                                            </div>
                                                            <div class="tmds-item-order-value">
                                                                <a class="tmds-order-id"
                                                                   href="<?php echo esc_url( $fulfill_order_detail ) ?>"
                                                                   data-old_fulfill_order_id="<?php echo esc_attr( $fulfill_order_id ) ?>"
                                                                   target="_blank">
                                                                    <input readonly
                                                                           class="vihcinads-order-id-input' ) ) ) ?>"
                                                                           value="<?php echo esc_attr( $fulfill_order_id ) ?>">
                                                                </a>
                                                                <div class="tmds-item-actions">
                                                    <span class="dashicons dashicons-edit tmds-item-actions-edit"
                                                          title="<?php esc_attr_e( 'Edit', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                    <span class="dashicons dashicons-yes tmds-item-actions-save tmds-hidden"
                                                                          title="<?php esc_attr_e( 'Save', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                    <span class="dashicons dashicons-no-alt tmds-item-actions-cancel tmds-hidden"
                                                                          title="<?php esc_attr_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>"></span>
                                                                </div>
                                                            </div>
                                                            <div class="tmds-item-order-value-overlay tmds-hidden"></div>
                                                        </div>
                                                        <div class="tmds-item-order-details tmds-item-tracking-number"
                                                             data-product_item_id="<?php echo esc_attr( $item_id ) ?>">
                                                            <div class="tmds-item-order-label">
                                                                <span><?php esc_html_e( 'Tracking number', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                                            </div>
                                                            <div class="tmds-item-order-value">
                                                                <a class="tmds-tracking-number"
                                                                   href="<?php echo esc_url( $tracking_url ) ?>"
                                                                   target="_blank">
                                                                    <input readonly
                                                                           class="tmds-tracking-number-input"
                                                                           value="<?php echo esc_attr( $tracking_number ) ?>">
                                                                </a>
                                                                <div class="<?php echo esc_attr( trim( implode( ' ', $get_tracking ) ) ) ?>">
                                                                    <a href="<?php echo esc_url( $tracking_url_btn ) ?>"
                                                                       target="_blank">
                                                        <span class="dashicons dashicons-arrow-down-alt tmds-item-actions-get-tracking"
                                                              title="<?php esc_attr_e( 'Get tracking', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
											<?php
											$order_items_html .= ob_get_clean();
										}
									}
								}
							}
						}
					}
					if ( ! $is_fulfill_product ) {
						$order_item_class = array( 'tmds-order-item', 'tmds-order-item-can-not-be-ordered' );
						$image            = $woo_product ? apply_filters( 'woocommerce_admin_order_item_thumbnail', $woo_product->get_image( 'thumbnail', array( 'title' => '' ), false ), $item_id, $item ) : '';
						$quantity         = $item->get_quantity();
						$item_sub_total   = $order->get_item_subtotal( $item, true, true ) * $quantity;
						$woo_line_total   += $item_sub_total;
						ob_start();
						?>
                        <tr class="<?php echo esc_attr( trim( implode( ' ', $order_item_class ) ) ); ?>"
                            data-cost=""
                            data-quantity="<?php echo esc_attr( $quantity ); ?>"
                            data-order_item_id="<?php echo esc_attr( $item_id ); ?>">
                            <td class="tmds-order-table-column"
                                data-column_name="check">
                                <input class="tmds-order-item-check" type="checkbox" disabled>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="image">
                                <div class="tmds-order-item-image">
									<?php echo wp_kses( $image, self::$settings::filter_allowed_html() ); ?>
                                </div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="name">
                                <div class="tmds-order-item-name"
                                     title="<?php echo esc_attr( $item->get_name() ); ?>">
									<?php
									if ( $woo_product ) {
										?>
                                        <a target="_blank"
                                           href="<?php echo esc_url( admin_url( 'post.php?post=' . $item->get_product_id() . '&action=edit' ) ) ?>">
											<?php echo esc_html( $item->get_name() ); ?>
                                        </a>
										<?php
									} else {
										echo esc_html( $item->get_name() );
									}
									?>

                                </div>
								<?php
								if ( $woo_product && $woo_product->get_sku() ) {
									?>
                                    <div class="tmds-order-item-sku">
                                        <strong><?php esc_html_e( 'Sku: ', 'tmds-woocommerce-temu-dropshipping' ); ?></strong><?php echo esc_html( $woo_product->get_sku() ); ?>
                                    </div>
									<?php
								}
								?>
                                <div class="vi-ui message negative"><?php esc_html_e( 'This item is not an Temu product or it was deleted', 'tmds-woocommerce-temu-dropshipping' ); ?></div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="subtotal">
                                <div class="tmds-order-item-subtotal">
									<?php echo wp_kses( wc_price( $item_sub_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ); ?>
                                </div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="woo_shipping_cost">
                                <div class="tmds-woo-item-shipping">-
                                </div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="import_info">
                                <div class="tmds-order-item-cost">
                                    -
                                </div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="cost">
                                <div class="tmds-order-item-cost">
                                    -
                                </div>
                            </td>
                            <td class="tmds-order-table-column"
                                data-column_name="quantity">
                                <div class="tmds-order-item-quantity">
                                    <div>
                                        <span>× </span><span><?php echo esc_html( $item->get_quantity() ) ?></span>
                                    </div>
                                </div>
                            </td>
                            <td class="tmds-order-table-column tmds-hidden" data-column_name="shipping">
                                <div class="tmds-order-item-shipping"></div>
                            </td>
                            <td class="tmds-order-table-column" data-column_name="fulfill_order">
                            </td>
                        </tr>
						<?php
						$order_items_html .= ob_get_clean();
					}
				}
				if ( $order_items_html ) {
					ob_start();
					?>
                    <div class="tmds-order-container"
                         id="<?php echo esc_attr( 'tmds-order-id-' . $order_id ) ?>"
                         data-order_id="<?php echo esc_attr( $order_id ); ?>"
                         data-order_currency="<?php echo esc_attr( $order_currency ); ?>">
                        <div class="vi-ui form">
                            <table class="vi-ui celled table">
                                <thead>
                                <tr>
                                    <th colspan="9">
                                        <div class="equal width fields">
                                            <div class="field">
                                                <div class="tmds-order-name">
													<?php
													$buyer = '';
													if ( $order->get_billing_first_name() || $order->get_billing_last_name() ) {
														/* translators: 1: first name 2: last name */
														$buyer = trim( sprintf( _x( '%1$s %2$s', 'full name', 'tmds-woocommerce-temu-dropshipping' ), $order->get_billing_first_name(), $order->get_billing_last_name() ) );
													} elseif ( $order->get_billing_company() ) {
														$buyer = trim( $order->get_billing_company() );
													} elseif ( $order->get_customer_id() ) {
														$user  = get_user_by( 'id', $order->get_customer_id() );
														$buyer = ucwords( $user->display_name );
													}
													/**
													 * Filter buyer name in list table orders.
													 *
													 * @param string $buyer Buyer name.
													 * @param WC_Order $order Order data.
													 *
													 * @since 3.7.0
													 *
													 */
													$buyer = apply_filters( 'woocommerce_admin_order_buyer_name', $buyer, $order );
													if ( $order->get_status() === 'trash' ) {
														printf( '<strong>#%s %s</strong>', esc_attr( $order->get_order_number() ), esc_html( $buyer ) );
													} else {
														printf( '<a target="_blank" href="%s" class="order-view"><strong>#%s %s</strong></a>',
															esc_url( admin_url( 'post.php?post=' . absint( $order->get_id() ) ) . '&action=edit' ),
															esc_attr( $order->get_order_number() ),
															esc_html( $buyer ) );
													}
													?>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="tmds-order-date">
													<?php
													$order_timestamp = $order->get_date_created() ? $order->get_date_created()->getTimestamp() : '';
													if ( ! $order_timestamp ) {
														echo wp_kses_post( '&ndash;' );
													} else {
														// Check if the order was created within the last 24 hours, and not in the future.
														if ( $order_timestamp > strtotime( '-1 day', time() ) && $order_timestamp <= time() ) {
															$show_date = sprintf(
															/* translators: %s: human-readable time difference */
																_x( '%s ago', '%s = human-readable time difference', 'tmds-woocommerce-temu-dropshipping' ),
																human_time_diff( $order->get_date_created()->getTimestamp(), time() )
															);
														} else {
															$show_date = $order->get_date_created()->date_i18n( apply_filters( 'woocommerce_admin_order_date_format', 'M j, Y' ) );
														}
														?>
                                                        <strong><?php esc_html_e( 'Created: ', 'tmds-woocommerce-temu-dropshipping' ) ?></strong>
														<?php
														printf(
															'<time datetime="%1$s" title="%2$s">%3$s</time>',
															esc_attr( $order->get_date_created()->date( 'c' ) ),
															esc_html( $order->get_date_created()->date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
															esc_html( $show_date )
														);
													}
													?>
                                                </div>
                                            </div>
											<?php
											$order_status   = $order->get_status();
											$order_statuses = wc_get_order_statuses();
											?>
                                            <div class="field">
                                                <div class="<?php echo esc_attr( trim( implode( ' ', array(
													'tmds-order-status',
													"tmds-order-status-{$order_status}"
												) ) ) ) ?>">
                                                    <strong><?php esc_html_e( 'Status: ', 'tmds-woocommerce-temu-dropshipping' ) ?></strong>
                                                    <span class="vi-ui mini button tmds-order-status-text">
                                                        <?php echo wp_kses( isset( $order_statuses[ $order_status ] ) ? $order_statuses[ $order_status ] : ucwords( $order_status ), self::$settings::filter_allowed_html() ) ?>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <div class="tmds-order-shipping-address">
													<?php
													$shipping_address = $order->get_address( 'shipping' );
													if ( empty( $shipping_address['country'] ) ) {
														$shipping_address = $order->get_address( 'billing' );
													}
													$countries         = WC()->countries->get_countries();
													$formatted_address = WC()->countries->get_formatted_address( $shipping_address, ', ' );
													?>
                                                    <strong><?php esc_html_e( 'Ship to: ', 'tmds-woocommerce-temu-dropshipping' ) ?></strong>
                                                    <span class="tmds-order-ship-to"
                                                          title="<?php echo esc_attr( $formatted_address ) ?>">
                                                        <?php echo wp_kses( isset( $countries[ $shipping_address['country'] ] ) ? $countries[ $shipping_address['country'] ] : $formatted_address, self::$settings::filter_allowed_html() ) ?>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th rowspan="2"
                                        class="tmds-order-table-column-head"
                                        data-column_name="check" width="1%">
                                        <input class="tmds-order-check-all" type="checkbox" <?php echo esc_attr( $placeable_items_count < 1 ? 'disabled' : '' ); ?>></th>
                                    <th class="tmds-order-table-column-head" colspan="2" rowspan="2"
                                        data-column_name="name"><?php esc_html_e( 'Item detail', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th colspan="2" class="tmds-order-table-column-head"
                                        data-column_name="subtotal"><?php esc_html_e( 'Income', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th colspan="3" class="tmds-order-table-column-head"
                                        data-column_name="cost"><?php esc_html_e( 'Cost', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th rowspan="2" class="tmds-order-table-column-head"
                                        data-column_name="fulfill_order"><?php esc_html_e( 'Fulfill order', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                </tr>
                                <tr>
                                    <th class="tmds-order-table-column-head tmds-ignore-border-first-child"
                                        data-column_name="subtotal"><?php esc_html_e( 'Subtotal', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th class="tmds-order-table-column-head"
                                        data-column_name="subtotal"><?php esc_html_e( 'Shipping', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th class="tmds-order-table-column-head"
                                        data-column_name="import_info"><?php esc_html_e( 'Imported from', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th class="tmds-order-table-column-head"
                                        data-column_name="subtotal"><?php esc_html_e( 'Item price', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th class="tmds-order-table-column-head"
                                        data-column_name="quantity"><?php esc_html_e( 'Qty', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                    <th class="tmds-order-table-column-head tmds-hidden"
                                        data-column_name="shipping"><?php esc_html_e( 'Shipping', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                                </tr>
                                </thead>
                                <tbody>
								<?php
								echo wp_kses( $order_items_html, self::$settings::filter_allowed_html() );
								$order_total        = $order->get_total();
								$woo_shipping_total = $order->get_shipping_total() + $order->get_shipping_tax();
								?>
                                </tbody>
                                <tfoot>
                                <tr>
                                    <th rowspan="2" colspan="3">
                                        <div class="tmds-order-actions">
											<?php
											if ( $fulfill_pid ) {
												?>
                                                <button class="vi-ui labeled icon button positive mini tmds-order-with-extension tmds-hidden">
                                                    <i class="icon external"></i>
													<?php esc_html_e( 'Order with Extension', 'tmds-woocommerce-temu-dropshipping' ); ?>
                                                </button>
                                                <a target="_blank"
                                                   href="https://downloads.villatheme.com/?download=tmds-extension"
                                                   title="<?php esc_attr_e( 'To fulfill this order manually, please install the chrome extension', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                   class="vi-ui positive button labeled icon mini tmds-download-chrome-extension">
                                                    <i class="external icon"></i><?php esc_html_e( 'Install Extension', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </a>
												<?php
											}
											?>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="tmds-order-product-subtotal-sum">
                                            <span class="tmds-order-product-subtotal-sum">
                                                <?php echo wp_kses( wc_price( $woo_line_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ) ?>
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div class="tmds-order-product-shipping-sum">
                                            <span class="tmds-order-product-shipping-sum">
                                                <?php echo wp_kses( wc_price( $woo_shipping_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ) ?></span>
                                        </div>
                                    </th>
                                    <th colspan="3">
                                        <div class="tmds-order-product-cost">
                                            <span class="tmds-order-product-cost-amount">
                                                <?php echo wp_kses( wc_price( $product_cost, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ) ?>
                                            </span>
                                        </div>
                                    </th>
                                    <th class="tmds-hidden">
                                        <div class="tmds-order-shipping-total">
                                            <span class="order-shipping-total-amount">
                                                <?php echo wp_kses( self::wc_price( $shipping_total, $order_currency ), self::$settings::filter_allowed_html() ) ?>
                                            </span>
                                        </div>
                                    </th>
                                    <th rowspan="2">
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="2"
                                        class="tmds-ignore-border-first-child">
                                        <div class="tmds-order-product-subtotal">
                                            <span class="tmds-order-product-subtotal"><?php echo wp_kses( wc_price( $order_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ) ?></span>
                                        </div>
                                    </th>
                                    <th colspan="3">
                                        <div class="tmds-order-total-cost">
                                            <strong><?php esc_html_e( 'Total cost: ', 'tmds-woocommerce-temu-dropshipping' ) ?></strong>
                                            <span class="tmds-order-total-cost-amount">
                                                <?php echo wp_kses( wc_price( $product_cost + $shipping_total, array( 'currency' => $order_currency, ) ), self::$settings::filter_allowed_html() ) ?>
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="tmds-order-overlay tmds-hidden"></div>
                    </div>
					<?php
					$page_content .= ob_get_clean();
				}
				$key ++;
			}
		} else {
			ob_start();
			?>
            <form method="get" class="vi-ui segment">
                <input type="hidden" name="page" value="<?php echo esc_attr( self::$menu_slug ); ?>">
                <input type="search" class="text short" name="tmds_search"
                       placeholder="<?php esc_attr_e( 'Search order', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                       value="<?php echo esc_attr( $keyword ) ?>">
                <input type="submit" name="submit" class="button"
                       value="<?php esc_attr_e( 'Search order', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                <p>
					<?php esc_html_e( 'No orders found', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </p>
            </form>
			<?php
			$pagination_html = ob_get_clean();
		}
		?>
        <div class="wrap">
            <h2 class="tmds-import-list-head">
				<?php esc_html_e( 'Temu orders', 'tmds-woocommerce-temu-dropshipping' ) ?>
                <div class="tmds-import-list-head-action">
		            <?php self::$settings::connect_chrome_extension_buttons(); ?>
                </div>
            </h2>
			<?php echo wp_kses( $pagination_html, self::$settings::filter_allowed_html() ) ?>
            <div class="vi-ui segment tmds-orders-container">
                <div class="vi-ui menu tabular">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::$menu_slug . '&order_status=to_order' ) ) ?>"
                       class="item <?php echo esc_attr( self::$order_status === 'to_order' ? 'active' : '' ) ?>">
						<?php esc_html_e( 'To order', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        <div class="vi-ui label">
							<?php echo esc_html( self::$order_status === 'to_order' ? ( $keyword ? $count : self::$settings::get_fulfill_orders() )
								: self::$settings::get_fulfill_orders() )
							?>
                        </div>
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::$menu_slug . '&order_status=all' ) ) ?>"
                       class="item <?php echo esc_attr( self::$order_status !== 'to_order' ? 'active' : '' ) ?>">
						<?php esc_html_e( 'All orders', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        <div class="vi-ui label"><?php echo esc_html( self::$order_status === 'to_order' ? self::$settings::get_fulfill_orders( true, 'all' )
								: ( $keyword ? $count : self::$settings::get_fulfill_orders( true, 'all' ) ) ) ?></div>
                    </a>
                </div>
				<?php echo wp_kses( $page_content, self::$settings::filter_allowed_html() ) ?>
            </div>
        </div>
		<?php
	}

	public static function wc_price( $price, $currency = '' ) {
		$html = wc_price( $price, array(
			'currency'     => 'CNY',
			'decimals'     => 2,
			'price_format' => '%1$s&nbsp;%2$s'
		) );
		if ( $currency && $price ) {
			$html .= '<br>( ' . wc_price( TMDSPRO_Price::process_exchange_price( $price, $currency ) ) . ' )';
		}

		return $html;
	}


	/**
	 * @param $status
	 * @param $option
	 * @param $value
	 *
	 * @return mixed
	 */
	public static function screen_options_page() {
		add_screen_option( 'per_page', array(
			'label'   => esc_html__( 'Number of items per page', 'tmds-woocommerce-temu-dropshipping' ),
			'default' => 5,
			'option'  => self::$settings::$prefix . '_orders_per_page'
		) );
	}

	public static function posts_join( $join, $wp_query ) {
		global $wpdb;
		$join .= " JOIN {$wpdb->prefix}woocommerce_order_items as vi_wad_woocommerce_order_items ON $wpdb->posts.ID=vi_wad_woocommerce_order_items.order_id";
		$join .= " JOIN {$wpdb->prefix}woocommerce_order_itemmeta as vi_wad_woocommerce_order_itemmeta ON vi_wad_woocommerce_order_items.order_item_id=vi_wad_woocommerce_order_itemmeta.order_item_id";

		return $join;
	}

	public static function add_items_query( $args ) {
		global $wpdb;
		$args['join']  .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_items ON {$wpdb->prefix}wc_orders.id={$wpdb->prefix}woocommerce_order_items.order_id";
		$args['join']  .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_itemmeta ON {$wpdb->prefix}woocommerce_order_items.order_item_id={$wpdb->prefix}woocommerce_order_itemmeta.order_item_id";
		$args['where'] .= " AND {$wpdb->prefix}woocommerce_order_itemmeta.meta_key='_tmds_order_id'";

		return $args;
	}

	public static function posts_distinct( $join, $wp_query ) {
		return 'DISTINCT';
	}

	public static function filter_where( $where, $wp_q ) {
		global $wpdb;
		$where .= " AND vi_wad_woocommerce_order_itemmeta.meta_key='_tmds_order_id'";
		if ( self::$order_status === 'to_order' ) {
			$where .= " AND vi_wad_woocommerce_order_itemmeta.meta_value=''";
		}
		add_filter( 'posts_join', array( __CLASS__, 'posts_join' ), 10, 2 );
		add_filter( 'posts_distinct', array( __CLASS__, 'posts_distinct' ), 10, 2 );

		return $where;
	}
}