<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Store shipping info of AliExpress products
 */
if ( ! class_exists( 'VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table' ) ) {
	class VI_WOOCOMMERCE_ALIDROPSHIP_Ali_Shipping_Info_Table {
		/**
		 * Create table
		 */
		public static function create_table() {
			global $wpdb;
			$table = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			/*shipping_id should be ali_product_id+ship_to_country+quantity*/
			$query = "CREATE TABLE IF NOT EXISTS {$table} (
                             `id` bigint(20) NOT NULL AUTO_INCREMENT,
                             `shipping_id` varchar(191) NOT NULL unique,
                             `shipping_info` longtext NOT NULL,
                             `ali_id` varchar(191) NOT NULL,
                             PRIMARY KEY  (`id`)
                             )";

			$wpdb->query( $query );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		}

		/**
		 * @param $shipping_id
		 * @param $shipping_info
		 * @param $ali_id
		 *
		 * @return bool|int
		 */
		public static function insert( $shipping_id, $shipping_info, $ali_id ) {
			global $wpdb;
			$table = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			if ( $shipping_id && $shipping_info ) {
				$shipping_info = maybe_serialize( $shipping_info );
				$sql           = "INSERT INTO {$table} (`shipping_id`,`shipping_info`,`ali_id`) VALUES(%s,%s,%s) ON DUPLICATE KEY UPDATE `shipping_info`=%s,`ali_id`=%s";

				return $wpdb->query( $wpdb->prepare( $sql, array(// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
					$shipping_id,
					$shipping_info,
					$ali_id,
					$shipping_info,
					$ali_id,
				) ) );
			} else {
				return false;
			}
		}

		public static function add_column( $column ) {
			global $wpdb;
			$table = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			$query = "ALTER TABLE {$table} ADD COLUMN if NOT EXISTS `{$column}` varchar(191) default ''";

			return $wpdb->query( $query );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		}

		/**
		 * @param $shipping_id
		 *
		 * @return false|int
		 */
		public static function delete( $shipping_id ) {
			global $wpdb;
			$table  = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			$delete = $wpdb->delete( $table,// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				array(
					'shipping_id' => $shipping_id,
				),
				array(
					'%s',
				)
			);

			return $delete;
		}

		/**
		 * @param $shipping_id
		 *
		 * @return array|object|null
		 */
		public static function get_row_by_shipping_id( $shipping_id ) {
			global $wpdb;
			$table   = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			$query   = "SELECT shipping_info FROM {$table} WHERE shipping_id=%s LIMIT 1";
			$get_row = $wpdb->get_row( $wpdb->prepare( $query, $shipping_id ), ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared

			return $get_row ? maybe_unserialize( $get_row['shipping_info'] ) : $get_row;
		}

		/**
		 * @param array|object|null $shipping_method
		 * @param string $query_type
		 * @param string $operator_query
		 *
		 * @return array|null return array ali_id
		 */
		public static function get_row_by_shipping_method( $shipping_method, $query_type = '', $operator_query = 'AND' ) {
			global $wpdb;
			$table = $wpdb->prefix . 'vi_wad_ali_shipping_info';

			$like_clauses = [];
			$params       = [];
			if ( ! is_array( $shipping_method ) ) {
				$shipping_method = explode( ',', $shipping_method );
			}
			foreach ( $shipping_method as $method ) {
				$operator_like  = ( strtolower( trim( $query_type ) ) === 'exclude' ) ? 'NOT LIKE' : 'LIKE';
				$like_clauses[] = "shipping_info $operator_like %s";
				$params[]       = '%' . $wpdb->esc_like( $method ) . '%';
			}
			$where_clause = implode( " $operator_query ", $like_clauses );
			$query        = "SELECT ali_id FROM {$table} WHERE {$where_clause}";

			$get_row = $wpdb->get_col( $wpdb->prepare( $query, ...$params ) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared

			return ( $get_row );
		}

		/**
		 * Get a row data by id
		 *
		 * @param $id
		 *
		 * @return array|object|void|null
		 */
		public static function get_row( $id ) {
			global $wpdb;
			$table = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			$query = "SELECT * FROM {$table} WHERE id=%s LIMIT 1";

			return $wpdb->get_row( $wpdb->prepare( $query, $id ), ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		}

		/**
		 * @param int $limit
		 * @param int $offset
		 * @param bool $count
		 * @param string $ali_id
		 *
		 * @return array|object|string|null
		 */
		public static function get_rows( $limit = 0, $offset = 0, $count = false, $ali_id = '' ) {
			global $wpdb;
			$table  = $wpdb->prefix . 'vi_wad_ali_shipping_info';
			$select = '*';
			if ( $count ) {
				$select = 'count(*)';
				$query  = "SELECT {$select} FROM {$table}";
				if ( $ali_id ) {
					$query .= " WHERE {$table}.ali_id=%s";
					$query = $wpdb->prepare( $query, $ali_id );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				}

				return $wpdb->get_var( $query );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			} else {
				$query = "SELECT {$select} FROM {$table}";
				if ( $ali_id ) {
					$query .= " WHERE {$table}.ali_id=%s";
					if ( $limit ) {
						$query .= " LIMIT {$offset},{$limit}";
					}
					$query = $wpdb->prepare( $query, $ali_id );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				} else if ( $limit ) {
					$query .= " LIMIT {$offset},{$limit}";
				}

				return $wpdb->get_results( $query, ARRAY_A );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
			}
		}
	}
}