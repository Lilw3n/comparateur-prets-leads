<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VIFEWC_Compatible_Tmds {
	public static $settings, $cache = array();

	public function __construct() {
		if ( ! defined( 'TMDSPRO_VERSION' ) ) {
			return;
		}
		self::$settings = VIFEWC_DATA::get_instance();
		add_filter( 'vifewc_frontend_callback', '__return_true' );
		add_filter( 'tmds_get_wc_sections_info', [$this,'tmds_get_wc_sections_info'], 10, 1 );
		add_filter( 'tmds_get_shipping_fields', [$this,'tmds_get_shipping_fields'], 10, 2 );
		add_action( 'admin_init', [$this,'tmds_create_field'] );
	}
	public function tmds_create_field(){
		if ( ! isset( $_GET["tmds_nonce"] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET["tmds_nonce"] ) ), "fewc-tmds-create-field" ) ) {
			return;
		}
		$country = isset($_GET['country'])? sanitize_text_field(wp_unslash($_GET['country'])):'';
		$field_key = isset($_GET['field_key'])? sanitize_text_field(wp_unslash($_GET['field_key'])):'';
		if (!$country || !$field_key){
			return;
		}
		$tmds_settings = TMDSPRO_DATA::get_instance();
		$temu_fields     = $tmds_settings::get_shipping_fields( $country );
		$temu_field = $temu_fields[$field_key]??[];
		if (empty($temu_field)){
			return;
		}
		$section_param = get_option('vifewc_sections_params',[]);
		if (!is_array($section_param)){
			$section_param = [];
		}
		$section_fields = self::$settings->get_params('section_fields');
		$billing_fields = $section_fields['billing'];
		$id = 'billing_'.$field_key;
		if (isset($billing_fields[$id])){
			$id .= '_'.current_time('timestamp');
		}
		$tmp = [
			'tmds_fulfill_map_field' => "tmds_{$country}_{$id}",
			'meta_key' =>$id,
			'save_as' => ['order_meta'],
			'display_in' => ['admin_email','customer_email','order_page','thank_you_page'],
			'class' => ['form-row-wide'],
			'required' => $temu_field['required'] ?? '',
			'label' => $temu_field['fieldTitle'] ?? '',
			'enable' =>1,
			'is_custom' =>1,
			'priority' =>count($billing_fields) * 10,
		];
		if (!empty($temu_field['field_type'])){
			$tmp['type'] = $temu_field['field_type'];
		}
		if (!empty($temu_field['field_options'])){
			$tmp['options'] = $temu_field['field_options'];
			$tmp['default'] = $tmp['options'][0];
			$vifewc_options_id = $vifewc_options = [];
			foreach ($tmp['options'] as $k => $v){
				$vifewc_options_id[] = $k;
				$vifewc_options[$k] = [
					'value'=> $k,
					'label'=> $v,
					'is_selected'=> ''
				];
			}
			$vifewc_options[$vifewc_options_id[0]]['is_selected'] = 1;
			$tmp['vifewc_options']=$vifewc_options;
			$tmp['vifewc_options_id']=$vifewc_options_id;
		}
		$desc = [];
		if (!empty($temu_field['fieldTips'])){
			if (is_array($temu_field['fieldTips'])){
				$desc +=$temu_field['fieldTips'];
			}else {
				$desc[] = $temu_field['fieldTips'];
			}
		}
		if (!empty($temu_field['placeholder'])){
			$desc[] = $temu_field['placeholder'];
			$tmp['placeholder'] = $temu_field['placeholder'];
		}
		if (!empty($desc)){
			$tmp['description'] = implode('<br>', $desc);
		}
		$billing_fields[$id] = $tmp;
		$section_fields['billing'] = $billing_fields;
		$section_param['section_fields'] = $section_fields;
		if ( class_exists( 'WpFastestCache' ) ) {
			$cache = new WpFastestCache();
			$cache->deleteCache( true );
		}
		update_option( 'vifewc_sections_params', $section_param, 'no' );
		$redirect = remove_query_arg(['country','field_key','tmds_nonce']);
		$redirect = add_query_arg(['field_edit'=> $id], $redirect);
		$redirect .= '#billing';
		wp_safe_redirect($redirect);
		exit();
	}
	public function tmds_get_shipping_fields($fields, $country){
		$wc_fields = '';
		foreach ($fields as $key => $field ){
			if (!empty($field['wc_field'])){
				continue;
			}
			if (isset($field['fewc_wc_field'])){
				continue;
			}
			$filter = "tmds_{$country}_{$key}";
			$fewc_wc_field = '';
			if (empty($wc_fields)){
				$wc_fields = self::$settings->get_params('section_fields');
			}
			if (!empty($wc_fields)){
				foreach ($wc_fields as $section_id => $section_fields){
					$find = false;
					if (!empty($section_fields)){
						foreach ($section_fields as $k => $v){
							$field_map = $v['tmds_fulfill_map_field'] ??'';
							if ($field_map === $filter){
								$find = true;
								$fewc_wc_field = "{$section_id}_{$k}";
							}
						}
					}
					if ($find){
						break;
					}
				}
			}
			if ($fewc_wc_field){
				$fields[$key]['fewc_wc_field'] = $fewc_wc_field;
				$field['wc_field'] = $fewc_wc_field;
				$fields[$key]['wc_field'] = $fewc_wc_field;
			}
			if (empty($field['wc_field'])){
				$url = add_query_arg([
					'country'=> $country,
					'field_key'=> $key,
					'tmds_nonce'=> wp_create_nonce('fewc-tmds-create-field'),
				],admin_url( 'admin.php?page=vifewc' ));
				$desc =  $field['desc']??'';
				if (!is_array($desc)){
					$desc =$desc ? [$desc]: [];
				}
				$desc[] = wp_kses_post(__('Create a custom field with options similar to Temu using <a href="'.esc_url($url).'" target="_blank">FEWC</a>', 'fewc-extra-checkout-fields-for-woocommerce'));
				$fields[$key]['desc'] = $desc;
			}
		}
		return $fields;
	}

	public function tmds_get_wc_sections_info( $sections_id ) {
		$sections_name = [];
		if ( is_array( $sections_id ) && ! empty( $sections_id ) ) {
			$section_settings = self::$settings->get_params( 'section_settings' );
			foreach ( $sections_id as $id ) {
				$sections_name[ $id ] = isset( $section_settings[ $id ]['name'] ) ? $section_settings[ $id ]['name'] : $id;
			}
		}
		return $sections_name;
	}
}