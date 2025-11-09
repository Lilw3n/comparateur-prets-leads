<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_DATA {
	public static $prefix = 'tmds', $cache = [];
	private $params, $default, $current_params;
	protected static $instance = null;
	protected static $allow_html;

	public function __construct() {
		$this->define( $this->default, $this->current_params );
		$this->default += array(
			'key'                                  => '',
			'product_sku'                          => '{temu_product_id}',
			'auto_generate_unique_sku'             => 1,
			'product_import_specifications'        => 0,
			'product_import_cat'                   => 0,
			'exchange_rate_api'                    => 'google',
			'exchange_rate_decimals'               => [],
			'exchange_rate_auto'                   => 0,
			'exchange_rate_interval'               => 1,
			'exchange_rate_hour'                   => 1,
			'exchange_rate_minute'                 => 1,
			'exchange_rate_second'                 => 1,
			'product_import_video'                 => 1,
			'product_video_tab'                    => 1,
			'product_video_tab_priority'           => 25,
			'product_video_full_tab'               => '',
			'product_video_to_desc'                => 0,
			'sync_product_statuses'                => [ 'publish', 'pending', 'draft' ],
			'sync_product_qty'                     => 1,
			'sync_product_price'                   => 0,
			'sync_exclude_products'                => [],
			'sync_exclude_cat'                     => [],
			'update_product_if_available_purchase' => 'publish',
			'update_product_if_out_of_stock'       => 0,
			'update_product_if_not_available'      => 0,
			'update_variation_if_not_available'    => 0,
			'overriding_keep_product'              => 1,
			'overriding_link_only'                 => 1,
			'overriding_find_in_orders'            => 1,
			'overriding_sku'                       => 0,
			'overriding_title'                     => 0,
			'overriding_images'                    => 0,
			'overriding_video'                     => 0,
			'overriding_specifications'            => 0,
			'overriding_description'               => 0,
			'overriding_hide'                      => 0,
			'split_auto_remove_attribute'          => 1,// 0,
			'product_import_review'                => 1,// 0,
			'product_review_limit'                 => 8,
			'product_review_rating'                => [ 5, 4 ],
			'product_review_skip_empty'            => 1,
			'product_review_verified'              => 1,
			'product_review_status'                => 0,
			'delete_woo_product'                   => 1,
			'fulfill_order_status'                 => array( 'wc-completed', 'wc-on-hold', 'wc-processing' ),
			'fulfill_map_countries'                => [],
			'fulfill_map_fields'                   => [],
			'warehouse_enable'                     => 2,//0,
			'warehouse_fields'                     => [],
		);
		$this->params  = wp_parse_args( $this->current_params, $this->default );
	}

	public function define( &$default, &$current_params ) {
		global $tmds_params;
		$default = array(
			'enable'                      => 1,
			'product_status'              => 'publish',
			'catalog_visibility'          => 'visible',
			'product_categories'          => [],
			'product_tags'                => [],
			'variation_visible'           => '',
			'manage_stock'                => 1,
			'import_currency_rate'        => [],
			'price_from'                  => [ 0 ],
			'price_default'               => [
				'plus_value'      => 2,
				'plus_sale_value' => 1,
				'plus_value_type' => 'multiply',
			],
			'price_to'                    => [ '' ],
			'plus_value'                  => [ 200 ],
			'plus_sale_value'             => [ - 1 ],
			'plus_value_type'             => [ 'percent' ],
			'use_global_attributes'       => 1,
			'simple_if_one_variation'     => '',
			'product_description'         => 'none',
			'use_external_image'          => '',
			'download_description_images' => '',
			'product_gallery'             => 1,
			'disable_background_process'  => '',
			'product_shipping_class'      => '',
		);
		if ( ! $tmds_params ) {
			$tmds_params = get_option( 'tmds_params', array() );
		}
		$current_params = $tmds_params;
	}

	public static function get_instance( $new = false ) {
		if ( $new || null === self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function get_params( $name = "", $default = false ) {
		if ( ! $name ) {
			return apply_filters( 'villatheme_' . self::$prefix . '_params', $this->params );
		}
		$name_t = $name;
		switch ( $name_t ) {
			case 'import_currency_rate':
				if ( isset( $this->current_params[ $name_t ] ) || ! empty( $this->params[ $name_t ] ) ) {
					break;
				}
				$current_currency     = get_woocommerce_currency();
				$import_currency_rate = [];
				$accept_currency      = self::get_temu_data();
				if ( empty( $import_currency_rate ) ) {
					if ( isset( $accept_currency[ $current_currency ] ) ) {
						$import_currency_rate[ $current_currency ] = 1;
					} else {
						$import_currency_rate['USD'] = 1;
					}
				}
				$this->params[ $name_t ] = $import_currency_rate;
				break;
			case 'product_categories':
				if ( isset( $this->current_params[ $name_t ] ) || ! empty( $this->params[ $name_t ] ) ) {
					break;
				}
				$this->params[ $name_t ] = array( get_option( 'default_product_cat', 0 ) );
				break;
			case 'fulfill_map_countries':
				if ( isset( $this->current_params[ $name_t ] ) || ! empty( $this->params[ $name_t ] ) ) {
					break;
				}
				$this->params[ $name_t ] = [ WC()->countries->get_base_country() ];
				break;
		}

		return apply_filters( 'villatheme_' . self::$prefix . '_params_' . $name_t, $this->params[ $name_t ] ?? $this->params[ $name ] ?? $default );
	}

	public function get_default( $name = "" ) {
		if ( ! $name ) {
			return apply_filters( 'villatheme_' . self::$prefix . '_params_default', $this->default );
		}
		if ( isset( $this->default[ $name ] ) ) {
			return apply_filters( 'villatheme_' . self::$prefix . '_params_default-' . $name, $this->default[ $name ] );
		} else {
			return false;
		}
	}

	public function get_countries() {
		$wc_countries   = WC()->countries->get_countries();
		$temu_countries = self::get_temu_data( 'countries' );
		$countries      = [];
		unset( $temu_countries['VN'] );
		foreach ( $temu_countries as $k => $v ) {
			$countries[ $k ] = $wc_countries[ $k == 'UK' ? 'GB' : $k ];
		}

		return $countries;
	}

	public static function get_map_checkout_fields( $country ) {
		if ( ! isset( self::$cache['map_checkout_fields'][ $country ] ) ) {
			if ( ! isset( self::$cache['map_checkout_fields'] ) ) {
				self::$cache['map_checkout_fields'] = [];
			}
			self::$cache['map_checkout_fields'][ $country ] = [];
			$fields                                         = self::get_wc_checkout_fields( $country );
			if ( is_array( $fields ) && ! empty( $fields ) ) {
				$tmp = [ '' => esc_html__( 'Select a field', 'tmds-woocommerce-temu-dropshipping' ) ];
                $sections_name=apply_filters('tmds_get_wc_sections_info', array_keys($fields), $country);
				foreach ( $fields as $section_id => $section ) {
					if ( ! is_array( $section ) || empty( $section ) ) {
						continue;
					}
                    $section_name = $sections_name[$section_id]??$section_id;
					foreach ( $section as $key => $field ) {
						if ( isset( $field['type'] ) && in_array( $field['type'], [ 'html' ] ) ) {
							continue;
						}
						$tmp[ $section_id . '_' . $key ] = ( $field['label'] ?? $key ) . "( {$section_name}" . esc_html__( ' field', 'tmds-woocommerce-temu-dropshipping' ) . ')';
					}
				}
				self::$cache['map_checkout_fields'][ $country ] = $tmp;
			}
		}

		return self::$cache['map_checkout_fields'][ $country ];
	}

	public static function get_wc_checkout_fields( $country ) {
		if ( ! isset( self::$cache['wc_checkout_fields'][ $country ] ) ) {
			if ( ! isset( self::$cache['wc_checkout_fields'] ) ) {
				self::$cache['wc_checkout_fields'] = [];
			}
			$fields= apply_filters( 'woocommerce_checkout_fields', [
				'billing'  => WC()->countries->get_address_fields(
					$country,
					'billing_'
				),
				'shipping' => WC()->countries->get_address_fields(
					$country,
					'shipping_'
				),
				'order'    => array(
					'order_comments' => array(
						'type'        => 'textarea',
						'class'       => array( 'notes' ),
						'label'       => esc_html__( 'Order notes', 'tmds-woocommerce-temu-dropshipping' ),
						'placeholder' => esc_attr__(
							'Notes about your order, e.g. special notes for delivery.',
							'tmds-woocommerce-temu-dropshipping'
						),
					),
				),
			] );
			self::$cache['wc_checkout_fields'][ $country ]  = apply_filters('tmds_get_wc_checkout_fields',$fields, $country);
		}

		return self::$cache['wc_checkout_fields'][ $country ];
	}

	public static function get_shipping_fields( $country ) {
		if ( ! isset( self::$cache['temu_shipping_fields'][ $country ] ) ) {
			if ( ! isset( self::$cache['temu_shipping_fields'] ) ) {
				self::$cache['temu_shipping_fields'] = [];
			}
			$fields                                          = self::get_temu_data( 'checkout-fields' );
			self::$cache['temu_shipping_fields'][ $country ] = apply_filters('tmds_get_shipping_fields',self::json_decode( $fields[ $country ] ?? '' ), $country);
		}

		return self::$cache['temu_shipping_fields'][ $country ];
	}

	public static function get_address_postcode( $country, $region_id, $is_postcode_options = '' ) {
		if ( ! $country || ! $region_id ) {
			return '';
		}
		if ( ! isset( self::$cache['temu_postcode_list'][ $region_id ] ) ) {
			if ( ! isset( self::$cache['temu_postcode'][ $country ] ) ) {
				if ( ! isset( self::$cache['temu_postcode'] ) ) {
					self::$cache['temu_postcode'] = [];
				}
				$postcode = self::get_temu_data( 'postcode' . DIRECTORY_SEPARATOR . $country );
				if ( $postcode === '' ) {
					if ( ! isset( self::$cache['temu_state'][ $country ] ) ) {
						if ( ! isset( self::$cache['temu_state'] ) ) {
							self::$cache['temu_state'] = [];
						}
						self::$cache['temu_state'][ $country ] = self::get_temu_data( 'address-children' . DIRECTORY_SEPARATOR . $country );
					}
					$tmp_child = self::$cache['temu_state'][ $country ];
					$postcode  = self::get_postcode_children( $tmp_child, $is_postcode_options );
				}
				self::$cache['temu_postcode'][ $country ] = $postcode;
			}
			if ( ! isset( self::$cache['temu_postcode_list'] ) ) {
				self::$cache['temu_postcode_list'] = [];
			}
			$children                                        = self::$cache['temu_postcode'][ $country ];
			$children                                        = $children[ $region_id ] ?? [];
			self::$cache['temu_postcode_list'][ $region_id ] = $children;
		}

		return self::$cache['temu_postcode_list'][ $region_id ];
	}

	public static function get_postcode_children( $address_child, $is_postcode_options, $postcode = '' ) {
		if ( ! is_array( $address_child ) || empty( $address_child ) ) {
			return '';
		}
		if ( ! is_array( $postcode ) ) {
			$postcode = [];
		}
		$item = $address_child;
		if ( ! empty( $item['c'] ) ) {
			$key = $item['a1'] ?? $item['a'];
			if ( ! $key ) {
				return $postcode;
			}
			if ( ! $is_postcode_options ) {
				$postcode[ $key ] = $item['f'] ?? ( ! empty( $item['e'][0] ) ? $item['e'][0] : '' );
			} else {
				if ( ! isset( $postcode[ $key ] ) ) {
					$postcode[ $key ] = [];
				}
				if ( ! empty( $item['f'] ) ) {
					$postcode[ $key ][] = $item['f'];
				}
				if ( ! empty( $item['e'] ) && is_array( $item['e'] ) ) {
					$postcode[ $key ] += $item['e'];
				}
				if ( ! empty( $postcode[ $key ] ) ) {
					$postcode[ $key ] = array_unique( $postcode[ $key ] );
				}
			}
		} elseif ( is_array( $item ) && ! empty( $item ) ) {
			foreach ( $item as $item_v ) {
				$postcode = self::get_postcode_children( $item_v, $is_postcode_options, $postcode );
			}
		}

		return $postcode;
	}

	public static function get_address_children( $country, $region_id = '' ) {
		if ( ! $country ) {
			return false;
		}
		if ( ! $region_id ) {
			$region_id = $country;
		}
		if ( ! is_numeric( $region_id ) ) {
			$countries = self::get_temu_data( 'countries' );
			$region_id = $countries[ $country ]['region_id'] ?? '';
		}
		if ( ! isset( self::$cache['temu_state_list'][ $region_id ] ) ) {
			if ( ! isset( self::$cache['temu_state'][ $country ] ) ) {
				if ( ! isset( self::$cache['temu_state'] ) ) {
					self::$cache['temu_state'] = [];
				}
				self::$cache['temu_state'][ $country ] = self::get_temu_data( 'address-children' . DIRECTORY_SEPARATOR . $country );
			}
			if ( ! isset( self::$cache['temu_state_list'] ) ) {
				self::$cache['temu_state_list'] = [];
			}
			$children = self::$cache['temu_state'][ $country ];
			$children = $children[ $region_id ] ?? [];
			$tmp      = [];
			foreach ( $children as $region ) {
				if ( ! isset( $region['c'] ) && ! isset( $region['a'] ) && ! isset( $region['a1'] ) ) {
					continue;
				}
				$name = $region['c1'] ?? $region['c'];
				if ( $name && empty( $region['c1'] ) ) {
					if ( ! empty( $region['cw'] ) ) {
						$name = "{$region['cw']} ( {$name} )";
					} elseif ( ! empty( $region['f'] ) ) {
						$name = "{$name} ({$region['f']})";
					}
				}
				if ( ! empty( $region['a1'] ) ) {
					$tmp[ $region['a1'] ] = $name;
				} else {
					$tmp[ $region['a'] ] = $name;
				}
			}
			self::$cache['temu_state_list'][ $region_id ] = $tmp;
		}

		return self::$cache['temu_state_list'][ $region_id ];
	}

	public static function get_address_fulfill( $country, &$parent_id, $key, $warehouse_fields ) {
		if ( ! $country || $country != ( $warehouse_fields['country'] ?? '' ) || ! $key || empty( $warehouse_fields[ $key ] ) ) {
			return '';
		}
		if ( ! $parent_id ) {
			$parent_id = $country;
			if ( ! is_numeric( $parent_id ) ) {
				$countries = self::get_temu_data( 'countries' );
				$parent_id = $countries[ $country ]['region_id'] ?? '';
			}
		}
		if ( ! $parent_id ) {
			return '';
		}
		$region_id = $warehouse_fields[ $key ];
		$cache_key = $parent_id . '-' . $key;
		if ( ! isset( self::$cache['temu_address_fulfill'][ $cache_key ] ) ) {
			if ( ! isset( self::$cache['temu_state'][ $country ] ) ) {
				if ( ! isset( self::$cache['temu_state'] ) ) {
					self::$cache['temu_state'] = [];
				}
				self::$cache['temu_state'][ $country ] = self::get_temu_data( 'address-children' . DIRECTORY_SEPARATOR . $country );
			}
			if ( ! isset( self::$cache['temu_address_fulfill'] ) ) {
				self::$cache['temu_address_fulfill'] = [];
			}
			$children = self::$cache['temu_state'][ $country ];
			$children = $children[ $parent_id ] ?? [];
			$name     = '';

			foreach ( $children as $region ) {
				if ( ( $region['a'] ?? '' ) == $region_id || $region_id == ( $region['a1'] ?? '' ) ) {
					$name      = $region['c'] ?? '';
					$parent_id = $region_id;
					break;
				}
			}
			self::$cache['temu_address_fulfill'][ $cache_key ] = $name;
		}

		return self::$cache['temu_address_fulfill'][ $cache_key ];
	}

	public static function get_temu_pd_id( $woo_pd_id ) {
		$product = wc_get_product( $woo_pd_id );
		if ( $product ) {
			$product_id = $product->get_meta( '_' . self::$prefix . '_product_id' );
		}

		return $product_id ?? '';
	}

	public static function get_fulfill_url( $order_id = '', $pid = '' ) {
		return add_query_arg( array(
			'tmds_from_domain' => urlencode( site_url() ),
			'tmds_order_id'    => $order_id,
		), self::get_temu_pd_url( $pid, true ) );
	}

	/**
	 * @param $product_id
	 * @param bool $update_all
	 *
	 * @return string
	 */
	public static function get_update_product_url( $product_id, $tmds_id = '', $update_all = false ) {
		$args = array(
			'tmds_from_domain' => urlencode( site_url() ),
			'tmds_action'      => 'sync',
		);
		if ( ! $update_all && $product_id ) {
			$args['tmds_product_id'] = $product_id;
		}

		return add_query_arg( $args, $tmds_id ? self::get_temu_url( $tmds_id ) : self::get_temu_pd_url( $product_id, $product_id ?: '' ) );
	}

	public static function get_temu_pd_url( $pd_id, $is_woo_id = false ) {
		if ( $is_woo_id ) {
			$prefix    = self::$prefix;
			$args      = array(
				'tmds_query'     => 1,
				'post_type'      => $prefix . '_draft_product',
				'order'          => 'DESC',
				'post_status'    => [ 'publish', 'draft', 'override', 'trash' ],
				'fields'         => 'ids',
				'posts_per_page' => 1,
				'meta_query'     => [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'and',
					[
						'key'     => '_' . $prefix . '_woo_id',
						'compare' => '=',
						'value'   => $pd_id,
					]
				],
			);
			$the_query = TMDSPRO_Post::query( $args );
			$ids       = $the_query->get_posts();
			wp_reset_postdata();
			$pd_id = $ids[0] ?? '';
		}

		return self::get_temu_url( $pd_id );
	}

	public static function get_temu_url( $tmds_id = '', $path = '' ) {
		if ( $tmds_id ) {
			$goods_id = TMDSPRO_Post::get_post_meta( $tmds_id, '_' . ( self::$prefix ) . '_sku', true );
		}
		if ( ! empty( $goods_id ) ) {
			$path = '/goods.html?goods_id=' . $goods_id;
		}
		if ( ! $path && $tmds_id ) {
			$path = TMDSPRO_Post::get_post_meta( $tmds_id, '_' . ( self::$prefix ) . '_url', true );
		}
		if ( $path ) {
			$url = 'https://www.temu.com' . $path;
		}

		return $url ?? 'https://www.temu.com';
	}

	public static function get_temu_data( $type = 'currencies' ) {
		if ( ! isset( self::$cache['temu_data'][ $type ] ) ) {
			if ( ! isset( self::$cache['temu_data'] ) ) {
				self::$cache['temu_data'] = [];
			}
			self::$cache['temu_data'][ $type ] = '';
			$file                              = TMDSPRO_INCLUDES . "/i18n/temu/{$type}.php";
			if ( file_exists( $file ) ) {
				self::$cache['temu_data'][ $type ] = self::json_decode( include $file );
			}
		}

		return self::$cache['temu_data'][ $type ];
	}

	/**
	 * @param bool $count
	 * @param string $status
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array|string|null
	 */
	public static function get_fulfill_orders( $count = true, $status = 'to_order', $limit = 0, $offset = 0 ) {
		$instance = self::get_instance();
		global $wpdb;
		$woocommerce_order_items    = $wpdb->prefix . "woocommerce_order_items";
		$woocommerce_order_itemmeta = $wpdb->prefix . "woocommerce_order_itemmeta";
		$statuses                   = $instance->get_params( 'fulfill_order_status' );
		if ( ( get_option( 'woocommerce_feature_custom_order_tables_enabled' ) === 'yes' || get_option( 'woocommerce_custom_orders_table_enabled' ) === 'yes' ) && get_option( 'woocommerce_custom_orders_table_data_sync_enabled', 'no' ) === 'no' ) {
			$posts  = $wpdb->prefix . "wc_orders";
			$select = "DISTINCT {$posts}.id";
			$query  = "FROM {$posts} LEFT JOIN {$woocommerce_order_items} ON {$posts}.id={$woocommerce_order_items}.order_id";
			$query  .= " LEFT JOIN {$woocommerce_order_itemmeta} ON {$woocommerce_order_items}.order_item_id={$woocommerce_order_itemmeta}.order_item_id";
			$query  .= " WHERE {$posts}.type='shop_order' AND {$woocommerce_order_itemmeta}.meta_key='_tmds_order_id'";
			if ( ! empty( $statuses ) ) {
				$query .= " AND {$posts}.status IN ( '" . implode( "','", $statuses ) . "' )";
			}
		} else {
			$posts  = $wpdb->prefix . "posts";
			$select = "DISTINCT {$posts}.ID";
			$query  = "FROM {$posts} LEFT JOIN {$woocommerce_order_items} ON {$posts}.ID={$woocommerce_order_items}.order_id";
			$query  .= " LEFT JOIN {$woocommerce_order_itemmeta} ON {$woocommerce_order_items}.order_item_id={$woocommerce_order_itemmeta}.order_item_id";
			$query  .= " WHERE {$posts}.post_type='shop_order' AND {$woocommerce_order_itemmeta}.meta_key='_tmds_order_id'";
			if ( ! empty( $statuses ) ) {
				$query .= " AND {$posts}.post_status IN ( '" . implode( "','", $statuses ) . "' )";
			}
		}
		if ( $status === 'to_order' ) {
			$query .= " AND {$woocommerce_order_itemmeta}.meta_value=''";
		}
		if ( $count ) {
			$query = "SELECT COUNT({$select}) {$query}";

			return $wpdb->get_var( $query );//phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery , WordPress.DB.DirectDatabaseQuery.NoCaching , WordPress.DB.PreparedSQL.NotPrepared
		} else {
			$query = "SELECT {$select} {$query}";
			if ( $limit ) {
				$query .= " LIMIT {$offset},{$limit}";
			}

			return $wpdb->get_col( $query, 0 );//phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery , WordPress.DB.DirectDatabaseQuery.NoCaching , WordPress.DB.PreparedSQL.NotPrepared
		}
	}

	public static function connect_chrome_extension_buttons() {
		?>
        <span class="vi-ui positive button labeled icon tmds-connect-chrome-extension tmds-hidden"
              data-site_url="<?php echo esc_url( site_url() ) ?>" data-user="<?php echo esc_attr(get_current_user_id()) ?>">
        <i class="linkify icon"></i>
        <?php esc_html_e( 'Connect the Extension', 'tmds-woocommerce-temu-dropshipping' ) ?>
        </span>
		<?php
	}

	public static function chrome_extension_buttons() {
        self::connect_chrome_extension_buttons();
		?>
        <a target="_blank" href="https://www.temu.com"
           class="vi-ui primary button labeled icon tmds-import-products tmds-hidden">
            <i class="external icon"></i>
			<?php esc_html_e( 'Go to Temu Products', 'tmds-woocommerce-temu-dropshipping' ) ?>
        </a>
        <a target="_blank" href="https://downloads.villatheme.com/?download=tmds-extension"
           class="vi-ui positive button labeled icon tmds-download-chrome-extension">
            <i class="external icon"></i>
			<?php esc_html_e( 'Install Chrome Extension', 'tmds-woocommerce-temu-dropshipping' ) ?>
        </a>
		<?php
	}

	/**
	 * @param $tags
	 *
	 * @return array
	 */
	public static function filter_allowed_html( $tags = [] ) {
		if ( self::$allow_html && empty( $tags ) ) {
			return self::$allow_html;
		}
		$tags = array_merge_recursive( $tags, wp_kses_allowed_html( 'post' ), array(
			'input'  => array(
				'type'         => 1,
				'name'         => 1,
				'placeholder'  => 1,
				'autocomplete' => 1,
				'step'         => 1,
				'min'          => 1,
				'max'          => 1,
				'value'        => 1,
				'size'         => 1,
				'checked'      => 1,
				'disabled'     => 1,
				'readonly'     => 1,
			),
			'form'   => array(
				'method' => 1,
				'action' => 1,
			),
			'select' => array(
				'name'     => 1,
				'multiple' => 1,
			),
			'option' => array(
				'value'    => 1,
				'selected' => 1,
				'disabled' => 1,
			),
			'style'  => array(
				'id'   => 1,
				'type' => 1,
			),
			'source' => array(
				'type' => 1,
				'src'  => 1
			),
			'video'  => array(
				'width'  => 1,
				'height' => 1,
				'src'    => 1
			),
			'iframe' => array(
				'width'           => 1,
				'height'          => 1,
				'allowfullscreen' => 1,
				'allow'           => 1,
				'src'             => 1
			),
		) );
		$tmp  = $tags;
		foreach ( $tmp as $key => $value ) {
			$tags[ $key ] = wp_parse_args( [
				'width'         => 1,
				'height'        => 1,
				'class'         => 1,
				'id'            => 1,
				'type'          => 1,
				'style'         => 1,
				'data-*'        => 1,
				'fetchpriority' => 1,
				'loading'       => 1,
			], $value );
		}
		self::$allow_html = apply_filters( 'tmds_filter_allowed_html', $tags );

		return self::$allow_html;
	}

	public static function implode_html_attributes( $raw_attributes ) {
		$attributes = array();
		foreach ( $raw_attributes as $name => $value ) {
			$attributes[] = esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
		}

		return implode( ' ', $attributes );
	}

	public static function villatheme_render_field( $name, $field ) {
		if ( ! $name ) {
			return;
		}
		if ( ! empty( $field['html'] ) ) {
			echo wp_kses( $field['html'], self::filter_allowed_html() );

			return;
		}
		$type  = $field['type'] ?? '';
		$value = $field['value'] ?? '';
		if ( empty( $field['id'] ) ) {
			if ( ! empty( $field['prefix'] ) ) {
				$id = "tmds-{$field['prefix']}-{$name}";
			} else {
				$id = "tmds-{$name}";
			}
		} else {
			$id = $field['id'];
		}
		$class             = $field['class'] ?? $id;
		$custom_attributes = array_merge( [
			'type'  => $type,
			'name'  => $name,
			'id'    => $id,
			'value' => $value,
			'class' => $class,
		], (array) ( $field['custom_attributes'] ?? [] ) );
		if ( ! empty( $field['input_label'] ) ) {
			$input_label_type = $field['input_label']['type'] ?? 'left';
			echo wp_kses( sprintf( '<div class="vi-ui %s labeled input">', ( ! empty( $field['input_label']['fluid'] ) ? 'fluid ' : '' ) . $input_label_type ), self::filter_allowed_html() );
			if ( $input_label_type === 'left' ) {
				echo wp_kses( sprintf( '<div class="%s">%s</div>', $field['input_label']['label_class'] ?? 'vi-ui label', $field['input_label']['label'] ?? '' ), self::filter_allowed_html() );
			}
		}
		if ( ! empty( $field['empty_name_field'] ) ) {
			unset( $custom_attributes['name'] );
		}
		switch ( $type ) {
			case 'premium_option':
				printf( '<a class="vi-ui button" href="premium_option_url"
                                       target="_blank">%s</a>', esc_html__( 'Unlock This Feature', 'tmds-woocommerce-temu-dropshipping' ) );
				break;
			case 'checkbox':
				unset( $custom_attributes['type'] );
				echo wp_kses( sprintf( '
					<div class="vi-ui toggle checkbox%s">
						<input type="hidden" %s>
						<input type="checkbox" id="%s-checkbox" %s ><label></label>
					</div>', ! empty( $field['disabled'] ) ? ' disabled' : '', self::implode_html_attributes( $custom_attributes ), $id, $value ? 'checked' : ''
				), self::filter_allowed_html() );
				break;
			case 'select':
				$select_options = $field['options'] ?? '';
				$multiple       = $field['multiple'] ?? '';
				unset( $custom_attributes['type'] );
				unset( $custom_attributes['value'] );
				$custom_attributes['class'] = "vi-ui fluid dropdown {$class}";
				if ( $multiple ) {
					$value                         = (array) $value;
					$custom_attributes['name']     = $name . '[]';
					$custom_attributes['multiple'] = "multiple";
				}
				if ( ! empty( $field['is_search'] ) ) {
					$custom_attributes['class'] .= ' search';
				}
				echo wp_kses( sprintf( '<select %s>', self::implode_html_attributes( $custom_attributes ) ), self::filter_allowed_html() );
				if ( is_array( $select_options ) && count( $select_options ) ) {
					foreach ( $select_options as $k => $v ) {
						$selected = $multiple ? in_array( $k, $value ) : ( $k == $value );
						echo wp_kses( sprintf( '<option value="%s" %s>%s</option>',
							$k, $selected ? 'selected' : '', $v ), self::filter_allowed_html() );
					}
				}
				printf( '</select>' );
				break;
			case 'select2':
				$select_options = [];
				if ( ! is_array( $value ) ) {
					$value = $value ? [ $value ] : [];
				}
                $type_select2 = $custom_attributes['data-type_select2'] ?? '';
				switch ( $type_select2 ) {
					case 'category':
					case 'tag':
						if ( ! empty( $value ) && is_array( $value ) ) {
							foreach ( $value as $item ) {
								$category = get_term( $item );
								if ( $category ) {
									$select_options[ $item ] = $category->name;
								}
							}
						}
						break;
					case 'product':
						if ( ! empty( $value ) && is_array( $value ) ) {
							foreach ( $value as $item ) {
								$product = wc_get_product( $item );
								if ( $product ) {
									$select_options[ $item ] = "(#{$product->get_id()}) " . $product->get_name();
								}
							}
						}
						break;
					default:
						if ( ! empty( $field['options'] ) && is_array( $field['options'] ) ) {
							$select_options = $field['options'];
						}
				}
				$multiple = $field['multiple'] ?? '';
				unset( $custom_attributes['type'] );
				unset( $custom_attributes['value'] );
				if ( $multiple ) {
					if ( isset( $custom_attributes['name'] ) ) {
						$custom_attributes['name'] = $name . '[]';
					}
					$custom_attributes['multiple'] = "multiple";
				}
				$custom_attributes['class'] .= ' tmds-search-select2';
				echo wp_kses( sprintf( '<select %s>', wc_implode_html_attributes( $custom_attributes ) ), self::filter_allowed_html() );
				if ( is_array( $select_options ) && count( $select_options ) ) {
					foreach ( $select_options as $k => $v ) {
						?>
                        <option value="<?php echo esc_attr( $k ) ?>" <?php selected( in_array( $k, $value ) ) ?>><?php echo wp_kses_post( $v ) ?></option>
						<?php
					}
				}
				printf( '</select>' );
				break;
			case 'textarea':
				unset( $custom_attributes['type'] );
				unset( $custom_attributes['value'] );
				echo wp_kses( sprintf( '<textarea %s>%s</textarea>', self::implode_html_attributes( $custom_attributes ), $value ), self::filter_allowed_html() );
				break;
			default:
				if ( $type ) {
					echo wp_kses( sprintf( '<input %s>', self::implode_html_attributes( $custom_attributes ) ), self::filter_allowed_html() );
				}
		}
		if ( ! empty( $field['input_label'] ) ) {
			if ( ! empty( $input_label_type ) && $input_label_type === 'right' ) {
				printf( '<div class="%s">%s</div>', esc_attr( $field['input_label']['label_class'] ?? 'vi-ui label' ), wp_kses_post( $field['input_label']['label'] ?? '' ) );
			}
			printf( '</div>' );
		}
	}

	public static function villatheme_render_table_field( $options ) {
		if ( ! is_array( $options ) || empty( $options ) ) {
			return;
		}
		if ( ! empty( $options['html'] ) ) {
			echo wp_kses( $options['html'], self::filter_allowed_html() );

			return;
		}
		if ( isset( $options['section_start'] ) ) {
			if ( ! empty( $options['section_start']['accordion'] ) ) {
				echo wp_kses( sprintf( '<div class="vi-ui styled fluid accordion%s">
                                            <div class="title%s">
                                                <i class="dropdown icon"> </i>
                                                %s
                                            </div>
                                        <div class="content%s">',
					! empty( $options['section_start']['class'] ) ? " {$options['section_start']['class']}" : '',
					! empty( $options['section_start']['active'] ) ? " active" : '',
					$options['section_start']['title'] ?? '',
					! empty( $options['section_start']['active'] ) ? " active" : ''
				),
					self::filter_allowed_html() );
			}
			if ( empty( $options['fields_html'] ) ) {
				echo wp_kses_post( '<table class="form-table">' );
			}
		}
		if ( ! empty( $options['fields_html'] ) ) {
			echo wp_kses( $options['fields_html'], self::filter_allowed_html() );
		} else {
			$fields = $options['fields'] ?? '';
			if ( is_array( $fields ) && count( $fields ) ) {
				foreach ( $fields as $key => $param ) {
					$type = $param['type'] ?? '';
					$name = $param['name'] ?? $key;
					if ( ! $name ) {
						continue;
					}
					if ( empty( $param['id'] ) ) {
						if ( ! empty( $param['prefix'] ) ) {
							$id = "tmds-{$param['prefix']}-{$name}";
						} else {
							$id = "tmds-{$name}";
						}
					} else {
						$id = $param['id'];
					}
					if ( empty( $param['not_wrap_html'] ) ) {
						if ( ! empty( $param['wrap_class'] ) ) {
							$wrap_class = $param['wrap_class'];
							if ( is_array( $wrap_class ) ) {
								$wrap_class = implode( ' ', $wrap_class );
							}
							printf( '<tr class="%s"><th><label for="%s">%s</label></th><td>',
								esc_attr( $wrap_class ), esc_attr( $type === 'checkbox' ? $id . '-' . $type : $id ), wp_kses_post( $param['title'] ?? '' ) );
						} else {
							printf( '<tr><th><label for="%s">%s</label></th><td>', esc_attr( $type === 'checkbox' ? $id . '-' . $type : $id ), wp_kses_post( $param['title'] ?? '' ) );
						}
					}
					do_action( 'tmds_before_option_field', $name, $param );
					self::villatheme_render_field( $name, $param );
					if ( ! empty( $param['custom_desc'] ) ) {
						echo wp_kses_post( $param['custom_desc'] );
					}
					if ( ! empty( $param['desc'] ) ) {
						if ( is_array( $param['desc'] ) ) {
							if ( ! empty( $param['desc'] ) ) {
								foreach ( $param['desc'] as $desc ) {
									printf( '<p class="description">%s</p>', wp_kses_post( $desc ) );
								}
							}
						} else {
							printf( '<p class="description">%s</p>', wp_kses_post( $param['desc'] ) );
						}
					}
					if ( ! empty( $param['after_desc'] ) ) {
						echo wp_kses( $param['after_desc'], self::filter_allowed_html() );
					}
					do_action( 'tmds_after_option_field', $name, $param );
					if ( empty( $param['not_wrap_html'] ) ) {
						echo wp_kses_post( '</td></tr>' );
					}
				}
			}
		}
		if ( isset( $options['section_end'] ) ) {
			if ( empty( $options['fields_html'] ) ) {
				echo wp_kses_post( '</table>' );
			}
			if ( ! empty( $options['section_end']['accordion'] ) ) {
				echo wp_kses_post( '</div></div>' );
			}
		}
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
	 * @return bool
	 */
	public static function get_disable_wp_cron() {
		return defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON === true;
	}

	public static function get_product_status_options() {
		return array(
			'publish' => esc_html__( 'Publish', 'tmds-woocommerce-temu-dropshipping' ),
			'pending' => esc_html__( 'Pending', 'tmds-woocommerce-temu-dropshipping' ),
			'draft'   => esc_html__( 'Draft', 'tmds-woocommerce-temu-dropshipping' ),
		);
	}

	public static function get_product_tags() {
		$tags = get_terms( [
			'taxonomy'   => 'product_tag',
			'orderby'    => 'name',
			'order'      => 'ASC',
			'hide_empty' => false
		] );

		return wp_list_pluck( $tags, 'name', 'term_id' );
	}

	public static function get_product_categories() {
		$categories = get_categories( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );

		return self::build_dropdown_categories_tree( $categories );
	}

	private static function build_dropdown_categories_tree( $all_cats, $parent_cat = 0, $level = 1 ) {
		foreach ( $all_cats as $cat ) {
			if ( $cat->parent == $parent_cat ) {
				$prefix               = str_repeat( '&nbsp;-&nbsp;', $level - 1 );
				$res[ $cat->term_id ] = $prefix . $cat->name . " ({$cat->count})";
				$child_cats           = self::build_dropdown_categories_tree( $all_cats, $cat->term_id, $level + 1 );
				if ( $child_cats ) {
					$res += $child_cats;
				}
			}
		}

		return $res ?? [];
	}

	public static function get_catalog_visibility_options() {
		return wc_get_product_visibility_options();
	}

	public static function get_shipping_class_options() {
		$shipping_classes = get_terms(
			array(
				'taxonomy'   => 'product_shipping_class',
				'orderby'    => 'name',
				'order'      => 'ASC',
				'hide_empty' => false
			)
		);

		return wp_list_pluck( $shipping_classes, 'name', 'term_id' );
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

	public static function json_decode( $json, $assoc = true, $depth = 512, $options = 2 ) {
		if ( is_array( $json ) || ! $json ) {
			return $json;
		}
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$json = mb_convert_encoding( $json, 'UTF-8', 'UTF-8' );
		}

		return json_decode( is_string( $json ) ? $json : '{}', $assoc, $depth, $options );
	}

	public static function strtolower( $string ) {
		return function_exists( 'mb_strtolower' ) ? mb_strtolower( $string ) : strtolower( $string );
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
	 * @param $slug
	 *
	 * @return string
	 */
	public static function get_attribute_name_by_slug( $slug ) {
		return ucwords( str_replace( '-', ' ', $slug ) );
	}

	/**
	 * @param $name
	 *
	 * @return string
	 */
	public static function sanitize_taxonomy_name( $name ) {
		return rawurlencode( self::strtolower( rawurlencode( wc_sanitize_taxonomy_name( $name ) ) ) );
	}

	public static function create_ajax_nonce( $type = 'admin_ajax' ) {
		return apply_filters( 'tmds_ajax_nonce', wp_create_nonce( 'tmds_' . $type ) );
	}

	public static function villatheme_set_time_limit() {
		ActionScheduler_Compatibility::raise_memory_limit();
		wc_set_time_limit();
	}

	public static function enqueue_style( $handles = array(), $srcs = array(), $is_suffix = array(), $des = array(), $type = 'enqueue', $css_dir = TMDSPRO_CSS, $version = TMDSPRO_VERSION ) {
		if ( empty( $handles ) || empty( $srcs ) ) {
			return;
		}
		$action = $type === 'enqueue' ? 'wp_enqueue_style' : 'wp_register_style';
		$suffix = WP_DEBUG ? '' : '.min';
		foreach ( $handles as $i => $handle ) {
			if ( ! $handle || empty( $srcs[ $i ] ) ) {
				continue;
			}
			$suffix_t = ! empty( $is_suffix[ $i ] ) ? '.min' : $suffix;
			$action( $handle, $css_dir . $srcs[ $i ] . $suffix_t . '.css', ! empty( $des[ $i ] ) ? $des[ $i ] : array(), $version );
		}
	}

	public static function enqueue_script( $handles = array(), $srcs = array(), $is_suffix = array(), $des = array(), $type = 'enqueue', $in_footer = false, $js_dir = TMDSPRO_JS, $version = TMDSPRO_VERSION ) {
		if ( empty( $handles ) || empty( $srcs ) ) {
			return;
		}
		$action = $type === 'register' ? 'wp_register_script' : 'wp_enqueue_script';
		$suffix = WP_DEBUG ? '' : '.min';
		foreach ( $handles as $i => $handle ) {
			if ( ! $handle || empty( $srcs[ $i ] ) ) {
				continue;
			}
			$suffix_t = ! empty( $is_suffix[ $i ] ) ? '.min' : $suffix;
			$action( $handle, $js_dir . $srcs[ $i ] . $suffix_t . '.js', ! empty( $des[ $i ] ) ? $des[ $i ] : array( 'jquery' ), $version, $in_footer );
		}
	}
}