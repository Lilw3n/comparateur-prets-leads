<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class VIFEWC_Admin_Classic_Checkout {
	protected static $settings, $cache=[];
	protected static $language, $languages, $default_language, $languages_data;
	public function __construct() {
		self::$settings         = VIFEWC_DATA::get_instance();
		self::$languages        = array();
		self::$languages_data   = array();
		self::$default_language = '';
	}
	public static function page_callback(){
		?>
		<div class="vi-ui wrap fewc-classic-checkout-wrap">
			<h2><?php esc_html_e( 'FEWC - WooCommerce Extra Checkout Fields', 'fewc-extra-checkout-fields-for-woocommerce' ); ?></h2>
            <?php
            $section_ids = self::$settings->get_params('section_id');
            $section_settings = self::$settings->get_params('section_settings');
            $section_default_id = ['billing','shipping','order'];
            $section_disable = self::get_section_disable();
            if (!empty($section_disable)){
                $section_ids = array_diff($section_ids, $section_disable);
            }
            $tab_active = $section_ids[0];
            ?>
            <div class="vi-ui vi-ui attached tabular menu vifewc-sections-container">
                <?php
                foreach ($section_settings as $k => $v){
                    if (!in_array($k, $section_ids)){
                        continue;
                    }
	                $item_class = $tab_active === $k ? 'item active' : 'item';
                    ?>
                    <div class="<?php echo esc_attr($item_class) ?>" data-tab="<?php echo esc_attr($k) ?>">
                        <div class="vifewc-section">
                            <span class="vifewc-section-title"><?php echo wp_kses_post($v['name']??ucwords($k)) ?></span>
	                        <?php
	                        if (!in_array($k, $section_default_id)){
		                        ?>
                                <div class="vifewc-section-actions">
                                    <span class="vifewc-section-edit"><i class="icon edit outline"></i></span>
                                    <span class="vifewc-section-remove"><i class="icon trash alternate outline"></i></span>
                                </div>
		                        <?php
	                        }
	                        ?>
                        </div>
                    </div>
                    <?php
                }
                ?>
                <a class="item fewc-add-new-section" data-tab="add_new">
                    <i class="icon plus"></i>
		            <?php esc_html_e('Add New Section', 'fewc-extra-checkout-fields-for-woocommerce'); ?>
                </a>
            </div>
            <div class="fewc-section-fields-container">
                <div class="fewc-loading-btn">
                    <button class="vi-ui button loading"></button>
                </div>
                <?php
                ob_start();
                ?>
                <div class="fewc-section-fields-action">
                    <div class="fewc-section-fields-action-left">
                        <button type="button" class="vifewc-field-btn vifewc-field-btn-add vi-ui green button tiny">
                            <i class="icon plus"></i>
		                    <?php esc_html_e( 'Add New Field', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                        </button>
                        <button type="button" class="vifewc-field-btn vifewc-field-btn-reset vi-ui button tiny">
                            <i class="icon redo"></i>
		                    <?php esc_html_e( 'Reset Default', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                        </button>
                    </div>
                    <div class="fewc-section-fields-action-right">
                        <button type="button" class="vifewc-field-btn vifewc-field-btn-save vi-ui primary button tiny">
		                    <?php esc_html_e( 'Save changes', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                        </button>
                    </div>
                </div>
                <?php
                $bulk_action = ob_get_clean();
                ob_start();
                ?>
                <tr>
                    <th width="1%"></th>
                    <th><?php esc_html_e('ID', 'fewc-extra-checkout-fields-for-woocommerce'); ?></th>
                    <th><?php esc_html_e('Label', 'fewc-extra-checkout-fields-for-woocommerce'); ?></th>
                    <th><?php esc_html_e('Type', 'fewc-extra-checkout-fields-for-woocommerce'); ?></th>
                    <th><?php esc_html_e('Action', 'fewc-extra-checkout-fields-for-woocommerce'); ?></th>
                </tr>
                <?php
                $column_name = ob_get_clean();
                ?>
                <div class="fewc-section-fields-wrap vifewc-hidden">
	                <?php echo wp_kses($bulk_action, self::$settings::filter_allowed_html())?>
                    <table class="vi-ui celled table">
                        <thead><?php echo wp_kses($column_name, self::$settings::filter_allowed_html())?></thead>
                        <tbody class="fewc-section-fields-sort"></tbody>
                    </table>
	                <?php echo wp_kses($bulk_action, self::$settings::filter_allowed_html())?>
                </div>
            </div>
		</div>
		<?php
	}
    public static function get_section_disable(){
        if (!isset(self::$cache['section_disable'])){
	        $section_disable = array();
	        if ( ! wc_shipping_enabled() || wc_ship_to_billing_address_only() ) {
		        $section_disable[] = 'shipping';
	        }
            self::$cache['section_disable'] = $section_disable;
        }
        return self::$cache['section_disable'];
    }
    public static function get_enqueue_data(){
	    $args = [
		    'ajax_url'               => admin_url( 'admin-ajax.php' ),
		    'nonce'               => wp_create_nonce('fewc_checkout_form_nonce'),
		    'field_validate'         => array(
			    '0'        => esc_html__( 'Choose a option', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'email'    => esc_html__( 'Email', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'phone'    => esc_html__( 'Phone', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'number'   => esc_html__( 'Number', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'postcode' => esc_html__( 'Postcode', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'url'      => esc_html__( 'Url', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'field_as_meta'          => array(
			    'order_meta' => esc_html__( 'Order meta data', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'user_meta'  => esc_html__( 'User meta data', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'fields_display_in'      => array(
			    'admin_email'    => esc_html__( 'Admin email', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'customer_email' => esc_html__( 'Customer email', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'order_page'     => esc_html__( 'Order detail page', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'thank_you_page' => esc_html__( 'Thank you page', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'fields_type'            => array(
			    'text'           => esc_html__( 'Text', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'email'          => esc_html__( 'Email', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'tel'            => esc_html__( 'Phone', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'number'         => esc_html__( 'Number', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'textarea'       => esc_html__( 'Textarea', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'checkbox'       => esc_html__( 'Checkbox', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'checkbox_group' => esc_html__( 'Checkbox Group', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'select'         => esc_html__( 'Select', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'radio'          => esc_html__( 'Radio', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'datetime'       => esc_html__( 'Datetime', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'password'       => esc_html__( 'Password', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'hidden'         => esc_html__( 'Hidden', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'url'            => esc_html__( 'Url', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'html'           => esc_html__( 'Html/ Paragraph', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'fields_time_type'       => array(
			    'datetime-local' => esc_html__( 'Datetime local', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'time'           => esc_html__( 'Time', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'date'           => esc_html__( 'Date', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'week'           => esc_html__( 'Week', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'month'          => esc_html__( 'month', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'checkboxgroup_style'    => array(
			    'vertical'   => esc_html__( 'Vertical', 'fewc-extra-checkout-fields-for-woocommerce' ),
			    'horizontal' => esc_html__( 'Horizontal', 'fewc-extra-checkout-fields-for-woocommerce' ),
		    ),
		    'fields_html_type'       => array(
			    array(
				    'name' => esc_html__( 'Heading', 'fewc-extra-checkout-fields-for-woocommerce' ),
				    'type' => array(
					    'h1' => esc_html__( 'H1', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'h2' => esc_html__( 'H2', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'h3' => esc_html__( 'H3', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'h4' => esc_html__( 'H4', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'h5' => esc_html__( 'H5', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'h6' => esc_html__( 'H6', 'fewc-extra-checkout-fields-for-woocommerce' ),
				    )
			    ),
			    array(
				    'name' => esc_html__( 'Paragraph', 'fewc-extra-checkout-fields-for-woocommerce' ),
				    'type' => array(
					    'label' => esc_html__( 'Label', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'span'  => esc_html__( 'Span', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'p'     => esc_html__( 'P', 'fewc-extra-checkout-fields-for-woocommerce' ),
					    'div'   => esc_html__( 'div', 'fewc-extra-checkout-fields-for-woocommerce' ),
				    )
			    ),
		    ),
		    'section_position'       => self::$settings->section_positions(),
		    'section_fields_default' => self::$settings->get_default( 'section_fields' ),
	    ];
	    $args['section_disable'] = self::get_section_disable();
        return apply_filters('vifewc_get_i18n_classic_checkout',$args);
    }
}