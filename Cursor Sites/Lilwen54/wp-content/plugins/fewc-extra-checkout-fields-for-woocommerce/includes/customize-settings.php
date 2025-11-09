<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! class_exists( 'WP_Customize_Control' ) ) {
	require_once( ABSPATH . WPINC . '/class-wp-customize-setting.php' );
}
if ( class_exists( 'WP_Customize_Setting' ) ) {
	if ( ! class_exists( 'VIFEWC_Customize_Setting' ) ) {
		class VIFEWC_Customize_Setting extends WP_Customize_Setting {
			public function value() {
				$id_base    = $this->id_data['base'];
				$root_value = self::$aggregated_multidimensionals[ $this->type ][ $id_base ]['root_value'];
				$value      = $this->multidimensional_get( $root_value, $this->id_data['keys'], $this->default );
				if ( is_array( $value ) ) {
					$value = villatheme_json_encode( $value );
				}
				// Ensure that the post value is used if the setting is previewed, since preview filters aren't applying on cached $root_value.
				if ( $this->is_previewed ) {
					$value = $this->post_value( $value );
				}

				return $value;
			}
		}
	}
}