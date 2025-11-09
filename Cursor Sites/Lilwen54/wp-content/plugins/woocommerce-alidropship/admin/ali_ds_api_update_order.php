<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Update tracking numbers of AliExpress orders automatically
 *
 * Class VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Order
 */
class VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Order {
	protected static $settings;
	private static $get_data_to_update;

	public function __construct() {
		self::$settings = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();
		add_action( 'init', array( $this, 'background_process' ) );
		add_action( 'vi_wad_auto_update_order', array( $this, 'auto_update_order' ) );

		add_action( 'admin_init', array( $this, 'api_sync_order' ));
	}


	/**
	 * Background process that uses AliExpress API to fetch latest orders data
	 */
	public function background_process() {
		self::$get_data_to_update = new VI_WOOCOMMERCE_ALIDROPSHIP_BACKGROUND_ALI_API_GET_ORDER_DATA();
	}

	public function api_sync_order( $ali_order_id ) {
		if ( ! empty( $_GET['ald_api_sync_order'] ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$ali_order_id = absint( wc_clean(wp_unslash($_GET['ald_api_sync_order'])) );// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		if (!$ali_order_id ){
			return;
		}
		$access_token = self::$settings->get_params( 'access_token' );
		if (!$access_token){
			ob_start();
			print_r('Missing access token to sync ali_order_id : '.$ali_order_id.' via API', true);
			self::log( ob_get_clean() );
			return;
		}
		if ( ! self::$get_data_to_update->is_process_running() ) {
			self::$get_data_to_update->kill_process();
			if ( self::$get_data_to_update->is_queue_empty() || !get_transient( 'vi_wad_auto_update_ali_order_'.$ali_order_id.'time') ) {
				ob_start();
				var_dump('api - manual sync ali_order_id : '.$ali_order_id);
				self::log( ob_get_clean() );
				global $wpdb;
				$woocommerce_order_itemmeta = $wpdb->prefix . "woocommerce_order_itemmeta";
				$woocommerce_order_items    = $wpdb->prefix . "woocommerce_order_items";
				$query                      = "SELECT * FROM {$woocommerce_order_items} as vi_wad_wc_order_items JOIN  {$woocommerce_order_itemmeta} AS vi_wad_wc_order_itemmeta ON vi_wad_wc_order_items.order_item_id=vi_wad_wc_order_itemmeta.order_item_id WHERE vi_wad_wc_order_itemmeta.meta_key='_vi_wad_aliexpress_order_id' AND vi_wad_wc_order_itemmeta.meta_value={$ali_order_id}";
				$results                    = $wpdb->get_results( $query, ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
				if ( !empty( $results ) ) {
					$dispatch = false;
					foreach ( $results as $result ) {
//						$item_tracking_data = wc_get_order_item_meta( $result['order_item_id'], '_vi_wot_order_item_tracking_data', true );
//						if ( $item_tracking_data ) {
//							$item_tracking_data = vi_wad_json_decode( $item_tracking_data );
//							if ( is_array( $item_tracking_data ) ) {
//								$count = count( $item_tracking_data );
//								if ( $count === 0 || empty( $item_tracking_data[ $count - 1 ]['tracking_number'] ) ) {
//									self::$get_data_to_update->push_to_queue( array(
//										'order_id'      => $result['order_id'],
//										'order_item_id' => $result['order_item_id'],
//										'ali_id'        => $result['meta_value'],
//									) );
//									$dispatch = true;
//
//								}
//							}
//						} else {
							self::$get_data_to_update->push_to_queue( array(
								'order_id'      => $result['order_id'],
								'order_item_id' => $result['order_item_id'],
								'ali_id'        => $result['meta_value'],
							) );
							$dispatch = true;
//						}
					}

					if ( $dispatch ) {
						set_transient( 'vi_wad_auto_update_ali_order_'.$ali_order_id.'time', time() );
						self::$get_data_to_update->save()->dispatch();
					} else {
						self::log( 'Cron: get order tracking number, no orders found', WC_Log_Levels::NOTICE );
					}
				} else {
					self::log( 'Cron: get order tracking number, no orders found.', WC_Log_Levels::NOTICE );
				}
			}else if (self::$settings->get_params( 'update_product_auto' ) ) {
				ob_start();
				var_dump('api_sync_order');
				self::log( ob_get_clean() );
				self::$get_data_to_update->dispatch();
			}
		}else {
			self::log( 'Background process is running' );
		}
	}

	/**
	 * Get all orders that have AliExpress order ID but do not have tracking numbers, push to queue to sync in the background
	 * Each queue contains 20 orders because AliExpress API supports a maximum of 20 orders per request
	 *
	 * @throws Exception
	 */
	public function auto_update_order() {
		global $wpdb;
		vi_wad_set_time_limit();

		if ( ! empty( $_REQUEST['crontrol-single-event'] ) ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			/*Do not run if manually triggered by WP Crontrol plugin*/
			return;
		}

		$access_token = self::$settings->get_params( 'access_token' );
		if ( self::$settings->get_params( 'update_order_auto' ) ) {
			if ( $access_token ) {
				if ( ! self::$get_data_to_update->is_process_running() && self::$get_data_to_update->is_queue_empty() ) {
					set_transient( 'vi_wad_auto_update_order_time', time() );
					$woocommerce_order_itemmeta = $wpdb->prefix . "woocommerce_order_itemmeta";
					$woocommerce_order_items    = $wpdb->prefix . "woocommerce_order_items";

					$query = "SELECT vi_wad_wc_order_items.order_id, vi_wad_wc_order_items.order_item_id, vi_wad_wc_order_itemmeta.meta_value";
					$query .= " FROM {$woocommerce_order_items} as vi_wad_wc_order_items JOIN {$wpdb->posts} ON  {$wpdb->posts}.ID=vi_wad_wc_order_items.order_id";
					$query .= " JOIN  {$woocommerce_order_itemmeta} AS vi_wad_wc_order_itemmeta ON vi_wad_wc_order_items.order_item_id=vi_wad_wc_order_itemmeta.order_item_id";
					$query .= " WHERE vi_wad_wc_order_itemmeta.meta_key='_vi_wad_aliexpress_order_id' AND vi_wad_wc_order_itemmeta.meta_value!=''";

					$results = $wpdb->get_results( $query, ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared

					if ( !empty( $results ) ) {
						$dispatch = false;
						foreach ( $results as $result ) {
							$item_tracking_data = wc_get_order_item_meta( $result['order_item_id'], '_vi_wot_order_item_tracking_data', true );

							if ( $item_tracking_data ) {
								$item_tracking_data = vi_wad_json_decode( $item_tracking_data );
								if ( is_array( $item_tracking_data ) ) {
									$count = count( $item_tracking_data );
									if ( $count === 0 || empty( $item_tracking_data[ $count - 1 ]['tracking_number'] ) ) {
										set_transient( 'vi_wad_auto_update_ali_order_'.$result['meta_value'].'time', time() );
										self::$get_data_to_update->push_to_queue( array(
											'order_id'      => $result['order_id'],
											'order_item_id' => $result['order_item_id'],
											'ali_id'        => $result['meta_value'],
										) );
										$dispatch = true;

									}
								}
							} else {
								set_transient( 'vi_wad_auto_update_ali_order_'.$result['meta_value'].'time', time() );
								self::$get_data_to_update->push_to_queue( array(
									'order_id'      => $result['order_id'],
									'order_item_id' => $result['order_item_id'],
									'ali_id'        => $result['meta_value'],
								) );
								$dispatch = true;
							}
						}
						if ( $dispatch ) {
							self::$get_data_to_update->save()->dispatch();
						} else {
							self::log( 'Cron: get order tracking number, no orders found', WC_Log_Levels::NOTICE );
						}
					} else {
						self::log( 'Cron: get orders tracking number, no orders found', WC_Log_Levels::NOTICE );
					}
				}
			} else {
				self::log( 'Missing access token' );
			}
		} else {
			$args = self::$settings->get_params();
			wp_unschedule_hook( 'vi_wad_auto_update_order' );
			$args['update_order_auto'] = '';
			update_option( 'wooaliexpressdropship_params', $args );
		}
	}

	/**
	 * @param $content
	 * @param string $log_level
	 */
	private static function log( $content, $log_level = 'alert' ) {
		VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Log::wc_log( $content, 'api-orders-sync', $log_level );
	}
}
