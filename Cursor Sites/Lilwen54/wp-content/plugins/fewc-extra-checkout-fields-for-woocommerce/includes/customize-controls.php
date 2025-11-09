<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! class_exists( 'WP_Customize_Control' ) ) {
	require_once( ABSPATH . WPINC . '/class-wp-customize-control.php' );
}
if ( class_exists( 'WP_Customize_Control' ) ) {
	if ( ! class_exists( 'VIFEWC_Customize_Checkbox_Control' ) ) {
		class VIFEWC_Customize_Checkbox_Control extends WP_Customize_Control {
			public function enqueue() {
				VIFEWC_DATA::enqueue_style(
					array( 'vifewc-customize-checkbox' ),
					array( 'checkbox' ),
					array( 1 )
				);
				VIFEWC_DATA::enqueue_script(
					array( 'vifewc-customize-checkbox' ),
					array( 'checkbox' ),
					array( 1 )
				);
			}

			protected function render_content() {
				?>
                <label>
					<?php
					if ( ! empty( $this->label ) ) {
						echo sprintf( '<span class="customize-control-title">%s</span>', esc_html( $this->label ) );
					}
					if ( ! empty( $this->description ) ) {
						echo sprintf( '<span class="description customize-control-description">%s</span>', esc_html( $this->description ) );
					}
					?>
                    <div class="vi-ui toggle checkbox vifewc-customize-checkbox-wrap">
                        <input type="hidden" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?>>
                        <input type="checkbox" class="vifewc-customize-checkbox" <?php checked( $this->value(), 1 ); ?>><label></label>
                    </div>
                </label>
				<?php
			}
		}
	}
	if ( ! class_exists( 'VIFEWC_Customize_Sections_Control' ) ) {
		class VIFEWC_Customize_Sections_Control extends WP_Customize_Control {
			protected function render_content() {
				if ( ! empty( $this->label ) ) {
					printf( '<label><span class="customize-control-title">%1s</span>', esc_html( $this->label ) );
					if ( ! empty( $this->description ) ) {
						echo sprintf( '<span class="description customize-control-description">%1s</span>', esc_html( $this->description ) );
					}
					printf( '</label>' );
				}
				switch ( $this->section ) {
					case 'vifewc-customize-fields':
						printf( '<div class="vifewc-customize-fields-wrap"><div class="vifewc-customize-fields"></div><div class="vifewc-customize-fields-action"><span class="vifewc-button vifewc-fields-add_new">%1s </span></div></div>', esc_html__( 'Add New Field', 'fewc-extra-checkout-fields-for-woocommerce' ) );
						break;
					case 'vifewc-customize-section':
						?>
                        <div class="vifewc-customize-section-wrap">
                            <div class="vifewc-customize-section"></div>
                            <div class="vifewc-customize-section-action">
                                <span class="vifewc-button vifewc-section-save"></span>
                            </div>
                        </div>
						<?php
                        break;
					default:
						?>
                        <div class="vifewc-sections-wrap">
                            <div class="vifewc-sections-container"></div>
                            <div class="vifewc-sections-action">
                        <span class="vifewc-button vifewc-section-add_new">
                            <?php esc_html_e( 'Add new section', 'fewc-extra-checkout-fields-for-woocommerce' ); ?>
                        </span>
                            </div>
                        </div>
					<?php
				}
			}
		}
	}
}