<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Function include all files in folder
 *
 * @param $path   Directory address
 * @param $ext    array file extension what will include
 * @param $prefix string Class prefix
 */
if ( ! function_exists( 'vi_include_folder' ) ) {
	function vi_include_folder( $path, $prefix = '', $ext = array( 'php' ) ) {

		/*Include all files in payment folder*/
		if ( ! is_array( $ext ) ) {
			$ext = explode( ',', $ext );
			$ext = array_map( 'trim', $ext );
		}
		$sfiles = scandir( $path );
		foreach ( $sfiles as $sfile ) {
			if ( $sfile != '.' && $sfile != '..' ) {
				if ( is_file( $path . "/" . $sfile ) ) {
					$ext_file  = pathinfo( $path . "/" . $sfile );
					$file_name = $ext_file['filename'];
					if ( $ext_file['extension'] ) {
						if ( in_array( $ext_file['extension'], $ext ) ) {
							$class = preg_replace( '/\W/i', '_', $prefix . ucfirst( $file_name ) );

							if ( ! class_exists( $class ) ) {
								require_once $path . $sfile;
								if ( class_exists( $class ) ) {
									new $class;
								}
							}
						}
					}
				}
			}
		}
	}
}

if ( ! function_exists( 'vi_wad_set_catalog_visibility' ) ) {
	function vi_wad_set_catalog_visibility( $product_id, $catalog_visibility ) {
		$terms = array();
		switch ( $catalog_visibility ) {
			case 'hidden':
				$terms[] = 'exclude-from-search';
				$terms[] = 'exclude-from-catalog';
				break;
			case 'catalog':
				$terms[] = 'exclude-from-search';
				break;
			case 'search':
				$terms[] = 'exclude-from-catalog';
				break;
		}
		if ( !empty( $terms ) && ! is_wp_error( wp_set_post_terms( $product_id, $terms, 'product_visibility', false ) ) ) {
			delete_transient( 'wc_featured_products' );
			do_action( 'woocommerce_product_set_visibility', $product_id, $catalog_visibility );
		}
	}
}

if ( ! function_exists( 'vi_wad_upload_image' ) ) {
	function vi_wad_upload_image( $url, $post_parent = 0, $exclude = array(), $post_title = '', $desc = null ) {
		$url = str_replace( ' ', '', $url );
		preg_match( '/[^\?]+\.(jpg|JPG|jpeg|JPEG|jpe|JPE|gif|GIF|png|PNG|webp|WEBP)/', $url, $matches );
		$file_array = [];
		if ( is_array( $matches ) && !empty( $matches ) ) {
			if ( ! in_array( strtolower( $matches[1] ), $exclude ) ) {
				add_filter( 'big_image_size_threshold', '__return_false' );
				//add product image:
				if ( ! function_exists( 'media_handle_upload' ) ) {
					require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
					require_once( ABSPATH . "wp-admin" . '/includes/file.php' );
					require_once( ABSPATH . "wp-admin" . '/includes/media.php' );
				}
				// Download file to temp location
				$tmp                    = download_url( $url );
				$img_name = trim(parse_url($url)['path']??'','/');// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url
				if ($img_name){
					$img_name = str_replace('/','-',$img_name);
					$img_name = substr($img_name,0,strpos($img_name,$matches[1]));
				}
				if (!$img_name){
					$img_name = basename( $matches[0] );
					$img_name = substr($img_name,0,strpos($img_name,$matches[1])).time();
				}
				$file_array['name']     = apply_filters( 'vi_wad_image_file_name', $img_name.$matches[1], $post_parent, $post_title,$matches );
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
					@wp_delete_file( $file_array['tmp_name'] );
				}

				return $thumbid;
			} else {
				return new WP_Error( 'vi_wad_file_type_not_permitted', esc_html__( 'File type is not permitted', 'woocommerce-alidropship' ) );
			}
		} else {
			return new WP_Error( 'vi_wad_file_type_not_permitted', esc_html__( 'Can not detect file type', 'woocommerce-alidropship' ) );
		}
	}
}

if ( ! function_exists( 'woocommerce_version_check' ) ) {
	function woocommerce_version_check( $version = '3.0' ) {
		global $woocommerce;

		if ( version_compare( $woocommerce->version, $version, ">=" ) ) {
			return true;
		}

		return false;
	}
}
if ( ! function_exists( 'vi_wad_json_decode' ) ) {
	function vi_wad_json_decode( $json, $assoc = true, $depth = 512, $options = 2 ) {
		if (is_array($json)){
			return $json;
		}
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$json = mb_convert_encoding( $json, 'UTF-8', 'UTF-8' );
		}

		return json_decode( $json, $assoc, $depth, $options );
	}
}
if ( ! function_exists( 'vi_wad_set_time_limit' ) ) {
	function vi_wad_set_time_limit() {
		ini_set( 'max_execution_time', '3000' );
		ini_set( 'max_input_time', '3000' );
		ini_set( 'default_socket_timeout', '3000' );
		@set_time_limit( 0 );
	}
}
if ( ! function_exists( 'vi_wad_remove_filter' ) ) {
	/**
	 * Remove an anonymous object filter.
	 *
	 * @param string $tag Hook name.
	 * @param string $class Class name
	 * @param string $method Method name
	 *
	 * @return void
	 */
	function vi_wad_remove_filter( $tag, $class, $method ) {
		$filters = $GLOBALS['wp_filter'][ $tag ];

		if ( empty ( $filters ) ) {
			return;
		}

		foreach ( $filters as $priority => $filter ) {
			foreach ( $filter as $identifier => $function ) {
				if ( is_array( $function ) && is_array( $function['function'] ) && is_a( $function['function'][0], $class ) && $method === $function['function'][1] ) {
					remove_filter(
						$tag,
						array( $function['function'][0], $method ),
						$priority
					);
				}
			}
		}
	}
}
if ( ! function_exists( 'viwad_prepare_url' ) ) {
	function viwad_prepare_url($url, $type = 'img'){
		if (is_array($url)){
			$url = array_unique($url);
			$result = [];
			foreach ($url as $k => $item){
				$result[$k] = viwad_prepare_url($item, $type);
			}
			return $result;
		}
		$result = 'https' !== substr( $url, 0, 5 ) ? set_url_scheme( $url, 'https' ) : $url;
		$check = strpos($result,'?');
		if ($check){
			$result = substr( $url, 0, $check );
		}
		return $result;
	}
}
if ( ! function_exists( 'viwad_prepare_tag_data' ) ) {
	function viwad_prepare_tag_data($data){
		if (!is_array($data)){
			return $data;
		}
		$data_json = wp_json_encode( $data );
		$result = function_exists( 'wc_esc_json' ) ? wc_esc_json( $data_json ) : _wp_specialchars( $data_json, ENT_QUOTES, 'UTF-8', true );
		return $result;
	}
}
