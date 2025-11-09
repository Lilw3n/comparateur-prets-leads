<?php

defined( 'ABSPATH' ) || exit;

class TMDSPRO_Admin_Recommend {
	protected $dismiss;
	protected static $settings;

	public function __construct() {
		self::$settings = TMDSPRO_DATA::get_instance();
		$this->dismiss  = 'villatheme_' . self::$settings::$prefix . '_install_recommended_plugins_dismiss';
		add_action( 'admin_menu', array( $this, 'admin_menu' ), 30 );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Register a custom menu page.
	 */
	public function admin_menu() {
		$menu_slug = self::$settings::$prefix . '-recommend';
		add_submenu_page(
			self::$settings::$prefix,
			sprintf( esc_html__( 'Recommended plugins for %s', 'tmds-woocommerce-temu-dropshipping' ), TMDSPRO_NAME ),// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
			esc_html__( 'Recommended Plugins', 'tmds-woocommerce-temu-dropshipping' ),
			apply_filters( 'villatheme_' . self::$settings::$prefix . '_admin_sub_menu_capability', 'manage_options', $menu_slug ),
			$menu_slug,
			array( $this, 'page_callback' )
		);
	}

	public function admin_enqueue_scripts() {
		$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';
		if ( $page === self::$settings::$prefix . '-recommend' ) {
			wp_dequeue_style( 'eopa-admin-css' );
			self::$settings::enqueue_style(
				array(
					'semantic-ui-button',
					'semantic-ui-segment',
					'semantic-ui-form',
					'semantic-ui-icon',
					'semantic-ui-table'
				),
				array( 'button', 'segment', 'form', 'icon', 'table' ),
				array( 1, 1, 1, 1, 1 )
			);
			wp_add_inline_style( 'villatheme-support', '.fist-col {min-width: 300px;}.vi-wad-plugin-name {font-weight: 600;}.vi-wad-plugin-name a {text-decoration: none;}' );
		} elseif (strpos( $page , self::$settings::$prefix ) === 0 ) {
			$prefix        = self::$settings::$prefix;
			$dismiss_nonce = isset( $_REQUEST[ $prefix . '_dismiss_nonce' ] ) ? sanitize_text_field( wp_unslash( $_REQUEST[ $prefix . '_dismiss_nonce' ] ) ) : '';
			if ( wp_verify_nonce( $dismiss_nonce, $prefix . '_dismiss_nonce' ) && ! get_option( $this->dismiss ) ) {
				update_option( $this->dismiss, time() );
			}
			if ( ! get_option( $this->dismiss ) ) {
				add_action( 'admin_notices', array( $this, 'admin_notices' ) );
			}
		}
	}

	public function admin_notices() {
		global $pagenow;
		if ( $pagenow === 'update.php' || get_option( $this->dismiss ) ) {
			return;
		}
		$installed_plugins   = get_plugins();
		$active_plugins      = TMDSPRO_Admin_Setup_Wizard::get_active_plugins();
		$recommended_plugins = TMDSPRO_Admin_Setup_Wizard::recommended_plugins();
		$notices             = [];
		$prefix              = self::$settings::$prefix;
		foreach ( $recommended_plugins as $recommended_plugin ) {
			$plugin_slug = $recommended_plugin['slug'];
			if ( empty( $recommended_plugin['message_not_install'] ) && empty( $recommended_plugin['message_not_active'] ) ) {
				continue;
			}
			$pro_install = false;
			$button      = '';
			if ( ! empty( $recommended_plugin['pro'] ) ) {
				$pro_file = "{$recommended_plugin['pro']}/{$recommended_plugin['pro']}.php";
				if ( isset( $installed_plugins[ $pro_file ] ) ) {
					$pro_install = true;
					if ( ! empty( $recommended_plugin['message_not_active'] ) && ! isset( $active_plugins[ $recommended_plugin['pro'] ] ) && ! isset( $active_plugins[ $plugin_slug ] ) ) {
						if ( current_user_can( 'activate_plugin', $pro_file ) ) {
							$button = sprintf( '<br><br> <a href="%s" target="_blank" class="button button-primary">%s %s</a>',
								esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'activate', 'plugin' => $pro_file ), self_admin_url( 'plugins.php' ) ), "activate-plugin_{$pro_file}" ) ),
								esc_html__( 'Activate', 'tmds-woocommerce-temu-dropshipping' ),
								$recommended_plugin['name'] );
						}
						$notices[] = $recommended_plugin['message_not_active'] . $button;
					}
				}
			}
			if ( $pro_install ) {
				continue;
			}
			$plugin_file = "{$plugin_slug}/{$plugin_slug}.php";
			if ( ! isset( $installed_plugins[ $plugin_file ] ) && ! empty( $recommended_plugin['message_not_install'] ) ) {
				if ( current_user_can( 'install_plugins' ) ) {
					$button = sprintf( '<br><br> <a href="%s" target="_blank" class="button button-primary">%s %s</a>',
						esc_url( wp_nonce_url( network_admin_url( "update.php?action=install-plugin&plugin={$plugin_slug}" ), "install-plugin_{$plugin_slug}" ) ),
						esc_html__( 'Install', 'tmds-woocommerce-temu-dropshipping' ),
						$recommended_plugin['name'] );
				}
				$notices[] = $recommended_plugin['message_not_install'] . $button;
			} elseif ( ! empty( $recommended_plugin['message_not_active'] ) && ! isset( $active_plugins[ $plugin_slug ] ) ) {
				if ( current_user_can( 'activate_plugin', $plugin_file ) ) {
					$button = sprintf( '<br><br> <a href="%s" target="_blank" class="button button-primary">%s %s</a>',
						esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'activate', 'plugin' => $plugin_file ), self_admin_url( 'plugins.php' ) ), "activate-plugin_{$plugin_file}" ) ),
						esc_html__( 'Activate', 'tmds-woocommerce-temu-dropshipping' ),
						$recommended_plugin['name'] );
				}
				$notices[] = $recommended_plugin['message_not_active'] . $button;
			}
		}
		if ( ! empty( $notices ) ) {
			?>
            <div class="notice notice-info is-dismissible">
				<?php
				if ( count( $notices ) > 1 ) {
					printf( "<p>%s will work better with:</p>", wp_kses_post( TMDSPRO_NAME ) );
					?>
                    <ol>
						<?php
						foreach ( $notices as $notice ) {
							printf( "<li>%s</li>", wp_kses_post( $notice ) );
						}
						?>
                    </ol>
					<?php
				} else {
					printf( '<p>%s will work better with: %s</p>', wp_kses_post( TMDSPRO_NAME ), wp_kses_post( current( $notices ) ) );
				}
				?>
                <a href="<?php echo esc_url( add_query_arg( array( $prefix . '_dismiss_nonce' => wp_create_nonce( $prefix . '_dismiss_nonce' ) ) ) ) ?>"
                   target="_self">
                    <button type="button" class="notice-dismiss"></button>
                </a>
            </div>
			<?php
		}
	}

	public function page_callback() {
		$installed_plugins = get_plugins();
		$plugins           = TMDSPRO_Admin_Setup_Wizard::recommended_plugins();
		$active_plugins    = TMDSPRO_Admin_Setup_Wizard::get_active_plugins();
		?>
        <div class="wrap">
            <h2><?php esc_html_e( 'Recommended plugins', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
            <table id="status" class="vi-ui celled table">
                <thead>
                <tr>
                    <th></th>
                    <th><?php esc_html_e( 'Plugins', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
                    <th><?php esc_html_e( 'Description', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
                </tr>
                </thead>
                <tbody>
				<?php
				foreach ( $plugins as $plugin ) {
					if ( empty( $plugin['slug'] ) ) {
						continue;
					}
					$plugin_id = "{$plugin['slug']}/{$plugin['slug']}.php";
					?>
                    <tr>
                        <td>
                            <a target="_blank"
                               href="<?php echo esc_url( "https://wordpress.org/plugins/{$plugin['slug']}" ) ?>">
								<?php // The displayed images are logo images of suggested plugins, so they should not be stored in WP Media. ?>
                                <img src="<?php echo esc_url( $plugin['img'] )   // phpcs:ignore PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage ?>" width="60" height="60">
                            </a>
                        </td>
                        <td class="fist-col">
                            <div class="vi-wad-plugin-name">
                                <a target="_blank"
                                   href="<?php echo esc_url( "https://wordpress.org/plugins/{$plugin['slug']}" ) ?>">
                                    <strong><?php echo esc_html( $plugin['name'] ) ?></strong>
                                </a>
                            </div>
                            <div>
								<?php
								$pro_install = false;
								if ( ! empty( $plugin['pro'] ) ) {
									$pro_file = "{$plugin['pro']}/{$plugin['pro']}.php";
									if ( isset( $installed_plugins[ $pro_file ] ) ) {
										$pro_install = true;
										if ( ! isset( $active_plugins[ $plugin['pro'] ] ) && ! isset( $active_plugins[ $plugin['slug'] ] ) ) {
											?>
                                            <a href="<?php echo esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'activate', 'plugin' => $pro_file ), self_admin_url( 'plugins.php' ) ), "activate-plugin_{$pro_file}" ) ) ?>"
                                               target="_blank">
												<?php esc_html_e( 'Activate', 'tmds-woocommerce-temu-dropshipping' ); ?>
                                            </a>
											<?php
										} else {
											esc_html_e( 'Currently active', 'tmds-woocommerce-temu-dropshipping' );
										}
									}
								}
								if ( ! $pro_install ) {
									if ( ! isset( $installed_plugins[ $plugin_id ] ) ) {
										?>
                                        <a href="<?php echo esc_url( wp_nonce_url( self_admin_url( "update.php?action=install-plugin&plugin={$plugin['slug']}" ), "install-plugin_{$plugin['slug']}" ) ) ?>"
                                           target="_blank">
											<?php esc_html_e( 'Install', 'tmds-woocommerce-temu-dropshipping' ); ?>
                                        </a>
										<?php
									} elseif ( ! isset( $active_plugins[ $plugin['slug'] ] ) ) {
										?>
                                        <a href="<?php echo esc_url( wp_nonce_url( add_query_arg( [
											'action' => 'activate',
											'plugin' => $plugin_id
										], admin_url( 'plugins.php' ) ), "activate-plugin_{$plugin_id}" ) ) ?>"
                                           target="_blank">
											<?php esc_html_e( 'Activate', 'tmds-woocommerce-temu-dropshipping' ); ?>
                                        </a>
										<?php
									} else {
										esc_html_e( 'Currently active', 'tmds-woocommerce-temu-dropshipping' );
									}
								}
								?>
                            </div>
                        </td>
                        <td><?php echo esc_html( $plugin['desc'] ) ?></td>
                    </tr>
					<?php
				}
				?>
                </tbody>
            </table>
        </div>
		<?php
	}
}
