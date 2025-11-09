<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Automattic\WooCommerce\Admin\PluginsHelper;

class TMDSPRO_Admin_Setup_Wizard {
	protected static $settings, $prefix;
	protected $current_url;
	public static $plugins = array();

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		self::$prefix   = self::$settings::$prefix;
		add_action( 'admin_menu', array( $this, 'admin_menu' ), 25 );
		add_action( 'admin_head', array( $this, 'setup_wizard' ) );
	}

	public static function get_active_plugins() {
		if ( empty( self::$plugins['active'] ) ) {
			$active_plugins = [];
			$tmp            = get_option( 'active_plugins', [] );
			if ( is_multisite() ) {
				$tmp += array_keys( get_site_option( 'active_sitewide_plugins', [] ) );
			}
			if ( ! empty( $tmp ) ) {
				foreach ( $tmp as $v ) {
					$info = explode( '/', $v );
					if ( empty( $info[1] ) ) {
						$info = explode( DIRECTORY_SEPARATOR, $v );
					}
					if ( empty( $info[1] ) ) {
						continue;
					}
					$active_plugins[ $info[0] ] = $v;
				}
			}
			self::$plugins['active'] = $active_plugins;
		}

		return self::$plugins['active'];
	}

	public static function recommended_plugins() {
		if ( empty( self::$plugins['recommend'] ) ) {
			self::$plugins['recommend'] = [
				'exmage-wp-image-links'                       => [
					'slug'                => 'exmage-wp-image-links',
					'pro'                 => 'exmage-wordpress-image-links',
					'name'                => 'EXMAGE – WordPress Image Links',
					'desc'                => esc_html__( 'Save storage by using external image URLs. This plugin is required if you want to use external URLs(Temu cdn image URLs) for product featured image, gallery images and variation image.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/exmage-wp-image-links/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>EXMAGE – WordPress Image Links</strong> %s </br> %s",
						esc_html__( 'Need to save your server storage?', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'will help you solve the problem by using external image URLs.', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'When this plugin is active, "Use external links for images" option will be available in the TMDS plugin settings/Product which allows to use original Temu product image URLs for featured image, gallery images and variation image of imported Temu products.', 'tmds-woocommerce-temu-dropshipping' )
					),
					'message_not_active'  => sprintf( "<strong>EXMAGE – WordPress Image Links</strong> %s",
						esc_html__( 'is currently inactive, external images added by this plugin(Post/product featured image, product gallery images...) will no longer work properly.', 'tmds-woocommerce-temu-dropshipping' ) ),
				],
				'bulky-bulk-edit-products-for-woo'            => [
					'slug'                => 'bulky-bulk-edit-products-for-woo',
					'pro'                 => 'bulky-woocommerce-bulk-edit-products',
					'name'                => 'Bulky – Bulk Edit Products for WooCommerce',
					'desc'                => esc_html__( 'The plugin offers sufficient simple and advanced tools to help filter various available attributes of simple and variable products such as ID, Title, Content, Excerpt, Slugs, SKU, Post date, range of regular price and sale price, Sale date, range of stock quantity, Product type, Categories.... Users can quickly search for wanted products fields and work with the product fields in bulk.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/bulky-bulk-edit-products-for-woo/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>Bulky – Bulk Edit Products for WooCommerce</strong>", esc_html__( 'Quickly and easily edit your products in bulk with', 'tmds-woocommerce-temu-dropshipping' ) ),
				],
				'email-template-customizer-for-woo'           => [
					'slug'                => 'email-template-customizer-for-woo',
					'pro'                 => 'woocommerce-email-template-customizer',
					'name'                => 'Email Template Customizer for WooCommerce',
					'desc'                => esc_html__( 'Customize WooCommerce emails to make them more beautiful and professional after only several mouse clicks.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/email-template-customizer-for-woo/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>Email Template Customizer for WooCommerce</strong> %s",
						esc_html__( 'Try our brand new', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'plugin to easily customize your WooCommerce emails and make them more beautiful and professional.', 'tmds-woocommerce-temu-dropshipping' ) )
				],
				'vargal-additional-variation-gallery-for-woo' => [
					'slug'                => 'vargal-additional-variation-gallery-for-woo',
					'pro'                 => 'vargal-woocommerce-additional-variation-gallery',
					'name'                => 'VARGAL – Additional Variation Gallery for Woo',
					'desc'                => esc_html__( 'Easily set unlimited images or videos for each WC product variation and display them when the customer selects',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/vargal-additional-variation-gallery-for-woo/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>VARGAL – Additional Variation Gallery for Woo</strong> %s",
						esc_html__( 'Looking for a plugin that lets you add unlimited images or videos to each WooCommerce product variation?', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'is what you need.', 'tmds-woocommerce-temu-dropshipping' ) ),
					'message_not_active'  => sprintf( "<strong>VARGAL</strong> %s",
						esc_html__( 'is currently inactive, the variation gallery setting will not be set.', 'tmds-woocommerce-temu-dropshipping' ) ),
				],
				'product-variations-swatches-for-woocommerce' => [
					'slug'                => 'product-variations-swatches-for-woocommerce',
					'pro'                 => 'woocommerce-product-variations-swatches',
					'name'                => 'Product Variations Swatches for WooCommerce',
					'desc'                => esc_html__( 'Make it easier for customers to select variations by displaying options as colors, images, buttons, or radio buttons - no more dropdown. So they can find the right product faster.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/product-variations-swatches-for-woocommerce/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>Product Variations Swatches for WooCommerce</strong> %s",
						esc_html__( 'Need a variations swatches plugin that works perfectly with TMDS?', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'is what you need.', 'tmds-woocommerce-temu-dropshipping' ) ),
					'message_not_active'  => sprintf( "<strong>Product Variations Swatches for WooCommerce</strong> %s",
						esc_html__( 'is currently inactive, this prevents variable products from displaying beautifully.', 'tmds-woocommerce-temu-dropshipping' ) ),
				],
				'woo-photo-reviews'                           => [
					'slug' => 'woo-photo-reviews',
					'pro'  => 'woocommerce-product-variations-swatches',
					'name' => 'Photo Reviews for WooCommerce',
					'desc' => esc_html__( 'Let your customers leave feedback with pictures, and set up automatic coupon rewards for great reviews.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'  => 'https://ps.w.org/woo-photo-reviews/assets/icon-128x128.gif',
				],
				'fewc-extra-checkout-fields-for-woocommerce'  => [
					'slug'                => 'fewc-extra-checkout-fields-for-woocommerce',
					'name'                => 'FEWC - Extra Checkout Fields For WooCommerce',
					'desc'                => esc_html__( 'Easily customize your checkout page: add custom fields, enable/disable fields, rearrange their positions, and preview changes in the WP Customizer.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'                 => 'https://ps.w.org/fewc-extra-checkout-fields-for-woocommerce/assets/icon-128x128.gif',
					'message_not_install' => sprintf( "%s <strong>FEWC - Extra Checkout Fields For WooCommerce</strong> %s",
						esc_html__( 'Need a checkout field plugin that works perfectly with TMDS?', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'is what you need.', 'tmds-woocommerce-temu-dropshipping' ) ),
					'message_not_active'  => sprintf( "<strong>FEWC</strong> %s",
						esc_html__( 'is currently inactive, the custom checkout fields needed to match with the Temu checkout field might not be set.', 'tmds-woocommerce-temu-dropshipping' ) ),
				],
				'woo-cart-all-in-one'                         => [
					'slug' => 'woo-cart-all-in-one',
					'pro'  => 'woocommerce-cart-all-in-one',
					'name' => 'Cart All In One For WooCommerce',
					'desc' => esc_html__( 'All cart features you need in one simple plugin', 'tmds-woocommerce-temu-dropshipping' ),
					'img'  => 'https://ps.w.org/woo-cart-all-in-one/assets/icon-128x128.gif',
				],
				'woo-abandoned-cart-recovery'                 => [
					'slug' => 'woo-abandoned-cart-recovery',
					'name' => 'Abandoned Cart Recovery for WooCommerce',
					'desc' => esc_html__( 'Helps you to recovery unfinished order in your store. When a customer adds a product to cart but does not complete check out. After a scheduled time, the cart will be marked as “abandoned”. The plugin will start to send cart recovery email or facebook message to the customer, remind him/her to complete the order.',
						'tmds-woocommerce-temu-dropshipping' ),
					'img'  => 'https://ps.w.org/woo-abandoned-cart-recovery/assets/icon-128x128.gif',
				],
			];
		}

		return self::$plugins['recommend'];
	}

	public function admin_menu() {
		add_submenu_page(
			'tmds',
			sprintf( esc_html__( 'Run setup wizard for %1s', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
			esc_html__( 'Setup Wizard', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( 'villatheme_tmds_admin_sub_menu_capability', 'manage_options', 'tmds-setup-wizard' ),
			add_query_arg( [
				'tmds_setup_wizard' => true,
				'_wpnonce'          => wp_create_nonce( 'tmds_setup' )
			], admin_url() )
		);
	}

	public function setup_wizard() {
		if ( isset( $_POST[ self::$prefix . '_install_recommend_plugins' ] ) ) {
			try {
				$wc_install = new \WC_Install();
				$plugins    = self::recommended_plugins();
				if ( is_array( $plugins ) && ! empty( $plugins ) ) {
					foreach ( $plugins as $plugin ) {
						$slug_name = $this->set_name( $plugin['slug'] );
						if ( ! empty( $_POST[ $slug_name ] ) ) {
							$wc_install::background_installer( $plugin['slug'], [
								'name'      => $plugin['name'],
								'repo-slug' => $plugin['slug']
							] );
						}
					}
				}
				wp_safe_redirect( admin_url( 'admin.php?page=' . self::$prefix ) );
				exit;
			} catch ( \Exception $e ) {
			}
		}
		if ( isset( $_GET['_wpnonce'] ) && ! empty( $_GET[ self::$prefix . '_setup_wizard' ] )
		     && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), self::$prefix . '_setup' )
		) {
			$step = isset( $_GET['step'] ) ? sanitize_text_field( wp_unslash( $_GET['step'] ) ) : 1;
			$func = 'set_up_step_' . $step;
			if ( method_exists( $this, $func ) ) {
				if ( isset( $_SERVER['REQUEST_URI'] ) ) {
					$this->current_url = remove_query_arg( 'step', esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) );
				}
				$steps_state = array(
					'extensions'     => '',
					'product'        => '',
					'recommendation' => '',
				);
				switch ( $step ) {
					case 2:
						$steps_state['extensions']     = '';
						$steps_state['product']        = 'active';
						$steps_state['recommendation'] = 'disabled';
						break;
					case 3:
						$steps_state['extensions']     = '';
						$steps_state['product']        = '';
						$steps_state['recommendation'] = 'active';
						break;
					default:
						$steps_state['extensions']     = 'active';
						$steps_state['product']        = 'disabled';
						$steps_state['recommendation'] = 'disabled';
				}
				?>
                <div id="tmds-setup-wizard">
                    <div class="tmds-logo">
						<?php //The displayed images is the logo image of this plugin, which are located directly in the plugin's folder. ?>
                        <img src="<?php echo esc_url( TMDSPRO_IMAGES . 'icon.gif' )  // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage  ?>"
                             alt="<?php echo sprintf( esc_attr__( '%1s icon', 'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( TMDSPRO_NAME ) );// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment ?>"
                             width="100"/>
                    </div>
                    <h1><?php printf( esc_html__( '%1s Setup Wizard', 'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( TMDSPRO_NAME ) );// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment ?></h1>
                    <div class="tmds-wrapper vi-ui segment">
                        <div class="vi-ui steps fluid">
                            <div class="step <?php echo esc_attr( $steps_state['extensions'] ) ?>">
                                <div class="content">
                                    <div class="title"><?php esc_html_e( '1. Chrome Extension', 'tmds-woocommerce-temu-dropshipping' ); ?></div>
                                </div>
                            </div>
                            <div class="step <?php echo esc_attr( $steps_state['product'] ) ?>">
                                <div class="content">
                                    <div class="title"><?php esc_html_e( '2. Product Settings', 'tmds-woocommerce-temu-dropshipping' ); ?></div>
                                </div>
                            </div>
                            <div class="step <?php echo esc_attr( $steps_state['recommendation'] ) ?>">
                                <div class="content">
                                    <div class="title"><?php esc_html_e( '3. Recommendation', 'tmds-woocommerce-temu-dropshipping' ); ?></div>
                                </div>
                            </div>
                        </div>
						<?php
						delete_option( 'tmds_setup_wizard' );
						$this->$func();
						?>
                    </div>
                    <div class="tmds-skip-btn">
                        <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . self::$prefix ) ) ?>"><?php esc_html_e( 'Skip & Return to dashboard', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
                    </div>
                </div>
				<?php
			}
			exit();
		}
	}

	public function set_up_step_1() {
		?>
        <div class="tmds-step-1">
			<?php
			$general_options = TMDSPRO_Admin_Settings::general_options();
			if ( isset( $general_options['fields']['enable'] ) ) {
				unset( $general_options['fields']['enable'] );
			}
			self::$settings::villatheme_render_table_field( $general_options );
			?>
        </div>
        <div class="btn-group">
			<?php self::$settings::chrome_extension_buttons(); ?>
            <a href="<?php echo esc_url( $this->current_url . '&step=2' ) ?>" class="vi-ui button primary">
                <i class="icon step forward"></i>
				<?php esc_html_e( 'Next', 'tmds-woocommerce-temu-dropshipping' ); ?>
            </a>
        </div>
		<?php
	}

	public function set_up_step_2() {
		?>
        <form method="post" action="" class="vi-ui form setup-wizard">
            <div class="tmds-step-2">
				<?php
				wp_nonce_field( 'tmds_settings', '_tmds_settings_nonce', false );
				$fields = [
					'tmds_setup_redirect'   => [
						'type'  => 'hidden',
						'value' => esc_url( $this->current_url . '&step=3' ),
					],
					'product_categories'    => [
						'type'              => 'select2',
						'multiple'          => 1,
						'custom_attributes' => [
							'data-type_select2' => 'category'
						],
						'value'             => self::$settings->get_params( 'product_categories' ),
						'title'             => esc_html__( 'Default categories', 'tmds-woocommerce-temu-dropshipping' ),
						'desc'              => esc_html__( 'DImported products will be added to these categories.', 'tmds-woocommerce-temu-dropshipping' ),
					],
					'use_global_attributes' => [
						'type'  => 'checkbox',
						'value' => self::$settings->get_params( 'use_global_attributes' ),
						'title' => esc_html__( 'Use global attributes', 'tmds-woocommerce-temu-dropshipping' ),
						'desc'  => wp_kses_post( __( 'Global attributes will be used instead of custom attributes. More details about <a href="https://woocommerce.com/document/managing-product-taxonomies/#product-attributes" target="_blank">Product attributes</a>',
							'tmds-woocommerce-temu-dropshipping' ) ),
					],
					'product_description'   => [
						'type'    => 'select',
						'options' => array(
							'none'                           => esc_html__( 'None', 'tmds-woocommerce-temu-dropshipping' ),
							'item_specifics'                 => esc_html__( 'Item specifics', 'tmds-woocommerce-temu-dropshipping' ),
							'description'                    => esc_html__( 'Product Description', 'tmds-woocommerce-temu-dropshipping' ),
							'item_specifics_and_description' => esc_html__( 'Item specifics &amp; Product Description', 'tmds-woocommerce-temu-dropshipping' ),
						),
						'value'   => self::$settings->get_params( 'product_description' ),
						'title'   => esc_html__( 'Product description', 'tmds-woocommerce-temu-dropshipping' ),
						'desc'    => esc_html__( 'Default product description when adding product to import list.', 'tmds-woocommerce-temu-dropshipping' ),
					],
					'use_external_image'    => [
						'type'  => 'checkbox',
						'value' => self::$settings->get_params( 'use_external_image' ),
						'title' => esc_html__( 'Use external links for images', 'tmds-woocommerce-temu-dropshipping' ),
						'desc'  => esc_html__( 'This helps save storage by using original Temu image URLs but you will not be able to edit them', 'tmds-woocommerce-temu-dropshipping' ),
					],
				];
				if ( ! TMDSPRO_Admin_Settings::exmage_active() ) {
					ob_start();
					TMDSPRO_Admin_Settings::get_exmage_after_desc();
					$after_desc                   = ob_get_clean();
					$fields['use_external_image'] += [
						'disabled'   => 1,
						'after_desc' => $after_desc,
					];
				}
				$product_options = [
					'section_start' => [],
					'section_end'   => [],
					'fields'        => $fields
				];
				self::$settings::villatheme_render_table_field( $product_options );
				TMDSPRO_Admin_Settings::price_options();
				?>
            </div>
            <div class="btn-group">
				<?php self::$settings::chrome_extension_buttons(); ?>
                <a href="<?php echo esc_url( $this->current_url . '&step=1' ) ?>" class="vi-ui button">
                    <i class="icon step backward"></i>
					<?php esc_html_e( 'Back', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </a>
                <button type="submit" name="tmds_wizard_submit"
                        class="vi-ui button primary tmds-save-settings">
                    <i class="icon step forward"></i>
					<?php esc_html_e( 'Next', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </button>
            </div>
        </form>
		<?php
	}

	public function set_up_step_3() {
		$plugins = self::recommended_plugins();
		?>
        <form method="post" class="vi-ui form setup-wizard" style="margin-bottom: 0">
            <div class="tmds-step-3">
                <div class="">
                    <table id="status" class="vi-ui table">
                        <thead>
                        <tr>
                            <th colspan="3"><?php esc_html_e( 'Recommended plugins', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
                        </tr>
                        </thead>
                        <tbody>
						<?php
						foreach ( $plugins

						as $plugin ) {
						$plugin_url = "https://wordpress.org/plugins/{$plugin['slug']}";
						?>
                        <tr>
                            <td>
                                <input type="checkbox" value="1" checked class="tmds-select-plugin"
                                       data-plugin_slug="<?php echo esc_attr( $plugin['slug'] ) ?>"
                                       name="<?php echo wp_kses( $this->set_name( $plugin['slug'] ), TMDSPRO_DATA::filter_allowed_html() ) ?>">
                            </td>
                            <td>
                                <a href="<?php echo esc_url( $plugin_url ) ?>" target="_blank">
									<?php // The displayed images are logo images of suggested plugins, so they should not be stored in WP Media. ?>
                                    <img src="<?php echo esc_url( $plugin['img'] )  // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage  ?>" width="60" height="60">
                                </a>
                            </td>
                            <td>
                                <div class="tmds-plugin-name">
                                    <a href="<?php echo esc_url( $plugin_url ) ?>" target="_blank">
                                        <span style="font-weight: 700"> <?php echo wp_kses_post( $plugin['name'] ) ?></span>
                                    </a>
                                </div>
                                <div class="tmds-plugin-info"
                                "><?php echo wp_kses_post( $plugin['desc'] ) ?></div>
                </td>
                </tr>
				<?php
				}
				?>
                </tbody>
                </table>
            </div>
            </div>
            <div class="btn-group">
				<?php self::$settings::chrome_extension_buttons(); ?>
                <a href="<?php echo esc_url( $this->current_url . '&step=2' ) ?>" class="vi-ui button">
                    <i class="icon step backward"></i>
					<?php esc_html_e( 'Back', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </a>
				<?php
				if ( current_user_can( 'install_plugins' ) ) {
					?>
                    <button type="submit" name="tmds_install_recommend_plugins"
                            class="vi-ui button primary tmds-finish">
                        <i class="icon check"></i>
                        <span><?php esc_html_e( 'Install & Return to Dashboard', 'tmds-woocommerce-temu-dropshipping' ); ?></span>
                    </button>
					<?php
				}
				?>
            </div>
        </form>
		<?php
	}

	public static function install_plugins() {
		$action = 'admin_ajax';
		$result = [
			'status'  => 'error',
			'message' => [ esc_html__( 'Invalid nonce', 'tmds-woocommerce-temu-dropshipping' ) ],
		];
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json( $result );
		}
		if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'install_plugins' ) ) {
			$result['message'] = [ esc_html__( 'Forbidden', 'tmds-woocommerce-temu-dropshipping' ) ];
			wp_send_json( $result );
		}

		$plugins = isset( $_POST['install_plugins'] ) ? wc_clean( wp_unslash( $_POST['install_plugins'] ) ) : array();// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( ! is_array( $plugins ) && ! count( $plugins ) ) {
			$result['message'] = [ esc_html__( 'Please choose at least plugin to install', 'tmds-woocommerce-temu-dropshipping' ) ];
			wp_send_json( $result );
		}
		$plugins_info      = self::recommended_plugins();
		$installed_plugins = $messages = array();
		$existing_plugins  = get_plugins();
		$url               = 'http://api.wordpress.org/plugins/info/1.2/';
		foreach ( $plugins as $plugin_slug ) {
			if ( ! isset( $plugins_info[ $plugin_slug ] ) ) {
				continue;
			}
			$plugin = $plugins_info[ $plugin_slug ];
			if ( ! empty( $plugin['pro'] ) ) {
				$pro_file = "{$plugin['pro']}/{$plugin['pro']}.php";
				if ( isset( $existing_plugins[ $pro_file ] ) ) {
					$installed_plugins[ $plugin_slug ] = $pro_file;
					continue;
				}
			}
			$plugin_file = "{$plugin_slug}/{$plugin_slug}.php";
			if ( isset( $existing_plugins[ $plugin_file ] ) ) {
				$installed_plugins[ $plugin_slug ] = $plugin_file;
				continue;
			}
			$url = add_query_arg(
				array(
					'action'  => 'plugin_information',
					'request' => [
						'slug'   => $plugin_slug,
						'fields' => array(
							'sections' => false,
						),
					],
				),
				$url
			);
			$api = wp_remote_get( $url );
			if ( ! is_wp_error( $api ) ) {
				$api = json_decode( wp_remote_retrieve_body( $api ), true );
			}
			if ( is_array( $api ) ) {
				// Object casting is required in order to match the info/1.0 format.
				$api = (object) $api;
			}
			if ( ! empty( $api->download_link ) ) {
				if ( ! class_exists( 'Plugin_Upgrader' ) ) {
					require_once ABSPATH . '/wp-admin/includes/class-wp-upgrader.php';
				}
				$upgrader = new \Plugin_Upgrader( new \Automatic_Upgrader_Skin() );
				$result   = $upgrader->install( $api->download_link );
				if ( ! is_wp_error( $result ) && ! is_null( $result ) ) {
					$installed_plugins[ $plugin_slug ] = $api->name ?? $plugin_slug;
					$messages[]                        = sprintf( esc_html__( '%s is installed', 'tmds-woocommerce-temu-dropshipping' ), $api->name ?? $plugin_slug );// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
				}
			}
		}
		if ( ! empty( $installed_plugins ) ) {
			$result['status']            = 'success';
			$result['message']           = $messages;
			$result['installed_plugins'] = $installed_plugins;
			wp_send_json( $result );
		} else {
			$result['message'] = [ esc_html__( 'No plugins installed', 'tmds-woocommerce-temu-dropshipping' ) ];
			wp_send_json( $result );
		}
	}

	public static function activate_plugins() {
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			wp_send_json_error( esc_html__( 'Invalid nonce', 'tmds-woocommerce-temu-dropshipping' ) );
		}
		if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'activate_plugins' ) ) {
			wp_send_json_error( esc_html__( 'Forbidden', 'tmds-woocommerce-temu-dropshipping' ) );
		}

		$plugin_paths = PluginsHelper::get_installed_plugins_paths();
		$plugins      = isset( $_POST['install_plugins'] ) ? wc_clean( wp_unslash( $_POST['install_plugins'] ) ) : array();// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( ! is_array( $plugins ) && ! count( $plugins ) ) {
			wp_send_json_error( esc_html__( 'Not found plugins', 'tmds-woocommerce-temu-dropshipping' ) );
		}

		$activated_plugins = array();
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		// the mollie-payments-for-woocommerce plugin calls `WP_Filesystem()` during it's activation hook, which crashes without this include.
		require_once ABSPATH . 'wp-admin/includes/file.php';

		foreach ( $plugins as $plugin ) {
			$slug = $plugin;
			$path = isset( $plugin_paths[ $slug ] ) ? $plugin_paths[ $slug ] : false;
			if ( $path ) {
				$result = activate_plugin( $path );
				if ( is_null( $result ) ) {
					$activated_plugins[] = $plugin;
				}
			}
		}

		if ( count( $activated_plugins ) ) {
			wp_send_json_success( array( 'activated_plugins' => $activated_plugins ) );
		} else {
			wp_send_json_error( esc_html__( 'No plugins activated', 'tmds-woocommerce-temu-dropshipping' ) );
		}
	}

	public function set_name( $slug ) {
		return esc_attr( 'vi_install_' . str_replace( '-', '_', $slug ) );
	}
}