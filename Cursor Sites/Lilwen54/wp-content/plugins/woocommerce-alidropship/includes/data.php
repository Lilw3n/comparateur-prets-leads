<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VI_WOOCOMMERCE_ALIDROPSHIP_DATA {
	private static $prefix, $cache        = [];
	private                 $params;
	private                 $default;
	private static          $countries;
	private static          $states;
	private static          $ali_states   = array();
	protected static        $instance     = null;
	protected static        $allow_html   = null;
	protected static        $is_ald_table = null;

	/**
	 * VI_WOOCOMMERCE_ALIDROPSHIP_DATA constructor.
	 */
	public function __construct() {
		self::$prefix = 'vi-wad-';
		global $wooaliexpressdropship_settings;
		if ( ! $wooaliexpressdropship_settings ) {
			$wooaliexpressdropship_settings = get_option( 'wooaliexpressdropship_params', array() );
		}
		$this->default = array(
			'enable'                                     => '1',
			'use_api'                                    => '1',
			'secret_key'                                 => '',
			'fulfill_billing_fields_in_latin'            => '',
			'remove_special_characters_shipping_fulfill' => '',
			'fulfill_default_carrier'                    => 'CAINIAO_STANDARD',
			'fulfill_default_phone_number'               => '',
			'fulfill_default_phone_number_override'      => '',
			'always_use_default_carrier'                 => '',
			'fulfill_default_phone_country'              => '',
			'fulfill_order_note'                         => 'I\'m dropshipping. Please DO NOT put any invoices, QR codes, promotions or your brand name logo in the shipments. Please ship as soon as possible for repeat business. Thank you!',
			'order_status_for_fulfill'                   => array( 'wc-completed', 'wc-on-hold', 'wc-processing' ),
			'order_status_after_ali_order'               => 'wc-completed',
			'order_status_after_sync'                    => 'wc-completed',
			'string_replace'                             => array(),
			'specification_replace'                      => array(),
			'carrier_name_replaces'                      => array(
				'from_string' => array(),
				'to_string'   => array(),
				'sensitive'   => array(),
			),
			'carrier_url_replaces'                       => array(
				'from_string' => array(),
				'to_string'   => array(),
			),
			'attributes_mapping_origin'                  => '[]',
			'attributes_mapping_replacement'             => '[]',
			'override_hide'                              => 0,
			'override_keep_product'                      => 1,
			'override_video'                             => 0,
			'override_title'                             => 0,
			'override_images'                            => 0,
			'override_specifications'                    => 0,
			'override_description'                       => 0,
			'override_find_in_orders'                    => 1,
			'override_link_only'                         => 1,
			'override_keep_sku'                          => 0,
			'update_order_auto'                          => 0,
			'update_order_interval'                      => 1,
			'update_order_hour'                          => '',
			'update_order_minute'                        => '',
			'update_order_second'                        => '',
			'update_order_http_only'                     => '',
			'key'                                        => '',
			'access_tokens'                              => array(),
			'access_token'                               => '',
			'split_auto_remove_attribute'                => '',
			'delete_woo_product'                         => 1,
			'shipping_company_mapping'                   =>
				array(
					'CAINIAO_CONSOLIDATION_AE'   => 'aliexpress-standard-shipping',
					'CAINIAO_CONSOLIDATION_SA'   => 'aliexpress-standard-shipping',
					'CAINIAO_PREMIUM'            => 'aliexpress-standard-shipping',
					'CAINIAO_ECONOMY'            => 'aliexpress-standard-shipping',
					'CAINIAO_FULFILLMENT_ECO'    => 'aliexpress-standard-shipping',
					'CAINIAO_STANDARD'           => 'aliexpress-standard-shipping',
					'ARAMEX'                     => 'aliexpress-standard-shipping',
					'AE_CAINIAO_STANDARD'        => 'aliexpress-standard-shipping',
					'AE_CN_SUPER_ECONOMY_G'      => 'aliexpress-standard-shipping',
					'YANWEN_JYT'                 => 'aliexpress-standard-shipping',
					'CPAM'                       => 'aliexpress-standard-shipping',
					'DHL'                        => 'aliexpress-standard-shipping',
					'DHLECOM'                    => 'aliexpress-standard-shipping',
					'TOLL'                       => 'aliexpress-standard-shipping',
					'E_EMS'                      => 'aliexpress-standard-shipping',
					'EMS'                        => 'aliexpress-standard-shipping',
					'EMS_ZX_ZX_US'               => 'aliexpress-standard-shipping',
					'FEDEX_IE'                   => 'aliexpress-standard-shipping',
					'FEDEX'                      => 'aliexpress-standard-shipping',
					'GATI'                       => 'aliexpress-standard-shipping',
					'POLANDPOST_PL'              => 'aliexpress-standard-shipping',
					'POST_NL'                    => 'aliexpress-standard-shipping',
					'ROYAL_MAIL'                 => 'aliexpress-standard-shipping',
					'Other'                      => 'aliexpress-standard-shipping',
					'SF_EPARCEL'                 => 'aliexpress-standard-shipping',
					'SF'                         => 'aliexpress-standard-shipping',
					'SGP'                        => 'aliexpress-standard-shipping',
					'SUNYOU_ECONOMY'             => 'aliexpress-standard-shipping',
					'CHP'                        => 'aliexpress-standard-shipping',
					'TNT'                        => 'aliexpress-standard-shipping',
					'PTT'                        => 'aliexpress-standard-shipping',
					'UBI'                        => 'aliexpress-standard-shipping',
					'UPSE'                       => 'aliexpress-standard-shipping',
					'UPS'                        => 'aliexpress-standard-shipping',
					'USPS'                       => 'aliexpress-standard-shipping',
					'YANWEN_ECONOMY'             => 'aliexpress-standard-shipping',
					'YANWEN_AM'                  => 'aliexpress-standard-shipping',
					'CAINIAO_FULFILLMENT_PRE'    => 'aliexpress-standard-shipping',
					'CAINIAO_FULFILLMENT_STD'    => 'aliexpress-standard-shipping',
					'CAINIAO_FULFILLMENT_SECO_G' => 'aliexpress-standard-shipping',
					'CAINIAO_EXPEDITED_ECONOMY'  => 'aliexpress-standard-shipping',
					'CAINIAO_STANDARD_HEAVY'     => 'aliexpress-standard-shipping',
					'CAINIAO_ECONOMY_SG'         => 'aliexpress-standard-shipping',
					'CAINIAO_STANDARD_SG_AIR'    => 'aliexpress-standard-shipping',
					'CAINIAO_STANDARD_SG'        => 'aliexpress-standard-shipping',
					'CAINIAO_SUPER_ECONOMY'      => 'aliexpress-standard-shipping',
					'CAINIAO_SUPER_ECONOMY_SG'   => 'aliexpress-standard-shipping',
					'CAINIAO_OVERSEAS_WH_STDUAE' => 'aliexpress-standard-shipping',
					'CPAP'                       => 'aliexpress-standard-shipping',
					'FLYT_ECONOMY_SG'            => 'aliexpress-standard-shipping',
					'OTHER_US'                   => 'aliexpress-standard-shipping',
					'SHUNYOU_STANDARD_SG'        => 'aliexpress-standard-shipping',
					'SUNYOU_RM'                  => 'aliexpress-standard-shipping',
					'SUNYOU_ECONOMY_SG'          => 'aliexpress-standard-shipping',
					'TOPYOU_ECONOMY_SG'          => 'aliexpress-standard-shipping',
					'VNLIN_SA'                   => 'aliexpress-standard-shipping',
				),
			'ali_shipping'                               => '',
			'ali_shipping_type'                          => 'new',
			/*none/new/new_only/add*/
			'ali_shipping_display'                       => 'popup',
			/*select/radio/popup*/
			'ali_shipping_option_text'                   => '[{shipping_cost}]{shipping_company} ({delivery_time})',
			'ali_shipping_show_tracking'                 => '',
			'ali_shipping_label'                         => 'Shipping',
			'ali_shipping_label_free'                    => 'Free Shipping',
			'ali_shipping_not_available_remove'          => '',
			'ali_shipping_not_available_message'         => '[{shipping_cost}] ({delivery_time})',
			'ali_shipping_not_available_cost'            => 0,
			'ali_shipping_not_available_time_min'        => 20,
			'ali_shipping_not_available_time_max'        => 30,
			'ali_shipping_select_variation_message'      => 'Please select a variation to see estimated shipping cost.',
			'ali_shipping_product_text'                  => 'Estimated shipping to {country}:',
			'ali_shipping_product_not_available_message' => 'This product can not be delivered to {country}.',
			'ali_shipping_product_enable'                => '',
			'enable_shipto_field'                        => '',
			'ali_shipping_product_position'              => 'after_cart',
			'ali_shipping_product_display'               => 'popup',
			'ali_shipping_remember_company'              => 1,
			/*select/radio/popup*/
			'ali_shipping_company_mask'                  => '[]',
			'ali_shipping_company_mask_time'             => 0,
			'cpf_custom_meta_key'                        => '',
			'add_cpf_to_street'                          => '',
			'billing_number_meta_key'                    => '',
			'shipping_number_meta_key'                   => '',
			'billing_neighborhood_meta_key'              => '',
			'shipping_neighborhood_meta_key'             => '',
			'rut_meta_key'                               => '',
			'rfc_curp_meta_key'                          => '',
			'migration_link_only'                        => '1',
			'restrict_products_by_vendor'                => '',
			'dokan_search_in_import_list'                => '',
			'disable_vendor_setting'                     => '',
			'dokan_duplicate_product'                    => '',
			'send_bcc_email_to_vendor'                   => '',
			'import_product_currency'                    => 'USD',
			'import_currency_rate'                       => '1',
			'import_currency_rate_CNY'                   => '',
			'import_currency_rate_RUB'                   => '',
			'import_currency_rate_EUR'                   => '',
			'exchange_rate_api'                          => 'google',
			'wise_api_token'                             => '',
			'exchange_rate_decimals'                     => 3,
			'exchange_rate_auto'                         => 0,
			'exchange_rate_interval'                     => 1,
			'exchange_rate_hour'                         => 1,
			'exchange_rate_minute'                       => 1,
			'exchange_rate_second'                       => 1,
			'exchange_rate_shipping'                     => array(),
			'use_external_image'                         => '',
			'disable_background_process'                 => '',
			'download_description_images'                => '',
			'show_shipping_option'                       => '1',
			'shipping_cost_after_price_rules'            => '1',
			'import_product_video'                       => '1',
			'show_product_video_tab'                     => '1',
			'product_video_tab_priority'                 => '50',
			'product_video_full_tab'                     => '',
			'price_change_max'                           => '',
			'auto_order_if_payment'                      => array(),
			'auto_order_if_status'                       => array( 'wc-processing', 'wc-completed' ),
			'show_menu_count'                            => array(
				'import_list',
				'ali_orders',
				'imported',
				'failed_images'
			),
			'debug_mode'                                 => '',
			'exclude_item_exist_tracking_number'         => '',
			'order_sync_priority'                        => '',
			'video_to_description'                       => '',
			'import_ali_product_categories'              => '',
			'ald_table'                                  => '',
		);
		$this->default = wp_parse_args( $this->default, $this->get_product_params() );
		$this->default = wp_parse_args( $this->default, $this->get_product_sync_params() );
		$this->params  = wp_parse_args( $wooaliexpressdropship_settings, $this->default );
	}

	/**
	 * Options used for product sync
	 *
	 * @return array
	 */
	public function get_product_sync_params() {
		return array(
			'update_product_auto'      => 0,
			'update_product_interval'  => 1,
			'update_product_hour'      => '',
			'update_product_minute'    => '',
			'update_product_second'    => '',
			'update_product_http_only' => '',
			'received_email'           => '',
			'send_email_if'            => array( 'is_offline', 'is_out_of_stock', 'price_changes' ),

			'send_email_subject_type_is_offline' => esc_html( 'Offline AliExpress product alert' ),
			'send_email_content_type_is_offline' => esc_html( 'Product #{wad_woo_id}: AliExpress product/variation(s) may be no longer available' ),

			'send_email_subject_type_shipping_removed' => esc_html( 'AliExpress product shipping removed alert' ),
			'send_email_content_type_shipping_removed' => esc_html( 'Product #{wad_woo_id}: AliExpress product\'s shipping method may be no longer available' ),

			'send_email_subject_type_is_out_of_stock' => esc_html( 'Out-of-stock AliExpress product alert' ),
			'send_email_content_type_is_out_of_stock' => esc_html( 'Product #{wad_woo_id}: AliExpress product/variation(s) may be out of stock' ),

			'send_email_subject_type_price_changes' => esc_html( 'AliExpress product price changes alert' ),
			'send_email_content_type_price_changes' => esc_html( 'Product #{wad_woo_id}: AliExpress product/variation(s) may have price changed' ),

			'update_product_quantity'              => 0,
			'update_product_price'                 => 0,
			'update_product_if_available_purchase' => 'publish',
			'update_product_if_out_of_stock'       => '',
			'update_product_if_not_available'      => '',
			'update_product_removed_variation'     => '',
			'sync_with_current_ali_country'        => '',
			'update_product_if_shipping_error'     => '',
			'update_product_exclude_products'      => array(),
			'update_product_exclude_onsale'        => '',
			'update_product_exclude_categories'    => array(),
			'update_product_statuses'              => array( 'publish', 'draft', 'pending' ),
		);
	}

	/**
	 * Options used for product import
	 *
	 * @return array
	 */
	public function get_product_params() {
		return array(
			'product_status'                => 'publish',
			'catalog_visibility'            => 'visible',
			'product_gallery'               => 1,
			'product_categories'            => array(),
			'product_shipping_class'        => '',
			'product_tags'                  => array(),
			'product_description'           => 'item_specifics_and_description',
			'product_sku'                   => '{ali_product_id}',
			'variation_visible'             => '',
			'manage_stock'                  => '1',
			'ignore_ship_from'              => 0,
			'ignore_ship_from_default'      => 'CN',
			'use_ali_regular_price'         => 0,
			'price_from'                    => array( 0 ),
			'price_to'                      => array( '' ),
			'plus_value'                    => array( 200 ),
			'plus_sale_value'               => array( - 1 ),
			'plus_value_type'               => array( 'percent' ),
			'price_default'                 => array(
				'plus_value'      => 2,
				'plus_sale_value' => 1,
				'plus_value_type' => 'multiply',
			),
			'auto_generate_unique_sku'      => '1',
			'simple_if_one_variation'       => '',
			'product_import_specifications' => 0,
			'use_global_attributes'         => '1',
			'alternative_attribute_values'  => '',
			'format_price_rules_enable'     => '',
			'format_price_rules_test'       => 0,
			'format_price_rules'            => array(),
			'update_product_custom_rules'   => array(),//each rule contains self::get_default_custom_rules()
			'import_default_carrier'        => 0,
		);
	}

	public function set_params( $params ) {
		$this->params = apply_filters( 'wooaliexpressdropship_set_params', $params );
	}

	/**
	 * @param string $name
	 * @param string $language
	 *
	 * @return bool|mixed|void
	 */

	public function get_params( $name = '', $language = '', $default = false ) {
		if ( ! $name ) {
			return apply_filters( 'wooaliexpressdropship_params', $this->params );
		}
		if ( $language && strpos( $language, '_' ) !== 0 ) {
			$language = '_' . $language;
		}
		$name_t      = $name . $language;
		$name_filter = 'wooaliexpressdropship_params_' . $name_t;
		switch ( $name ) {
			case 'key':
				$name_filter = '';
				break;
			case 'update_order_hour':
			case 'update_order_minute':
			case 'update_order_second':
			case 'update_product_hour':
			case 'update_product_minute':
			case 'update_product_second':
				$rand_arg = [
					'update_order_hour'     => 23,
					'update_order_minute'   => 59,
					'update_order_second'   => 59,
					'update_product_hour'   => 23,
					'update_product_minute' => 59,
					'update_product_second' => 59,
				];
				$result   = $this->params[ $name_t ] ?? $this->params[ $name ] ?? $default;
				if ( $result === '' ) {
					$result = wp_rand( 0, $rand_arg[ $name ] );
				}
				break;
		}
		if ( ! isset( $result ) ) {
			$result = $this->params[ $name_t ] ?? $this->params[ $name ] ?? $default;
		}

		return $name_filter ? apply_filters( $name_filter, $result ) : $result;
	}

	public static function access_token() {
		if ( isset( self::$cache['access_token'] ) ) {
			return self::$cache['access_token'];
		}
		$update_key = self::get_instance()->get_params( 'key' );
		if ( ! $update_key ) {
			return self::$cache['access_token'] = false;
		}
		$update_msg = get_option( 'woocommerce-alidropship_messages', '' );
		if ( empty( $update_msg ) ) {
			delete_transient( 'villatheme_item_43001' );
			do_action( 'villatheme_save_and_check_key_woocommerce-alidropship', $update_key );
			if ( ! get_option( 'woocommerce-alidropship_messages', '' ) ) {
				global $wp_version;
				$request = wp_remote_post( 'https://villatheme.com/wp-json/downloads/v3', array(
						'user-agent' => 'WordPress/' . $wp_version . '; ' . get_site_url(),
						'timeout'    => ( ( defined( 'DOING_CRON' ) && DOING_CRON ) ? 30 : 3 ),
						'body'       => array(
							'key' => $update_key,
							'id'  => 43001
						)
					)
				);
				if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
					$result = json_decode( $request['body'], true );
					set_transient( 'villatheme_item_43001', $result, 86400 );
					/*Update message*/
					if ( isset( $result['message'] ) && $result['message'] ) {
						$message = json_decode( $result['message'], true );
						update_option( 'woocommerce-alidropship_messages', $message );
					}
				}
			}

			return self::access_token();
		}
		if ( !isset( $update_msg['update'] ) ) {
			self::$cache['access_token'] = false;
		}elseif ( isset( $update_msg['message'] ) && strpos( $update_msg['message'], 'Key is being verified' ) !== false ) {
			self::$cache['access_token'] = false;
		}
        if (!isset( self::$cache['access_token'] ) ) {
	        self::$cache['access_token'] = in_array( $update_msg['update'], [ 1, 2 ] );
        }
		return self::$cache['access_token'];
	}

	/**
	 * @param bool $new
	 *
	 * @return VI_WOOCOMMERCE_ALIDROPSHIP_DATA
	 */
	public static function get_instance( $new = false ) {
		if ( $new || null === self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * @param $slug
	 *
	 * @return string
	 */
	public static function get_attribute_name_by_slug( $slug ) {
		return ucwords( str_replace( '-', ' ', $slug ) );
	}

	/**
	 * @param $url
	 *
	 * @return mixed
	 */
	public static function get_domain_from_url( $url ) {
		$url     = strtolower( $url );
		$url_arr = explode( '//', $url );
		if ( count( $url_arr ) > 1 ) {
			$url = str_replace( 'www.', '', $url_arr[1] );

		} else {
			$url = str_replace( 'www.', '', $url_arr[0] );
		}
		$url_arr = explode( '/', $url );
		$url     = $url_arr[0];

		return $url;
	}

	/**
	 * @param array $args
	 * @param bool $return_sku
	 *
	 * @return array
	 */
	public static function get_imported_products( $args = array(), $return_sku = false ) {
		$imported_products = array();
		$args              = wp_parse_args( $args, array(
			'post_type'      => 'vi_wad_draft_product',
			'posts_per_page' => - 1,
			'meta_key'       => '_vi_wad_sku',// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			'post_status'    => array(
				'publish',
				'draft',
				'override'
			),
			'fields'         => 'ids'
		) );

		$the_query = ALD_Product_Table::wp_query( $args );

		if ( $the_query->have_posts() ) {
			if ( $return_sku ) {
				foreach ( $the_query->posts as $product_id ) {
					$product_sku = get_post_meta( $product_id, '_vi_wad_sku', true );
					if ( $product_sku ) {
						$imported_products[] = $product_sku;
					}
				}
			} else {
				$imported_products = $the_query->posts;
			}
		}
		wp_reset_postdata();

		return $imported_products;
	}

	/**
	 * Get WooCommerce product ID(s)/count from AliExpress product ID
	 *
	 * @param $aliexpress_id
	 * @param bool $is_variation
	 * @param bool $count
	 * @param bool $multiple
	 *
	 * @return array|bool|object|string|null
	 */
	public static function product_get_woo_id_by_aliexpress_id( $aliexpress_id, $is_variation = false, $count = false, $multiple = false ) {
		global $wpdb;
		if ( $aliexpress_id ) {
			$table_posts    = "{$wpdb->prefix}posts";
			$table_postmeta = "{$wpdb->prefix}postmeta";
			if ( $is_variation ) {
				$post_type = 'product_variation';
				$meta_key  = '_vi_wad_aliexpress_variation_attr';
			} else {
				$post_type = 'product';
				$meta_key  = '_vi_wad_aliexpress_product_id';
			}
			if ( $count ) {
				$query   = "SELECT count(*) from {$table_postmeta} join {$table_posts} on {$table_postmeta}.post_id={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}' and {$table_posts}.post_status != 'trash' and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";
				$results = $wpdb->get_var( $wpdb->prepare( $query, $aliexpress_id ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query = "SELECT {$table_postmeta}.* from {$table_postmeta} join {$table_posts} on {$table_postmeta}.post_id={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}' and {$table_posts}.post_status != 'trash' and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";
				if ( $multiple ) {
					$results = $wpdb->get_results( $wpdb->prepare( $query, $aliexpress_id ), ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				} else {
					$query   .= ' LIMIT 1';
					$results = $wpdb->get_var( $wpdb->prepare( $query, $aliexpress_id ), 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				}
			}

			return $results;
		} else {
			return false;
		}
	}

	/**
	 * Get vi_wad_draft_product ID(s)/count from WooCommerce product ID
	 *
	 * @param $product_id
	 * @param bool $count
	 * @param bool $multiple
	 * @param array $status
	 *
	 * @return array|bool|object|string|null
	 */
	public static function product_get_id_by_woo_id( $product_id, $count = false, $multiple = false, $status = array( 'publish', 'draft', 'override' ) ) {
		global $wpdb;
		if ( $product_id ) {
			$table_posts    = self::is_ald_table() ? $wpdb->ald_posts : "{$wpdb->prefix}posts";
			$table_postmeta = self::is_ald_table() ? $wpdb->ald_postmeta : "{$wpdb->prefix}postmeta";
			$post_id_column = self::is_ald_table() ? 'ald_post_id' : 'post_id';
			$post_type      = 'vi_wad_draft_product';
			$meta_key       = '_vi_wad_woo_id';
			$post_status    = '';

			if ( $status ) {
				if ( is_array( $status ) ) {
					$status_count = count( $status );
					if ( $status_count === 1 ) {
						$post_status = " AND {$table_posts}.post_status='{$status[0]}' ";
					} elseif ( $status_count > 1 ) {
						$post_status = " AND {$table_posts}.post_status IN ('" . implode( "','", $status ) . "') ";
					}
				} else {
					$post_status = " AND {$table_posts}.post_status='{$status}' ";
				}
			}

			if ( $count ) {
				$query   = "SELECT count(*) from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'{$post_status}and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";
				$results = $wpdb->get_var( $wpdb->prepare( $query, $product_id ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query = "SELECT {$table_postmeta}.* from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'{$post_status}and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";

				if ( $multiple ) {
					$results = $wpdb->get_results( $wpdb->prepare( $query, $product_id ), ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				} else {
					$query   .= ' LIMIT 1';
					$results = $wpdb->get_var( $wpdb->prepare( $query, $product_id ), 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				}
			}

			return $results;
		} else {
			return false;
		}
	}

	/**
	 * Get vi_wad_draft_product ID that will override $product_id
	 *
	 * @param $product_id
	 *
	 * @return bool|string|null
	 */
	public static function get_overriding_product( $product_id ) {
		global $wpdb;
		if ( $product_id ) {
			$table_posts = self::is_ald_table() ? $wpdb->ald_posts : $wpdb->posts;
			$query       = "SELECT ID from {$table_posts} where {$table_posts}.post_type = 'vi_wad_draft_product' and {$table_posts}.post_status = 'override' and {$table_posts}.post_parent = %s LIMIT 1";

			return $wpdb->get_var( $wpdb->prepare( $query, $product_id ), 0 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		} else {
			return false;
		}
	}

	/**
	 * Get vi_wad_draft_product ID(s)/count from AliExpress product ID
	 *
	 * @param $aliexpress_id
	 * @param array $post_status
	 * @param bool $count
	 * @param bool $multiple
	 *
	 * @return array|string|null
	 */
	public static function product_get_id_by_aliexpress_id( $aliexpress_id, $post_status = [ 'publish', 'draft', 'override' ], $count = false, $multiple = false ) {
		global $wpdb;
		$table_posts    = self::is_ald_table() ? $wpdb->ald_posts : "{$wpdb->prefix}posts";
		$table_postmeta = self::is_ald_table() ? $wpdb->ald_postmeta : "{$wpdb->prefix}postmeta";
		$post_id_column = self::is_ald_table() ? 'ald_post_id' : 'post_id';
		$post_type      = 'vi_wad_draft_product';
		$meta_key       = '_vi_wad_sku';
		$args           = array();
		$where          = array();
		if ( $post_status ) {
			if ( is_array( $post_status ) ) {
				if ( count( $post_status ) === 1 ) {
					$where[] = "{$table_posts}.post_status=%s";
					$args[]  = $post_status[0];
				} else {
					$where[] = "{$table_posts}.post_status IN (" . implode( ', ', array_fill( 0, count( $post_status ), '%s' ) ) . ")";
					foreach ( $post_status as $v ) {
						$args[] = $v;
					}
				}
			} else {
				$where[] = "{$table_posts}.post_status=%s";
				$args[]  = $post_status;
			}
		}
		if ( $aliexpress_id ) {
			$where[] = "{$table_postmeta}.meta_key = '{$meta_key}'";
			$where[] = "{$table_postmeta}.meta_value = %s";
			$args[]  = $aliexpress_id;
			if ( $count ) {
				$query   = "SELECT count(*) from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'";
				$query   .= ' AND ' . implode( ' AND ', $where );
				$results = $wpdb->get_var( $wpdb->prepare( $query, $args ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query = "SELECT {$table_postmeta}.* from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'";
				$query .= ' AND ' . implode( ' AND ', $where );

				if ( $multiple ) {
					$results = $wpdb->get_col( $wpdb->prepare( $query, $args ), 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				} else {
					$query   .= ' LIMIT 1';
					$results = $wpdb->get_var( $wpdb->prepare( $query, $args ), 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				}
			}

		} else {
			$where[] = "{$table_postmeta}.meta_key = '{$meta_key}'";
			if ( $count ) {
				$query   = "SELECT count(*) from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'";
				$query   .= ' AND ' . implode( ' AND ', $where );
				$results = $wpdb->get_var( count( $args ) ? $wpdb->prepare( $query, $args ) : $query );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query   = "SELECT {$table_postmeta}.* from {$table_postmeta} join {$table_posts} on {$table_postmeta}.{$post_id_column}={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}'";
				$query   .= ' AND ' . implode( ' AND ', $where );
				$results = $wpdb->get_col( count( $args ) ? $wpdb->prepare( $query, $args ) : $query, 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			}
		}

		return $results;
	}

	public static function get_accept_currencies() {
		return [ 'RUB', 'EUR', 'CNY' ];
	}

	/**
	 * @param $url
	 * @param array $args
	 * @param string $html
	 * @param bool $skip_ship_from_check
	 *
	 * @return array
	 */
	public static function get_data( $url, $args = array(), $html = '', $skip_ship_from_check = false, $product_args = [] ) {
		$response   = array(
			'status'  => 'success',
			'message' => '',
			'code'    => '',
			'data'    => [],
		);
		$attributes = [ 'sku' => '' ];
		if ( $html === 'viwad_init_data_before' && ! empty( $product_args['product_id'] ) ) {
			$product_data = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::ali_request( [], wp_json_encode( $product_args ), [], 'https://aldapi.vinext.net/get_product' );
			if ( ( $product_args['action'] ?? '' ) === 'update' ) {
				return $product_data;
			}
			$html = isset( $product_data['data']['product'] ) ? $product_data['data']['product'] : [];
			if ( ! empty( $product_data['data']['freight'] ) ) {
				$response['freight'] = $product_data['data']['freight'];
			}
		}
		if ( ! $html && $url ) {
			$args             = wp_parse_args( $args, array(
				'user-agent' => self::get_user_agent(),
				'timeout'    => 10,
			) );
			$request          = wp_remote_get( $url, $args );
			$response['code'] = wp_remote_retrieve_response_code( $request );

			if ( ! is_wp_error( $request ) ) {
				$html = $request['body'];
			} else {
				$response['status']  = 'error';
				$response['message'] = $request->get_error_messages();

				return $response;
			}
		}
		$prepare = VIALD_CLASS_Parse_Ali_Data::parse_data( $attributes, $html, $skip_ship_from_check );
		if ( ! empty( $prepare['error'] ) ) {
			$response['status']  = 'error';
			$response['code']    = $prepare['code'] ?? '';
			$response['message'] = $prepare['message'] ?? '';

			return $response;
		}
		if ( ! empty( $attributes['sku'] ) ) {
			$response['data'] = $attributes;
		} else {
			$response['status'] = 'error';
		}

		return $response;
	}

	public static function add_to_import_list( $data, $shipping_info ) {
		$self = self::get_instance();

		$result                      = array(
			'status'       => 'error',
			'message'      => '',
			'message_type' => 1,
		);
		$sku                         = isset( $data['sku'] ) ? sanitize_text_field( $data['sku'] ) : '';
		$post_id                     = self::product_get_id_by_aliexpress_id( $sku );
		$dokan_duplicate_product     = $self->get_params( 'dokan_duplicate_product' );
		$restrict_products_by_vendor = $self->get_params( 'restrict_products_by_vendor' );
		$dokan_cond                  = class_exists( 'WeDevs_Dokan' ) && $dokan_duplicate_product && $restrict_products_by_vendor;
		if ( ! empty( $data['wad_need_reimport'] ) ) {
			if ( $post_id ) {
				$overriding_id = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_overriding_product( $post_id );
				$post_id       = $self->create_product( $data, $shipping_info, array( 'post_status' => 'override', 'post_parent' => $post_id ) );
				if ( is_wp_error( $post_id ) ) {
					$result['message'] = $post_id->get_error_message();

					return $result;
				} elseif ( ! $post_id ) {
					$result['message'] = esc_html__( 'Cannot create post to re-import', 'woocommerce-alidropship' );

					return $result;
				} else {
					if ( $overriding_id ) {
						ALD_Product_Table::wp_update_post( array(
								'ID'          => $overriding_id,
								'post_status' => 'draft',
								'post_parent' => '',
								'edit_date'   => true,
							)
						);
					}
				}
				$result['status']  = 'success';
				$result['message'] = esc_html__( 'Product is added to the import list to re-import', 'woocommerce-alidropship' );
			} else {
				$result['message'] = esc_html__( 'Cannot find the product data to re-import', 'woocommerce-alidropship' );
			}
			$result['ali_id'] = $sku;

			return $result;
		}
		if ( ! $post_id || $dokan_cond ) {
			$arg = [];
			if ( ! empty( $data['wad_need_override'] ) ) {
				$overriding_id = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_overriding_product( $post_id );
				$arg           = array(
					'post_status' => 'override',
					'post_parent' => $data['wad_need_override']
				);
			}
			$post_id = $self->create_product( $data, $shipping_info, $arg );
			if ( is_wp_error( $post_id ) ) {
				$result['message'] = $post_id->get_error_message();
				wp_send_json( $result );
			} elseif ( ! $post_id ) {
				$result['message'] = esc_html__( 'Cannot create post', 'woocommerce-alidropship' );
				wp_send_json( $result );
			}
			$result['status'] = 'success';

			if ( ! empty( $data['wad_need_override'] ) ) {
				$result['message'] = esc_html__( 'Product is added to the import list to override', 'woocommerce-alidropship' );
			} else {
				$result['message'] = esc_html__( 'Product is added to import list', 'woocommerce-alidropship' );
			}
			if ( ! empty( $overriding_id ) ) {
				ALD_Product_Table::wp_update_post( array(
						'ID'          => $overriding_id,
						'post_status' => 'draft',
						'post_parent' => '',
						'edit_date'   => true,
					)
				);
			}
		} else {
			$result['message'] = esc_html__( 'Product exists', 'woocommerce-alidropship' );
		}

		$result['ali_id'] = $sku;

		return $result;
	}


	/**
	 * @return string
	 */
	public static function get_user_agent() {
		$user_agent_list = get_option( 'vi_wad_user_agent_list' );
		if ( ! $user_agent_list ) {
			$user_agent_list = '["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.1.1 Safari\/605.1.15","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.80 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) HeadlessChrome\/60.0.3112.78 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; rv:60.0) Gecko\/20100101 Firefox\/60.0","Mozilla\/5.0 (Windows NT 6.1; Win64; x64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.90 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/64.0.3282.140 Safari\/537.36 Edge\/17.17134","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.131 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/64.0.3282.140 Safari\/537.36 Edge\/18.17763","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.80 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.1 Safari\/605.1.15","Mozilla\/5.0 (Windows NT 10.0; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.1.1 Safari\/605.1.15","Mozilla\/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64; Trident\/7.0; rv:11.0) like Gecko","Mozilla\/5.0 (X11; Linux x86_64; rv:60.0) Gecko\/20100101 Firefox\/60.0","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36 OPR\/60.0.3255.151","Mozilla\/5.0 (Windows NT 6.1; WOW64; Trident\/7.0; rv:11.0) like Gecko","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.80 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.13; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.80 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/62.0.3202.94 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.157 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko\/20100101 Firefox\/66.0","Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko\/20100101 Firefox\/68.0","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/72.0.3626.109 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.90 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36 OPR\/60.0.3255.109","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36 OPR\/60.0.3255.170","Mozilla\/5.0 (Windows NT 6.3; Win64; x64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Windows NT 10.0; WOW64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (iPad; CPU OS 12_3_1 like Mac OS X) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.1.1 Mobile\/15E148 Safari\/604.1","Mozilla\/5.0 (Windows NT 6.1; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) HeadlessChrome\/60.0.3112.78 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 YaBrowser\/19.6.1.153 Yowser\/2.5 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/70.0.3538.77 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 YaBrowser\/19.4.3.370 Yowser\/2.5 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 YaBrowser\/19.6.0.1574 Yowser\/2.5 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Ubuntu Chromium\/74.0.3729.169 Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.131 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.0 Safari\/605.1.15","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.86 Safari\/537.36","Mozilla\/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build\/JSS15J) AppleWebKit\/534.30 (KHTML, like Gecko) Version\/4.0 Mobile Safari\/534.30","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.0.3 Safari\/605.1.15","Mozilla\/5.0 (Windows NT 6.1) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/11.1.2 Safari\/605.1.15","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.80 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; WOW64; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/12.0.2 Safari\/605.1.15","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko\/20100101 Firefox\/45.0","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.90 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.157 Safari\/537.36","Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.90 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.169 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/72.0.3626.121 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.86 Safari\/537.36","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/75.0.3770.100 Safari\/537.36","Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko\/20100101 Firefox\/60.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.12; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/13.0 Safari\/605.1.15","Mozilla\/5.0 (Windows NT 6.1; rv:67.0) Gecko\/20100101 Firefox\/67.0","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36 OPR\/60.0.3255.151","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 Safari\/537.36 OPR\/60.0.3255.170","Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/74.0.3729.131 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; WOW64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/73.0.3683.103 YaBrowser\/19.4.3.370 Yowser\/2.5 Safari\/537.36","Mozilla\/5.0 (Windows NT 6.1; WOW64; rv:56.0) Gecko\/20100101 Firefox\/56.0","Mozilla\/5.0 (Windows NT 6.1; WOW64; rv:56.0) Gecko\/20100101 Firefox\/56.0"]';
			update_option( 'vi_wad_user_agent_list', $user_agent_list );
		}
		$user_agent_list_array = vi_wad_json_decode( $user_agent_list );
		$return_agent          = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
		$last_used             = get_option( 'vi_wad_last_used_user_agent', 0 );
		if ( $last_used == count( $user_agent_list_array ) - 1 ) {
			$last_used = 0;
			shuffle( $user_agent_list_array );
			update_option( 'vi_wad_user_agent_list', wp_json_encode( $user_agent_list_array ) );
		} else {
			$last_used ++;
		}
		update_option( 'vi_wad_last_used_user_agent', $last_used );
		if ( isset( $user_agent_list_array[ $last_used ] ) && $user_agent_list_array[ $last_used ] ) {
			$return_agent = $user_agent_list_array[ $last_used ];
		}

		return $return_agent;
	}

	/**
	 * @param string $sku
	 *
	 * @return bool
	 */
	public static function sku_exists( $sku = '' ) {
		$sku_exists = false;
		if ( $sku ) {
			$id_from_sku = wc_get_product_id_by_sku( $sku );
			$product     = $id_from_sku ? wc_get_product( $id_from_sku ) : false;
			$sku_exists  = $product && 'importing' !== $product->get_status();
		}

		return $sku_exists;
	}

	/**
	 * Set id, class or name
	 *
	 * @param $name
	 * @param bool $set_name
	 *
	 * @return string|void
	 */
	public static function set( $name, $set_name = false ) {
		if ( is_array( $name ) ) {
			return implode( ' ', array_map( array( 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA', 'set' ), $name ) );
		} else {
			if ( $set_name ) {
				return esc_attr( str_replace( '-', '_', self::$prefix . $name ) );
			} else {
				return esc_attr( self::$prefix . $name );
			}
		}
	}


	/**
	 * @param string $name
	 *
	 * @return array|bool|mixed|void
	 */
	public function get_default( $name = "" ) {
		if ( ! $name ) {
			return $this->default;
		} elseif ( isset( $this->default[ $name ] ) ) {
			return apply_filters( 'wooaliexpressdropship_params_default_' . $name, $this->default[ $name ] );
		} else {
			return false;
		}
	}

	/**
	 * @param $string_number
	 *
	 * @return float
	 */
	public static function string_to_float( $string_number ) {
		return floatval( str_replace( ',', '', $string_number ) );
	}

	/**
	 * @param $price
	 * @param bool $is_product_price
	 *
	 * @return float|int
	 */
	public function process_exchange_price( $price, $is_product_price = true ) {
		if ( ! $price ) {
			return $price;
		}
		$rate = floatval( $this->get_params( 'import_currency_rate' ) );
		if ( $rate ) {
			$price = $price * $rate;
		}
		if ( $is_product_price && $this->get_params( 'format_price_rules_enable' ) ) {
			self::format_price( $price );
		}

		return round( $price, wc_get_price_decimals() );
	}

	/**
	 * @param $price
	 * @param $value
	 * @param $type
	 *
	 * @return float|int
	 */
	protected static function calculate_price_base_on_type( $price, $value, $type ) {
		$match_value = floatval( $value );
		switch ( $type ) {
			case 'fixed':
				$price = $price + $match_value;
				break;
			case 'percent':
				$price = $price * ( 1 + $match_value / 100 );
				break;
			case 'multiply':
				$price = $price * $match_value;
				break;
			default:
				$price = $match_value;
		}

		return $price;
	}

	/**
	 * @param $price
	 * @param bool $is_sale_price
	 * @param bool $product_id
	 *
	 * @return float|int|mixed|void
	 */
	public function process_price( $price, $is_sale_price = false, $product_id = false ) {
		if ( ! $price ) {
			return $price;
		}
		$price_default   = $this->get_params( 'price_default' );
		$price_from      = $this->get_params( 'price_from' );
		$price_to        = $this->get_params( 'price_to' );
		$plus_value_type = $this->get_params( 'plus_value_type' );
		$plus_value      = $this->get_params( 'plus_value' );
		$plus_sale_value = $this->get_params( 'plus_sale_value' );
		if ( $product_id ) {
			$product = wc_get_product( $product_id );
			if ( $product ) {
				$custom_rules = $this->get_params( 'update_product_custom_rules' );
				if ( ! empty( $custom_rules ) ) {
					if ( $product->is_type( 'variation' ) ) {
						$product_id         = $product->get_parent_id();
						$parent             = wc_get_product( $product_id );
						$product_categories = $parent->get_category_ids();
					} else {
						$product_categories = $product->get_category_ids();
					}
					foreach ( $custom_rules as $custom_rule ) {
						if ( $custom_rule['products'] && ! in_array( $product_id, $custom_rule['products'] ) ) {
							continue;
						}
						if ( $custom_rule['excl_products'] && in_array( $product_id, $custom_rule['excl_products'] ) ) {
							continue;
						}
						if ( $custom_rule['categories'] && ! count( array_intersect( $custom_rule['categories'], $product_categories ) ) ) {
							continue;
						}
						if ( $custom_rule['excl_categories'] && count( array_intersect( $custom_rule['excl_categories'], $product_categories ) ) ) {
							continue;
						}
						$price_from      = $custom_rule['price_from'];
						$price_default   = $custom_rule['price_default'];
						$price_to        = $custom_rule['price_to'];
						$plus_value      = $custom_rule['plus_value'];
						$plus_sale_value = $custom_rule['plus_sale_value'];
						$plus_value_type = $custom_rule['plus_value_type'];
						break;
					}
				}
			}
		}
		$original_price = $price;
		if ( $is_sale_price ) {
			$level_count = count( $price_from );
			if ( $level_count > 0 ) {
				/*adjust price rules since version 1.0.1.1*/
				if ( ! is_array( $price_to ) || count( $price_to ) !== $level_count ) {
					if ( $level_count > 1 ) {
						$price_to   = array_values( array_slice( $price_from, 1 ) );
						$price_to[] = '';
					} else {
						$price_to = array( '' );
					}
				}
				$match = false;
				for ( $i = 0; $i < $level_count; $i ++ ) {
					if ( $price >= $price_from[ $i ] && ( $price_to[ $i ] === '' || $price <= $price_to[ $i ] ) ) {
						$match = $i;
						break;
					}
				}
				if ( $match !== false ) {
					if ( $plus_sale_value[ $match ] < 0 ) {
						$price = 0;
					} else {
						$price = self::calculate_price_base_on_type( $price, $plus_sale_value[ $match ], $plus_value_type[ $match ] );
					}
				} else {
					$plus_sale_value_default = isset( $price_default['plus_sale_value'] ) ? $price_default['plus_sale_value'] : 1;
					if ( $plus_sale_value_default < 0 ) {
						$price = 0;
					} else {
						$price = self::calculate_price_base_on_type( $price, $plus_sale_value_default, isset( $price_default['plus_value_type'] ) ? $price_default['plus_value_type'] : 'multiply' );
					}
				}
			}
		} else {
			$level_count = count( $price_from );
			if ( $level_count > 0 ) {
				/*adjust price rules since version 1.0.1.1*/
				if ( ! is_array( $price_to ) || count( $price_to ) !== $level_count ) {
					if ( $level_count > 1 ) {
						$price_to   = array_values( array_slice( $price_from, 1 ) );
						$price_to[] = '';
					} else {
						$price_to = array( '' );
					}
				}
				$match = false;
				for ( $i = 0; $i < $level_count; $i ++ ) {
					if ( $price >= $price_from[ $i ] && ( $price_to[ $i ] === '' || $price <= $price_to[ $i ] ) ) {
						$match = $i;
						break;
					}
				}
				if ( $match !== false ) {
					$price = self::calculate_price_base_on_type( $price, $plus_value[ $match ], $plus_value_type[ $match ] );
				} else {
					$price = self::calculate_price_base_on_type( $price, isset( $price_default['plus_value'] ) ? $price_default['plus_value'] : 2, isset( $price_default['plus_value_type'] ) ? $price_default['plus_value_type'] : 'multiply' );
				}
			}
		}

		return apply_filters( 'vi_wad_processed_price', $price, $is_sale_price, $original_price );
	}

	/**
	 * Format price based on created rules
	 *
	 * @param $price
	 *
	 * @return array
	 */
	public static function format_price( &$price ) {
		$applied = array();
		if ( $price ) {
			$instance = self::get_instance();
			$rules    = $instance->get_params( 'format_price_rules' );
			if ( is_array( $rules ) && ! empty( $rules ) ) {
				$decimals        = wc_get_price_decimals();
				$price           = self::string_to_float( $price );
				$int_part        = intval( $price );
				$decimal_part    = number_format( $price - $int_part, $decimals );
				$int_part_length = strlen( $int_part );
				if ( $decimals > 0 ) {
					foreach ( $rules as $key => $rule ) {
						if ( $rule['part'] === 'fraction' ) {
							if ( ( ! $rule['from'] && ! $rule['to'] ) || ( $price >= $rule['from'] && $price <= $rule['to'] ) || ( ! $rule['from'] && $price <= $rule['to'] ) || ( ! $rule['to'] && $price >= $rule['from'] ) ) {
								$compare_value = $decimal_part;
								$string        = substr( strval( $decimal_part ), 2 );
								if ( ( $rule['value_from'] === '' && $rule['value_to'] === '' ) || ( $compare_value >= self::string_to_float( ".{$rule['value_from']}" ) && $compare_value <= self::string_to_float( ".{$rule['value_to']}" ) ) || ( $rule['value_from'] === '' && $compare_value <= self::string_to_float( ".{$rule['value_to']}" ) ) || ( $rule['value_to'] === '' && $compare_value >= self::string_to_float( ".{$rule['value_from']}" ) ) ) {
									while ( ( $pos = strpos( $rule['value'], 'x' ) ) !== false ) {
										$replace = 'y';
										if ( $pos < strlen( $string ) ) {
											$replace = substr( $string, $pos, 1 );
										}
										$rule['value'] = substr_replace( $rule['value'], $replace, $pos, 1 );
									}
									$price        = $int_part + self::string_to_float( ".{$rule['value']}" );
									$decimal_part = $price - $int_part;
									$applied[]    = $key;
									break;
								}
							}
						}
					}
				}

				foreach ( $rules as $key => $rule ) {
					if ( $rule['part'] === 'integer' ) {
						if ( $price >= $rule['from'] && $price <= $rule['to'] ) {
							if ( $rule['value_from'] === '' && $rule['value_to'] === '' ) {
								$max = min( $int_part_length - 1, strlen( $rule['value'] ) );
								if ( $max > 0 ) {
									$compare_value = intval( substr( $int_part, $int_part_length - $max ) );
									$string        = strval( zeroise( $compare_value, $max ) );
									$rule['value'] = zeroise( $rule['value'], $max );
									while ( ( $pos = strpos( $rule['value'], 'x' ) ) !== false ) {
										$replace = 'y';
										if ( $pos < strlen( $string ) ) {
											$replace = substr( $string, $pos, 1 );
										}
										$rule['value'] = substr_replace( $rule['value'], $replace, $pos, 1 );
									}
									$price     = $int_part - $compare_value + intval( $rule['value'] ) + $decimal_part;
									$applied[] = $key;
									break;
								}
							} else {
								$max = min( $int_part_length, max( strlen( $rule['value_from'] ), strlen( $rule['value_to'] ), strlen( $rule['value'] ) ) );
								if ( $max > 0 ) {
									$compare_value = intval( substr( $int_part, $int_part_length - $max ) );
									$string        = strval( zeroise( $compare_value, $max ) );
									$rule['value'] = zeroise( $rule['value'], $max );
									if ( ( $compare_value >= intval( $rule['value_from'] ) && $compare_value <= intval( $rule['value_to'] ) ) ) {
										while ( ( $pos = strpos( $rule['value'], 'x' ) ) !== false ) {
											$replace = 'y';
											if ( $pos < strlen( $string ) ) {
												$replace = substr( $string, $pos, 1 );
											}
											$rule['value'] = substr_replace( $rule['value'], $replace, $pos, 1 );
										}
										$price     = $int_part - $compare_value + intval( $rule['value'] ) + $decimal_part;
										$applied[] = $key;
										break;
									}
								}
							}
						}
					}
				}
			}
		}

		return $applied;
	}

	/**
	 * @param $sku
	 * @param $variation_ids
	 *
	 * @return string
	 */
	public static function process_variation_sku( $sku, $variation_ids ) {
		$return = '';
		if ( is_array( $variation_ids ) && ! empty( $variation_ids ) ) {
			foreach ( $variation_ids as $key => $value ) {
				$variation_ids[ $key ] = wc_sanitize_taxonomy_name( $value );
			}
			$return = $sku . '-' . implode( '-', $variation_ids );
		}

		return $return;
	}

	/**
	 * AliExpress product description is usually from an individual url
	 *
	 * @param $description_url
	 *
	 * @return string|string[]|null
	 */
	private static function get_product_description_from_url( $description_url ) {
		$request       = wp_remote_get(
			$description_url,
			array(
				'user-agent' => self::get_user_agent(),
				'timeout'    => 10,
			)
		);
		$description   = '';
		$response_code = wp_remote_retrieve_response_code( $request );

		if ( ! is_wp_error( $request ) && $response_code !== 404 ) {
			if ( isset( $request['body'] ) && $request['body'] ) {
				$body        = preg_replace( '/<script\>[\s\S]*?<\/script>/im', '', $request['body'] );
				$description = $body;
			}
		}

		return $description;
	}

	/**
	 * Download product description from url then apply string & replace rules
	 *
	 * @param $product_id
	 * @param $description_url
	 * @param $description
	 * @param $product_description
	 */
	public static function download_description( $product_id, $description_url, $description, $product_description ) {
		if ( $description_url && $product_id ) {
			$request = wp_remote_get(
				$description_url,
				array(
					'user-agent' => self::get_user_agent(),
					'timeout'    => 10,
				)
			);
			if ( ! is_wp_error( $request ) && get_post_type( $product_id ) === 'vi_wad_draft_product' ) { //wait
				if ( isset( $request['body'] ) && $request['body'] ) {
					$body = preg_replace( '/<script\>[\s\S]*?<\/script>/im', '', $request['body'] );
					preg_match_all( '/src="([\s\S]*?)"/im', $body, $matches );
					if ( isset( $matches[1] ) && is_array( $matches[1] ) && ! empty( $matches[1] ) ) {
						ALD_Product_Table::update_post_meta( $product_id, '_vi_wad_description_images', viwad_prepare_url( array_values( array_unique( $matches[1] ) ) ) );
					}
					$instance    = self::get_instance();
					$str_replace = $instance->get_params( 'string_replace' );
					if ( isset( $str_replace['to_string'] ) && is_array( $str_replace['to_string'] ) && $str_replace_count = count( $str_replace['to_string'] ) ) {
						for ( $i = 0; $i < $str_replace_count; $i ++ ) {
							if ( $str_replace['sensitive'][ $i ] ) {
								$body = str_replace( $str_replace['from_string'][ $i ], $str_replace['to_string'][ $i ], $body );
							} else {
								$body = str_ireplace( $str_replace['from_string'][ $i ], $str_replace['to_string'][ $i ], $body );
							}
						}

					}
					if ( $product_description === 'item_specifics_and_description' || $product_description === 'description' ) {
						$description .= $body;
						ALD_Product_Table::wp_update_post( array( 'ID' => $product_id, 'post_content' => $description ) );
					}
				}
			}
		}
	}

	/**
	 * @return bool
	 */
	public static function get_disable_wp_cron() {
		return defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON === true;
	}

	/**
	 * Download image from url
	 *
	 * @param $image_id
	 * @param $url
	 * @param int $post_parent
	 * @param array $exclude
	 * @param string $post_title
	 * @param null $desc
	 *
	 * @return array|bool|int|object|string|WP_Error|null
	 */
	public static function download_image( &$image_id, $url, $post_parent = 0, $exclude = array(), $post_title = '', $desc = null ) {
		$url = str_replace( ' ', '', $url );
		global $wpdb;
		$instance = self::get_instance();
		if ( $instance->get_params( 'use_external_image' ) && ( class_exists( 'EXMAGE_WP_IMAGE_LINKS' ) || class_exists( '\EXMAGE\EXMAGE' ) ) ) {
			if ( class_exists( '\EXMAGE\EXMAGE' ) ) {
				$external_image = ( new EXMAGE\Admin\EXMAGEAdmin )->add_media( $url, '', $image_id, $post_parent );
			} else {
				$external_image = EXMAGE_WP_IMAGE_LINKS::add_image( $url, $image_id, $post_parent );
			}
			$thumb_id       = $external_image['id'] ? $external_image['id'] : new WP_Error( 'exmage_image_error', $external_image['message'] );
		} else {
			$new_url   = $url;
			$parse_url = wp_parse_url( $new_url );
			$scheme    = empty( $parse_url['scheme'] ) ? 'http' : $parse_url['scheme'];
			$image_id  = "{$parse_url['host']}{$parse_url['path']}";
			$new_url   = "{$scheme}://{$image_id}";
			preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG|webp|WEBP)/', $new_url, $matches );
			if ( ! is_array( $matches ) || empty( $matches ) ) {
				preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG|webp|WEBP)/', $url, $matches );
				if ( is_array( $matches ) && ! empty( $matches ) ) {
					$new_url  .= "?{$matches[0]}";
					$image_id .= "?{$matches[0]}";
				} elseif ( ! empty( $parse_url['query'] ) ) {
					$new_url .= '?' . $parse_url['query'];
				}
			} elseif ( ! empty( $parse_url['query'] ) ) {
				$new_url .= '?' . $parse_url['query'];
			}
			$thumb_id = self::get_id_by_image_id( $image_id );
			if ( ! $thumb_id ) {
				$thumb_id = vi_wad_upload_image( $new_url, $post_parent, $exclude, $post_title, $desc );

				if ( ! is_wp_error( $thumb_id ) ) {
					update_post_meta( $thumb_id, '_vi_wad_image_id', $image_id );
				}
			} elseif ( $post_parent ) {
				$table_postmeta = "{$wpdb->prefix}posts";
				$wpdb->query( $wpdb->prepare( "UPDATE {$table_postmeta} set post_parent=%s WHERE ID=%s AND post_parent = 0 LIMIT 1", array(// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
					$post_parent,
					$thumb_id
				) ) );
			}
		}

		return $thumb_id;
	}

	/**
	 * @param $image_id
	 * @param bool $count
	 * @param bool $multiple
	 *
	 * @return array|bool|object|string|null
	 */
	public static function get_id_by_image_id( $image_id, $count = false, $multiple = false ) {
		global $wpdb;
		if ( $image_id ) {
			$table_posts    = "{$wpdb->prefix}posts";
			$table_postmeta = "{$wpdb->prefix}postmeta";
			$post_type      = 'attachment';
			$meta_key       = "_vi_wad_image_id";
			if ( $count ) {
				$query   = "SELECT count(*) from {$table_postmeta} join {$table_posts} on {$table_postmeta}.post_id={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}' and {$table_posts}.post_status != 'trash' and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";
				$results = $wpdb->get_var( $wpdb->prepare( $query, $image_id ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query = "SELECT {$table_postmeta}.* from {$table_postmeta} join {$table_posts} on {$table_postmeta}.post_id={$table_posts}.ID where {$table_posts}.post_type = '{$post_type}' and {$table_posts}.post_status != 'trash' and {$table_postmeta}.meta_key = '{$meta_key}' and {$table_postmeta}.meta_value = %s";
				if ( $multiple ) {
					$results = $wpdb->get_results( $wpdb->prepare( $query, $image_id ), ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				} else {
					$query   .= ' LIMIT 1';
					$results = $wpdb->get_var( $wpdb->prepare( $query, $image_id ), 1 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				}
			}

			return $results;
		} else {
			return false;
		}
	}

	/**
	 * Get available shipping company
	 *
	 * @param string $slug
	 *
	 * @return array|mixed|string
	 */
	public static function get_shipping_companies( $slug = '' ) {
		$shipping_companies = apply_filters( 'vi_wad_aliexpress_shipping_companies', array(
			'AE_CAINIAO_STANDARD'      => "Cainiao Expedited Standard",
			'AE_CN_SUPER_ECONOMY_G'    => "Cainiao Super Economy Global",
			'ARAMEX'                   => "ARAMEX",
			'CAINIAO_CONSOLIDATION_SA' => "AliExpress Direct(SA)",
			'CAINIAO_CONSOLIDATION_AE' => "AliExpress Direct(AE)",
			'CAINIAO_ECONOMY'          => "AliExpress Saver Shipping",
			'CAINIAO_PREMIUM'          => "AliExpress Premium Shipping",
			'CAINIAO_STANDARD'         => "AliExpress Standard Shipping",
			'CAINIAO_FULFILLMENT_ECO'  => "Aliexpress Selection Saver",
			'CAINIAO_FULFILLMENT_STD'  => "Aliexpress Selection Standard",
			'CHP'                      => "Swiss Post",
			'CPAM'                     => "China Post Registered Air Mail",
			'DHL'                      => "DHL",
			'DHLECOM'                  => "DHL e-commerce",
			'EMS'                      => "EMS",
			'EMS_ZX_ZX_US'             => "ePacket",
			'E_EMS'                    => "e-EMS",
			'FEDEX'                    => "Fedex IP",
			'FEDEX_IE'                 => "Fedex IE",
			'GATI'                     => "GATI",
			'POST_NL'                  => "PostNL",
			'PTT'                      => "Turkey Post",
			'SF'                       => "SF Express",
			'SF_EPARCEL'               => "SF eParcel",
			'SGP'                      => "Singapore Post",
			'SUNYOU_ECONOMY'           => "SunYou Economic Air Mail",
			'TNT'                      => "TNT",
			'TOLL'                     => "DPEX",
			'UBI'                      => "UBI",
			'UPS'                      => "UPS Express Saver",
			'UPSE'                     => "UPS Expedited",
			'USPS'                     => "USPS",
			'YANWEN_AM'                => "Yanwen Special Line-YW",
			'YANWEN_ECONOMY'           => "Yanwen Economic Air Mail",
			'YANWEN_JYT'               => "China Post Ordinary Small Packet Plus",
			'POLANDPOST_PL'            => "Poland Post",
			'ROYAL_MAIL'               => "Royal Mail",
			'Other'                    => "Seller's Shipping Method",
		) );
		if ( $slug ) {
			return isset( $shipping_companies[ $slug ] ) ? $shipping_companies[ $slug ] : '';
		} else {
			natcasesort( $shipping_companies );

			return $shipping_companies;
		}
	}

	/**
	 * @return array|bool|mixed|string|void|null
	 */
	public static function get_masked_shipping_companies() {
		$instance           = self::get_instance();
		$shipping_companies = $instance->get_params( 'ali_shipping_company_mask' );
		if ( $shipping_companies ) {
			$shipping_companies = vi_wad_json_decode( $shipping_companies );
			if ( ! is_array( $shipping_companies ) || empty( $shipping_companies ) ) {
				$shipping_companies = self::get_default_masked_shipping_companies();
			} else {
				uasort( $shipping_companies, 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA::sort_by_column_origin' );
			}
		} else {
			$shipping_companies = self::get_shipping_companies();
		}

		return $shipping_companies;
	}

	/**
	 * @return array
	 */
	public static function get_default_masked_shipping_companies() {
		$company_mask           = array();
		$get_shipping_companies = self::get_shipping_companies();
		foreach ( $get_shipping_companies as $key => $value ) {
			$company_mask[ $key ] = array( 'origin' => $value, 'new' => '' );
		}

		return $company_mask;
	}

	/**
	 * @param $status
	 *
	 * @return int
	 */
	public static function count_posts( $status ) {
		$args      = array(
			'post_type'      => 'vi_wad_draft_product',
			'post_status'    => $status,
			'order'          => 'DESC',
			'meta_key'       => '_vi_wad_woo_id',// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'orderby'        => 'meta_value_num',
			'fields'         => 'ids',
			'posts_per_page' => 1,
		);
		$the_query = ALD_Product_Table::wp_query( $args );

		$total = isset( $the_query->found_posts ) ? $the_query->found_posts : 0;
		wp_reset_postdata();

		return $total;
	}

	/**
	 * @param $url
	 * @param array $args
	 *
	 * @return array
	 */
	public static function wp_remote_get( $url, $args = array() ) {
		$return = array(
			'status' => 'error',
			'data'   => '',
			'code'   => '',
		);
		$args   = array_merge( array(
			'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
			'timeout'    => 3,
		), $args );

		$request = wp_remote_get( $url, $args );

		if ( is_wp_error( $request ) ) {
			$return['data'] = $request->get_error_message();
			$return['code'] = $request->get_error_code();
		} else {
			$return['code'] = wp_remote_retrieve_response_code( $request );
			if ( $return['code'] === 200 ) {
				$return['status'] = 'success';
				$return['data']   = json_decode( $request['body'], true );
			}
		}

		return $return;
	}

	/**
	 * @param bool $count
	 * @param string $status
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array|string|null
	 */
	public static function get_ali_orders( $count = true, $status = 'to_order', $limit = 0, $offset = 0 ) {
		$instance = self::get_instance();
		global $wpdb;
		$woocommerce_order_items    = $wpdb->prefix . "woocommerce_order_items";
		$woocommerce_order_itemmeta = $wpdb->prefix . "woocommerce_order_itemmeta";
		$order_status_for_fulfill   = $instance->get_params( 'order_status_for_fulfill' );

		if ( class_exists( '\Automattic\WooCommerce\Utilities\OrderUtil' ) && \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled() ) {
			$posts  = $wpdb->prefix . "wc_orders";
			$select = "DISTINCT {$posts}.id";
			$query  = "FROM {$posts} LEFT JOIN {$woocommerce_order_items} ON {$posts}.id={$woocommerce_order_items}.order_id";
			$query  .= " LEFT JOIN {$woocommerce_order_itemmeta} ON {$woocommerce_order_items}.order_item_id={$woocommerce_order_itemmeta}.order_item_id";
			$query  .= " WHERE {$posts}.type='shop_order' AND {$woocommerce_order_itemmeta}.meta_key='_vi_wad_aliexpress_order_id'";
			if ( $order_status_for_fulfill ) {
				$query .= " AND {$posts}.status IN ( '" . implode( "','", $order_status_for_fulfill ) . "' )";
			}
		} else {
			$posts  = $wpdb->prefix . "posts";
			$select = "DISTINCT {$posts}.ID";
			$query  = "FROM {$posts} LEFT JOIN {$woocommerce_order_items} ON {$posts}.ID={$woocommerce_order_items}.order_id";
			$query  .= " LEFT JOIN {$woocommerce_order_itemmeta} ON {$woocommerce_order_items}.order_item_id={$woocommerce_order_itemmeta}.order_item_id";
			$query  .= " WHERE {$posts}.post_type='shop_order' AND {$woocommerce_order_itemmeta}.meta_key='_vi_wad_aliexpress_order_id'";
			if ( $order_status_for_fulfill ) {
				$query .= " AND {$posts}.post_status IN ( '" . implode( "','", $order_status_for_fulfill ) . "' )";
			}
		}

		if ( $status === 'to_order' ) {
			$query .= " AND {$woocommerce_order_itemmeta}.meta_value=''";
		}
		//		else {
		//			$query = "FROM {$posts} LEFT JOIN {$woocommerce_order_items} ON {$posts}.ID={$woocommerce_order_items}.order_id LEFT JOIN {$woocommerce_order_itemmeta} ON {$woocommerce_order_items}.order_item_id={$woocommerce_order_itemmeta}.order_item_id left JOIN `{$postmeta}` on `{$woocommerce_order_itemmeta}`.`meta_value`=`{$postmeta}`.`post_id` WHERE `{$woocommerce_order_itemmeta}`.`meta_key`='_product_id' and `{$postmeta}`.`meta_key`='_vi_wad_aliexpress_product_id' ";
		//		}

		if ( $count ) {
			$query = "SELECT COUNT({$select}) {$query}";

			return $wpdb->get_var( $query );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		} else {
			$query = "SELECT {$select} {$query}";
			if ( $limit ) {
				$query .= " LIMIT {$offset},{$limit}";
			}

			return $wpdb->get_col( $query, 0 );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		}
	}

	/**
	 * @param $sku
	 *
	 * @return string
	 */
	public static function get_aliexpress_product_url( $sku ) {
		return "https://www.aliexpress.com/item/{$sku}.html";
	}

	/**
	 * @param $aliexpress_order_id
	 *
	 * @return string
	 */
	public static function get_aliexpress_order_detail_url( $aliexpress_order_id ) {
		return "https://trade.aliexpress.com/order_detail.htm?orderId={$aliexpress_order_id}";
	}

	/**
	 * @param $aliexpress_order_id
	 *
	 * @return string
	 */
	public static function get_aliexpress_tracking_url( $aliexpress_order_id ) {
		return "http://track.aliexpress.com/logisticsdetail.htm?tradeId={$aliexpress_order_id}";
	}

	/**
	 * @param $order_id
	 * @param $ali_pid
	 *
	 * @return string
	 */
	public static function get_to_order_aliexpress_url( $order_id, $ali_pid ) {
		return add_query_arg( array(
			'fromDomain'  => urlencode( site_url() ),
			'orderID'     => $order_id,
			'fromProduct' => $ali_pid
		), 'https://www.aliexpress.com' );
	}

	/**
	 * @param string $aliexpress_order_id
	 *
	 * @return string
	 */
	public static function get_get_tracking_url( $aliexpress_order_id = '' ) {
		return add_query_arg( array(
			'fromDomain'          => urlencode( site_url() ),
			'tradeId'             => $aliexpress_order_id,
			'getTracking'         => 'manual',
			'redirectOrderStatus' => 'all',
		), 'https://www.aliexpress.com/p/order/index.html' );
	}

	/**
	 * @param $product_id
	 * @param bool $update_all
	 *
	 * @return string
	 */
	public static function get_update_product_url( $product_id, $update_all = true ) {
		$args = array(
			'fromDomain' => urlencode( site_url() ),
			'action'     => 'update_product',
		);
		if ( ! $update_all ) {
			$args['product_id'] = $product_id;
			$shipping_info      = ALD_Product_Table::get_post_meta( $product_id, '_vi_wad_shipping_info', true );
			$args['ali_id']     = ALD_Product_Table::get_post_meta( $product_id, '_vi_wad_sku', true );
			if ( $shipping_info && ! empty( $shipping_info['country'] ) ) {
				$args['from_country'] = VI_WOOCOMMERCE_ALIDROPSHIP_Admin_API::filter_country( $shipping_info['country'] );
			}

			if ( self::get_instance()->get_params( 'sync_with_current_ali_country' ) ) {
				$args['ald_sync_with_country'] = 'current';
			}
		}

		return add_query_arg( $args, self::get_aliexpress_product_url( ALD_Product_Table::get_post_meta( $product_id, '_vi_wad_sku', true ) ) );
	}

	/**
	 * @param bool $batch
	 * @param bool $ssl
	 *
	 * @return string
	 */
	public static function ali_ds_get_url( $batch = false, $ssl = true ) {
		$url = 'https://api-sg.aliexpress.com/sync';

		return apply_filters( 'vi_wad_ali_ds_get_url', $url, $batch, $ssl );
	}

	public static function get_params_to_get_signature( $args ) {
		if ( ! isset( self::$cache['params_to_get_signature'] ) ) {
			$self                                   = self::get_instance();
			self::$cache['params_to_get_signature'] = [
				'download_key' => $self->get_params( 'key' ),
				'access_token' => $self->get_params( 'access_token' ),
				'app_key'      => VI_WOOCOMMERCE_ALIDROPSHIP_APP_KEY,
				'site_url'     => self::get_domain_name()
			];
		}
		$result = wp_parse_args( self::$cache['params_to_get_signature'], [ 'data' => wp_json_encode( $args ) ] );

		return $result;
	}

	public static function ali_request_base_params( $args, $acc_tk = true ) {
		$self = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();

		$params = wp_parse_args( $args, array(
			'app_key'     => VI_WOOCOMMERCE_ALIDROPSHIP_APP_KEY,
			'format'      => 'json',
			'sign_method' => 'sha256',
		) );

		if ( $acc_tk ) {
			unset( $params['format'] );
			$params['session'] = $self->get_params( 'access_token' );
		}

		//		ksort( $params );

		return $params;
	}

	public static function ali_request( $params, $body = [], $request_args = [], $api_url = '' ) {
		$disable_stream = function($r) {
			$r['stream'] = false;
			return $r;
		};
		try {
			$url          = add_query_arg( array_map( 'urlencode', $params ), $api_url ?: 'https://api-sg.aliexpress.com/sync' );
			$request_args = wp_parse_args( $request_args, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'headers'    => array(
					'Content-Type' => 'text/plain;charset=UTF-8',
				),
				'body'       => $body,
				'timeout'    => 60,
			) );
			add_filter( 'http_request_timeout', array( 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA', 'bump_request_timeout' ), PHP_INT_MAX );
			add_filter('http_request_args', $disable_stream, 10, 1);
			$request = wp_remote_post( $url, $request_args );

			remove_filter( 'http_request_timeout', [ 'VI_WOOCOMMERCE_ALIDROPSHIP_DATA', 'bump_request_timeout' ] );
			remove_filter('http_request_args', $disable_stream, 10);
			if ( ! is_wp_error( $request ) ) {
				$body = wp_remote_retrieve_body( $request );

				return vi_wad_json_decode( $body, true );
			} else {
				return false;
			}
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Get signature to use with AliExpress API
	 *
	 * @param $args
	 * @param string $type
	 *
	 * @return array
	 */
	public static function ali_ds_get_sign( $args, $type = 'place_order' ) {
		$return = array(
			'status' => 'error',
			'data'   => '',
			'code'   => '',
		);
		switch ( $type ) {
			case 'get_shipping':
				$url = VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_SHIPPING_URL;
				break;
			case 'get_product':
				$url = VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_PRODUCT_URL;
				break;
			case 'search_product':
				$url = VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_SEARCH_PRODUCT;
				break;
			case 'get_order':
				$url = VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_GET_ORDER_URL;
				break;
			default:
				$url = VI_WOOCOMMERCE_ALIDROPSHIP_GET_SIGNATURE_PLACE_ORDER_URL;
		}

		$url     = apply_filters( 'ald_villatheme_api_url', $url, $type );
		$request = wp_remote_post( $url, array(
			'body'       => $args,
			'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
			'timeout'    => 30,
		) );
		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body           = vi_wad_json_decode( $request['body'] );
			$return['code'] = $body['code'] ?? '';
			$return['data'] = $body['msg'] ?? '';
			if ( $body['code'] == 200 ) {
				$return['status'] = 'success';
			}
		} else {
			$return['code'] = $request->get_error_code();
			$return['data'] = $request->get_error_message();
		}

		return $return;
	}

	public static function get_public_params( $args ) {
		$self = self::get_instance();

		$params = wp_parse_args( $args, array(
			'app_key'     => VI_WOOCOMMERCE_ALIDROPSHIP_APP_KEY,
			'format'      => 'json',
			'session'     => $self->get_params( 'access_token' ),
			'sign_method' => 'sha256',
		) );

		ksort( $params );

		return $params;
	}

	/**
	 * @param $name
	 *
	 * @return string
	 */
	public static function sanitize_taxonomy_name( $name ) {
		return urldecode( self::strtolower( urlencode( wc_sanitize_taxonomy_name( $name ) ) ) );
	}

	/**
	 * @return array|bool|mixed|void|null
	 */
	public static function get_attributes_mapping_origin() {
		$instance                  = self::get_instance();
		$attributes_mapping_origin = $instance->get_params( 'attributes_mapping_origin' );
		if ( $attributes_mapping_origin ) {
			$attributes_mapping_origin = vi_wad_json_decode( stripslashes( $attributes_mapping_origin ) );
		}
		if ( ! is_array( $attributes_mapping_origin ) ) {
			$attributes_mapping_origin = array();
		}


		return $attributes_mapping_origin;
	}

	/**
	 * @return array|bool|mixed|void|null
	 */
	public static function get_attributes_mapping_replacement() {
		$instance                       = self::get_instance();
		$attributes_mapping_replacement = $instance->get_params( 'attributes_mapping_replacement' );
		if ( $attributes_mapping_replacement ) {
			$attributes_mapping_replacement = vi_wad_json_decode( $attributes_mapping_replacement );
		}
		if ( ! is_array( $attributes_mapping_replacement ) ) {
			$attributes_mapping_replacement = array();
		}

		return $attributes_mapping_replacement;
	}

	/**
	 * @param $string
	 *
	 * @return bool|false|mixed|string|string[]|null
	 */
	public static function strtolower( $string ) {
		return function_exists( 'mb_strtolower' ) ? mb_strtolower( $string ) : strtolower( $string );
	}

	/**
	 * @param $origin
	 * @param $replacement
	 * @param $value
	 * @param $attribute_slug
	 *
	 * @return bool|mixed
	 */
	public static function find_attribute_replacement( $origin, $replacement, $value, $attribute_slug ) {
		$value = self::strtolower( $value );
		if ( isset( $origin[ $attribute_slug ] ) ) {
			$search = array_search( $value, $origin[ $attribute_slug ] );
			if ( $search !== false ) {
				return $replacement[ $attribute_slug ][ $search ];
			}
		}

		return false;
	}

	/**
	 * Supported exchange API
	 *
	 * @return mixed
	 */
	public static function get_supported_exchange_api() {
		return apply_filters( 'vi_wad_get_supported_exchange_api',
			array(
				'google'       => esc_html__( 'Google finance', 'woocommerce-alidropship' ),
				'yahoo'        => esc_html__( 'Yahoo finance', 'woocommerce-alidropship' ),
				'cuex'         => esc_html__( 'Cuex', 'woocommerce-alidropship' ),
				'transferwise' => esc_html__( 'TransferWise', 'woocommerce-alidropship' ),
			)
		);
	}

	/**
	 * Get exchange rate based on selected API
	 *
	 * @param string $api
	 * @param string $target_currency
	 * @param bool $decimals
	 * @param string $source_currency
	 *
	 * @return bool|int|mixed|void
	 */
	public static function get_exchange_rate( $api = 'google', $target_currency = '', $decimals = false, $source_currency = 'USD' ) {
		if ( $decimals === false ) {
			$decimals = self::get_instance()->get_params( 'exchange_rate_decimals' );
		}
		$rate = false;
		if ( ! $target_currency ) {
			$target_currency = get_option( 'woocommerce_currency' );
		}
		if ( self::strtolower( $target_currency ) === self::strtolower( $source_currency ) ) {
			$rate = 1;
		} else {
			switch ( $api ) {
				case 'yahoo':
					$get_rate = self::get_yahoo_exchange_rate( $target_currency, $source_currency );
					break;
				case 'cuex':
					$get_rate = self::get_cuex_exchange_rate( $target_currency, $source_currency );
					break;
				case 'transferwise':
					$get_rate = self::get_transferwise_exchange_rate( $target_currency, $source_currency );
					break;
				case 'google':
					$get_rate = self::get_google_exchange_rate( $target_currency, $source_currency );
					break;
				default:
					$get_rate = array(
						'status' => 'error',
						'data'   => false,
					);
			}
			if ( $get_rate['status'] === 'success' && $get_rate['data'] ) {
				$rate = $get_rate['data'];
			}
			$rate = apply_filters( 'vi_wad_get_exchange_rate', round( $rate, $decimals ), $api );
		}

		return $rate;
	}

	/**
	 * @param $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_google_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$url      = 'https://www.google.com/async/currency_v2_update?vet=12ahUKEwjfsduxqYXfAhWYOnAKHdr6BnIQ_sIDMAB6BAgFEAE..i&ei=kgAGXN-gDJj1wAPa9ZuQBw&yv=3&async=source_amount:1,source_currency:' . self::get_country_freebase( $source_currency ) . ',target_currency:' . self::get_country_freebase( $target_currency ) . ',lang:en,country:us,disclaimer_url:https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fgooglefinance%2Fdisclaimer%2F,period:5d,interval:1800,_id:knowledge-currency__currency-v2-updatable,_pms:s,_fmt:pc';
		$request  = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 10
			)
		);
		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			preg_match( '/data-exchange-rate=\"(.+?)\"/', $request['body'], $match );
			if ( is_array( $match ) && count( $match ) > 1 ) {
				$response['status'] = 'success';
				$response['data']   = $match[1];
			} else {
				$response['data'] = esc_html__( 'Preg_match fails', 'woocommerce-alidropship' );
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_yahoo_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$now      = current_time( 'timestamp', true );
		$url      = 'https://query1.finance.yahoo.com/v8/finance/chart/' . $source_currency . $target_currency . '=X?symbol=' . $source_currency . $target_currency . '%3DX&period1=' . ( $now - 60 * 86400 ) . '&period2=' . $now . '&interval=1d&includePrePost=false&events=div%7Csplit%7Cearn&lang=en-US&region=US&corsDomain=finance.yahoo.com';

		$request = wp_remote_get(
			$url, array(
				'user-agent' => '
				',
				'timeout'    => 10
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body   = vi_wad_json_decode( $request['body'] );
			$result = isset( $body['chart']['result'][0]['indicators']['quote'][0]['open'] ) ? array_filter( $body['chart']['result'][0]['indicators']['quote'][0]['open'] ) : ( isset( $body['chart']['result'][0]['meta']['previousClose'] ) ? array( $body['chart']['result'][0]['meta']['previousClose'] ) : array() );
			if ( ! empty( $result ) && is_array( $result ) ) {
				$response['status'] = 'success';
				$response['data']   = end( $result );
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_transferwise_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$instance               = self::get_instance();

        /*$url            = "https://api.sandbox.transferwise.tech/v1/rates?source={$source_currency}&target={$target_currency}";*/
		$url = "https://api.wise.com/v1/rates?source={$source_currency}&target={$target_currency}";
		$request = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 100,
				'headers' => array(
					'Authorization' => 'Bearer '.$instance->get_params( 'wise_api_token' )
				)
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body = json_decode( wp_remote_retrieve_body( $request ) );
			if ( is_array( $body ) && isset( $body[0] ) && is_object( $body[0] ) && property_exists( $body[0], 'rate' ) ) {
				$response['status'] = 'success';
				$response['data']   = $body[0]->rate;
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_cuex_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response        = array(
			'status' => 'error',
			'data'   => false,
		);
		$target_currency = self::strtolower( $target_currency );
		$source_currency = self::strtolower( $source_currency );
		$date            = date( 'Y-m-d', current_time( 'timestamp' ) );// phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
		$url             = "https://api.cuex.com/v1/exchanges/{$source_currency}?to_currency={$target_currency}&from_date={$date}&to_date={$date}&format=true&l=en";

		$request = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 10,
				'headers'    => array( 'Authorization' => '3b71e5d431b2331acb65f2d484d423e5' ),
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body = vi_wad_json_decode( wp_remote_retrieve_body( $request ) );
			if ( isset( $body['data'][0]['rate'] ) ) {
				$response['status'] = 'success';
				$response['data']   = $body['data'][0]['rate'];
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param string $country_code
	 *
	 * @return array|bool|string
	 */
	private static function get_country_freebase( $country_code = '' ) {
		$countries = array(
			"AED" => "/m/02zl8q",
			"AFN" => "/m/019vxc",
			"ALL" => "/m/01n64b",
			"AMD" => "/m/033xr3",
			"ANG" => "/m/08njbf",
			"AOA" => "/m/03c7mb",
			"ARS" => "/m/024nzm",
			"AUD" => "/m/0kz1h",
			"AWG" => "/m/08s1k3",
			"AZN" => "/m/04bq4y",
			"BAM" => "/m/02lnq3",
			"BBD" => "/m/05hy7p",
			"BDT" => "/m/02gsv3",
			"BGN" => "/m/01nmfw",
			"BHD" => "/m/04wd20",
			"BIF" => "/m/05jc3y",
			"BMD" => "/m/04xb8t",
			"BND" => "/m/021x2r",
			"BOB" => "/m/04tkg7",
			"BRL" => "/m/03385m",
			"BSD" => "/m/01l6dm",
			"BTC" => "/m/05p0rrx",
			"BWP" => "/m/02nksv",
			"BYN" => "/m/05c9_x",
			"BZD" => "/m/02bwg4",
			"CAD" => "/m/0ptk_",
			"CDF" => "/m/04h1d6",
			"CHF" => "/m/01_h4b",
			"CLP" => "/m/0172zs",
			"CNY" => "/m/0hn4_",
			"COP" => "/m/034sw6",
			"CRC" => "/m/04wccn",
			"CUC" => "/m/049p2z",
			"CUP" => "/m/049p2z",
			"CVE" => "/m/06plyy",
			"CZK" => "/m/04rpc3",
			"DJF" => "/m/05yxn7",
			"DKK" => "/m/01j9nc",
			"DOP" => "/m/04lt7_",
			"DZD" => "/m/04wcz0",
			"EGP" => "/m/04phzg",
			"ETB" => "/m/02_mbk",
			"EUR" => "/m/02l6h",
			"FJD" => "/m/04xbp1",
			"GBP" => "/m/01nv4h",
			"GEL" => "/m/03nh77",
			"GHS" => "/m/01s733",
			"GMD" => "/m/04wctd",
			"GNF" => "/m/05yxld",
			"GTQ" => "/m/01crby",
			"GYD" => "/m/059mfk",
			"HKD" => "/m/02nb4kq",
			"HNL" => "/m/04krzv",
			"HRK" => "/m/02z8jt",
			"HTG" => "/m/04xrp0",
			"HUF" => "/m/01hfll",
			"IDR" => "/m/0203sy",
			"ILS" => "/m/01jcw8",
			"INR" => "/m/02gsvk",
			"IQD" => "/m/01kpb3",
			"IRR" => "/m/034n11",
			"ISK" => "/m/012nk9",
			"JMD" => "/m/04xc2m",
			"JOD" => "/m/028qvh",
			"JPY" => "/m/088n7",
			"KES" => "/m/05yxpb",
			"KGS" => "/m/04k5c6",
			"KHR" => "/m/03_m0v",
			"KMF" => "/m/05yxq3",
			"KRW" => "/m/01rn1k",
			"KWD" => "/m/01j2v3",
			"KYD" => "/m/04xbgl",
			"KZT" => "/m/01km4c",
			"LAK" => "/m/04k4j1",
			"LBP" => "/m/025tsrc",
			"LKR" => "/m/02gsxw",
			"LRD" => "/m/05g359",
			"LSL" => "/m/04xm1m",
			"LYD" => "/m/024xpm",
			"MAD" => "/m/06qsj1",
			"MDL" => "/m/02z6sq",
			"MGA" => "/m/04hx_7",
			"MKD" => "/m/022dkb",
			"MMK" => "/m/04r7gc",
			"MOP" => "/m/02fbly",
			"MRO" => "/m/023c2n",
			"MUR" => "/m/02scxb",
			"MVR" => "/m/02gsxf",
			"MWK" => "/m/0fr4w",
			"MXN" => "/m/012ts8",
			"MYR" => "/m/01_c9q",
			"MZN" => "/m/05yxqw",
			"NAD" => "/m/01y8jz",
			"NGN" => "/m/018cg3",
			"NIO" => "/m/02fvtk",
			"NOK" => "/m/0h5dw",
			"NPR" => "/m/02f4f4",
			"NZD" => "/m/015f1d",
			"OMR" => "/m/04_66x",
			"PAB" => "/m/0200cp",
			"PEN" => "/m/0b423v",
			"PGK" => "/m/04xblj",
			"PHP" => "/m/01h5bw",
			"PKR" => "/m/02svsf",
			"PLN" => "/m/0glfp",
			"PYG" => "/m/04w7dd",
			"QAR" => "/m/05lf7w",
			"RON" => "/m/02zsyq",
			"RSD" => "/m/02kz6b",
			"RUB" => "/m/01hy_q",
			"RWF" => "/m/05yxkm",
			"SAR" => "/m/02d1cm",
			"SBD" => "/m/05jpx1",
			"SCR" => "/m/01lvjz",
			"SDG" => "/m/08d4zw",
			"SEK" => "/m/0485n",
			"SGD" => "/m/02f32g",
			"SLL" => "/m/02vqvn",
			"SOS" => "/m/05yxgz",
			"SRD" => "/m/02dl9v",
			"SSP" => "/m/08d4zw",
			"STD" => "/m/06xywz",
			"SZL" => "/m/02pmxj",
			"THB" => "/m/0mcb5",
			"TJS" => "/m/0370bp",
			"TMT" => "/m/0425kx",
			"TND" => "/m/04z4ml",
			"TOP" => "/m/040qbv",
			"TRY" => "/m/04dq0w",
			"TTD" => "/m/04xcgz",
			"TWD" => "/m/01t0lt",
			"TZS" => "/m/04s1qh",
			"UAH" => "/m/035qkb",
			"UGX" => "/m/04b6vh",
			"USD" => "/m/09nqf",
			"UYU" => "/m/04wblx",
			"UZS" => "/m/04l7bl",
			"VEF" => "/m/021y_m",
			"VND" => "/m/03ksl6",
			"XAF" => "/m/025sw2b",
			"XCD" => "/m/02r4k",
			"XOF" => "/m/025sw2q",
			"XPF" => "/m/01qyjx",
			"YER" => "/m/05yxwz",
			"ZAR" => "/m/01rmbs",
			"ZMW" => "/m/0fr4f"
		);
		if ( $country_code ) {
			return isset( $countries[ $country_code ] ) ? $countries[ $country_code ] : '';
		} else {
			return $countries;
		}
	}

	/**
	 * @return mixed
	 */
	public static function get_domain_name() {
		if ( ! empty( $_SERVER['HTTP_HOST'] ) ) {
			$name = $_SERVER['HTTP_HOST'];
		} elseif ( ! empty( $_SERVER['SERVER_NAME'] ) ) {
			$name = $_SERVER['SERVER_NAME'];
		} else {
			$name = self::get_domain_from_url( get_bloginfo( 'url' ) );
		}

		return $name;
	}

	/**
	 * @param $tags
	 *
	 * @return array
	 */
	public static function filter_allowed_html() {
		if ( self::$allow_html !== null ) {
			return self::$allow_html;
		}
		$tags = array_merge_recursive( wp_kses_allowed_html( 'post' ), array(
				'input'  => array(
					'type'         => 1,
					'id'           => 1,
					'name'         => 1,
					'class'        => 1,
					'placeholder'  => 1,
					'autocomplete' => 1,
					'style'        => 1,
					'value'        => 1,
					'size'         => 1,
					'checked'      => 1,
					'disabled'     => 1,
					'readonly'     => 1,
					'data-*'       => 1,
				),
				'form'   => array(
					'method' => 1,
					'id'     => 1,
					'class'  => 1,
					'action' => 1,
					'data-*' => 1,
				),
				'select' => array(
					'id'       => 1,
					'name'     => 1,
					'class'    => 1,
					'multiple' => 1,
					'data-*'   => 1,
				),
				'option' => array(
					'class'    => 1,
					'value'    => 1,
					'selected' => 1,
					'data-*'   => 1,
				),
			)
		);
		foreach ( $tags as $key => $value ) {
			if ( in_array( $key, array( 'div', 'span', 'a', 'form', 'select', 'option', 'tr', 'td' ) ) ) {
				$tags[ $key ]['data-*'] = 1;
			}
		}

		return self::$allow_html = $tags;
	}

	/**
	 * Used to escape html content
	 *
	 * @param $content
	 *
	 * @return string
	 */
	public static function wp_kses_post( $content ) {

		return wp_kses( $content, self::filter_allowed_html() );
	}

	/**
	 * Get WooCommerce countries in English
	 *
	 * @return mixed
	 */
	public static function get_countries() {
		if ( self::$countries === null ) {
			unload_textdomain( 'woocommerce' );
			self::$countries = apply_filters( 'woocommerce_countries', include WC()->plugin_path() . '/i18n/countries.php' );
			if ( apply_filters( 'woocommerce_sort_countries', true ) ) {
				wc_asort_by_locale( self::$countries );
			}
			$locale = determine_locale();
			$locale = apply_filters( 'plugin_locale', $locale, 'woocommerce' );
			load_textdomain( 'woocommerce', WP_LANG_DIR . '/woocommerce/woocommerce-' . $locale . '.mo' );
			load_plugin_textdomain( 'woocommerce', false, plugin_basename( dirname( WC_PLUGIN_FILE ) ) . '/i18n/languages' );
		}

		return self::$countries;
	}

	/**
	 * Get WooCommerce states in English
	 *
	 * @param $cc
	 *
	 * @return bool|mixed
	 */
	public static function get_states( $cc ) {
		if ( self::$states === null ) {
			unload_textdomain( 'woocommerce' );
			self::$states = apply_filters( 'woocommerce_states', include WC()->plugin_path() . '/i18n/states.php' );
			$locale       = determine_locale();
			$locale       = apply_filters( 'plugin_locale', $locale, 'woocommerce' );
			load_textdomain( 'woocommerce', WP_LANG_DIR . '/woocommerce/woocommerce-' . $locale . '.mo' );
			load_plugin_textdomain( 'woocommerce', false, plugin_basename( dirname( WC_PLUGIN_FILE ) ) . '/i18n/languages' );
		}

		if ( ! is_null( $cc ) ) {
			return isset( self::$states[ $cc ] ) ? self::$states[ $cc ] : false;
		} else {
			return self::$states;
		}
	}

	/**
	 * Allows only numbers
	 *
	 * @param $phone
	 *
	 * @return string
	 */
	public static function sanitize_phone_number( $phone ) {
		return preg_replace( '/[^\d]/', '', $phone );
	}

	/**
	 * @param $woo_id
	 * @param $ship_to
	 * @param string $ship_from
	 * @param int $quantity
	 * @param string $province
	 * @param string $city
	 * @param string $variation_id
	 *
	 * @return array|mixed
	 */
	public static function get_ali_shipping_by_woo_id( $woo_id, $ship_to, $ship_from = '', $quantity = 1, $province = '', $city = '', $variation_id = '' ) {
		$ali_id  = get_post_meta( $woo_id, '_vi_wad_aliexpress_product_id', true );
		$freight = array();
		if ( $ali_id ) {
			if ( $variation_id ) {
				$variation_ali_id = get_post_meta( $variation_id, '_vi_wad_aliexpress_variation_id', true );
			} else {
				$variation_ali_id = get_post_meta( $woo_id, '_vi_wad_aliexpress_variation_id', true );
			}
			$freight = self::get_ali_shipping( $ali_id, $ship_to, $ship_from, $quantity, '', $province, $city, $variation_ali_id ?? '' );
		}

		return $freight;
	}

	/**
	 * @param $ali_id
	 * @param $ship_to
	 * @param string $ship_from
	 * @param int $quantity
	 * @param string $freight_ext
	 * @param string $province
	 * @param string $city
	 *
	 * @param string $variation_ali_id
	 *
	 * @return array|mixed
	 */
	public static function get_ali_shipping( $ali_id, $ship_to, $ship_from = '', $quantity = 1, $freight_ext = '', $province = '', $city = '', $variation_ali_id = '' ) {
		$now         = time();
		$shipping_id = VI_WOOCOMMERCE_ALIDROPSHIP_VERSION . "{$ali_id}_{$ship_to}_{$quantity}";
		if ( $variation_ali_id ) {
			$shipping_id .= "_{$variation_ali_id}";
		}

		if ( self::is_shipping_supported_by_province_city( $ship_to ) ) {
			if ( $province ) {
				$shipping_id .= "_{$province}";
			}
			if ( $city ) {
				$shipping_id .= "_{$city}";
			}
		} else {
			$province = '';
			$city     = '';
		}

		$shipping_info = VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table::get_row_by_shipping_id( $shipping_id );
		$need_update   = true;
		if ( $shipping_info ) {
			if ( $now - $shipping_info['time'] < 600 ) {
				$need_update = false;
			} else {
				$shipping_info['time'] = $now;
			}
		} else {
			$shipping_info = array(
				'time'    => $now,
				'freight' => array(),
			);
		}

		//		$need_update = true;
		if ( $need_update ) {

			$get_freight = self::get_freight( [
				'ali_product_id'   => $ali_id,
				'ali_variation_id' => $variation_ali_id,
				'country'          => $ship_to,
				'quantity'         => $quantity,
				'currency'         => 'USD',
				'freight_ext'      => $freight_ext,
				'province'         => $province,
				'city'             => $city,
			] );

			if ( $get_freight['status'] === 'success' ) {
				$shipping_info['freight'] = self::adjust_ali_freight( $get_freight['freight'], $get_freight['from'] );
				$shipping_info['time']    = self::get_shipping_cache_time( $now );
				VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table::insert( $shipping_id, $shipping_info, $ali_id );
			} else {
				ob_start();
				echo print_r( 'Can not get the shipping information', true );
				echo print_r( $get_freight, true );
				VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Log::wc_log( ob_get_clean() );
			}
		}

		if ( ! empty( $shipping_info['freight'] ) && $ship_from ) {
			foreach ( $shipping_info['freight'] as $key => $value ) {
				if ( $ship_from === 'CN' ) {
					if ( $value['ship_from'] && $value['ship_from'] !== 'CN' ) {
						unset( $shipping_info['freight'][ $key ] );
					}
				} elseif ( in_array( $ship_from, array( 'GB', 'UK' ) ) ) {
					if ( ! in_array( $value['ship_from'], array( 'GB', 'UK' ) ) ) {
						unset( $shipping_info['freight'][ $key ] );
					}
				} elseif ( $value['ship_from'] !== $ship_from ) {
					unset( $shipping_info['freight'][ $key ] );
				}
			}

			$shipping_info['freight'] = array_values( $shipping_info['freight'] );
		}

		return $shipping_info['freight'];
	}

	/**
	 * @return mixed|void
	 */
	public static function countries_supported_shipping_by_province_city() {
		return apply_filters( 'vi_wad_aliexpress_supported_shipping_by_province_city', array( 'BR', ) );
	}

	/**
	 * @param $country
	 *
	 * @return bool
	 */
	public static function is_shipping_supported_by_province_city( $country ) {
		return in_array( $country, self::countries_supported_shipping_by_province_city(), true );
	}

	/**
	 * @param $freight
	 * @param $from
	 *
	 * @return array
	 */
	public static function adjust_ali_freight( $freight, $from = '' ) {
		if ( empty( $freight ) || ! is_array( $freight ) ) {
			return [];
		}
		$saved_freight = array();
		switch ( $from ) {
			case 'api':
				foreach ( $freight as $freight_v ) {
					if ( empty( $freight_v ) || empty( $freight_v['company'] ) ) {
						continue;
					}
					$saved_freight[] = array(
						'company'       => $freight_v['code'] ?? '',
						'company_name'  => $freight_v['company'] ?? '',
						'shipping_cost' => self::get_freight_amount( $freight_v ),
						'delivery_time' => ( $freight_v['min_delivery_days'] ?? '' ) . '-' . ( $freight_v['max_delivery_days'] ?? '' ),
						'display_type'  => $freight_v['displayType'] ?? '',
						'tracking'      => $freight_v['tracking'] ?? '',
						'ship_from'     => $freight_v['ship_from_country'] ?? '',
					);
				}
				break;
			default:
				if ( $from === 'api_ru' ) {
					foreach ( $freight as &$method ) {
						$method['company']       = $method['groupName'] . ' ' . $method['dateFormat'];
						$method['freightAmount'] = $method['amount'];
						$method['time']          = $method['dateEstimated'];
					}
				} elseif ( ! isset( $freight[0]['serviceName'] ) ) {
					$tmp     = $freight;
					$freight = [];
					foreach ( $tmp as $f ) {
						if ( empty( $f['bizData'] ) ) {
							continue;
						}
						$bizdata = $f['bizData'];
						if ( ! empty( $bizdata['unreachable'] ) ) {
							continue;
						}
						$delivery_time = [];
						if ( isset( $bizdata['deliveryDayMin'] ) ) {
							$delivery_time[] = $bizdata['deliveryDayMin'];
						}
						if ( isset( $bizdata['deliveryDayMax'] ) ) {
							$delivery_time[] = $bizdata['deliveryDayMax'];
						}
						$freight[] = [
							'serviceName'      => $bizdata['deliveryOptionCode'] ?? '',
							'time'             => implode( '-', $delivery_time ),
							'company'          => $bizdata['company'] ?? $bizdata['deliveryOptionCode'] ?? '',
							'freightAmount'    => [
								'formatedAmount' => '',
								'currency'       => $bizdata['displayCurrency'] ?? $bizdata['currency'],
								'value'          => $bizdata['displayAmount'] ?? 0,
							],
							'sendGoodsCountry' => $bizdata['shipFromCode'] ?? 'CN'
						];

					}
				}

				foreach ( $freight as $freight_v ) {
					if ( empty( $freight_v ) || empty( $freight_v['company'] ) ) {
						continue;
					}
					$saved_freight[] = array(
						'company'       => $freight_v['serviceName'],
						'company_name'  => $freight_v['company'],
						'shipping_cost' => self::get_freight_amount( $freight_v ),
						'delivery_time' => $freight_v['time'],
						'display_type'  => $freight_v['displayType'] ?? '',
						'tracking'      => $freight_v['tracking'] ?? '',
						'ship_from'     => isset( $freight_v['sendGoodsCountry'] ) ? $freight_v['sendGoodsCountry'] : '',
					);
				}
		}

		return $saved_freight;
	}

	/**
	 * Check if shipping cost is available in USD
	 * If not, convert it from available currency
	 * Exchange rate here is automatically fetched from available APIs, expires in 24 hours and not shown to users
	 *
	 * @param $freight_v
	 *
	 * @return mixed|string
	 */
	public static function get_freight_amount( $freight_v ) {
		if ( ! empty( $freight_v['free_shipping'] ) ) {
			return 0;
		}
		global $wooaliexpressdropship_settings;
		$freight_amount = $currency = '';
		if ( isset( $freight_v['standardFreightAmount']['value'], $freight_v['standardFreightAmount']['currency'] ) && $freight_v['standardFreightAmount']['currency'] === 'USD' ) {
			$freight_amount = $freight_v['standardFreightAmount']['value'];
		} elseif ( isset( $freight_v['freightAmount']['value'], $freight_v['freightAmount']['currency'] ) && $freight_v['freightAmount']['currency'] === 'USD' ) {
			$freight_amount = $freight_v['freightAmount']['value'];
		} elseif ( isset( $freight_v['previewFreightAmount']['value'], $freight_v['previewFreightAmount']['currency'] ) && $freight_v['previewFreightAmount']['currency'] === 'USD' ) {
			$freight_amount = $freight_v['previewFreightAmount']['value'];
		}
		if ( $freight_amount === '' ) {
			if ( isset( $freight_v['standardFreightAmount']['value'], $freight_v['standardFreightAmount']['currency'] ) ) {
				$freight_amount = $freight_v['standardFreightAmount']['value'];
				$currency       = $freight_v['standardFreightAmount']['currency'];
			} elseif ( isset( $freight_v['freightAmount']['value'], $freight_v['freightAmount']['currency'] ) ) {
				$freight_amount = $freight_v['freightAmount']['value'];
				$currency       = $freight_v['freightAmount']['currency'];
			} elseif ( isset( $freight_v['previewFreightAmount']['value'], $freight_v['previewFreightAmount']['currency'] ) ) {
				$freight_amount = $freight_v['previewFreightAmount']['value'];
				$currency       = $freight_v['previewFreightAmount']['currency'];
			}
		}
		if ( $freight_amount === '' && isset( $freight_v['shipping_fee_currency'], $freight_v['shipping_fee_cent'] ) ) {
			$freight_amount = $freight_v['shipping_fee_cent'];
			$currency       = $freight_v['shipping_fee_currency'];
		}
		if ( $freight_amount && $currency && $currency !== 'USD' ) {
			$instance               = self::get_instance();
			$exchange_rate_shipping = $instance->get_params( 'exchange_rate_shipping' );
			$now                    = time();
			$rate                   = $old_rate = '';
			// maybe don't need eur
			if ( in_array( $currency, array( 'CNY', 'RUB' ), true ) ) {
				/*This is CNY/USD rate while we need USD/CNY rate*/
				$custom_rate = $instance->get_params( "import_currency_rate_{$currency}" );
				if ( $custom_rate ) {
					$rate = 1 / $custom_rate;
				}
			}
			if ( ! $rate ) {
				if ( isset( $exchange_rate_shipping[ $currency ] ) ) {
					$old_rate = $exchange_rate_shipping[ $currency ]['value'];
					if ( $exchange_rate_shipping[ $currency ]['time'] > $now ) {
						$rate = $exchange_rate_shipping[ $currency ]['value'];
					}
				}
			}
			if ( ! $rate ) {
				/*This is USD/{$currency} rate*/
				foreach ( array( 'yahoo', 'google', 'cuex', 'transferwise' ) as $api ) {
					$rate = self::get_exchange_rate( $api, $currency, 2 );
					if ( $rate ) {
						$params                                        = $instance->get_params();
						$params['exchange_rate_shipping'][ $currency ] = array(
							'time'  => $now + DAY_IN_SECONDS,
							'value' => $rate,
						);
						$wooaliexpressdropship_settings                = $params;
						update_option( 'wooaliexpressdropship_params', $params );
						self::get_instance( true );
						break;
					}
				}
			}
			if ( ! $rate ) {
				$rate = $old_rate;
			}
			if ( $rate ) {
				$freight_amount = $freight_amount / $rate;
				$freight_amount = round( $freight_amount, 2 );
			}
		}

		return $freight_amount;
	}

	public static function ru_get_freight( $params = [] ) {
		$response = array(
			'status'  => 'error',
			'freight' => array(),
			'code'    => '',
			'from'    => 'api_ru',
		);
		extract( wp_parse_args( $params, [
			'ali_product_id'   => '',
			'ali_variation_id' => '',
			'country'          => '',
			'from_country'     => '',
			'quantity'         => 1,
			'currency'         => 'CNY',
			'freight_ext'      => '',
			'province'         => '',
			'city'             => '',
			'import_id'        => '',
		] ) );
		if ( ! $import_id ) {
			$import_id           = self::product_get_id_by_aliexpress_id( $ali_product_id );
			$params['import_id'] = $import_id;
		}
		$args = array(
			'productId'              => (int) $ali_product_id,
			'country'                => VI_WOOCOMMERCE_ALIDROPSHIP_Admin_API::filter_country( $country ),
			'tradeCurrency'          => $currency,
			'count'                  => $quantity,
			'sendGoodsCountry'       => $from_country,
			'displayMultipleFreight' => false,
		);
		if ( $freight_ext ) {
			$args['ext'] = urlencode( $freight_ext );
		}
		if ( isset( $args['ext']['p1'] ) ) {
			$args['ext'] = self::get_freight_ext( $import_id, $currency, $country, $params['variation_ali_id'] ?? '' );
		}
		if ( ! empty( $args['ext']['p0'] ) ) {
			$args['skuId']            = $args['ext']['p0'];
			$args['sendGoodsCountry'] = '';
			$args['minPrice']         = $args['ext']['p1'];
			$args['maxPrice']         = $args['ext']['p1'];
		}

		$api_url        = 'https://aliexpress.ru/aer-api/bl/logistics/freight';
		$url            = add_query_arg( [ 'product_id' => $ali_product_id ], $api_url );
		$cookies        = [
			new WP_Http_Cookie( array( 'name' => 'aer_lang', 'value' => 'en_US' ) )
		];
		$get_ru_freight = wp_remote_post( $url, array(
			'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
			'headers'    => [ 'Referer' => $url ],
			'body'       => wp_json_encode( $args ),
			'cookies'    => $cookies,
			'timeout'    => 30,
		) );
		if ( is_wp_error( $get_ru_freight ) ) {
			$request['data'] = $get_ru_freight->get_error_message();
			$request['code'] = $get_ru_freight->get_error_code();
		} else {
			$request['code'] = wp_remote_retrieve_response_code( $get_ru_freight );
			if ( $request['code'] === 200 ) {
				$request['status'] = 'success';
				$request['data']   = json_decode( $get_ru_freight['body'], true );
			}
		}
		$response['code'] = $request['code'];
		if ( $request['status'] === 'success' ) {
			$data = $request['data'];
			if ( ! empty( $data['methods'] ) && is_array( $data['methods'] ) ) {
				$response['status']  = 'success';
				$response['freight'] = $data['methods'];

			} else {
				$response['code'] = 404;
			}
		}

		return $response;
	}

	public static function viwad_get_freight( $params = [] ) {
		$settings = self::get_instance();
		$response = array(
			'status'  => 'error',
			'freight' => array(),
			'code'    => '',
			'from'    => '',
		);
		extract( $params = wp_parse_args( $params, [
			'ali_product_id'   => '',
			'ali_variation_id' => '',
			'country'          => '',
			'from_country'     => '',
			'quantity'         => $params['count'] ?? 1,
			'currency'         => 'USD',
			'freight_ext'      => '',
			'province'         => '',
			'city'             => '',
			'import_id'        => '',
		] ) );
		$args = array(
			'productId'     => $ali_product_id,
			'selectedSkuId' => $ali_variation_id ?? '',
			'shipToCountry' => VI_WOOCOMMERCE_ALIDROPSHIP_Admin_API::filter_country( $country ),
			'provinceCode'  => $province,
			'cityCode'      => $city,
			'currency'      => $currency,
			'quantity'      => $quantity,
			'source'        => $from_country,
			'language'      => 'en_US',
			'locale'        => '',
		);
		if ( self::is_shipping_supported_by_province_city( $country ) ) {
			if ( $province ) {
				$get_province = self::get_aliexpress_province_code( $country, $province );
				if ( ! empty( $get_province['c'] ) ) {
					$get_city = self::get_aliexpress_city_code( $country, $get_province['c'], $city );
					if ( ! empty( $get_city['c'] ) ) {
						$args['provinceCode'] = $get_province['c'];
						$args['cityCode']     = $get_city['c'];
					}
				}
			}
		}

		$args    = [
			'queryDeliveryReq' => wp_json_encode( $args ),
			'session'          => $settings->get_params( 'access_token' ),/*add 14-10-2024*/
		];
		$app_key = VI_WOOCOMMERCE_ALIDROPSHIP_APP_KEY;
		$method  = 'aliexpress.ds.freight.query';

		$sign_params = self::get_params_to_get_signature( $args );

		$sign_response = self::ali_ds_get_sign( $sign_params, 'get_shipping' );
		if ( $sign_response['status'] !== 'success' ) {
			$response['message'] = "error get sign : {$sign_response['code']} - {$sign_response['data']}";

			return $response;
		}
		$public_params = array_merge( $args, self::ali_request_base_params( [
			'app_key'   => $app_key,
			'timestamp' => $sign_response['data']['timestamp'],
			'sign'      => $sign_response['data']['data'],
			'method'    => $method
		] ) );
		unset( $public_params['format'] );

		$request_data = self::ali_request( $public_params, [] );
		if ( isset( $request_data['aliexpress_ds_freight_query_response']['result'] ) ) {
			$request_data = $request_data['aliexpress_ds_freight_query_response']['result'];
		}
		$freights = [];
		if ( ! empty( $request_data['delivery_options']['delivery_option_d_t_o'] ) ) {
			$freights = $request_data['delivery_options']['delivery_option_d_t_o'];
		}
		if ( empty( $freights ) && ! empty( $request_data['delivery_options'] ) ) {
			$freights = $request_data['delivery_options'];
		}
		if ( isset( $request_data['code'] ) ) {
			$response['code'] = $request_data['code'];
		}
		if ( ! empty( $freights ) ) {
			$response['status']  = 'success';
			$response['freight'] = $freights;
		} else {
			$response['ali_request'] = $public_params;
			$response['ali_res']     = $request_data;
		}
		$response['from'] = 'api';

		return $response;
	}

	public static function get_freight( $params = [] ) {
		$country = $params['country'] ?? '';
		$method  = $country && method_exists( __CLASS__, $country_method = strtolower( $country ) . '_get_freight' ) ? $country_method : 'viwad_get_freight';

		return apply_filters( 'ald_get_freight', self::$method( $params ), $params );
	}

	/**
	 * @param $country
	 * @param $state_code
	 * @param $city
	 *
	 * @return array|mixed
	 */
	public static function get_aliexpress_city_code( $country, $state_code, $city ) {
		$ali_states = self::get_state( $country );
		$city_code  = array();
		if ( $country && $state_code ) {
			$found_state = false;
			foreach ( $ali_states['addressList'] as $key => $value ) {
				if ( $state_code === $value['c'] ) {
					$found_state = $key;
					break;
				}
			}
			if ( $found_state !== false ) {
				if ( isset( $ali_states['addressList'][ $found_state ]['children'] ) && is_array( $ali_states['addressList'][ $found_state ]['children'] ) && ! empty( $ali_states['addressList'][ $found_state ]['children'] ) ) {
					if ( $city ) {
						$search   = self::strtolower( $city );
						$search_1 = array( $search, remove_accents( $search ) );
						foreach ( $ali_states['addressList'][ $found_state ]['children'] as $key => $value ) {
							if ( in_array( self::strtolower( $value['n'] ), $search_1, true ) ) {
								$city_code = $value;
								break;
							}
						}
					} else {
						if ( $city === false ) {
							$city_code = $ali_states['addressList'][ $found_state ]['children'];
						} else {
							$city_code = $ali_states['addressList'][ $found_state ]['children'][0];
						}
					}
				}
			}
		}

		return $city_code;
	}

	/**
	 * @param $country
	 * @param $state
	 *
	 * @return array|mixed
	 */
	public static function get_aliexpress_province_code( $country, $state ) {
		$province_code = array();
		if ( $country ) {
			$ali_states = self::get_state( $country );
			if ( ! empty( $ali_states ) ) {
				if ( $state ) {
					$search   = self::strtolower( $state );
					$search_1 = array( $search, remove_accents( $search ) );
					foreach ( $ali_states['addressList'] as $key => $value ) {
						if ( in_array( self::strtolower( $value['n'] ), $search_1, true ) ) {
							$province_code = $value;
							break;
						}
					}
				} else {
					if ( $state === false ) {
						$province_code = $ali_states['addressList'];
					} else {
						$province_code = $ali_states['addressList'][0];
					}
				}
			}
		}

		return $province_code;
	}

	/**
	 * @param $ald_id
	 * @param string $currency
	 *
	 * @return array
	 */
	public static function get_freight_ext( $ald_id, $currency = 'USD', $country = '', $variation_ali_id = '' ) {
		$freight_ext     = [];
		$ald_freight_ext = ALD_Product_Table::get_post_meta( $ald_id, '_vi_wad_shipping_freight_ext', true );
		if ( ! ALD_Product_Table::get_post_meta( $ald_id, '_vi_wad_woo_id', true ) && isset( $ald_freight_ext['p0'] ) ) {
			return $ald_freight_ext;
		}
		$variations = ALD_Product_Table::get_post_meta( $ald_id, '_vi_wad_variations', true );
		$p0         = $p5 = '';
		if ( ! empty( $ald_freight_ext ) && is_array( $ald_freight_ext ) ) {
			if ( ! isset( $ald_freight_ext['p0'] ) ) {
				$ald_freight_ext = current( $ald_freight_ext );
			}
			$p0 = $ald_freight_ext['p0'] ?? '';
			$p5 = $ald_freight_ext['p5'] ?? '';
		}

		if ( ! empty( $variations ) && is_array( $variations ) ) {
			if ( ! empty( $variation_ali_id ) ) {
				foreach ( $variations as $item ) {
					if ( isset( $item['skuId'] ) && $item['skuId'] == $variation_ali_id ) {
						$p0    = $variation_ali_id;
						$tmp[] = $item;
						break;
					}
				}
				if ( ! empty( $tmp ) ) {
					$variations = $tmp;
				}
			} else {
				foreach ( $variations as $item ) {
					if ( ! empty( $item['skuId'] ) && ! empty( $item['stock'] ) ) {
						$p0    = $item['skuId'];
						$tmp[] = $item;
						break;
					}
				}
				if ( ! empty( $tmp ) ) {
					$variations = $tmp;
				}
			}
			$price_array = array_filter( array_merge( array_column( $variations, 'sale_price' ), array_column( $variations, 'regular_price' ) ) );
			if ( ! empty( $price_array ) ) {
				$min_price = min( $price_array );
				if ( $min_price ) {
					$min_price       = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float( $min_price );
					$p6              = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_ali_tax( $country );
					$pre_freight_ext = [];

					if ( ! empty( $p0 ) ) {
						$pre_freight_ext['p0'] = $p0;
					}
					if ( empty( $pre_freight_ext['p0'] ) ) {
						$pre_freight_ext['p0'] = array_values( $variations )[0]['skuId'] ?? '';
					}
					if ( in_array( $country, [ 'RU' ] ) ) {
						$pre_freight_ext['p1'] = number_format( $min_price, 2 );
						$pre_freight_ext['p3'] = 'CNY';
					} else {
						$pre_freight_ext['p1']          = number_format( $min_price, 2 );
						$pre_freight_ext['p3']          = $currency;
						$pre_freight_ext['disCurrency'] = $currency;
					}
					if ( ! empty( $p5 ) ) {
						$pre_freight_ext['p5'] = $p5;
					}

					if ( $p6 ) {
						$pre_freight_ext['p6'] = $p6;
					}
					if ( isset( $ald_freight_ext['p7'] ) ) {
						$pre_freight_ext['p7'] = $ald_freight_ext['p7'];
					}
					if ( $variation_ali_id ) {
						if ( ! empty( array_values( $variations )[0]['ship_from'] ) ) {
							$pre_freight_ext['p8'] = array_values( $variations )[0]['ship_from'];
						} elseif ( isset( $ald_freight_ext['p8'] ) ) {
							$pre_freight_ext['p8'] = $ald_freight_ext['p8'];
						}
					}
					$freight_ext = $pre_freight_ext;
				}
			}
		}

		return $freight_ext;
	}

	/**
	 * @param $time
	 *
	 * @return int
	 */
	public static function get_shipping_cache_time( $time ) {
		return $time + wp_rand( 0, 600 );
	}

	/**
	 * Get list of states/cities of a country to use when fulfilling AliExpress orders
	 *
	 * @param $cc
	 *
	 * @return mixed
	 */
	public static function get_state( $cc ) {
		if ( ! isset( self::$ali_states[ $cc ] ) ) {
			$states      = array();
			$states_file = VI_WOOCOMMERCE_ALIDROPSHIP_PACKAGES . 'ali-states' . DIRECTORY_SEPARATOR . "$cc-states.json";
			if ( is_file( $states_file ) ) {
				ini_set( 'memory_limit', - 1 );
				$states = vi_wad_json_decode( file_get_contents( $states_file ) );// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			}
			self::$ali_states[ $cc ] = $states;
		}

		return self::$ali_states[ $cc ];
	}

	/**
	 * @param $content
	 *
	 * @return mixed
	 */
	private function find_and_replace_strings( $content ) {
		$str_replace = $this->get_params( 'string_replace' );
		if ( isset( $str_replace['to_string'] ) && is_array( $str_replace['to_string'] ) && $str_replace_count = count( $str_replace['to_string'] ) ) {
			for ( $i = 0; $i < $str_replace_count; $i ++ ) {
				if ( $str_replace['sensitive'][ $i ] ) {
					$content = str_replace( $str_replace['from_string'][ $i ], $str_replace['to_string'][ $i ], $content );
				} else {
					$content = str_ireplace( $str_replace['from_string'][ $i ], $str_replace['to_string'][ $i ], $content );
				}
			}
		}

		return $content;
	}

	/**
	 * Create ALD products(added to import list): Import via chrome extension, reimport, override
	 *
	 * @param $data
	 * @param $shipping_info
	 * @param array $post_data
	 *
	 * @return int|WP_Error
	 */
	public function create_product( $data, $shipping_info, $post_data = array() ) {
		$sku                   = isset( $data['sku'] ) ? sanitize_text_field( $data['sku'] ) : '';
		$title                 = isset( $data['name'] ) ? sanitize_text_field( $data['name'] ) : '';
		$description_url       = isset( $data['description_url'] ) ? stripslashes( $data['description_url'] ) : '';
		$short_description     = isset( $data['short_description'] ) ? wp_kses_post( stripslashes( $data['short_description'] ) ) : '';
		$description           = isset( $data['description'] ) ? wp_kses_post( stripslashes( $data['description'] ) ) : '';
		$specsModule           = isset( $data['specsModule'] ) ? stripslashes_deep( $data['specsModule'] ) : array();
		$gallery               = isset( $data['gallery'] ) ? stripslashes_deep( $data['gallery'] ) : array();
		$variation_images      = isset( $data['variation_images'] ) ? stripslashes_deep( $data['variation_images'] ) : array();
		$variations            = isset( $data['variations'] ) ? stripslashes_deep( $data['variations'] ) : array();
		$attributes            = isset( $data['attributes'] ) ? stripslashes_deep( $data['attributes'] ) : array();
		$list_attributes       = isset( $data['list_attributes'] ) ? stripslashes_deep( $data['list_attributes'] ) : array();
		$store_info            = isset( $data['store_info'] ) ? stripslashes_deep( $data['store_info'] ) : array();
		$currency_code         = isset( $data['currency_code'] ) ? strtoupper( stripslashes_deep( $data['currency_code'] ) ) : '';
		$video                 = isset( $data['video'] ) ? $data['video'] : array();
		$categories_path       = isset( $data['categories'] ) ? $data['categories'] : array();
		$specification_replace = $this->get_params( 'specification_replace' );
		$description_setting   = $this->get_params( 'product_description' );
		$specsModule           = apply_filters( 'vi_wad_import_product_specifications', $specsModule, $data );
		if ( ! empty( $specsModule ) ) {
			if ( isset( $specification_replace['to_name'] ) && is_array( $specification_replace['to_name'] ) && $specification_replace_count = count( $specification_replace['to_name'] ) ) {
				foreach ( $specsModule as $spec_k => $spec_v ) {
					$attrName = isset( $spec_v['attrName'] ) ? $spec_v['attrName'] : $spec_v['title'];
					if ( $attrName ) {
						for ( $i = 0; $i < $specification_replace_count; $i ++ ) {
							if ( $specification_replace['sensitive'][ $i ] ) {
								if ( $specification_replace['from_name'][ $i ] === $attrName ) {
									$new_spec = array(
										'attrName'  => '',
										'attrValue' => '',
									);
									if ( $specification_replace['to_name'][ $i ] !== '' ) {
										$old_value             = isset( $spec_v['attrValue'] ) ? $spec_v['attrValue'] : $spec_v['value'];
										$new_spec['attrName']  = $specification_replace['to_name'][ $i ];
										$new_spec['attrValue'] = str_replace( array( '{old_value}' ), array( $old_value ), $specification_replace['new_value'][ $i ] );
									}
									array_splice( $specsModule, $spec_k, 1, array( $new_spec ) );
									break;
								}
							} else {
								if ( self::strtolower( $specification_replace['from_name'][ $i ] ) === self::strtolower( $attrName ) ) {
									$new_spec = array(
										'attrName'  => '',
										'attrValue' => '',
									);
									if ( $specification_replace['to_name'][ $i ] !== '' ) {
										$old_value             = isset( $spec_v['attrValue'] ) ? $spec_v['attrValue'] : $spec_v['value'];
										$new_spec['attrName']  = $specification_replace['to_name'][ $i ];
										$new_spec['attrValue'] = str_replace( array( '{old_value}' ), array( $old_value ), $specification_replace['new_value'][ $i ] );
									}
									array_splice( $specsModule, $spec_k, 1, array( $new_spec ) );
									break;
								}
							}
						}
					}
				}
			}
			ob_start();
			?>
            <div class="product-specs-list-container">
                <ul class="product-specs-list util-clearfix">
					<?php
					foreach ( $specsModule as $specs ) {
						$attr_name = isset( $specs['attrName'] ) ? $specs['attrName'] : ( isset( $specs['title'] ) ? $specs['title'] : '' );
						if ( $attr_name ) {
							?>
                            <li class="product-prop line-limit-length"><span
                                        class="property-title"><?php echo esc_html( $attr_name ) ?>:&nbsp;</span><span
                                        class="property-desc line-limit-length"><?php echo esc_html( isset( $specs['attrValue'] ) ? $specs['attrValue'] : $specs['value'] ) ?></span>
                            </li>
							<?php
						}
					}
					?>
                </ul>
            </div>
			<?php
			$short_description .= ob_get_clean();
			$short_description = apply_filters( 'vi_wad_import_product_short_description', $short_description, $data );
		}

		switch ( $description_setting ) {
			case 'none':
				$description = '';
				break;
			case 'item_specifics':
				$description = $short_description;
				break;
			case 'description':
				if ( $description_url ) {
					$description .= self::get_product_description_from_url( $description_url );
				}
				break;
			case 'item_specifics_and_description':
			default:
				if ( $description_url ) {
					$description .= self::get_product_description_from_url( $description_url );
				}
				$description = $short_description . $description;
		}

		$original_desc_images = array();
		if ( $description ) {
			/*Search for images before applying find and replace rules to remember original image urls*/
			preg_match_all( '/src="([\s\S]*?)"/im', $description, $matches );
			if ( isset( $matches[1] ) && is_array( $matches[1] ) && ! empty( $matches[1] ) ) {
				$original_desc_images = array_values( array_unique( $matches[1] ) );
			}
		}

		$description = $this->find_and_replace_strings( $description );
		if ( $description ) {
			/*In case image urls(in description) are affected, replace affected urls with their original ones*/
			preg_match_all( '/src="([\s\S]*?)"/im', $description, $matches );
			if ( isset( $matches[1] ) && is_array( $matches[1] ) && ! empty( $matches[1] ) ) {
				$desc_images       = array_values( array_unique( $matches[1] ) );
				$desc_images_count = count( $desc_images );
				if ( $desc_images_count === count( $original_desc_images ) && $desc_images_count !== count( array_intersect( $desc_images, $original_desc_images ) ) ) {
					$description = str_replace( $desc_images, $original_desc_images, $description );
				}
			}
		}

		$description = apply_filters( 'vi_wad_import_product_description', $description, $data );
		$title       = $this->find_and_replace_strings( $title );
		$post_id     = ALD_Product_Table::wp_insert_post(
			wp_parse_args( $post_data,
				array(
					'post_title'   => $title,
					'post_type'    => 'vi_wad_draft_product',
					'post_status'  => 'draft',
					'post_excerpt' => '',
					'post_content' => $description,
				)
			), true );

		if ( $post_id && ! is_wp_error( $post_id ) ) {
			if ( ! empty( $data['viwad-has-welcome-deal'] ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_welcome_deal', 1 );
			}
			if ( is_array( $specsModule ) && ! empty( $specsModule ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_specifications', $specsModule );
			}
			if ( ! empty( $original_desc_images ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_description_images', viwad_prepare_url( $original_desc_images ) );
			}

			if ( $video ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_video', viwad_prepare_url( $video, 'video' ) );
			}
			if ( is_array( $categories_path ) && ! empty( $categories_path ) && $this->get_params( 'import_ali_product_categories' ) ) {
				$ali_categories_list    = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_ali_categories_list();
				$parent_term_id         = '';
				$ali_product_categories = $ali_cat_names = [];
				foreach ( $categories_path as $item ) {
					$ali_cat_name = '';
					if ( is_array( $item ) ) {
						$ali_cat     = $item;
						$ali_term_id = $ali_cat['category_id'] ?? '';
					} else {
						$ali_term_id = $item;
						$ali_cat     = current( array_filter( $ali_categories_list, function ( $cat ) use ( $ali_term_id ) {
							return $cat['category_id'] == $ali_term_id;
						} ) );
					}
					if ( ! empty( $ali_cat ) ) {
						$ali_cat_name = $ali_cat['category_name'];
					} elseif ( $ali_term_id && ! empty( $data['categoryName'] ) ) {
						$ali_cat_name = $data['categoryName'];
					}
					if ( $ali_cat_name && ! in_array( $ali_cat_name, $ali_cat_names ) ) {
						$ali_cat_names[] = $ali_cat_name;
						$term_exist      = term_exists( $ali_cat_name, 'product_cat' );
						if ( ! $term_exist ) {
							$insert_args = [ 'slug' => sanitize_title( $ali_cat['category_slug'] ?? $ali_cat_name ) ];
							if ( $parent_term_id ) {
								$insert_args['parent'] = $parent_term_id;
							}
							remove_all_actions( 'create_product_cat' );
							$new_term                 = wp_insert_term( $ali_cat_name, 'product_cat', $insert_args );
							$parent_term_id           = $new_term['term_id'];
							$ali_product_categories[] = $new_term['term_id'];
						} else {
							$ali_product_categories[] = $term_exist['term_id'];
						}
					}
				}

				if ( ! empty( $ali_product_categories ) ) {
					ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_categories', $ali_product_categories );
				}
			}

			ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_sku', $sku );

			if ( ! empty( $shipping_info['freight'] ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_shipping_info', $shipping_info );
			}

			if ( isset( $shipping_info['freight_ext'] ) ) {
				$freight_ext = json_decode( $shipping_info['freight_ext'], true );
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_shipping_freight_ext', $freight_ext );
			}

			$gallery = array_unique( array_filter( $gallery ) );

			if ( ! empty( $gallery ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_gallery', viwad_prepare_url( $gallery ) );
			}

			ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_variation_images', viwad_prepare_url( $variation_images ) );

			if ( is_array( $store_info ) && ! empty( $store_info ) ) {
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_store_info', $store_info );
			}

			if ( ! empty( $variations ) ) {
				$variations_news = self::parse_ali_variations_data( $variations, $currency_code, $sku );

				if ( $this->get_params( 'alternative_attribute_values' ) ) {
					if ( is_array( $attributes ) && ! empty( $attributes ) && is_array( $list_attributes ) && ! empty( $list_attributes ) ) {
						foreach ( $variations_news as $variation_k => $variation ) {
							if ( isset( $variation['attributes_sub'] ) && is_array( $variation['attributes_sub'] ) && count( $variation['attributes_sub'] ) === count( $variation['attributes'] ) ) {
								$temp                                              = $variation['attributes'];
								$variations_news[ $variation_k ]['attributes']     = $variation['attributes_sub'];
								$variations_news[ $variation_k ]['attributes_sub'] = $temp;
							}
							if ( ! empty( $variation['sku'] ) ) {
								$temp                                       = $variation['sku'];
								$variations_news[ $variation_k ]['sku']     = $variation['sku_sub'];
								$variations_news[ $variation_k ]['sku_sub'] = $temp;
							}
						}
						foreach ( $attributes as $attribute_k => $attribute ) {
							if ( ! empty( $attribute['values_sub'] ) ) {
								$temp                                     = $attribute['values'];
								$attributes[ $attribute_k ]['values']     = $attribute['values_sub'];
								$attributes[ $attribute_k ]['values_sub'] = $temp;
							}
						}
						foreach ( $list_attributes as $list_attribute_k => $list_attribute ) {
							if ( ! empty( $list_attribute['name_sub'] ) ) {
								$temp                                             = $list_attribute['name'];
								$list_attributes[ $list_attribute_k ]['name']     = $list_attribute['name_sub'];
								$list_attributes[ $list_attribute_k ]['name_sub'] = $temp;
							}
						}
					}
				}

				$attributes      = apply_filters( 'vi_wad_before_save_ali_product_attributes', $attributes );
				$variations_news = apply_filters( 'vi_wad_before_save_ali_product_variations', $variations_news );

				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_attributes', $attributes );
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_list_attributes', $list_attributes );
				ALD_Product_Table::update_post_meta( $post_id, '_vi_wad_variations', $variations_news );
			}

			self::update_attributes_list( $attributes );
		}

		return $post_id;
	}

	public static function parse_ali_variations_data( $variations, $currency_code, $sku ) {
		$variations_news = [];

		$woocommerce_currency = get_option( 'woocommerce_currency' );
		$rate                 = 0;
		$accept_currencies    = self::get_accept_currencies();
		$settings             = self::get_instance();

		if ( $woocommerce_currency === $currency_code ) {
			/*Store currency and imported currency are the same*/
			if ( in_array( $woocommerce_currency, $accept_currencies ) ) {//temporarily restrict to RUB
				$import_currency_rate = $settings->get_params( 'import_currency_rate' );
				if ( $import_currency_rate ) {
					$rate = 1 / $import_currency_rate;
				}
			}
		} elseif ( in_array( $currency_code, $accept_currencies, true ) ) {
			$rate = $settings->get_params( "import_currency_rate_{$currency_code}" );
		}

		foreach ( $variations as $key => $variation ) {
			$variations_new            = array();
			$variations_new['image']   = $variation['image'];
			$variations_new['sku']     = self::process_variation_sku( $sku, $variation['variation_ids'] );
			$variations_new['sku_sub'] = self::process_variation_sku( $sku, $variation['variation_ids_sub'] );
			$variations_new['skuId']   = $variation['skuId'];
			$variations_new['skuAttr'] = $variation['skuAttr'];
			$skuVal                    = isset( $variation['skuVal'] ) ? $variation['skuVal'] : array();

			if ( $currency_code === 'USD' && isset( $skuVal['skuMultiCurrencyCalPrice'] ) ) {
				$variations_new['regular_price'] = $skuVal['skuMultiCurrencyCalPrice'];
				$variations_new['sale_price']    = isset( $skuVal['actSkuMultiCurrencyCalPrice'] ) ? $skuVal['actSkuMultiCurrencyCalPrice'] : '';
				if ( isset( $skuVal['actSkuMultiCurrencyBulkPrice'] ) && self::string_to_float( $skuVal['actSkuMultiCurrencyBulkPrice'] ) > self::string_to_float( $variations_new['sale_price'] ) ) {
					$variations_new['sale_price'] = $skuVal['actSkuMultiCurrencyBulkPrice'];
				}
			} else {
				/*maybe convert to USD if data currency is not USD but the store currency*/
				$variations_new['regular_price'] = isset( $skuVal['skuCalPrice'] ) ? $skuVal['skuCalPrice'] : '';
				$variations_new['sale_price']    = ( isset( $skuVal['actSkuCalPrice'], $skuVal['actSkuBulkCalPrice'] ) && self::string_to_float( $skuVal['actSkuBulkCalPrice'] ) > self::string_to_float( $skuVal['actSkuCalPrice'] ) ) ? $skuVal['actSkuBulkCalPrice'] : ( isset( $skuVal['actSkuCalPrice'] ) ? $skuVal['actSkuCalPrice'] : '' );

				if ( ( $currency_code === $woocommerce_currency || in_array( $currency_code, $accept_currencies, true ) ) && $rate ) {
					if ( $variations_new['regular_price'] ) {
						$variations_new['regular_price'] = $rate * $variations_new['regular_price'];
					}
					if ( $variations_new['sale_price'] ) {
						$variations_new['sale_price'] = $rate * $variations_new['sale_price'];
					}
				}

				if ( isset( $skuVal['skuAmount']['currency'], $skuVal['skuAmount']['value'] ) && $skuVal['skuAmount']['value'] ) {
					if ( $skuVal['skuAmount']['currency'] === 'USD' ) {
						$variations_new['regular_price'] = $skuVal['skuAmount']['value'];
						if ( isset( $skuVal['skuActivityAmount']['currency'], $skuVal['skuActivityAmount']['value'] ) && $skuVal['skuActivityAmount']['currency'] === 'USD' && $skuVal['skuActivityAmount']['value'] ) {
							$variations_new['sale_price'] = $skuVal['skuActivityAmount']['value'];
						}

					} elseif ( ( $skuVal['skuAmount']['currency'] === $woocommerce_currency || in_array( $skuVal['skuAmount']['currency'], $accept_currencies, true ) ) && $rate ) {
						$variations_new['regular_price'] = $rate * $skuVal['skuAmount']['value'];

						if ( isset( $skuVal['skuActivityAmount']['currency'], $skuVal['skuActivityAmount']['value'] ) && $skuVal['skuActivityAmount']['value']
						     && ( $skuVal['skuActivityAmount']['currency'] === $woocommerce_currency || in_array( $skuVal['skuActivityAmount']['currency'], $accept_currencies, true ) ) ) {
							$variations_new['sale_price'] = $rate * $skuVal['skuActivityAmount']['value'];
						}
					}
				}
			}

			$variations_new['stock']          = isset( $skuVal['availQuantity'] ) ? absint( $skuVal['availQuantity'] ) : 0;
			$variations_new['attributes']     = isset( $variation['variation_ids'] ) ? $variation['variation_ids'] : array();
			$variations_new['attributes_sub'] = isset( $variation['variation_ids_sub'] ) ? $variation['variation_ids_sub'] : array();
			$variations_new['ship_from']      = isset( $variation['ship_from'] ) ? $variation['ship_from'] : '';
			$variations_news[]                = $variations_new;
		}

		return $variations_news;
	}

	/**
	 * Update attributes list for Attributes mapping function
	 *
	 * @param $attributes
	 */
	public static function update_attributes_list( $attributes ) {
		$attributes_list = get_transient( 'vi_wad_product_attributes_list' );
		if ( $attributes_list !== false ) {
			$attributes_list = vi_wad_json_decode( $attributes_list );
			foreach ( $attributes as $key => $attribute ) {
				if ( isset( $attribute['slug'] ) ) {
					if ( ! isset( $attributes_list[ $attribute['slug'] ] ) ) {
						$attributes_list[ $attribute['slug'] ] = array();
					}
					if ( is_array( $attribute['values'] ) ) {
						$attributes_list[ $attribute['slug'] ] = array_values( array_unique( array_merge( $attributes_list[ $attribute['slug'] ], array_map( 'strtolower', $attribute['values'] ) ) ) );
					}
				}
			}
			set_transient( 'vi_wad_product_attributes_list', wp_json_encode( $attributes_list ) );
		}
	}

	/**
	 * @param $country_code
	 *
	 * @return mixed|string
	 */
	public static function get_ali_country_locale( $country_code ) {
		$country_code = strtolower( $country_code );
		$locale       = array(
			'id' => 'id',
			'kr' => 'ko',
			'ma' => 'ar',
			'de' => 'de',
			'es' => 'es',
			'fr' => 'fr',
			'it' => 'it',
			'nl' => 'nl',
			'br' => 'pt',
			'vn' => 'vi',
			'il' => 'he',
			'jp' => 'ja',
			'pl' => 'pl',
			'ru' => 'ru',
			'ar' => 'es',
			'at' => 'de',
			'tr' => 'tr',
		);

		return isset( $locale[ $country_code ] ) ? $locale[ $country_code ] : '';
	}

	/**
	 * @param $country_code
	 *
	 * @return float|int|string
	 */
	public static function get_ali_tax( $country_code ) {
		$country_code = strtolower( $country_code );
		$rates        = array(
			/*US*/
			//			'us' => 10,
			/*New Zealand*/
			//			'nz' => 15,
			/*Australia*/
			//			'au' => 10,
			/*EU*/
			'at' => 20,
			'be' => 21,
			'cz' => 21,
			'dk' => 25,
			'ee' => 20,
			'fi' => 24,
			'fr' => 20,
			'de' => 19,
			'gr' => 24,
			'hu' => 27,
			'is' => 24,
			'ie' => 23,
			'it' => 22,
			'lv' => 21,
			'lu' => 17,
			'nl' => 21,
			'no' => 25,
			'pl' => 23,
			'pt' => 23,
			'sk' => 20,
			'si' => 22,
			'es' => 21,
			'se' => 25,
			'ch' => 7.7,
			'cy' => 19,
			/*United Kingdom*/
			//			'uk' => 20,
		);

		return isset( $rates[ $country_code ] ) ? $rates[ $country_code ] / 100 : '';
	}

	/**
	 * @param $a
	 * @param $b
	 *
	 * @return int
	 */
	public static function sort_by_column_origin( $a, $b ) {
		return strnatcasecmp( $a['origin'], $b['origin'] );
	}


	/**
	 * @return int
	 */
	public static function bump_request_timeout() {
		return 60;
	}

	/**
	 * @param $hour
	 * @param $minute
	 * @param $second
	 *
	 * @return false|float|int
	 */
	public static function get_schedule_time_from_local_time( $hour, $minute, $second ) {
		$gmt_offset          = intval( get_option( 'gmt_offset' ) );
		$schedule_time_local = strtotime( 'today' ) + HOUR_IN_SECONDS * absint( $hour ) + MINUTE_IN_SECONDS * absint( $minute ) + absint( $second );
		if ( $gmt_offset < 0 ) {
			$schedule_time_local -= DAY_IN_SECONDS;
		}
		$schedule_time = $schedule_time_local - HOUR_IN_SECONDS * $gmt_offset;
		if ( $schedule_time < time() ) {
			$schedule_time += DAY_IN_SECONDS;
		}

		return $schedule_time;
	}

	/**
	 * Must use this method instead of string compare because there may be differences in the order of attributes in sku attr of the same variation
	 * E.G: 14:771#BK;5:361386;200007763:201336100 and 14:771#BK;200007763:201336100;5:361386
	 *
	 * @param $sku_attr_1
	 * @param $sku_attr_2
	 *
	 * @return bool
	 */
	public static function is_sku_attr_equal( $sku_attr_1, $sku_attr_2 ) {
		$equal          = false;
		$sku_attr_1_arr = explode( ';', $sku_attr_1 );
		foreach ( $sku_attr_1_arr as &$skuAttr_v ) {
			$skuAttr_v = explode( '#', $skuAttr_v )[0];
		}
		$sku_attr_2_arr = explode( ';', $sku_attr_2 );
		foreach ( $sku_attr_2_arr as &$skuAttr_v ) {
			$skuAttr_v = explode( '#', $skuAttr_v )[0];
		}
		if ( count( $sku_attr_1_arr ) === count( array_intersect( $sku_attr_1_arr, $sku_attr_2_arr ) ) ) {
			$equal = true;
		}

		return $equal;
	}

	/**
	 * Must use this method instead of array_search because there may be differences in the order of attributes in sku attr of the same variation
	 * E.G: 14:771#BK;5:361386;200007763:201336100 and 14:771#BK;200007763:201336100;5:361386
	 *
	 * @param $skuAttr
	 * @param $search_skuAttrs
	 *
	 * @return bool|int|string
	 */
	public static function search_sku_attr( $skuAttr, $search_skuAttrs ) {
		$search      = false;
		$skuAttr_arr = explode( ';', $skuAttr );
		foreach ( $skuAttr_arr as &$skuAttr_v ) {
			$skuAttr_v = explode( '#', $skuAttr_v )[0];
		}
		$skuAttr_arr_count = count( $skuAttr_arr );
		foreach ( $search_skuAttrs as $key => $value ) {
			if ( $value ) {
				$value_arr = explode( ';', $value );
				foreach ( $value_arr as &$skuAttr_v ) {
					$skuAttr_v = explode( '#', $skuAttr_v )[0];
				}
				if ( $skuAttr_arr_count === count( array_intersect( $skuAttr_arr, $value_arr ) ) ) {
					$search = $key;
					break;
				}
			}
		}

		return $search;
	}

	/**
	 * @param $object_id
	 * @param string $object_type
	 *
	 * @return mixed|string|void
	 */
	public static function wpml_get_original_object_id( $object_id, $object_type = 'product' ) {
		$wpml_id = '';
		if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) ) {
			global $sitepress;
			$default_lang     = apply_filters( 'wpml_default_language', null );
			$current_language = apply_filters( 'wpml_current_language', null );
			if ( $current_language && $current_language !== $default_lang ) {
				$wpml_object_id = apply_filters(
					'wpml_object_id', $object_id, $object_type, false, $sitepress->get_default_language()
				);
				if ( $wpml_object_id != $object_id ) {
					$wpml_object = $object_type === 'product' ? wc_get_product( $wpml_object_id ) : get_post( $wpml_object_id );
					if ( $wpml_object ) {
						$wpml_id = $wpml_object_id;
					}
				}
			}
		}

		return $wpml_id;
	}


	/**
	 * Default custom rules
	 * Each rule contains below elements
	 *
	 * @return array
	 */
	public static function get_default_custom_rules() {
		return array(
			'categories'      => array(),
			'excl_categories' => array(),
			'products'        => array(),
			'excl_products'   => array(),
			'price_from'      => array( 0 ),
			'price_to'        => array( '' ),
			'plus_value'      => array( 200 ),
			'plus_sale_value' => array( - 1 ),
			'plus_value_type' => array( 'percent' ),
			'price_default'   => array(
				'plus_value'      => 2,
				'plus_sale_value' => 1,
				'plus_value_type' => 'multiply',
			),
		);
	}

	/**
	 * Only ali_member_id and media_id are available so need check which host a video belongs to
	 * At the moment, only two hosts are known
	 *
	 * @param $video
	 *
	 * @return bool|string
	 */
	public static function get_valid_aliexpress_video_link( $video ) {
		if ( ! empty( $video['url'] ) ) {
			$link    = $video['url'];
			$request = wp_safe_remote_get( $link );
			if ( wp_remote_retrieve_response_code( $request ) == 400 ) {
				$link = false;
			}

			return $link;
		}
		$link    = "https://video.aliexpress-media.com/play/u/ae_sg_item/{$video['ali_member_id']}/p/1/e/6/t/10301/{$video['media_id']}.mp4";
		$request = wp_safe_remote_get( $link );
		if ( wp_remote_retrieve_response_code( $request ) == 400 ) {
			$link    = "https://cloud.video.taobao.com/play/u/{$video['ali_member_id']}/p/1/e/6/t/10301/{$video['media_id']}.mp4";
			$request = wp_safe_remote_get( $link );
			if ( wp_remote_retrieve_response_code( $request ) == 400 ) {
				$link = false;
			}
		}

		return $link;
	}

	/**
	 *
	 */
	public static function chrome_extension_buttons() {
		?>
        <span class="vi-ui positive button labeled icon <?php echo esc_attr( self::set( array( 'connect-chrome-extension', 'hidden' ) ) ) ?>"
              data-site_url="<?php echo esc_url( site_url() ) ?>">
            <i class="linkify icon"> </i>
            <?php esc_html_e( 'Connect the Extension', 'woocommerce-alidropship' ) ?></span>
        <a target="_blank" href="https://downloads.villatheme.com/?download=alidropship-extension"
           class="vi-ui positive button labeled icon <?php echo esc_attr( self::set( 'download-chrome-extension' ) ) ?>">
            <i class="external icon"> </i>
			<?php esc_html_e( 'Install Chrome Extension', 'woocommerce-alidropship' ) ?>
        </a>
		<?php
	}

	public static function is_ald_table() {
		if ( self::$is_ald_table !== null ) {
			return self::$is_ald_table;
		}

		$deleted_old_data = get_option( 'ald_deleted_old_posts_data' );
		if ( $deleted_old_data ) {
			self::$is_ald_table = true;
		} else {
			self::$is_ald_table = self::get_instance()->get_params( 'ald_table' ) ?: get_option( 'ald_migrated_to_new_table' );
		}

		return self::$is_ald_table;
	}

	public static function get_ali_categories_list( $country = '' ) {
		$cache_name = $country ? "ali_categories_$country" : 'ali_categories';
		if ( isset( self::$cache[ $cache_name ] ) ) {
			return self::$cache[ $cache_name ];
		}
		$file = $file_country = 'categories.json';
		if ( $country ) {
			$file_country = "$country-$file";
		}
		$categories      = [];
		$categories_path = VI_WOOCOMMERCE_ALIDROPSHIP_PACKAGES . 'categories/';
		$categories_file = '';
		if ( is_file( $categories_path . $file_country ) ) {
			$categories_file = $categories_path . $file_country;
		}
		if ( ! $categories_file && is_file( $categories_path . $file ) ) {
			$categories_file = $categories_path . $file;
		}
		if ( $categories_file ) {
			$categories = vi_wad_json_decode( file_get_contents( $categories_file ) );// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		}
		self::$cache[ $cache_name ] = $categories;

		return self::$cache[ $cache_name ];
	}
}