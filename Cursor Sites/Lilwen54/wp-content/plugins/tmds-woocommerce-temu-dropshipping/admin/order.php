<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Admin_Order {
	private static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		//mark as Temu product in orders
		add_action( 'woocommerce_new_order_item', array( $this, 'add_order_item_meta' ), 10, 2 );
		add_filter( 'woocommerce_hidden_order_itemmeta', array( $this, 'hidden_order_itemmeta' ) );
		//add new column
		add_action( 'manage_shop_order_posts_custom_column', array( $this, 'column_callback_order' ), 10, 2 );
		add_action( 'manage_woocommerce_page_wc-orders_custom_column', array( $this, 'column_callback_order' ), 10, 2 );
		add_filter( 'views_woocommerce_page_wc-orders', array( $this, 'tmds_filter' ) );
		add_filter( 'views_edit-shop_order', array( $this, 'tmds_filter' ) );
		add_filter( 'posts_where', array( $this, 'filter_where' ), 10, 2 );
		add_filter( 'woocommerce_orders_table_query_clauses', [ $this, 'add_items_query' ] );
		add_filter( 'woocommerce_order_list_table_prepare_items_query_args', [ $this, 'add_order_filter_status' ] );
		//
		add_action( 'woocommerce_order_actions_end', array( $this, 'order_fulfill_button' ) );
		add_action( 'woocommerce_after_order_itemmeta', array( $this, 'woocommerce_after_order_itemmeta' ), 10, 3 );
		add_filter( 'tmds_admin_ajax_events', [ $this, 'ajax_events' ], 10, 2 );
	}

	public function ajax_events( $events, $prefix ) {
		if ( ! is_array( $events ) ) {
			$events = [];
		}
		$events += [
			$prefix . '_manually_update_fulfill_order_id' => array(
				'function' => 'update_fulfill_order_id',
				'class'    => $this,
			),
		];

		return $events;
	}

	public static function update_fulfill_order_id() {
		$prefix = self::$settings::$prefix;
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'Invalid nonce',
			) );
		}
		if ( ! current_user_can( apply_filters( 'villatheme_' . $prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $prefix . '-orders' ) ) ) {
			wp_send_json( array(
				'status'  => 'error',
				'message' => 'missing role',
			) );
		}
		$response         = array(
			'status'  => 'error',
			'message' => '',
		);
		$fulfill_order_id = isset( $_POST['fulfill_order_id'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['fulfill_order_id'] ) ) ) : '';
		$item_id          = isset( $_POST['item_id'] ) ? sanitize_text_field( wp_unslash( $_POST['item_id'] ) ) : '';
		if ( ! $item_id ) {
			$response['message'] = 'Can not find the item information';
			wp_send_json( $response );
		}
		if ( ! wc_update_order_item_meta( $item_id, '_' . $prefix . '_order_id', $fulfill_order_id ) ) {
			$response['message'] = 'Can not update fulfill_order_id';
			wp_send_json( $response );
		}
		if ( $fulfill_order_id ) {
			wc_update_order_item_meta( $item_id, '_tmds_order_item_status', 'processing' );
			$response['text']                     = self::status_switch( 'processing' );
			$response['fulfill_order_detail_url'] = self::$settings::get_temu_url();//self::$settings::get_taobao_order_detail_url( $fulfill_order_id );
			$response['fulfill_tracking_url']     = self::$settings::get_temu_url();//self::$settings::get_taobao_tracking_url( $fulfill_order_id );
		} else {
			wc_update_order_item_meta( $item_id, '_tmds_order_item_status', 'pending' );
			$response['text'] = self::status_switch( 'pending' );
		}
		$response['status'] = 'success';
		wp_send_json( $response );
	}

	public static function status_switch( $stt ) {
		$pattern = array(
			'pending'    => array( esc_html__( 'To Order', 'tmds-woocommerce-temu-dropshipping' ), 'red' ),
			'processing' => array( esc_html__( 'Processing', 'tmds-woocommerce-temu-dropshipping' ), '#0089F7' ),
			'shipped'    => array( esc_html__( 'Shipped', 'tmds-woocommerce-temu-dropshipping' ), '#00B400' ),
		);

		return isset( $pattern[ $stt ] ) ? $pattern[ $stt ] : $pattern['pending'];
	}

	/**
	 * @param $item_id
	 * @param $item
	 * @param $product WC_Product
	 *
	 * @throws Exception
	 */
	public function woocommerce_after_order_itemmeta( $item_id, $item, $product ) {
		global $theorder;

		if ( ! $theorder || ! is_a( $item, 'WC_Order_Item_Product' ) || ! is_a( $product, 'WC_Product' ) ) {
			return;
		}

		$order_id   = $theorder->get_id();
		$product_id = $product->get_parent_id() ?: $product->get_id();
		if ( ! get_post_meta( $product_id, '_tmds_product_id', true ) ) {
			return;
		}
		$fulfill_order_id     = wc_get_order_item_meta( $item_id, '_tmds_order_id', true );
		$fulfill_order_detail = $tracking_url = $tracking_url_btn = '';
		if ( $fulfill_order_id ) {
			$fulfill_order_detail = self::$settings::get_temu_url();///self::$settings::get_fulfill_order_detail_url( $fulfill_order_id );
			$tracking_url         = self::$settings::get_temu_url();//self::$settings::get_taobao_tracking_url( $taobao_order_id );
			//$tracking_url_btn = self::$settings::get_tracking_url( $taobao_order_id );
		}
		$item_tracking_data    = wc_get_order_item_meta( $item_id, '_vi_wot_order_item_tracking_data', true );
		$current_tracking_data = array(
			'tracking_number' => '',
			'carrier_slug'    => '',
			'carrier_url'     => '',
			'carrier_name'    => '',
			'carrier_type'    => '',
			'time'            => time(),
		);
		if ( $item_tracking_data ) {
			$item_tracking_data    = TMDSPRO_DATA::json_decode( $item_tracking_data );
			$current_tracking_data = array_pop( $item_tracking_data );
		}
		$tracking_number = apply_filters( 'vi_woo_orders_tracking_current_tracking_number', $current_tracking_data['tracking_number'], $item_id, $order_id );
		$carrier_url     = apply_filters( 'vi_woo_orders_tracking_current_tracking_url', $current_tracking_data['carrier_url'], $item_id, $order_id );
		$carrier_name    = apply_filters( 'vi_woo_orders_tracking_current_carrier_name', $current_tracking_data['carrier_name'], $item_id, $order_id );
		$carrier_slug    = apply_filters( 'vi_woo_orders_tracking_current_carrier_slug', $current_tracking_data['carrier_slug'], $item_id, $order_id );
		$get_tracking    = array( 'tmds-item-actions-get-tracking' );
		if ( ! $fulfill_order_id ) {
			$get_tracking[] = 'tmds-hidden';
		}
		?>
        <div class="tmds-item-details-container">
            <div class="tmds-item-details tmds-item-order-id"
                 data-product_item_id="<?php echo esc_attr( $item_id ) ?>">
                <div class="tmds-item-label">
                    <span><?php esc_html_e( 'Temu Order ID', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                </div>
                <div class="tmds-item-value">
                    <a class="tmds-order-id"
                       href="<?php echo esc_url( $fulfill_order_detail ) ?>"
                       data-old_taobao_order_id="<?php echo esc_attr( $fulfill_order_id ) ?>"
                       target="_blank">
                        <input readonly class="tmds-order-id-input"
                               value="<?php echo esc_attr( $fulfill_order_id ) ?>">
                    </a>
                </div>
                <div class="tmds-item-actions">
                    <span class="dashicons dashicons-edit tmds-item-actions-edit"
                          title="<?php esc_attr_e( 'Edit', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    </span>
                    <span class="dashicons dashicons-yes tmds-item-actions-save tmds-hidden"
                          title="<?php esc_attr_e( 'Save', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    </span>
                    <span class="dashicons dashicons-no-alt tmds-item-actions-cancel tmds-hidden"
                          title="<?php esc_attr_e( 'Cancel', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    </span>
                </div>
                <div class="tmds-item-value-overlay tmds-hidden"></div>
            </div>
        </div>
		<?php
	}

	public function order_fulfill_button( $order_id ) {
		$order       = wc_get_order( $order_id );
		$order_items = $order->get_items();
		$fulfill_pid = '';
		if ( ! empty( $statuses ) && ! in_array( 'wc-' . $order->get_status(), $statuses ) ) {
			return;
		}
		if ( count( $order_items ) ) {
			foreach ( $order_items as $order_item ) {
				$pid = $order_item->get_data()['product_id'];
				if ( get_post_meta( $pid, '_tmds_product_id', true ) ) {
					$fulfill_pid = $pid;
					break;
				}
			}
		}
		if ( ! $fulfill_pid ) {
			return;
		}
//		$href = self::$settings::get_fulfill_url( $order_id, $fulfill_pid );
		$href          = admin_url('admin.php?page=tmds-orders&tmds_search='.$order_id);
		?>
        <li class="wide">
            <div class="tmds-order-btn">
                <a href="<?php echo esc_url( $href ); ?>" target="_blank" class="button">
					<?php esc_html_e( 'To Order Temu', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
            </div>
        </li>
		<?php
	}

	public function add_order_filter_status( $order_query_args ) {
		if ( ! empty( $_GET['page'] ) && sanitize_text_field( wp_unslash( $_GET['page'] ) ) === 'wc-orders' ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$current = ! empty( $_GET['status'] ) && sanitize_text_field( wp_unslash( $_GET['status'] ) ) === 'tmds_filter' ? 'current' : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		} else {
			$current = ! empty( $_GET['post_status'] ) && sanitize_text_field( wp_unslash( $_GET['post_status'] ) ) === 'tmds_filter' ? 'current' : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		if ( ! $current ) {
			return $order_query_args;
		}
		$fulfill_order_status       = self::$settings->get_params( 'fulfill_order_status' );
		$order_query_args['status'] = $fulfill_order_status;

		return $order_query_args;
	}

	public function add_items_query( $args ) {
		if ( isset( $_GET['status'], $_GET['page'] ) && sanitize_text_field( wp_unslash( $_GET['status'] ) ) === 'tmds_filter' && sanitize_text_field( wp_unslash( $_GET['page'] ) ) === 'wc-orders' ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			global $wpdb;
			$args['join']  .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_items ON {$wpdb->prefix}wc_orders.id={$wpdb->prefix}woocommerce_order_items.order_id";
			$args['join']  .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_itemmeta ON {$wpdb->prefix}woocommerce_order_items.order_item_id={$wpdb->prefix}woocommerce_order_itemmeta.order_item_id";
			$args['where'] .= " AND {$wpdb->prefix}woocommerce_order_itemmeta.meta_key='_tmds_order_id'";
		}

		return $args;
	}

	public function posts_distinct( $join, $wp_query ) {
		return 'DISTINCT';
	}

	public function posts_join( $join, $wp_query ) {
		global $wpdb;
		$join .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_items as vi_wad_woocommerce_order_items ON $wpdb->posts.ID=vi_wad_woocommerce_order_items.order_id";
		$join .= " LEFT JOIN {$wpdb->prefix}woocommerce_order_itemmeta as vi_wad_woocommerce_order_itemmeta ON vi_wad_woocommerce_order_items.order_item_id=vi_wad_woocommerce_order_itemmeta.order_item_id";

		return $join;
	}

	public function filter_where( $where, $wp_q ) {
		if ( isset( $_GET['post_status'], $_GET['post_type'] ) && $_GET['post_status'] === 'tmds_filter' && $_GET['post_type'] === 'shop_order' ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$fulfill_order_status = self::$settings->get_params( 'fulfill_order_status' );
			$where                .= " AND vi_wad_woocommerce_order_itemmeta.meta_key='_tmds_order_id' AND vi_wad_woocommerce_order_itemmeta.meta_value=''";
			if ( $fulfill_order_status ) {
				$where .= " AND wp_posts.post_status IN ( '" . implode( "','", $fulfill_order_status ) . "' )";
			}
			add_filter( 'posts_join', array( $this, 'posts_join' ), 10, 2 );
			add_filter( 'posts_distinct', array( $this, 'posts_distinct' ), 10, 2 );
		}

		return $where;
	}


	public function tmds_filter( $views ) {
		if ( ! empty( $_GET['page'] ) && sanitize_text_field( wp_unslash( $_GET['page'] ) ) === 'wc-orders' ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$current = ! empty( $_GET['status'] ) && sanitize_text_field( wp_unslash( $_GET['status'] ) ) === 'tmds_filter' ? 'current' : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$url     = admin_url( 'admin.php?page=wc-orders&status=tmds_filter' );
		} else {
			$current = ! empty( $_GET['post_status'] ) && sanitize_text_field( wp_unslash( $_GET['post_status'] ) ) === 'tmds_filter' ? 'current' : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$url     = admin_url( 'edit.php?post_status=tmds_filter&post_type=shop_order' );
		}

		$views['tmds_filter'] = sprintf( "<a href='%s' class='%s'>%s <span class='count'>(%s)</span></a>",
			esc_url( $url ), esc_attr( $current ), esc_html__( 'To order Temu', 'tmds-woocommerce-temu-dropshipping' ), esc_html( self::$settings::get_fulfill_orders() ) );

		return $views;
	}

	/**
	 * @param $col_id
	 * @param $order_id
	 *
	 * @throws Exception
	 */
	public function column_callback_order( $col_id, $order_id ) {
		if ( $col_id !== 'order_number' ) {
			return;
		}
		$order        = wc_get_order( $order_id );
		$order_id     = $order->get_id();
		$statuses     = self::$settings->get_params( 'fulfill_order_status' );
		$order_status = $order->get_status();
		if ( ! empty( $statuses ) && ! in_array( 'wc-' . $order_status, $statuses ) ) {
			return;
		}
		$order_items    = $order->get_items();
		$fulfill_action = $status = $fulfill_pid = '';
		$total          = $ordered = $shipped = $tracking_number = 0;
		$order_stt      = $color = '';
		if ( empty( $order_items ) ) {
			return;
		}
		foreach ( $order_items as $item_id => $order_item ) {
			$pid                = $order_item->get_data()['product_id'];
			$fulfill_product_id = get_post_meta( $pid, '_tmds_product_id', true );
			if ( ! $fulfill_product_id ) {
				continue;
			}
			$fulfill_pid        = $fulfill_pid ?: ( $fulfill_product_id ? $pid : $fulfill_pid );
			$item_tracking_data = wc_get_order_item_meta( $item_id, '_vi_wot_order_item_tracking_data', true );
			if ( $item_tracking_data ) {
				$item_tracking_data    = TMDSPRO_DATA::json_decode( $item_tracking_data );
				$current_tracking_data = array_pop( $item_tracking_data );
				if ( $current_tracking_data['tracking_number'] ) {
					$tracking_number ++;
				}
			}
			if ( $order_item->get_meta( '_tmds_order_id' ) ) {
				$ordered ++;
			}
			if ( $order_item->get_meta( '_tmds_order_item_status' ) == 'shipped' ) {
				$shipped ++;
			}
			$total ++;
		}
		if ( $total && $fulfill_pid ) {
			$order_rate    = $ordered / $total;
			$tracking_rate = $tracking_number / $total;
			$shipped_rate  = $shipped / $total;
			$href          = admin_url('admin.php?page=tmds-orders&tmds_search='.$order_id);
//			$href          = self::$settings::get_fulfill_url( $order_id, $fulfill_pid );
			$target        = '_blank';

			if ( $shipped_rate == 1 ) {
				$order_stt = esc_html__( 'Shipped', 'tmds-woocommerce-temu-dropshipping' );
				$color     = 'shipped';
			} else {
				if ( $order_rate == 0 && $tracking_rate == 0 ) {
					$order_stt = esc_html__( 'To Order', 'tmds-woocommerce-temu-dropshipping' );
					$color     = 'to-order';
				} elseif ( $order_rate < 1 && $tracking_rate <= 1 ) {
					$order_stt = esc_html__( 'Processing', 'tmds-woocommerce-temu-dropshipping' );
					$color     = $order_rate < 1 ? 'processing' : 'processing1';
				} elseif ( $order_rate == 1 && $tracking_rate < 1 ) {
					$order_stt = esc_html__( 'Processing', 'tmds-woocommerce-temu-dropshipping' );
					$color     = 'full-processing';
					$href      = 'javascript:void(0)';
					$target    = '';
				} elseif ( $order_rate == 1 && $tracking_rate == 1 ) {
					$order_stt = esc_html__( 'In transit', 'tmds-woocommerce-temu-dropshipping' );
					$color     = 'completed';
					$href      = 'javascript:void(0)';
					$target    = '';
				}
			}
			$tooltip        = 'Light green: No order  &#xa;Orange: Not enough order';
			$fulfill_action = "<a data-tooltip='{$tooltip}' data-position='bottom center' data-inverted='' class='tmds-fulfill-button' target='{$target}' href='" . esc_attr( $href ) . "'>" . $order_stt . "</a>";
			$status         = "<button type='button' class='tmds-show-detail {$color}' data-id='{$order_id}'><i class='tmds-icon dashicons dashicons-arrow-down tmds-spinner'></i></button>";
		}
		if ( in_array( $color, [ 'to-order', 'processing' ] ) ) {
			echo wp_kses( "<div class='tmds-fulfill-group {$color}'>{$fulfill_action}{$status}</div>", self::$settings::filter_allowed_html() );//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	public function hidden_order_itemmeta( $hidden_order_itemmeta ) {
		$hidden = array(
			'_tmds_order_item_status',
			'_tmds_order_id'
		);
		foreach ( $hidden as $item ) {
			if ( ! in_array( $item, $hidden_order_itemmeta ) ) {
				$hidden_order_itemmeta[] = $item;
			}
		}

		return $hidden_order_itemmeta;
	}

	/**
	 * @param $item_id
	 * @param $values
	 *
	 * @throws Exception
	 */
	public function add_order_item_meta( $item_id, $values ) {
		if ( empty( $values['product_id'] ) ) {
			return;
		}
		$pid = $values['product_id'];
		if ( is_plugin_active( 'sitepress-multilingual-cms/sitepress.php' ) ) {
			global $sitepress;
			$pid = apply_filters(
				'wpml_object_id', $pid, 'product', false, $sitepress->get_default_language()
			);
		}
		if ( get_post_meta( $pid, '_tmds_product_id', true ) ) {
			wc_update_order_item_meta( $item_id, '_tmds_order_item_status', 'pending' );
			wc_update_order_item_meta( $item_id, '_tmds_order_id', '' );
		}
	}

	public function admin_enqueue_scripts( $page ) {
		global $post_type;
		$screen = get_current_screen();
		if ( ( $page === 'post.php' && $screen->id === 'shop_order' ) ||
		     ( $page == 'woocommerce_page_wc-orders' && ! empty( $_GET['action'] ) && sanitize_text_field( wp_unslash( $_GET['action'] ) ) === 'edit' ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			self::$settings::enqueue_style(
				array( 'tmds-admin-order' ),
				array( 'admin-order' ),
				array()
			);
			self::$settings::enqueue_script(
				array( 'tmds-admin-order' ),
				array( 'admin-order' )
			);
			wp_localize_script( 'tmds-admin-order', 'tmds_params', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => self::$settings::create_ajax_nonce()
			) );
		} elseif ( ( $page === 'edit.php' && $post_type === 'shop_order' ) ||
		           ( $page == 'woocommerce_page_wc-orders' &&
		             ( empty( $_GET['action'] ) || sanitize_text_field( wp_unslash( $_GET['action'] ) ) !== 'edit' ) ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			self::$settings::enqueue_style(
				array( 'semantic-ui-popup', 'tmds-admin-order' ),
				array( 'popup', 'admin-order' ),
				array( 1 )
			);
			self::$settings::enqueue_script(
				array( 'tmds-admin-order' ),
				array( 'admin-order' )
			);
			wp_localize_script( 'tmds-admin-order', 'tmds_params', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => self::$settings::create_ajax_nonce()
			) );
		}
	}
}