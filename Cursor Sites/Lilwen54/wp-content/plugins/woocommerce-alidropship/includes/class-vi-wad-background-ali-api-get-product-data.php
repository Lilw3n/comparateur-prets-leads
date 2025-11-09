<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VI_WOOCOMMERCE_ALIDROPSHIP_BACKGROUND_ALI_API_GET_PRODUCT_DATA extends WP_Background_Process {

	/**
	 * @var string
	 */
	protected $action = 'vi_wad_ali_api_get_product_data';

	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over
	 *
	 * @return mixed
	 */
	protected function task( $items ) {
		if ( ! is_array( $items ) || empty( $items ) ) {
			self::log( 'Invalid data' );
		}

		try {
			$settings = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();
			vi_wad_set_time_limit();
			$if_not_available = $settings->get_params( 'update_product_if_not_available' );
			$domain           = get_site_url();
			foreach ( $items as $item ) {
				if ( empty( $item['ali_id'] ) || empty( $item['woo_id'] ) ) {
					continue;
				}
				$country = 'US';
				self::log( "start sync product: {$item['ali_id']}" );
				$view_url      = admin_url( "admin.php?page=woocommerce-alidropship-imported-list&vi_wad_search_woo_id={$item['woo_id']}" );
				$ali_url       = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_aliexpress_product_url( $item['ali_id'] );
				$log           = "Product <a href='{$view_url}' target='_blank'>#{$item['woo_id']}</a>(Ali ID <a href='{$ali_url}' target='_blank'>{$item['ali_id']}</a>): ";
				$shipping_info = ALD_Product_Table::get_post_meta( $item['id'], '_vi_wad_shipping_info', true );
				if ( $shipping_info && ! empty( $shipping_info['country'] ) ) {
					$country = VI_WOOCOMMERCE_ALIDROPSHIP_Admin_API::filter_country( $shipping_info['country'] );
				}
				$get_data = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_data( '', [], 'viwad_init_data_before', false, [
					'product_id'      => $item['ali_id'],
					'target_currency' => 'USD',
					'ship_to_country' => $country,
					'target_language' => 'en',
					'locale'          => 'en_US',
					'domain'          => $domain,
					'action'          => 'update',
					'access_token'    => $settings->get_params( 'access_token' )
				] );
				if ( empty( $get_data['data']['product'] ) ) {
					self::handle_offline_product( $log, $if_not_available, $item );
					ob_start();
					print_r( wp_json_encode( $get_data ) );
					self::log( ob_get_clean() );
					continue;
				}
				VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::update_product_by_id( array(
					'id'     => $item['id'],
					'woo_id' => $item['woo_id'],
					'ali_id' => $item['ali_id']
				), $get_data['data']['product'] );
			}
		} catch ( \Error $e ) {
			self::log( 'Uncaught error: ' . $e->getMessage() . ' on ' . $e->getFile() . ':' . $e->getLine() );

			return false;
		} catch ( Exception $e ) {
			self::log( 'Can not get product data to sync: ' . $e->getMessage() );

			return false;
		}

		return false;
	}

	/**
	 * If a product is offline: add to log, maybe change status and send notification email to admin
	 *
	 * @param $log
	 * @param $if_not_available
	 * @param $item_data
	 */
	private static function handle_offline_product( $log, $if_not_available, $item_data ) {
		$log    = "{$log}This product is no longer available";
		$update = array(
			'time'             => time(),
			'hide'             => '',
			'is_offline'       => true,
			'shipping_removed' => false,
			'not_available'    => array(),
			'out_of_stock'     => array(),
			'is_out_of_stock'  => false,
			'price_changes'    => array(),
			'price_exceeds'    => array(),
		);
		ALD_Product_Table::update_post_meta( $item_data['id'], '_vi_wad_update_product_notice', $update );
		$woo_product = wc_get_product( $item_data['woo_id'] );
		if ( $woo_product ) {
			VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::update_product_if( $woo_product, $if_not_available, $log );
			VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::maybe_send_admin_email( $update, $log, $item_data );
		}
		self::log( $log );
	}

	/**
	 * Is the updater running?
	 *
	 * @return boolean
	 */
	public function is_process_running() {
		return parent::is_process_running();
	}

	/**
	 * Is the queue empty
	 *
	 * @return boolean
	 */
	public function is_queue_empty() {
		return parent::is_queue_empty();
	}

	/**
	 * Complete
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		// Show notice to user or perform some other arbitrary task...
		parent::complete();
		if ( $this->is_queue_empty() && ! $this->is_process_running() ) {
			/*After current queue is processed, handle products that need rechecking*/
			$recheck = get_option( 'vi_wad_recheck_products' );
			if ( $recheck ) {
				$recheck = vi_wad_json_decode( $recheck );
				if ( ! json_last_error() ) {
					$ids = array();
					foreach ( $recheck as $value ) {
						$value['recheck'] = 1;
						$ids[]            = $value;
						if ( count( $ids ) === 20 ) {
							VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::$get_data_to_update->push_to_queue( $ids );
							$ids = array();
						}
					}
					if ( ! empty( $ids ) ) {
						VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::$get_data_to_update->push_to_queue( $ids );
					}
					VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product::$get_data_to_update->save()->dispatch();
				}
				delete_option( 'vi_wad_recheck_products' );
			}
		}
	}

	/**
	 * Delete all batches.
	 *
	 * @return VI_WOOCOMMERCE_ALIDROPSHIP_BACKGROUND_ALI_API_GET_PRODUCT_DATA
	 */
	public function delete_all_batches() {
		global $wpdb;

		$table  = $wpdb->options;
		$column = 'option_name';

		if ( is_multisite() ) {
			$table  = $wpdb->sitemeta;
			$column = 'meta_key';
		}

		$key = $wpdb->esc_like( $this->identifier . '_batch_' ) . '%';

		$wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE {$column} LIKE %s", $key ) ); // @codingStandardsIgnoreLine.

		return $this;
	}

	/**
	 * Kill process.
	 *
	 * Stop processing queue items, clear cronjob and delete all batches.
	 */
	public function kill_process() {
		if ( ! $this->is_queue_empty() ) {
			$this->delete_all_batches();
			wp_clear_scheduled_hook( $this->cron_hook_identifier );
		}
	}

	/**
	 * @param $content
	 * @param string $log_level
	 */
	private static function log( $content, $log_level = 'alert' ) {
		VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Log::wc_log( $content, 'api-products-sync', $log_level );
	}
}