<?php
if (!defined('ABSPATH')) {
    exit;
}

class VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Ali_DS_API_Update_Product {
    protected static $settings;
    protected static $is_excluded;
    public static $get_data_to_update;

    public function __construct() {
        self::$settings = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_instance();
        add_action('init', array($this, 'background_process'));
        add_action('vi_wad_auto_update_product', array($this, 'auto_update_product'));
        add_action('vi_wad_sync_product_successful', array($this, 'save_freight_ext'), 10, 6);

        add_action('admin_footer', array($this, 'api_sync_product'));
    }

    public static function api_sync_product( $product_id = '' ) {
        if (!empty($_GET['ald_api_sync_product'])) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $product_id = absint(wc_clean(wp_unslash($_GET['ald_api_sync_product'])));// phpcs:ignore WordPress.Security.NonceVerification.Recommended
        }
        if (!$product_id) {
            return;
        }
        $access_token = self::$settings->get_params('access_token');
        if (!$access_token) {
            ob_start();
            print_r('Missing access token to sync product_id : ' . $product_id . ' via API', true);
            self::log(ob_get_clean());
            return;
        }
        ob_start();
        print_r('api_sync_product: ' . $product_id);
        self::log(ob_get_clean());
        if (!self::$get_data_to_update->is_process_running()) {
            self::$get_data_to_update->kill_process();
            if (self::$get_data_to_update->is_queue_empty() || !get_transient('vi_wad_auto_update_product_' . $product_id . 'time')) {
                ob_start();
                print_r('api -imported sync product_id : ');
                self::log(ob_get_clean());
                $ids = array();
                $woo_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_woo_id', true);
                $ali_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_sku', true);
                set_transient('vi_wad_auto_update_product_' . $product_id . 'time', time());
                $ids[] = array(
                    'id' => $product_id,
                    'woo_id' => strval($woo_id),
                    'ali_id' => strval($ali_id),
                );
                self::$get_data_to_update->push_to_queue($ids);
                self::$get_data_to_update->save()->dispatch();

            } else if (self::$settings->get_params('update_product_auto')) {
                ob_start();
                var_dump('api_sync_product a2');
                self::log(ob_get_clean());
                self::$get_data_to_update->dispatch();
            }
        } else {
            self::log('Background process is running');
        }
    }

    /**
     * Save ext param to use later when getting product shipping information
     *
     * @param $product_id
     * @param $woo_id
     * @param $latest_variations
     * @param $currency_code
     * @param $data
     * @param $is_api_sync
     */
    public function save_freight_ext( $product_id, $woo_id, $latest_variations, $currency_code, $data, $is_api_sync ) {
        if (self::$settings->get_params('enable') && self::$settings->get_params('ali_shipping')) {
            $currency_codes = array_column($latest_variations, 'currency_code');
            $currency_codes = array_unique($currency_codes);
            $price_array = array();
            if (count($currency_codes) === 1 && $currency_codes[0] === 'USD') {
                $currency_code = $currency_codes[0];
                foreach ($latest_variations as $latest_variation) {
                    $skuVal = isset($latest_variation['skuVal']) ? $latest_variation['skuVal'] : array();
                    $regular_price = isset($skuVal['skuCalPrice']) ? $skuVal['skuCalPrice'] : '';
                    $sale_price = (isset($skuVal['actSkuCalPrice'], $skuVal['actSkuBulkCalPrice']) && VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuBulkCalPrice']) > VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuCalPrice'])) ? $skuVal['actSkuBulkCalPrice'] : (isset($skuVal['actSkuCalPrice']) ? $skuVal['actSkuCalPrice'] : '');
                    $price_array[] = $regular_price;
                    $price_array[] = $sale_price;
                }
            } elseif ($currency_code === 'USD') {
                foreach ($latest_variations as $latest_variation) {
                    $skuVal = isset($latest_variation['skuVal']) ? $latest_variation['skuVal'] : array();
                    if (isset($skuVal['skuMultiCurrencyCalPrice'])) {
                        $regular_price = $skuVal['skuMultiCurrencyCalPrice'];
                        $sale_price = isset($skuVal['actSkuMultiCurrencyCalPrice']) ? $skuVal['actSkuMultiCurrencyCalPrice'] : '';
                        if (isset($skuVal['actSkuMultiCurrencyBulkPrice']) && VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuMultiCurrencyBulkPrice']) > VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($sale_price)) {
                            /*Data passed from chrome extension*/
                            $sale_price = $skuVal['actSkuMultiCurrencyBulkPrice'];
                        }
                        $price_array[] = $regular_price;
                        $price_array[] = $sale_price;
                    } else {
                        if (isset($skuVal['skuAmount']['currency'], $skuVal['skuAmount']['value']) && $skuVal['skuAmount']['currency'] === 'USD' && $skuVal['skuAmount']['value']) {
                            /*Data passed from chrome extension*/
                            $price_array[] = $skuVal['skuAmount']['value'];
                            if (isset($skuVal['skuActivityAmount']['currency'], $skuVal['skuActivityAmount']['value']) && $skuVal['skuActivityAmount']['currency'] === 'USD' && $skuVal['skuActivityAmount']['value']) {
                                $price_array[] = $skuVal['skuActivityAmount']['value'];
                            }
                        }
                    }
                }
            }
            $price_array = array_filter(array_unique($price_array));
            if (!empty($price_array)) {
                $min_price = min($price_array);
                if ($min_price) {
                    $min_price = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($min_price);
                    $freight_ext = '{"p1":"' . number_format($min_price, 2) . '","p3":"' . $currency_code . '","disCurrency":"' . $currency_code . '","p6":""}';
                    update_post_meta($woo_id, '_vi_wad_freight_ext', $freight_ext); //waitting check
                }
            }
        }
    }

    /**
     * Background process that uses AliExpress API to get latest products data
     */
    public function background_process() {
        self::$get_data_to_update = new VI_WOOCOMMERCE_ALIDROPSHIP_BACKGROUND_ALI_API_GET_PRODUCT_DATA();
    }

    /**
     * Look for ALD products, push to queue to sync regularly in the background
     * Each queue contains 20 products because AliExpress API supports a maximum of 20 products per request
     */
    public function auto_update_product() {
        vi_wad_set_time_limit();
        if (!empty($_REQUEST['crontrol-single-event'])) {// phpcs:ignore WordPress.Security.NonceVerification.Recommended
            /*Do not run if manually triggered by WP Crontrol plugin*/
            return;
        }

        if (self::$settings->get_params('update_product_auto')) {
            $access_token = self::$settings->get_params('access_token');
            $update_product_statuses = self::$settings->get_params('update_product_statuses');

            if (!is_array($update_product_statuses)) {
                return;
            }

            if ($access_token) {
                if (!self::$get_data_to_update->is_process_running()) {
                    if (self::$get_data_to_update->is_queue_empty()) {
                        set_transient('vi_wad_auto_update_product_time', time());
                        $args = array(
                            'post_type' => 'vi_wad_draft_product',
                            'posts_per_page' => 100,
                            'paged' => 1,
                            'meta_key' => '_vi_wad_sku',// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
                            'post_status' => 'publish',
                            'fields' => 'ids',
                            'orderby' => 'meta_value_num',
//							'order'          => 'ASC',
                            'order' => 'DESC',
                        );

                        $the_query = ALD_Product_Table::wp_query($args);

                        if ($the_query->have_posts()) {
                            $max_num_pages = $the_query->max_num_pages;
                            $ids = array();
                            $dispatch = false;

                            foreach ($the_query->posts as $product_id) {
                                $woo_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_woo_id', true);
                                $ali_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_sku', true);
                                if ($woo_id && $ali_id && (!$update_product_statuses || in_array(get_post_status($woo_id), $update_product_statuses, true))) {
                                    set_transient('vi_wad_auto_update_product_' . $product_id . 'time', time());
                                    $ids[] = array(
                                        'id' => $product_id,
                                        'woo_id' => strval($woo_id),
                                        'ali_id' => strval($ali_id),
                                    );
                                }
                                if (count($ids) === 5) {
                                    self::$get_data_to_update->push_to_queue($ids);
                                    $dispatch = true;
                                    $ids = array();
                                }
                            }

                            if ($max_num_pages > 1) {
                                for ($i = 2; $i <= $max_num_pages; $i++) {
                                    $args ['paged'] = $i;
                                    $the_query = ALD_Product_Table::wp_query($args);

                                    if ($the_query->have_posts()) {
                                        foreach ($the_query->posts as $product_id) {
                                            $woo_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_woo_id', true);
                                            $ali_id = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_sku', true);
                                            if ($woo_id && $ali_id && (!$update_product_statuses || in_array(get_post_status($woo_id), $update_product_statuses, true))) {
                                                $ids[] = array(
                                                    'id' => $product_id,
                                                    'woo_id' => strval($woo_id),
                                                    'ali_id' => strval($ali_id),
                                                );
                                            }
                                            if (count($ids) === 5) {
                                                self::$get_data_to_update->push_to_queue($ids);
                                                $dispatch = true;
                                                $ids = array();
                                            }
                                        }
                                    }
                                }
                            }

                            if (!empty($ids)) {
                                self::$get_data_to_update->push_to_queue($ids);
                                $dispatch = true;
                            }

                            if ($dispatch) {
                                self::$get_data_to_update->save()->dispatch();
                            }
                        } else {
                            self::log('Cron: query products to sync, no products found');
                        }
                    } else {
                        self::$get_data_to_update->dispatch();
                    }
                }
            } else {
                self::log('Missing access token');
            }
        } else {
            $args = self::$settings->get_params();
            wp_unschedule_hook('vi_wad_auto_update_product');
            $args['update_product_auto'] = '';
            update_option('wooaliexpressdropship_params', $args);
        }
    }

    /**
     * @param $product_ids
     * @param $data
     * @param bool $is_api_sync
     */
    public static function update_product_by_id( $product_ids, $data, $is_api_sync = true ) {
        $product_id = $product_ids['id'];
        if (empty($product_ids['woo_id'])) {
            $product_ids['woo_id'] = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_woo_id', true);
        }
        if (empty($product_ids['ali_id'])) {
            $product_ids['ali_id'] = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_sku', true);
        }

        do_action('vi_wad_before_sync_product', $product_ids, $is_api_sync);

        $woo_id = $product_ids['woo_id'];
        $ali_id = $product_ids['ali_id'];
        $sync_country = $product_ids['country'] ?? '';
        $view_url = admin_url("admin.php?page=woocommerce-alidropship-imported-list&vi_wad_search_woo_id={$woo_id}");
        $ali_url = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_aliexpress_product_url($ali_id);
        $log = "Product <a href='{$view_url}' target='_blank'>#{$woo_id}</a>(Ali ID <a href='{$ali_url}' target='_blank'>{$ali_id}</a>): ";
        $log_level = WC_Log_Levels::INFO;
        $update = array(
            'time' => time(),
            'hide' => '',
            'is_offline' => false,
            'shipping_removed' => false,
            'not_available' => array(),
            'out_of_stock' => array(),
            'is_out_of_stock' => false,
            'price_changes' => array(),
            'price_exceeds' => array(),
        );
        $get_data = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_data('', array(), $data, true);

        if ($get_data['status'] === 'success') {
            $data = $get_data['data'];
            $sku = isset($data['sku']) ? sanitize_text_field($data['sku']) : '';
            $latest_variations = isset($data['variations']) ? stripslashes_deep($data['variations']) : array();
            $currency_code = isset($data['currency_code']) ? strtoupper(stripslashes_deep($data['currency_code'])) : '';
            if (!empty($latest_variations)) {
                /*22-11-2024 currency_code by variation for api*/
                if (isset($latest_variations[0]['currency_code'])) {
                    $currency_code = strtoupper(stripslashes_deep($latest_variations[0]['currency_code']));
                }

                $variations = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_variations', true);
                $woo_product = wc_get_product($woo_id);
                if ($woo_product && get_post_meta($woo_id, '_vi_wad_aliexpress_product_id', true) == $ali_id) {
                    if (isset($data['video'])) {
                        self::import_product_video($data['video'], $product_id, $woo_id);
                    }
                    $excl_products = self::$settings->get_params('update_product_exclude_products');
                    $excl_categories = self::$settings->get_params('update_product_exclude_categories');
                    $categories = $woo_product->get_category_ids();
                    self::$is_excluded = (in_array($woo_id, $excl_products) || !empty(array_intersect($categories, $excl_categories)));
                    $variations_skuAttr = array_column($variations, 'skuAttr');
                    $latest_variations_skuAttr = array_column($latest_variations, 'skuAttr');
                    $shipping_removed = false;
                    $company = '';
                    $shipping_cost = 0;
                    $ship_to = '';
                    if (self::$settings->get_params('show_shipping_option')) {
                        $shipping_info = VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Import_List::get_shipping_info($product_id, $sync_country, '', 0, $latest_variations);

                        $ship_to = $shipping_info['country'];
                        if ($shipping_info['shipping_cost'] === '') {
                            $shipping_removed = true;
                            if (!empty($shipping_info['company_name'])) {
                                $company = $shipping_info['company_name'];
                            }
                        } else {
                            $shipping_cost = abs(VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($shipping_info['shipping_cost']));
                        }
                    } else {
                        $shipping_info = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_shipping_info', true);
                        if ($shipping_info && !empty($shipping_info['country'])) {
                            $ship_to = $shipping_info['country'];
                        }
                    }

                    $country_tax = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_ali_tax($ship_to);

                    $item_log = array();
                    $product_log = '';
                    $all_variations_change = false;
                    $is_purchase = true;
                    if ($woo_product->is_type('variable')) {
                        $woo_variations = $woo_product->get_children();
                        if (!empty($woo_variations)) {
                            $is_ali_variation = 0;
                            $used_variations = array();
                            foreach ($woo_variations as $variation_id) {
                                $woo_variation = wc_get_product($variation_id);
                                if ($woo_variation) {
                                    $skuAttr = get_post_meta($variation_id, '_vi_wad_aliexpress_variation_attr', true);
                                    if ($skuAttr) {
                                        $is_ali_variation++;
                                        $variations_skuAttr_s = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::search_sku_attr($skuAttr, $variations_skuAttr);
                                        $latest_variations_skuAttr_s = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::search_sku_attr($skuAttr, $latest_variations_skuAttr);
                                        if ($latest_variations_skuAttr_s !== false && $variations_skuAttr_s !== false) {
                                            $used_variations[$variation_id] = $latest_variations[$latest_variations_skuAttr_s];
                                            self::process_product_to_update($woo_variation, $variation_id, $variations_skuAttr_s, $latest_variations[$latest_variations_skuAttr_s], $shipping_cost, $currency_code, $variations,
                                                $update, $item_log, $country_tax);
                                        } else {
                                            $update['not_available'][] = $variation_id;
                                            $item_log[] = "#{$variation_id} original variation not found";
                                            self::update_product_if($woo_variation, self::$settings->get_params('update_product_removed_variation'), $product_log);
                                        }
                                    }
                                }
                            }
                            if (apply_filters('viwad_update_product_attributes', false) && $used_variations) {
                                $get_attributes = $woo_product->get_attributes();
                                if ($get_attributes) {
                                    $attr_data = array();
                                    $options = array();
                                    foreach ($get_attributes as $get_attribute_k => $get_attribute) {
                                        $attr_key = $get_attribute_k;
                                        if (substr($attr_key, 0, 3) === 'pa_') {
                                            $attr_key = substr($attr_key, 3);
                                        }
                                        $options[$attr_key] = array(
                                            'name' => $get_attribute->get_name(),
                                            'values' => array(),
                                        );
                                    }
                                    $get_attributes_slugs = array_keys($options);
                                    $attr_key = '';
                                    $used_variations_ = array_values($used_variations);
                                    if (self::$settings->get_params('alternative_attribute_values') && isset($used_variations_[0]['variation_ids_sub']) && count($get_attributes_slugs) <= count(array_keys($used_variations_[0]['variation_ids_sub']))) {
                                        $attr_key = 'variation_ids_sub';
                                    } else if (count($get_attributes_slugs) <= count(array_keys($used_variations_[0]['variation_ids']))) {
                                        $attr_key = 'variation_ids';
                                    }
                                    if ($attr_key) {
                                        $attributes_mapping_origin = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_attributes_mapping_origin();
                                        $attributes_mapping_replacement = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_attributes_mapping_replacement();
                                        $update_attributes = true;
                                        foreach ($used_variations as $used_variation) {
                                            foreach ($options as $option_k => $option) {
                                                if (!isset($used_variation[$attr_key][$option_k])) {
                                                    $update_attributes = false;
                                                    ob_start();
                                                    echo esc_html('Can not map attribute: This problem could be due to changing the name or slug of the product attribute during import or because the imported language doesn\'t match during syncing.');
                                                    var_dump('syncing');
                                                    print_r(array_keys($used_variation[$attr_key]));
                                                    var_dump('imported');
                                                    print_r(array_keys($options));
                                                    $log .= ob_get_clean();
                                                    break;
                                                }

                                                $found = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::find_attribute_replacement($attributes_mapping_origin, $attributes_mapping_replacement, $used_variation[$attr_key][$option_k], $option_k);
                                                if ($found) {
                                                    if (!in_array($found, $options[$option_k]['values'])) {
                                                        $options[$option_k]['values'][] = $found;
                                                    }
                                                } else {
                                                    if (!in_array($used_variation[$attr_key][$option_k], $options[$option_k]['values'])) {
                                                        $options[$option_k]['values'][] = $used_variation[$attr_key][$option_k];
                                                    }
                                                }
                                            }
                                            if (!$update_attributes) {
                                                break;
                                            }
                                        }
                                        if ($update_attributes) {
                                            self::create_product_attributes($options, $attr_data);
                                            $woo_product->set_attributes($attr_data);
                                            $woo_product->save();
                                            foreach ($used_variations as $variation_id => $used_variation) {
                                                $variation_attributes = self::create_variation_attribute($options, $used_variation, $attr_key);
                                                $woo_variation = wc_get_product($variation_id);
                                                $woo_variation->set_attributes($variation_attributes);
                                                $woo_variation->save();
                                            }
                                        }
                                    }
                                }
                            }
                            if ($is_ali_variation > 0) {
                                if ($is_ali_variation === count($update['not_available'])) {
                                    $all_variations_change = true;
                                }
                                if ($is_ali_variation === count($update['out_of_stock'])) {
                                    $update['is_out_of_stock'] = true;
                                }
                            }
                        }
                        $variations = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::parse_ali_variations_data($latest_variations, $currency_code, $sku);
                    } elseif ($woo_product->is_type('simple')) {
                        $skuAttr = get_post_meta($woo_id, '_vi_wad_aliexpress_variation_attr', true);
                        if ($skuAttr) {
                            $variations_skuAttr_s = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::search_sku_attr($skuAttr, $variations_skuAttr);
                            $latest_variations_skuAttr_s = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::search_sku_attr($skuAttr, $latest_variations_skuAttr);
                            if ($latest_variations_skuAttr_s !== false && $variations_skuAttr_s !== false) {
                                $variations = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::parse_ali_variations_data([$latest_variations[$latest_variations_skuAttr_s]], $currency_code, $sku);
                                self::process_product_to_update($woo_product, $woo_id, $variations_skuAttr_s, $latest_variations[$latest_variations_skuAttr_s], $shipping_cost, $currency_code, $variations, $update, $item_log, $country_tax);
                            } else {
                                $update['not_available'][] = $woo_id;
                                $all_variations_change = true;
                                $item_log[] = "#{$woo_id} original variation not found";
                            }
                        } else {
                            $variations = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::parse_ali_variations_data($latest_variations, $currency_code, $sku);
                            self::process_product_to_update($woo_product, $woo_id, 0, $latest_variations[0], $shipping_cost, $currency_code, $variations, $update, $item_log, $country_tax);
                        }
                        if (!empty($update['out_of_stock'])) {
                            $update['is_out_of_stock'] = true;
                        }
                    }

                    if ($update['is_offline']) {
                        $is_purchase = false;
                        $log_level = WC_Log_Levels::ALERT;
                        $product_log = "Ali product is no longer available";
                        self::update_product_if($woo_product, self::$settings->get_params('update_product_if_not_available'), $product_log);
                    } elseif (!empty($update['not_available'])) {
                        if ($all_variations_change) {
                            $is_purchase = false;
                            $log_level = WC_Log_Levels::ALERT;
                            self::update_product_if($woo_product, self::$settings->get_params('update_product_if_not_available'), $product_log);
                        }
                    } elseif ($update['is_out_of_stock']) {
                        $is_purchase = false;
                        $log_level = WC_Log_Levels::WARNING;
                        $product_log = "Ali product is out of stock";
                        self::update_product_if($woo_product, self::$settings->get_params('update_product_if_out_of_stock'), $product_log);
                    }
                    if ($is_purchase) {
                        if ($shipping_removed) {
                            $update['shipping_removed'] = $company ?: true;
                            $log_level = WC_Log_Levels::WARNING;
                            if ($company) {
                                $product_log = "The shipping company {$company} was removed";
                            } else {
                                $product_log = "Shipping error";
                            }
                            if ($update_product_if_shipping_error = self::$settings->get_params('update_product_if_shipping_error')) {
                                $is_purchase = false;
                                self::update_product_if($woo_product, $update_product_if_shipping_error, $product_log);
                            }
                        }
                        if ($is_purchase && $update_product_if_available_purchase = self::$settings->get_params('update_product_if_available_purchase')) {
                            if ($woo_product->get_status('edit') !== $update_product_if_available_purchase) {
                                $product_log = "Ali product is available for purchase";
                                self::update_product_if($woo_product, $update_product_if_available_purchase, $product_log);
                            }
                        }
                    }

                    ALD_Product_Table::update_post_meta($product_id, '_vi_wad_variations', $variations);
                    do_action('vi_wad_sync_product_successful', $product_id, $woo_id, $latest_variations, $currency_code, $data, $is_api_sync);

                    if ($product_log) {
                        $log .= $product_log;
                    } elseif (!empty($item_log)) {
                        $log .= implode(PHP_EOL, $item_log);
                    } else {
                        $log .= 'OK';
                    }
                }
            }
        } else {
            $log_level = WC_Log_Levels::ALERT;
            if (!empty($get_data['code']) && $get_data['code'] === 'currency_not_supported') {
                $log .= "Currency not supported";
            } else {
                $update['is_offline'] = true;
                $log .= "Ali product is offline";
                $woo_product = wc_get_product($woo_id);
                if ($woo_product) {
                    self::update_product_if($woo_product, self::$settings->get_params('update_product_if_not_available'), $log);
                }
            }
        }

        do_action('vi_wad_after_sync_product', $product_ids, $is_api_sync);
        VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Log::wc_log($log, $is_api_sync ? 'api-products-sync' : 'manual-products-sync', $log_level);
        ALD_Product_Table::update_post_meta($product_id, '_vi_wad_update_product_notice', $update);

        self::maybe_send_admin_email($update, $log, $product_ids);
    }

    /**
     * @param $update
     * @param $log
     * @param $product_ids
     */
    public static function maybe_send_admin_email( $update, $log, $product_ids ) {
        if (!empty($product_ids['id'])) {
            delete_transient('vi_wad_auto_update_product_' . $product_ids['id'] . 'time');
        }
        $send_email_if = self::$settings->get_params('send_email_if');
        $email_type = '';
        if ($update['is_offline'] && in_array('is_offline', $send_email_if)) {
            $email_type = 'is_offline';
        } elseif ($update['shipping_removed'] && in_array('shipping_removed', $send_email_if)) {
            $email_type = 'shipping_removed';
        } elseif (($update['is_out_of_stock'] || !empty($update['out_of_stock'])) && in_array('is_out_of_stock', $send_email_if)) {
            $email_type = 'is_out_of_stock';
        } elseif (!empty($update['price_changes']) && in_array('price_changes', $send_email_if)) {
            $email_type = 'price_changes';
        } elseif (!empty($update['price_exceeds']) && in_array('price_exceeds', $send_email_if)) {
            $email_type = 'price_exceeds';
        }

        if ($email_type) {
            self::send_admin_email($email_type, $log, $product_ids);
        }
    }

    /**
     * @param $email_type
     * @param $content
     * @param $product_ids
     */
    private static function send_admin_email( $email_type, $content, $product_ids ) {
        $woo_id = $product_ids['woo_id'];
        $view_url = admin_url("admin.php?page=woocommerce-alidropship-imported-list&vi_wad_search_woo_id={$woo_id}");
        switch ($email_type) {
            case 'is_offline':
            case 'shipping_removed':
            case 'is_out_of_stock':
            case 'price_changes':
                /*05-02-2025 Add option can edit notification email sync product*/
                $subject = self::$settings->get_params('send_email_subject_type_' . $email_type);
                $heading = self::$settings->get_params('send_email_content_type_' . $email_type);
                $heading = str_replace('{wad_woo_id}', $woo_id, $heading);
                break;
            case 'price_exceeds':
                $subject = esc_html__('AliExpress product price alert', 'woocommerce-alidropship');
                $heading = sprintf(wp_kses_post(__('Product #%s: Product/variation(s) price sync skipped', 'woocommerce-alidropship')), $woo_id);//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
                break;
            default:
                $subject = esc_html__('AliExpress product sync alert', 'woocommerce-alidropship');
                $heading = sprintf(wp_kses_post(__('Product #%s: AliExpress product data updated', 'woocommerce-alidropship')), $woo_id);//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
        }
        $mailer = WC()->mailer();
        $email = new WC_Email();
        $received_email = apply_filters('vi_wad_received_email_after_sync_product', self::$settings->get_params('received_email'), $product_ids);
        if (!$received_email) {
            $received_email = $email->get_from_address();
        }

        $headers = apply_filters('vi_wad_product_sync_email_headers', "Content-Type: text/html\r\nReply-to: {$email->get_from_name()} <{$received_email}>\r\n", $email, $received_email, $product_ids);
        $content .= '<p>' . sprintf(wp_kses_post(__('<a href="%1s" target="_blank">View On Imported Page</a>', 'woocommerce-alidropship')), esc_url($view_url)) . '</p>';//phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
        $content = $email->style_inline($mailer->wrap_message($heading, $content));

        $email->send($received_email, $subject, $content, $headers, array());
    }

    /**
     * @param $video_info
     * @param $product_id
     * @param $woo_id
     */
    private static function import_product_video( $video_info, $product_id, $woo_id ) {
        if (self::$settings->get_params('import_product_video')) {
            if (!empty($video_info['media_id']) && !empty($video_info['ali_member_id'])) {
                $update_video = false;
                if (!get_post_meta($woo_id, '_vi_wad_product_video', true)) {
                    $update_video = true;
                } else {
                    $old_video = ALD_Product_Table::get_post_meta($product_id, '_vi_wad_video', true);
                    if (!$old_video) {
                        $update_video = true;
                    } else {
                        if ($video_info['media_id'] !== $old_video['media_id']) {
                            $update_video = true;
                        } else {
                            if (empty($old_video['url'])) {
                                $update_video = true;
                            }
                        }
                    }
                }
                if ($update_video) {
                    $link = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_valid_aliexpress_video_link($video_info);
                    if ($link) {
                        $video_info['url'] = $link;
                        ALD_Product_Table::update_post_meta($product_id, '_vi_wad_video', viwad_prepare_url($video_info, 'video'));
                        update_post_meta($woo_id, '_vi_wad_product_video', $link);
                    }
                }
            }
        }
    }

    /**
     * Sync products
     *
     * @param $product WC_Product
     * @param $woo_id
     * @param $variations_skuAttr_s
     * @param $latest_variation
     * @param $shipping_cost
     * @param $currency_code
     * @param $variations
     * @param $update
     * @param $log
     * @param string $country_tax
     */
    private static function process_product_to_update( $product, $woo_id, $variations_skuAttr_s, $latest_variation, $shipping_cost, $currency_code, &$variations, &$update, &$log, $country_tax = '' ) {
        $update_product_quantity = self::$settings->get_params('update_product_quantity');
        $update_product_price = self::$settings->get_params('update_product_price');
        $save = false;
        $skuVal = isset($latest_variation['skuVal']) ? $latest_variation['skuVal'] : array();
        $skuID = $latest_variation['skuId'] ?? '';
        if ($skuID && $skuID !== $product->get_meta('_vi_wad_aliexpress_variation_id')) {
            $save = true;
            $product->update_meta_data('_vi_wad_aliexpress_variation_id', $skuID);
        }
        if (!empty($latest_variation['currency_code'])) {
            $currency_code = $latest_variation['currency_code'];
        }
        if (!empty($latest_variation['ship_from'])) {
            $variations[$variations_skuAttr_s]['ship_from'] = $latest_variation['ship_from'];
            update_post_meta($woo_id, '_vi_wad_aliexpress_variation_ship_from', $latest_variation['ship_from']);
        }
        if (isset($skuVal['availQuantity'])) {
            $variations[$variations_skuAttr_s]['stock'] = $skuVal['availQuantity'];
            if (!$skuVal['availQuantity']) {
                $update['out_of_stock'][] = $woo_id;
                $log[] = "#{$woo_id} Ali product is out of stock";
            }
            if ($update_product_quantity && $product->managing_stock()) {
                $old_stock = $product->get_stock_quantity();
                if ($old_stock != $skuVal['availQuantity']) {
                    $product->set_stock_quantity($skuVal['availQuantity']);
//					$product->set_stock_status( 'instock' );
                    $log[] = "#{$woo_id} has stock quantity changed from {$old_stock} to {$skuVal['availQuantity']}";
                    $save = true;
                }
            }
        }
        /**
         * Convert source price to USD(if needed) before updating
         * Source currency:
         *      1. USD -> ok
         *      2. RUB -> store currency must also be RUB or import_currency_rate_RUB must be configured
         *      3. CNY -> import_currency_rate_CNY must be configured
         */
        $rate = '';
        $accept_currencies = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_accept_currencies();
        $woocommerce_currency = get_option('woocommerce_currency');
        if ($currency_code === 'USD') {
            $rate = 1;
        } else {
            if ($woocommerce_currency === $currency_code) {
                if (in_array($woocommerce_currency, $accept_currencies)) {//temporarily restrict to RUB
                    $import_currency_rate = self::$settings->get_params('import_currency_rate');
                    if ($import_currency_rate) {
                        $rate = 1 / $import_currency_rate;
                    }
                }
            } elseif (in_array($currency_code, $accept_currencies, true)) {
                $rate = self::$settings->get_params("import_currency_rate_{$currency_code}");
            }
        }
        if ($rate) {
            if (isset($skuVal['skuMultiCurrencyCalPrice'])) {
                $variations[$variations_skuAttr_s]['regular_price'] = $skuVal['skuMultiCurrencyCalPrice'];
                $variations[$variations_skuAttr_s]['sale_price'] = isset($skuVal['actSkuMultiCurrencyCalPrice']) ? $skuVal['actSkuMultiCurrencyCalPrice'] : '';
                if (isset($skuVal['actSkuMultiCurrencyBulkPrice']) && VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuMultiCurrencyBulkPrice']) > VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($variations[$variations_skuAttr_s]['sale_price'])) {
                    /*Data passed from chrome extension*/
                    $variations[$variations_skuAttr_s]['sale_price'] = $skuVal['actSkuMultiCurrencyBulkPrice'];
                }
            } else {
                $variations[$variations_skuAttr_s]['regular_price'] = isset($skuVal['skuCalPrice']) ? $rate * (floatval($skuVal['skuCalPrice'])) : '';
                $variations[$variations_skuAttr_s]['sale_price'] = (isset($skuVal['actSkuCalPrice'], $skuVal['actSkuBulkCalPrice']) && VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuBulkCalPrice']) > VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($skuVal['actSkuCalPrice'])) ? $rate * $skuVal['actSkuBulkCalPrice'] : (isset($skuVal['actSkuCalPrice']) ? $rate * $skuVal['actSkuCalPrice'] : '');
                if (isset($skuVal['skuAmount']['currency'], $skuVal['skuAmount']['value']) && $skuVal['skuAmount']['value']) {
                    /*Data passed from chrome extension*/
                    if ($skuVal['skuAmount']['currency'] === $currency_code
                        || $skuVal['skuAmount']['currency'] === $woocommerce_currency
                        || in_array($skuVal['skuAmount']['currency'], $accept_currencies, true)) {

                        $variations[$variations_skuAttr_s]['regular_price'] = $rate * $skuVal['skuAmount']['value'];

                        if (isset($skuVal['skuActivityAmount']['currency'], $skuVal['skuActivityAmount']['value']) && $skuVal['skuActivityAmount']['value']) {
                            if ($skuVal['skuActivityAmount']['currency'] === $currency_code
                                || $skuVal['skuActivityAmount']['currency'] === $woocommerce_currency
                                || in_array($skuVal['skuActivityAmount']['currency'], $accept_currencies, true)) {
                                $variations[$variations_skuAttr_s]['sale_price'] = $rate * $skuVal['skuActivityAmount']['value'];
                            }
                        }
                    }
                }
            }

            $price = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($variations[$variations_skuAttr_s]['regular_price']);
            $sale_price = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($variations[$variations_skuAttr_s]['sale_price']);

            if ($sale_price && (!$price || (!self::$settings->get_params('use_ali_regular_price') && $sale_price < $price))) {
                $price = $sale_price;
            }
//			if ( $country_tax ) {
//				$price += $price * $country_tax;
//			}

            $price_change = self::handle_price($product, $woo_id, $update_product_price, $price, $shipping_cost, self::$is_excluded, $save, $log);

            if ($price_change === 'skip') {
                $update['price_exceeds'][] = $woo_id;
            } elseif ($price_change) {
                $update['price_changes'][] = $woo_id;
                if (!$update_product_price) {
                    $log[] = "#{$woo_id} Ali product may have price changed";
                } else if (self::$is_excluded === true) {
                    $log[] = "#{$woo_id} Ali product may have price changed but it's excluded from being synced";
                }
            }
        } else {
            $log[] = "#{$woo_id} Skip syncing price because currency not supported";
        }
        if ($save) {
            $product->save();
        }
    }

    /**
     * @param $product WC_Product
     * @param $woo_id
     * @param $update_product_price
     * @param float $price Price amount in USD
     * @param $shipping_cost
     * @param $is_excluded
     * @param $save
     * @param $log
     *
     * @return bool
     */
    public static function handle_price( $product, $woo_id, $update_product_price, $price, $shipping_cost, $is_excluded, &$save, &$log ) {
        $price_change = false;
        $regular_price_old = $product->get_regular_price();
        $sale_price_old = $product->get_sale_price();
        $has_sale_price = self::$settings->process_price($price, true, $woo_id);

        /*Generate new regular price and sale price in the store currency based on pricing rules*/
        if (self::$settings->get_params('shipping_cost_after_price_rules')) {
            $regular_price = self::$settings->process_exchange_price(self::$settings->process_price($price, false, $woo_id) + $shipping_cost);
            $sale_price = self::$settings->process_exchange_price($has_sale_price + $shipping_cost);
        } else {
            $regular_price = self::$settings->process_exchange_price(self::$settings->process_price($price + $shipping_cost, false, $woo_id));
            $sale_price = self::$settings->process_exchange_price(self::$settings->process_price($price + $shipping_cost, true, $woo_id));
        }

        $price_change_max = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float(self::$settings->get_params('price_change_max'));
        if ($price_change_max > 0) {
            $old_price = $sale_price_old ? VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($sale_price_old) : VI_WOOCOMMERCE_ALIDROPSHIP_DATA::string_to_float($regular_price_old);
            if ($old_price > 0) {
                $new_price = $has_sale_price ? $sale_price : $regular_price;
                $percent_change = round(100 * abs($new_price - $old_price) / $old_price, 0);
                if ($percent_change > $price_change_max) {
                    $log[] = "#{$woo_id} price sync skipped due to new price({$new_price}) exceeds the set value({$price_change_max}%)";

                    return 'skip';
                }
            }
        }

        /*Compare old and new regular prices*/
        if ($regular_price_old != $regular_price && $regular_price > 0) {

            if ($update_product_price && $is_excluded === false) {
                /*Update price if enabled*/
                $product->set_regular_price($regular_price);
                $product->set_price($regular_price);
                $log[] = "#{$woo_id} regular price changed from {$regular_price_old} to {$regular_price}";
                $save = true;
            }
            $price_change = true;
        }

        if ($has_sale_price) {
            /*If has sale price according to the new pricing rules*/
            if ($sale_price_old != $sale_price && $sale_price < $regular_price) {
                /*New sale price is valid and different from old sale price*/
                if ($update_product_price && $is_excluded === false) {
                    $product->set_sale_price($sale_price);
                    $product->set_price($sale_price);
                    $log[] = "#{$woo_id} sale price changed from {$sale_price_old} to {$sale_price}";
                    $save = true;
                }
                $price_change = true;
            } else {
                $sale_price_old = floatval($sale_price_old);
                if ($sale_price_old < $sale_price || $sale_price >= $regular_price) {
                    /*Remove old sale price*/
                    if ($update_product_price && $is_excluded === false) {
                        $product->set_sale_price('');
                        $log[] = "#{$woo_id} sale price changed from {$sale_price_old} to ";
                        $save = true;
                    }
                }
            }
        } elseif ($sale_price_old !== '') {
            /*If there's no sale price after applying new pricing rules and old sale price exists, remove it*/
            $sale_price_old = floatval($sale_price_old);

//			if ( $sale_price_old < self::$settings->process_exchange_price( $price ) || $sale_price_old == 0 || $sale_price_old >= $regular_price ) {
            if ($update_product_price && $is_excluded === false) {
                $product->set_sale_price('');
                $log[] = "#{$woo_id} sale price changed from {$sale_price_old} to ";
                $save = true;
            }
//			}
        }

        return $price_change;
    }

    /**
     * @param $woo_product WC_Product
     * @param $option
     * @param $log
     */
    public static function update_product_if( $woo_product, $option, &$log ) {
        switch ($option) {
            case 'publish':
            case 'pending':
            case 'draft':
            case 'private':
            case 'trash':
                if (!$woo_product->is_type('variation')) {
                    $woo_product->set_status($option);
                    $woo_product->save();
                    $log = "{$log}, Woo product status changed to {$option}";
                }
                break;
            case 'outofstock':
                if ($woo_product->is_type('variable')) {
                    $variations = $woo_product->get_children();
                    foreach ($variations as $variation_id) {
                        $variation = wc_get_product($variation_id);
                        if (!$variation->managing_stock()) {
                            $variation->set_stock_status('outofstock');
                            $variation->save();
                        } else {
                            $variation->set_stock_quantity(0);
                            $variation->save();
                        }
                    }
                    $log = "{$log}, Woo product's stock status changed to out-of-stock";
                } elseif ($woo_product->is_type('variation')) {
                    if (!$woo_product->managing_stock()) {
                        $woo_product->set_stock_status('outofstock');
                        $woo_product->save();
                    } else {
                        $woo_product->set_stock_quantity(0);
                        $woo_product->save();
                    }
                } else {
                    if (!$woo_product->managing_stock()) {
                        $woo_product->set_stock_status('outofstock');
                        $woo_product->save();
                        $log = "{$log}, Woo product's stock status changed to out-of-stock";
                    } else {
                        $woo_product->set_stock_quantity(0);
                        $woo_product->save();
                        $log = "{$log}, Woo product's stock status changed to out-of-stock";
                    }
                }
                break;
            case 'disable':
                if ($woo_product->is_type('variation')) {
                    $woo_product->set_status('private');
                    $woo_product->save();
                }
                break;
//			case 'publish':
//				if ( ! $woo_product->is_type( 'variation' ) ) {
//					$woo_product->set_status( 'publish' );
//					$woo_product->save();
//				}
//				break;
//			default:
        }
    }

    /**
     * @param $content
     * @param string $log_level
     */
    private static function log( $content, $log_level = 'alert' ) {
        VI_WOOCOMMERCE_ALIDROPSHIP_Admin_Log::wc_log($content, 'api-products-sync', $log_level);
    }

    /**
     * @param $options
     * @param $attr_data
     */
    public static function create_product_attributes( $options, &$attr_data ) {
        global $wp_taxonomies;
        $position = 1;
        if (self::$settings->get_params('use_global_attributes')) {
            foreach ($options as $option_k => $option) {
                $attribute_slug = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::sanitize_taxonomy_name($option['name']);
                $attribute_id = wc_attribute_taxonomy_id_by_name($option['name']);
                if (!$attribute_id) {
                    $attribute_id = wc_create_attribute(array(
                        'name' => $option['name'],
                        'slug' => $attribute_slug,
                        'type' => 'select',
                        'order_by' => 'menu_order',
                        'has_archives' => false,
                    ));
                }
                if ($attribute_id && !is_wp_error($attribute_id)) {
                    $attribute_obj = wc_get_attribute($attribute_id);
                    $attribute_options = array();
                    if (!empty($attribute_obj)) {
                        $taxonomy = $attribute_obj->slug; // phpcs:ignore
                        $wp_taxonomies[$taxonomy] = new WP_Taxonomy($taxonomy, 'product');
                        if (!empty($option['values'])) {
                            foreach ($option['values'] as $term_k => $term_v) {
                                $option['values'][$term_k] = strval(wc_clean($term_v));
                                $attribute_value = get_term_by('slug', VI_WOOCOMMERCE_ALIDROPSHIP_DATA::sanitize_taxonomy_name($option['values'][$term_k]), $taxonomy);
                                if (!$attribute_value) {
                                    $insert_term = wp_insert_term($option['values'][$term_k], $taxonomy);
                                    if (!is_wp_error($insert_term)) {
                                        $attribute_options[] = $insert_term['term_id'];
                                    } elseif (isset($insert_term->error_data) && isset($insert_term->error_data['term_exists'])) {
                                        $attribute_options[] = $insert_term->error_data['term_exists'];
                                    }
                                } else {
                                    $attribute_options[] = $attribute_value->term_id;
                                }
                            }
                        }
                    }
                    $attribute_object = new WC_Product_Attribute();
                    $attribute_object->set_id($attribute_id);
                    $attribute_object->set_name(wc_attribute_taxonomy_name_by_id($attribute_id));
                    if (!empty($attribute_options)) {
                        $attribute_object->set_options($attribute_options);
                    } else {
                        $attribute_object->set_options($option['values']);
                    }
                    $attribute_object->set_position($position);
                    $attribute_object->set_visible(apply_filters('vi_wad_create_product_attribute_set_visible', 0, $option));
                    $attribute_object->set_variation(1);
                    $attr_data[] = $attribute_object;
                    $position++;
                }
            }
        } else {
            foreach ($options as $option_k => $option) {
                $attribute_object = new WC_Product_Attribute();
                $attribute_object->set_name($option['name']);
                $attribute_object->set_options($option['values']);
                $attribute_object->set_position($position);
                $attribute_object->set_visible(apply_filters('vi_wad_create_product_attribute_set_visible', 0, $option));
                $attribute_object->set_variation(1);
                $attr_data[] = $attribute_object;
                $position++;
            }
        }
    }

    /**
     * @param $options
     * @param $variant
     * @param $attr_key
     *
     * @return array
     */
    public static function create_variation_attribute( $options, $variant, $attr_key ) {
        $attributes = array();
        $attributes_mapping_origin = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_attributes_mapping_origin();
        $attributes_mapping_replacement = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::get_attributes_mapping_replacement();
        if (self::$settings->get_params('use_global_attributes')) {
            foreach ($options as $option_k => $option_v) {
                if (!empty($variant[$attr_key][$option_k])) {
                    $term_value = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::find_attribute_replacement($attributes_mapping_origin, $attributes_mapping_replacement, $variant[$attr_key][$option_k], $option_k);
                    if (!$term_value) {
                        $term_value = $variant[$attr_key][$option_k];
                    }
                    $attribute_id = wc_attribute_taxonomy_id_by_name($option_v['name']);
                    $attribute_obj = wc_get_attribute($attribute_id);
                    if ($attribute_obj) {
                        $attribute_value = get_term_by('slug', VI_WOOCOMMERCE_ALIDROPSHIP_DATA::sanitize_taxonomy_name($term_value), $attribute_obj->slug);
                        if (!$attribute_value) {
                            $attribute_value = get_term_by('name', $term_value, $attribute_obj->slug);
                        }
                        if ($attribute_value) {
                            $attributes[VI_WOOCOMMERCE_ALIDROPSHIP_DATA::sanitize_taxonomy_name($attribute_obj->slug)] = $attribute_value->slug;
                        }
                    }
                }
            }
        } else {
            foreach ($options as $option_k => $option_v) {
                if (!empty($variant[$attr_key][$option_k])) {
                    $term_value = VI_WOOCOMMERCE_ALIDROPSHIP_DATA::find_attribute_replacement($attributes_mapping_origin, $attributes_mapping_replacement, $variant[$attr_key][$option_k], $option_k);
                    if (!$term_value) {
                        $term_value = $variant[$attr_key][$option_k];
                    }
                    $attributes[$option_k] = $term_value;
                }
            }
        }

        return $attributes;
    }
}