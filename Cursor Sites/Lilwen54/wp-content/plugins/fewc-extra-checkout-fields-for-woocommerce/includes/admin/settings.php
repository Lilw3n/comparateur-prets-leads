<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VIFEWC_Admin_Settings {
	protected $settings;
	protected $language, $languages, $default_language, $languages_data;

	public function __construct() {
		$this->settings         = VIFEWC_DATA::get_instance();
		$this->languages        = array();
		$this->languages_data   = array();
		$this->default_language = '';
		add_action( 'admin_menu', array( $this, 'admin_menu' ), 10 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), PHP_INT_MAX );
		//display custom fields on order email
		add_action( 'woocommerce_email_order_meta', array( $this, 'vifewc_woocommerce_email_order_meta' ), 10, 2 );
		add_action( 'wp_ajax_vifewc_import_settings', array( $this, 'vifewc_import_settings' ) );
		add_action( 'wp_ajax_fewc_checkout_save', array( $this, 'checkout_form_settings' ) );
	}

	public function checkout_form_settings() {
        $result = array(
          'status' => 'error',
          'message' => '',
        );
		if ( ! check_ajax_referer('fewc_checkout_form_nonce','nonce', false) ) {
			$result['message'] = esc_html__('Error check nonce.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
		}
		if ( ! current_user_can( $this->settings->get_setting_capability() ) ) {
			$result['message'] = esc_html__('You miss permission to save settings.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
		}
		$arg = [
                'section_fields',
                'section_settings',
                'section_id',
        ];
        $params = [];
        foreach ($arg as $key){
            if (isset($_POST[$key])){
                $params[$key] = json_decode(wp_kses_post_deep(wp_unslash($_POST[$key])),true);
            }
        }
		update_option( 'vifewc_sections_params', $params, 'no' );
		if ( class_exists('WpFastestCache')) {
			$cache = new WpFastestCache();
			$cache->deleteCache( true );
		}
		$result['status'] = 'success';
		$result['message'] = esc_html__('Save successful.', 'fewc-extra-checkout-fields-for-woocommerce');
		wp_send_json( $result );
	}
	public function vifewc_import_settings() {
        $result = array(
          'status' => 'error',
          'message' => '',
        );
		if ( ! check_ajax_referer('_vifewc_setting_action','nonce', false) ) {
			$result['message'] = esc_html__('error check nonce.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
		}
		if ( ! current_user_can( $this->settings->get_setting_capability() ) ) {
			$result['message'] = esc_html__('You miss permission to import settings.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
		}
		$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field(wp_unslash( $_POST['nonce']) ) : '';
		if ( ! isset( $nonce ) || ! wp_verify_nonce( wc_clean( wp_unslash( $nonce ) ), '_vifewc_setting_action' ) ) {
			$result['message'] = esc_html__('Can not import settings now. Please reload and try again.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
		}
		$type = isset( $_POST['type'] ) ? villatheme_sanitize_fields( $_POST['type'] ) : '';
		if ( $type === 'reset' ) {
			if ( is_plugin_active( 'wp-fastest-cache/wpFastestCache.php' ) ) {
				$cache = new WpFastestCache();
				$cache->deleteCache( true );
			}
			delete_option( 'vifewc_settings_params' );
			delete_option( 'vifewc_sections_params' );
            $result['status'] ='success';
			wp_send_json( $result );
		}
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
		$settings = isset( $_POST['data'] ) ? villatheme_json_decode( base64_decode( villatheme_sanitize_fields( $_POST['data'] ) ) ) : array();
		if ( ! empty( $settings ) ) {
			if ( is_plugin_active( 'wp-fastest-cache/wpFastestCache.php' ) ) {
				$cache = new WpFastestCache();
				$cache->deleteCache( true );
			}
			update_option( 'vifewc_settings_params', $settings['general'] ?? array(), 'no' );
			update_option( 'vifewc_sections_params', $settings['sections'] ?? array(), 'no' );
			$result['status'] ='success';
			wp_send_json( $result );
		}else{
            $result['message'] = esc_html__('Please enter the setting\'s value.', 'fewc-extra-checkout-fields-for-woocommerce');
			wp_send_json( $result );
        }
	}

	public function vifewc_woocommerce_email_order_meta( $order, $sent_to_admin ) {
		if ( ! apply_filters('vifewc-enable',1) || ! $order ) {
			return;
		}
		$section_settings = $this->settings->get_params( 'section_settings' );
		$text_align       = is_rtl() ? 'right' : 'left';
		$tb               = 'cellspacing="0" cellpadding="6" style="color: rgb(99,99,99);border: 1.0px solid rgb(229,229,229);vertical-align: middle;width: 100.0%;font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;width: 100%;"';
		$td1              = sprintf( 'class="td" style="text-align:%1s; vertical-align: middle; font-family: \'Helvetica Neue\', Helvetica, Roboto, Arial, sans-serif; word-wrap:break-word;"', esc_attr( $text_align ) );
		$td2              = sprintf( 'class="td" style="text-align:%1s; vertical-align:middle; font-family: \'Helvetica Neue\', Helvetica, Roboto, Arial, sans-serif;"', esc_attr( $text_align ) );
		foreach ( $section_settings as $section_id => $section_setting ) {
			if ( ! $section_id || empty( $section_setting ) ||
			     ( $section_id === 'shipping' && ( wc_ship_to_billing_address_only() || ! $order->needs_shipping_address() ) ) ||
			     ! apply_filters( "vifewc_enable_section", true, $section_id, $section_setting ) ) {
				continue;
			}
			$fields      = $this->settings::get_section_fields( $this->settings->get_current_setting( 'section_fields', $section_id, '' ), array(), $section_id );
			$meta_fields = array();
			if ( is_array( $fields ) ) {
				foreach ( $fields as $key => $field ) {
					if ( ( $field['type'] ?? '' ) === 'html' ) {
						continue;
					}
					$display_in = $field['display_in'] ?? array();
					if ( ! is_array( $display_in ) || empty( $display_in )
					     || ( $sent_to_admin && ! in_array( 'admin_email', $display_in ) ) ||
					     ( ! $sent_to_admin && ! in_array( 'customer_email', $display_in ) ) ) {
						continue;
					}
					$save_as = $field['save_as'] ?? array();
					if ( ! is_array( $save_as ) || empty( $save_as ) ) {
						continue;
					}
					$meta_key = $field['meta_key'] ?? $key;
					$value    = null;
					if ( in_array( 'order_meta', $save_as )) {
						$value = $order->get_meta( $meta_key, true );
					}
					if ( ! isset( $value ) && in_array( 'user_meta', $save_as ) ) {
						$customer_id = $customer_id ?? $order->get_customer_id();
						if ( metadata_exists( 'user', $customer_id, $meta_key ) ) {
							$value = get_post_meta( $customer_id, $meta_key, true );
						}
					}
					if ( $value !== null ) {
						if (is_array($value) && !empty($field['options'])){
							$temp = array();
							foreach ( $field['options'] as $k => $v){
								if (in_array($k, $value)){
									$temp[] = $v;
								}
							}
							if (!empty($temp)){
								$value = implode(', ',  $temp);
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
			printf( '<h2>%s</h2>', wp_kses_post( $section_setting['name'] ?? $section_id ) );
			printf( '<div style="margin-bottom: 40px;"><table %1s><tbody>', wp_kses_post( $tb ) );
			do_action( "vifewc_woocommerce_email_before_{$section_id}_data" );
			foreach ( $meta_fields as $key => $data ) {
				printf( '<tr><td %1s >%2s</td><td %3s >%4s</td></tr>', wp_kses_post( $td1 ), wp_kses_post( $data['label'] ?? $key ), wp_kses_post( $td2 ), wp_kses_post( $data['value'] ?? '' ) );
			}
			do_action( "vifewc_woocommerce_email_after_{$section_id}_data" );
			printf( '</tbody></table></div>' );
		}
	}

	public function admin_menu() {
		$manage_role = $this->settings->get_setting_capability();
		add_menu_page(
			esc_html__( 'FEWC', 'fewc-extra-checkout-fields-for-woocommerce' ),
			esc_html__( 'FEWC', 'fewc-extra-checkout-fields-for-woocommerce' ),
			$manage_role,
			'vifewc',
			array( 'VIFEWC_Admin_Classic_Checkout', 'page_callback' ),
			'dashicons-cart',
			2 );
		add_submenu_page(
			'vifewc',
			esc_html__( 'Checkout fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			esc_html__( 'Checkout fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			$manage_role,
			'vifewc',
			array( 'VIFEWC_Admin_Classic_Checkout', 'page_callback' ),
		);
		add_submenu_page(
			'vifewc',
			esc_html__( 'Transfer Settings', 'fewc-extra-checkout-fields-for-woocommerce' ),
			esc_html__( 'Transfer Settings', 'fewc-extra-checkout-fields-for-woocommerce' ),
			$manage_role,
			'vifewc-settings',
			array( $this, 'settings_callback' ),
		);
		add_submenu_page(
			'vifewc',
			esc_html__( 'Create and Edit Fields', 'fewc-extra-checkout-fields-for-woocommerce' ),
			esc_html__( 'Customize', 'fewc-extra-checkout-fields-for-woocommerce' ),
			$manage_role,
			'vifewc-fields',
			function (){
                wp_safe_redirect(admin_url( 'customize.php?autofocus[section]=vifewc&url='.wc_get_checkout_url()  ));
            }
		);
	}

	public function settings_callback() {
		$this->settings = VIFEWC_DATA::get_instance( true );
		?>
        <div class="wrap">
            <h2><?php esc_html_e( 'FEWC - WooCommerce Extra Checkout Fields Settings', 'fewc-extra-checkout-fields-for-woocommerce' ); ?></h2>
            <!--<div class="vi-ui positive message vifewc_go_to_design">
		        <?php
/*//		        $customize_url = admin_url( 'customize.php?autofocus[section]=vifewc&url='.wc_get_checkout_url()  );
//		        if (!empty(get_option( 'vifewc_sections_params', array() ))) {
//			        /* translators: %1s: Method name */
//			        echo wp_kses_post( sprintf( __( '<span>Go </span><strong><a class="vifewc-design_enable-disable" target="_blank" href="%1s">here</a></strong><span class="vifewc-design_enable-disable"> to set up checkout sections & fields</span>', 'fewc-extra-checkout-fields-for-woocommerce' ), esc_url( $customize_url ) ) );
//		        }else{
//			        /* translators: %1s: Method name */
//			        echo wp_kses_post(sprintf(__('<span>You have not set data. Please go </span><strong><a class="vifewc-design_enable-disable" target="_blank" href="%1s">here</a></strong><span class="vifewc-design_enable-disable"> to set up checkout sections & fields</span>', 'fewc-extra-checkout-fields-for-woocommerce'),esc_url( $customize_url )));
//		        }
		        ?>
            </div>-->
            <div class="vi-ui raised">
                <form class="vi-ui form" method="post">
					<?php
					wp_nonce_field( '_vifewc_setting_action', '_vifewc_setting', false );
					?>
                    <div class="vi-ui top tabular vi-ui-main attached menu">
                        <a class="item" data-tab="general"><?php esc_html_e( 'Import/Export Settings', 'fewc-extra-checkout-fields-for-woocommerce' ); ?></a>
                    </div>
                    <div class="vi-ui bottom attached tab segment vifewc-import-wrap" data-tab="general">
                        <table class="form-table">
                            <tr>
                                <td>
									<?php
									global $vifewc_export;
									// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
									$export = base64_encode( villatheme_json_encode( $vifewc_export ) );
									?>
                                    <textarea name="import_settings" id="" cols="30"
                                              rows="20"><?php echo esc_html($export);?></textarea>
                                    <p class=description">
										<?php
										esc_html_e( 'You can transfer the saved settings data between different installs by copying the text inside the text box. To import data from another install, replace the data in the text box with the one from another install and click "Import Settings".', 'fewc-extra-checkout-fields-for-woocommerce' );
										?>
                                    </p>
                                    <p class="vifewc-warning vifewc-import-warning"></p>
                                    <p class="">
                                        <button type="button" class="vifewc-import vi-ui inverted green button tiny">
											<?php esc_html_e( 'Import settings', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                                        </button>
                                        <button type="button" class="vifewc-reset vi-ui button tiny">
											<?php esc_html_e( 'Reset settings', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                                        </button>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!--<p class="vifewc-save-wrap">
                        <a href="<?php /*echo esc_url($customize_url); */?>" target="_blank" class="vi-ui green button">
	                        <?php /*esc_html_e( 'Create and Edit Fields', 'fewc-extra-checkout-fields-for-woocommerce' ); */?>
                        </a>
                    </p>-->
                </form>
				<?php do_action( 'villatheme_support_fewc-extra-checkout-fields-for-woocommerce' ); ?>
            </div>
        </div>
		<?php
	}

	public function admin_enqueue_scripts() {
		if ( isset( $_REQUEST['_vifewc_setting'] ) && ! wp_verify_nonce( wc_clean( wp_unslash( $_REQUEST['_vifewc_setting'] ) ), '_vifewc_setting_action' ) ) {
			return;
		}
		$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';
		if ( !in_array($page ,['vifewc','vifewc-settings']) ) {
			return;
		}
		$this->settings::enqueue_style(
			array( 'semantic-ui-button', 'semantic-ui-checkbox', 'semantic-ui-form', 'semantic-ui-segment', 'semantic-ui-icon' ),
			array( 'button', 'checkbox', 'form', 'segment', 'icon' ),
			array( 1, 1, 1, 1, 1 )
		);
		$this->settings::enqueue_style(
			array( 'semantic-ui-menu', 'semantic-ui-message', 'semantic-ui-tab', 'transition', 'vifewc-admin-settings' ),
			array( 'menu', 'message', 'tab', 'transition', 'admin-settings' ),
			array( 1, 1, 1, 1, 0 )
		);
		$this->settings::enqueue_script(
			array( 'semantic-ui-address', 'semantic-ui-checkbox', 'semantic-ui-form', 'semantic-ui-tab', 'transition', 'vifewc-admin-settings' ),
			array( 'address', 'checkbox', 'form', 'tab', 'transition', 'admin-settings' ),
			array( 1, 1, 1, 1, 1, 0 )
		);
        $args =[
	        'ajax_url'               => admin_url( 'admin-ajax.php' ),
        ];
		$localize_script = 'vifewc-admin-settings';
        switch ($page){
            case 'vifewc':
	            $args += [
		            'section_fields' => $this->settings->get_params('section_fields'),
		            'section_ids' => $this->settings->get_params('section_id'),
		            'section_settings' => $this->settings->get_params('section_settings'),
		            'i18n' =>wp_parse_args( $this->settings::get_setting_texts(),[
                            'add_section_title'=> __('Custom Checkout Section', 'fewc-extra-checkout-fields-for-woocommerce')
                    ])
	            ];
                $args = wp_parse_args(VIFEWC_Admin_Classic_Checkout::get_enqueue_data(), $args);
	            $localize_script = 'vifewc-classic-checkout';
	            $this->settings::enqueue_style(
		            array(
                            'semantic-ui-table',
			            'vifewc-show-message',
			            'vifewc-minicolors',
			            'vifewc-semantic-ui-accordion',
			            'vifewc-semantic-ui-dropdown',
                    ),
		            array( 'table' , 'villatheme-show-message', 'minicolors',  'accordion', 'dropdown' ),
		            array( 1,0,1,1,1)
	            );
	            $this->settings::enqueue_script(
		            array( 'vifewc-minicolors', 'semantic-ui-accordion', 'semantic-ui-dropdown' ),
		            array( 'minicolors', 'accordion',  'dropdown' ),
		            array( 1, 1, 1) );
	            $this->settings::enqueue_script(
		            array( 'vifewc-classic-checkout', 'vifewc-checkout-fields', 'vifewc-show-message', ),
		            array( 'admin-classic-checkout','admin-checkout-fields', 'villatheme-show-message' ),
		            array( 0, 0,0 ),
		            array( array( 'jquery', 'jquery-ui-button', 'jquery-ui-sortable' ) ),
		            'enqueue', true
	            );
                break;
            case 'vifewc-settings':
	            $this->settings::enqueue_script(
		            array( 'vifewc-admin-settings' ),
		            array(  'admin-settings' ),
		            array( 0 )
	            );
	            $args += array(
		            'import_empty_warning' => esc_html__( "Please enter the setting's value.", 'fewc-extra-checkout-fields-for-woocommerce' ),
		            'import_message'       => esc_html__( "Click OK to import settings.", 'fewc-extra-checkout-fields-for-woocommerce' ),
		            'reset_message'        => esc_html__( "Are you sure to reset settings?", 'fewc-extra-checkout-fields-for-woocommerce' ),
	            );
                break;
        }

		wp_localize_script( $localize_script, 'vifewc_param', $args );
	}

}