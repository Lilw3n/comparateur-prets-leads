<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Admin_Log {
	public function __construct() {
		add_action( 'admin_init', array( $this, 'download_log_file' ) );
	}

	public static function wc_log( $content, $source = 'debug', $level = 'info' ) {
		$content = $source ==='check'? $content : wp_strip_all_tags( $content );
		$log     = wc_get_logger();
		$log->log( $level,
			$content,
			array(
				'source' => 'tmds-' . $source,
			)
		);
	}

	public function download_log_file() {
		$nonce = isset( $_POST['_wpnonce'] ) ? sanitize_text_field(wp_unslash( $_POST['_wpnonce']) ) : '';
		if ( $nonce && wp_verify_nonce( $nonce, 'tmds_download_log' ) ) {
			$file = '';
			$logs = WC_Log_Handler_File::get_log_files();
			if ( ! empty( $_REQUEST['log_file'] ) && isset( $logs[ sanitize_title( wp_unslash( $_REQUEST['log_file'] ) ) ] ) ) { // WPCS: input var ok, CSRF ok.
				$log_file = $logs[ sanitize_title( wp_unslash( $_REQUEST['log_file'] ) ) ]; // WPCS: input var ok, CSRF ok.
				$file     = WC_LOG_DIR . $log_file;
			}
			if ( is_file( $file ) ) {
				$fh = @fopen( 'php://output', 'w' );
				fprintf( $fh, chr( 0xEF ) . chr( 0xBB ) . chr( 0xBF ) );
				header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
				header( 'Content-Description: File Transfer' );
				header( 'Content-type: text/csv' );
				header( 'Content-Disposition: attachment; filename=' . $log_file . '__' . date( 'Y-m-d_H-i-s' ) . '.txt' );// phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
				header( 'Expires: 0' );
				header( 'Pragma: public' );
				fputs( $fh, file_get_contents( $file ) );// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPress.WP.AlternativeFunctions.file_system_operations_fputs
				fclose( $fh );// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
				die();
			}
		}
	}

	public static function page_callback() {
		?>
        <div class="wrap">
            <h2><?php esc_html_e( 'Your logs show here', 'tmds-woocommerce-temu-dropshipping' ) ?></h2>
            <div class="vi-ui positive message">
                <div class="header"><?php esc_html_e( 'All log files are stored in the same log folder of WooCommerce.', 'tmds-woocommerce-temu-dropshipping' ) ?></div>
                <ul class="list">
                    <li><?php echo wp_kses_post( sprintf( esc_html__( 'Log folder: %s', 'tmds-woocommerce-temu-dropshipping' ), WC_LOG_DIR ) ) //phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
						?></li>
                    <li><?php echo wp_kses_post( sprintf( esc_html__( 'Log files older than %s days will be automatically deleted by WooCommerce', 'tmds-woocommerce-temu-dropshipping' ), apply_filters( 'woocommerce_logger_days_to_retain_logs', 30 ) ) ) //phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
						?></li>
                </ul>
            </div>
			<?php
			if ( class_exists( 'WC_Log_Handler_File' ) ) {
				$logs = WC_Log_Handler_File::get_log_files();
				if ( ! empty( $logs ) ) {
					foreach ( $logs as $key => $value ) {
						if ( substr( $key, 0, 5 ) !== 'tmds-' ) {
							unset( $logs[ $key ] );
						}
					}
				}
				if ( ! empty( $_REQUEST['log_file'] ) && isset( $logs[ sanitize_title( wp_unslash( $_REQUEST['log_file'] ) ) ] ) ) {
					$viewed_log = $logs[ sanitize_title( wp_unslash( $_REQUEST['log_file'] ) ) ];
				} elseif ( ! empty( $logs ) ) {
					$viewed_log = current( $logs );
				}

				if ( ! empty( $_REQUEST['handle'] ) ) {
					if ( empty( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( sanitize_text_field(wp_unslash( $_REQUEST['_wpnonce'] )), 'remove_log' ) ) {
						wp_die( esc_html__( 'Action failed. Please refresh the page and retry.', 'tmds-woocommerce-temu-dropshipping' ) );
					}
					if ( ! empty( $_REQUEST['handle'] ) ) {
						$log_handler = new WC_Log_Handler_File();
						$log_handler->remove(sanitize_text_field( wp_unslash( $_REQUEST['handle'] )) );
					}
					wp_safe_redirect( esc_url_raw( admin_url( 'admin.php?page=tmds-logs' ) ) );
					exit();
				}
				$log_of = isset( $_REQUEST['log_of'] ) ? sanitize_text_field(wp_unslash( $_REQUEST['log_of'] )) : '';
				if ( $logs ) {
					$logs = array_reverse( $logs );
					?>
                    <div id="log-viewer-select">
                        <div class="alignleft">
                            <h2>
								<?php
								echo esc_html( $viewed_log );
								if ( ! empty( $viewed_log ) ) { ?>
                                    <a class="page-title-action tmds-delete-log"
                                       href="<?php echo esc_url( wp_nonce_url( add_query_arg( array( 'handle' => sanitize_title( $viewed_log ) ), admin_url( 'admin.php?page=tmds-logs' ) ), 'remove_log' ) ); ?>"
                                       class="button"><?php esc_html_e( 'Delete log', 'tmds-woocommerce-temu-dropshipping' ); ?></a>
									<?php
								}
								?>
                            </h2>
                        </div>
                        <div class="alignright">
                            <form class="tmds-logs-form"
                                  action="<?php echo esc_url( admin_url( 'admin.php?page=tmds-logs' ) ); ?>"
                                  method="post">
                                <select name="log_of">
                                    <option value=""><?php esc_html_e( 'All log files', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
                                    <option value="manual-products-sync" <?php selected( $log_of, 'manual-products-sync' ); ?>><?php esc_html_e( 'Products sync', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
                                    <option value="debug" <?php selected( $log_of, 'debug' ); ?>><?php esc_html_e( 'Debug', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
                                </select>
                                <select name="log_file">
                                    <option value=""><?php esc_html_e( 'No files found', 'tmds-woocommerce-temu-dropshipping' ) ?></option>
									<?php
									foreach ( $logs as $log_key => $log_file ) {
										$timestamp = filemtime( WC_LOG_DIR . $log_file );
										$date      = sprintf(
										/* translators: 1: last access date 2: last access time 3: last access timezone abbreviation */
											__( '%1$s at %2$s %3$s', 'tmds-woocommerce-temu-dropshipping' ),
											wp_date( wc_date_format(), $timestamp ),
											wp_date( wc_time_format(), $timestamp ),
											wp_date( 'T', $timestamp )
										);
										?>
                                        <option value="<?php echo esc_attr( $log_key ); ?>" <?php selected( sanitize_title( $viewed_log ), $log_key ); ?>><?php echo esc_html( $log_file ); ?>
                                            (<?php echo esc_html( $date ); ?>)
                                        </option>
										<?php
									}
									?>
                                </select>
                                <button type="submit" class="button"
                                        value="<?php esc_attr_e( 'View', 'tmds-woocommerce-temu-dropshipping' ); ?>"><?php esc_html_e( 'View', 'tmds-woocommerce-temu-dropshipping' ); ?></button>
                                <button type="submit" class="button" name="_wpnonce"
                                        title="<?php esc_attr_e( 'Download selected log file to your device', 'tmds-woocommerce-temu-dropshipping' ); ?>"
                                        value="<?php echo esc_attr( wp_create_nonce( 'tmds_download_log' ) ); ?>"><?php esc_html_e( 'Download', 'tmds-woocommerce-temu-dropshipping' ); ?></button>
                            </form>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div id="log-viewer">
                        <pre><?php echo esc_html( file_get_contents( WC_LOG_DIR . $viewed_log ) );// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents ?></pre>
                    </div>
					<?php
				} else {
					?>
                    <div class="updated woocommerce-message inline">
                        <p><?php esc_html_e( 'There are currently no logs to view.', 'tmds-woocommerce-temu-dropshipping' ); ?></p></div>
					<?php
				}
			}
			?>
        </div>
		<?php
	}
}

?>