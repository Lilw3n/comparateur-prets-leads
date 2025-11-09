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
if ( ! function_exists( 'villatheme_include_folder' ) ) {
	function villatheme_include_folder( $path, $prefix = '', $ext = array( 'php' ) ) {

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
									new $class();
								}
							}
						}
					}
				}
			}
		}
	}
}

if ( ! function_exists( 'villatheme_json_decode' ) ) {
	function villatheme_json_decode( $json, $assoc = true, $depth = 512, $options = 2 ) {
		if ( function_exists( 'mb_convert_encoding' ) ) {
			$json = mb_convert_encoding( $json, 'UTF-8', 'UTF-8' );
		}
		if ( ! is_string( $json ) ) {
			return $json;
		}

		return json_decode( $json, $assoc, $depth, $options );
	}
}
if ( ! function_exists( 'villatheme_json_encode' ) ) {
	function villatheme_json_encode( $value, $options = 256, $depth = 512 ) {
		return wp_json_encode( $value, $options, $depth );
	}
}
if ( ! function_exists( 'villatheme_sanitize_fields' ) ) {
	function villatheme_sanitize_fields( $data ) {
		if ( is_array( $data ) ) {
			return array_map( 'villatheme_sanitize_fields', $data );
		} else {
			return is_scalar( $data ) ? sanitize_text_field( wp_unslash( $data ) ) : $data;
		}
	}
}
if ( ! function_exists( 'villatheme_sanitize_kses' ) ) {
	function villatheme_sanitize_kses( $data ) {
		if ( is_array( $data ) ) {
			return array_map( 'villatheme_sanitize_kses', $data );
		} else {
			return is_scalar( $data ) ? wp_kses_post( wp_unslash( $data ) ) : $data;
		}
	}
}
if ( ! function_exists( 'vifewc_sanitize_customizer' ) ) {
	function vifewc_sanitize_customizer( $data ) {
		$data = villatheme_json_decode( wp_unslash( $data ) );

		return villatheme_sanitize_kses( $data );
	}
}