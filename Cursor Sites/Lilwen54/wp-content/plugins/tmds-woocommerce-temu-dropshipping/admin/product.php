<?php

defined( 'ABSPATH' ) || exit;


class TMDSPRO_Admin_Product {
	private static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		add_filter( 'post_row_actions', array( $this, 'post_row_actions' ), 20, 2 );
		add_action( 'add_meta_boxes', array( $this, 'product_info_meta_box' ) );
		add_action( 'admin_print_styles', array( $this, 'admin_print_styles' ) );
		add_action( 'transition_post_status', array( $this, 'transition_post_status' ), 10, 3 );
		add_action( 'deleted_post', array( $this, 'deleted_post' ) );
		add_action( 'woocommerce_product_after_variable_attributes', [ $this, 'variation_add_dropship_variation_selection' ], 10, 3 );
		add_action( 'woocommerce_product_options_pricing', [ $this, 'simple_add_dropship_variation_selection' ], 99 );
		add_action( 'woocommerce_process_product_meta_simple', [ $this, 'woocommerce_process_product_meta_simple' ] );
		add_action( 'woocommerce_save_product_variation', array( $this, 'woocommerce_save_product_variation' ), 10, 2 );
		add_action( 'woocommerce_admin_process_product_object', array( $this, 'woocommerce_admin_process_product_object' ) );
	}

	/**
	 * @param $product WC_Product
	 */
	public function woocommerce_admin_process_product_object( $product ) {
		if ( ! wp_verify_nonce(sanitize_text_field( wp_unslash($_POST['tmds-video-nonce'] ?? '')), 'tmds-video' ) ) {
			return;
		}
		if ( $product && isset( $_POST['_tmds_show_product_video_tab'] ) ) {
			update_post_meta( $product->get_id(), '_tmds_show_product_video_tab', sanitize_text_field( wp_unslash( $_POST['_tmds_show_product_video_tab'] ) ) );
		}
	}

	/**
	 * @param $variation_id
	 * @param $i
	 */
	public function woocommerce_save_product_variation( $variation_id, $i ) {
		if ( ! wp_verify_nonce(sanitize_text_field( wp_unslash($_POST[ 'tmds-settings-' . $i . '-nonce' ] ?? '')), 'tmds-settings-' . $i ) ) {
			return;
		}
		$skuID = isset( $_POST['tmds_variation_id'], $_POST['tmds_variation_id'][ $i ] ) ? sanitize_text_field( wp_unslash( $_POST['tmds_variation_id'][ $i ] ) ) : '';
		if ( $skuID ) {
			update_post_meta( $variation_id, '_tmds_variation_id', $skuID );
		}
	}

	/**
	 * @param $product_id
	 */
	public function woocommerce_process_product_meta_simple( $product_id ) {
		if ( ! wp_verify_nonce( sanitize_text_field(wp_unslash($_POST['tmds-settings-nonce'] ?? '')), 'tmds-settings' ) ) {
			return;
		}
		$skuID = isset( $_POST['tmds_simple_variation_id'] ) ? sanitize_text_field( wp_unslash( $_POST['tmds_simple_variation_id'] ) ) : '';
		if ( $skuID ) {
			update_post_meta( $product_id, '_tmds_variation_id', $skuID );
		}
	}

	public function simple_add_dropship_variation_selection() {
		global $post;
		$product_id = $post->ID;
		$prefix     = self::$settings::$prefix;
		if ( get_post_meta( $product_id, '_' . $prefix . '_product_id', true ) ) {
			$from_id = TMDSPRO_Post::get_post_id_by_woo_id( $product_id, [ 'publish', 'override' ] );
			if ( $from_id ) {
				$variations = TMDSPRO_Post::get_post_meta( $from_id, '_' . $prefix . '_variations', true );
				$skuAttr    = get_post_meta( $product_id, '_' . $prefix . '_variation_id', true );
				if ( ! $skuAttr ) {
					return;
				}
				$available_variations = array();
				if ( is_array( $variations ) ) {
					foreach ( $variations as $value ) {
						if ( empty( $value['skuId'] ) ) {
							continue;
						}
						$attr_name  = [];
						$attributes = (array) ( $value['attributes'] ?? array() );
						if ( ! empty( $attributes ) ) {
							foreach ( $attributes as $attribute_item ) {
								$attr_name[] = $attribute_item['title'] ?? $attribute_item['id'];
							}
						}
						if ( ! empty( $attr_name ) ) {
							$attr_name = implode( ', ', $attr_name );
						}
						if ( ! $attr_name ) {
							continue;
						}
						$available_variations[ $value['skuId'] ] = $attr_name;
					}
				}
				if ( ! empty( $available_variations ) ) {
					$id = "tmds-original-attributes-simple-{$product_id}";
					wp_nonce_field( $prefix . '-settings', $prefix . '-settings-nonce', false );
					?>
                    <p class="tmds-original-attributes tmds-original-attributes-simple form-field">
                        <label for="<?php echo esc_attr( $id ) ?>">
							<?php esc_html_e( 'Original Temu variation', 'tmds-woocommerce-temu-dropshipping' ); ?>
                        </label>
						<?php echo wp_kses_post( wc_help_tip( esc_html__( 'If your customers buy this product, this selected Temu variation will be used when fulfilling Temu orders', 'tmds-woocommerce-temu-dropshipping' ) ) ) ?>
                        <select id="<?php echo esc_attr( $id ) ?>" class="tmds-original-attributes-select"
                                name="tmds_simple_variation_id">
                            <option value=""><?php esc_html_e( 'Please select original variation', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
							<?php
							foreach ( $available_variations as $k => $v ) {
								printf( '<option value="%1$s"  data-tmds_sku_id="%1$s" %2$s>%3$s</option>',
									esc_attr( $k ), selected( $k, $skuAttr, false ), esc_html( $v ) );
							}
							?>
                        </select>
                    </p>
					<?php
				}
			}
		}
	}

	/**
	 * @param $loop
	 * @param $variation_data
	 * @param $variation WP_Post
	 */
	public function variation_add_dropship_variation_selection( $loop, $variation_data, $variation ) {
		global $post;
		$product_id = $post->ID;
		$prefix     = self::$settings::$prefix;
		if ( $variation && get_post_meta( $product_id, '_' . $prefix . '_product_id', true ) ) {
			$from_id = TMDSPRO_Post::get_post_id_by_woo_id( $product_id, [ 'publish', 'override' ] );
			if ( $from_id ) {
				$variation_id = $variation->ID;
				$variations   = TMDSPRO_Post::get_post_meta( $from_id, '_' . $prefix . '_variations', true );
				$skuAttr      = get_post_meta( $variation_id, '_' . $prefix . '_variation_id', true );
				$id           = $prefix . "-original-attributes-{$variation_id}";
				wp_nonce_field( $prefix . '-settings-' . $loop, $prefix . '-settings-' . $loop . '-nonce', false );
				?>
                <div class="tmds-original-attributes tmds-original-attributes-variable">
                    <label for="<?php echo esc_attr( $id ) ?>">
						<?php esc_html_e( 'Original Temu variation', 'tmds-woocommerce-temu-dropshipping' ); ?>
                    </label>
					<?php echo wp_kses_post( wc_help_tip( esc_html__( 'If your customers buy this product, this selected Temu variation will be used when fulfilling Temu orders', 'tmds-woocommerce-temu-dropshipping' ) ) ) ?>
                    <select id="<?php echo esc_attr( $id ) ?>" class="tmds-original-attributes-select"
                            name="tmds_variation_id[<?php echo esc_attr( $loop ) ?>]">
						<?php
						if ( ! $skuAttr ) {
							?>
                            <option value=""><?php esc_html_e( 'Please select original variation', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
							<?php
						}
						foreach ( $variations as $key => $value ) {
							$attr_name  = [];
							$attributes = (array) ( $value['attributes'] ?? array() );
							if ( ! empty( $attributes ) ) {
								foreach ( $attributes as $attribute_item ) {
									$attr_name[] = $attribute_item['title'] ?? $attribute_item['id'];
								}
							}
							if ( ! empty( $attr_name ) ) {
								$attr_name = implode( ', ', $attr_name );
							}
							if ( ! $attr_name ) {
								continue;
							}

							printf( '<option value="%1$s"  data-tmds_sku_id="%1$s" %2$s>%3$s</option>',
								esc_attr( $value['skuId'] ), selected( $value['skuId'], $skuAttr, false ), esc_html( $attr_name ) );
						}
						?>
                    </select>
                </div>
				<?php
			}
		}
	}

	/**Set a product status
	 *
	 * @param $product_id
	 * @param string $status
	 */
	public function set_status( $product_id, $status = 'trash' ) {
		$import_id = self::$settings::get_temu_pd_id( $product_id );
		if ( $import_id ) {
			$id = TMDSPRO_Post::get_post_id_by_woo_id( $product_id );
			if ( $id ) {
				TMDSPRO_Post::update_post( array( 'ID' => $id, 'post_status' => $status ) );
			}
		}
	}

	/**Set a product status to trash when a WC product is deleted
	 *
	 * @param $product_id
	 */
	public function deleted_post( $product_id ) {
		$this->set_status( $product_id, 'trash' );
	}

	/**Set a product status to trash when a WC product is trashed and set to publish when a trashed product is restored
	 *
	 * @param $new_status
	 * @param $old_status
	 * @param $post
	 */
	public function transition_post_status( $new_status, $old_status, $post ) {
		if ( 'product' === $post->post_type ) {
			$product_id = $post->ID;
			if ( 'trash' === $new_status ) {
				$this->set_status( $product_id );
			} elseif ( $old_status === 'trash' ) {
				$this->set_status( $product_id, 'publish' );
			}
		}
	}

	/**
	 * @param $page
	 */
	public function admin_print_styles() {
		global $post_type;
		if ( $post_type !== 'product' ) {
			return;
		}
		$prefix = self::$settings::$prefix;
		?>
        <style id="<?php echo esc_attr( 'villatheme-inline-css-' . $prefix ) ?>">
            <?php echo wp_kses("#{$prefix}_product_info .{$prefix}-video-shortcode,#{$prefix}_product_info .{$prefix}-view-original-product-button a{width:100%;text-align:center;cursor:pointer}", self::$settings::filter_allowed_html()) ?>
        </style>
		<?php
	}

	public function add_meta_box_callback( $post ) {
		$product_id        = $post->ID;
		$import_product_id = self::$settings::get_temu_pd_id( $product_id );
		$import_url        = self::$settings::get_temu_pd_url( $product_id, true );
		$prefix            = self::$settings::$prefix;
		if ( $import_url ) {
			printf( "<p>%s <a target='_blank' href='%s'>%s</a></p>",
				esc_html__( 'External ID', 'tmds-woocommerce-temu-dropshipping' ),
				esc_url( $import_url ), esc_html( $import_product_id ) );
		}
		$video = get_post_meta( $product_id, '_' . $prefix . '_product_video', true );
		if ( $video ) {
			$product_video_tab   = get_post_meta( $product_id, '_' . $prefix . '_show_product_video_tab', true );
			$g_product_video_tab = self::$settings->get_params( 'product_video_tab' );
			$video_tab           = $g_product_video_tab ? esc_html__( 'Show', 'tmds-woocommerce-temu-dropshipping' ) : esc_html__( 'Hide', 'tmds-woocommerce-temu-dropshipping' );
			wp_nonce_field( $prefix . '-video', $prefix . '-video-nonce', false );
			?>
            <p>
                <label for="tmds-show-product-video-tab"><?php esc_html_e( 'Product video tab: ', 'tmds-woocommerce-temu-dropshipping' ); ?></label>
                <select id="tmds-show-product-video-tab" name="_tmds_show_product_video_tab">
                    <option value=""><?php echo wp_kses_post( sprintf( esc_html__( 'Global setting(%s)', 'tmds-woocommerce-temu-dropshipping' ), $video_tab ) );//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment ?></option>
                    <option value="show" <?php selected( $product_video_tab, 'show' ) ?>><?php esc_html_e( 'Show', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
                    <option value="hide" <?php selected( $product_video_tab, 'hide' ) ?>><?php esc_html_e( 'Hide', 'tmds-woocommerce-temu-dropshipping' ); ?></option>
                </select>
            </p>
            <div class="tmds-product-video-container"><?php echo do_shortcode( '[video src="' . $video . '"]' ); ?></div>
            <p><?php esc_html_e( 'Product video shortcode: ', 'tmds-woocommerce-temu-dropshipping' ); ?><input
                        title="<?php esc_attr_e( 'Click here to copy this shortcode', 'tmds-woocommerce-temu-dropshipping' ); ?>"
                        class="tmds-video-shortcode" type="text" readonly
                        value="<?php echo esc_attr( '[video src="' . $video . '" preload="metadata" class="wp-video-shortcode tmds-product-video-shortcode"]' ); ?>">
            </p>
			<?php
		}
		printf( "<p class='%s-view-original-product-button'><a target='_blank' class='button' href='%s'>%s</a></p>",
			esc_html( $prefix ),
			esc_url( admin_url( "admin.php?page={$prefix}-imported&{$prefix}_search_woo_id={$product_id}" ) ),
			esc_html__( 'View on Imported page', 'tmds-woocommerce-temu-dropshipping' ) );
	}

	public function product_info_meta_box() {
		global $post;
		$product_id = $post->ID ?? '';
		if ( self::$settings::get_temu_pd_id( $product_id ) ) {
			add_meta_box(
				self::$settings::$prefix . '_product_info',
				esc_html__( 'Temu product info', 'tmds-woocommerce-temu-dropshipping' ),
				[ $this, 'add_meta_box_callback' ],
				'product', 'side', 'high'
			);
		}
	}

	/**
	 * @param $actions
	 * @param $post
	 *
	 * @return mixed
	 */
	public function post_row_actions( $actions, $post ) {
		if ( $post && $post->post_type === 'product' && $post->post_status !== 'trash' ) {
			$import_url = self::$settings::get_temu_pd_url( $post->ID, true );
			if ( $import_url ) {
				$prefix                                        = self::$settings::$prefix;
				$actions[ $prefix . '_view_on_temu' ]          = sprintf( '<a href="%s" target="_blank">%s</a>', esc_url( $import_url ),
					esc_html__( 'View product on Temu', 'tmds-woocommerce-temu-dropshipping' ) );
				$actions[ $prefix . '_view_on_imported_page' ] = sprintf( '<a href="%s" target="_blank">%s</a>',
					esc_url( admin_url( "admin.php?page={$prefix}-imported&{$prefix}_search_woo_id={$post->ID}" ) ),
					esc_html__( 'View product on Imported', 'tmds-woocommerce-temu-dropshipping' ) );
			}
		}

		return $actions;
	}

	/**
	 * @param $page
	 */
	public function admin_enqueue_scripts( $page ) {
		global $post_type;
		if ( $post_type !== 'product' ) {
			return;
		}
		if ( $page === 'post.php' || $page == 'edit.php' ) {
			self::$settings::enqueue_style(
				array( 'tmds-admin-product', 'villatheme-show-message' ),
				array( 'admin-product', 'villatheme-show-message' ),
			);
			self::$settings::enqueue_script(
				array( 'tmds-admin-product', 'villatheme-show-message' ),
				array( 'admin-product', 'villatheme-show-message' )
			);
			wp_localize_script( 'tmds-admin-product', 'tmds_admin_product_params', array(
				'i18n_video_shortcode_copied' => esc_html__( 'Product video shortcode copied to clipboard. You can use it in product description, short description... to display video of this product', 'tmds-woocommerce-temu-dropshipping' ),
				'show_product_video_tab'      => self::$settings->get_params( 'product_video_tab' ),
			) );
		}
	}
}
