<?php

namespace BULKY\Admin;

use BULKY\Includes\Support;

defined( 'ABSPATH' ) || exit;

class Admin {

	protected static $instance = null;

	public function __construct() {
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
	}

	public static function instance() {
		return self::$instance == null ? self::$instance = new self() : self::$instance;
	}

	public function admin_menu() {
		add_menu_page(
			esc_html__( 'WooCommerce Bulk Editor', 'bulky-bulk-edit-products-for-woo' ),
			esc_html__( 'Bulky', 'bulky-bulk-edit-products-for-woo' ),
			BULKY_CONST_F['capability'],
			'vi_wbe_bulk_editor',
			'',
			'dashicons-media-spreadsheet',
			40
		);

		add_submenu_page( 'vi_wbe_bulk_editor',
			esc_html__( 'Edit Products', 'bulky-bulk-edit-products-for-woo' ),
			esc_html__( 'Edit Products', 'bulky-bulk-edit-products-for-woo' ),
			BULKY_CONST_F['capability'],
			'vi_wbe_bulk_editor',
			[ Editor::instance(), 'editor' ]
		);
		add_submenu_page( 'vi_wbe_bulk_editor',
			esc_html__( 'Edit Orders', 'bulky-bulk-edit-products-for-woo' ),
			esc_html__( 'Edit Orders', 'bulky-bulk-edit-products-for-woo' ),
			BULKY_CONST_F['capability'],
			'vi_wbe_edit_orders',
			[ $this, 'pro_edit_page' ]
		);
		add_submenu_page( 'vi_wbe_bulk_editor',
			esc_html__( 'Edit Coupons', 'bulky-bulk-edit-products-for-woo' ),
			esc_html__( 'Edit Coupons', 'bulky-bulk-edit-products-for-woo' ),
			BULKY_CONST_F['capability'],
			'vi_wbe_edit_coupons',
			[ $this, 'pro_edit_page' ]
		);
		add_submenu_page( 'vi_wbe_bulk_editor',
			esc_html__( 'Edit Reviews', 'bulky-bulk-edit-products-for-woo' ),
			esc_html__( 'Edit Reviews', 'bulky-bulk-edit-products-for-woo' ),
			BULKY_CONST_F['capability'],
			'vi_wbe_edit_reviews',
			[ $this, 'pro_edit_page' ]
		);
	}

	public function pro_edit_page() {
		global $current_screen;
		$page = $current_screen->id;
		$img  = 'preview-' . str_replace( 'bulky_page_vi_wbe_edit_', '', $page );
		?>
        <div class="wrap">
            <div class="viweb-preview-pro-feature-wrap">
                <img src="<?php echo esc_url( BULKY_CONST_F['img_url'] . $img . '.png' ) ?>" alt="<?php echo esc_attr( $img ) ?>">
                <div class="viweb-preview-pro-button">
					<?php Support::get_pro_version(); ?>
                </div>
            </div>
        </div>
		<?php
	}
}