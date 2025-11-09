<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Error_Images {
	protected static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_head', array( $this, 'menu_product_count' ), 999 );
		add_action( 'admin_init', array( $this, 'empty_list' ) );
		add_filter( 'tmds_admin_ajax_events', [ $this, 'ajax_events' ], 10, 2 );
	}

	public function ajax_events( $events, $prefix ) {
		if ( ! is_array( $events ) ) {
			$events = [];
		}
		$events += [
			$prefix . '_search_product_failed_images'  => array(
				'function' => 'search_product_failed_images',
				'class'    => $this,
			),
			$prefix . '_download_error_product_images' => array(
				'function' => 'download_error_product_images',
				'class'    => $this,
			),
			$prefix . '_delete_error_product_images'   => array(
				'function' => 'delete_error_product_images',
				'class'    => $this,
			),
		];

		return $events;
	}

	public function menu_product_count() {
		global $submenu;
		$prefix = self::$settings::$prefix;
		if ( isset( $submenu[ $prefix ] ) ) {
			// Add count if user has access.
			if ( apply_filters( 'villatheme_' . $prefix . '_product_count_in_menu', true )
			     || current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_options', $prefix . '-error-images' ) )
			) {
				$product_count = TMDSPRO_Error_Images_Table::get_rows( 0, 0, true );
				foreach ( $submenu[ $prefix ] as $key => $menu_item ) {
					if ( ! empty( $menu_item[2] ) && $menu_item[2] === $prefix . '-error-images' ) {
						$count_label = sprintf( " <span class='update-plugins count-%s'><span class='%s-error-images-count'>%s</span></span>",
							esc_attr( $product_count ), esc_attr( $prefix ), esc_html( number_format_i18n( $product_count ) ) );

						$submenu[ $prefix ][ $key ][0] .= $count_label;
					}
				}
			}
		}
	}

	/**
	 * Add Screen Options
	 */
	public static function screen_options_page() {
		add_screen_option( 'per_page', array(
			'label'   => esc_html__( 'Number of items per page', 'tmds-woocommerce-temu-dropshipping' ),
			'default' => 10,
			'option'  => self::$settings::$prefix . '_error_images_per_page'
		) );
	}

	public static function page_callback() {
		$user     = get_current_user_id();
		$screen   = get_current_screen();
		$option   = $screen->get_option( 'per_page', 'option' );
		$per_page = get_user_meta( $user, $option, true );

		if ( empty ( $per_page ) || $per_page < 1 ) {
			$per_page = $screen->get_option( 'per_page', 'default' );
		}

		$paged  = isset( $_GET['paged'] ) ? absint( sanitize_text_field( wp_unslash( $_GET['paged'] ) ) ) : 1;// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$prefix = self::$settings::$prefix;
		?>
        <div class="wrap">
            <h2><?php esc_html_e( 'All failed images', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
			<?php
			$import_search_product_id = isset( $_GET[ $prefix . '_search_product_id' ] ) ? sanitize_text_field( wp_unslash( $_GET[ $prefix . '_search_product_id' ] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$count                    = TMDSPRO_Error_Images_Table::get_rows( 0, 0, true, $import_search_product_id );
			$results                  = TMDSPRO_Error_Images_Table::get_rows( $per_page, ( $paged - 1 ) * $per_page, false, $import_search_product_id );
			if ( count( $results ) ) {
				if ( self::$settings->get_params( 'use_external_image' ) || ! self::$settings->get_params( 'download_description_images' ) ) {
					?>
                    <div class="vi-ui negative message">
                        <div><?php esc_html_e( 'Please disable "Use external links for images" and enable "Import description images" to make Import button available for Description images', 'tmds-woocommerce-temu-dropshipping' ); ?></div>
                    </div>
					<?php
				}
				ob_start();
				?>
                <form class="vi-ui form">
                    <table class="vi-ui celled table">
                        <thead>
                        <tr>
                            <th><?php esc_html_e( 'Index', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Product ID', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Product Title', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Product/Variation IDs', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Image url', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Used for', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                            <th><?php esc_html_e( 'Actions', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                        </tr>
                        </thead>
                        <tbody>
						<?php
						foreach ( $results as $key => $result ) {
							$product = wc_get_product( $result['product_id'] ?? '' );
							if ( ! $product ) {
								?>
                                <tr>
                                    <td>
                                        <span class="tmds-index"><?php echo esc_html( $key + 1 ) ?></span>
                                    </td>

									<?php
									foreach ( $result as $result_k => $result_v ) {
										if ( $result_k === 'id' ) {
											continue;
										}
										?>
                                        <td>
										<span>
                                            <?php
                                            switch ( $result_k ) {
	                                            case 'image_src':
		                                            ?>
                                                    <img width="48" height="48"
                                                         src="<?php echo esc_attr( $result_v ) ?>">
		                                            <?php
		                                            break;
	                                            case 'product_ids':
		                                            echo esc_html( str_replace( ',', ', ', $result_v ) );
		                                            break;
	                                            case 'set_gallery':
		                                            if ( $result_v == 2 ) {
			                                            esc_attr_e( 'Description', 'tmds-woocommerce-temu-dropshipping' );
		                                            } elseif ( $result_v == 1 ) {
			                                            esc_attr_e( 'Gallery', 'tmds-woocommerce-temu-dropshipping' );
		                                            } else {
			                                            esc_attr_e( 'Product/variation image', 'tmds-woocommerce-temu-dropshipping' );
		                                            }
		                                            break;
	                                            default:
		                                            echo esc_html( $result_v );
                                            }
                                            ?>
                                        </span>
                                        </td>
										<?php
										if ( $result_k === 'product_id' ) {
											echo '<td>-</td>';
										}
									}
									?>
                                    <td>
                                        <div class="tmds-actions-container">
                                            <span><?php esc_html_e( 'The product this image belongs to was deleted so this image is now removed from list', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                                        </div>
                                    </td>
                                </tr>
								<?php
								TMDSPRO_Error_Images_Table::delete( $result['id'] );
							} else {
								?>
                                <tr>
                                    <td>
                                        <span class="tmds-index"><?php echo esc_html( $key + 1 ) ?></span>
                                    </td>
									<?php
									$hide_import_button = false;
									foreach ( $result as $result_k => $result_v ) {
										if ( $result_k === 'id' ) {
											continue;
										}
										?>
                                        <td>
										<span>
                                            <?php
                                            switch ( $result_k ) {
	                                            case 'image_src':
		                                            ?>
                                                    <img width="48" height="48"
                                                         src="<?php echo esc_attr( $result_v ) ?>">
		                                            <?php
		                                            break;
	                                            case 'product_ids':
		                                            echo esc_html( str_replace( ',', ', ', $result_v ) );
		                                            break;
	                                            case 'set_gallery':
		                                            if ( $result_v == 2 ) {
			                                            esc_attr_e( 'Description', 'tmds-woocommerce-temu-dropshipping' );
			                                            if ( self::$settings->get_params( 'use_external_image' ) || ! self::$settings->get_params( 'download_description_images' ) ) {
				                                            $hide_import_button = true;
			                                            }
		                                            } elseif ( $result_v == 1 ) {
			                                            esc_attr_e( 'Gallery', 'tmds-woocommerce-temu-dropshipping' );
		                                            } else {
			                                            esc_attr_e( 'Product/variation image', 'tmds-woocommerce-temu-dropshipping' );
		                                            }
		                                            break;
	                                            default:
		                                            echo esc_html( $result_v );
                                            }
                                            ?>
                                        </span>
                                        </td>
										<?php
										if ( $result_k === 'product_id' ) {
											?>
                                            <td>
                                                <a class="tmds-product-title" target="_blank"
                                                   href="<?php echo esc_attr( admin_url( 'post.php?action=edit&post=' . $result['product_id'] ) ) ?>">
													<?php echo esc_html( $product->get_title() ) ?>
                                                </a>
                                            </td>
											<?php
										}
									}
									?>
                                    <td>
                                        <div class="tmds-actions-container">
											<?php
											if ( ! $hide_import_button ) {
												?>
                                                <span class="vi-ui positive button tmds-action-download"
                                                      data-item_id="<?php echo esc_attr( $result['id'] ) ?>">
                                                    <?php esc_html_e( 'Import', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                                </span>
												<?php
											}
											?>
                                            <span class="vi-ui negative button tmds-action-delete"
                                                  data-item_id="<?php echo esc_attr( $result['id'] ) ?>">
                                                <?php esc_html_e( 'Delete', 'tmds-woocommerce-temu-dropshipping' ) ?>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
								<?php
							}
						}
						?>
                        </tbody>
                    </table>
                </form>

				<?php
				$image_list = ob_get_clean();

				ob_start();
				?>

                <form method="get">
                    <input type="hidden" name="page" value="tmds-error-images">
                    <div class="tablenav top">
                        <div class="tmds-button-all-container">
                            <span class="vi-ui button positive tmds-action-download-all"><?php esc_html_e( 'Import All', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                            <span class="vi-ui button negative tmds-action-delete-all"><?php esc_html_e( 'Delete All', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                            <a href="<?php echo esc_url( wp_nonce_url( add_query_arg( $prefix . '_empty_error_images', 1 ) ) ) ?>"
                               class="vi-ui button negative tmds-action-empty-error-images"
                               title="<?php esc_attr_e( 'Remove all failed images from database', 'tmds-woocommerce-temu-dropshipping' ) ?>"><?php esc_html_e( 'Empty List', 'tmds-woocommerce-temu-dropshipping' ) ?></a>
                        </div>
                        <div class="tablenav-pages">
                            <div class="pagination-links">
								<?php
								$total_page = ceil( $count / $per_page );

								/*Previous button*/
								$p_paged = $per_page * $paged > $per_page ? $paged - 1 : 0;

								if ( $p_paged ) {
									$p_url = add_query_arg(
										[
											'page'                         => $prefix . '-error-images',
											'paged'                        => $p_paged,
											$prefix . '_search_product_id' => $import_search_product_id,
										],
										admin_url( 'admin.php' ) );
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
								$n_paged = $per_page * $paged < $count ? $paged + 1 : 0;
								if ( $n_paged ) {
									$n_url = add_query_arg( [
										'page'                         => $prefix . '-error-images',
										'paged'                        => $n_paged,
										$prefix . '_search_product_id' => $import_search_product_id
									], admin_url( 'admin.php' ) ); ?>
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
								?>
                            </div>
                        </div>

						<?php
						$products      = TMDSPRO_Error_Images_Table::get_products_ids();
						$product_count = count( $products );
						if ( $product_count < 100 && $product_count > 1 ) {
							$product_options = [];

							foreach ( $products as $product_id ) {
								$product = wc_get_product( $product_id );
								if ( $product ) {
									$product_options[ $product_id ] = "(#{$product_id}){$product->get_title()}";
								}
							}

							if ( ! empty( $product_options ) ) {
								?>
                                <p class="search-box">
                                    <select name="<?php echo esc_attr( $prefix . '_search_product_id' ) ?>" class="tmds-search-product-id">
                                        <option value=""><?php esc_html_e( 'Filter by product', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
										<?php
										foreach ( $product_options as $pid => $title ) {
											printf( "<option value='%s' %s>%s</option>", esc_attr( $pid ), selected( $pid, $import_search_product_id, false ), esc_html( $title ) );
										}
										?>
                                    </select>
                                </p>
								<?php
							}
						} else {
							?>
                            <p class="search-box">
                                <select name="<?php echo esc_attr( $prefix . '_search_product_id' ) ?>" class="tmds-search-product-id-ajax">
									<?php
									if ( $import_search_product_id ) {
										$product = wc_get_product( $import_search_product_id );
										if ( $product ) {
											?>
                                            <option value="<?php echo esc_attr( $import_search_product_id ) ?>" selected>
												<?php echo esc_html( "(#{$import_search_product_id}){$product->get_title()}" ) ?>
                                            </option>
											<?php
										}
									}
									?>
                                </select>
                            </p>
							<?php
						}
						?>
                    </div>
                </form>

				<?php
				$pagination_html = ob_get_clean();
				echo wp_kses( $pagination_html, TMDSPRO_DATA::filter_allowed_html() );
				echo wp_kses( $image_list, TMDSPRO_DATA::filter_allowed_html() );
				echo wp_kses( $pagination_html, TMDSPRO_DATA::filter_allowed_html() );
			} else {
				?>
                <div class="vi-ui segment">
                    <p>
						<?php esc_html_e( "You don't have any failed images.", 'tmds-woocommerce-temu-dropshipping' ) ?>
                    </p>
                </div>
				<?php
			}
			wp_reset_postdata();
			?>
        </div>
		<?php
	}

	public static function search_product_failed_images() {
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . self::$settings::$prefix . '_admin_sub_menu_capability', 'manage_options', self::$settings::$prefix . '-error-images' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		$keyword = isset( $_GET['keyword'] ) ? sanitize_text_field( wp_unslash( $_GET['keyword'] ) ) : '';
		if ( empty( $keyword ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'empty keyword',
			) );
		}
		$found_products = array();
		$product_ids    = TMDSPRO_Error_Images_Table::get_products_ids( $keyword );
		foreach ( $product_ids as $product_id ) {
			$found_products[] = array(
				'id'   => $product_id,
				'text' => "(#{$product_id}) " . get_the_title( $product_id )
			);
		}
		wp_send_json( $found_products );
	}

	public static function download_error_product_images() {
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . self::$settings::$prefix . '_admin_sub_menu_capability', 'manage_options', self::$settings::$prefix . '-error-images' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		self::$settings::villatheme_set_time_limit();

		$id       = isset( $_POST['item_id'] ) ? sanitize_text_field( wp_unslash( $_POST['item_id'] ) ) : '';
		$response = [ 'status' => 'error', 'message' => 'Error' ];

		if ( $id ) {
			$data = TMDSPRO_Error_Images_Table::get_row( $id );

			if ( ! empty( $data ) ) {
				$product_id = $data['product_id'] ?? '';
				$post       = get_post( $product_id );
				if ( $post && $post->post_type === 'product' ) {
					if ( $data['set_gallery'] != 2 || ( ! self::$settings->get_params( 'use_external_image' ) && self::$settings->get_params( 'download_description_images' ) ) ) {
						$thumb_id = TMDSPRO_File::download_image( $image_id, $data['image_src'], $product_id );
						if ( is_wp_error( $thumb_id ) ) {
							$response['message'] = $thumb_id->get_error_message();
						} elseif ( $thumb_id ) {
							$cancel = apply_filters( 'tmds_cancel_set_product_gallery', false, $thumb_id, $data );
							if ( ! $cancel ) {
								if ( $data['set_gallery'] == 2 ) {
									$downloaded_url = wp_get_attachment_url( $thumb_id );
									$description    = html_entity_decode( $post->post_content, ENT_QUOTES | ENT_XML1, 'UTF-8' );
									$description    = preg_replace( '/[^"]{0,}' . preg_quote( $image_id, '/' ) . '[^"]{0,}/U', $downloaded_url, $description );
									$description    = str_replace( $data['image_src'], $downloaded_url, $description );
									wp_update_post( array( 'ID' => $product_id, 'post_content' => $description ) );
								} else {
									if ( $data['product_ids'] ) {
										$product_ids = explode( ',', $data['product_ids'] );
										foreach ( $product_ids as $v_id ) {
											if ( in_array( get_post_type( $v_id ), [ 'product', 'product_variation' ] ) ) {
												update_post_meta( $v_id, '_thumbnail_id', $thumb_id );
											}
										}
									}

									if ( 1 == $data['set_gallery'] ) {
										$gallery = get_post_meta( $product_id, '_product_image_gallery', true );
										if ( $gallery ) {
											$gallery_array = explode( ',', $gallery );
										} else {
											$gallery_array = array();
										}
										$gallery_array[] = $thumb_id;
										update_post_meta( $product_id, '_product_image_gallery', implode( ',', array_unique( $gallery_array ) ) );
									}
								}
							}
							$response['status'] = 'success';
							TMDSPRO_Error_Images_Table::delete( $id );
						}
					} else {
						$response['message'] = esc_html__( 'Please disable "Use external links for images" and enable "Import description images"', 'tmds-woocommerce-temu-dropshipping' );
					}
				} else {
					$response['message'] = esc_html__( 'Product does not exist', 'tmds-woocommerce-temu-dropshipping' );
				}
			} else {
				$response['message'] = esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' );
			}
		}
		wp_send_json( $response );
	}

	public static function delete_error_product_images() {
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . self::$settings::$prefix . '_admin_sub_menu_capability', 'manage_options', self::$settings::$prefix . '-error-images' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		self::$settings::villatheme_set_time_limit();

		$id       = isset( $_POST['item_id'] ) ? absint( $_POST['item_id'] ) : '';
		$response = array(
			'status'  => 'error',
			'message' => 'Error',
		);
		if ( $id ) {
			$delete = TMDSPRO_Error_Images_Table::delete( $id );
			if ( $delete ) {
				$response['status'] = 'success';
			} else {
				$response['message'] = esc_html__( 'Can not remove image from list', 'tmds-woocommerce-temu-dropshipping' );
			}
		} else {
			$response['message'] = esc_html__( 'Not found', 'tmds-woocommerce-temu-dropshipping' );
		}
		wp_send_json( $response );
	}

	public function empty_list() {
		$prefix = self::$settings::$prefix;
		$page   = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( ! empty( $_GET[ $prefix . '_empty_error_images' ] ) && $page === $prefix . '-error-images' ) {
			if ( isset( $_GET['_wpnonce'] ) && wp_verify_nonce( sanitize_key( $_GET['_wpnonce'] ) ) ) {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( "DELETE from %i", [ "{$wpdb->prefix}tmds_error_product_images" ] ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				wp_safe_redirect( admin_url( "admin.php?page={$page}" ) );
				exit();
			}
		}
	}
}
