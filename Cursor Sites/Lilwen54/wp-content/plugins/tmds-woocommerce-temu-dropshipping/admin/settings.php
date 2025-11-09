<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Admin_Settings {
	protected static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_filter( 'set-screen-option', array( $this, 'save_screen_options' ), 10, 3 );
		add_action( 'admin_init', array( $this, 'save_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
		$this->add_ajax_events();
		add_filter( 'wp_admin_css_uri', array( $this, 'connect_extension' ), 10, 2 );
		add_filter( 'cron_schedules', array( $this, 'cron_schedules' ) );
		add_action( 'villatheme_' . ( self::$settings::$prefix ) . '_auto_update_exchange_rate', array( $this, 'auto_update_exchange_rate' ) );
	}

	public function auto_update_exchange_rate() {
		$exchange_rate_api = self::$settings->get_params( 'exchange_rate_api' );
		$args              = self::$settings->get_params();
		if ( self::$settings->get_params( 'exchange_rate_auto' ) && $exchange_rate_api ) {
			$update                 = false;
			$import_currency_rate   = self::$settings->get_params( 'import_currency_rate' );
			$exchange_rate_decimals = self::$settings->get_params( 'exchange_rate_decimals' );
			if ( ! is_array( $import_currency_rate ) ) {
				$import_currency_rate = [];
			}
			$current_currency = get_woocommerce_currency();
			$accept_currency  = self::$settings::get_temu_data();
			if ( empty( $import_currency_rate ) ) {
				if ( isset( $accept_currency[ $current_currency ] ) ) {
					$import_currency_rate[ $current_currency ] = 1;
				} else {
					$import_currency_rate['USD'] = 1;
				}
			}
			if ( ! empty( $import_currency_rate ) ) {
				$new_rates = [];
				foreach ( $import_currency_rate as $currency => $rate ) {
					$decimal  = $exchange_rate_decimals[ $currency ] ?? 2;
					$new_rate = TMDSPRO_Price::get_exchange_rate( $exchange_rate_api, '', $decimal, $currency );
					if ( $new_rate !== false && $new_rate != $rate ) {
						$new_rates[ $currency ]              = $new_rate;
						$exchange_rate_decimals[ $currency ] = $decimal;
						$update                              = true;
					} else {
						$new_rates[ $currency ] = $rate;
					}
				}
				if ( $update ) {
					$args['import_currency_rate']   = $new_rates;
					$args['exchange_rate_decimals'] = $exchange_rate_decimals;
					update_option( 'tmds_params', $args, 'no' );
				}
			}
		} else {
			$this->unschedule_event();
			$args['exchange_rate_auto'] = '';
			update_option( 'tmds_params', $args, 'no' );
		}
	}

	/**
	 * @param $schedules
	 *
	 * @return mixed
	 */
	public function cron_schedules( $schedules ) {
		$schedules[ 'villatheme_' . ( self::$settings::$prefix ) . '_exchange_rate_interval' ] = array(
			'interval' => DAY_IN_SECONDS * absint( self::$settings->get_params( 'exchange_rate_interval' ) ),
			'display'  => esc_html__( 'TMDS - Auto update exchange rate', 'tmds-woocommerce-temu-dropshipping' ),
		);

		return $schedules;
	}

	public function unschedule_event() {
		if ( wp_next_scheduled( 'villatheme_' . ( self::$settings::$prefix ) . '_auto_update_exchange_rate' ) ) {
			wp_unschedule_hook( 'villatheme_' . ( self::$settings::$prefix ) . '_auto_update_exchange_rate' );
		}
	}

	public function connect_extension( $result, $file ) {
		if ( $file === 'tmds-connect-extension' ) {
			$result = WC()->plugin_url() . '/assets/css/auth.css';
		}

		return $result;
	}

	public function admin_menu() {
		$menu_slug = self::$settings::$prefix;
		add_menu_page(
			TMDSPRO_NAME,
			esc_html__( 'TMDS', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_menu_capability", 'manage_options', $menu_slug ),
			$menu_slug,
			array( TMDSPRO_Admin_Class_Prefix . 'Import_List', 'page_callback' ),
			TMDSPRO_IMAGES . 'icon.png',
			2
		);
		$import_list   = add_submenu_page(
			$menu_slug,
			esc_html__( 'Import List', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Import List', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-import-list" ),
			$menu_slug,
			array( TMDSPRO_Admin_Class_Prefix . 'Import_List', 'page_callback' )
		);
		$imported_list = add_submenu_page( $menu_slug,
			sprintf( esc_html__( 'Imported Products - %s', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
			esc_html__( 'Imported', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-imported" ),
			"{$menu_slug}-imported",
			array( TMDSPRO_Admin_Class_Prefix . 'Imported', 'page_callback' )
		);
		$fulfill_order = add_submenu_page( $menu_slug,
			sprintf( esc_html__( 'Temu Orders - %s', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
			esc_html__( 'Temu Orders', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-orders" ),
			"{$menu_slug}-orders",
			array( TMDSPRO_Admin_Class_Prefix . 'Fulfill_Orders', 'page_callback' ) );
		$failed_image  = add_submenu_page( $menu_slug,
			esc_html__( 'Failed Images', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Failed Images', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-error-images" ),
			"{$menu_slug}-error-images",
			array( TMDSPRO_Admin_Class_Prefix . 'Error_Images', 'page_callback' )
		);
		add_submenu_page( $menu_slug,
			esc_html__( 'Logs', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Logs', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-logs" ),
			"{$menu_slug}-logs",
			array( TMDSPRO_Admin_Class_Prefix . 'Log', 'page_callback' )
		);
		add_submenu_page(
			$menu_slug,
			esc_html__( 'Settings', 'tmds-woocommerce-temu-dropshipping' ),
			esc_html__( 'Settings', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( "villatheme_{$menu_slug}_admin_sub_menu_capability", 'manage_woocommerce', "{$menu_slug}-settings" ),
			"{$menu_slug}-settings",
			array( $this, 'page_callback' )
		);
		add_action( "load-$import_list", array( TMDSPRO_Admin_Class_Prefix . 'Import_List', 'screen_options_page' ) );
		add_action( "load-$imported_list", array( TMDSPRO_Admin_Class_Prefix . 'Imported', 'screen_options_page' ) );
		add_action( "load-$fulfill_order", array( TMDSPRO_Admin_Class_Prefix . 'Fulfill_Orders', 'screen_options_page' ) );
		add_action( "load-$failed_image", array( TMDSPRO_Admin_Class_Prefix . 'Error_Images', 'screen_options_page' ) );
	}

	public function save_screen_options( $result, $option, $value ) {
		if ( in_array( $option,
			[
				self::$settings::$prefix . '_import_list_per_page',
				self::$settings::$prefix . '_imported_per_page',
				self::$settings::$prefix . '_orders_per_page',
				self::$settings::$prefix . '_error_images_per_page'
			] )
		) {
			return $value;
		}

		return $result;
	}

	public function save_settings() {
		global $tmds_params;
		if ( ! current_user_can( apply_filters( "villatheme_tmds_admin_sub_menu_capability", 'manage_woocommerce', "tmds-settings" ) ) ) {
			return;
		}
		if ( ! isset( $_POST["_tmds_settings_nonce"] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST["_tmds_settings_nonce"] ) ), "tmds_settings" ) ) {
			return;
		}
		if ( isset( $_POST["tmds_wizard_submit"] ) ) {
			/*Save settings for setup wizard*/
			$args = self::$settings->get_default();
			foreach ( $args as $key => $arg ) {
				if ( isset( $_POST[ $key ] ) ) {
					if ( is_array( $_POST[ $key ] ) ) {
						$args[ $key ] = array_map( 'sanitize_text_field', wp_unslash( $_POST[ $key ] ) );
					} else {
						$args[ $key ] = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
					}
				}
			}
		} else {
			$args = self::$settings->get_params();
			foreach ( $args as $key => $arg ) {
				if ( isset( $_POST[ $key ] ) ) {
					if ( is_array( $_POST[ $key ] ) ) {
						$args[ $key ] = array_map( 'wc_clean', wp_unslash( $_POST[ $key ] ) );// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					} else {
						$args[ $key ] = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
					}
				} else {
					$args[ $key ] = is_array( $arg ) ? array() : '';
				}
			}
		}
		if ( empty( $args['exchange_rate_auto'] ) || empty( $args['exchange_rate_api'] ) ) {
			$this->unschedule_event();
		} elseif ( ( $args['exchange_rate_interval'] ?? '' ) != ( $tmds_params['exchange_rate_interval'] ?? '' ) ||
		           ( $args['exchange_rate_hour'] ?? '' ) != ( $tmds_params['exchange_rate_hour'] ?? '' ) ||
		           ( $args['exchange_rate_minute'] ?? '' ) != ( $tmds_params['exchange_rate_minute'] ?? '' ) ||
		           ( $args['exchange_rate_second'] ?? '' ) != ( $tmds_params['exchange_rate_second'] ?? '' ) ) {
			$this->unschedule_event();
			$schedule_time = self::$settings::get_schedule_time_from_local_time( $args['exchange_rate_hour'] ?? '1', $args['exchange_rate_minute'] ?? '1', $args['exchange_rate_second'] ?? '1' );
			/*Call here to apply new interval to cron_schedules filter when calling method wp_schedule_event*/
			$schedule = wp_schedule_event( $schedule_time, 'villatheme_' . ( self::$settings::$prefix ) . '_exchange_rate_interval', 'villatheme_' . ( self::$settings::$prefix ) . '_auto_update_exchange_rate' );
		}
		if ( ! empty( $args['key'] ) && $args['key'] != ( $tmds_params['key'] ?? '' ) ) {
			delete_site_transient( 'update_plugins' );
			delete_transient( 'villatheme_item_223584' );
			delete_option( 'tmds-woocommerce-temu-dropshipping_messages' );
			do_action( 'villatheme_save_and_check_key_tmds-woocommerce-temu-dropshipping', $args['key'] );
		}
		$args        = apply_filters( "tmds_save_plugin_settings_params", $args );
		$tmds_params = $args;
		update_option( 'tmds_params', $args, 'no' );
		if ( isset( $_POST["tmds_setup_redirect"] ) ) {
			wp_safe_redirect( esc_url_raw( wp_unslash( $_POST["tmds_setup_redirect"] ) ) );
			exit;
		}
		self::$settings = TMDSPRO_DATA::get_instance( true );
	}

	public function page_callback() {
		$prefix     = self::$settings::$prefix;
		$tabs       = apply_filters( "villatheme_{$prefix}_settings_tabs", array(
			'general'    => esc_html__( 'General', 'tmds-woocommerce-temu-dropshipping' ),
			'product'    => esc_html__( 'Product', 'tmds-woocommerce-temu-dropshipping' ),
			'price'      => esc_html__( 'Product price', 'tmds-woocommerce-temu-dropshipping' ),
			'video'      => esc_html__( 'Product video', 'tmds-woocommerce-temu-dropshipping' ),
			'review'     => esc_html__( 'Product review', 'tmds-woocommerce-temu-dropshipping' ),
			'splitting'  => esc_html__( 'Product splitting', 'tmds-woocommerce-temu-dropshipping' ),
			'overriding' => esc_html__( 'Product overriding', 'tmds-woocommerce-temu-dropshipping' ),
			'sync'       => esc_html__( 'Product sync', 'tmds-woocommerce-temu-dropshipping' ),
			'warehouse'  => esc_html__( 'Warehouse address', 'tmds-woocommerce-temu-dropshipping' ),
			'fulfill'    => esc_html__( 'Fulfill', 'tmds-woocommerce-temu-dropshipping' ),
			'update'     => esc_html__( 'Update', 'tmds-woocommerce-temu-dropshipping' ),
		) );
		$tab_active = array_key_first( $tabs );
		?>
        <div class="wrap">
            <h2><?php printf( esc_html__( '%s Settings', 'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( TMDSPRO_NAME ) );// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
				?></h2>
			<?php
			$messages = array();
			if ( self::$settings::get_disable_wp_cron() ) {
				$messages[]
					= wp_kses_post( __( '<strong>DISABLE_WP_CRON</strong> is set to true, product images may not be downloaded properly. Please try option <strong>"Disable background process"</strong>',
					'tmds-woocommerce-temu-dropshipping' ) );
			}
			if ( ! empty( $messages ) ) {
				?>
                <div class="vi-ui message negative">
                    <div class="header"><?php esc_html_e( 'TMDS - Warning', 'tmds-woocommerce-temu-dropshipping' ) ?>
                        :
                    </div>
                    <ul class="list">
						<?php
						foreach ( $messages as $message ) {
							?>
                            <li><?php echo wp_kses( $message, self::$settings::filter_allowed_html() ); ?></li>
							<?php
						}
						?>
                    </ul>
                </div>
				<?php
			}
			?>
            <form method="post" class="vi-ui small form">
				<?php wp_nonce_field( 'tmds_settings', '_tmds_settings_nonce', false ); ?>
                <div class="vi-ui attached tabular menu">
					<?php
					foreach ( $tabs as $slug => $text ) {
						$active = $tab_active === $slug ? 'active' : '';
						printf( ' <a class="item %s" data-tab="%s">%s</a>', esc_attr( $active ), esc_attr( $slug ), esc_html( $text ) );
					}
					?>
                </div>
				<?php
				foreach ( $tabs as $slug => $text ) {
					$active = $tab_active === $slug ? 'active' : '';
					$method = str_replace( '-', '_', $slug ) . '_options';
					$fields = [];
					printf( '<div class="vi-ui bottom attached %s tab segment" data-tab="%s">', esc_attr( $active ), esc_attr( $slug ) );
					if ( method_exists( $this, $method ) ) {
						$fields = $this->$method();
					}
					self::$settings::villatheme_render_table_field( apply_filters( "tmds_settings_fields", $fields, $slug ) );
					do_action( 'tmds_settings_tab', $slug );
					printf( '</div>' );
				}
				?>
                <p class="tmds-save-settings-container">
                    <button type="submit" class="vi-ui button labeled icon primary tmds-save-settings"
                            name="tmds_save_settings">
                        <i class="save icon"> </i>
						<?php esc_html_e( 'Save Settings', 'tmds-woocommerce-temu-dropshipping' ); ?>
                    </button>
					<?php
					self::$settings::chrome_extension_buttons();
					?>
                </p>
            </form>
			<?php do_action( 'villatheme_support_tmds-woocommerce-temu-dropshipping' ) ?>
        </div>
		<?php
	}

	public function update_options() {
		?>
        <table class="form-table">
            <tbody>
            <tr>
                <th>
                    <label for="auto-update-key"></label><?php esc_html_e( 'Auto update key', 'tmds-woocommerce-temu-dropshipping' ) ?>
                </th>
                <td>
                    <div class="vi-ui right labeled fluid input">
                        <input type="text" name="key"
                               id="auto-update-key"
                               class="villatheme-autoupdate-key-field"
                               value="<?php echo esc_attr( self::$settings->get_params( 'key' ) ) ?>">
                        <div class="label vi-ui button small green villatheme-get-key-button"
                             data-href="https://api.envato.com/authorization?response_type=code&client_id=villatheme-download-keys-6wzzaeue&redirect_uri=https://villatheme.com/update-key"
                             data-id="59696976">
                            <span><?php echo esc_html__( 'Get Key', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                        </div>
                    </div>

					<?php do_action( 'tmds-woocommerce-temu-dropshipping_key' ); ?>

                    <p class="description"><?php echo wp_kses_post( __( 'Please fill your key what you get from <a target="_blank" href="https://villatheme.com/my-download">Villatheme</a>. You can automatically update TMDS plugin. See guide <a target="_blank" href="https://villatheme.com/knowledge-base/how-to-use-auto-update-feature/">here</a>', 'tmds-woocommerce-temu-dropshipping' ) ); ?></p>
                </td>
            </tr>
            </tbody>
        </table>
		<?php
		return '';
	}

	public function render_fulfill_map_fields( $countries, $fulfill_map_class = 'tmds-warehouse_enable-disable-class' ) {
		if ( ! is_array( $countries ) || empty( $countries ) ) {
			return;
		}
		$fulfill_map_fields = self::$settings->get_params( 'fulfill_map_fields' );
		$temu_countries     = self::$settings->get_countries();
		foreach ( $countries as $country ) {
			$wc_fields       = self::$settings::get_map_checkout_fields( $country );
			$temu_fields     = self::$settings::get_shipping_fields( $country );
			$map_fields      = $fulfill_map_fields[ $country ] ?? [];
			$accordion_class = [ $fulfill_map_class, 'vi-ui styled fluid accordion tmds-fulfill_map_fields-wrap tmds-fulfill_map_fields-wrap-' . $country ];
			$fields          = [];
			foreach ( $temu_fields as $key => $field ) {
				if ( ! isset( $field['fieldKey'] ) ) {
					continue;
				}
				$wrap_class = [ 'tmds-fulfill_map_field-wrap' ];
				if ( ! empty( $field['required'] ) ) {
					$wrap_class[] = 'fulfill_map_field_required';
				}
				$tmp = [
					'type'       => 'select',
					'name'       => "fulfill_map_fields[$country][$key]",
					'id'         => "fulfill_map_fields_{$country}_{$key}",
					'class'      => "fulfill_map_fields_{$country}_{$key} search tmds-fulfill_map_field",
					'wrap_class' => $wrap_class,
					'options'    => $wc_fields,
					'value'      => $map_fields[ $key ] ?? $field['wc_field'] ?? '',
					'title'      => $field['fieldTitle'] ?? $key,
					'custom_desc'      => $field['custom_desc'] ?? '',
					'desc'      => $field['desc'] ?? '',
					'after_desc'      => $field['after_desc'] ?? '',
				];
				if ( ! empty( $field['detect'] ) && empty( $field['wc_field'] ) && ( $key !== 'post_code' || ! empty( $field['detect_postcode'] ) ) ) {
				}
				$fields["fulfill_map_fields_{$country}_{$key}"] = $tmp;
			}
			if ( empty( $fields ) ) {
				continue;
			}
			?>
            <div class="<?php echo esc_attr( implode( ' ', $accordion_class ) ) ?>" data-country="<?php echo esc_attr( $country ) ?>">
                <div class="title active">
                    <i class="dropdown icon"> </i>
					<?php echo esc_html__( 'Map fields for: ', 'tmds-woocommerce-temu-dropshipping' ) . wp_kses_post( $temu_countries[ $country ] ); ?>
                </div>
                <div class="content active">
					<?php
					$args = [
						'section_start' => [],
						'section_end'   => [],
						'fields'        => $fields
					];
					self::$settings::villatheme_render_table_field( $args );
					?>
                </div>
            </div>
			<?php
		}
	}

	public function fulfill_options() {
		$warehouse_info_class   = [ 'tmds-fulfill-notice-wrap' ];
		$warehouse_info_class[] = 'vi-ui positive small message';
		?>
        <div class="<?php echo esc_attr( implode( ' ', $warehouse_info_class ) ); ?>">
            <ul class="list">
                <li>
					<?php esc_html_e( 'The country/region on Temu must match the order’s address (the address used for fulfillment) when fulfilling.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
                <li>
					<?php esc_html_e( 'The language on Temu must be set to English when fulfilling', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
                <li>
					<?php esc_html_e( 'If an order contains products imported from different regions, you need to create separate orders and fulfill each region’s products individually.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
            </ul>
        </div>
		<?php
		$fulfill_map_countries = self::$settings->get_params( 'fulfill_map_countries' );
		$fulfill_map_class     = 'tmds-warehouse_enable-disable-class';
		if ( self::$settings->get_params( 'warehouse_enable' ) == 1 ) {
			$fulfill_map_class .= ' tmds-hidden';
		}
		$fields = [
			'fulfill_order_status' => [
				'type'     => 'select',
				'multiple' => 1,
				'options'  => wc_get_order_statuses(),
				'value'    => self::$settings->get_params( 'fulfill_order_status' ),
				'title'    => esc_html__( 'Show action', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'     => esc_html__( 'Only show action buttons for orders with status among these. Leave empty to apply to all status', 'tmds-woocommerce-temu-dropshipping' ),
			],
		];
		$args   = [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
		self::$settings::villatheme_render_table_field( $args );
		?>
        <div class="vi-ui yellow small message <?php echo esc_attr( $fulfill_map_class ); ?>">
            <ul class="list">
                <li>
					<?php esc_html_e( 'The checkout fields on Temu vary depending on the destination country, so you need to map Temu’s fields with WooCommerce for the countries you dropship to.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
                <li>
					<?php esc_html_e( 'Some fields on Temu require selecting from predefined options, so it’s best to recreate those options in the corresponding WooCommerce fields.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
                <li>
					<?php echo wp_kses_post(sprintf(__( 'You can use <a href="%s" target="_blank">FEWC</a> to create new information fields for WooCommerce if they don’t already exist.', 'tmds-woocommerce-temu-dropshipping' ),
                        class_exists('VIFEWC_INIT')? admin_url( 'admin.php?page=vifewc' ) : 'https://wordpress.org/plugins/fewc-extra-checkout-fields-for-woocommerce/')); ?>
                </li>
                <li>
					<?php esc_html_e( 'If you want to use custom PHP to modify the order fulfillment information, you can use the filter villatheme_tmds_get_fulfillment_customer_info.', 'tmds-woocommerce-temu-dropshipping' ); ?>
                </li>
            </ul>
        </div>
		<?php
		$fields = [
			'fulfill_map_countries' => [
				'type'       => 'select',
				'multiple'   => 1,
				'options'    => self::$settings->get_countries(),
				'class'      => "fulfill_map_countries search",
				'value'      => $fulfill_map_countries,
				'wrap_class' => $fulfill_map_class . ' tmds-fulfill_map_countries-wrap',
				'title'      => esc_html__( 'Match the address fields', 'tmds-woocommerce-temu-dropshipping' ),
			],
		];
		$args   = [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
		self::$settings::villatheme_render_table_field( $args );
		$this->render_fulfill_map_fields( $fulfill_map_countries, $fulfill_map_class );

		return [];
	}

	public function get_warehouse_fields( $country, $warehouse_field_class = 'tmds-warehouse_enable-enable-class' ) {
		$warehouse_fields = self::$settings->get_params( 'warehouse_fields' );
		$fields           = [];
		$temu_fields      = self::$settings::get_shipping_fields( $country );
		foreach ( $temu_fields as $key => $field ) {
			if ( ! isset( $field['fieldKey'] ) ) {
				continue;
			}
			$tmp_class = $warehouse_field_class . " tmds-warehouse_fields-class tmds-warehouse_field-$key-class";
			$tmp       = [
				'type'              => 'text',
				'name'              => "warehouse_fields[$key]",
				'id'                => "warehouse_fields_$key",
				'value'             => $warehouse_fields[ $key ] ?? '',
				'wrap_class'        => [ $tmp_class ],
				'title'             => $field['fieldTitle'] ?? $key,
				'desc'              => $field['fieldTips'] ?? '',
				'custom_attributes' => [
					'placeholder' => $field['placeholder'] ?? '',
				]
			];
			if ( ! empty( $field['field_options'] ) && ! empty( $field['field_type'] ) ) {
				$tmp['type']    = $field['field_type'];
				$tmp['options'] = $field['field_options'];
				$tmp['value']   = $warehouse_fields[ $key ] ?? array_keys( $field['field_options'] )[0];
			}
			if ( ! empty( $field['detect'] ) ) {
				$tmp['custom_attributes']['data-detect'] = $field['detect'];
				$tmp['custom_attributes']['data-type']   = $key;
				$tmp['class']                            = "warehouse_fields_$key warehouse_fields_detect";
				if ( $field['detect'] !== 'country' && ! in_array( 'tmds-warehouse-field-detect', $fields[ 'warehouse_fields_' . $field['detect'] ]['wrap_class'] ) ) {
					$fields[ 'warehouse_fields_' . $field['detect'] ]['wrap_class'][] = 'tmds-warehouse-field-detect';
				}
				if ( $key !== 'post_code' || ! empty( $field['detect_postcode'] ) ) {
					$tmp['type']    = 'select';
					$tmp['class']   .= " search";
					$tmp['options'] = [ '' => esc_html__( 'Select', 'tmds-woocommerce-temu-dropshipping' ) ];
					if ( $field['detect'] === 'country' ) {
						$tmp['options'] += self::$settings::get_address_children( $country );
					} else {
						if ( ! empty( $fields[ 'warehouse_fields_' . $field['detect'] ]['value'] ) ) {
							if ( $key === 'post_code' ) {
								$options = self::$settings::get_address_postcode( $country, $fields[ 'warehouse_fields_' . $field['detect'] ]['value'], true );
								if ( ! empty( $options ) ) {
									$new_options = [];
									foreach ( $options as $option ) {
										$new_options[ $option ] = $option;
									}
									$tmp['options'] += $new_options;
								}
							} else {
								$tmp['options'] += self::$settings::get_address_children( $country, $fields[ 'warehouse_fields_' . $field['detect'] ]['value'] );
							}
						} else {
							$tmp['class'] .= ' tmds-not-click';
						}
					}
					if ( isset( array_keys( $tmp['options'] )[2500] ) ) {
						$tmp['type']                                   = 'select2';
						$tmp['class']                                  .= " warehouse_fields_detect_select2";
						$tmp['custom_attributes']['data-type_select2'] = 'warehouse_field_' . $field['detect'];
					}
				}
			}
			if ( empty( $tmp ) ) {
				continue;
			}
			if ( ! empty( $field['required'] ) ) {
				$tmp['title']        .= '*';
				$tmp['wrap_class'][] = 'warehouse_field_required';
			}
			if ( ! empty( $field['toggle_by'] ) ) {
				$tmp['wrap_class'][] = 'tmds-warehouse_fields_' . $field['toggle_by'] . '-enable-class';
				if ( empty( $fields[ 'warehouse_fields_' . $field['toggle_by'] ]['value'] ) ) {
					$tmp['wrap_class'][] = 'tmds-hidden';
				}
				if ( ! in_array( 'tmds-toggle-field', $fields[ 'warehouse_fields_' . $field['toggle_by'] ]['wrap_class'] ) ) {
					$fields[ 'warehouse_fields_' . $field['toggle_by'] ]['wrap_class'][] = 'tmds-toggle-field';
				}
			}
			$fields[ 'warehouse_fields_' . $key ] = $tmp;
		}

		return $fields;
	}

	public function warehouse_options() {
		$warehouse_fields      = self::$settings->get_params( 'warehouse_fields' );
		$fields                = [
			'warehouse_enable'  => [
				'type'    => 'select',
				'options' => [
					'0' => esc_html__( 'None', 'tmds-woocommerce-temu-dropshipping' ),
					'1' => esc_html__( 'Always', 'tmds-woocommerce-temu-dropshipping' ),
					'2' => esc_html__( 'If the order’s shipping country is not within the regions supported by Temu', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'value'   => self::$settings->get_params( 'warehouse_enable' ),
				'title'   => esc_html__( 'Enable', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( 'If you have a warehouse address, you can use it in the Temu checkout field instead of the order’s shipping address.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'warehouse_country' => [
				'type'              => 'select',
				'name'              => 'warehouse_fields[country]',
				'options'           => self::$settings->get_countries(),
				'id'                => "warehouse_fields_country",
				'class'             => "warehouse_fields_country search",
				'value'             => $country = $warehouse_fields['country'] ?? WC()->countries->get_base_country(),
				'wrap_class'        => 'tmds-warehouse_enable-enable-class',
				'title'             => esc_html__( 'Country / Region', 'tmds-woocommerce-temu-dropshipping' ),
				'custom_attributes' => [
					'data-old_val' => $country,
				]
			],
		];
		$warehouse_field_class = 'tmds-warehouse_enable-enable-class';
		if ( empty( $fields['warehouse_enable']['value'] ) ) {
			$fields['warehouse_country']['wrap_class'] .= ' tmds-hidden';
			$warehouse_field_class                     .= ' tmds-hidden';
		}
		$fields += $this->get_warehouse_fields( $country, $warehouse_field_class );

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public function sync_options() {
		$change_statuses = array(
			'0'          => esc_html__( 'Do nothing', 'tmds-woocommerce-temu-dropshipping' ),
			'outofstock' => esc_html__( 'Set product out-of-stock', 'tmds-woocommerce-temu-dropshipping' ),
			'draft'      => esc_html__( 'Change product status to Draft', 'tmds-woocommerce-temu-dropshipping' ),
			'pending'    => esc_html__( 'Change product status to Pending', 'tmds-woocommerce-temu-dropshipping' ),
			'private'    => esc_html__( 'Change product status to Private', 'tmds-woocommerce-temu-dropshipping' ),
			'trash'      => esc_html__( 'Trash product', 'tmds-woocommerce-temu-dropshipping' ),
		);
		$fields          = [
			'sync_product_qty'                     => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'sync_product_qty' ),
				'title' => esc_html__( 'Sync quantity', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Sync quantity of WooCommerce products with Temu if products managed stock', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'sync_product_price'                   => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'sync_product_price' ),
				'title' => esc_html__( 'Sync price', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Sync price of WooCommerce products with Temu. All rules in Product Price tab will be applied to new price.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'sync_exclude_products'                => [
				'type'              => 'select2',
				'multiple'          => 1,
				'custom_attributes' => [
					'data-type_select2' => 'product'
				],
				'value'             => self::$settings->get_params( 'sync_exclude_products' ),
				'title'             => esc_html__( 'Exclude products', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'              => esc_html__( "List the products here if you want to exclude them from price syncing.", 'tmds-woocommerce-temu-dropshipping' ),
				'wrap_class'        => 'tmds-sync_product_price-enable-class',
			],
			'sync_exclude_cat'                     => [
				'type'              => 'select2',
				'multiple'          => 1,
				'custom_attributes' => [
					'data-type_select2' => 'category'
				],
				'value'             => self::$settings->get_params( 'sync_exclude_cat' ),
				'title'             => esc_html__( 'Exclude categories', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'              => esc_html__( "List the categories here if you want to exclude them from price syncing.", 'tmds-woocommerce-temu-dropshipping' ),
				'wrap_class'        => 'tmds-sync_product_price-enable-class',
			],
			'update_product_if_available_purchase' => [
				'type'    => 'select',
				'options' => $change_statuses + [ 'publish' => esc_html__( 'Change product status to Publish', 'tmds-woocommerce-temu-dropshipping' ) ],
				'value'   => self::$settings->get_params( 'update_product_if_available_purchase' ),
				'title'   => esc_html__( 'If a product is available purchase', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( "Select an action when the Temu product is available purchase", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'update_product_if_out_of_stock'       => [
				'type'    => 'select',
				'options' => $change_statuses,
				'value'   => self::$settings->get_params( 'update_product_if_out_of_stock' ),
				'title'   => esc_html__( 'If a product is out of stock', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( "Select an action when the Temu product is out-of-stock", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'update_product_if_not_available'      => [
				'type'    => 'select',
				'options' => $change_statuses,
				'value'   => self::$settings->get_params( 'update_product_if_not_available' ),
				'title'   => esc_html__( 'If a product is no longer available', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( "Select an action when the Temu product is no longer available", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'update_variation_if_not_available'    => [
				'type'    => 'select',
				'options' => [
					'0'          => esc_html__( 'Do nothing', 'tmds-woocommerce-temu-dropshipping' ),
					'disable'    => esc_html__( 'Disable', 'tmds-woocommerce-temu-dropshipping' ),
					'outofstock' => esc_html__( 'Set variation out-of-stock', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'value'   => self::$settings->get_params( 'update_variation_if_not_available' ),
				'title'   => esc_html__( 'If a variation is no longer available', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( "Select an action when a variation of an Temu product is no longer available", 'tmds-woocommerce-temu-dropshipping' ),
			],
		];
		if ( empty( $fields['sync_product_price']['value'] ) ) {
//			$fields['sync_include_products']['wrap_class'] = 'tmds-sync_product_price-enable-class tmds-hidden';
			$fields['sync_exclude_products']['wrap_class'] = 'tmds-sync_product_price-enable-class tmds-hidden';
//			$fields['sync_include_cat']['wrap_class']      = 'tmds-sync_product_price-enable-class tmds-hidden';
			$fields['sync_exclude_cat']['wrap_class']      = 'tmds-sync_product_price-enable-class tmds-hidden';
		}

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public function overriding_options() {
		$fields = [
			'overriding_keep_product'   => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_keep_product' ),
				'title' => esc_html__( 'Keep Woo product', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( "Instead of deleting old product to create a new one, it will update the overridden old product's prices/stock/attributes/variations based on the new data. This way, data such as reviews, metadata... will not be lost.", 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'overriding_link_only'      => [
				'type'       => 'checkbox',
				'value'      => self::$settings->get_params( 'overriding_link_only' ),
				'title'      => esc_html__( 'Link existing variations only', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'       => [
					__( 'Do not create new variations even if the number of variations you select when overriding/reimporting a product is greater than the number of variations of target product.', 'tmds-woocommerce-temu-dropshipping' ),
					__( 'If disabled, new variations will be created if not exist', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'wrap_class' => 'tmds-overriding_keep_product-enable-class',
			],
			'overriding_find_in_orders' => [
				'type'       => 'checkbox',
				'value'      => self::$settings->get_params( 'overriding_find_in_orders' ),
				'title'      => esc_html__( 'Find in unfulfilled orders', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'       => [
					__( 'Check for existence of overridden product in unfulfilled orders before overriding', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'wrap_class' => 'tmds-overriding_keep_product-disable-class',
			],
			'overriding_sku'            => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_sku' ),
				'title' => esc_html__( 'Override SKU', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( "Replace SKU of overridden product with new product's SKU", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'overriding_title'          => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_title' ),
				'title' => esc_html__( 'Override title', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( "Replace title of overridden product with new product's title", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'overriding_images'         => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_images' ),
				'title' => esc_html__( 'Override images', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( "Replace images and gallery of overridden product with new product's images and gallery", 'tmds-woocommerce-temu-dropshipping' ),
			],
			'overriding_description'    => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_description' ),
				'title' => esc_html__( 'Override description', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( "Replace description and short description of overridden product with new product's description and short description", 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'overriding_hide'           => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'overriding_hide' ),
				'title' => esc_html__( 'Hide options', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( "Do not show these options when overriding product", 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
		];
		if ( ! empty( $fields['overriding_keep_product']['value'] ) ) {
			$fields['overriding_find_in_orders']['wrap_class'] = 'tmds-overriding_keep_product-disable-class tmds-hidden';
		} else {
			$fields['overriding_link_only']['wrap_class'] = 'tmds-overriding_keep_product-enable-class tmds-hidden';
		}

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public function splitting_options() {
		$fields = [
			'split_auto_remove_attribute' => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'split_auto_remove_attribute' ),
				'title' => esc_html__( 'Automatically remove attribute', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( 'When splitting a product by a specific attribute, remove that attribute of split products', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
		];

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public function review_options() {
		$fields = [
			'product_import_review'     => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_import_review' ),
				'title' => esc_html__( 'Import review', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( ' Turn on this option to enable importing product reviews', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'product_review_limit'      => [
				'type'  => 'number',
				'value' => self::$settings->get_params( 'product_review_limit' ),
				'title' => esc_html__( 'Number of reviews imported', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_review_rating'     => [
				'type'     => 'select',
				'multiple' => 1,
				'options'  => [
					'1' => '&#9733;',
					'2' => '&#9733;&#9733;',
					'3' => '&#9733;&#9733;&#9733;',
					'4' => '&#9733;&#9733;&#9733;&#9733;',
					'5' => '&#9733;&#9733;&#9733;&#9733;&#9733;',
				],
				'value'    => self::$settings->get_params( 'product_review_rating' ),
				'title'    => esc_html__( 'Reviews rating', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'     => [
					__( 'The type of imported review', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'product_review_skip_empty' => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_review_skip_empty' ),
				'title' => esc_html__( 'Skip if empty', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( 'Don’t import reviews that have empty content', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'product_review_status'     => [
				'type'    => 'select',
				'options' => [
					'0' => esc_html__( 'Pending', 'tmds-woocommerce-temu-dropshipping' ),
					'1' => esc_html__( 'Approved', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'value'   => self::$settings->get_params( 'product_review_status' ),
				'title'   => esc_html__( 'Review status', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => [
					__( 'The status is set for the imported review', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
			'product_review_verified'   => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_review_verified' ),
				'title' => esc_html__( 'Set review verified', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => [
					__( 'Mark imported reviews as Verified owner', 'tmds-woocommerce-temu-dropshipping' ),
				],
			],
		];

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public function video_options() {
		$fields = [
			'product_import_video'       => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_import_video' ),
				'title' => esc_html__( 'Import video', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Product video will be imported as an external link and use original Temu video url', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_video_tab'          => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_video_tab' ),
				'title' => esc_html__( 'Product video tab', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Display product video on a separate tab in the frontend', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_video_tab_priority' => [
				'type'       => 'number',
				'value'      => self::$settings->get_params( 'product_video_tab_priority' ),
				'title'      => esc_html__( 'Video tab priority', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'       => esc_html__( 'You can adjust this value to change order of video tab', 'tmds-woocommerce-temu-dropshipping' ),
				'wrap_class' => 'tmds-product_video_tab-enable-class',
			],
			'product_video_full_tab'     => [
				'type'       => 'checkbox',
				'value'      => self::$settings->get_params( 'product_video_full_tab' ),
				'title'      => esc_html__( 'Make video full tab width', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'       => esc_html__( 'By default, product videos are displayed in their original width. Enable this option to make product videos have the same width as the tab.', 'tmds-woocommerce-temu-dropshipping' ),
				'wrap_class' => 'tmds-product_video_tab-enable-class',
			],
			'product_video_to_desc'      => [
				'type'    => 'select',
				'options' => [
					'0'      => esc_html__( 'None', 'tmds-woocommerce-temu-dropshipping' ),
					'before' => esc_html__( 'Before', 'tmds-woocommerce-temu-dropshipping' ),
					'after'  => esc_html__( 'After', 'tmds-woocommerce-temu-dropshipping' ),
				],
				'value'   => self::$settings->get_params( 'product_video_to_desc' ),
				'title'   => esc_html__( 'Add video to description', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( 'Automatically adds the product video to the description tab in the import list.', 'tmds-woocommerce-temu-dropshipping' ),
			],
		];
		if ( ! is_numeric( $fields['product_video_tab_priority']['value'] ) ) {
			$fields['product_video_tab_priority']['value'] = 25;
		}
		if ( empty( $fields['product_video_tab']['value'] ) ) {
			$fields['product_video_tab_priority']['wrap_class'] = 'tmds-product_video_tab-enable-class tmds-hidden';
			$fields['product_video_full_tab']['wrap_class']     = 'tmds-product_video_tab-enable-class tmds-hidden';
		}

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public static function price_options() {
		?>
        <div class="vi-ui styled fluid accordion">
            <div class="title active">
                <i class="dropdown icon"> </i>
				<?php esc_html_e( 'Exchange rates', 'tmds-woocommerce-temu-dropshipping' ); ?>
            </div>
            <div class="content active">
                <div class="vi-ui positive small message">
                    <p><?php esc_html_e( 'These are the exchange rates to convert from currency on Temu to your store currency when adding products to the import list.', 'tmds-woocommerce-temu-dropshipping' ) ?></p>
                    <p><?php esc_html_e( 'E.g: Your Woocommerce store currency is VND, exchange rate for USD is: 1 USD = 23 000 VND',
							'tmds-woocommerce-temu-dropshipping' ) ?></p>
                    <p><?php esc_html_e( '=> set "Exchange rate" 23 000 for row "USD"', 'tmds-woocommerce-temu-dropshipping' ) ?></p>
                </div>
				<?php
				$fields = [
					'exchange_rate_api'      => [
						'type'    => 'select',
						'options' => TMDSPRO_Price::get_supported_exchange_api(),
						'value'   => self::$settings->get_params( 'exchange_rate_api' ),
						'title'   => esc_html__( 'Exchange rate API', 'tmds-woocommerce-temu-dropshipping' ),
						'desc'    => [
							__( 'Exchange rate resources.', 'tmds-woocommerce-temu-dropshipping' ),
							__( 'Each Finance resource may not support some currencies. When this occurs, the rate of unsupported currency will not change, or the Finance API will return an error, and all currency rates will remain the same.', 'tmds-woocommerce-temu-dropshipping' ),
							__( 'If you select "Custom", you can custom exchange rate via "tmds_get_currency_exchange_rates" hook', 'tmds-woocommerce-temu-dropshipping' ),
						],
					],
					'exchange_rate_auto'     => [
						'type'  => 'checkbox',
						'value' => self::$settings->get_params( 'exchange_rate_auto' ),
						'title' => esc_html__( 'Update rate automatically', 'tmds-woocommerce-temu-dropshipping' ),
					],
					'exchange_rate_interval' => [
						'type'              => 'number',
						'value'             => self::$settings->get_params( 'exchange_rate_interval' ),
						'title'             => esc_html__( 'Update rate every', 'tmds-woocommerce-temu-dropshipping' ),
						'wrap_class'        => 'tmds-exchange_rate_auto-enable-class',
						'input_label'       => [
							'type'  => 'right',
							'label' => esc_html__( 'Day(s)', 'tmds-woocommerce-temu-dropshipping' ),
						],
						'custom_attributes' => [
							'min' => 1,
						],
					],
					'exchange_rate_hour'     => [
						'type'       => 'html',
						'title'      => esc_html__( 'Update rate every', 'tmds-woocommerce-temu-dropshipping' ),
						'wrap_class' => 'tmds-exchange_rate_auto-enable-class',
					],
				];
				ob_start();
				?>
                <div class="equal width fields">
                    <div class="field">
						<?php
						self::$settings::villatheme_render_field( 'exchange_rate_hour', [
							'type'              => 'number',
							'value'             => self::$settings->get_params( 'exchange_rate_hour' ),
							'input_label'       => [
								'type'  => 'right',
								'label' => esc_html__( 'Hour', 'tmds-woocommerce-temu-dropshipping' ),
							],
							'custom_attributes' => [
								'min' => 1,
							],
						] );
						?>
                    </div>
                    <div class="field">
						<?php
						self::$settings::villatheme_render_field( 'exchange_rate_minute', [
							'type'              => 'number',
							'value'             => self::$settings->get_params( 'exchange_rate_minute' ),
							'input_label'       => [
								'type'  => 'right',
								'label' => esc_html__( 'Minute', 'tmds-woocommerce-temu-dropshipping' ),
							],
							'custom_attributes' => [
								'min' => 1,
							],
						] );
						?>
                    </div>
                    <div class="field">
						<?php
						self::$settings::villatheme_render_field( 'exchange_rate_second', [
							'type'              => 'number',
							'value'             => self::$settings->get_params( 'exchange_rate_second' ),
							'input_label'       => [
								'type'  => 'right',
								'label' => esc_html__( 'Second', 'tmds-woocommerce-temu-dropshipping' ),
							],
							'custom_attributes' => [
								'min' => 1,
							],
						] );
						?>
                    </div>
                </div>
				<?php
				$fields['exchange_rate_hour']['html'] = ob_get_clean();
				if ( empty( $fields['exchange_rate_auto']['value'] ) ) {
					$fields['exchange_rate_interval']['wrap_class'] = 'tmds-exchange_rate_auto-enable-class tmds-hidden';
					$fields['exchange_rate_hour']['wrap_class']     = 'tmds-exchange_rate_auto-enable-class tmds-hidden';
				}
				$args = [
					'section_start' => [],
					'section_end'   => [],
					'fields'        => $fields
				];
				self::$settings::villatheme_render_table_field( $args );
				wc_get_template( 'admin/html-exchange-rates-setting.php',
					array( 'settings' => self::$settings ),
					'',
					TMDSPRO_TEMPLATES );
				?>
            </div>
        </div>
        <div class="vi-ui styled fluid accordion tmds-price-rules-wrap">
            <div class="title active">
                <i class="dropdown icon"> </i>
				<?php esc_html_e( 'Price rules', 'tmds-woocommerce-temu-dropshipping' ); ?>
            </div>
            <div class="content active">
                <div class="vi-ui positive small message">
					<?php esc_html_e( 'For each price, first matched rule(from top to bottom) will be applied. If no rules match, the default will be used.',
						'tmds-woocommerce-temu-dropshipping' ) ?>
                </div>
				<?php
				wc_get_template( 'admin/html-price-rule-setting.php',
					array( 'settings' => self::$settings ),
					'',
					TMDSPRO_TEMPLATES );
				?>
            </div>
        </div>
		<?php
		return [];
	}

	public static function product_options() {
		$fields = [
			'product_status'                => [
				'type'    => 'select',
				'options' => self::$settings::get_product_status_options(),
				'value'   => self::$settings->get_params( 'product_status' ),
				'title'   => esc_html__( 'Product status', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_sku'                   => [
				'type'  => 'text',
				'value' => self::$settings->get_params( 'product_sku' ),
				'title' => esc_html__( 'Product sku', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( '{temu_product_id}: ID of Temu product', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'auto_generate_unique_sku'      => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'auto_generate_unique_sku' ),
				'title' => esc_html__( 'Auto generate sku', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'When importing product in Import list, automatically generate unique sku by adding increment if sku exists', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'use_global_attributes'         => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'use_global_attributes' ),
				'title' => esc_html__( 'Use global attributes', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => wp_kses_post( __( 'Global attributes will be used instead of custom attributes. More details about <a href="https://woocommerce.com/document/managing-product-taxonomies/#product-attributes" target="_blank">Product attributes</a>',
					'tmds-woocommerce-temu-dropshipping' ) ),
			],
			'simple_if_one_variation'       => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'simple_if_one_variation' ),
				'title' => esc_html__( 'Import as simple product', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'If a product has only 1 variation or you select only 1 variation to import, that product will be imported as simple product. Variation sku and attributes will not be used.',
					'tmds-woocommerce-temu-dropshipping' ),
			],
			'catalog_visibility'            => [
				'type'    => 'select',
				'options' => self::$settings::get_catalog_visibility_options(),
				'value'   => self::$settings->get_params( 'catalog_visibility' ),
				'title'   => esc_html__( 'Catalog visibility', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( 'This setting determines which shop pages products will be listed on.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_import_specifications' => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_import_specifications' ),
				'title' => esc_html__( 'Import specifications', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Import Temu product specification as Woo product additional information.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_description'           => [
				'type'    => 'select',
				'options' => array(
					'none'                           => esc_html__( 'None', 'tmds-woocommerce-temu-dropshipping' ),
					'item_specifics'                 => esc_html__( 'Item specifics', 'tmds-woocommerce-temu-dropshipping' ),
					'description'                    => esc_html__( 'Product Description', 'tmds-woocommerce-temu-dropshipping' ),
					'item_specifics_and_description' => esc_html__( 'Item specifics &amp; Product Description', 'tmds-woocommerce-temu-dropshipping' ),
				),
				'value'   => self::$settings->get_params( 'product_description' ),
				'title'   => esc_html__( 'Product description', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( 'Default product description in the import list.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'download_description_images'   => [
				'type'       => 'checkbox',
				'value'      => self::$settings->get_params( 'download_description_images' ),
				'wrap_class' => 'tmds-use_external_image-disable-class',
				'title'      => esc_html__( 'Import description images', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'       => esc_html__( 'Upload images in product description if any. If disabled, images in description will use the original Temu cdn links', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_gallery'               => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_gallery' ),
				'title' => esc_html__( 'Default select product images', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'First image will be selected as product image and other images(except images from product description) are selected in gallery when adding product to import list', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'use_external_image'            => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'use_external_image' ),
				'title' => esc_html__( 'Use external links for images', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'This helps save storage by using original Temu image URLs but you will not be able to edit them', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'disable_background_process'    => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'disable_background_process' ),
				'title' => esc_html__( 'Disable background process', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'When importing products, instead of letting their images import in the background, main product image will be uploaded immediately while gallery and variation images(if any) will be added to Failed images page so that you can go there to import them manually.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_import_cat'            => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'product_import_cat' ),
				'title' => esc_html__( 'Import categories', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'When importing products from Temu, their categories will be added to the product categories if they exist.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_categories'            => [
				'type'              => 'select2',
				'multiple'          => 1,
				'custom_attributes' => [
					'data-type_select2' => 'category'
				],
				'value'             => self::$settings->get_params( 'product_categories' ),
				'title'             => esc_html__( 'Default categories', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'              => esc_html__( 'The products in the import list will be added to these categories if no category is found', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_tags'                  => [
				'type'              => 'select2',
				'multiple'          => 1,
				'custom_attributes' => [
					'data-type_select2' => 'tag'
				],
				'value'             => self::$settings->get_params( 'product_tags' ),
				'title'             => esc_html__( 'Default product tags', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'              => esc_html__( 'Imported products will be added these tags.', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'product_shipping_class'        => [
				'type'    => 'select',
				'options' => [ '0' => esc_html__( 'No shipping class', 'tmds-woocommerce-temu-dropshipping' ) ] + self::$settings::get_shipping_class_options(),
				'value'   => self::$settings->get_params( 'product_shipping_class' ),
				'title'   => esc_html__( 'Default shipping class', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'    => esc_html__( 'Shipping class selected here will also be selected by default in the Import list', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'variation_visible'             => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'variation_visible' ),
				'title' => esc_html__( 'Product variations is visible on product page', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Enable to make variations of imported products visible on product page', 'tmds-woocommerce-temu-dropshipping' ),
			],
			'manage_stock'                  => [
				'type'  => 'checkbox',
				'value' => self::$settings->get_params( 'manage_stock' ),
				'title' => esc_html__( 'Manage stock', 'tmds-woocommerce-temu-dropshipping' ),
				'desc'  => esc_html__( 'Enable manage stock and import product inventory. If this option is disabled, products stock status will be set "Instock" and product inventory will not be imported', 'tmds-woocommerce-temu-dropshipping' ),
			],
		];
		if ( ! self::exmage_active() ) {
			ob_start();
			self::get_exmage_after_desc();
			$after_desc                   = ob_get_clean();
			$fields['use_external_image'] += [
				'disabled'   => 1,
				'after_desc' => $after_desc,
			];
		} elseif ( ! empty( $fields['use_external_image']['value'] ) ) {
			$fields['download_description_images']['wrap_class'] = 'tmds-use_external_image-disable-class tmds-hidden';
		}

		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => $fields
		];
	}

	public static function general_options() {
		return [
			'section_start' => [],
			'section_end'   => [],
			'fields'        => [
				'enable'                    => [
					'type'  => 'checkbox',
					'value' => self::$settings->get_params( 'enable' ),
					'title' => esc_html__( 'Enable', 'tmds-woocommerce-temu-dropshipping' ),
					/* translators: TMDS plugin name */
					'desc'  => sprintf( esc_html__( 'You need to enable this to let %s connect to your store', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),
				],
				'install_and_use_extension' => [
					'type'  => 'html',
					'html'  => sprintf( '<p><a href="https://downloads.villatheme.com/?download=tmds-extension" target="_blank">%s</a></p>
                    <p class="description"><strong>*</strong>%s</p>
                    <div class="vi-ui fluid styled accordion tmds-video-guide-wrap">
                        <div class="title active">
                            <i class="dropdown icon"></i>
							%s
                        </div>
                        <div class="content active">
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/1HazQ0zspns?si=6IhxQla7STTxFoK6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <div class="title">
                            <i class="dropdown icon"></i>
							%s
                        </div>
                        <div class="content">
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/mVUehd6WFKQ?si=-aAY2m9OT1e-v8L5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                    </div>',
						/* translators: TMDS plugin name */
						sprintf( esc_html__( 'Add %s Extension', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),
						esc_html__( 'To import Temu products, this chrome extension is required.', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'Install and use extension', 'tmds-woocommerce-temu-dropshipping' ),
						esc_html__( 'How to use plugin', 'tmds-woocommerce-temu-dropshipping' ) ),
					'title' => esc_html__( 'Video guide', 'tmds-woocommerce-temu-dropshipping' ),
				],
			]
		];
	}

	public function admin_enqueue_scripts() {
		$menu_slug = self::$settings::$prefix;
		$enqueue   = false;
		$page      = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
		if ( in_array( $page, [
			$menu_slug,
			$menu_slug . '-import-list',
			$menu_slug . '-imported',
			$menu_slug . '-orders',
			$menu_slug . '-settings',
			$menu_slug . '-error-images',
			$menu_slug . '-logs',
		] ) ) {
			$enqueue = true;
		} elseif ( isset( $_GET['tmds_setup_wizard'], $_GET['_wpnonce'] ) && ! empty( $_GET['tmds_setup_wizard'] )
		           && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'tmds_setup' )
		) {
			$enqueue = true;
			wp_enqueue_script( 'wc-enhanced-select' );
		}
		if ( ! $enqueue ) {
			return;
		}
		self::$settings::enqueue_style(
			array(
				$menu_slug .'semantic-ui-button',
				$menu_slug .'semantic-ui-checkbox',
				$menu_slug .'semantic-ui-dropdown',
				$menu_slug .'semantic-ui-segment',
				$menu_slug .'semantic-ui-form',
				$menu_slug .'semantic-ui-label',
				$menu_slug .'semantic-ui-input',
				$menu_slug .'semantic-ui-popup',
				$menu_slug .'semantic-ui-icon',
				$menu_slug .'semantic-ui-table',
				$menu_slug .'transition',
				$menu_slug .'select2',
				$menu_slug .'semantic-ui-message',
			),
			array(
				'button',
				'checkbox',
				'dropdown',
				'segment',
				'form',
				'label',
				'input',
				'popup',
				'icon',
				'table',
				'transition',
				'select2',
				'message'
			),
			array( 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 )
		);
		self::$settings::enqueue_style(
			array( $menu_slug . '-admin-settings', 'villatheme-show-message' ),
			array( 'admin-settings', 'villatheme-show-message' ),
			array( 0, 0 )
		);
		self::$settings::enqueue_script(
			array( $menu_slug .'semantic-ui-address', $menu_slug .'semantic-ui-checkbox', $menu_slug .'semantic-ui-dropdown', $menu_slug .'transition', $menu_slug .'select2' ),
			array( 'address', 'checkbox', 'dropdown', 'transition', 'select2' ),
			array( 1, 1, 1, 1, 1 )
		);
		self::$settings::enqueue_script(
			array( 'villatheme-show-message' ),
			array( 'villatheme-show-message' ),
			array( 0 ),
			array( array( 'jquery' ) )
		);
		$params          = array(
			'ajax_url'          => admin_url( 'admin-ajax.php' ),
			'settings_page_url' => esc_url( admin_url( "admin.php?page={$menu_slug}-settings" ) ),
			'nonce'             => self::$settings::create_ajax_nonce()
		);
		$localize_script = $menu_slug . '-admin-settings';
		if ( in_array( $page, [ $menu_slug . '-imported', $menu_slug . '-import-list', $menu_slug, $menu_slug . '-settings' ] ) ) {
			self::$settings::enqueue_style(
				array(
					$menu_slug .'semantic-ui-accordion',
					$menu_slug .'semantic-ui-menu',
					$menu_slug .'semantic-ui-tab',
				),
				array( 'accordion', 'menu', 'tab' ),
				array( 1, 1, 1 )
			);
			self::$settings::enqueue_script(
				array(
					$menu_slug .'semantic-ui-accordion',
					$menu_slug .'semantic-ui-tab',
				),
				array( 'accordion', 'tab' ),
				array( 1, 1 )
			);
			wp_enqueue_script( 'wc-enhanced-select' );
		}
		switch ( $page ) {
			case $menu_slug . '-orders':
				wp_dequeue_style( $menu_slug . '-admin-settings' );
				self::$settings::enqueue_style(
					array(
						$menu_slug .'semantic-ui-menu',
						$menu_slug .'semantic-ui-tab',
						$menu_slug . '-fulfill-orders'
					),
					array( 'menu', 'tab', 'fulfill-orders' ),
					array( 1, 1, 0 )
				);
				self::$settings::enqueue_script(
					array( $menu_slug . '-fulfill-orders' ),
					array( 'fulfill-orders' ),
					array( 0 ),
					array( array( 'jquery' ) )
				);
				$localize_script                            = $menu_slug . '-fulfill-orders';
				TMDSPRO_Admin_Fulfill_Orders::$order_status = ! empty( $_GET['order_status'] ) ? sanitize_text_field( wp_unslash( $_GET['order_status'] ) ) : 'to_order';
				$params                                     = array_merge( $params, array(
					'fulfill_url'        => self::$settings::get_fulfill_url(),
					'i18n_empty_item_id' => esc_html__( 'Please choose at least one order item to fulfill.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_multi_region'  => esc_html__( 'Please select order items that belong to the same region.', 'tmds-woocommerce-temu-dropshipping' ),
				) );
				break;
			case $menu_slug . '-error-images':
				wp_dequeue_style( $menu_slug . '-admin-settings' );
				self::$settings::enqueue_style(
					array( $menu_slug .'semantic-ui-message', $menu_slug . '-admin-error-images' ),
					array( 'message', 'error-images' ),
					array( 1 )
				);
				self::$settings::enqueue_script(
					array( $menu_slug . '-admin-error-images' ),
					array( 'error-images' ),
					array( 0 ),
					array( array( 'jquery' ) )
				);
				$localize_script = $menu_slug . '-admin-error-images';
				$params          = array_merge( $params, array(
					'i18n_confirm_delete'     => esc_html__( 'Are you sure you want to delete this item?', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_confirm_delete_all' => esc_html__( 'Are you sure you want to delete all item(s) on this page?', 'tmds-woocommerce-temu-dropshipping' ),
				) );
				break;
			case $menu_slug . '-imported':
				self::$settings::enqueue_script(
					array( $menu_slug . '-admin-imported' ),
					array( 'imported' ),
					array( 0 ),
					array( array( 'jquery' ) )
				);
				$localize_script = $menu_slug . '-admin-imported';
				$params          = array_merge( $params, array(
					'site_url'        => esc_url( site_url() ),
					'import_list_url' => esc_url( admin_url( "admin.php?page={$menu_slug}" ) ),
					'check'           => esc_attr__( 'Check', 'tmds-woocommerce-temu-dropshipping' ),
					'override'        => esc_attr__( 'Override', 'tmds-woocommerce-temu-dropshipping' ),
				) );
				break;
			case $menu_slug:
			case $menu_slug . '-import-list':
				self::$settings::enqueue_script(
					array( $menu_slug . '-admin-import-list' ),
					array( 'import-list' ),
					array( 0 ),
					array( array( 'jquery', 'jquery-ui-sortable' ) )
				);
				$localize_script = $menu_slug . '-admin-import-list';
				$params          = array_merge( $params, array(
					'i18n_bulk_import_product_confirm'       => esc_html__( 'Import all selected product(s)?', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_bulk_remove_product_confirm'       => esc_html__( 'Remove selected product(s) from import list?', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_remove_product_confirm'            => esc_html__( 'Remove this product from import list?', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_empty_variation_error'             => esc_html__( 'Please select at least 1 variation to import.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_empty_price_error'                 => esc_html__( 'Regular price can not be empty.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_sale_price_error'                  => esc_html__( 'Sale price must be smaller than regular price.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_not_found_error'                   => esc_html__( 'No product found.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_import_all_confirm'                => esc_html__( 'Import all products on this page to your WooCommerce store?',
						'tmds-woocommerce-temu-dropshipping' ),
					'i18n_split_product_no_variations'       => esc_html__( 'Please select variations to split', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_split_product_too_many_variations' => esc_html__( 'Please select less variations to split', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_split_product_message'             => esc_html__( 'If product is split successfully, page will be reloaded automatically to load new products.', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_empty_attribute_name'              => esc_html__( 'Attribute name can not be empty', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_invalid_attribute_values'          => esc_html__( 'Attribute value can not be empty or duplicated', 'tmds-woocommerce-temu-dropshipping' ),
					'i18n_remove'                            => esc_html__( 'Are you sure to remove this?', 'tmds-woocommerce-temu-dropshipping' ),
				) );
				break;
			case $menu_slug . '-settings':
				self::$settings::enqueue_script(
					array( $menu_slug . '-admin-settings' ),
					array( 'admin-settings' ),
					array( 0 ),
					array( array( 'jquery' ) )
				);
				break;
			default:
				self::$settings::enqueue_style(
					array( $menu_slug .'semantic-ui-accordion', $menu_slug .'semantic-ui-step', ),
					array( 'accordion', 'step' ),
					array( 1, 1 )
				);
				self::$settings::enqueue_script(
					array($menu_slug . 'semantic-ui-accordion', $menu_slug . '-admin-settings' ),
					array( 'accordion', 'admin-settings' ),
					array( 1, 0 )
				);
		}
		wp_localize_script( $localize_script, $menu_slug . '_params', $params );
	}

	public function add_ajax_events() {
		$prefix = self::$settings::$prefix;
		$events = [
			$prefix . '_search_products'        => array(
				'function' => 'search_products',
				'class'    => $this,
			),
			$prefix . '_get_warehouse_address'  => array(
				'function' => 'get_warehouse_address',
				'class'    => $this,
			),
			$prefix . '_get_fulfill_map_html'   => array(
				'function' => 'get_fulfill_map_html',
				'class'    => $this,
			),
			$prefix . '_get_warehouse_fields'   => array(
				'function' => 'warehouse_fields_html',
				'class'    => $this,
			),
			$prefix . '_currency_update_rate'   => array(
				'function' => 'currency_exchange_update',
				'class'    => $this,
			),
			$prefix . '_setup_install_plugins'  => array(
				'function' => 'install_plugins',
				'class'    => TMDSPRO_Admin_Class_Prefix . 'Setup_Wizard',
			),
			$prefix . '_setup_activate_plugins' => array(
				'function' => 'activate_plugins',
				'class'    => TMDSPRO_Admin_Class_Prefix . 'Setup_Wizard',
			),
		];
		self::ajax_events( apply_filters( 'tmds_admin_ajax_events', $events, $prefix ) );
	}

	public static function ajax_events( $events ) {
		if ( ! is_array( $events ) || empty( $events ) ) {
			return;
		}
		foreach ( $events as $action => $arg ) {
			if ( ! isset( $arg['function'] ) ) {
				continue;
			}
			$class = $arg['class'] ?? __CLASS__;
			add_action( "wp_ajax_$action", [ $class, $arg['function'] ] );
			if ( ! empty( $arg['nopriv'] ) ) {
				add_action( "wp_ajax_nopriv_$action", [ $class, $arg['function'] ] );
			}
		}
	}

	public function search_products() {
		$result = [ 'success' => false ];
		if ( ! check_ajax_referer( 'search-products', 'security', false ) ) {
			$result['message'] = [ 'Invalid nonce' ];
			wp_send_json( $result );
		}
		$keyword              = isset( $_GET['term'] ) ? sanitize_text_field( wp_unslash( $_GET['term'] ) ) : '';
		$exclude_tmds_product = isset( $_GET['exclude_tmds_product'] ) ? sanitize_text_field( wp_unslash( $_GET['exclude_tmds_product'] ) ) : '';
		if ( empty( $keyword ) ) {
			$result['message'] = [ 'Please enter product title to search' ];
			wp_send_json( $result );
		}
		$post_status = array( 'publish' );
		if ( current_user_can( 'edit_private_products' ) ) {
			if ( $exclude_tmds_product ) {
				$post_status = array(
					'private',
					'draft',
					'pending',
					'publish'
				);
			} else {
				$post_status = array(
					'private',
					'publish'
				);
			}
		}
		$arg = array(
			'post_type'      => 'product',
			'posts_per_page' => 50,
			's'              => $keyword,
			'post_status'    => apply_filters( 'tmds_search_product_statuses', $post_status )
		);
		if ( $exclude_tmds_product ) {
			$arg['meta_query'] = array(//phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'AND',
				array(
					'key'     => '_tmds_product_id',
					'compare' => 'NOT EXISTS'
				)
			);
		}

		$the_query      = new \WP_Query( $arg );
		$found_products = [];

		if ( $the_query->have_posts() ) {
			while ( $the_query->have_posts() ) {
				$the_query->the_post();
				$product_id       = get_the_ID();
				$found_products[] = array(
					'id'   => $product_id,
					'text' => "(#{$product_id}) " . get_the_title()
				);
			}
		}
		wp_reset_postdata();
		wp_send_json( $found_products );
	}

	public function get_warehouse_address() {
		$result = [ 'success' => false ];
		if ( ! current_user_can( apply_filters( "villatheme_tmds_admin_sub_menu_capability", 'manage_woocommerce', "tmds-settings" ) ) ) {
			$result['message'] = [ 'Missing role' ];
			wp_send_json( $result );
		}
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = [ 'Invalid nonce' ];
			wp_send_json( $result );
		}
		$country     = isset( $_POST['country'] ) ? sanitize_text_field( wp_unslash( $_POST['country'] ) ) : '';
		$region_id   = isset( $_POST['region_id'] ) ? sanitize_text_field( wp_unslash( $_POST['region_id'] ) ) : '';
		$is_postcode = isset( $_POST['is_postcode'] ) ? sanitize_text_field( wp_unslash( $_POST['is_postcode'] ) ) : '';
		if ( ! $country ) {
			$result['message'] = [ 'Please select a country' ];
			wp_send_json( $result );
		}
		if ( ! $region_id ) {
			$result['message'] = [ 'Please select a region' ];
			wp_send_json( $result );
		}
		if ( $is_postcode ) {
			$is_postcode_options = isset( $_POST['is_postcode_options'] ) ? sanitize_text_field( wp_unslash( $_POST['is_postcode_options'] ) ) : '';
			$options             = self::$settings::get_address_postcode( $country, $region_id, $is_postcode_options );
			if ( is_scalar( $options ) ) {
				$result['success'] = true;
				$result['data']    = [
					'data' => $options,
					'show' => 1,
					'type' => 'val',
				];
			}
			if ( is_array( $options ) && ! empty( $options ) ) {
				$options = [ '' => esc_html__( 'Select', 'tmds-woocommerce-temu-dropshipping' ) ] + $options;
				ob_start();
				foreach ( $options as $v ) {
					?>
                    <option value="<?php echo esc_attr( $v ) ?>"><?php echo wp_kses_post( $v ) ?></option>
					<?php
				}
				$result['data']    = [
					'data' => ob_get_clean(),
					'show' => 1,
					'type' => 'html',
				];
				$result['success'] = true;
			}
		} else {
			$options = [ '' => esc_html__( 'Select', 'tmds-woocommerce-temu-dropshipping' ) ];
			$options += self::$settings::get_address_children( $country, $region_id );
			ob_start();
			foreach ( $options as $k => $v ) {
				?>
                <option value="<?php echo esc_attr( $k ) ?>"><?php echo wp_kses_post( $v ) ?></option>
				<?php
			}
			$result['data']    = [
				'data' => ob_get_clean(),
				'show' => 1,
				'type' => 'html',
			];
			$result['success'] = true;
		}
		wp_send_json( $result );
	}

	public function get_fulfill_map_html() {
		$result = [ 'success' => false ];
		if ( ! current_user_can( apply_filters( "villatheme_tmds_admin_sub_menu_capability", 'manage_woocommerce', "tmds-settings" ) ) ) {
			$result['message'] = [ 'Missing role' ];
			wp_send_json( $result );
		}
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = [ 'Invalid nonce' ];
			wp_send_json( $result );
		}
		$countries = isset( $_POST['countries'] ) ? wc_clean( wp_unslash( $_POST['countries'] ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( empty( $countries ) ) {
			$result['message'] = [ 'Please select a country' ];
			wp_send_json( $result );
		}
		ob_start();
		$this->render_fulfill_map_fields( $countries );
		$result['html']    = ob_get_clean();
		$result['success'] = true;
		wp_send_json( $result );
	}

	public function warehouse_fields_html() {
		$result = [ 'success' => false ];
		if ( ! current_user_can( apply_filters( "villatheme_tmds_admin_sub_menu_capability", 'manage_woocommerce', "tmds-settings" ) ) ) {
			$result['message'] = [ 'Missing role' ];
			wp_send_json( $result );
		}
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = [ 'Invalid nonce' ];
			wp_send_json( $result );
		}
		$country = isset( $_POST['country'] ) ? sanitize_text_field( wp_unslash( $_POST['country'] ) ) : '';
		if ( ! $country ) {
			$result['message'] = [ 'Please select a country' ];
			wp_send_json( $result );
		}
		$warehouse_fields = $this->get_warehouse_fields( $country );
		if ( is_array( $warehouse_fields ) && ! empty( $warehouse_fields ) ) {
			ob_start();
			self::$settings::villatheme_render_table_field( [ 'fields' => $warehouse_fields ] );
			$result['html']    = ob_get_clean();
			$result['success'] = true;
		}
		wp_send_json( $result );
	}

	public function currency_exchange_update() {
		$result = [ 'success' => false ];
		if ( ! current_user_can( apply_filters( "villatheme_tmds_admin_sub_menu_capability", 'manage_woocommerce', "tmds-settings" ) ) ) {
			$result['message'] = [ 'Missing role' ];
			wp_send_json( $result );
		}
		$action = 'admin_ajax';
		if ( apply_filters( 'tmds_verify_ajax_nonce', true, $action ) &&
		     ! check_ajax_referer( 'tmds_' . $action, 'tmds_nonce', false ) ) {
			$result['message'] = [ 'Invalid nonce' ];
			wp_send_json( $result );
		}
		$curcy = isset( $_POST['curcy'] ) ? wc_clean( wp_unslash( $_POST['curcy'] ) ) : [];// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$api   = isset( $_POST['api'] ) ? sanitize_text_field( wp_unslash( $_POST['api'] ) ) : '';
		if ( ! is_array( $curcy ) || empty( $curcy ) ) {
			$result['message'] = [ esc_html__( 'Please choose a currency to get the exchange rate', 'tmds-woocommerce-temu-dropshipping' ) ];
		} elseif ( $api ) {
			$rates = $message = $decimals = [];
			foreach ( $curcy as $item ) {
				if ( empty( $item['currency'] ) ) {
					continue;
				}
				$decimal = $item['decimal'] ?? '';
				$rate    = TMDSPRO_Price::get_exchange_rate( $api, '', $decimal, $item['currency'] );
				if ( $rate !== false ) {
					$rates[ $item['currency'] ]    = $rate;
					$decimals[ $item['currency'] ] = $decimal;
				} else {
					$message[] = $item['currency'] . esc_html__( ': can not get exchange rate', 'tmds-woocommerce-temu-dropshipping' );
				}
			}
			$result['decimals'] = $decimals;
			$result['rates']    = $rates;
			$result['message']  = $message;
			if ( empty( $result['message'] ) ) {
				$result['success'] = true;
			}
		} else {
			$result['message'] = [ esc_html__( 'Empty API', 'tmds-woocommerce-temu-dropshipping' ) ];
		}
		wp_send_json( $result );
	}

	public static function exmage_active() {
		if ( defined( 'EXMAGE_WP_IMAGE_PREMIUM_LINKS_DIR' ) ) {
			return 'EXMAGE\Admin\EXMAGEAdmin';
		}
		if ( class_exists( 'EXMAGE_WP_IMAGE_LINKS' ) ) {
			return 'EXMAGE_WP_IMAGE_LINKS';
		}

		return false;
	}

	public static function get_exmage_after_desc() {
		$plugin_slug        = 'exmage-wp-image-links';
		$installed_plugins  = get_plugins();
		$active_plugins     = TMDSPRO_Admin_Setup_Wizard::get_active_plugins();
		$recommended_plugin = TMDSPRO_Admin_Setup_Wizard::recommended_plugins()[ $plugin_slug ] ?? '';
		if ( empty( $recommended_plugin ) ) {
			return;
		}
		$tmp         = '';
		$pro_install = false;
		if ( ! empty( $recommended_plugin['pro'] ) ) {
			$pro_file = "{$recommended_plugin['pro']}/{$recommended_plugin['pro']}.php";
			if ( isset( $installed_plugins[ $pro_file ] ) ) {
				$pro_install = true;
				if ( ! isset( $active_plugins[ $recommended_plugin['pro'] ] ) && ! isset( $active_plugins[ $plugin_slug ] ) && current_user_can( 'activate_plugin', $pro_file ) ) {
					$tmp = sprintf( '<a href="%s" target="_blank" class="button button-primary">%s</a>',
						esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'activate', 'plugin' => $pro_file ), self_admin_url( 'plugins.php' ) ), "activate-plugin_{$pro_file}" ) ),
						esc_html__( 'Activate now', 'tmds-woocommerce-temu-dropshipping' ) );
				}
			}
		}
		if ( ! $pro_install ) {
			$plugin_file = "{$plugin_slug}/{$plugin_slug}.php";
			if ( ! isset( $installed_plugins[ $plugin_file ] ) ) {
				if ( current_user_can( 'install_plugins' ) ) {
					$tmp = sprintf( '<a href="%s" target="_blank" class="button button-primary">%s</a>',
						esc_url( wp_nonce_url( self_admin_url( "update.php?action=install-plugin&plugin={$plugin_slug}" ), "install-plugin_{$plugin_slug}" ) ),
						esc_html__( 'Install now', 'tmds-woocommerce-temu-dropshipping' ) );
				}
			} elseif ( ! isset( $active_plugins[ $plugin_slug ] ) ) {
				if ( current_user_can( 'activate_plugin', $plugin_file ) ) {
					$tmp = sprintf( '<a href="%s" target="_blank" class="button button-primary">%s</a>',
						esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'activate', 'plugin' => $plugin_file ), self_admin_url( 'plugins.php' ) ), "activate-plugin_{$plugin_file}" ) ),
						esc_html__( 'Activate now', 'tmds-woocommerce-temu-dropshipping' ) );
				}
			}
		}
		?>
        <p class="description">
            <strong>*</strong>
			<?php echo wp_kses( sprintf( esc_html__( 'To use this feature, you have to install and activate %s plugin. %s', 'tmds-woocommerce-temu-dropshipping' ),// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment, WordPress.WP.I18n.UnorderedPlaceholdersText
				'<a target="_blank" href="https://wordpress.org/plugins/exmage-wp-image-links/">EXMAGE – WordPress Image Links</a>', $tmp ), TMDSPRO_DATA::filter_allowed_html() ); ?>
        </p>
		<?php
	}
}