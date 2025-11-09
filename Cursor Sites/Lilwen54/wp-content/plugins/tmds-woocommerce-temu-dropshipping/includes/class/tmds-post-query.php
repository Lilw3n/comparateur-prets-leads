<?php
defined( 'ABSPATH' ) || exit;
class TMDSPRO_Post_Query extends WP_Query {
	public function get_posts() {
		global $wpdb;
		add_filter( 'posts_join', [$this,'custom_posts_join'], 10, 2 );
		$wp_posts = $wpdb->posts;
		$wp_postmeta = $wpdb->postmeta;
		$wpdb->posts = $wpdb->tmds_posts;
		$wpdb->postmeta = $wpdb->tmds_postmeta;
		$posts = parent::get_posts();
		$wpdb->posts = $wp_posts;
		$wpdb->postmeta = $wp_postmeta;
		remove_filter('posts_join', [$this,'custom_posts_join']);
		return $posts;
	}
	public function custom_posts_join($join, $query){
		if ( !empty( $query->query_vars['tmds_query'] ) ) {
			$join = str_replace('tmds_postmeta.post_id','tmds_postmeta.tmds_post_id', $join);
		}
		return $join;
	}
}