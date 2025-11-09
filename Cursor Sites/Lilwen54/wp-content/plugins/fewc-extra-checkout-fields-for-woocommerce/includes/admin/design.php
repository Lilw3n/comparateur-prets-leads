<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class VIFEWC_Admin_Design {
	protected $settings, $capability;

	public function __construct() {
		$this->settings   = VIFEWC_DATA::get_instance();
		$this->capability = $this->settings->get_setting_capability();
		add_action( 'customize_register', array( $this, 'design_option_customizer' ) );
		add_action( 'customize_preview_init', array( $this, 'customize_preview_init' ) );
		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_controls_enqueue_scripts' ) );
		add_action( 'wp_print_styles', array( $this, 'customize_controls_print_styles' ) );
	}

	public function design_option_customizer( $wp_customize ) {
		$this->settings = VIFEWC_DATA::get_instance( true );
		$this->customize_only_checkout_sections( $wp_customize );
		$this->customize_one_section( $wp_customize );
		$this->customize_fields( $wp_customize );
	}

	public function customize_fields( $wp_customize ) {
		$wp_customize->add_section( 'vifewc-customize-fields', array(
			'priority'       => 200,
			'capability'     => $this->capability,
			'theme_supports' => '',
			'title'          => esc_html__( '{checkout_fields} Section', 'fewc-extra-checkout-fields-for-woocommerce' ),
		) );
		$wp_customize->add_setting( 'vifewc-customize-fields', array(
			'type'              => 'vifewc-customize-fields',
			'capability'        => $this->capability,
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'postMessage',
		) );
		$wp_customize->add_control(
			new VIFEWC_Customize_Sections_Control(
				$wp_customize,
				'vifewc-customize-fields',
				array(
					'section' => 'vifewc-customize-fields',
				)
			)
		);
	}

	public function customize_one_section( $wp_customize ) {
		$wp_customize->add_section( 'vifewc-customize-section', array(
			'priority'       => 200,
			'capability'     => $this->capability,
			'theme_supports' => '',
			'title'          => esc_html__( 'Checkout Section', 'fewc-extra-checkout-fields-for-woocommerce' ),
		) );
		$wp_customize->add_setting( 'vifewc-customize-section', array(
			'type'              => 'vifewc-customize-section',
			'capability'        => $this->capability,
			'sanitize_callback' => 'sanitize_text_field',
			'transport'         => 'postMessage',
		) );
		$wp_customize->add_control(
			new VIFEWC_Customize_Sections_Control(
				$wp_customize,
				'vifewc-customize-section',
				array(
					'section' => 'vifewc-customize-section',
				)
			)
		);
	}

	public function customize_only_checkout_sections( $wp_customize ) {
		$wp_customize->add_section( 'vifewc', array(
			'priority'       => 200,
			'capability'     => $this->capability,
			'theme_supports' => '',
			'title'          => esc_html__( 'FEWC - Extra Checkout Fields For WooCommerce', 'fewc-extra-checkout-fields-for-woocommerce' ),
		) );
		$wp_customize->add_setting(
			new VIFEWC_Customize_Setting(
				$wp_customize,
				'vifewc_sections_params[section_id]',
				array(
					'default'           => $this->settings->get_params( 'section_id' ) ?? array(),
					'type'              => 'option',
					'capability'        => $this->capability,
					'sanitize_callback' => 'vifewc_sanitize_customizer',
					'transport'         => 'postMessage',
				)
			)
		);
		$wp_customize->add_control( 'vifewc_sections_params[section_id]', array(
			'type'     => 'hidden',
			'priority' => 10,
			'section'  => 'vifewc'
		) );
		$wp_customize->add_setting(
			new VIFEWC_Customize_Setting(
				$wp_customize,
				'vifewc_sections_params[section_settings]',
				array(
					'default'           => $this->settings->get_params( 'section_settings' ) ?? array(),
					'type'              => 'option',
					'capability'        => $this->capability,
					'sanitize_callback' => 'vifewc_sanitize_customizer',
					'transport'         => 'postMessage',
				)
			)
		);
		$wp_customize->add_control( 'vifewc_sections_params[section_settings]', array(
			'type'     => 'hidden',
			'priority' => 10,
			'section'  => 'vifewc'
		) );
		$wp_customize->add_setting(
			new VIFEWC_Customize_Setting(
				$wp_customize,
				'vifewc_sections_params[section_fields]',
				array(
					'default'           => $this->settings->get_params( 'section_fields' ) ?? array(),
					'type'              => 'option',
					'capability'        => $this->capability,
					'sanitize_callback' => 'vifewc_sanitize_customizer',
					'transport'         => 'postMessage',
				)
			)
		);
		$wp_customize->add_control( 'vifewc_sections_params[section_fields]', array(
			'type'     => 'hidden',
			'priority' => 10,
			'section'  => 'vifewc'
		) );
		$wp_customize->add_setting( 'vifewc_sections', array(
			'type'              => 'option',
			'capability'        => $this->capability,
			'sanitize_callback' => 'vifewc_sanitize_customizer',
			'transport'         => 'postMessage',
		) );
		$wp_customize->add_control(
			new VIFEWC_Customize_Sections_Control(
				$wp_customize,
				'vifewc_sections',
				array(
					'label'       => esc_html__( 'Sections', 'fewc-extra-checkout-fields-for-woocommerce' ),
					'description' => esc_html__( 'Click to edit fields for each section.', 'fewc-extra-checkout-fields-for-woocommerce' ),
					'section'     => 'vifewc',
				)
			)
		);
	}

	public function customize_controls_print_styles() {
		if ( ! is_customize_preview() ) {
			return;
		}
	}

	public function customize_controls_enqueue_scripts() {
		$this->settings::enqueue_style(
			array(
				'vifewc-customize-preview',
				'vifewc-show-message',
				'vifewc-minicolors',
				'semantic-ui-checkbox',
				'semantic-ui-icon',
				'semantic-ui-accordion',
				'semantic-ui-dropdown',
				'semantic-ui-transition'
			),
			array( 'admin-customize', 'villatheme-show-message', 'minicolors', 'checkbox', 'icon', 'accordion', 'dropdown', 'transition' ),
			array( 0, 0, 1, 1, 1, 1, 1, 1 )
		);
		$this->settings::enqueue_script(
			array( 'vifewc-minicolors', 'semantic-ui-accordion', 'semantic-ui-checkbox', 'semantic-ui-dropdown', 'semantic-ui-transition' ),
			array( 'minicolors', 'accordion', 'checkbox', 'dropdown', 'transition' ),
			array( 1, 1, 1, 1, 1 ) );
		$this->settings::enqueue_script(
			array( 'vifewc-customize-setting', 'vifewc-show-message', ),
			array( 'customize-settings', 'villatheme-show-message' ),
			array( 0, 0 ),
			array( array( 'jquery', 'jquery-ui-button', 'jquery-ui-sortable' ) ),
			'enqueue', true
		);
		$args            = array(
			'enable'                 => 1,
			'home_url'               => esc_js( home_url() ),
			'checkout_url'           => esc_js( wc_get_page_permalink( 'checkout' ) )
		);
		$args += VIFEWC_Admin_Classic_Checkout::get_enqueue_data();
		$text = [
			/* translators: %1s: Method name */
			'deactivate_warning'              => wp_kses_post( sprintf( __( 'All features are not working on your site unless the customize. Please turn on the option <a class="vifewc-warning" target="_blank" href="%1s">Enable</a> to use that.',
				'fewc-extra-checkout-fields-for-woocommerce' ), esc_url( admin_url( 'admin.php?page=vifewc' ) ) ) ),
		];
		$text += $this->settings::get_setting_texts();
		wp_localize_script( 'vifewc-customize-setting', 'vifewc_preview_setting', $args );
		wp_localize_script( 'vifewc-customize-setting', 'vifewc_preview_text', $text );
	}

	public function customize_preview_init() {
		$this->settings::enqueue_script(
			array( 'vifewc-customize-preview' ),
			array( 'customize-preview' ),
			array( 0 ),
			array( array( 'jquery', 'customize-preview' ) ),
			'enqueue', true
		);
		$args = array(
			'ajax_url' => admin_url( 'admin-ajax.php' )
		);
		wp_localize_script( 'vifewc-customize-preview', 'vifewc_preview', $args );
	}
}

?>