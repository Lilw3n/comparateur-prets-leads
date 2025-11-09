<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Store failed images so that we can manually handle them
 */
if ( ! class_exists( 'TMDSPRO_Error_Images_Table' ) ) {
	class TMDSPRO_Error_Images_Table{
		protected static $table = 'tmds_error_product_images';
		public static function create_table() {
			global $wpdb;
			$table = $wpdb->prefix. self::$table;

			$query = $wpdb->prepare("CREATE TABLE IF NOT EXISTS %i (
                             `id` bigint(20) NOT NULL AUTO_INCREMENT,
                             `product_id` bigint(20) NOT NULL,
                             `product_ids` longtext NOT NULL,
                             `image_src` longtext NOT NULL,
                             `set_gallery` tinyint(1) NOT NULL,
                             PRIMARY KEY  (`id`)
                             )",[$table]);
			$wpdb->query( $query );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		}
		public static function insert( $product_id, $product_ids, $image_src, $set_gallery ) {
			global $wpdb;
			$table = $wpdb->prefix.self::$table;

			$wpdb->insert( $table,// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
				[
					'product_id'  => $product_id,
					'product_ids' => $product_ids,
					'image_src'   => $image_src,
					'set_gallery' => $set_gallery,
				],
				[ '%d', '%s', '%s', '%d' ]
			);

			return $wpdb->insert_id;
		}

		public static function delete( $id ) {
			global $wpdb;
			$table = $wpdb->prefix.self::$table;

			$delete = $wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

			return $delete;
		}

		public static function get_row( $id ) {
			global $wpdb;
			$table = $wpdb->prefix.self::$table;

			$query = "SELECT * FROM %i WHERE id=%s LIMIT 1";

			return $wpdb->get_row( $wpdb->prepare( $query, [$table,$id] ), ARRAY_A );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		}

		public static function get_rows( $limit = 0, $offset = 0, $count = false, $product_id = '' ) {
			global $wpdb;
			$table = $wpdb->prefix.self::$table;
			$query = $wpdb->prepare( "SELECT * FROM %i", [$table] );
			if ( $count ) {
				$query = $wpdb->prepare( "SELECT count(*) FROM %i", [$table] );
				if ( $product_id ) {
					$query .= $wpdb->prepare(" WHERE %i.product_id=%s", [$table,$product_id]);
				}
				return $wpdb->get_var( $query );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			} else {
				if ( $product_id ) {
					$query .= $wpdb->prepare(" WHERE %i.product_id=%s", [$table,$product_id]);
				}
				if ( $limit ) {
					$query .= $wpdb->prepare(" LIMIT %d,%d",[$offset,$limit]);
				}
				return $wpdb->get_results( $query, ARRAY_A );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			}
		}

		public static function get_products_ids( $search = '', $limit = 50 ) {
			global $wpdb;
			$table = $wpdb->prefix. self::$table;

			if ( $search ) {
				$query = $wpdb->prepare( "SELECT distinct product_id FROM %i left join %i on %i.product_id=%i.ID where %i.post_title like %s LIMIT 0, %d",
					[$table,$wpdb->posts,$table,$wpdb->posts,$wpdb->posts, '%' . $wpdb->esc_like( $search ) . '%' , $limit] );
			} else {
				$query = $wpdb->prepare("SELECT distinct product_id FROM %i",[$table]);
			}

			return $wpdb->get_col( $query, 0 );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		}
	}
}