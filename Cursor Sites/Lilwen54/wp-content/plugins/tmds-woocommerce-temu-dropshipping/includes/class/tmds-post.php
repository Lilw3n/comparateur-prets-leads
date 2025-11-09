<?php
defined( 'ABSPATH' ) || exit;

final class TMDSPRO_Post {

	public $ID;

	public $post_author = 0;

	public $post_date = '0000-00-00 00:00:00';

	public $post_date_gmt = '0000-00-00 00:00:00';

	public $post_content = '';

	public $post_title = '';

	public $post_excerpt = '';

	public $post_status = 'publish';

	public $post_name = '';

	public $post_modified = '0000-00-00 00:00:00';

	public $post_modified_gmt = '0000-00-00 00:00:00';

	public $post_parent = 0;

	public $post_type = 'tmds_draft_product';

	public $filter;

	public function __construct( $post ) {
		foreach ( get_object_vars( $post ) as $key => $value ) {
			$this->$key = $value;
		}
	}

	public static function get_the_title( $post = 0 ) {
			$post       = self::get_post( $post );
			$post_title = isset( $post->post_title ) ? $post->post_title : '';
			$post_id    = isset( $post->ID ) ? $post->ID : 0;
			$title      = apply_filters( 'the_title', $post_title, $post_id );

		return $title;
	}

	public static function update_post_meta( $post_id, $meta_key, $meta_value, $prev_value = '' ) {
		return TMDSPRO_Products_Table::update_post_meta( $post_id, $meta_key, $meta_value, $prev_value ) ;
	}

	public static function get_post_meta( $post_id, $key = '', $single = false ) {
		return TMDSPRO_Products_Table::get_post_meta( $post_id, $key, $single ) ;
	}

	public static function delete_post( $postid = 0, $force_delete = false ) {
		return TMDSPRO_Products_Table::delete_post( $postid, $force_delete );
	}

	public static function trash_post( $post_id = 0 ) {
		return TMDSPRO_Products_Table::trash_post( $post_id );
	}

	public static function update_post( $postarr = array(), $wp_error = false, $fire_after_hooks = true ) {
		return TMDSPRO_Products_Table::update_post( $postarr, $wp_error, $fire_after_hooks );
	}

	public static function get_post( $post = null, $output = OBJECT, $filter = 'raw' ) {
		return TMDSPRO_Products_Table::get_post( $post, $output, $filter );
	}

	public static function insert_post( $postarr, $wp_error = false, $fire_after_hooks = true ) {
		return TMDSPRO_Products_Table::insert_post( $postarr, $wp_error, $fire_after_hooks );
	}

	public static function count_posts( $type = 'tmds_draft_product', $perm = '' ) {
		return TMDSPRO_Products_Table::count_posts( $type, $perm );
	}

	public static function publish_post( $post ) {
		TMDSPRO_Products_Table::publish_post( $post );
	}
	public static function strip_invalid_text( $table, $field, $text ) {
		return TMDSPRO_Products_Table::strip_invalid_text( $table, $field, $text );
	}

	public static function get_post_id_by_woo_id( $product_id ,$status = ['publish', 'draft', 'override','trash'], $multi = false) {
		$prefix = TMDSPRO_DATA::$prefix ;
		$args    = array(
			'tmds_query'          => 1,
			'post_type'      => $prefix . '_draft_product',
			'order'          => 'DESC',
			'fields'         => 'ids',
			'post_status'          => $status,
			'posts_per_page' => 1,
			'meta_query' => [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'and',
				[
					'key'     => '_' . $prefix . '_woo_id',
					'compare' => '=',
					'value' => $product_id,
				]
			],
		);
		$the_query   = TMDSPRO_Post::query( $args );
		$ids = $the_query->get_posts();
		wp_reset_postdata();
		$id = intval( $ids[0] ?? '');
		return $id;
	}
	public static function get_post_id_by_temu_id( $sku ,$status = ['publish', 'draft', 'override','trash'], $multi = false) {
		$prefix = TMDSPRO_DATA::$prefix ;
		$args    = array(
			'tmds_query'          => 1,
			'post_type'      => $prefix . '_draft_product',
			'order'          => 'DESC',
			'fields'         => 'ids',
			'posts_per_page' => $multi ? -1 :  1,
			'post_status'          => $status,
			'meta_query' => [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'and',
				[
					'key'     => '_' . $prefix . '_sku',
					'compare' => '=',
					'value' => $sku,
				]
			],
		);
		$the_query   = TMDSPRO_Post::query( $args );
		$post_ids = $the_query->get_posts();
		wp_reset_postdata();
		if ($multi){
			return $post_ids;
		}else{
			return $post_ids[0] ?? '';
		}
	}
	public static function get_overriding_product( $id ) {
		global $wpdb;
		if ( $id ) {
			$prefix = TMDSPRO_DATA::$prefix ;
			$table_posts = self::get_table_name();
			$query       = "SELECT ID from {$table_posts} where {$table_posts}.post_type = '{$prefix}_draft_product' and {$table_posts}.post_status = 'override' and {$table_posts}.post_parent = %s LIMIT 1";
			return $wpdb->get_var( $wpdb->prepare( $query, $id ), 0 );//phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery , WordPress.DB.DirectDatabaseQuery.NoCaching , WordPress.DB.PreparedSQL.NotPrepared
		} else {
			return false;
		}
	}

	public static function empty_import_list( $status = 'draft' ) {
		global $wpdb;
		$table_posts    = self::get_table_name();
		$table_postmeta = self::get_table_name( true );
		$daft_id        = $wpdb->get_col($wpdb->prepare( "SELECT ID from %i where %i.post_type = 'tmds_draft_product' and %i.post_status=%s",[$table_posts,$table_posts,$table_posts,$status] ));// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		if ( empty( $daft_id ) ) {
			return;
		}
		$daft_id_query =  implode( ', ', array_fill( 0, count( $daft_id ), '%s' ) );
		$query_delete_post =  "DELETE from %i WHERE %i.ID IN ({$daft_id_query})";
		$query_delete_postmeta =  "DELETE from %i WHERE %i.tmds_post_id IN ({$daft_id_query})";
		$wpdb->query($wpdb->prepare($query_delete_post,array_merge([$table_posts,$table_posts],$daft_id)));// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->query( $wpdb->prepare($query_delete_postmeta,array_merge([$table_postmeta,$table_postmeta],$daft_id)));// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	}

	public static function get_table_name( $is_meta = false ) {
		global $wpdb;
		return $is_meta ? $wpdb->tmds_postmeta : $wpdb->tmds_posts;
	}

	public static function query( $args ) {
		return new TMDSPRO_Post_Query( $args );
	}

	public static function get_instance( $post_id ) {
		global $wpdb;
		$post_id = (int) $post_id;
		if ( ! $post_id ) {
			return false;
		}
		$_post = wp_cache_get( $post_id, 'tmds_posts' );
		if ( ! $_post ) {
			$_post = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM %i WHERE ID = %d LIMIT 1", [$wpdb->tmds_posts,$post_id ]) );// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
			if ( ! $_post ) {
				return false;
			}
			$_post = sanitize_post( $_post, 'raw' );
			wp_cache_add( $_post->ID, $_post, 'tmds_posts' );
		} elseif ( empty( $_post->filter ) || 'raw' !== $_post->filter ) {
			$_post = sanitize_post( $_post, 'raw' );
		}

		return new WP_Post( $_post );
	}

	public function __isset( $key ) {
		if ( in_array( $key, [ 'tags_input', 'post_category', 'page_template', 'ancestors' ] ) ) {
			return true;
		}

		return metadata_exists( 'post', $this->ID, $key );
	}

	public function __get( $key ) {
		if ( 'page_template' === $key && $this->__isset( $key ) ) {
			return get_post_meta( $this->ID, '_wp_page_template', true );
		}

		if ( 'post_category' === $key ) {
			if ( is_object_in_taxonomy( $this->post_type, 'category' ) ) {
				$terms = get_the_terms( $this, 'category' );
			}

			if ( empty( $terms ) ) {
				return array();
			}

			return wp_list_pluck( $terms, 'term_id' );
		}

		if ( 'tags_input' === $key ) {
			if ( is_object_in_taxonomy( $this->post_type, 'post_tag' ) ) {
				$terms = get_the_terms( $this, 'post_tag' );
			}

			if ( empty( $terms ) ) {
				return array();
			}

			return wp_list_pluck( $terms, 'name' );
		}

		// Rest of the values need filtering.
		if ( 'ancestors' === $key ) {
			$value = get_post_ancestors( $this );
		} else {
			$value = get_post_meta( $this->ID, $key, true );
		}

		if ( $this->filter ) {
			$value = sanitize_post_field( $key, $value, $this->ID, $this->filter );
		}

		return $value;
	}

	public function filter( $filter ) {
		if ( $this->filter === $filter ) {
			return $this;
		}

		if ( 'raw' === $filter ) {
			return self::get_instance( $this->ID );
		}

		return sanitize_post( $this, $filter );
	}

	public function to_array() {
		$post = get_object_vars( $this );

		foreach ( array( 'ancestors', 'page_template', 'post_category', 'tags_input' ) as $key ) {
			if ( $this->__isset( $key ) ) {
				$post[ $key ] = $this->__get( $key );
			}
		}

		return $post;
	}

	/**
	 * Adds any posts from the given IDs to the cache that do not already exist in cache.
	 *
	 * @param int[] $ids ID list.
	 * @param bool $update_meta_cache Optional. Whether to update the meta cache. Default true.
	 *
	 * @global wpdb $wpdb WordPress database abstraction object.
	 *
	 */
	public static function _prime_post_caches( $ids, $update_meta_cache = true ) {
		global $wpdb;

		$non_cached_ids = _get_non_cached_ids( $ids, 'tmds_posts' );
		if ( ! empty( $non_cached_ids ) ) {
			$id_query =  implode( ', ', array_fill( 0, count( $non_cached_ids ), '%s' ) );
			$query =  "SELECT %i.* FROM %i WHERE ID IN ({$id_query})";
			$fresh_posts = $wpdb->get_results( $wpdb->prepare($query, array_merge([$wpdb->tmds_posts,$wpdb->tmds_posts],$non_cached_ids)) );// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

			if ( $fresh_posts ) {
				// Despite the name, update_post_cache() expects an array rather than a single post.
				self::update_post_cache( $fresh_posts );
			}
		}

		if ( $update_meta_cache ) {
			update_meta_cache( 'tmds_posts', $ids );
		}
	}

	/**
	 * Updates posts in cache.
	 *
	 * @param WP_Post[] $posts Array of post objects (passed by reference).
	 */
	public static function update_post_cache( &$posts ) {
		if ( ! $posts ) {
			return;
		}

		$data = array();
		foreach ( $posts as $post ) {
			if ( empty( $post->filter ) || 'raw' !== $post->filter ) {
				$post = sanitize_post( $post, 'raw' );
			}
			$data[ $post->ID ] = $post;
		}
		wp_cache_add_multiple( $data, 'tmds_posts' );
	}

	/**
	 * Updates post, term, and metadata caches for a list of post objects.
	 *
	 * @param WP_Post[] $posts Array of post objects (passed by reference).
	 * @param string $post_type Optional. Post type. Default 'tmds_draft_product'.
	 * @param bool $update_meta_cache Optional. Whether to update the meta cache. Default true.
	 */
	public static function update_post_caches( &$posts, $update_meta_cache = true ) {
		// No point in doing all this work if we didn't match any posts.
		if ( ! $posts ) {
			return;
		}
		self::update_post_cache( $posts );
		$post_ids = array();
		foreach ( $posts as $post ) {
			$post_ids[] = $post->ID;
		}
		if ( $update_meta_cache ) {
			update_meta_cache( 'tmds_posts', $post_ids );
		}
	}

	/**
	 * Will clean the post in the cache.
	 *
	 * Cleaning means delete from the cache of the post. Will call to clean the term
	 * object cache associated with the post ID.
	 *
	 * This function not run if $_wp_suspend_cache_invalidation is not empty. See
	 * wp_suspend_cache_invalidation().
	 *
	 *
	 * @param int|WP_Post $post Post ID or post object to remove from the cache.
	 *
	 * @global bool $_wp_suspend_cache_invalidation
	 *
	 */
	public static function clean_post_cache( $post ) {
		global $_wp_suspend_cache_invalidation;

		if ( ! empty( $_wp_suspend_cache_invalidation ) ) {
			return;
		}

		$post = self::get_post( $post );

		if ( ! $post ) {
			return;
		}

		wp_cache_delete( $post->ID, 'tmds_posts' );
		wp_cache_delete( $post->ID, 'tmds_post_meta' );

		/**
		 * Fires immediately after the given post's cache is cleaned.
		 *
		 * @param int $post_id Post ID.
		 * @param WP_Post $post Post object.
		 */
		do_action( 'clean_post_cache', $post->ID, $post );
		wp_cache_set( 'last_changed', microtime(), 'tmds_posts' );
	}
}