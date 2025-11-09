<?php

namespace BULKY\Includes;

defined( 'ABSPATH' ) || exit;

class Support {

	protected static $instance = null;

	public function __construct() {
		$this->support();
		add_action( 'vi_wbe_admin_field_auto_update_key', [ $this, 'auto_update_key' ] );
	}

	public static function instance() {
		return self::$instance == null ? self::$instance = new self() : self::$instance;
	}

	public function support() {
		if ( ! class_exists( 'VillaTheme_Support' ) ) {
			include_once BULKY_CONST_F['plugin_dir'] . 'support/support.php';
		}

		new \VillaTheme_Support(
			array(
				'support'    => 'https://wordpress.org/support/plugin/bulky-bulk-edit-products-for-woo',
				'docs'       => 'https://docs.villatheme.com/?item=bulky-woocommerce-bulk-edit-products',
				'review'     => 'https://wordpress.org/support/plugin/bulky-bulk-edit-products-for-woo/reviews/',
				'css'        => BULKY_CONST_F['dist_url'],
				'image'      => BULKY_CONST_F['img_url'],
				'slug'       => BULKY_CONST_F['slug'],
				'menu_slug'  => 'vi_wbe_bulk_editor',
				'version'    => BULKY_CONST_F['version'],
				'pro_url'    => BULKY_CONST_F['pro_url'],
				'survey_url' => 'https://script.google.com/macros/s/AKfycbwofdw-o9mzaa4JNKu6d3SwvFsI1Rigpr5p90JwzfVJYSmVFy6hips6eB5SnHJnz4Et/exec'
			)
		);
	}

	public function auto_update_key() {
		?>
        <table class="form-table">
            <tr>
                <th>
					<?php esc_html_e( 'Auto update key', 'bulky-bulk-edit-products-for-woo' ); ?>
                </th>
                <td>
					<?php self::get_pro_version(); ?>
                </td>
            </tr>
        </table>
		<?php
	}

	public static function get_pro_version() {
		printf( '<a class="vi-ui button tiny" href="%s" target="_blank">%s</a>',
			esc_url( BULKY_CONST_F['pro_url'] ), esc_html__( 'Upgrade This Feature', 'bulky-bulk-edit-products-for-woo' ) );
	}

}