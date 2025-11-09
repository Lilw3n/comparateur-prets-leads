<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_File {
	protected static $instance = null;
	public static function get_instance( $new = false ) {
		if ( $new || null === self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * @param $image_id
	 * @param bool $count
	 * @param bool $multiple
	 *
	 * @return array|bool|object|string|null
	 */
	public static function get_id_by_image_id( $image_id, $count = false, $multiple = false ) {
		if ( $image_id ) {
			$args     = [
				'post_type'      => 'attachment',
				'order'          => 'DESC',
				'fields'         => 'ids',
				'post_status'    => 'any',
				'posts_per_page' => $count || $multiple ? - 1 : 1,
				'meta_query'     => [// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'relation' => 'and',
					[
						'key'     => '_' . TMDSPRO_DATA::$prefix . '_image_id',
						'compare' => '=',
						'value'   => $image_id,
					]
				],
			];
			$post_ids = get_posts( $args );
			if ( $count ) {
				return count( $post_ids );
			} else {
				return $multiple ? $post_ids : ( $post_ids[0] ?? '' );
			}
		} else {
			return false;
		}
	}

	public static function upload_image( $url, $post_parent = 0, $exclude = array(), $post_title = '', $desc = null ) {
		preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG|webp|WEBP)/', $url, $matches );
		if ( is_array( $matches ) && count( $matches ) ) {
			if ( ! in_array( TMDSPRO_DATA::strtolower( $matches[1] ), $exclude ) ) {
				add_filter( 'big_image_size_threshold', '__return_false' );
				//add product image:
				if ( ! function_exists( 'media_handle_upload' ) ) {
					require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
					require_once( ABSPATH . "wp-admin" . '/includes/file.php' );
					require_once( ABSPATH . "wp-admin" . '/includes/media.php' );
				}
				// Download file to temp location
				$tmp      = download_url( $url );
				$img_name = trim( wp_parse_url( $url )['path'] ?? '', '/' );
				if ( $img_name ) {
					$img_name = str_replace( '/', '-', $img_name );
					$img_name = substr( $img_name, 0, strpos( $img_name, $matches[1] ) );
				}
				if ( ! $img_name ) {
					$img_name = basename( $matches[0] );
					$img_name = substr( $img_name, 0, strpos( $img_name, $matches[1] ) ) . time();
				}
				$file_array['name']     = apply_filters( 'tmds_upload_image_file_name', $img_name . $matches[1], $post_parent, $post_title );
				$file_array['tmp_name'] = $tmp;

				// If error storing temporarily, unlink
				if ( is_wp_error( $tmp ) ) {
					return $tmp;
				}
				$args = array();
				if ( $post_parent ) {
					$args['post_parent'] = $post_parent;
				}
				if ( $post_title ) {
					$args['post_title'] = $post_title;
				}
				//use media_handle_sideload to upload img:
				$thumbid = media_handle_sideload( $file_array, '', $desc, $args );
				// If error storing permanently, unlink
				if ( is_wp_error( $thumbid ) ) {
					@unlink( $file_array['tmp_name'] );// @codingStandardsIgnoreLine.
				}

				return $thumbid;
			} else {
				return new WP_Error( 'tmds_file_type_not_permitted', esc_html__( 'File type is not permitted', 'tmds-woocommerce-temu-dropshipping' ) );
			}
		} else {
			return new WP_Error( 'tmds_file_type_not_permitted', esc_html__( 'Can not detect file type', 'tmds-woocommerce-temu-dropshipping' ) );
		}
	}

	public static function download_image( &$image_id, $url, $post_parent = 0, $exclude = array(), $post_title = '', $desc = null ) {
		$settings = TMDSPRO_DATA::get_instance();
		$exmage = TMDSPRO_Admin_Settings::exmage_active();
		if ( $settings->get_params( 'use_external_image' ) && $exmage) {
			$external_image = $exmage === 'EXMAGE_WP_IMAGE_LINKS' ? EXMAGE_WP_IMAGE_LINKS::add_image( $url, $image_id, $post_parent ):( new EXMAGE\Admin\EXMAGEAdmin )->add_media( $url, '', $image_id, $post_parent );;
			$thumb_id       = $external_image['id'] ? $external_image['id'] : new \WP_Error( 'exmage_image_error', $external_image['message'] );
		} else {
			$new_url   = $url;
			$parse_url = wp_parse_url( $new_url );
			$scheme    = empty( $parse_url['scheme'] ) ? 'http' : $parse_url['scheme'];
			$image_id  = "{$parse_url['host']}{$parse_url['path']}";
			$new_url   = "{$scheme}://{$image_id}";

			preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG)/', $new_url, $matches );
			if ( ! is_array( $matches ) || ! count( $matches ) ) {
				preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG)/', $url, $matches );
				if ( is_array( $matches ) && count( $matches ) ) {
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
				$thumb_id = self::upload_image( $new_url, $post_parent, $exclude, $post_title, $desc );
				if ( ! is_wp_error( $thumb_id ) ) {
					update_post_meta( $thumb_id, '_' . TMDSPRO_DATA::$prefix . '_image_id', $image_id );
				}
			} elseif ( $post_parent ) {
				global $wpdb;
				$wpdb->query( $wpdb->prepare( "UPDATE %i set post_parent=%s WHERE ID=%s AND post_parent = 0 LIMIT 1", [// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
					$wpdb->posts,
					$post_parent,
					$thumb_id
				] ) );
			}
		}

		return $thumb_id;
	}
}