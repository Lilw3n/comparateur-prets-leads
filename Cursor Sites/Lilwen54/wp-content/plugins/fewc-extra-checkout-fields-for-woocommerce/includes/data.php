<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VIFEWC_DATA {
	private $params;
	private $default , $current_params ;
	private static $allow_html;
	protected static $instance = null;

	/**
	 * VIFEWC_DATA constructor.
	 */
	public function __construct() {
		global $vifewc_settings, $vifewc_export;
		if ( ! $vifewc_settings ) {
			$general1         = get_option( 'vifewc_settings_params', array() );
			$custom_sections1 = get_option( 'vifewc_sections_params', array() );
			$vifewc_settings  = array_merge( $general1, $custom_sections1 );
			$vifewc_settings['vifewc_sections_params'] = $custom_sections1;
			$vifewc_settings['vifewc_settings_params'] = $general1;
		}
		$general         = array(
			'enable' => ''
		);
		$custom_sections = array(
			'section_id'       => array( 'billing', 'shipping', 'order' ),
		);
		$this->default   = array_merge( $general, $custom_sections );
		$this->current_params = $vifewc_settings;
		$this->params    =  wp_parse_args( $this->current_params, $this->default ) ;

		$vifewc_export = array(
			'general' => wp_parse_args($this->current_params['vifewc_settings_params']??[],$general ),
			'sections' => wp_parse_args( $this->current_params['vifewc_sections_params']??[], $custom_sections)
		);
	}

	public function get_default_fields( $type = 'billing_',$country='' ) {
		if ( ! function_exists( 'WC' ) || empty(WC()->countries) ) {
			return null;
		}
		if (!$country) {
			$country = WC()->countries->get_base_country();
		}
		if ( $type === 'billing_' ) {
			$allowed_countries = array_keys( WC()->countries->get_allowed_countries() );
		} else {
			$allowed_countries = array_keys( WC()->countries->get_shipping_countries() );
		}
		if ( ! in_array( $country, $allowed_countries ) ) {
			$country = current( $allowed_countries );
		}

		return WC()->countries->get_address_fields( $country, $type );
	}

	public static function get_section_fields( $section_fields, $fields, $section_id ) {
		if ( empty( $section_fields ) && ! is_array( $section_fields ) ) {
			return $fields;
		}
		$result = array();
		global $viwcaio_get_checkout_form;
		if ( $viwcaio_get_checkout_form ) {
			$edit_address = false;
		} else {
			$edit_address = is_wc_endpoint_url( 'edit-address' ) && in_array( $section_id, [ 'billing', 'shipping' ] );
		}
		foreach ( $section_fields as $id => $data ) {
			$enable = $data['enable'] ?? 1;
			if ( ( ! $enable && ! $edit_address ) || ( ! $enable && $edit_address && ! in_array( $id, [ 'billing_country', 'shipping_country' ] ) ) ||
			     ! apply_filters( "vifewc_enable_section_field", true, $id, $data ) ) {
				continue;
			}
			if ( ! isset( $data['class'] ) ) {
				$data['class'] = array();
			}
			if (in_array($id,['billing_city','billing_state','shipping_city','shipping_state'])){
				$data['type'] = $fields[$id]['type'] ??'text';
			}
			$data['class'][] = 'vifewc-field';
			$data['class'][] = 'vifewc-field-' . ( $data['type'] ?? 'text' );
			if (in_array($id,['billing_state','shipping_state'])){
				$data['required'] = $fields[$id]['required'] ??'';
			}
			if ( ! empty( $data['required'] ) ) {
				$data['class'][] = 'vifewc-validate-required';
			}
			if ( $edit_address && !empty( $data['is_custom'] )) {
				if ( ( $data['type'] ?? '' ) === 'html' ) {
					continue;
				}
				$save_as = $data['save_as'] ?? array();
				if ( ! is_array( $save_as ) || ! in_array( 'user_meta', $save_as ) ) {
					continue;
				}
			}
			if ( ! isset( $data['custom_attributes'] ) ) {
				$data['custom_attributes'] = array();
			}
			$attributes = array( 'minlength', 'min', 'max', 'step' );
			foreach ( $attributes as $item ) {
				if ( ! empty( $data[ $item ] ) ) {
					$data['custom_attributes'][ $item ] = $data[ $item ];
				}
			}
			$data['vifewc_field']=1;
			if ( ! empty( $data['meta_key'] ) ) {
				$data['id']                  = $id;
				$result[ $data['meta_key'] ] = $data;
			} else {
				$result[ $id ] = $data;
			}
		}
		return $result;
	}

	/**
	 * @param bool $new
	 *
	 * @return VIFEWC_DATA|null
	 */
	public static function get_instance( $new = false ) {
		if ( $new || null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * @param string $name
	 *
	 * @return bool|mixed|void
	 */
	public function get_params( $name = '' ) {
		if ( ! $name ) {
			return apply_filters( 'vifewc_params',$this->params);
		}
		switch ($name){
			case 'section_settings':
			case 'section_fields':
				if ( !isset($this->params[$name])){
					$this->params[$name] = $this->get_default($name);
				}
				break;
		}
		return apply_filters( 'vifewc_params_' . $name, $this->params[ $name ] ?? null );
	}



	public function get_current_setting_by_subtitle( $name = "", $subtitle = "", $i = 0, $default = false ) {
		if ( empty( $name ) ) {
			return false;
		}
		$result = $this->get_current_setting( $name, $subtitle )[ $i ] ?? $default;

		return $result;
	}

	public function get_current_setting( $name = "", $i = 0, $default = null ) {
		if ( ! $name ) {
			return false;
		}
		$result = $this->get_params( $name )[ $i ] ?? $default;
		return $result;
	}

	public function get_default( $name = "" ) {
		if ( ! $name ) {
			return apply_filters( 'vifewc_params_default',$this->default);
		}
		switch ($name){
			case 'section_settings':
				if (empty($this->default[$name])) {
					$this->default[ $name ] = array(
						'billing'  => array(
							'name' => __('Billing','fewc-extra-checkout-fields-for-woocommerce')
						),
						'shipping' => array(
							'name' => __('Shipping','fewc-extra-checkout-fields-for-woocommerce')
						),
						'order'    => array(
							'name' => __('Additional Information','fewc-extra-checkout-fields-for-woocommerce')
						)
					);
				}
				break;
			case 'section_fields':
				if (empty($this->default[$name])) {
					$tmp = get_transient( 'vifewc_get_section_fields' );
					if ( empty( $tmp ) ) {
						$tmp = [
							'billing'  => $this->get_default_fields(),
							'shipping' => $this->get_default_fields( 'shipping_' ),
							'order'    => array(
								'order_comments' => array(
									'label'       => __( 'Order notes', 'fewc-extra-checkout-fields-for-woocommerce' ),
									'placeholder' => __( 'Notes about your order, e.g. special notes for delivery.', 'fewc-extra-checkout-fields-for-woocommerce' ),
									'active'      => 1,
									'type'        => 'textarea',
									'class'       => array( 'notes' ),
								),
							)
						];
						set_transient( 'vifewc_get_section_fields', $tmp );
					}
					$this->default[ $name ] = $tmp;
				}
				break;
		}
		return apply_filters( 'vifewc_params_default_' . $name, $this->default[ $name ] ?? null );
	}

	public function section_positions() {
		$arg = array(
			'woocommerce_checkout_before_customer_details'     => __( 'Before customer details', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_checkout_after_customer_details'      => __( 'After customer details', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_before_checkout_billing_form'         => __( 'Before billing form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_after_checkout_billing_form'          => __( 'After billing form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_before_checkout_registration_form'    => __( 'Before registration form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_after_checkout_registration_form'     => __( 'After registration form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_before_checkout_shipping_form'        => __( 'Before shipping form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_after_checkout_shipping_form'         => __( 'After shipping form fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_before_order_notes'                   => __( 'Before order notes', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_after_order_notes'                    => __( 'After order notes', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_checkout_before_order_review'         => __( 'Before order review', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_checkout_after_order_review'          => __( 'After order review', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_before_cart_contents'    => __( 'Before cart contents', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_after_cart_contents'     => __( 'After cart contents', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_before_order_total'      => __( 'Before order total', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_after_order_total'       => __( 'After order total', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_checkout_before_terms_and_conditions' => __( 'Before terms and conditions', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_checkout_after_terms_and_conditions'  => __( 'After terms and conditions', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_before_submit'           => __( 'Before place order button', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'woocommerce_review_order_after_submit'            => __( 'After place order button', 'fewc-extra-checkout-fields-for-woocommerce' ),
		);
		if (!apply_filters( 'woocommerce_checkout_registration_enabled', 'yes' === get_option( 'woocommerce_enable_signup_and_login_from_checkout' ) )){
			unset($arg['woocommerce_before_checkout_registration_form']);
			unset($arg['woocommerce_after_checkout_registration_form']);
		}
		return apply_filters('vifewc_get_section_position',$arg);
	}
	public static function get_setting_texts(){
		$args = array(
			'wrap_class_desc'                 => esc_html__( 'Please enter some text, or some class by "," separating value. You can use one of these class: form-row-first, form-row-last, form-row-wide',
				'fewc-extra-checkout-fields-for-woocommerce' ),
			'general_settings_title'          => esc_html__( 'General', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_name'                    => esc_html__( 'Name', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_title'                   => esc_html__( 'Title', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_title_color'             => esc_html__( 'Title Color', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_position'                => esc_html__( 'Position', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_action_edit_fields'      => esc_html__( 'Manage Section fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_action_delete'           => esc_html__( 'Remove This Section', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_remove'                  => esc_html__( 'Are you sure to remove this section?', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'section_fields_reset'            => esc_html__( 'Reset Default', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_info_title'                => esc_html__( 'Field Detail', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_general_title'             => esc_html__( 'General', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_design_title'              => esc_html__( 'Design', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_data_title'                => esc_html__( 'Meta Data', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_enable'              => esc_html__( 'Enable', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_required'            => esc_html__( 'Required', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_label'               => esc_html__( 'Label', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_type'                => esc_html__( 'Type', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_class'               => esc_html__( 'Class', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_label_class'         => esc_html__( 'Label Class', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_input_class'         => esc_html__( 'Input Class', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_save_as'             => esc_html__( 'Save As', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_meta_key'            => esc_html__( 'Meta Key Name', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_display'             => esc_html__( 'Display In', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_desc'                => esc_html__( 'Description', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_placeholder'         => esc_html__( 'Placeholder', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_default'             => esc_html__( 'Default Value', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_minlength'           => esc_html__( 'Minimum Value Length', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_maxlength'           => esc_html__( 'Maximum Value Length', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_step'                => esc_html__( 'Step', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_minvalue'            => esc_html__( 'Minimum Value', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_maxvalue'            => esc_html__( 'Maximum Value', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_checked_default'     => esc_html__( 'Set checkbox state "checked" as default', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_selected_default'    => esc_html__( 'Is the default selected value', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_checkboxgroup_style' => esc_html__( 'Style', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_options'             => esc_html__( 'Options', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_option_value'        => esc_html__( 'Option value(*)', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_option_label'        => esc_html__( 'Option label(*)', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_option_remove'             => esc_html__( 'Are you sure to remove this option?', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_content'             => esc_html__( 'Content', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_title_validation'          => esc_html__( 'Validations', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'field_remove'                    => esc_html__( 'Are you sure to remove this field?', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_remove_field'              => esc_html__( 'You can not remove this field', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_remove_last_item'          => esc_html__( 'You can not remove the last item.', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_option_value_invalid'      => esc_html__( 'The option value is invalid', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_option_value_unique'       => esc_html__( 'The option value must be unique!', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_option_value_empty'        => esc_html__( 'The option value can not be empty!', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_option_label_empty'        => esc_html__( 'The option label can not be empty!', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_name_empty'                => esc_html__( 'Name can not be empty!', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'error_name_unique'               => esc_html__( 'Name must be unique!', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'save_section'                    => esc_html__( 'Save section', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'add_section'                     => esc_html__( 'Add section', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'enable'                          => esc_html__( 'Enable', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'disable'                         => esc_html__( 'Disable', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'save'                            => esc_html__( 'Apply', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'edit'                            => esc_html__( 'Edit', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'clone'                           => esc_html__( 'Clone', 'fewc-extra-checkout-fields-for-woocommerce' ),
			'remove'                          => esc_html__( 'Remove', 'fewc-extra-checkout-fields-for-woocommerce' ),
		);
		return apply_filters('vifewc_get_setting_texts', $args);
	}

	public function get_option_autoload() {
		return apply_filters( 'vifewc_option_autoload', 'no' );
	}

	public function get_setting_capability() {
		return apply_filters( 'vifewc_setting_capability', 'manage_woocommerce' );
	}

	public static function filter_allowed_html( $tags = [] ) {
		if ( self::$allow_html && empty( $tags ) ) {
			return self::$allow_html;
		}
		$tags = array_merge_recursive( $tags, wp_kses_allowed_html( 'post' ), array(
			'input'  => array(
				'type'         => 1,
				'name'         => 1,
				'placeholder'  => 1,
				'autocomplete' => 1,
				'step'        => 1,
				'min'        => 1,
				'max'        => 1,
				'value'        => 1,
				'size'         => 1,
				'checked'      => 1,
				'disabled'     => 1,
				'readonly'     => 1,
			),
			'form'   => array(
				'method' => 1,
				'action' => 1,
			),
			'select' => array(
				'name'     => 1,
				'multiple' => 1,
			),
			'option' => array(
				'value'    => 1,
				'selected' => 1,
				'disabled'     => 1,
			),
			'style'  => array(
				'id'    => 1,
				'type'  => 1,
			),
			'source' => array(
				'type' => 1,
				'src'  => 1
			),
			'video'  => array(
				'width'  => 1,
				'height' => 1,
				'src'    => 1
			),
			'iframe' => array(
				'width'           => 1,
				'height'          => 1,
				'allowfullscreen' => 1,
				'allow'           => 1,
				'src'             => 1
			),
		) );
		$tmp = $tags;
		foreach ( $tmp as $key => $value ) {
			$tags[ $key ] = wp_parse_args( [
				'width'  => 1,
				'height' => 1,
				'class'  => 1,
				'id'     => 1,
				'type'   => 1,
				'style'  => 1,
				'data-*' => 1,
				'fetchpriority' => 1,
				'loading' => 1,
			],$value);
		}
		self::$allow_html = apply_filters('vargal_filter_allowed_html',$tags);
		return self::$allow_html;
	}

	public static function wp_kses_post( $content ) {

		return wp_kses( $content, self::filter_allowed_html() );
	}


	public static function remove_other_script() {
		global $wp_scripts;
		if ( isset( $wp_scripts->registered['jquery-ui-accordion'] ) ) {
			unset( $wp_scripts->registered['jquery-ui-accordion'] );
			wp_dequeue_script( 'jquery-ui-accordion' );
		}
		if ( isset( $wp_scripts->registered['accordion'] ) ) {
			unset( $wp_scripts->registered['accordion'] );
			wp_dequeue_script( 'accordion' );
		}
		$scripts = $wp_scripts->registered;
		foreach ( $scripts as $k => $script ) {
			if ( in_array( $script->handle, array( 'query-monitor', 'uip-app', 'uip-vue', 'uip-toolbar-app' ) ) ) {
				continue;
			}
			preg_match( '/\/wp-/i', $script->src, $result );
			if ( count( array_filter( $result ) ) ) {
				preg_match( '/(\/wp-content\/plugins|\/wp-content\/themes)/i', $script->src, $result1 );
				if ( count( array_filter( $result1 ) ) ) {
					wp_dequeue_script( $script->handle );
				}
			} else {
				wp_dequeue_script( $script->handle );
			}
		}
	}

	public static function enqueue_style( $handles = array(), $srcs = array(), $is_suffix = array(), $des = array(), $type = 'enqueue' ) {
		if ( empty( $handles ) || empty( $srcs ) ) {
			return;
		}
		$action = $type === 'enqueue' ? 'wp_enqueue_style' : 'wp_register_style';
		$suffix = WP_DEBUG ? '' : '.min';
		foreach ( $handles as $i => $handle ) {
			if ( ! $handle || empty( $srcs[ $i ] ) ) {
				continue;
			}
			$suffix_t = ! empty( $is_suffix[ $i ] ) ? '.min' : $suffix;
			$action( $handle, VIFEWC_CSS . $srcs[ $i ] . $suffix_t . '.css', ! empty( $des[ $i ] ) ? $des[ $i ] : array(), VIFEWC_VERSION );
		}
	}

	public static function enqueue_script( $handles = array(), $srcs = array(), $is_suffix = array(), $des = array(), $type = 'enqueue', $in_footer = false ) {
		if ( empty( $handles ) || empty( $srcs ) ) {
			return;
		}
		$action = $type === 'register' ? 'wp_register_script' : 'wp_enqueue_script';
		$suffix = WP_DEBUG ? '' : '.min';
		foreach ( $handles as $i => $handle ) {
			if ( ! $handle || empty( $srcs[ $i ] ) ) {
				continue;
			}
			$suffix_t = ! empty( $is_suffix[ $i ] ) ? '.min' : $suffix;
			$action( $handle, VIFEWC_JS . $srcs[ $i ] . $suffix_t . '.js', ! empty( $des[ $i ] ) ? $des[ $i ] : array( 'jquery' ), VIFEWC_VERSION, $in_footer );
		}
	}
}