<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Auth {
	protected $prefix;

	public function __construct() {
		$this->prefix = TMDSPRO_DATA::$prefix;
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
		add_filter( 'woocommerce_api_permissions_in_scope', array( $this, 'extension_permissions' ), PHP_INT_MAX, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	public function admin_menu() {
		$menu_slug = $this->prefix . '-auth';
		add_submenu_page( '',
			esc_html__( 'Auth', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Auth', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( 'villatheme_' . $this->prefix . '_admin_sub_menu_capability', 'manage_woocommerce', $menu_slug ),
			$menu_slug,
			[ $this, 'auth_page' ]
		);
	}

	public function auth_page() {
		$api_credentials = get_option( 'villatheme_' . $this->prefix . '_temp_api_credentials', array() );
		?>
        <div class="wrap">
            <h2><?php esc_html_e( 'Authorize TMDS - Dropshipping for TEMU and Woo Extension', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
			<?php
			if ( ! empty( $api_credentials['consumer_key'] ) && ! empty( $api_credentials['consumer_secret'] ) ) {
				?>
                <form method="post" class="tmds-auth-form">
                    <input type="hidden" value="<?php echo esc_attr( $api_credentials['consumer_key'] ) ?>"
                           name="tmds_consumer_key">
                    <input type="hidden" value="<?php echo esc_attr( $api_credentials['consumer_secret'] ) ?>"
                           name="tmds_consumer_secret">
                </form>
				<?php
			}
			?>
        </div>
		<?php
		delete_option( 'villatheme_' . $this->prefix . '_temp_api_credentials' );
	}

	public function extension_permissions( $permissions, $scope ) {
		if ( ! empty( $_REQUEST['tmds_extension'] ) && $scope === 'read_write' ) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$permissions = [ esc_html__( 'Import Temu products', 'tmds-woocommerce-temu-dropshipping' ) ];
		}

		return $permissions;
	}

	public function admin_enqueue_scripts() {
		$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( $page === $this->prefix . '-auth' ) {
			TMDSPRO_DATA::enqueue_script( array( $this->prefix . '-auth' ), array( 'auth' ) );
		}
	}

}
