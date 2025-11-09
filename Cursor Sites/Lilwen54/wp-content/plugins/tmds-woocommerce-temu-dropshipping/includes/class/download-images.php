<?php
defined('ABSPATH') || exit;

class TMDSPRO_Download_Images extends WP_Background_Process {
    protected static $instance = null;
    /**
     * @var string
     */
    protected $action = 'tmds_background_download_images';

    public static function instance()
    {
        return self::$instance == null ? self::$instance = new self() : self::$instance;
    }

    /**
     * Task
     *
     * Override this method to perform any actions required on each
     * queue item. Return the modified item for further processing
     * in the next pass through. Or, return false to remove the
     * item from the queue.
     *
     * @param mixed $item Queue item to iterate over
     *
     * @return mixed
     */
    protected function task($item)
    {
        $product_id = isset($item['woo_product_id']) ? $item['woo_product_id'] : '';
        $parent_id = isset($item['parent_id']) ? $item['parent_id'] : '';
        $set_gallery = isset($item['set_gallery']) ? $item['set_gallery'] : '';
        $product_ids = isset($item['product_ids']) ? $item['product_ids'] : array();
        $src = isset($item['src']) ? $item['src'] : '';

        try {
	        TMDSPRO_DATA::villatheme_set_time_limit();
            $setting = TMDSPRO_DATA::get_instance();
            if ($set_gallery == 2 && $setting->get_params('use_external_image') && TMDSPRO_Admin_Settings::exmage_active()) {
                return false;
            }
            $post = get_post($product_id);
            if ($post && $post->post_type === 'product' && $src) {
                $image_id = 0;
                $thumb_id = TMDSPRO_File::download_image($image_id, $src, $product_id);
                if ($thumb_id && !is_wp_error($thumb_id)) {
	                $cancel = apply_filters('tmds_cancel_set_product_gallery', false, $thumb_id, $item);
					if (!$cancel) {
						if ( $set_gallery == 2 ) {
							if ( $image_id ) {
								$downloaded_url = wp_get_attachment_url( $thumb_id );
								$description    = html_entity_decode( $post->post_content, ENT_QUOTES | ENT_XML1, 'UTF-8' );
								$description    = preg_replace( '/[^"]{0,}' . preg_quote( $image_id, '/' ) . '[^"]{0,}/U', $downloaded_url, $description );
								$description    = str_replace( $src, $downloaded_url, $description );
								wp_update_post( array( 'ID' => $product_id, 'post_content' => $description ) );
							}
						} else {
							if ( is_array( $product_ids ) && !empty($product_ids) ) {
								foreach ( $product_ids as $v_id ) {
									$post_type = get_post_type( $v_id );
									if ( $post_type === 'product' ) {
										update_post_meta( $v_id, '_thumbnail_id', $thumb_id );
										if ( $parent_id ) {
											TMDSPRO_Post::update_post_meta( $parent_id, '_' . $setting::$prefix . '_product_image', $thumb_id );
										}
									} elseif ( $post_type === 'product_variation' ) {
										update_post_meta( $v_id, '_thumbnail_id', $thumb_id );
									}
								}
							}
							if ( 1 == $set_gallery ) {
								$gallery = get_post_meta( $product_id, '_product_image_gallery', true );
								if ( $gallery ) {
									$gallery_array = explode( ',', $gallery );
								} else {
									$gallery_array = array();
								}
								$gallery_array[] = $thumb_id;
								update_post_meta( $product_id, '_product_image_gallery', implode( ',', array_unique( $gallery_array ) ) );
							}
						}
					}
                } else {
                    TMDSPRO_Error_Images_Table::insert($product_id, implode(',', $product_ids), $src, intval($set_gallery));
	                TMDSPRO_Admin_Log::wc_log(TMDSPRO_NAME . ' error: ' . $thumb_id->get_error_code() . ' - ' . $thumb_id->get_error_message());
                }
            }

        } catch (Error $e) {
            TMDSPRO_Admin_Log::wc_log('Uncaught error: ' . $e->getMessage() . ' on ' . $e->getFile() . ':' . $e->getLine());

            return false;
        } catch (\Exception $e) {
	        TMDSPRO_Error_Images_Table::insert($product_id, implode(',', $product_ids), $src, intval($set_gallery));
            TMDSPRO_Admin_Log::wc_log(TMDSPRO_NAME . ': ' . $e->getMessage());

            return false;
        }

        return false;
    }

    /**
     * Is the updater running?
     *
     * @return boolean
     */
    public function is_process_running()
    {
        return parent::is_process_running();
    }

    /**
     * Is the queue empty
     *
     * @return boolean
     */
    public function is_queue_empty()
    {
        return parent::is_queue_empty();
    }

    /**
     * Complete
     *
     * Override if applicable, but ensure that the below actions are
     * performed, or, call parent::complete().
     */
    protected function complete()
    {
        if ($this->is_queue_empty() && !$this->is_process_running()) {
            set_transient($this->action . '_complete', time());
        }
        // Show notice to user or perform some other arbitrary task...
        parent::complete();
    }

    /**
     * Delete all batches.
     *
     * @return TMDSPRO_Download_Images
     */
    public function delete_all_batches()
    {
        global $wpdb;

        $table = $wpdb->options;
        $column = 'option_name';

        if (is_multisite()) {
            $table = $wpdb->sitemeta;
            $column = 'meta_key';
        }

        $key = $wpdb->esc_like($this->identifier . '_batch_') . '%';

        $wpdb->query($wpdb->prepare("DELETE FROM %i WHERE %i LIKE %s", [$table,$column,$key])); // @codingStandardsIgnoreLine.

        return $this;
    }

    /**
     * Kill process.
     *
     * Stop processing queue items, clear cronjob and delete all batches.
     */
    public function kill_process()
    {
        if (!$this->is_queue_empty()) {
            $this->delete_all_batches();
            wp_clear_scheduled_hook($this->cron_hook_identifier);
        }
    }
}