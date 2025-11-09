<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

class VIFEWC_Frontend_Frontend {
	public static $settings, $cache = array();

	public function __construct() {
		self::$settings = VIFEWC_DATA::get_instance();
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'vifewc_wp_enqueue_scripts' ) );
	}
	public function init(){
		//change address field on js
		add_filter( 'woocommerce_get_country_locale', array( __CLASS__, 'vifewc_woocommerce_get_countries_locale' ), PHP_INT_MAX, 1 );
		foreach ( array( 'woocommerce_get_country_locale_base', 'woocommerce_get_country_locale_default' ) as $hook ) {
			add_filter( $hook, array( __CLASS__, 'vifewc_woocommerce_get_country_locale' ), PHP_INT_MAX, 1 );
		}
		//display checkout field & section
		foreach ( array( 'billing', 'shipping' ) as $id ) {
			$function = "woocommerce_{$id}_fields";
			add_filter( $function, array( __CLASS__, 'vifewc_' . $function ), PHP_INT_MAX, 2 );
		}
		$section_id = self::get_params( 'section_id' );
		foreach ( $section_id as $id ) {
			if ( in_array( $id, array( 'billing', 'shipping' ) ) ) {
				continue;
			}
			add_filter( "woocommerce_{$id}_fields", array( __CLASS__, 'vifewc_woocommerce_get_fields' ), PHP_INT_MAX, 2 );
		}
		add_action( 'woocommerce_checkout_fields', array( $this, 'vifewc_woocommerce_checkout_fields' ), PHP_INT_MAX, 1 );
		add_filter( "woocommerce_cart_needs_shipping_address", array( __CLASS__, "cart_needs_shipping_address" ), PHP_INT_MAX,1 );
		add_filter( "woocommerce_enable_order_notes_field", array( __CLASS__, "enable_order_notes_field" ), PHP_INT_MAX,1 );
		$section_position = self::$settings->section_positions() ;
		foreach ( $section_position as $hook => $name ) {
			add_action( $hook, array( __CLASS__, 'custom_section_html' ) );
		}
		add_filter( "woocommerce_form_field", array( __CLASS__, "get_field_html" ), PHP_INT_MAX, 4 );
		//custom validation logic when saving user address
		add_action( 'woocommerce_edit_account_form', array( __CLASS__, 'vifewc_woocommerce_edit_account_form' ) );
		add_action( 'woocommerce_save_account_details_errors', array( __CLASS__, 'save_account_details_errors' ), 10, 2 );
		add_action( 'woocommerce_after_save_address_validation', array( __CLASS__, 'save_address_validation' ), PHP_INT_MAX, 4 );
		//Validates the posted checkout data based on field properties
		add_action( 'woocommerce_after_checkout_validation', array( __CLASS__, 'checkout_validation' ), PHP_INT_MAX, 2 );
		//display custom fields on order details
		add_action( 'woocommerce_after_order_details', array( $this, 'vifewc_woocommerce_after_order_details' ), 10, 1 );
	}

	public function vifewc_woocommerce_after_order_details( $order ) {
		if ( ! self::enable() || ! $order ) {
			return;
		}
		$section_settings = self::get_params( 'section_settings' );
		$checkout         = WC()->checkout();
		$order_detail     = is_account_page();
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! $section_id || empty( $section_setting )
			     || ( $section_id === 'shipping' && ( wc_ship_to_billing_address_only() || ! $order->needs_shipping_address() ) )
			     || ! apply_filters( "vifewc_enable_section", true, $section_id, $section_setting )
			) {
				continue;
			}
			$fields      = $checkout->get_checkout_fields( $section_id );
			$meta_fields = array();
			if ( is_array( $fields ) ) {
				foreach ( $fields as $key => $field ) {
					if ( ( $field['type'] ?? '' ) === 'html' ) {
						continue;
					}
					$display_in = $field['display_in'] ?? array();
					if ( ! is_array( $display_in ) || empty( $display_in )
					     || ( $order_detail && ! in_array( 'order_page', $display_in ) )
					     || ( ! $order_detail && ! in_array( 'thank_you_page', $display_in ) )
					) {
						continue;
					}
					$save_as = $field['save_as'] ?? array();
					if ( ! is_array( $save_as ) || empty( $save_as ) ) {
						continue;
					}
					$meta_key = $field['meta_key'] ?? $key;
					$value    = null;
					if ( in_array( 'order_meta', $save_as )  ) {
						$value = $order->get_meta( $meta_key, true );
					}
					if ( ! isset( $value ) && in_array( 'user_meta', $save_as ) ) {
						$customer_id = $customer_id ?? $order->get_customer_id();
						if ( $customer_id && metadata_exists( 'user', $customer_id, $meta_key ) ) {
							$value = get_post_meta( $customer_id, $meta_key, true );
						}
					}
					if ( $value !== null ) {
						if ( is_array( $value ) && ! empty( $field['options'] ) ) {
							$temp = array();
							foreach ( $field['options'] as $k => $v ) {
								if ( in_array( $k, $value ) ) {
									$temp[] = $v;
								}
							}
							if ( ! empty( $temp ) ) {
								$value = implode( ', ', $temp );
							}
						}elseif (! empty( $field['options'][$value] )){
							$value =  $field['options'][$value];
						}
						$meta_fields[ $meta_key ] = array(
							'label' => $field['label'] ?? $meta_key,
							'value' => $value,
						);
					}
				}
			}
			if ( empty( $meta_fields ) ) {
				continue;
			}
			printf( '<section><h2>%s</h2>', wp_kses_post( $section_setting['name'] ?? $section_id ) );
			printf( '<table class="woocommerce-table woocommerce-table--%1s-details shop_table order_details vifewc-fields"><tbody>', esc_attr( $section_id ) );
			do_action( "vifewc_woocommerce_before_{$section_id}_data" );
			foreach ( $meta_fields as $key => $data ) {
				printf( '<tr><td>%1s</td><td>%2s</td></tr>', wp_kses_post( $data['label'] ?? $key ), wp_kses_post( $data['value'] ?? '' ) );
			}
			do_action( "vifewc_woocommerce_after_{$section_id}_data" );
			printf( '</tbody></table></section>' );
		}
	}

	protected static function maybe_skip_fieldset( $section_id, $data ) {
		if ( 'shipping' === $section_id && ( ! $data['ship_to_different_address'] || ! WC()->cart->needs_shipping_address() ) ) {
			return true;
		}

		if ( 'account' === $section_id ) {
			return true;
		}

		return false;
	}

	public static function checkout_validation( $data, $errors ) {
		if ( ! self::enable() ) {
			return;
		}
		$section_fields                     = WC()->checkout()->get_checkout_fields();
		self::$cache['checkout_validation'] = array();
		foreach ( $section_fields as $section_id => $fields ) {
			if ( self::maybe_skip_fieldset( $section_id, $data ) ) {
				continue;
			}
			foreach ( $fields as $key => $field ) {
				if ( !isset( $data[ $key ] ) ) {
					continue;
				}
				$continue = true;
				$field_label = $field['label'] ?? '';
				switch ( $section_id ) {
					case 'shipping':
						if ($key === 'shipping_state'){
							$continue = false;
							break;
						}
						/* translators: %s: field name */
						$field_label = sprintf( esc_html__( 'Shipping %s', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label );
						break;
					case 'billing':
						if ($key ==='billing_state'){
							$continue = false;
							break;
						}
						/* translators: %s: field name */
						$field_label = sprintf( esc_html__( 'Billing %s', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label );
						break;
				}
				if (!$continue){
					continue;
				}
				$new_errors = self::validate_field( $field, $data[ $key ], '<strong>' . $field_label . '</strong>' );
				if ( is_array( $new_errors ) && ! empty( $new_errors ) ) {
					foreach ( $new_errors as $error ) {
						$errors->add( $key . '_validation', $error, array( 'id' => $key ) );
					}
				} else {
					self::$cache['checkout_validation'][ $key ] = $field;
				}
			}
		}
		if ( ! empty( self::$cache['checkout_validation'] ) ) {
			add_action( 'woocommerce_checkout_update_customer', array( __CLASS__, 'checkout_update_customer' ), 10, 2 );
			add_action( 'woocommerce_checkout_create_order', array( __CLASS__, 'checkout_create_order' ), 10, 2 );
		}
	}

	public static function checkout_update_customer( $customer, $data ) {
		if ( ! is_a( $customer, 'WC_Customer' ) || empty( $data ) || ! self::enable() || empty( self::$cache['checkout_validation'] ) ) {
			return;
		}
		$update = false;
		foreach ( self::$cache['checkout_validation'] as $key => $field ) {
			if ( ! isset( $data[ $key ] ) || empty( $field['is_custom'] ) ) {
				continue;
			}
			$save_as = $field['save_as'] ?? array();
			if ( ! is_array( $save_as ) || ! in_array( 'user_meta', $save_as ) ) {
				continue;
			}
			$update = true;
			$customer->delete_meta_data( $key );
			$customer->update_meta_data( $field['meta_key'] ?? $key, $data[ $key ] );
		}
		if ($update) {
			$customer->save();
		}
	}

	public static function checkout_create_order( $order, $data ) {
		if ( ! is_a( $order, 'WC_Order' ) || empty( $data ) || ! self::enable() || empty( self::$cache['checkout_validation'] ) ) {
			return;
		}
		$update = false;
		foreach ( self::$cache['checkout_validation'] as $key => $field ) {
			if ( ! isset( $data[ $key ] ) || empty( $field['is_custom'] ) ) {
				continue;
			}
			$key = $field['meta_key'] ?? $key;
			if (!$key){
				continue;
			}
			$save_as = $field['save_as'] ?? array();
			if ( ! is_array( $save_as ) || ! in_array( 'order_meta', $save_as ) ) {
				continue;
			}
			$update = true;
			$order->delete_meta_data(  '_'.$key );
			$order->update_meta_data( $field['meta_key'] ?? $key, $data[ $key ] );
		}
		if ($update) {
			$order->save();
		}
		unset( self::$cache['checkout_validation'] );
	}

	public static function save_address_validation( $user_id, $load_address, $address, $customer ) {
		if ( ! self::enable() || ! $user_id || ! $load_address || ! $customer || empty( $address ) ) {
			return;
		}

		$nonce_value = wc_get_var( $_REQUEST['woocommerce-edit-address-nonce'], wc_get_var( $_REQUEST['_wpnonce'], '' ) ); // @codingStandardsIgnoreLine.
		if ( ! empty( $nonce_value ) && ! wp_verify_nonce( $nonce_value, 'woocommerce-edit_address' ) ) {
			return;
		}

		foreach ( $address as $key => $field ) {
			$type = $field['type'] ?? '';
			if ( ! $type ) {
				continue;
			}
			if ( 'checkbox' === $type ) {
				$value = (int) isset( $_POST[ $key ] );
			} else {
				$value = isset( $_POST[ $key ] ) ? wc_clean( wp_unslash( $_POST[ $key ] ) ) : '';
			}
			// Hook to allow modification of value.
			$value = apply_filters( 'woocommerce_process_myaccount_field_' . $key, $value );
			if ( ! empty( $value ) ) {
				$field_label = '<strong>' . $field['label'] . '</strong>';
				$errors      = self::validate_field( $field, $value, $field_label );
				if ( is_array( $errors ) ) {
					foreach ( $errors as $error ) {
						wc_add_notice( $error, 'error' );
					}
				}
			}
		}
	}

	public static function validate_field( $field, $value, $field_label, $required = false ) {
		$errors = array();
		$type   = $field['type'] ?? '';
		if ( ! $type ) {
			return $errors;
		}
		if ( $required && empty( $value ) ) {
			/* translators: %1s: Method name */
			$errors[] = sprintf( esc_html__( '%1s is a required field.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label );
		}
		// Validation and formatting rules.
		if ( ! empty( $field['validate'] ) && is_array( $field['validate'] ) ) {
			foreach ( $field['validate'] as $rule ) {
				switch ( $rule ) {
					case 'number':
						if ( ! is_numeric( $value ) ) {
							/* translators: %1s: Method name */
							$errors[] = sprintf( esc_html__( '%1s is not a valid number.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label );
						}
						break;
					case 'url':
						if ( ! wc_is_valid_url( $value ) ) {
							/* translators: %1s: Method name */
							$errors[] = sprintf( esc_html__( '%1s is not a valid url.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label );
						}
						break;
				}
			}
		}
		switch ( $type ) {
			case 'text':
			case 'textarea':
			case 'password':
				$val_length = strlen( $value );
				$minlength  = intval( $field['minlength'] ?? 0 );
				$maxlength  = intval( $field['maxlength'] ?? 0 );
				if ( $minlength && $val_length < $minlength ) {
					/* translators: 1: field label. 2: minlength */
					$errors[] = sprintf( esc_html__( 'Minimum %1$s length is %2$s.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label, esc_attr( $minlength ) );
				}
				if ( $maxlength && $val_length > $maxlength ) {
					/* translators: 1: field label. 2: maxlength */
					$errors[] = sprintf( esc_html__( 'Maximum %1$s length is %2$s.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label, esc_attr( $maxlength ) );
				}
				break;
			case 'number':
				$value = floatval( $value );
				$min   = floatval( $field['min'] ?? 0 );
				$max   = floatval( $field['max'] ?? 0 );
				if ( $min && $value < $min ) {
					/* translators: 1: field label. 2: minvalue */
					$errors[] = sprintf( esc_html__( '%1$s must be greater than or equal to %2$s.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label,
						esc_attr( $min ) );
				}
				if ( $max && $value > $max ) {
					/* translators: 1: field label. 2: maxvalue */
					$errors[] = sprintf( esc_html__( '%1$s must be less than or equal to %2$s.', 'fewc-extra-checkout-fields-for-woocommerce' ), $field_label, esc_attr( $max ) );
				}
				break;
			case 'datetime-local':
			case 'time':
			case 'date':
			case 'week':
			case 'month':
				$min = $field['min'] ?? '';
				$max = $field['max'] ?? '';
				switch ($type){
					case 'datetime-local':
						$date_format = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
						break;
					case 'time':
						$date_format =  get_option( 'time_format' );
						break;
					case 'week':
						$date_format ='W, Y' ;
						break;
					case 'month':
						$date_format = 'F Y' ;
						break;
					default:
						$date_format = get_option( 'date_format' ) ;
				}
				if ( $min && strtotime( $value ) < strtotime( $min ) ) {
					/* translators: 1: field label. 2: minvalue */
					$errors[] = sprintf( esc_html__( '%1$s must be greater than or equal to %2$s %3$s.', 'fewc-extra-checkout-fields-for-woocommerce' ),
						$field_label,
						$type === 'week' ? esc_attr__(' Week','fewc-extra-checkout-fields-for-woocommerce') : '',
						esc_attr(  date_i18n($date_format, strtotime( $min ) ) ));
				}
				if ( $max && strtotime( $value ) > strtotime( $max ) ) {
					/* translators: 1: field label. 2: maxvalue */
					$errors[] = sprintf( esc_html__( '%1$s must be less than or equal to %2$s %3$s.', 'fewc-extra-checkout-fields-for-woocommerce' ),
						$field_label,
						$type === 'week' ? esc_attr__(' Week','fewc-extra-checkout-fields-for-woocommerce') : '',
						esc_attr( date_i18n($date_format,strtotime( $max )) )  );
				}
				break;
		}

		return $errors;
	}

	public static function save_account_details_errors( $errors, $user ) {
		if ( ! self::enable() ) {
			return;
		}
		$nonce_value = wc_get_var( $_REQUEST['save-account-details-nonce'], wc_get_var( $_REQUEST['_wpnonce'], '' ) ); // @codingStandardsIgnoreLine.

		if ( ! empty( $nonce_value ) && ! wp_verify_nonce( $nonce_value, 'save_account_details' ) ) {
			return;
		}

		$section_settings               = self::get_params( 'section_settings' );
		$checkout                       = WC()->checkout();
		self::$cache['account_details'] = array();
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! $section_id || in_array( $section_id, array( 'billing', 'shipping' ) ) ) {
				continue;
			}
			if ( empty( $section_setting ) || ! apply_filters( "vifewc_enable_section", true, $section_id, $section_setting ) ) {
				continue;
			}
			$fields = $checkout->get_checkout_fields( $section_id );
			if ( is_array( $fields ) ) {
				foreach ( $fields as $key => $field ) {
					if ( empty( $field['is_custom'] ) || ! isset( $_POST[ $key ] ) ) {
						continue;
					}
					$save_as = $field['save_as'] ?? array();
					if ( ! is_array( $save_as ) || ! in_array( 'user_meta', $save_as ) || ! isset( $_POST[ $key ] ) ) {
						continue;
					}
					$field_label = '<strong>' . ( $field['label'] ?? '' ) . '</strong>';
					$new_errors  = self::validate_field( $field, wc_clean( wp_unslash( $_POST[ $key ] ) ), $field_label, true );
					if ( is_array( $new_errors ) && ! empty( $new_errors ) ) {
						foreach ( $new_errors as $k => $error ) {
							$errors->add( $key . '_' . $k . '_validation', $error );
						}
					} else {
						self::$cache['account_details'][ $key ] = wp_kses_post( wp_unslash( $_POST[ $key ] ) );
					}
				}
			}
		}
		if ( ! empty( self::$cache['account_details'] ) ) {
			add_action( 'woocommerce_save_account_details', array( __CLASS__, 'save_account_details' ), 10, 1 );
		}
	}

	public static function save_account_details( $user_id ) {
		if ( ! self::enable() || empty( self::$cache['account_details'] ) ) {
			return;
		}
		foreach ( self::$cache['account_details'] as $key => $data ) {
			update_user_meta( $user_id, $key, $data );
		}
		unset( self::$cache['account_details'] );
	}

	public static function vifewc_woocommerce_edit_account_form() {
		if ( ! self::enable() ) {
			return;
		}
		$section_settings = self::get_params( 'section_settings' );
		$checkout         = WC()->checkout();
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! $section_id || in_array( $section_id, array( 'billing', 'shipping' ) ) ) {
				continue;
			}
			if ( empty( $section_setting ) || ! apply_filters( "vifewc_enable_section", true, $section_id, $section_setting ) ) {
				continue;
			}
			$fields      = $checkout->get_checkout_fields( $section_id );
			$meta_fields = array();
			if ( is_array( $fields ) ) {
				foreach ( $fields as $key => $field ) {
					$save_as = $field['save_as'] ?? array();
					if ( ! is_array( $save_as ) || ! in_array( 'user_meta', $save_as ) ) {
						continue;
					}
					$meta_fields[ $key ] = $field;
				}
			}
			if ( empty( $meta_fields ) ) {
				continue;
			}
			do_action( "woocommerce_before_{$section_id}" );
			printf( '<fieldset><legend>%s</legend>', wp_kses_post( $section_setting['name'] ?? $section_id ) );
			do_action( "woocommerce_before_{$section_id}_fields" );
			foreach ( $meta_fields as $key => $field ) {
				woocommerce_form_field( $field['meta_key'] ?? $key, $field, $checkout->get_value( $field['meta_key'] ?? $key ) );
			}
			do_action( "woocommerce_after_{$section_id}_fields" );
			printf( '</fieldset><div class="clear"></div>' );
			do_action( "woocommerce_after_{$section_id}" );
		}
	}

	public static function get_field_html( $field, $key, $args, $value ) {
		if ( ! self::enable() ) {
			return $field;
		}
		$defaults         = array(
			'type'              => 'text',
			'label'             => '',
			'description'       => '',
			'placeholder'       => '',
			'maxlength'         => false,
			'required'          => false,
			'autocomplete'      => false,
			'id'                => $key,
			'class'             => array(),
			'label_class'       => array(),
			'input_class'       => array(),
			'return'            => false,
			'options'           => array(),
			'custom_attributes' => array(),
			'validate'          => array(),
			'default'           => '',
			'autofocus'         => '',
			'priority'          => '',
		);
		$args             = wp_parse_args( $args, $defaults );
		$args             = apply_filters( 'vifewc_woocommerce_form_field_args', $args, $key, $value );
		$general_template = array(
			'email',
			'number',
			'url',
			'text',
			'tel',
			'password',
			'datetime',
			'datetime-local',
			'date',
			'month',
			'time',
			'week',
		);
		if ( in_array( $args['type'], $general_template ) ) {
			$file_name = 'general.php';
		} else {
			$file_name = str_ireplace( '_', '-', $args['type'] ) . '.php';
		}
		if ( ! isset( $args['vifewc_field'] ) || ! file_exists( VIFEWC_TEMPLATES . 'field' . DIRECTORY_SEPARATOR . $file_name ) ) {
			return $field;
		}
		if ( is_string( $args['class'] ) ) {
			$args['class'] = array( $args['class'] );
		}
		$args['class'][] = 'form-row';
		if ( ! empty( $args['checkboxgroup_style'] ) ) {
			$args['class'][] = 'vifewc-group-options-wrap vifewc-group-options-wrap-' . $args['checkboxgroup_style'];
		}
		if ( ! empty( $args['validate'] ) ) {
			foreach ( $args['validate'] as $validate ) {
				$args['class'][] = 'validate-' . $validate;
			}
		}
		if ( $args['required'] ) {
			$args['class'][] = 'validate-required';
			$required        = sprintf( '&nbsp;<abbr class="required" title="%1s">*</abbr>', esc_attr__( 'required', 'fewc-extra-checkout-fields-for-woocommerce' ) );
		} else {
			$required = sprintf( '&nbsp;<span class="optional">(%1s)</span>', esc_html__( 'optional', 'fewc-extra-checkout-fields-for-woocommerce' ) );
		}
		if ( is_string( $args['label_class'] ) ) {
			$args['label_class'] = array( $args['label_class'] );
		}

		if ( is_null( $value ) ) {
			$value = $args['default'];
		}

		// Custom attribute handling.
		$custom_attributes         = array();
		$args['custom_attributes'] = array_filter( (array) $args['custom_attributes'], 'strlen' );

		if ( $args['maxlength'] ) {
			$args['custom_attributes']['maxlength'] = absint( $args['maxlength'] );
		}

		if ( ! empty( $args['autocomplete'] ) ) {
			$args['custom_attributes']['autocomplete'] = $args['autocomplete'];
		}

		if ( true === $args['autofocus'] ) {
			$args['custom_attributes']['autofocus'] = 'autofocus';
		}

		if ( $args['description'] ) {
			$args['custom_attributes']['aria-describedby'] = $args['id'] . '-description';
		}
		if ( ! empty( $args['custom_attributes'] ) && is_array( $args['custom_attributes'] ) ) {
			foreach ( $args['custom_attributes'] as $attribute => $attribute_value ) {
				$custom_attributes[] = esc_attr( $attribute ) . '="' . esc_attr( $attribute_value ) . '"';
			}
		}
		$field = wc_get_template_html( $file_name,
			array(
				'key'               => $key,
				'value'             => $value,
				'required'          => $required,
				'custom_attributes' => $custom_attributes,
				'args'              => $args
			),
			'fewc-extra-checkout-fields-for-woocommerce' . DIRECTORY_SEPARATOR . 'field' . DIRECTORY_SEPARATOR,
			VIFEWC_TEMPLATES . 'field' . DIRECTORY_SEPARATOR );

		return apply_filters( 'vifewc_woocommerce_form_field', $field, $key, $args, $value );
	}

	public static function custom_section_html() {
		if ( ! self::enable() ) {
			return;
		}
		$hook             = current_action();
		$section_settings = self::get_params( 'section_settings' );
		$section          = '';
		$section_data     = '';
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! in_array( $section_id, array( 'billing', 'shipping', 'order' ) ) && $hook === ( $section_setting['position'] ?? '' ) ) {
				$section      = $section_id;
				$section_data = $section_setting;
				break;
			}
		}
		if ( ! $section || empty( $section_data ) || ! apply_filters( "vifewc_enable_section", true, $section, $section_data ) ) {
			return;
		}
		$order_review_hook = array(
			'woocommerce_review_order_before_cart_contents',
			'woocommerce_review_order_after_cart_contents',
			'woocommerce_review_order_before_order_total',
			'woocommerce_review_order_after_order_total',
		);
		do_action( "woocommerce_before_{$section}" );
		if ( in_array( $hook, $order_review_hook ) ) {
			printf( '<tr class="woocommerce-%1s-fields vifewc-woocommerce-fields vifewc-woocommerce-fields-%2s"><td colspan="2">', esc_attr( $section ), esc_attr( $section ) );
		} else {
			printf( '<div class="woocommerce-%1s-fields vifewc-woocommerce-fields vifewc-woocommerce-fields-%2s">', esc_attr( $section ), esc_attr( $section ) );
		}
		if ( ! empty( $section_data['title'] ) ) {
			printf( '<div class="vifewc-section-title vifewc-section-title-%1s">%2s</div>', esc_attr( $section ), wp_kses_post( $section_data['title'] ) );
		}
		do_action( "woocommerce_before_{$section}_fields" );
		printf( '<div class="woocommerce-%1s-fields__field-wrapper vifewc-fields__field-wrapper">', esc_attr( $section ) );
		$checkout = WC()->checkout();
		$fields   = $checkout->get_checkout_fields( $section );
		if ( is_array( $fields ) ) {
			foreach ( $fields as $key => $field ) {
				woocommerce_form_field( $field['meta_key'] ?? $key, $field, $checkout->get_value( $field['meta_key'] ?? $key ) );
			}
		}
		printf( '</div>' );
		do_action( "woocommerce_after_{$section}_fields" );
		if ( in_array( $hook, $order_review_hook ) ) {
			printf( '</td></tr>' );
		} else {
			printf( '</div>' );
		}
		do_action( "woocommerce_after_{$section}" );
	}
	public static function enable_order_notes_field($result){
		if (empty(apply_filters( 'woocommerce_order_fields', array(), 'order' ))){
			$result = false;
		}
		return $result;
	}
	public static function cart_needs_shipping_address($result){
		if (empty(apply_filters( 'woocommerce_shipping_fields', array(), 'shipping' ))){
			$result = false;
		}
		return $result;
	}
	public static function vifewc_woocommerce_checkout_fields( $fields ) {
		if ( ! self::enable() ) {
			return $fields;
		}
		$section_id = self::get_params( 'section_id' );
		foreach ( $section_id as $id ) {
			$fields[ $id ] = apply_filters( "woocommerce_{$id}_fields", $fields[$id] ?? [], $id );
		}

		return $fields;
	}

	public static function vifewc_woocommerce_get_fields( $fields, $section_id ) {
		if ( ! self::enable() || ! $section_id ) {
			return $fields;
		}
		if (isset(self::$cache['section_field_'.$section_id])){
			return self::$cache['section_field_'.$section_id];
		}
		$result = $fields;
		$section_fields = self::get_params( 'section_fields', $section_id, '', $fields );
		if ( $section_fields !== $fields ) {
			$result = self::$settings::get_section_fields( $section_fields, $fields, $section_id );
		}
		$result = apply_filters( 'vifewc_woocommerce_get_fields', $result, $section_fields, $fields, $section_id );
		if(did_filter('woocommerce_checkout_fields')){
			self::$cache['section_field_'.$section_id] = $result;
		}
		return $result;
	}

	public static function vifewc_woocommerce_billing_fields( $fields, $country ) {
		if ( ! self::enable() ) {
			return $fields;
		}
		if (isset(self::$cache['section_field_billing'])){
			return self::$cache['section_field_billing'];
		}
		$result = $fields;
		$section_fields = self::get_params( 'section_fields', 'billing', '', $fields );
		if ( $section_fields !== $fields ) {
			$result = self::$settings::get_section_fields( $section_fields, $fields, 'billing' );
		}
		$result = apply_filters( 'vifewc_woocommerce_get_fields', $result, $section_fields, $fields, 'billing' );
		if(did_filter('woocommerce_checkout_fields')){
			self::$cache['section_field_billing'] = $result;
		}
		return $result;
	}

	public static function vifewc_woocommerce_shipping_fields( $fields, $country ) {
		if ( ! self::enable() ) {
			return $fields;
		}
		if (isset(self::$cache['section_field_shipping'])){
			return self::$cache['section_field_shipping'];
		}
		$result = $fields;
		$section_fields = self::get_params( 'section_fields', 'shipping', '', $fields );
		if ( $section_fields !== $fields ) {
			$result = self::$settings::get_section_fields( $section_fields, $fields, 'shipping' );
		}
		$result = apply_filters( 'vifewc_woocommerce_get_fields', $result, $section_fields, $fields, 'shipping' );
		if(did_filter('woocommerce_checkout_fields')){
			self::$cache['section_field_shipping'] = $result;
		}
		return $result;
	}


	public static function vifewc_woocommerce_get_countries_locale( $fields ) {
		if ( ! self::enable() || empty( $fields ) || ! is_array( $fields ) ) {
			return $fields;
		}
		$result = array();
		foreach ( $fields as $country => $data ) {
			$result[ $country ] = self::vifewc_woocommerce_get_country_locale( $data );
		}

		return $result;
	}

	public static function vifewc_woocommerce_get_country_locale( $fields ) {
		if ( ! self::enable() || empty( $fields ) ) {
			return $fields;
		}
		$result = $fields;
		$remove = apply_filters('vifewc_override_country_locale',array( 'class', 'label', 'placeholder', 'priority' ));
		foreach ( $fields as $id => $data ) {
			foreach ( $remove as $item ) {
				if ( isset( $data[ $item ] ) ) {
					unset( $result[ $id ][ $item ] );
				}
			}
		}

		return $result;
	}

	public function vifewc_wp_enqueue_scripts() {
		if ( ! self::enable() && ( ! is_customize_preview() && ! is_checkout() && ! is_wc_endpoint_url( 'edit-address' ) ) ) {
			return;
		}
		$has_sidebar_checkout = class_exists( 'VIWCAIO_CART_ALL_IN_ONE_Frontend_Sidebar_Cart_Content' )
		                        && VIWCAIO_CART_ALL_IN_ONE_Frontend_Sidebar_Cart_Content::$sc_checkout
		                        &&
		                        ! empty( VIWCAIO_CART_ALL_IN_ONE_Frontend_Sidebar_Cart_Content::$cache['sidebar_checkout_assign_page'] );
		if ( is_customize_preview() || is_checkout() || $has_sidebar_checkout ) {
			$des = $has_sidebar_checkout ? array( 'jquery', 'vi-wcaio-sc-checkout' ) : array( 'jquery', 'wc-checkout' );
			self::$settings::enqueue_script(
				array( 'vifewc-frontend' ),
				array( 'frontend' ),
				array( 0 ),
				array( $des )
			);
		}
		self::$settings::enqueue_style(
			array( 'vifewc-frontend' ),
			array( 'frontend' ),
			array( 0 )
		);
		$section_settings = self::get_params( 'section_settings' );
		$css              = '';
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! empty( $section_setting['title_color'] ) ) {
				$css .= ".vifewc-section-title-$section_id, .vifewc-section-title-$section_id * {color: {$section_setting['title_color']}!important;}";
			}
		}
		wp_add_inline_style( 'vifewc-frontend', $css );
		if ( is_customize_preview() ) {
			if ( ! wc_ship_to_billing_address_only() && ! WC()->cart->needs_shipping() ) {
				$product_ids = wc_get_products( array(
					'type'         => array( 'simple', ),
					'status'       => 'publish',
					'limit'        => 1,
					'stock_status' => 'instock',
					'orderby'      => 'date',
					'order'        => 'DESC',
					'virtual'      => false,
					'downloadable' => false,
					'return'       => 'ids'
				) );
				if ( ! empty( $product_ids[0] ) ) {
					WC()->cart->add_to_cart( $product_ids[0] );
				}
			}
		}
	}

	public static function get_params( $name = '', $subtitle = "", $i = '', $default = null ) {
		if ( is_customize_preview() ) {
			global $wp_customize;
			$settings = $wp_customize->unsanitized_post_values();
			if (isset($settings["vifewc_sections_params[{$name}]"])){
				$result = $settings["vifewc_sections_params[{$name}]"];
				if (!is_array($result)){
					$result = villatheme_json_decode($result);
				}
				if ( $subtitle !== '' ) {
					$result = $result[ $subtitle ] ?? $default;
				}
				if ( $i !== '' ) {
					$result = $result[ $i ] ?? $default;
				}
			}
		}
		if ( ! isset( $result ) ) {
			if ( $subtitle === '' && $i === '' ) {
				$result = self::$settings->get_params( $name );
			} elseif ( $subtitle && $i === '' ) {
				$result = self::$settings->get_current_setting( $name, $subtitle, $default );
			} else {
				$result = self::$settings->get_current_setting_by_subtitle( $name, $subtitle, $i, $default );
			}
		}

		return $result ?? $default;
	}

	public static function enable() {
		if ( isset( self::$cache['enable'] ) ) {
			return self::$cache['enable'];
		}
		self::$cache['enable'] = apply_filters('vifewc-enable',1);

		return self::$cache['enable'];
	}
}