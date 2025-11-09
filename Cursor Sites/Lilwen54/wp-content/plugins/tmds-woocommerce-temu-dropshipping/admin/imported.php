<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Imported {
	protected static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_head', array( $this, 'menu_product_count' ), 999 );
		add_action( 'admin_init', array( $this, 'cancel_overriding' ) );
		add_action( 'admin_init', array( $this, 'empty_trash' ) );
		add_filter( 'tmds_admin_ajax_events', [ $this, 'ajax_events' ], 10, 2 );
	}

	public function ajax_events( $events, $prefix ) {
		if ( ! is_array( $events ) ) {
			$events = [];
		}
		$events += [
			$prefix . '_dismiss_product_notice' => array(
				'function' => 'dismiss_product_notice',
				'class'    => $this,
			),
			$prefix . '_override_product'       => array(
				'function' => 'override',
				'class'    => $this,
			),
			$prefix . '_restore_product'        => array(
				'function' => 'restore',
				'class'    => $this,
			),
			$prefix . '_trash_product'          => array(
				'function' => 'trash',
				'class'    => $this,
			),
			$prefix . '_delete_product'         => array(
				'function' => 'delete',
				'class'    => $this,
			)
		];

		return $events;
	}

	public function empty_trash() {
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_REQUEST['_wpnonce'] ?? '' ) ), 'tmds_empty_trash' ) ) {
			return;
		}
		$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( $page !== 'tmds-imported' ) {
			return;
		}
		TMDSPRO_Post::empty_import_list( 'trash' );
		wp_safe_redirect( admin_url( "admin.php?page={$page}" ) );
		exit();
	}

	/**
	 * Cancel overriding button handler
	 */
	public function cancel_overriding() {
		if ( ! wp_verify_nonce( sanitize_key( wp_unslash( $_REQUEST['cancel_overriding_nonce'] ?? '' ) ), 'tmds_cancel_overriding_nonce' ) ) {
			return;
		}
		$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';
		if ( $page !== 'tmds-imported' ) {
			return;
		}
		$overridden_product = isset( $_REQUEST['overridden_product'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['overridden_product'] ) ) : '';
		$cancel_overriding  = isset( $_REQUEST['cancel_overriding'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['cancel_overriding'] ) ) : '';
		if ( $overridden_product && $cancel_overriding ) {
			$product = TMDSPRO_Post::get_post( $cancel_overriding );
			if ( $product && $product->post_status === 'override' && $product->post_parent == $overridden_product ) {
				TMDSPRO_Post::update_post( array(
					'ID'          => $cancel_overriding,
					'post_parent' => '',
					'post_status' => 'draft',
				) );
				TMDSPRO_Post::update_post_meta( $overridden_product, '_tmds_override_id', '' );
			}
			wp_safe_redirect( remove_query_arg( array( 'cancel_overriding', '_wpnonce', 'overridden_product' ) ) );
			exit();
		}
	}

	/**
	 * Adds the order processing count to the menu.
	 */
	public function menu_product_count() {
		global $submenu;
		$prefix = self::$settings::$prefix;
		if ( isset( $submenu[ $prefix ] ) ) {
			// Add count if user has access.
			if ( apply_filters( 'villatheme_' . $prefix . '_product_count_in_menu', true ) ||
			     current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
				$product_count = TMDSPRO_Post::count_posts();
				$product_count = intval( $product_count->publish ?? 0 ) + intval( $product_count->trash ?? 0 );
				foreach ( $submenu[ $prefix ] as $key => $menu_item ) {
					if ( ! empty( $menu_item[2] ) && $menu_item[2] === $prefix . '-imported' ) {
						$count_label = sprintf( " <span class='update-plugins count-%s'><span class='%s-imported-list-count'>%s</span></span>",
							esc_attr( $product_count ), esc_attr( $prefix ), esc_html( number_format_i18n( $product_count ) ) );

						$submenu[ $prefix ][ $key ][0] .= $count_label;
					}
				}
			}
		}
	}

	public static function screen_options_page() {
		add_screen_option( 'per_page', array(
			'label'   => esc_html__( 'Number of items per page', 'tmds-woocommerce-temu-dropshipping' ),
			'default' => 5,
			'option'  => self::$settings::$prefix . '_imported_per_page'
		) );
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
		$paged       = isset( $_GET['paged'] ) ? absint( wp_unslash( $_GET['paged'] ) ) : 1;// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$status      = ! empty( $_GET['post_status'] ) ? sanitize_text_field( wp_unslash( $_GET['post_status'] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$post_status = $status;
		?>
        <div class="wrap tmds-imported-list-wrap">
            <h2 class="tmds-import-list-head">
                <?php esc_html_e( 'All imported products', 'tmds-woocommerce-temu-dropshipping' ) ?>
                <div class="tmds-import-list-head-action">
		            <?php self::$settings::connect_chrome_extension_buttons(); ?>
                </div>
            </h2>
			<?php
			$product_count    = TMDSPRO_Post::count_posts();
			$import_search_id = isset( $_GET[ $prefix . '_search_woo_id' ] ) ? absint( wp_unslash( $_GET[ $prefix . '_search_woo_id' ] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$args             = array(
				'tmds_query'     => 1,
				'post_type'      => $prefix . '_draft_product',
				'order'          => 'DESC',
				'fields'         => 'ids',
				'posts_per_page' => $per_page,
				'paged'          => $paged,
			);
			if ( $import_search_id ) {
				$keyword             = '';
				$args['meta_query']  = [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'and',
					[
						'key'     => '_' . $prefix . '_woo_id',
						'compare' => '=',
						'value'   => $import_search_id,
					]
				];
				$args['post_status'] = 'trash,publish';
			} else {
				$args['meta_query'] = [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'and',
					[
						'key'     => '_' . $prefix . '_woo_id',
						'compare' => 'exists',
					]
				];
				$keyword            = isset( $_GET[ $prefix . '_search' ] ) ? sanitize_text_field( wp_unslash( $_GET[ $prefix . '_search' ] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( $keyword ) {
					$args['s']   = $keyword;
					$post_status = 'trash,publish';
				}
				if ( ! $post_status && ! $import_search_id && ! $keyword ) {
					$post_status = 'publish';
				}
				if ( ! intval( $product_count->publish ) && intval( $product_count->trash ) ) {
					$post_status = $status = 'trash';
				}
				if ( $post_status ) {
					$args['post_status'] = $post_status;
				}
			}
			$the_query   = TMDSPRO_Post::query( $args );
			$product_ids = $the_query->get_posts();
			$count       = $the_query->found_posts;
			$total_page  = $the_query->max_num_pages;
			$paged       = $total_page >= $paged ? $paged : 1;
			wp_reset_postdata();
			if ( ! empty( $product_ids ) && is_array( $product_ids ) ) {
				ob_start();
				?>
                <form method="get" class="tmds-imported-products-<?php echo esc_attr( $status ) ?>">
                    <input type="hidden" name="page" value="tmds-imported">
                    <input type="hidden" name="post_status" value="<?php echo esc_attr( $status ) ?>">
					<?php do_action( 'villatheme_' . $prefix . '_imported_list_search_form' ); ?>
                    <div class="tablenav top">
                        <div class="tmds-button-update-products-container">
							<?php
							if ( $status !== 'trash' ) {
								?>
                                <a target="_blank"
                                   href="https://downloads.villatheme.com/?download=tmds-extension"
                                   title="<?php esc_attr_e( 'To sync products manually, please install the chrome extension', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                   class="vi-ui positive button labeled icon mini tmds-download-chrome-extension">
                                    <i class="external icon"> </i>
									<?php esc_html_e( 'Install Extension', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                </a>
								<?php
							} else {
								?>
                                <a class="vi-ui button negative mini tmds-button-empty-trash labeled icon"
                                   href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'tmds_empty_trash', 1 ) ) ) ?>"
                                   title="<?php esc_attr_e( 'Permanently delete all products from the trash', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                    <i class="icon trash"> </i>
									<?php esc_html_e( 'Empty Trash', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                </a>
								<?php
							}
							?>
                        </div>
                        <div class="subsubsub">
                            <ul>
                                <li class="tmds-imported-products-count-publish-container">
                                    <a href="<?php echo esc_attr( admin_url( 'admin.php?page=' . $prefix . '-imported' ) ) ?>">
										<?php esc_html_e( 'Publish', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
                                    (<span class="tmds-imported-products-count-publish">
		                                <?php echo esc_html( $product_count->publish ) ?>
	                                </span>)
                                </li>
								<?php
								if ( ! empty( $product_count->trash ) ) {
									?>
                                    |
                                    <li class="tmds-imported-products-count-trash-container">
                                        <a href="<?php echo esc_attr( admin_url( 'admin.php?page=' . $prefix . '-imported&post_status=trash' ) ) ?>">
											<?php esc_html_e( 'Trash', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
                                        (<span class="tmds-imported-products-count-trash">
		                                <?php echo esc_html( $product_count->trash ) ?>
	                                </span>)
                                    </li>
									<?php
								}
								?>
                            </ul>
                        </div>
						<?php
						if ( ! $import_search_id ) {
							?>
                            <div class="tablenav-pages">
                                <div class="pagination-links">
									<?php
									if ( $paged > 2 ) {
										?>
                                        <a class="prev-page button" href="<?php echo esc_url( add_query_arg(
											array(
												'page'              => $prefix . '-imported',
												'paged'             => 1,
												$prefix . '_search' => $keyword,
												'post_status'       => $status,
											), admin_url( 'admin.php' )
										) ) ?>">
                                            <span class="screen-reader-text"><?php esc_html_e( 'First Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                            <span aria-hidden="true">«</span>
                                        </a>
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
												'page'              => $prefix . '-imported',
												'paged'             => $p_paged,
												$prefix . '_search' => $keyword,
												'post_status'       => $status,
											), admin_url( 'admin.php' )
										);
										?>
                                        <a class="prev-page button" href="<?php echo esc_url( $p_url ) ?>">
                                        <span class="screen-reader-text">
	                                        <?php esc_html_e( 'Previous Page', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                        </span>
                                            <span aria-hidden="true">‹</span>
                                        </a>
										<?php
									} else {
										?>
                                        <span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
										<?php
									}
									?>
                                    <span class="screen-reader-text"><?php esc_html_e( 'Current Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                    <span id="table-paging" class="paging-input">
                                    <span class="tablenav-paging-text">
                                        <input class="current-page" type="text" name="paged" size="1"
                                               value="<?php echo esc_html( $paged ) ?>">
	                                    <span class="tablenav-paging-text"><?php esc_html_e( ' of ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            <span class="total-pages"><?php echo esc_html( $total_page ) ?></span>
                                        </span>
                                    </span>
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
												'page'              => $prefix . '-imported',
												'paged'             => $n_paged,
												$prefix . '_search' => $keyword,
												'post_status'       => $status,
											), admin_url( 'admin.php' )
										); ?>
                                        <a class="next-page button" href="<?php echo esc_url( $n_url ) ?>">
                                            <span class="screen-reader-text"><?php esc_html_e( 'Next Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                            <span aria-hidden="true">›</span>
                                        </a>
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
												'page'              => $prefix . '-imported',
												'paged'             => $total_page,
												$prefix . '_search' => $keyword,
												'post_status'       => $status,
											), admin_url( 'admin.php' )
										) ) ?>">
                                            <span class="screen-reader-text"><?php esc_html_e( 'Last Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                            <span aria-hidden="true">»</span>
                                        </a>
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
                                <input type="search" class="text short" name="<?php echo esc_attr( $prefix . '_search' ) ?>"
                                       value="<?php echo esc_attr( $keyword ) ?>"
                                       placeholder="<?php esc_attr_e( 'Search imported product', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                                <input type="submit" name="submit" class="button"
                                       value="<?php echo esc_attr__( 'Search product', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                            </p>
							<?php
						}
						?>
                    </div>
                </form>

				<?php
				$pagination_html = ob_get_clean();

				echo wp_kses( $pagination_html, TMDSPRO_DATA::filter_allowed_html() );
				$key         = 0;
				$date_format = get_option( 'date_format' );
				if ( ! $date_format ) {
					$date_format = 'F j, Y';
				}
				$wc_currency = get_woocommerce_currency();
//				$wc_decimals            = wc_get_price_decimals();
				foreach ( $product_ids as $product_id ) {
					$product            = TMDSPRO_Post::get_post( $product_id );
					$product_status     = $product->post_status;
					$woo_product_id     = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_woo_id', true );
					$title              = $product->post_title;
					$woo_product        = wc_get_product( $woo_product_id );
					$woo_product_status = '';
					$woo_product_name   = $title;
					$sku                = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_sku', true );
					$woo_sku            = $sku;

					if ( $woo_product ) {
						$woo_sku            = $woo_product->get_sku();
						$woo_product_status = $woo_product->get_status();
						$woo_product_name   = $woo_product->get_name();
					}

					$gallery             = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_gallery', true );
					$store_info          = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_store_info', true );
					$variations          = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_variations', true );
					$override_product_id = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_override_id', true );
					$override_product    = '';
					if ( $override_product_id ) {
						$override_product = TMDSPRO_Post::get_post( $override_product_id );
						if ( ! $override_product || $override_product->post_parent != $product_id ) {
							$override_product_id = $override_product = '';
							TMDSPRO_Post::update_post_meta( $product_id, '_' . $prefix . '_override_id', $override_product_id );
						}
					}
					$accordion_active = '';
					$image            = wp_get_attachment_thumb_url( TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_product_image', true ) );

					if ( ! $image ) {
						$image = ( is_array( $gallery ) && count( $gallery ) ) ? array_shift( $gallery ) : '';
					}
					$use_different_currency = false;
					$import_info            = TMDSPRO_Post::get_post_meta( $product_id, "_{$prefix}_import_info", true );
					$currency               = $import_info['currency_code'] ?? $wc_currency;
					$decimals               = $import_info['currency_decimals'] ?? $import_info['temu_locale_settings']['currency']['number_precision'] ?? 2;
					$decimals               = $decimals < 1 ? 1 : pow( 10, ( - 1 * $decimals ) );
					if ( self::$settings::strtolower( $wc_currency ) != self::$settings::strtolower( $currency ) ) {
						$use_different_currency = true;
					}
					$notice_time    = '';
					$message_status = 'warning';
					$message        = self::get_product_message( $product_id, $accordion_active, $message_status, $notice_time );
					if ( $override_product ) {
						$accordion_active = 'active';
					}
					if ( $status === 'trash' ) {
						$accordion_active = '';
					}
					?>
                    <div class="vi-ui styled fluid accordion tmds-accordion"
                         id="tmds-product-item-id-<?php echo esc_attr( $product_id ) ?>">
                        <div class="title <?php echo esc_attr( $accordion_active ) ?>">
                            <i class="dropdown icon tmds-accordion-title-icon"> </i>
                            <div class="tmds-accordion-product-image-title-container">
                                <div class="tmds-accordion-product-image-title">
									<?php
									if ( is_numeric( $image ) ) {
										echo wp_kses( wp_get_attachment_image( $image, 'thumbnail', false, [ 'class' => 'tmds-accordion-product-image' ] ), self::$settings::filter_allowed_html() );
									} else if ( $image ) {
										// The displayed images are not yet saved to the WP media library
										?>
                                        <img src="<?php echo esc_url( $image )  // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>"
                                             class="tmds-accordion-product-image">
										<?php
									} else {
										echo wp_kses( wc_placeholder_img( 'woocommerce_thumbnail', [ 'class' => 'tmds-accordion-product-image' ] ), self::$settings::filter_allowed_html() );
									}
									?>
                                    <div class="tmds-accordion-product-title-container">
                                        <div class="tmds-accordion-product-title"
                                             title="<?php echo esc_attr( $title ) ?>">
											<?php echo esc_html( $title ) ?>
                                        </div>
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
										$import_date = $product->post_date;
										if ( $woo_product && $woo_product->get_date_created() ) {
											$import_date = $woo_product->get_date_created()->date_i18n();
										}
										?>
                                        <div class=tmds-accordion-product-date"><?php esc_html_e( 'Import date: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            <span><?php echo esc_html( $import_date ) ?></span>
                                        </div>
										<?php
										do_action( 'villatheme_' . $prefix . '_imported_list_product_information', $product );
										?>
                                    </div>
                                </div>
                                <div class="tmds-button-view-and-edit">
                                    <a href="<?php echo esc_url( self::$settings::get_temu_url( $product_id ) ); ?>" target="_blank"
                                       class="vi-ui mini button" rel="nofollow">
                                        <i class="icon external"></i>
										<?php esc_html_e( 'View on Temu', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                    </a>

									<?php
									if ( $woo_product ) {
										if ( $woo_product_status !== 'trash' ) {
											echo wp_kses_post( TMDSPRO_Admin_Import_List::get_button_view_edit_html( $woo_product_id ) );
											?>
                                            <span class="vi-ui button green mini tmds-button-update-product tmds-hidden inverted labeled icon"
                                                  data-product_id="<?php echo esc_attr( $woo_product_id ) ?>"
                                                  data-imported_region="<?php echo esc_attr( $import_info['region_code'] ?? '' ); ?>"
                                                  data-sync_url="<?php echo esc_url( self::$settings::get_update_product_url( $woo_product_id, $product_id ) ) ?>">
                                                <i class="icon external"> </i>
												<?php esc_html_e( 'Sync', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </span>
                                            <a target="_blank"
                                               href="https://downloads.villatheme.com/?download=tmds-extension"
                                               title="<?php esc_attr_e( 'To sync products manually, please install the chrome extension', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                               class="vi-ui positive button labeled icon mini tmds-download-chrome-extension">
                                                <i class="external icon"> </i>
												<?php esc_html_e( 'Install Extension', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </a>
											<?php
										} else {
											if ( $product_status !== 'trash' ) {
												?>
                                                <span class="vi-ui mini black button tmds-button-trash"
                                                      title="<?php esc_attr_e( 'This product is trashed from your WooCommerce store.', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                      data-product_title="<?php echo esc_attr( $title ) ?>"
                                                      data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                      data-woo_product_id="">
	                                                <?php esc_html_e( 'Trash', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </span>
                                                <span class="vi-ui mini button negative tmds-button-delete"
                                                      title="<?php esc_attr_e( 'Delete this product permanently', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                      data-product_title="<?php echo esc_attr( $title ) ?>"
                                                      data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                      data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                                <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </span>
												<?php
											} else {
												?>
                                                <span class="vi-ui mini button positive tmds-button-restore"
                                                      title="<?php esc_attr_e( 'Restore this product', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                      data-product_title="<?php echo esc_attr( $title ) ?>"
                                                      data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                      data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                                <?php esc_html_e( 'Restore', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </span>
                                                <span class="vi-ui mini button negative tmds-button-delete"
                                                      title="<?php esc_attr_e( 'Delete this product permanently', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                      data-product_title="<?php echo esc_attr( $title ) ?>"
                                                      data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                      data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                                <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </span>
												<?php
											}
										}
									} else {
										if ( $product_status !== 'trash' ) {
											?>
                                            <span class="vi-ui mini black button tmds-button-trash"
                                                  title="<?php esc_attr_e( 'This product is deleted from your WooCommerce store.', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                  data-product_title="<?php echo esc_attr( $title ) ?>"
                                                  data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                  data-woo_product_id="">
	                                            <?php esc_html_e( 'Trash', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </span>
                                            <span class="vi-ui mini button negative tmds-button-delete"
                                                  title="<?php esc_attr_e( 'Delete this product permanently', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                  data-product_title="<?php echo esc_attr( $title ) ?>"
                                                  data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                  data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                            <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </span>
											<?php
										} else {
											?>
                                            <span class="vi-ui button mini negative tmds-button-delete"
                                                  title="<?php esc_attr_e( 'Delete this product permanently', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                  data-product_title="<?php echo esc_attr( $title ) ?>"
                                                  data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                  data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                            <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </span>
											<?php
										}
									}
									?>
                                    <span class="vi-ui button negative mini loading tmds-button-deleting">
	                                    <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="content <?php echo esc_attr( $accordion_active ) ?>">
                            <div class="tmds-message">
								<?php
								if ( $message && $status !== 'trash' ) {
									?>
                                    <div class="vi-ui message tmds-product-notice-message <?php echo esc_attr( $message_status ) ?>">
                                        <div>
                                            <span>
                                                <?php
                                                echo wp_kses_post( $message );
                                                if ( $notice_time ) {
	                                                ?>
                                                    <span class="tmds-product-notice-time">
                                                        <?php
                                                        echo wp_kses_post( sprintf( '(%s)', date_i18n( "{$date_format} h:i:s A", $notice_time ) ) );
                                                        ?>
                                                    </span>
	                                                <?php
                                                }
                                                ?>
                                            </span>
											<?php
											if ( $message_status !== 'negative' ) {
												?>
                                                <i class="vi-ui icon cancel tmds-product-notice-dismiss" data-product_id="<?php echo esc_attr( $product_id ) ?>"> </i>
												<?php
											}
											?>
                                        </div>
                                    </div>
									<?php
								}
								?>
                            </div>
                            <form class="vi-ui form tmds-product-container"
                                  method="post">
                                <div class="field">
                                    <div class="fields">
                                        <div class="three wide field">
                                            <div class="tmds-product-image">
                                                <img class="tmds-import-data-image"
                                                     src="<?php echo esc_url( $image ?: wc_placeholder_img_src() ) ?>">
                                                <input type="hidden"
                                                       name="<?php echo esc_attr( $prefix . '_product[' . $product_id . '][image]' ) ?>"
                                                       value="<?php echo esc_attr( $image ?: wc_placeholder_img_src() ) ?>">
                                            </div>
                                        </div>
                                        <div class="thirteen wide field">
                                            <div class="field">
                                                <label><?php esc_html_e( 'WooCommerce product title', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                                <input type="text" value="<?php echo esc_attr( $woo_product_name ) ?>"
                                                       readonly
                                                       name="<?php echo esc_attr( $prefix . '_product[' . $product_id . '][title]' ) ?>"
                                                       class="tmds-import-data-title">
                                            </div>
                                            <div class="field">
                                                <div class="equal width fields">
                                                    <div class="field">
                                                        <label><?php esc_html_e( 'Sku', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                                        <input type="text" value="<?php echo esc_attr( $woo_sku ) ?>"
                                                               readonly
                                                               name="<?php echo esc_attr( $prefix . '_product[' . $product_id . '][sku]' ) ?>"
                                                               class="tmds-import-data-sku">
                                                    </div>
                                                    <div class="field">
                                                        <label><?php esc_html_e( 'Cost', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                                        <div class="tmds-price-field">
															<?php

															if ( count( $variations ) == 1 ) {
																$variation_sale_price    = ( $variations[0]['sale_price'] );
																$variation_regular_price = ( $variations[0]['regular_price'] );
																if ( ! empty( $variations[0]['is_on_sale'] ) && $variation_sale_price ) {
																	$import_price      = $variation_sale_price;
																	$import_price_html = $variations[0]['sale_price_html'] ?? '';
																} else {
																	$import_price      = $variation_regular_price;
																	$import_price_html = $variations[0]['regular_price_html'] ?? '';
																}
																$price     = TMDSPRO_Price::process_exchange_price( $import_price, $currency );
																$cost_html = wc_price( $price );
																if ( $use_different_currency ) {
																	$cost_html = $import_price_html ? "{$import_price_html}({$cost_html})" : wc_price( TMDSPRO_Price::get_price_with_temu_decimals( $import_price, $currency ), [
																			'currency' => $currency,
																		] ) . '(' . $cost_html . ')';
																}
																echo wp_kses_post( $cost_html );
															} else {
																$min_price      = $max_price = 0;
																$max_price_html = $min_price_html = '';
																foreach ( $variations as $variation_v ) {
																	$variation_sale_price    = ( $variation_v['sale_price'] ?? '' );
																	$variation_regular_price = ( $variation_v['regular_price'] ?? '' );
//																	$price                   = $variation_sale_price ? $variation_sale_price : $variation_regular_price;
//																	if ( ! $min_price ) {
//																		$min_price = $price;
//																	}
//																	if ( $price < $min_price ) {
//																		$min_price = $price;
//																	}
//																	if ( $price > $max_price ) {
//																		$max_price = $price;
//																	}

																	if ( ! empty( $variation_v['is_on_sale'] ) && $variation_sale_price ) {
																		$import_price      = $variation_sale_price;
																		$import_price_html = $variation_v['sale_price_html'] ?? '';
																	} else {
																		$import_price      = $variation_regular_price;
																		$import_price_html = $variation_v['regular_price_html'] ?? '';
																	}
																	if ( ! $min_price || $import_price < $min_price ) {
																		$min_price      = $import_price;
																		$min_price_html = $import_price_html;
																	}
																	if ( $import_price > $max_price ) {
																		$max_price      = $import_price;
																		$max_price_html = $import_price_html;
																	}
																}
																if ( $min_price && $min_price != $max_price ) {
																	$wc_min_price = TMDSPRO_Price::process_exchange_price( $min_price, $currency );
																	$wc_max_price = TMDSPRO_Price::process_exchange_price( $max_price, $currency );
																	$min          = wc_price( $wc_min_price );
																	$max          = wc_price( $wc_max_price );
																	if ( $use_different_currency ) {
																		$min = $min_price_html ? "{$min_price_html}({$min})" : wc_price( TMDSPRO_Price::get_price_with_temu_decimals( $min_price, $currency ), [
																				'currency' => $currency,
//																				'decimals'     => $decimals,
//																				'price_format' => '%1$s&nbsp;%2$s'
																			] ) . '(' . $min . ')';
																		$max = $max_price_html ? "{$max_price_html}({$max})" : wc_price( TMDSPRO_Price::get_price_with_temu_decimals( $max_price, $currency ), [
																				'currency' => $currency,
//																				'decimals'     => $decimals,
//																				'price_format' => '%1$s&nbsp;%2$s'
																			] ) . '(' . $max . ')';
																	}
																	echo wp_kses_post( $min . ' - ' . $max );
																} elseif ( $max_price ) {
																	$max = wc_price( TMDSPRO_Price::process_exchange_price( $max_price, $currency ) );
																	if ( $use_different_currency ) {
																		$max = $max_price_html ? "{$max_price_html}({$max})" : wc_price( TMDSPRO_Price::get_price_with_temu_decimals( $max_price, $currency ), [
																				'currency' => $currency,
//																				'decimals'     => $decimals,
//																				'price_format' => '%1$s&nbsp;%2$s'
																			] ) . '(' . $max . ')';
																	}
																	echo wp_kses_post( $max );
																}
															}
															?>
                                                        </div>
                                                    </div>
													<?php
													if ( $woo_product && $woo_product_status !== 'trash' ) {
														?>
                                                        <div class="field">
                                                            <label><?php esc_html_e( 'WooCommerce Price', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                                                            <div class="tmds-price-field">
																<?php echo wp_kses_post( $woo_product->get_price_html() ); ?>
                                                            </div>
                                                        </div>
														<?php
													}
													?>
                                                </div>
                                            </div>

                                            <div class="field">
                                                <div class="equal width fields">
                                                    <div class="field">
														<?php
														if ( ! empty( $import_info ) ) {
															$currency_symbol = $import_info['currency_symbol'] ?? $import_info['temu_locale_settings']['currency']['symbol'] ?? '';
															$tmp             = [
																$import_info['region_name'] ?? $import_info['region_code'] ?? $import_info['temu_locale_settings']['region']['name'] ?? '',
																$import_info['language_name'] ?? $import_info['temu_locale_settings']['language']['name'] ?? '',
																$currency_symbol ? $currency_symbol . '(' . $currency . ')' : $currency
															];
															printf( '<span class="tmds-import-from-note">%s %s</span>',
																esc_html__( 'Imported from', 'tmds-woocommerce-temu-dropshipping' ), esc_html( implode( ' | ', $tmp ) ) );
														}
														?>
                                                    </div>
                                                    <div class="field">
                                                        <div class="tmds-button-override-container">
															<?php
															if ( $status !== 'trash' ) {
																if ( $woo_product && $woo_product_status !== 'trash' ) {
																	?>
                                                                    <span class="vi-ui mini button negative tmds-button-delete"
                                                                          title="<?php esc_attr_e( 'Delete this product permanently', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                                          data-product_title="<?php echo esc_attr( $title ) ?>"
                                                                          data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                                          data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
	                                                                    <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                                    </span>
																	<?php
																	if ( ! $override_product_id ) {
																		?>
                                                                        <span class="vi-ui button positive mini tmds-button-override"
                                                                              title="<?php esc_attr_e( 'Override this product', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                                                                              data-product_title="<?php echo esc_attr( $title ) ?>"
                                                                              data-product_id="<?php echo esc_attr( $product_id ) ?>"
                                                                              data-woo_product_id="<?php echo esc_attr( $woo_product ? $woo_product_id : '' ) ?>">
                                                                            <?php esc_html_e( 'Override', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                                        </span>
																		<?php
																	} else {
																		echo wp_kses( self::button_override_html( $product_id, $override_product_id ), TMDSPRO_DATA::filter_allowed_html() );
																	}
																}
															}
															?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
					<?php
					$key ++;
				}
				echo wp_kses( $pagination_html, TMDSPRO_DATA::filter_allowed_html() );
			}
			?>
        </div>
		<?php
		self::delete_product_options();
	}

	/**
	 * @param $product_id
	 * @param $accordion_active
	 * @param $message_status
	 * @param $notice_time
	 *
	 * @return string
	 */
	public static function get_product_message( $product_id, &$accordion_active, &$message_status, &$notice_time ) {
		$product_notice = TMDSPRO_Post::get_post_meta( $product_id, '_tmds_update_product_notice', true );
		$message        = '';
		if ( empty( $product_notice ) ) {
			return $message;
		}
		$notice_time = $product_notice['time'] ?? '';

		switch ( $product_notice['status'] ?? '' ) {
			case 'not_available':
				$accordion_active = 'active';
				$message_status   = 'negative';
				$message          = esc_html__( 'This product is no longer available', 'tmds-woocommerce-temu-dropshipping' );
				break;
			case 'is_out_of_stock':
				$accordion_active = 'active';
				$message_status   = 'negative';
				$message          = esc_html__( 'This product is out of stock', 'tmds-woocommerce-temu-dropshipping' );
				break;
			case 'hide':
				if ( ! empty( $product_notice['not_available'] ) && is_array( $product_notice['not_available'] ) ) {
					$accordion_active = 'active';
					$message          = sprintf( _n( '%1$s variation of this product is no longer available: #%2$s', '%1$s variations of this product are no longer available: #%2$s', count( $product_notice['not_available'] ), 'tmds-woocommerce-temu-dropshipping' ), count( $product_notice['not_available'] ), implode( ', #', $product_notice['not_available'] ) );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
				} elseif ( ! empty( $product_notice['out_of_stock'] ) && is_array( $product_notice['out_of_stock'] ) ) {
					$message          = sprintf( _n( '%1$s variation of this product is out of stock: #%2$s', '%1$s variations of this product are out of stock: #%2$s', count( $product_notice['out_of_stock'] ), 'tmds-woocommerce-temu-dropshipping' ), count( $product_notice['out_of_stock'] ), implode( ', #', $product_notice['out_of_stock'] ) );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
					$accordion_active = 'active';
				} elseif ( ! empty( $product_notice['price_changes'] ) && is_array( $product_notice['price_changes'] ) ) {
					$price_changes = count( $product_notice['price_changes'] );
					if ( $price_changes === 1 ) {
						$message = sprintf( esc_html__( 'This product has price changed: #%s', 'tmds-woocommerce-temu-dropshipping' ), $product_notice['price_changes'][0] );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
					} else {
						$message = sprintf( esc_html__( '%1$s variations of this product have price changed: #%2$s', 'tmds-woocommerce-temu-dropshipping' ), $price_changes, implode( ', #', $product_notice['price_changes'] ) );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
					}
					$accordion_active = 'active';
				} elseif ( ! empty( $product_notice['price_exceeds'] ) && is_array( $product_notice['price_exceeds'] ) ) {
					$message          = sprintf( esc_html__( 'Price sync skipped because the percentage of change exceeds the set value: #%s', 'tmds-woocommerce-temu-dropshipping' ), implode( ', #', $product_notice['price_exceeds'] ) );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
					$accordion_active = 'active';
				}
				break;
		}

		return $message;
	}

	/**
	 * @param $product_id
	 * @param $overriding_product_id
	 *
	 * @return false|string
	 */
	public static function button_override_html( $product_id, $overriding_product_id ) {
		$text_complete  = esc_html__( 'Complete overriding', 'tmds-woocommerce-temu-dropshipping' );
		$text_cancel    = esc_html__( 'Cancel overriding', 'tmds-woocommerce-temu-dropshipping' );
		$title_complete = esc_html__( 'Go to Import list to complete overriding', 'tmds-woocommerce-temu-dropshipping' );
		$title_cancel   = esc_html__( 'Cancel overriding this product', 'tmds-woocommerce-temu-dropshipping' );
		$is_vendor      = false;
		ob_start();
		?>
        <a title="<?php echo esc_attr( $title_complete ) ?>"
           class="vi-ui button positive mini labeled icon tmds-button-complete-overriding"
           target="<?php echo esc_attr( $is_vendor ? '_self' : '_blank' ) ?>"
           href="<?php echo esc_url( add_query_arg( array( 'tmds_search_id' => $overriding_product_id ), TMDSPRO_Admin_Import_List::get_url() ) ) ?>">
            <i class="icon external"> </i>
			<?php echo esc_html( $text_complete ) ?>
        </a>
        <a title="<?php echo esc_attr( $title_cancel ) ?>"
           class="vi-ui button mini tmds-button-cancel-overriding"
           target="_self"
           href="<?php echo esc_url( add_query_arg( array(
			   'overridden_product'      => $product_id,
			   'cancel_overriding'       => $overriding_product_id,
			   'cancel_overriding_nonce' => wp_create_nonce( 'tmds_cancel_overriding_nonce' )
		   ), admin_url( 'admin.php?page=tmds-imported' ) ) ) ?>"><?php echo esc_html( $text_cancel ) ?></a>
		<?php
		return ob_get_clean();
	}

	public static function delete_product_options() {
		?>
        <div class="tmds-delete-product-options-container tmds-hidden">
            <div class="tmds-overlay"></div>
            <div class="tmds-delete-product-options-content">
                <div class="tmds-delete-product-options-content-header">
                    <h2 class="tmds-delete-product-options-content-header-delete tmds-hidden">
						<?php esc_html_e( 'Delete: ', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        <span class="tmds-delete-product-options-product-title"> </span>
                    </h2>
                    <span class="tmds-delete-product-options-close"> </span>
                </div>
                <div class="tmds-delete-product-options-content-body">
                    <div class="tmds-delete-product-options-content-body-row">
                        <div class="tmds-delete-product-options-delete-woo-product-wrap tmds-hidden">
                            <input type="checkbox" <?php checked( self::$settings->get_params( 'delete_woo_product' ), 1 ) ?>
                                   value="1"
                                   id="tmds-delete-product-options-delete-woo-product"
                                   class="tmds-delete-product-options-delete-woo-product">
                            <label for="tmds-delete-product-options-delete-woo-product">
								<?php esc_html_e( 'Also delete product from your WooCommerce store.', 'tmds-woocommerce-temu-dropshipping' ) ?>
                            </label>
                        </div>
                        <div class="tmds-delete-product-options-override-product-wrap tmds-hidden">
                            <label for="tmds-delete-product-options-override-product">
								<?php esc_html_e( 'Temu Product URL/ID:', 'tmds-woocommerce-temu-dropshipping' ) ?></label>
                            <input type="text"
                                   id="tmds-delete-product-options-override-product"
                                   class="tmds-delete-product-options-override-product">
                            <div class="tmds-delete-product-options-override-product-new-wrap tmds-hidden">
                                <span class="tmds-delete-product-options-override-product-new-close"> </span>
                                <div class="tmds-delete-product-options-override-product-new-image">
                                    <img src="<?php echo esc_url( TMDSPRO_IMAGES . 'loading.gif' ) ?>">
                                </div>
                                <div class="tmds-delete-product-options-override-product-new-title"></div>
                            </div>
                        </div>
                        <div class="tmds-delete-product-options-override-product-message"></div>
                    </div>
                </div>
                <div class="tmds-delete-product-options-content-footer">
                    <span class="vi-ui button positive mini tmds-delete-product-options-button-override tmds-hidden"
                          data-product_id="" data-woo_product_id="">
                            <?php esc_html_e( 'Check', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </span>
                    <span class="vi-ui button mini negative tmds-delete-product-options-button-delete tmds-hidden"
                          data-product_id="" data-woo_product_id="">
                            <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </span>
                    <span class="vi-ui button mini tmds-delete-product-options-button-cancel">
                            <?php esc_html_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </span>
                </div>
            </div>
            <div class="tmds-saving-overlay"></div>
        </div>
		<?php
	}

	public static function delete() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		self::$settings::villatheme_set_time_limit();
		$product_id         = isset( $_POST['product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_POST['product_id'] ) ) ) : '';
		$woo_product_id     = isset( $_POST['woo_product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_POST['woo_product_id'] ) ) ) : '';
		$delete_woo_product = isset( $_POST['delete_woo_product'] ) ? sanitize_text_field( wp_unslash( $_POST['delete_woo_product'] ) ) : '';
		if ( $delete_woo_product != self::$settings->get_params( 'delete_woo_product' ) ) {
			$args                       = self::$settings->get_params();
			$args['delete_woo_product'] = $delete_woo_product;
			update_option( 'tmds_params', $args );
		}
		$response = array(
			'status'  => 'success',
			'message' => '',
		);
		if ( $product_id ) {
			if ( TMDSPRO_Post::get_post( $product_id ) ) {
				$delete = TMDSPRO_Post::delete_post( $product_id, true );
				if ( false === $delete ) {
					$response['status']  = 'error';
					$response['message'] = esc_html__( 'Can not delete product', 'tmds-woocommerce-temu-dropshipping' );
				}
			}
			$product = wc_get_product( $woo_product_id );
			if ( $product ) {
				$product->delete_meta_data( '_' . $prefix . '_product_id' );
				$product->save();
				if ( 1 == $delete_woo_product ) {
					$delete = $product->delete( true );
					if ( false === $delete ) {
						$response['status']  = 'error';
						$response['message'] = esc_html__( 'Can not delete product', 'tmds-woocommerce-temu-dropshipping' );
					}
				}
			}
		}
		wp_send_json( $response );
	}


	/**
	 * Remove notices generated after syncing products
	 */
	public static function dismiss_product_notice() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		$product_id = isset( $_POST['product_id'] ) ? sanitize_text_field( wp_unslash( $_POST['product_id']) ) : '';
		$response   = array(
			'status'  => 'error',
			'message' => '',
		);
		if ( $product_id ) {
			$product_notice = (array) TMDSPRO_Post::get_post_meta( $product_id, '_tmds_update_product_notice', true );
			if ( $product_notice ) {
				$product_notice['status']        = '';
				$product_notice['not_available'] = array();
				$product_notice['out_of_stock']  = array();
				$product_notice['price_changes'] = array();
				TMDSPRO_Post::update_post_meta( $product_id, '_tmds_update_product_notice', $product_notice );
			}
			$response['status'] = 'success';
		}
		wp_send_json( $response );
	}

	/**
	 * Select a product to override
	 */
	public static function override() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		$response = array(
			'status'  => 'success',
			'message' => '',
		);
		TMDSPRO_DATA::villatheme_set_time_limit();
		$product_id           = isset( $_POST['product_id'] ) ? sanitize_text_field( wp_unslash( $_POST['product_id'] ) ) : '';
		$step                 = isset( $_POST['step'] ) ? sanitize_text_field( wp_unslash( $_POST['step'] ) ) : '';
		$override_product_url = isset( $_POST['override_product_url'] ) ? sanitize_text_field( wp_unslash( $_POST['override_product_url'] ) ) : '';
		$product_sku          = $redirect_url = '';
		if ( wc_is_valid_url( $override_product_url ) ) {
			preg_match( '/-(\d.*?)\.html/im', $override_product_url, $match );
			if ( $match && ! empty( $match[1] ) ) {
				$product_sku = $match[1];
			}
		} else {
			$product_sku = $override_product_url;
		}
		if ( $product_sku ) {
			$prefix           = self::$settings::$prefix;
			$exist_product_id = TMDSPRO_Post::get_post_id_by_temu_id( $product_sku );
			if ( $product_id == $exist_product_id || $product_sku == TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_sku', true ) ) {
				$response['message'] = esc_html__( 'Can not override itself', 'tmds-woocommerce-temu-dropshipping' );
			} else {
				if ( $step === 'check' ) {
					if ( $exist_product_id ) {
						$exist_product                = TMDSPRO_Post::get_post( $exist_product_id );
						$response['exist_product_id'] = $exist_product_id;
						$response['title']            = $exist_product->post_title;
						$gallery                      = TMDSPRO_Post::get_post_meta( $exist_product_id, '_' . $prefix . '_gallery', true );
						$response['image']            = ( is_array( $gallery ) && count( $gallery ) ) ? $gallery[0] : wc_placeholder_img_src();
						switch ( $exist_product->post_status ) {
							case 'override':
								$response['status']  = 'override';
								$response['message'] = esc_html__( 'This product is overriding an other product.', 'tmds-woocommerce-temu-dropshipping' );
								break;
							case 'draft':
								$response['status'] = 'success';
								break;
							default:
								$response['status']  = 'exist';
								$response['message'] = esc_html__( 'This product has already been imported', 'tmds-woocommerce-temu-dropshipping' );
								break;
						}
					} else {
						if ( wc_is_valid_url( $override_product_url ) ) {
							$redirect_url = $override_product_url;
						}
						if ( $redirect_url ) {
							$params                     = [
								$prefix . '_action'           => 'override',
								$prefix . "_from_domain"      => esc_url( site_url() ),
//		                        $prefix."_from_domain" => rawurlencode( site_url() ),
//		                        $prefix."_return_url" => rawurlencode( admin_url( 'admin.php?page='.$prefix ) ),
								$prefix . '_draft_product_id' => $product_id
							];
							$response['status']         = 'redirect';
							$response['redirect_url']   = $redirect_url;
							$response['redirect_param'] = $params;
							$response['message']        = esc_html__( 'Go to Temu', 'tmds-woocommerce-temu-dropshipping' );
						}
					}
				} else {
					$post             = TMDSPRO_Post::get_post( $product_id );
					$override_product = TMDSPRO_Post::get_post( $exist_product_id );
					if ( $post && $override_product ) {
						if ( $override_product->post_status === 'draft' ) {
							$update_post = TMDSPRO_Post::update_post( array(
									'ID'          => $exist_product_id,
									'post_status' => 'override',
									'post_parent' => $product_id,
									'edit_date'   => true,
								)
							);
							TMDSPRO_Post::update_post_meta( $product_id, '_' . $prefix . '_override_id', $exist_product_id );
							if ( ! is_wp_error( $update_post ) ) {
								$title                            = $override_product->post_title;
								$response['status']               = 'success';
								$response['button_override_html'] = self::button_override_html( $product_id, $exist_product_id );
								$response['data']                 = '<div class="vi-ui message"><span>' . sprintf( esc_html__( 'This product is being overridden by: %1$s. Please go to %2$s to complete the process.', 'tmds-woocommerce-temu-dropshipping' ), '<strong>' . $title . '</strong>', '<a target="_blank" href="' . admin_url( 'admin.php?page=tmds&tmds_search_id=' . $exist_product_id ) . '">Import list</a>' ) . '</span></div>';//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
							} else {
								$response['message'] = $update_post->get_error_message();
							}
						} else {
							$response['message'] = esc_html__( 'This product is not available to override', 'tmds-woocommerce-temu-dropshipping' );
						}
					} else {
						$response['message'] = esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' );
					}
				}
			}
		} else {
			$response['message'] = esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' );
		}
		wp_send_json( $response );
	}

	/**
	 * Restore a product from trash
	 */
	public static function restore() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		TMDSPRO_DATA::villatheme_set_time_limit();
		$product_id = isset( $_POST['product_id'] ) ? sanitize_text_field( wp_unslash( $_POST['product_id'] ) ) : '';
		$response   = array(
			'status'  => 'success',
			'message' => '',
		);
		if ( $product_id ) {
			$post = TMDSPRO_Post::get_post( $product_id );
			TMDSPRO_Post::publish_post( $post );
			$woo_id = TMDSPRO_Post::get_post_meta( $product_id, '_' . $prefix . '_woo_id', true );
			wp_untrash_post( $woo_id );
		}
		wp_send_json( $response );
	}

	/**
	 * Delete imported products
	 */
	public static function trash() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-imported' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		self::$settings::villatheme_set_time_limit();
		$product_id = isset( $_POST['product_id'] ) ? absint( sanitize_text_field( wp_unslash( $_POST['product_id'] ) ) ) : '';
		$response   = array(
			'status'  => 'success',
			'message' => '',
		);
		if ( $product_id ) {
			$reslut = TMDSPRO_Post::trash_post( $product_id );
			if ( ! $reslut ) {
				$response['status']  = 'error';
				$response['message'] = esc_html__( 'Can not delete product', 'tmds-woocommerce-temu-dropshipping' );
			}
		}
		wp_send_json( $response );
	}

}