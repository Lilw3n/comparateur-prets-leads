<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Admin_Transfer_Settings {
	protected static $settings;
	protected $error;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_init', array( $this, 'admin_init' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ), 20 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	public function admin_init() {
		global $tmds_params;
		if ( isset( $_POST['tmds_import_settings'] ) && isset( $_POST['_tmds_settings_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_tmds_settings_nonce'] ) ), 'tmds_settings' ) ) {
			$tmds_transfer_settings = isset( $_POST['tmds_transfer_settings'] ) ? sanitize_text_field( wp_unslash( $_POST['tmds_transfer_settings'] ) ) : '';
			$args                   = $tmds_transfer_settings ? TMDSPRO_DATA::json_decode( base64_decode( $tmds_transfer_settings ) ) : '';// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
			if ( is_array( $args ) && count( $args ) ) {
				$this->error = false;
				/*Do not migrate auto update key and access token as they are unable to use in other sites*/
				unset( $args['key'] );
				update_option( 'tmds_params', $args, 'no' );
				$tmds_params    = $args;
				self::$settings = TMDSPRO_DATA::get_instance( true );
			} else {
				$this->error = true;
			}
		}
	}

	public function admin_menu() {
		$menu_slug = self::$settings::$prefix . '-transfer-settings';
		add_submenu_page(
			self::$settings::$prefix,
			esc_html__( 'Transfer Settings', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Transfer Settings', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( 'villatheme_' . self::$settings::$prefix . '_admin_sub_menu_capability', 'manage_options', $menu_slug ),
			$menu_slug,
			array( $this, 'page_callback' )
		);
	}

	public function page_callback() {
		?>
        <div class="wrap">
            <h2><?php esc_attr_e( 'Export/Import Settings', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
            <div class="vi-ui positive message">
                <div>
					<?php esc_html_e( 'To move your settings from site A to site B, please copy this field from site A and paste it to the same field on site B then click Import Settings.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </div>
            </div>
            <div class="vi-ui segment">
				<?php
				if ( $this->error === true ) {
					?>
                    <div class="vi-ui negative message">
                        <div class="header">
							<?php esc_html_e( 'Invalid input', 'tmds-woocommerce-temu-dropshipping' ); ?>
                        </div>
                    </div>
					<?php
				} elseif ( $this->error === false ) {
					?>
                    <div class="vi-ui positive message">
                        <div class="header">
							<?php esc_html_e( 'Import settings successfully', 'tmds-woocommerce-temu-dropshipping' ); ?>
                        </div>
                    </div>
					<?php
				}
				?>
                <form class="vi-ui form" method="post">
					<?php
					wp_nonce_field( 'tmds_settings', '_tmds_settings_nonce', false )
					?>
                    <h4><?php esc_html_e( 'Your current settings:', 'tmds-woocommerce-temu-dropshipping' ) ?></h4>
                    <textarea style="width: 100%;min-height: 200px; "
                              name="tmds_transfer_settings"><?php
						echo wp_kses_post( trim( base64_encode( wp_json_encode( self::$settings->get_params() ) ) ) );// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
						?></textarea>
                    <p>
                        <input type="submit" class="vi-ui primary button"
                               name="tmds_import_settings"
                               value="<?php esc_attr_e( 'Import Settings', 'tmds-woocommerce-temu-dropshipping' ) ?>">
                    </p>
                </form>
            </div>
        </div>
		<?php
	}

	public function admin_enqueue_scripts() {
		$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( $page === 'tmds-transfer-settings' ) {
			self::$settings::enqueue_style(
				array(
					'semantic-ui-form',
					'semantic-ui-button',
					'semantic-ui-message',
					'semantic-ui-segment',
				),
				array( 'form', 'button', 'message', 'segment', ),
				array( 1, 1, 1, 1 )
			);
		}
	}
}