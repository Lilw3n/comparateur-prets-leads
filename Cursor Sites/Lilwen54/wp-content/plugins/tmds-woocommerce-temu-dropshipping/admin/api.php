<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Api {
	protected $namespace;
	protected static $settings;

	public function __construct() {
		self::$settings  = TMDSPRO_DATA::get_instance();
		$this->namespace = self::$settings::$prefix;
		add_action( 'rest_api_init', array( $this, 'register_api' ) );
		add_filter( 'woocommerce_rest_is_request_to_rest_api', [ $this, 'rest_is_request_to_rest_api' ] );
	}

	public function rest_is_request_to_rest_api( $is_request_to_rest_api ) {
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return false;
		}
		$rest_prefix = trailingslashit( rest_get_url_prefix() );
		$request_uri = esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) );
		if ( false !== strpos( $request_uri, $rest_prefix . $this->namespace . '/' ) ) {
			$is_request_to_rest_api = true;
		}

		return $is_request_to_rest_api;
	}

	public function register_api() {
		register_rest_route( $this->namespace, '/check_plugin_active', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ $this, 'check_plugin_active' ],
			'permission_callback' => array( $this, 'plugin_permissions_check' ),
		] );
		/*Auth method*/
		register_rest_route( $this->namespace, '/auth', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ $this, 'auth' ],
			'permission_callback' => array( $this, 'plugin_permissions_check' ),
		] );

		register_rest_route( $this->namespace, '/auth/revoke_api_key', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ $this, 'revoke_api_key' ],
			'permission_callback' => [ $this, 'permissions_check' ],
		] );
		register_rest_route( $this->namespace, '/auth/sync', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ $this, 'sync_auth' ],
			'permission_callback' => [ $this, 'permissions_check' ],
		] );
		register_rest_route(
			$this->namespace, '/auth/get_product_sku', array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'get_product_sku_auth' ),
				'permission_callback' => array( $this, 'permissions_check_read_product' ),
			)
		);
		register_rest_route(
			$this->namespace, '/auth/request_order_address', array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'request_order_address' ),
				'permission_callback' => array( $this, 'permissions_check_read_order' ),
			)
		);
	}

	/**
	 * @param $request WP_REST_Request
	 *
	 * @return bool|WP_Error
	 */
	public function permissions_check_read_order( $request ) {
		if ( ! apply_filters( 'villatheme_' . $this->namespace . '_rest_check_shop_order_read_permission', wc_rest_check_post_permissions( 'shop_order', 'read', $request->get_param( 'order_id' ) ),
			$request->get_param( 'order_id' ) )
		) {
			return new WP_Error( 'woocommerce_rest_cannot_read', esc_html__( 'Unauthorized', 'tmds-woocommerce-temu-dropshipping' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function plugin_permissions_check() {
		if ( ! empty( TMDSPRO_DATA::get_instance()->get_params( 'enable' ) ) ) {
			return true;
		}

		return false;
	}

	/**
	 * @param $request WP_REST_Request
	 *
	 * @return bool|WP_Error
	 */
	public function permissions_check_read_product( $request ) {
		$product_ids = $request->get_param( 'product_ids' );
		$product_id  = isset( $product_ids['id'] ) ? wc_clean( wp_unslash( $product_ids['id'] ) ) : '';
		if ( ! apply_filters( 'villatheme_' . $this->namespace . '_rest_check_product_read_permission', wc_rest_check_post_permissions( 'product', 'read', $product_id ) ) ) {
			return new WP_Error( 'woocommerce_rest_cannot_read', esc_html__( 'Unauthorized', 'tmds-woocommerce-temu-dropshipping' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	/**
	 * @param $request WP_REST_Request
	 *
	 * @return bool|WP_Error
	 */
	public function permissions_check($request) {
		if ( ! apply_filters( 'villatheme_' . $this->namespace . '_rest_check_product_create_permission', wc_rest_check_post_permissions( 'product', 'create' ) ) ) {
			return new \WP_Error( 'woocommerce_rest_cannot_create', esc_html__( 'Unauthorized', 'tmds-woocommerce-temu-dropshipping' ),
				array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	public function check_plugin_active( \WP_REST_Request $request ) {
		wp_send_json( [ 'status' => 'success' ] );
	}

	public function auth( \WP_REST_Request $request ) {
		$consumer_key    = sanitize_text_field( $request->get_param( 'consumer_key' ) );
		$consumer_secret = sanitize_text_field( $request->get_param( 'consumer_secret' ) );
		if ( $consumer_key && $consumer_secret ) {
			update_option( 'villatheme_' . $this->namespace . '_temp_api_credentials', $request->get_params() );
		}
	}

	public function revoke_api_key( \WP_REST_Request $request ) {
		$this->get_woocommerce_api_key($request,$consumer_key ,$consumer_secret);

		wp_send_json(
			array(
				'status' => 'success',
				'result' => $this->revoke_woocommerce_api_key( $consumer_key, $consumer_secret ),
			)
		);
	}

	public function get_woocommerce_api_key($request,&$consumer_key ,&$consumer_secret){
		$consumer_key    = sanitize_text_field( $request->get_param( 'consumer_key' ) );
		$consumer_secret = sanitize_text_field( $request->get_param( 'consumer_secret' ) );
		if ( ! $consumer_key ) {
			$authorization = $request->get_header( 'authorization' );
			if ( $authorization ) {
				$authorization = base64_decode( substr( $authorization, 6 ) );// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
				$consumer      = explode( ':', $authorization );
				if ( count( $consumer ) === 2 ) {
					$consumer_key    = $consumer[0];
					$consumer_secret = $consumer[1];
				}
			}
		}

		if ( ! $consumer_key && ! empty( $_SERVER['PHP_AUTH_USER'] ) ) {
			$consumer_key = sanitize_text_field( wp_unslash( $_SERVER['PHP_AUTH_USER'] ) );
		}

		if ( ! $consumer_secret && ! empty( $_SERVER['PHP_AUTH_PW'] ) ) {
			$consumer_secret = sanitize_text_field( wp_unslash( $_SERVER['PHP_AUTH_PW'] ) );
		}
	}

	public function revoke_woocommerce_api_key( $consumer_key, $consumer_secret ) {
		global $wpdb;
		$consumer_key = wc_api_hash( sanitize_text_field( $consumer_key ) );
		$query        = "DELETE FROM %i WHERE consumer_key = %s AND consumer_secret=%s";

		return $wpdb->query( $wpdb->prepare( $query, [// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			"{$wpdb->prefix}woocommerce_api_keys",
			$consumer_key,
			$consumer_secret
		] ) );
	}

	public function sync_auth( \WP_REST_Request $request ) {
		$this->validate( $request );
		$this->import_to_list( $request );
	}

	public function import_to_list( \WP_REST_Request $request ) {
		$result = array(
			'status'       => 'error',
			'message_type' => 1,
		);
		TMDSPRO_DATA::villatheme_set_time_limit();
		$data   = $request->get_param( 'product_data' );
		$action = '';
		if ( ! empty( $data['tmds_url_values']['tmds_action'] ) ) {
			$action = $data['tmds_url_values']['tmds_action'];
		}
		$product_data = $this->parse_product_data( $data );
		if ( empty( $product_data ) || empty( $product_data['sku'] ) || empty( $product_data['url'] ) ) {
			$result['message'] = esc_html__( 'No product data was sent', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $result );
		}
		$currency             = $product_data['import_info']['currency_code'] ?? '';
		$import_currency_rate = self::$settings->get_params( 'import_currency_rate' );
		if ( ! $currency || empty( $import_currency_rate[ $currency ] ) ) {
			$result['message'] = esc_html__( 'There are no exchange rates to convert from this currency on Temu to your store currency when adding products to the import list. Please set the exchange rate before the import.', 'tmds-woocommerce-temu-dropshipping' );
			wp_send_json( $result );
		}
		$sku     = sanitize_text_field( wp_unslash( $product_data['sku'] ) );
		$post_id = TMDSPRO_Post::get_post_id_by_temu_id( $sku );
		if ( $action === 'sync' ) {
			if ( ! empty( $data['tmds_url_values']['tmds_product_id'] ) ) {
				$woo_product_id = $data['tmds_url_values']['tmds_product_id'];
			}
			if ( empty( $woo_product_id ) || ! $post_id ) {
				$result['message'] = esc_html__( 'Invalid product data', 'tmds-woocommerce-temu-dropshipping' );
			} else {
				$status      = $result['status'];
				$product_ids = array(
					'id'             => $post_id,
					'update_sku'     => $sku,
					'woo_product_id' => $woo_product_id,
				);
				TMDSPRO_Sync_Product::update_product_by_id( $product_ids, $product_data, $status, $message );
				$result['status']  = $status;
				$result['message'] = $message ?: esc_html__( 'Update successfully', 'tmds-woocommerce-temu-dropshipping' );
			}
		} else {
			if ( ! empty( $data['tmds_url_values']['tmds_draft_product_id'] ) ) {
				$override_to_id = $data['tmds_url_values']['tmds_draft_product_id'];
			}
			if ( ! $post_id ) {
				$parent = '';
				$status = 'draft';
				if ( $action === 'override' && ! empty( $override_to_id ) ) {
					$override_to = TMDSPRO_Post::get_post( $override_to_id );
					if ( $override_to ) {
						$parent = $override_to_id;
						$status = 'override';
					}
				}
				$post_id = $this->create_import_product( $product_data, [ 'post_parent' => $parent, 'post_status' => $status ] );

				if ( is_wp_error( $post_id ) ) {
					$result['message'] = $post_id->get_error_message();
					wp_send_json( $result );
				} elseif ( ! $post_id ) {
					$result['message'] = esc_html__( 'Can not create post', 'tmds-woocommerce-temu-dropshipping' );
					wp_send_json( $result );
				}
				if ( ! empty( $override_to ) ) {
					TMDSPRO_Post::update_post_meta( $override_to_id, '_tmds_override_id', $post_id );
				}
				$result['status']  = 'success';
				$result['message'] = esc_html__( 'Product is added to import list', 'tmds-woocommerce-temu-dropshipping' );
			} else {
				$result['message'] = esc_html__( 'Product exists', 'tmds-woocommerce-temu-dropshipping' );
			}
		}
		wp_send_json( $result );
	}

	public function create_import_product( $data, $post_data = [] ) {
		$prefix            = self::$settings::$prefix;
		$sku               = isset( $data['sku'] ) ? sanitize_text_field( $data['sku'] ) : '';
		$title             = isset( $data['name'] ) ? sanitize_text_field( $data['name'] ) : '';
		$description       = isset( $data['description'] ) ? wp_kses( stripslashes( $data['description'] ), TMDSPRO_DATA::filter_allowed_html() ) : '';
		$short_description = isset( $data['short_description'] ) ? wp_kses( stripslashes( $data['short_description'] ), TMDSPRO_DATA::filter_allowed_html() ) : '';
		$gallery           = isset( $data['gallery'] ) ? stripslashes_deep( $data['gallery'] ) : array();
		$desc_images       = [];
		if ( $description ) {
			preg_match_all( '/src="([\s\S]*?)"/im', $description, $matches );
			if ( isset( $matches[1] ) && is_array( $matches[1] ) && count( $matches[1] ) ) {
				$desc_images = array_values( array_unique( $matches[1] ) );
			}
		}
		$post_data = array_merge( [
			'post_title'   => $title,
			'post_type'    => "{$prefix}_draft_product",
			'post_status'  => 'draft',
			'post_excerpt' => '',
		], $post_data );
		$post_id   = TMDSPRO_Post::insert_post( $post_data, true );
		if ( $post_id && ! is_wp_error( $post_id ) ) {
			if ( ! empty( $desc_images ) ) {
				TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_description_images", $desc_images );
			}
			TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_short_description", $short_description );
			TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_description", $description );
			TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_sku", $sku );

			$gallery = array_unique( array_filter( $gallery ) );
			if ( ! empty( $gallery ) ) {
				TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_gallery", $gallery );
			}
			$arg = [ 'import_info', 'attributes', 'variation_images', 'variations', 'store_info', 'specifications' ];
			foreach ( $arg as $v ) {
				if ( empty( $data[ $v ] ) || ! is_array( $data[ $v ] ) ) {
					$data[ $v ] = [];
				}
				TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_{$v}", $data[ $v ] );
			}
			$arg = [ 'url', 'video', 'review' ];
			foreach ( $arg as $v ) {
				if ( ! empty( $data[ $v ] ) ) {
					TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_{$v}", $data[ $v ] );
				}
			}
			if ( self::$settings->get_params( 'product_import_cat' ) && ! empty( $data['product_cats'] ) && is_array( $data['product_cats'] ) ) {
				$product_cats   = [];
				$parent_term_id = '';
				foreach ( $data['product_cats'] as $item ) {
					$title = $item['title'] ?? '';
					if ( ! $title ) {
						continue;
					}
					$term_exist = term_exists( $title, 'product_cat' );
					if ( ! $term_exist ) {
						$insert_args = [ 'slug' => sanitize_title( $title ) ];
						if ( $parent_term_id ) {
							$insert_args['parent'] = $parent_term_id;
						}
						remove_all_actions( 'create_product_cat' );
						$new_term       = wp_insert_term( $title, 'product_cat', $insert_args );
						$product_cats[] = $parent_term_id = $new_term['term_id'];
					} else {
						$product_cats[] = $parent_term_id = $term_exist['term_id'];
					}
				}
				if ( ! empty( $product_cats ) ) {
					TMDSPRO_Post::update_post_meta( $post_id, "_{$prefix}_categories", $product_cats );
				}
			}
		}

		return $post_id;
	}

	public function parse_product_data( $data ) {
		$data = wp_parse_args([
			'product_attributes' => self::$settings::json_decode($data['product_attributes']?? []),
			'product_cats' => self::$settings::json_decode($data['product_cats']?? []),
			'product_gallery' => self::$settings::json_decode($data['product_gallery']?? []),
			'product_review' => self::$settings::json_decode($data['product_review']?? []),
			'product_specifics' => self::$settings::json_decode($data['product_specifics']?? []),
			'product_variations' => self::$settings::json_decode($data['product_variations']?? []),
			'product_video' => self::$settings::json_decode($data['product_video']?? []),
			'temu_attributes' => self::$settings::json_decode($data['temu_attributes']?? []),
			'temu_variations' => self::$settings::json_decode($data['temu_variations']?? []),
			'variation_ids' => self::$settings::json_decode($data['variation_ids']?? []),
		], $data);
		$new_data = [
			'is_online'         => 1,
			'sku'               => $data['product_id'] ?? '',
			'product_sku'       => $data['product_sku'] ?? '',
			'url'               => $data['product_url'] ?? '',
			'name'              => $data['product_name'] ?? '',
			'description'       => $data['product_desc'] ?? '',
			'short_description' => '',
			'specifications'    => [],
			'store_info'        => $data['store_info'] ?? [],
			'video'             => $data['product_video'] ?? [],
			'review'            => $data['product_review'] ?? [],
			'product_cats'      => $data['product_cats'] ?? [],
			'gallery'           => [],
			'attributes'        => [],
			'variations'        => [],
			'variation_images'  => [],
			'import_info'       => [
				'temu_attributes' => $data['temu_attributes'] ?? [],
				'temu_variations' => $data['temu_variations'] ?? [],
				'language_code'   => $data['language_code'] ?? '',
				'language_name'   => $data['language_name'] ?? '',
				'region_code'     => $data['region_code'] ?? '',
				'region_name'     => $data['region_name'] ?? '',
				'currency_code'   => $data['currency_code'] ?? '',
				'currency_symbol' => $data['currency_symbol'] ?? '',
				'variation_ids'   => $data['variation_ids'] ?? [],
			],
		];
		$tmds_img = $src_attributes = $variations = $new_variation_images = [];
		if ( isset( $data['product_specifics'] ) && is_array( $data['product_specifics'] ) ) {
			$short_description = $specifications = [];
			foreach ( $data['product_specifics'] as $tmp ) {
				if ( ! empty( $tmp['key'] ) && ! empty( $tmp['values'] ) ) {
					$tmp_value           = is_array( $tmp['values'] ) ? implode( ', ', $tmp['values'] ) : $tmp['values'];
					$short_description[] = "<p>{$tmp['key']}: {$tmp_value}</p>";
					$specifications[]    = array(
						'attrName'  => $tmp['key'],
						'attrValue' => $tmp_value,
					);
				}
			}
			$new_data['specifications']    = $specifications;
			$new_data['short_description'] = implode( '', $short_description );
		}
		if ( ! empty( $data['product_gallery'] ) && is_array( $data['product_gallery'] ) ) {
			$tmds_img            = $data['product_gallery'];
			$new_data['gallery'] = $this->prepare_gallery( $tmds_img );
		}
		if ( ! empty( $data['product_attributes'] ) && is_array( $data['product_attributes'] ) && ! empty( $data['product_variations'] ) && is_array( $data['product_variations'] ) ) {
			$src_attributes     = $data['product_attributes'];
			$product_variations = $data['product_variations'];
			foreach ( $src_attributes as $i => $prop ) {
				if ( empty( $prop['title'] ) || empty( $prop['values'] ) || ! is_array( $prop['values'] ) ) {
					continue;
				}
				$slug                                   = wc_sanitize_taxonomy_name( $prop['title'] );
				$src_attributes[ $i ]['slug']           = $slug;
				$src_attributes[ $i ]['default_values'] = $prop['values'];
			}
			foreach ( $product_variations as $item ) {
				if ( empty( $item['product_sku'] ) ) {
					continue;
				}
				$sku_id                          = $item['product_sku'];
				$variation                       = [];
				$variation['sku']                = $sku_id;
				$variation['skuId']              = $sku_id;
				$variation['regular_price']      = $item['product_regular_price'] ?? '';
				$variation['sale_price']         = $item['product_sale_price'] ?? '';
				$variation['is_on_sale']         = $item['product_is_on_sale'] ?? '';
				$variation['sale_price_html']    = $item['product_sale_price_html'] ?? '';
				$variation['regular_price_html'] = $item['product_regular_price_html'] ?? '';
				$variation['stock']              = $item['product_stock'] ?? '';
				$variation['limit_qty']          = $item['product_limit_qty'] ?? '';
				$variation['attributes']         = $item['product_attributes'] ?? [];
				if ( ! empty( $item['product_img_url'] ) ) {
					$image                  = $this->prepare_gallery( $item['product_img_url'] );
					$variation['image']     = $image;
					$new_variation_images[] = $image;
				}
				$variation['shipping_cost'] = 0;
				$variations[]               = $variation;
			}
		} else {
			$variation                       = [];
			$variation['skuId']              = $new_data['product_sku'] ?? '';
			$variation['regular_price']      = $data['product_regular_price'] ?? '';
			$variation['sale_price']         = $data['product_sale_price'] ?? '';
			$variation['sale_price_html']    = $data['product_sale_price_html'] ?? '';
			$variation['regular_price_html'] = $data['product_regular_price_html'] ?? '';
			$variation['is_on_sale']         = $data['product_is_on_sale'] ?? '';
			$variation['stock']              = $data['product_stock'] ?? '';
			$variation['limit_qty']          = $data['product_limit_qty'] ?? '';
			$variation['shipping_cost']      = 0;
			$variations[]                    = $variation;
		}
		if ( ! empty( $src_attributes ) ) {
			$new_data['attributes'] = $src_attributes;
		}
		if ( ! empty( $variations ) ) {
			$new_data['variations']       = $variations;
			$new_data['variation_images'] = array_values( $new_variation_images );
		}
		$new_data['import_info']['images'] = $tmds_img;

		return $new_data;
	}

	public function prepare_gallery( $gallery ) {
		if ( ! empty( $gallery ) && is_array( $gallery ) ) {
			foreach ( $gallery as $key => $img ) {
				$gallery[ $key ] = $this->prepare_gallery( $img['url'] ?? $img );
			}
		} elseif ( 'https' !== substr( $gallery, 0, 5 ) ) {
			$gallery = set_url_scheme( $gallery, 'https' );
		}

		return $gallery;
	}

	/**
	 * @param $request WP_REST_Request
	 */
	public function get_product_sku_auth( $request ) {
		$this->validate( $request );
		$this->get_product_sku( $request );
	}

	/**
	 * @param $request WP_REST_Request
	 */
	public function get_product_sku( $request ) {
		$result   = array(
			'status'  => 'success',
			'message' => '',
			'data'    => wp_json_encode( array() ),
		);
		$products = $request->get_param( 'products' );
		if ( $products && is_array( $products ) ) {
			TMDSPRO_DATA::villatheme_set_time_limit();
			$args      = array(
				'tmds_query'     => 1,
				'post_type'      => 'tmds_draft_product',
				'posts_per_page' => count( $products ),
				'orderby'        => 'meta_value_num',
				'order'          => 'ASC',
				'post_status'    => array(
					'publish',
					'draft',
					'trash',
					'override'
				),
				'fields'         => 'ids',
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'AND',
					array(
						'key'     => '_tmds_sku',
						'value'   => $products,
						'compare' => 'IN'
					)
				)
			);
			$the_query = TMDSPRO_Post::query( $args );
			$post_ids  = $the_query->get_posts();
			wp_reset_postdata();
			$imported = array();
			if ( ! empty( $post_ids ) ) {
				foreach ( $post_ids as $id ) {
					$imported[] = TMDSPRO_Post::get_post_meta( $id, '_tmds_sku', true );
				}
				$result['data'] = wp_json_encode( $imported );
			}
		}
		wp_send_json( $result );
	}

	public function request_order_address( \WP_REST_Request $request ) {
		$this->validate( $request );
		$this->get_order_address( $request );
	}

	/**
	 * @param $request WP_REST_Request
	 */
	public function get_order_address( $request ) {
		$result = array(
			'status'  => 'error',
			'message' => esc_html__( 'Order not found', 'tmds-woocommerce-temu-dropshipping' ),
		);
		TMDSPRO_DATA::villatheme_set_time_limit();
		$order_id = $request->get_param( 'order_id' );
		$order    = wc_get_order( $order_id );
		if ( $order ) {
			$message                = '';
			$result['customerInfo'] = self::get_customer_info( $order, $message );
			if ( empty( $result['customerInfo'] ) ) {
				$result['message'] = $message ?: esc_html__( 'Can not find order address', 'tmds-woocommerce-temu-dropshipping' );
			} else {
				$result['message'] = esc_html__( 'Get the order address successfully', 'tmds-woocommerce-temu-dropshipping' );
				$result['status']  = 'success';
			}
		}
		wp_send_json( $result );
	}

	/**
	 * @param $order WC_Order
	 *
	 * @return array
	 */
	public static function get_customer_info( $order, &$message ) {
		$result                = [];
		$warehouse_enable      = self::$settings->get_params( 'warehouse_enable' );
		$shipping_country      = $country = $order->get_shipping_country();
		if ( $country === 'GB' ) {
			$country = 'UK';
		}
		if ( $warehouse_enable == 1 ) {
			$use_warehouse_address = true;
		} else {
			$allow_country         = isset( self::$settings->get_countries()[ $country ] );
			$use_warehouse_address = $warehouse_enable == 2  && !$allow_country;
			if ( ! $use_warehouse_address && ! $allow_country ) {
				$message = esc_html__( 'The order’s shipping country is not within the regions supported by Temu', 'tmds-woocommerce-temu-dropshipping' );
			}
		}
		$fields_position = [];
		if ( $use_warehouse_address ) {
			$warehouse_fields = self::$settings->get_params( 'warehouse_fields' );
			$country          = $warehouse_fields['country'];
			$temu_fields      = self::$settings::get_shipping_fields( $country );
			$parent_id        = 0;
			foreach ( $temu_fields as $key => $field ) {
				$value = $warehouse_fields[ $key ] ?? '';
				if ( isset( $field['order'] ) ) {
					$fields_position[ $key ] = $field['order'];
				}
				if ( ! empty( $field['detect'] ) ) {
					$value = self::$settings::get_address_fulfill( $country, $parent_id, $key, $warehouse_fields ) ?: $value;
				}
				$result[ $key ] = $value;
			}
		} elseif ( ! $message ) {
			$temu_fields        = self::$settings::get_shipping_fields( $country );
			$fulfill_map_fields = self::$settings->get_params( 'fulfill_map_fields' );
			$wc_fields          = self::$settings::get_wc_checkout_fields( $country );
			$prefix             = [];
			if ( ! empty( $wc_fields ) ) {
				foreach ( $wc_fields as $section_id => $fields ) {
					$prefix[] = $section_id . '_';
				}
			}
			$prefix     = '/' . ( implode( '|', $prefix ) ) . '/';
			$map_fields = $fulfill_map_fields[ $country ] ?? [];
			foreach ( $temu_fields as $key => $field ) {
				$meta_key = $map_fields[ $key ] ?? $field['wc_field'] ?? '';
				$value    = '';
				if ( $meta_key ) {
					$meta_key = preg_replace( $prefix, '', $meta_key, 1 );
					if ( is_callable( array( $order, "get{$meta_key}" ) ) ) {
						$value = $order->{"get{$meta_key}"}();
					} elseif ( is_callable( array( $order, "get_{$meta_key}" ) ) ) {
						$value = $order->{"get_{$meta_key}"}();
					} else {
						$value = $order->get_meta( $meta_key ) ?: $order->get_meta( '_' . $meta_key );
					}
					if ( $value ) {
						switch ( $meta_key ) {
							case 'shipping_state':
							case 'billing_state':
								if ( ! isset( $wc_states ) ) {
									$wc_states = WC()->countries->get_states( $shipping_country );
								}
								$change = false;
								switch ($country){
									case 'JP':
										if ( strpos($value,'JP') === 0){
											$change = true;
											if (!isset($jp_state)) {
												$jp_state = self::$settings::get_temu_data( 'address-children' . DIRECTORY_SEPARATOR . $country );
											}
											$jp_state = $jp_state[100]??[];
											if (is_array($jp_state) && !empty($jp_state)){
												foreach ( $jp_state as $region ) {
													if ( ! isset( $region['aw'] ) && ! isset( $region['c'] ) ) {
														continue;
													}
													if ($region['aw'] === $value){
														$value = $region['c'];
														break;
													}
												}
											}
										}
										break;
									case 'MY':
										$tmp_check = [
											'PJY'=> 'Wilayah Persekutuan Putrajaya',
											'KUL'=> 'Wilayah Persekutuan Kuala Lumpur',
										];
										if ( isset($tmp_check[$value])){
											$change = true;
											$value = $tmp_check[$value];
										}
										break;
								}
								if (!$change){
									$value = $wc_states[ $value ] ?? $value;
								}
								break;
						}
					}
				}
				$result[ $key ] = $value;
				if ( isset( $field['order'] ) ) {
					$fields_position[ $key ] = $field['order'];
				}
			}
		}
		if ( ! empty( $result ) ) {
			$country_data                   = self::$settings::get_temu_data( 'countries' )[$country]??[];
			$region_id                   = $country_data['region_id'] ?? '';
			$region_name                   = $country_data['region_name'] ?? '';
			$result['fulfill_region']    = $country;
			$result['fulfill_region_name']    = $region_name;
			$result['fulfill_region_id'] = $region_id;
			if ( ! empty( $fields_position ) ) {
				asort( $fields_position );
				$result['fulfill_pos'] = $fields_position;
			}
		}

		return apply_filters( 'villatheme_' . self::$settings::$prefix . '_get_fulfillment_customer_info', $result, $order );
	}

	public function validate( \WP_REST_Request $request ) {
		$result = array(
			'status'       => 'error',
			'message'      => '',
			'message_type' => 1,
		);

		/*check ssl*/
		if ( ! is_ssl() ) {
			$result['message']      = esc_html__( 'SSL is required', 'tmds-woocommerce-temu-dropshipping' );
			$result['message_type'] = 2;

			wp_send_json( $result );
		}

		/*check enable*/
		if ( ! self::$settings->get_params( 'enable' ) ) {
			/* translators: %s */
			$result['message']      = sprintf( esc_html__( '%s plugin is currently disabled. Please enable it to use this function.', 'tmds-woocommerce-temu-dropshipping' ),
				TMDSPRO_NAME );
			$result['message_type'] = 2;

			wp_send_json( $result );
		}
	}
}