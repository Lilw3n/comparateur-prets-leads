jQuery(document).ready(function ($) {
    'use strict';
    let queue = [],is_importing = false,is_bulk_remove = false, is_current_page_focus = false;
    $('.vi-ui.tabular.menu .item').tab();
    $('.vi-ui.accordion').accordion('refresh');
    $('.ui-sortable').sortable();
    $('.vi-ui.dropdown:not(.tmds-accordion-bulk-actions)').dropdown();
    $(document).on('change','input[type=number]', function (e) {
        if (!jQuery(this).val() && jQuery(this).data('allow_empty')) {
            return;
        }
        let val = parseFloat(jQuery(this).val() || 0),
            min = $(this).attr('min') ? parseFloat($(this).attr('min')) : '',
            max = $(this).attr('max') ? parseFloat($(this).attr('max')) : '';
        let old_val = val;
        if (max && (!val || val > max)) {
            val = max;
        }else if ( min && min > val){
            val = min;
        }
        if (val !== old_val) {
            $(this).val(val);
        }
    });

    /*Set paged to 1 before submitting*/
    $('.tablenav-pages').find('.current-page').on('focus', function (e) {
        is_current_page_focus = true;
    }).on('blur', function (e) {
        is_current_page_focus = false;
    });
    $('.search-box').find('input[type="submit"]').on('click', function () {
        let $form = $(this).closest('form');
        if (!is_current_page_focus) {
            $form.find('.current-page').val(1);
        }
    });
    //search select2
    $('.tmds-search-select2:not(.tmds-search-select2-init)').each(function () {
        let select = $(this);
        let close_on_select = false, min_input = 2, placeholder = '', data_send={}, type_select2 = select.data('type_select2');
        switch (type_select2) {
            case 'product':
                close_on_select = true;
                placeholder = 'Please enter product title to search';
                data_send = {
                    action: 'tmds_search_products',
                    exclude_tmds_product: 1,
                    security: wc_enhanced_select_params.search_products_nonce,
                }
                break;
        }
        select.addClass('tmds-search-select2-init').select2(select2_params(placeholder, data_send, close_on_select, min_input));
    });
    /*Set paged to 1 before submitting*/

    /**
     * Empty import list
     */
    $(document).on('click','.tmds-button-empty-import-list', function (e) {
        if (!confirm('Do you want to delete all products(except overriding products) from your Import list?')) {
            e.preventDefault();
            return false;
        }
    });
    /**
     * Override product
     */
    let found_items, check_orders;
    $(document).on('change','.tmds-override-woo-id', function (){
        let $btn_import = $(this).closest('.tmds-product-row').find('.tmds-button-import'), val =$(this).val();
        $btn_import.data('override_product_id','');
       if (val){
           $btn_import.removeClass('tmds-button-import').addClass('tmds-button-map-existing tmds-button-override');
           $btn_import.html($btn_import.data('override_title'));
       }else {
           $btn_import.addClass('tmds-button-import').removeClass('tmds-button-map-existing tmds-button-override');
           $btn_import.html($btn_import.data('import_title'));
       }
    });
    $(document).on('click','.tmds-button-override', function (e){
        e.stopPropagation();
        let $button_import = $(this);
        let product_id = $button_import.data('product_id');
        let $container = $button_import.closest('.tmds-accordion.tmds-product-row');
        let selected = {};
        if ($container.find('.tmds-variation-enable').length > 0) {
            let each_selected = [];
            let selected_key = 0;
            $container.find('.tmds-variation-enable').map(function () {
                let $row = $(this).closest('.tmds-product-variation-row');
                if ($(this).prop('checked') && !$row.hasClass('tmds-variation-filter-inactive')) {
                    each_selected.push(selected_key);
                }
                selected_key++;
            });
            selected[product_id] = each_selected;
        } else {
            selected[product_id] = [0];
        }
        if (selected[product_id].length === 0) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_variation_error, ['error'], '', false, 4500]);
            return false;
        }
        let empty_price_error = false,
            sale_price_error = false;

        $container.find('.tmds-import-data-variation-sale-price').removeClass('tmds-price-error');
        $container.find('.tmds-import-data-variation-regular-price').removeClass('tmds-price-error');
        for (let i = 0; i < $container.find('.tmds-import-data-variation-sale-price').length; i++) {
            let sale_price = $container.find('.tmds-import-data-variation-sale-price').eq(i);
            let regular_price = $container.find('.tmds-import-data-variation-regular-price').eq(i);
            if (!parseFloat(regular_price.val())) {
                empty_price_error = true;
                regular_price.addClass('tmds-price-error')
            } else if (parseFloat(sale_price.val()) > parseFloat(regular_price.val())) {
                sale_price_error = true;
                sale_price.addClass('tmds-price-error')
            }
        }
        if (empty_price_error) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_price_error, ['error'], '', false, 4500]);
            return false;
        } else if (sale_price_error) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_sale_price_error, ['error'], '', false, 4500]);
            return false;
        }

        if ($container.find('.tmds-override-product-product-title').length ) {
            $('.tmds-override-product-title').html($container.find('.tmds-override-product-product-title').html());
        } else {
            $('.tmds-override-product-title').html($container.find('.tmds-override-woo-id').find(':selected').html());
        }

        $('.tmds-override-product-options-button-override').data('product_id', product_id).data('override_product_id', $button_import.data('override_product_id'));

        tmds_override_product_show($button_import);
    });
    $(document).on('click','.tmds-override-product-options-button-override', function (){
        let $button = $(this);
        let product_id = $button.data('product_id');
        let $button_import = $('.tmds-button-override[data-product_id="' + product_id + '"]');
        let $button_container = $button_import.closest('.tmds-button-view-and-edit');
        let $product_container = $('#tmds-product-item-id-' + product_id);
        let $form = $product_container.find('.tmds-product-container');
        let form_data = $form.find('.vi-ui.tab').not('.tmds-variations-tab').find('input,select,textarea').serializeArray();
        let description = $('#wp-tmds-product-description-' + product_id + '-wrap').hasClass('tmce-active') ? tinyMCE.get('tmds-product-description-' + product_id).getContent() : $('#tmds-product-description-' + product_id).val();
        form_data.push({name: 'tmds_product[' + product_id + '][description]', value: description});
        let selected = {};

        if ($form.find('.tmds-variation-enable').length > 0) {
            let each_selected = [];
            let selected_key = 0;
            $form.find('.tmds-variation-enable').map(function () {
                let $row = $(this).closest('.tmds-product-variation-row');
                if ($(this).prop('checked') && !$row.hasClass('tmds-variation-filter-inactive')) {
                    each_selected.push(selected_key);
                    let variation_data = $row.find('input,select,textarea').serializeArray();
                    if (variation_data.length > 0) {
                        /*only send data of selected variations*/
                        for (let v_i = 0; v_i < variation_data.length; v_i++) {
                            form_data.push(variation_data[v_i]);
                        }
                    }
                }
                selected_key++;
            });
            selected[product_id] = each_selected;
        } else {
            selected[product_id] = [0];
        }

        form_data.push({name: 'z_check_max_input_vars', value: 1});
        form_data = $.param(form_data);

        let newFormData = {};
        let replace_items = {};

        parse_str(form_data, newFormData);

        if (check_orders) {
            $('.tmds-override-order-container').map(function () {
                replace_items[$(this).data('replace_item_id')] = $(this).find('.tmds-override-with').val();
            })
        }

        $button_import.addClass('loading');
        $button.addClass('loading');
        let data = {
            action: 'tmds_override',
            tmds_nonce: tmds_params.nonce,
            form_data: newFormData,
            selected: selected,
            check_orders: check_orders || '',
            replace_items: replace_items,
            found_items: found_items,
            override_product_id: $button.data('override_product_id'),
            override_woo_id: $product_container.find('.tmds-override-woo-id').val(),
        }
        if ($('.tmds-override-product-options-option-wrap').length){
            let update_settings={};
            for (let i = 0; i < $('.tmds-override-product-options-option-wrap').length; i++) {
                let $option = $('.tmds-override-product-options-option-wrap').eq(i).find('input');
                if (!$option.data('order_option')){
                    continue;
                }
                update_settings[$option.data('order_option')] = $option.prop('checked') ? 1 : '';
            }
            data.update_settings =update_settings;
        }
        console.log(data)
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                if (check_orders) {
                    if (response.status === 'success') {
                        tmds_override_product_hide();
                        $button_container.append(response.button_html);
                        $button_container.find('.tmds-button-remove').remove();
                        $button_import.remove();
                        $product_container.find('.content').remove();
                        $product_container.find('.tmds-accordion-bulk-item-check').remove();
                        $product_container.find('.tmds-accordion-title-icon').attr('class', 'icon check green');
                        maybe_hide_bulk_actions();
                    } else {
                        $(document.body).trigger('villatheme_show_message', [response.message, ['error'], '', false, 4500]);
                    }

                } else {
                    if (response.status === 'checked') {
                        let $replace_order = $('.tmds-override-product-options-content-body-override-old');
                        $replace_order.removeClass('tmds-hidden').html(response.replace_order_html);
                        check_orders = 1;
                        found_items = response.found_items;
                        if (data?.update_settings?.overriding_hide) {
                            $('.tmds-override-product-options-content-body-option').remove();
                        } else {
                            $('.tmds-override-product-options-content-body-option').addClass('tmds-hidden');
                        }
                    } else if (response.status === 'success') {
                        tmds_override_product_hide();
                        $button_container.append(response.button_html);
                        $button_container.find('.tmds-button-remove').remove();
                        $button_import.remove();
                        $product_container.find('.content').remove();
                        $product_container.find('.tmds-accordion-bulk-item-check').remove();
                        $product_container.find('.tmds-accordion-title-icon').attr('class', 'icon check green');
                        maybe_hide_bulk_actions();
                    } else {
                        $(document.body).trigger('villatheme_show_message', [response.message, ['error'], '', false, 4500]);
                    }
                }
            },
            error: function (err) {
                console.log(err)
            },
            complete: function () {
                $button_import.removeClass('loading');
                $button.removeClass('loading');
            }
        })
    });
    $(document).on('change', '.tmds-override-with-attributes>select', function (e) {
        if ($('.tmds-override-product-options-override-keep-product').prop('checked') ||
            $('.tmds-override-product-options-container').hasClass('tmds-override-product-options-container-reimport') ||
            $('.tmds-override-product-options-container').hasClass('tmds-override-product-options-container-map-existing')) {
            let $current = $(this);
            let selected = $current.val();
            let prev_value = $current.data('prev_value');
            $('.tmds-override-with-attributes>select').not($(this)).map(function () {
                let $current = $(this);
                if (selected) {
                    $current.find(`option[value="${selected}"]`).prop('disabled', true);
                }
                if (prev_value) {
                    $current.find(`option[value="${prev_value}"]`).prop('disabled', false);
                }
            });
            $current.data('prev_value', selected);
        }
    });
    $(document).on('click','.tmds-override-product-options-button-cancel,.tmds-override-product-options-close,.tmds-override-product-overlay', function () {
        tmds_override_product_hide();
    });
    function tmds_override_product_hide() {
        $('.tmds-override-product-options-container').addClass('tmds-hidden');
        found_items = [];
        check_orders = 0;
        tmds_enable_scroll();
    }
    function tmds_override_product_show($button_import) {
        let $container = $('.tmds-override-product-options-container');

        if ($button_import.hasClass('tmds-button-map-existing')) {
            $container.addClass('tmds-override-product-options-container-map-existing');
        } else {
            $container.removeClass('tmds-override-product-options-container-map-existing');
        }

        if ($button_import.hasClass('tmds-button-reimport')) {
            $container.addClass('tmds-override-product-options-container-reimport');
        } else {
            $container.removeClass('tmds-override-product-options-container-reimport');
        }

        $container.removeClass('tmds-hidden');

        $('.tmds-override-product-options-content-body-override-old').addClass('tmds-hidden');

        let $override_options = $('.tmds-override-product-options-content-body-option');
        if ($override_options.length > 0) {
            $override_options.removeClass('tmds-hidden');
        } else {
            $('.tmds-override-product-options-button-override').trigger('click');
        }

        found_items = [];
        check_orders = 0;
        tmds_disable_scroll();
    }
    /**
     * Remove product
     */
    let $import_list_count = $('.tmds-import-list-count');
    let $imported_list_count = $('.tmds-imported-list-count');
    $(document).on('click','.tmds-button-remove', function (e) {
        e.stopPropagation();
        let $button_remove = $(this);
        let product_id = $button_remove.data('product_id');
        let $product_container = $('#tmds-product-item-id-' + product_id);
        if (!$button_remove.closest('.tmds-button-view-and-edit').find('.loading').length && (is_bulk_remove || confirm(tmds_params.i18n_remove_product_confirm))) {
            $product_container.accordion('close', 0).addClass('tmds-accordion-removing');
            $button_remove.addClass('loading');
            hide_message($product_container);
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_remove',
                    tmds_nonce: tmds_params.nonce,
                    product_id: product_id,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        let import_list_count_value = parseInt($import_list_count.html());
                        if (import_list_count_value > 0) {
                            let current_count = parseInt(import_list_count_value - 1);
                            $import_list_count.html(current_count);
                            $import_list_count.parent().attr('class', 'update-plugins count-' + current_count);
                        }
                        $product_container.fadeOut(300);
                        setTimeout(function () {
                            $product_container.remove();
                            maybe_reload_page();
                            maybe_hide_bulk_actions();
                        }, 300)
                    } else {
                        $product_container.accordion('open', 0).removeClass('tmds-accordion-removing');
                        show_message($product_container, 'negative', response.message ? response.message : 'Error');
                    }
                },
                error: function (err) {
                    console.log(err);
                    $product_container.accordion('open', 0).removeClass('tmds-accordion-removing');
                    show_message($product_container, 'negative', err.statusText);
                },
                complete: function () {
                    $button_remove.removeClass('loading');
                }
            });
        }
    });
    /**
     * Import product
     */
    $(document).on('click','.tmds-button-import', function (e) {
        e.stopPropagation();
        let newFormData = {};
        let $button_import = $(this);
        let $button_container = $button_import.closest('.tmds-button-view-and-edit');
        let product_id = $button_import.data('product_id');
        let $product_container = $('#tmds-product-item-id-' + product_id);
        if ($product_container.hasClass('tmds-accordion-importing') || $product_container.hasClass('tmds-accordion-removing') || $product_container.hasClass('tmds-accordion-splitting')) {
            return false;
        }
        let $form = $product_container.find('.tmds-product-container');
        let form_data = $form.find('.vi-ui.tab').not('.tmds-variations-tab').find('input,select,textarea').serializeArray();
        let description = $('#wp-tmds-product-description-' + product_id + '-wrap').hasClass('tmce-active') ? tinyMCE.get('tmds-product-description-' + product_id).getContent() : $('#tmds-product-description-' + product_id).val();
        let selected = {};
        if ($form.find('.tmds-variation-enable').length > 0) {
            let each_selected = [];
            let selected_key = 0;
            $form.find('.tmds-variation-enable').map(function () {
                let $row = $(this).closest('.tmds-product-variation-row');
                if ($(this).prop('checked') && !$row.hasClass('tmds-variation-filter-inactive')) {
                    each_selected.push(selected_key);
                    let variation_data = $row.find('input,select,textarea').serializeArray();
                    if (variation_data.length > 0) {
                        /*only send data of selected variations*/
                        for (let v_i = 0; v_i < variation_data.length; v_i++) {
                            form_data.push(variation_data[v_i]);
                        }
                    }
                }
                selected_key++;
            });
            selected[product_id] = each_selected;
        } else {
            selected[product_id] = [0];
        }
        form_data.push({name: 'z_check_max_input_vars', value: 1});
        form_data = $.param(form_data);

        parse_str(form_data, newFormData);

        if (selected[product_id].length === 0) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_variation_error, ['error'], '', false, 4500]);
            return;
        }
        let empty_price_error = false, sale_price_error = false;
        $form.find('.tmds-import-data-variation-sale-price').removeClass('tmds-price-error');
        $form.find('.tmds-import-data-variation-regular-price').removeClass('tmds-price-error');
        for (let i = 0; i < $form.find('.tmds-import-data-variation-sale-price').length; i++) {
            let sale_price = $form.find('.tmds-import-data-variation-sale-price').eq(i);
            let regular_price = $form.find('.tmds-import-data-variation-regular-price').eq(i);
            if (!parseFloat(regular_price.val())) {
                empty_price_error = true;
                regular_price.addClass('tmds-price-error')
            } else if (parseFloat(sale_price.val()) > parseFloat(regular_price.val())) {
                sale_price_error = true;
                sale_price.addClass('tmds-price-error')
            }
        }

        if (empty_price_error) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_price_error, ['error'], '', false, 4500]);
            return;
        } else if (sale_price_error) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_sale_price_error, ['error'], '', false, 4500]);
            return;
        }

        $button_import.addClass('loading');

        if (!is_importing) {
            $product_container.accordion('close', 0).addClass('tmds-accordion-importing');
            is_importing = true;
            let form_data_send={}, selected_send = {};
            $.each(newFormData, function (k, v) {
                if (typeof v === 'object') {
                    form_data_send[k] = JSON.stringify(v).toString();
                } else {
                    form_data_send[k] = v;
                }
            });
            $.each(selected, function (k, v) {
                if (typeof v === 'object') {
                    selected_send[k] = JSON.stringify(v).toString();
                } else {
                    selected_send[k] = v;
                }
            });
            form_data_send['description_'+product_id] =  description;
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_import',
                    tmds_nonce: tmds_params.nonce,
                    form_data: form_data_send,
                    selected: selected_send,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        let import_list_count_value = parseInt($import_list_count.html());
                        if (import_list_count_value > 0) {
                            import_list_count_value--;
                            $import_list_count.html(import_list_count_value);
                            $import_list_count.parent().attr('class', 'update-plugins count-' + import_list_count_value);
                        } else {
                            $import_list_count.html(0);
                            $import_list_count.parent().attr('class', 'update-plugins count-' + 0);
                        }
                        let imported_list_count_value = parseInt($imported_list_count.html());
                        imported_list_count_value++;
                        $imported_list_count.html(imported_list_count_value);
                        $imported_list_count.parent().attr('class', 'update-plugins count-' + imported_list_count_value);
                        if ($('.tmds-button-import').length === 0) {
                            $('.tmds-button-import-all').remove();
                        }
                        $button_container.append(response.button_html);
                        $button_container.find('.tmds-button-remove').remove();
                        $button_import.remove();
                        $product_container.find('.content').remove();
                        $product_container.find('.tmds-accordion-title-icon').attr('class', 'icon check green');
                        maybe_hide_bulk_actions();
                    } else {
                        $button_import.removeClass('loading');
                        show_message($product_container, 'negative', response.message ? response.message : 'Error');
                    }
                },
                error: function (err) {
                    console.log(err)
                    $button_import.removeClass('loading');
                    show_message($product_container, 'negative', err.statusText);
                },
                complete: function () {
                    is_importing = false;
                    $product_container.accordion('open', 0).removeClass('tmds-accordion-importing');
                    if (queue.length > 0) {
                        queue.shift().click();
                    } else if ($('.tmds-button-import-all').hasClass('loading')) {
                        tinyMCE.execCommand("mceRepaint");
                        $('.tmds-button-import-all').removeClass('loading')
                    }
                }
            })
        } else {
            queue.push($button_import);
        }
    });

    /**
     * Bulk import
     */
    $(document).on('click','.tmds-button-import-all', function () {
        let $button_import = $(this);

        if ($button_import.hasClass('loading')) {
            return;
        }

        if (!confirm(tmds_params.i18n_import_all_confirm)) {
            return;
        }

        $('.tmds-button-import').not('.loading').map(function () {
            if ($(this).closest('.tmds-button-view-and-edit').find('.loading').length === 0) {
                queue.push($(this));
                $(this).addClass('loading');
            }
        });

        if (queue.length > 0) {
            if (!is_importing) {
                queue.shift().click();
            }
            $button_import.addClass('loading');
        } else {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_not_found_error, ['error'], '', false, 4500]);
        }
    });
    /*Bulk product*/
    $('.tmds-import-data-categories,.tmds-modal-popup-set-categories-select').dropdown({
        fullTextSearch: true,
        onAdd: function (value, text, $choice) {
            $(this).find('a.ui.label').map(function () {
                let $option = $(this);
                $option.html($option.html().replace(/&nbsp;/g, ''));
            })
        }
    });
    $(document).on('click','.tmds-accordion-bulk-item-check', function (e) {
        e.stopPropagation();
        maybe_hide_bulk_actions();
    });
    $(document).on('change','.tmds-accordion-bulk-item-check-all',function (e){
        e.stopPropagation();
        $('.tmds-accordion-bulk-item-check').prop('checked', $(this).prop('checked')).trigger('change');
        setTimeout(function (){
            maybe_hide_bulk_actions();
        },100);
    });
    $('.tmds-accordion-bulk-actions').dropdown({
        onChange:function (action) {
            let $checkbox = $('.tmds-accordion-bulk-item-check:checked');
            if (!$checkbox.length || !action){
                return false;
            }
            switch (action){
                case 'set_status_publish':
                case 'set_status_pending':
                case 'set_status_draft':
                    let status = action.replace('set_status_', '');
                    $checkbox.map(function () {
                        let $button = $(this);
                        if ($button.prop('checked')) {
                            let $container = $button.closest('.tmds-accordion'),
                                $status = $container.find('.tmds-import-data-status');
                            if ($status.length > 0) {
                                $status.dropdown('set selected', status);
                            }
                        }
                    });
                    break;
                case 'set_visibility_visible':
                case 'set_visibility_catalog':
                case 'set_visibility_search':
                case 'set_visibility_hidden':
                    let visibility = action.replace('set_visibility_', '');
                    $checkbox.map(function () {
                        let $button = $(this);
                        if ($button.prop('checked')) {
                            let $container = $button.closest('.tmds-accordion'),
                                $visibility = $container.find('.tmds-import-data-catalog-visibility');
                            if ($visibility.length > 0) {
                                $visibility.dropdown('set selected', visibility);
                            }
                        }
                    });
                    break;
                case 'set_tags':
                case 'set_categories':
                case 'set_shipping_class':
                    let taxonomy = action.replace('set_', '');
                    let $container = $('.tmds-modal-popup-container');
                    $container.attr('class', `tmds-modal-popup-container tmds-modal-popup-container-set-${taxonomy}`);
                    tmds_set_price_show();
                    break;
                case 'import':
                    if (confirm(tmds_params.i18n_bulk_import_product_confirm)) {
                        $checkbox.map(function () {
                            let $button = $(this);
                            if ($button.prop('checked')) {
                                let $container = $button.closest('.tmds-accordion');
                                $container.find('.tmds-button-import:not(.tmds-hidden)').trigger('click');
                            }
                        });
                    }
                    break;
                case 'remove':
                    if (confirm(tmds_params.i18n_bulk_remove_product_confirm)) {
                        is_bulk_remove = true;
                        $checkbox.map(function () {
                            let $button = $(this);
                            if ($button.prop('checked')) {
                                let $container = $button.closest('.tmds-accordion');
                                $container.find('.tmds-button-remove').trigger('click');
                            }
                        });
                        is_bulk_remove = false;
                    }
                    break;
            }
            $('.tmds-accordion-bulk-actions').dropdown('clear');
        }
    });
    $(document).on('click','.tmds-overlay,.tmds-modal-popup-close,.tmds-bulk-action-button-cancel', function (){
        tmds_set_price_hide();
    });
    $('body')
        .on('click', '.tmds-set-categories-button-set', function () {
            let $checkbox = $('.tmds-accordion-bulk-item-check'),
                $new_categories = $('select[name="bulk_set_categories"]'),
                new_categories = $new_categories.val();

            $checkbox.map(function () {
                let $button = $(this);
                if ($button.prop('checked')) {
                    let $container = $button.closest('.tmds-accordion'),
                        $categories = $container.find('.tmds-import-data-categories');
                    if ($categories.length > 0) {
                        $categories.dropdown('set exactly', new_categories);
                    }
                }
            });

            tmds_set_price_hide();
        })
        .on('click', '.tmds-set-categories-button-add', function () {
            let $checkbox = $('.tmds-accordion-bulk-item-check'),
                $new_categories = $('select[name="bulk_set_categories"]');
            let new_categories = $new_categories.val();
            if (new_categories.length > 0) {
                $checkbox.map(function () {
                    let $button = $(this);
                    if ($button.prop('checked')) {
                        let $container = $button.closest('.tmds-accordion'),
                            $categories = $container.find('.tmds-import-data-categories');
                        if ($categories.length > 0) {
                            $categories.dropdown('set exactly', [...new Set(new_categories.concat($categories.dropdown('get values')))]);
                        }
                    }
                });
            }
            tmds_set_price_hide();
        })
        .on('click', '.tmds-set-tags-button-set', function () {
            let $checkbox = $('.tmds-accordion-bulk-item-check'),
                $new_tags = $('select[name="bulk_set_tags"]'), new_tags = $new_tags.val();
            $checkbox.map(function () {
                let $button = $(this);
                if ($button.prop('checked')) {
                    let $container = $button.closest('.tmds-accordion'),
                        $tags = $container.find('.tmds-import-data-tags');
                    if ($tags.length > 0) {
                        $tags.dropdown('set exactly', new_tags);
                    }
                }
            });
            tmds_set_price_hide();
        })
        .on('click', '.tmds-set-tags-button-add', function () {
            let $checkbox = $('.tmds-accordion-bulk-item-check'),
                $new_tags = $('select[name="bulk_set_tags"]'), new_tags = $new_tags.val();
            if (new_tags.length > 0) {
                $checkbox.map(function () {
                    let $button = $(this);
                    if ($button.prop('checked')) {
                        let $container = $button.closest('.tmds-accordion'),
                            $tags = $container.find('.tmds-import-data-tags');
                        if ($tags.length > 0) {
                            $tags.dropdown('set exactly', [...new Set(new_tags.concat($tags.dropdown('get values')))]);
                        }
                    }
                });
            }
            tmds_set_price_hide();
        })
        .on('click', '.tmds-modal-popup-set-categories-clear', function () {
            $(this).parent().find('.tmds-modal-popup-set-categories-select').dropdown('clear')
        })
        .on('click', '.tmds-modal-popup-set-tags-clear', function () {
            $(this).parent().find('.tmds-modal-popup-set-tags-select').dropdown('clear')
        })
        .on('click', '.tmds-set-shipping_class-button-set', function () {
            let $checkbox = $('.tmds-accordion-bulk-item-check'),
                $new_shipping_class = $('select[name="bulk_set_shipping_class"]'),
                new_shipping_class = $new_shipping_class.val();
            $checkbox.map(function () {
                let $button = $(this);
                if ($button.prop('checked')) {
                    let $container = $button.closest('.tmds-accordion'),
                        $shipping_class = $container.find('.tmds-import-data-shipping-class');
                    if ($shipping_class.length > 0) {
                        $shipping_class.dropdown('set exactly', new_shipping_class);
                    }
                }
            });
            tmds_set_price_hide();
        });
    /*Bulk product*/
    /**
     * Bulk set price confirm
     */
    $('body').on('click', '.tmds-set-price', function () {
        let $button = $(this);
        $button.addClass('tmds-set-price-editing');
        let $container = $('.tmds-modal-popup-container');
        $container.attr('class', 'tmds-modal-popup-container tmds-modal-popup-container-set-price');
        let $content = $('.tmds-modal-popup-content-set-price');
        $content.find('.tmds-modal-popup-header').find('h2').html('Set ' + $button.data('set_price').replace(/_/g, ' '));
        tmds_set_price_show();
    });
    $(document).on('change','.tmds-set-price-amount', function () {
        let price = parseFloat($(this).val());
        if (isNaN(price)) {
            price = 0;
        }
        $(this).val(price);
    });
    $(document).on('click','.tmds-set-price-button-set', function () {
        let button = $(this);
        let action = $('.tmds-set-price-action').val(),
            amount = parseFloat($('.tmds-set-price-amount').val());
        let editing = $('.tmds-set-price-editing');
        let container = editing.closest('table');
        let target_field;
        if (editing.data('set_price') === 'sale_price') {
            target_field = container.find('.tmds-import-data-variation-sale-price');
        } else {
            target_field = container.find('.tmds-import-data-variation-regular-price');
        }
        if (target_field.length > 0) {
            switch (action) {
                case 'set_new_value':
                    target_field.map(function () {
                        let $price = $(this), $row = $price.closest('.tmds-product-variation-row');
                        if (!$row.hasClass('tmds-variation-filter-inactive') && $row.find('.tmds-variation-enable').prop('checked')) {
                            $price.val(amount);
                        }
                    });
                    break;
                case 'increase_by_fixed_value':
                    target_field.map(function () {
                        let $price = $(this), $row = $price.closest('.tmds-product-variation-row'),
                            current_amount = parseFloat($price.val());
                        if (!$row.hasClass('tmds-variation-filter-inactive') && $row.find('.tmds-variation-enable').prop('checked')) {
                            $price.val(current_amount + amount);
                        }
                    });
                    break;
                case 'increase_by_percentage':
                    target_field.map(function () {
                        let $price = $(this), $row = $price.closest('.tmds-product-variation-row'),
                            current_amount = parseFloat($price.val());
                        if (!$row.hasClass('tmds-variation-filter-inactive') && $row.find('.tmds-variation-enable').prop('checked')) {
                            $price.val((1 + amount / 100) * current_amount);
                        }
                    });
                    break;
            }
        }
        tmds_set_price_hide();
    });
    /**
     * Bulk set price confirm
     */


    /*Switch tmce when opening Description tab*/
    $(document).on('click', '.tmds-description-tab-menu',function () {
        $(`.tmds-description-tab[data-tab="${$(this).data('tab')}"]`).find('.switch-tmce').trigger('click');
    });

    /**
     * Filter product attributes
     */
    $('body').on('click', '.tmds-attribute-filter-item', function (e) {
        let $button = $(this);
        let selected = [];
        let $container = $button.closest('table');
        let $attribute_filters = $container.find('.tmds-attribute-filter-list');
        let $attribute_filter = $attribute_filters.eq(0);
        let current_filter_slug = $attribute_filter.data('attribute_slug');
        if ($button.hasClass('tmds-attribute-filter-item-active')) {
            $button.removeClass('tmds-attribute-filter-item-active');
        } else {
            $button.addClass('tmds-attribute-filter-item-active');
        }
        let $variations_rows = $container.find('.tmds-product-variation-row');
        let $active_filters = $attribute_filter.find('.tmds-attribute-filter-item-active');
        let active_variations = [];
        if ($active_filters.length > 0) {
            $active_filters.map(function () {
                selected.push($(this).data('attribute_value'));
            });
            for (let $i = 0; $i < $variations_rows.length; $i++) {
                let $current_attribute = $variations_rows.eq($i).find('.tmds-import-data-variation-attribute[data-attribute_slug="' + current_filter_slug + '"]');
                if (selected.indexOf($current_attribute.data('attribute_value')) > -1) {
                    active_variations[$i] = 1;
                } else {
                    active_variations[$i] = 0;
                }
            }
        } else {
            for (let $i = 0; $i < $variations_rows.length; $i++) {
                active_variations[$i] = 1;
            }
        }

        if ($attribute_filters.length > 1) {
            for (let $j = 1; $j < $attribute_filters.length; $j++) {
                $attribute_filter = $attribute_filters.eq($j);
                current_filter_slug = $attribute_filter.data('attribute_slug');
                $active_filters = $attribute_filter.find('.tmds-attribute-filter-item-active');
                if ($active_filters.length > 0) {
                    $active_filters.map(function () {
                        selected.push($(this).data('attribute_value'));
                    });
                    for (let $i = 0; $i < $variations_rows.length; $i++) {
                        let $current_attribute = $variations_rows.eq($i).find('.tmds-import-data-variation-attribute[data-attribute_slug="' + current_filter_slug + '"]');
                        if (selected.indexOf($current_attribute.data('attribute_value')) < 0) {
                            active_variations[$i] = 0;
                        }
                    }
                }
            }
        }
        let variations_count = 0;
        for (let $i = 0; $i < $variations_rows.length; $i++) {
            let $current_variation = $variations_rows.eq($i);
            if (active_variations[$i] == 1) {
                $current_variation.removeClass('tmds-variation-filter-inactive');
                if ($current_variation.find('.tmds-variation-enable').prop('checked')) {
                    variations_count++;
                }
            } else {
                $current_variation.addClass('tmds-variation-filter-inactive');
            }
        }
        let $current_container = $button.closest('form');
        $current_container.find('.tmds-selected-variation-count').html(variations_count);
    });
    /**
     * Remove an attribute
     */
    $('body')
        .on('click', '.tmds-specification-attribute-remove', function () {
            if (confirm('Are you sure to remove this?')) {
                $(this).closest('tr').remove();
            }
        })
        .on('click', '.tmds-attributes-attribute-remove', function () {
            let $button = $(this);
            let $row = $button.closest('.tmds-attributes-attribute-row');
            $row.addClass('tmds-attributes-attribute-removing');
            let $container = $('.tmds-modal-popup-container');
            let $content = $('.tmds-modal-popup-select-attribute');
            $content.html($button.closest('.tmds-attributes-attribute-row').find('.tmds-attributes-attribute-values').html());
            $content.find('.tmds-attributes-attribute-value').addClass('vi-ui').addClass('button').addClass('mini');
            $container.attr('class', 'tmds-modal-popup-container tmds-modal-popup-container-remove-attribute');
            tmds_set_price_show();
            if ($content.find('.tmds-attributes-attribute-value').length === 1) {
                $content.find('.tmds-attributes-attribute-value').eq(0).trigger('click');
            }
        })
        .on('click', '.tmds-modal-popup-select-attribute .tmds-attributes-attribute-value', function () {
            let $button = $(this),
                $overlay = $('.tmds-saving-overlay'),
                $row = $('.tmds-attributes-attribute-removing'),
                $container = $row.closest('.tmds-accordion'),
                $tab = $container.find('.tmds-product-tab'),
                tab_data = $tab.data('tab');
            $overlay.removeClass('tmds-hidden');

            let formData = {};
            parse_str($row.find('input').serialize(), formData);

            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_remove_attribute',
                    tmds_nonce: tmds_params.nonce,
                    attribute_slug: $row.find('.tmds-attributes-attribute-slug').data('attribute_slug'),
                    attribute_value: $button.data('attribute_value_id')|| $button.data('attribute_value'),
                    form_data: formData,
                    product_index: tab_data.substring(11),
                },
                success: function (response) {
                    if (response.status === 'success') {
                        if ($container.find('.tmds-attributes-attribute-row').length > 1) {
                            $row.remove();
                            $container.find('.tmds-variations-tab').removeClass('tmds-variations-tab-loaded');
                        } else {
                            $container.find('.tmds-attributes-tab-menu').remove();
                            $container.find('.tmds-attributes-tab').remove();
                            $container.find('.tmds-variations-tab-menu').remove();
                            $container.find('.tmds-variations-tab').remove();
                            $container.find('.tabular.menu .item').eq(0).addClass('active');
                            $container.find('.tmds-product-tab').addClass('active');
                        }
                    }
                    if (response.message) {
                        $(document.body).trigger('villatheme_show_message', [response.message, [response.status], '', false, 4500]);
                    }
                },
                error: function (err) {
                    console.log(err);
                    $(document.body).trigger('villatheme_show_message', ['An error occurs', ['error'], '', false, 4500]);
                },
                complete: function () {
                    $overlay.addClass('tmds-hidden');
                    $('.tmds-attributes-attribute-editing').removeClass('tmds-attributes-attribute-editing');
                    $('.tmds-overlay').trigger('click');
                }
            })
        });
    /*Edit attributes*/
    $(document).on('tmds-need-save-attribute', function (e, $tab){
        $tab = $($tab);
        let change = 0;
        let $attribute_values = $tab.find('.tmds-attributes-attribute-value'),
            $names = $tab.find('.tmds-attributes-attribute-name');
        $names.map(function () {
            if ($(this).val() != $(this).data('attribute_name')) {
                change++;
            }
        });
        $attribute_values.map(function () {
            if ($(this).val() != $(this).data('attribute_value')) {
                change++;
            }
        })
        if (change > 0) {
            $tab.find('.tmds-button-save-attribute').removeClass('tmds-hidden');
        } else {
            $tab.find('.tmds-button-save-attribute').addClass('tmds-hidden');
        }
    });
    $(document).on('click', '.tmds-attributes-button-save', function () {
        let $button = $(this),
            $container = $button.closest('.tmds-accordion'),
            $row = $button.closest('tr'),
            change = 0,
            $attribute_values = $row.find('.tmds-attributes-attribute-value'),
            $slug = $row.find('.tmds-attributes-attribute-slug'),
            $overlay = $container.find('.tmds-product-overlay'),
            $name = $row.find('.tmds-attributes-attribute-name');

        if (!$name.val()) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_attribute_name, ['error'], '', false, 4500]);
            return;
        }

        if ($name.val() != $name.data('attribute_name')) {
            change++;
        }

        let attribute_values = [];
        $attribute_values.map(function () {
            let attribute_value = $(this).val();
            if (attribute_value != $(this).data('attribute_value')) {
                change++;
            }
            attribute_value = attribute_value.toLowerCase().trim();
            if (attribute_value && -1 === attribute_values.indexOf(attribute_value)) {
                attribute_values.push(attribute_value);
            }
        });
        if (attribute_values.length !== $attribute_values.length && !$button.hasClass('tmds-attributes-button-save-loading')) {
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_invalid_attribute_values, ['error'], '', false, 4500]);
            return;
        }

        if (change > 0) {
            let tmp = {}, formData ={};
            parse_str($row.find('input').serialize(), tmp);
            $.each(tmp, function (k, v) {
                if (typeof v === 'object') {
                    formData[k] = JSON.stringify(v).toString();
                } else {
                    formData[k] = v;
                }
            });
            $overlay.removeClass('tmds-hidden');
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_save_attributes',
                    tmds_nonce: tmds_params.nonce,
                    form_data:formData,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        let need_update_variations = false;
                        if (response.new_slug) {
                            need_update_variations = true;
                            $slug.html(response.new_slug);
                            $name.data('attribute_name', $name.val());
                        }
                        if (response.change_value === true) {
                            need_update_variations = true;
                            $row.find('.tmds-attributes-attribute-value').map(function () {
                                let $attribute_value = $(this);
                                $attribute_value.data('attribute_value', $attribute_value.val());
                            });
                        }
                        if (need_update_variations) {
                            $container.find('.tmds-variations-tab').removeClass('tmds-variations-tab-loaded');
                        }
                    }
                    if (response?.message){
                        $(document.body).trigger('villatheme_show_message', [response.message, [response.status], '', false, 4500]);
                    }
                },
                error: function (err) {
                    console.log(err)
                },
                complete: function () {
                    $button.removeClass('loading tmds-attributes-button-save-loading');
                    $row.removeClass('tmds-attributes-attribute-editing');
                    if ($row.closest('.tmds-product-row').find('.tmds-attributes-button-save-loading').length){
                        $row.closest('.tmds-product-row').find('.tmds-attributes-button-save-loading').eq(0).trigger('click');
                    }else {
                        $overlay.addClass('tmds-hidden');
                        $container.find('.tmds-button-save-attribute').removeClass('loading').addClass('tmds-hidden');
                        if ($container.find('.tmds-variations-tab-menu.active').length){
                            $container.find('.tmds-variations-tab-loaded').removeClass('tmds-variations-tab-loaded');
                            $container.find('.tmds-variations-tab-menu').trigger('click');
                        }
                    }
                }
            });
        } else {
            $button.removeClass('loading tmds-attributes-button-save-loading');
            if ($row.closest('.tmds-product-row').find('.tmds-attributes-button-save-loading').length){
                $row.closest('.tmds-product-row').find('.tmds-attributes-button-save-loading').eq(0).trigger('click');
            }else {
                $overlay.addClass('tmds-hidden');
                $container.find('.tmds-button-save-attribute').removeClass('loading').addClass('tmds-hidden');
                if ($container.find('.tmds-variations-tab-menu.active').length){
                    $container.find('.tmds-variations-tab-loaded').removeClass('tmds-variations-tab-loaded');
                    $container.find('.tmds-variations-tab-menu').trigger('click');
                }
            }
        }
    })
        .on('click', '.tmds-button-save-attribute', function (e){
            let $thisRow = $(this).closest('.tmds-product-row');
            $thisRow.find('.tmds-attributes-button-save:not(.tmds-attributes-button-save-loading)').map(function () {
                $(this).addClass('tmds-attributes-button-save-loading');
            });
            if ($thisRow.find('.tmds-attributes-button-save-loading').length ) {
                $thisRow.find('.tmds-attributes-button-save-loading').eq(0).trigger('click');
            }
            $(this).addClass('loading');
        })
        .on('change', '.tmds-attributes-tab .tmds-attributes-attribute-value, .tmds-attributes-tab .tmds-attributes-attribute-name', function (){
            $(document).trigger('tmds-need-save-attribute', $(this).closest('.tmds-attributes-tab'));
        });
    /**
     * Select product image
     */
    $('body').on('click', '.tmds-product-image', function () {
        let image_src = $(this).find('.tmds-import-data-image').attr('src');
        let $container = $(this).closest('form');
        if (image_src) {
            let $gallery_item = $container.find('.tmds-product-gallery-image[data-image_src="' + image_src + '"]').closest('.tmds-product-gallery-item');
            $gallery_item.find('.tmds-set-product-image').trigger('click');
        }
    });

    /*Show/hide button set variation image*/
    $(document).on('click', '.tmds-gallery-tab-menu',function () {
        let $button = $(this),
            $container = $button.closest('.tmds-accordion'),
            $variations_tab = $container.find('.tmds-variations-tab'),
            $variation_count = $container.find('.tmds-selected-variation-count'),
            $product_gallery = $container.find('.tmds-product-gallery');
        if ($variation_count.length > 0 && $variations_tab.hasClass('tmds-variations-tab-loaded')) {
            if (parseInt($variation_count.html()) > 0) {
                $product_gallery.addClass('tmds-allow-set-variation-image');
            } else {
                $product_gallery.removeClass('tmds-allow-set-variation-image');
            }
        }
    });
    $(document).on('click','.tmds-lazy-load', function () {
        let $tab = $(this);
        let tab_data = $tab.data('tab');
        if (!$tab.hasClass('tmds-lazy-load-loaded')) {
            $tab.addClass('tmds-lazy-load-loaded');
            let $tab_data = $('.tmds-lazy-load-tab-data[data-tab="' + tab_data + '"]');
            $tab_data.find('img').map(function () {
                let image_src = $(this).data('image_src');
                if (image_src) {
                    $(this).attr('src', image_src);
                }
            })
        }
    });
    /**
     * Set product featured image
     */
    $('body').on('click', '.tmds-set-product-image', function (e) {
        e.stopPropagation();
        let $button = $(this);
        let container = $button.closest('form');
        let $product_image_container = container.find('.tmds-product-image');
        let $gallery_item = $button.closest('.tmds-product-gallery-item');
        let $product_gallery = $button.closest('.tmds-product-gallery');
        if ($gallery_item.hasClass('tmds-is-product-image')) {
            $gallery_item.removeClass('tmds-is-product-image');
            $product_image_container.removeClass('tmds-selected-item');
            $product_image_container.find('input[type="hidden"]').val('');
        } else {
            if (!$gallery_item.hasClass('tmds-selected-item')) {
                $gallery_item.trigger('click');
            }

            if (!$product_image_container.hasClass('tmds-selected-item')) {
                $product_image_container.addClass('tmds-selected-item');
            }
            $product_gallery.find('.tmds-product-gallery-item').removeClass('tmds-is-product-image');
            $gallery_item.addClass('tmds-is-product-image');
            let product_image_url = $gallery_item.find('img').data('image_src');

            $(this).closest('.tmds-accordion').find('.tmds-accordion-product-image').attr('src', product_image_url);
            $product_image_container.find('img').attr('src', product_image_url);
            $product_image_container.find('input[type="hidden"]').val(product_image_url);
        }

    });
    /*Set variation image*/
    $(document).on('click','.tmds-set-variation-image', function (e) {
        e.stopPropagation();
        let $button = $(this),
            $container = $button.closest('.tmds-accordion'),
            $rows = $container.find('.tmds-product-variation-row').not('.tmds-variation-filter-inactive'),
            image_src = $button.closest('.tmds-product-gallery-item').find('.tmds-product-gallery-image').data('image_src');
        if (image_src && $rows.length > 0) {
            $rows.map(function () {
                let $row = $(this);
                if ($row.find('.tmds-variation-enable').prop('checked')) {
                    let $image_container = $row.find('.tmds-variation-image');
                    let $image_input = $image_container.find('input[type="hidden"]');
                    $image_container.find('.tmds-import-data-variation-image').attr('src', image_src).attr('image_src', image_src);
                    if ($image_input.val()) {
                        $image_input.val(image_src)
                    }
                }
            });
            $(document.body).trigger('villatheme_show_message', ['Image is set for selected variations', ['success'], '', false, 4500]);
        }
    });
    /**
     * Split product
     */
    $(document).on('click', '.tmds-button-split', function () {
        let $button = $(this);
        let $container = $button.closest('.tmds-accordion');
        let $overlay = $container.find('.tmds-product-overlay');
        let $variations_tab = $button.closest('.tmds-variations-tab');
        let $button_container = $button.closest('.tmds-button-split-container');
        let product_id = $button.data('product_id');
        let split_attribute_id = $button.data('split_attribute_id');
        let split_variations_ids = [];
        if ($button_container.find('.loading').length > 0) {
            return;
        }
        if (!split_attribute_id) {
            $variations_tab.find('.tmds-product-variation-row').not('.tmds-variation-filter-inactive').map(function () {
                if ($(this).find('.tmds-variation-enable').prop('checked')) {
                    split_variations_ids.push($(this).find('.tmds-import-data-variation-skuId').val());
                }
            });
            if (split_variations_ids.length === 0) {
                $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_split_product_no_variations, ['error'], '', false, 4500]);
                return;
            } else if (split_variations_ids.length === $variations_tab.find('.tmds-product-variation-row').length) {
                $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_split_product_too_many_variations, ['error'], '', false, 4500]);
                return;
            } else if (!confirm(`${tmds_params.i18n_split_product_confirm} ${tmds_params.i18n_split_product_message}`)) {
                return;
            }
        } else {
            if (!confirm($button.data('split_product_message') + ` ${tmds_params.i18n_split_product_message}`)) {
                return;
            }
        }
        $button.addClass('loading');
        $overlay.removeClass('tmds-hidden');
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'tmds_split_product',
                tmds_nonce: tmds_params.nonce,
                product_id: product_id,
                split_attribute_id: split_attribute_id,
                split_variations_ids: split_variations_ids,
            },
            success: function (response) {
                if (response.status === 'success') {
                    if (response?.message){
                        $(document.body).trigger('villatheme_show_message', [response.message, ['success'], '', false, 4500]);
                    }
                    document.location.reload();
                } else {
                    show_message($container, 'negative', response.message);
                }
            },
            error: function (err) {
                console.log(err)
                show_message($container, 'negative', err.statusText);
            },
            complete: function () {
                $button.removeClass('loading');
                $overlay.addClass('tmds-hidden');
            }
        })
    });
    /**
     * Select gallery images
     */
    $('body').on('click', '.tmds-product-gallery-item', function () {
        let current = $(this);
        let image = current.find('.tmds-product-gallery-image');
        let container = current.closest('form');
        let gallery_container = container.find('.tmds-product-gallery');
        let $product_image_container = container.find('.tmds-product-image');
        if (current.hasClass('tmds-selected-item')) {
            if (current.hasClass('tmds-is-product-image')) {
                current.removeClass('tmds-is-product-image');
                current.find('tmds-set-product-image').trigger('click');
                $product_image_container.removeClass('tmds-selected-item').find('input[type="hidden"]').val('');
            }
            current.removeClass('tmds-selected-item').find('input[type="hidden"]').val('');
        } else {
            current.addClass('tmds-selected-item').find('input[type="hidden"]').val(image.data('image_src'));
        }
        container.find('.tmds-selected-gallery-count').html(gallery_container.find('.tmds-selected-item').length);
    });
    /**
     * Load product reviews dynamically
     */
    $(document).on('click','.tmds-reviews-tab-menu', function () {
        let $tab = $(this);
        let $overlay = $tab.closest('.tmds-accordion').find('.tmds-product-overlay');
        let tab_data = $tab.data('tab');
        let $tab_data = $('.tmds-reviews-tab[data-tab="' + tab_data + '"]');
        if (!$tab_data.hasClass('tmds-reviews-tab-loaded')) {
            $overlay.removeClass('tmds-hidden');
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'GET',
                dataType: 'JSON',
                data: {
                    action: 'tmds_load_product_reviews',
                    tmds_nonce: tmds_params.nonce,
                    product_id: $tab_data.data('product_id'),
                    product_index: tab_data.substring(8),
                },
                success: function (response) {
                    let html;
                    if (response.status === 'success') {
                        $tab_data.addClass('tmds-reviews-tab-loaded');
                        html = response.data;
                        if (response?.reviews_count) {
                            $tab.closest('.tmds-product-container').find('.tmds-selected-review-count').html(parseInt(response.reviews_count));
                        }
                    } else {
                        html = `<div class="vi-ui negative message">${response.message}</div>`;
                    }
                    $tab_data.html(html);
                    $(document).trigger('tmds_after_load_product_reviews',[response,$tab_data]);
                },
                error: function (err) {
                    console.log(err);
                    $tab_data.html(`<div class="vi-ui negative message">ERROR</div>`);
                },
                complete: function () {
                    $overlay.addClass('tmds-hidden');
                }
            })
        }
    });
    /**
     * Load variations dynamically
     */
    $(document).on('click','.tmds-variations-tab-menu', function () {
        let $tab = $(this);
        let $overlay = $tab.closest('.tmds-accordion').find('.tmds-product-overlay');
        let tab_data = $tab.data('tab');
        let $tab_data = $('.tmds-variations-tab[data-tab="' + tab_data + '"]');
        let $variations_table = $tab_data.find('.tmds-variations-table');
        if (!$tab_data.hasClass('tmds-variations-tab-loaded')) {
            $overlay.removeClass('tmds-hidden');
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'GET',
                dataType: 'JSON',
                data: {
                    action: 'tmds_load_variations_table',
                    tmds_nonce: tmds_params.nonce,
                    product_id: $tab_data.data('product_id'),
                    product_index: tab_data.substring(11),
                },
                success: function (response) {
                    let variations_table;
                    if (response.status === 'success') {
                        $tab_data.addClass('tmds-variations-tab-loaded');
                        variations_table = response.data;
                        if (response?.split_option) {
                            $tab_data.find('.tmds-button-split-container').html(response.split_option);
                        }
                        if (response?.variations_count) {
                            $tab.closest('.tmds-product-container').find('.tmds-selected-variation-count').html(parseInt(response.variations_count));
                        }
                    } else {
                        variations_table = `<div class="vi-ui negative message">${response.message}</div>`;
                    }
                    $variations_table.html(variations_table).find('.vi-ui.dropdown').dropdown({
                        fullTextSearch: true,
                        forceSelection: false,
                        selectOnKeydown: false
                    });
                    /*Move unchecked variation to bottom*/
                    let $tbody = $variations_table.find('tbody');
                    let $rows = $tbody.find('.tmds-product-variation-row');
                    $rows.map(function () {
                        let $row = $(this);
                        if (!$row.find('.tmds-variation-enable').prop('checked')) {
                            $tbody.append($row)
                        }
                    });
                    /*Update displayed row number*/
                    let $row_no = 1;
                    $tbody.find('.tmds-product-variation-row-number').map(function () {
                        $(this).html($row_no++)
                    });
                    $(document).trigger('tmds_after_load_variations_table',[response,$variations_table]);
                },
                error: function (err) {
                    console.log(err);
                    $variations_table.html(`<div class="vi-ui negative message">ERROR</div>`);
                },
                complete: function () {
                    $overlay.addClass('tmds-hidden');
                }
            })
        }
    });
    /**
     * Select default variation
     */
    $('body').on('click', '.tmds-import-data-variation-default', function () {
        let $current = $(this);
        if ($current.prop('checked')) {
            let $enable = $current.closest('tr').find('.tmds-variation-enable');
            if (!$enable.prop('checked')) {
                $enable.trigger('click');
            }
        }
    });
    /**
     * Count currently selected variations
     */
    count_selected_variations();
    function count_selected_variations() {
        let current_focus_checkbox;
        $('body').on('click', '.tmds-variations-bulk-enable', function () {
            let $current_container = $(this).closest('form');
            let selected = 0;
            if ($(this).prop('checked')) {
                selected = $current_container.find('.tmds-product-variation-row').length - $current_container.find('.tmds-variation-filter-inactive').length;
                $current_container.find('.tmds-variations-bulk-select-image').prop('checked', true).trigger('change');
            } else {
                $current_container.find('.tmds-import-data-variation-default').prop('checked', false);
                $current_container.find('.tmds-variations-bulk-select-image').prop('checked', false).trigger('change');
            }
            $current_container.find('.tmds-product-variation-row:not(.tmds-variation-filter-inactive) .tmds-variation-enable').prop('checked', $(this).prop('checked'));
            $current_container.find('.tmds-selected-variation-count').html(selected);
        }).on('click', '.tmds-variation-enable', function (e) {
            let $current_select = $(this);
            let $current_container = $current_select.closest('form');
            let prev_select = $current_container.find('.tmds-variation-enable').index(current_focus_checkbox);
            let selected = 0;
            if (e.shiftKey) {
                let current_index = $current_container.find('.tmds-variation-enable').index($current_select);
                if ($current_select.prop('checked')) {
                    if (prev_select < current_index) {
                        for (let i = prev_select; i <= current_index; i++) {
                            $current_container.find('.tmds-variation-enable').eq(i).prop('checked', true)
                        }
                    } else {
                        for (let i = current_index; i <= prev_select; i++) {
                            $current_container.find('.tmds-variation-enable').eq(i).prop('checked', true)
                        }
                    }
                } else {
                    if (prev_select < current_index) {
                        for (let i = prev_select; i <= current_index; i++) {
                            $current_container.find('.tmds-variation-enable').eq(i).prop('checked', false)
                        }
                    } else {
                        for (let i = current_index; i <= prev_select; i++) {
                            $current_container.find('.tmds-variation-enable').eq(i).prop('checked', false)
                        }
                    }
                }
            }
            $current_container.find('.tmds-variation-enable').map(function () {
                let $current_row = $(this).closest('tr');
                if ($(this).prop('checked') && !$current_row.hasClass('tmds-variation-filter-inactive')) {
                    selected++;
                    $current_row.find('.tmds-variation-image').removeClass('tmds-selected-item').trigger('click');
                } else {
                    $current_row.find('.tmds-variation-image').addClass('tmds-selected-item').trigger('click');
                    $current_row.find('.tmds-import-data-variation-default').prop('checked', false);
                }
            });

            $current_container.find('.tmds-selected-variation-count').html(selected);
            current_focus_checkbox = $(this);
        });
    }
    /**
     * Select variation image
     */
    $('body').on('click', '.tmds-variation-image', function () {
        let $current = $(this);
        if ($current.hasClass('tmds-selected-item')) {
            $current.removeClass('tmds-selected-item').find('input[type="hidden"]').val('');
        } else {
            $current.addClass('tmds-selected-item').find('input[type="hidden"]').val($current.find('img').attr('src'));
            $current.closest('tr').find('.tmds-variation-enable').prop('checked', true).trigger('change');
        }
    });
    /**
     * Bulk select images
     */
    $('body').on('change', '.tmds-variations-bulk-select-image', function () {
        let button_bulk = $(this);
        let product = button_bulk.closest('form');
        setTimeout(function (image_wrap){
            image_wrap.removeClass('tmds-selected-item');
            image_wrap.map(function () {
                let current = $(this);
                if (button_bulk.prop('checked') && current.closest('.tmds-product-variation-row').find('.tmds-variation-enable').prop('checked')) {
                    current.addClass('tmds-selected-item');
                    current.find('input[type="hidden"]').val(current.find('.tmds-import-data-variation-image').attr('src'));
                } else {
                    current.find('input[type="hidden"]').val('');
                }
            })
        }, 100,product.find('.tmds-variation-image'));
    });
    
    function parse_str(str, array) {
        const _fixStr = (str) => decodeURIComponent(str.replace(/\+/g, '%20'));
        const strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&');
        const sal = strArr.length;
        let i, j, ct, p, lastObj, obj, chr, tmp, key, value, postLeftBracketPos, keys, keysLen;
        const $global = (typeof window !== 'undefined' ? window : global);
        $global.$locutus = $global.$locutus || {};
        const $locutus = $global.$locutus;
        $locutus.php = $locutus.php || {};

        if (!array) array = $global;

        for (i = 0; i < sal; i++) {
            tmp = strArr[i].split('=');
            key = _fixStr(tmp[0]);
            value = (tmp.length < 2) ? '' : _fixStr(tmp[1]);

            if (key.includes('__proto__') || key.includes('constructor') || key.includes('prototype')) break;

            while (key.charAt(0) === ' ') key = key.slice(1);

            if (key.indexOf('\x00') > -1) {
                key = key.slice(0, key.indexOf('\x00'))
            }

            if (key && key.charAt(0) !== '[') {
                keys = [];
                postLeftBracketPos = 0;

                for (j = 0; j < key.length; j++) {
                    if (key.charAt(j) === '[' && !postLeftBracketPos) {
                        postLeftBracketPos = j + 1
                    } else if (key.charAt(j) === ']') {
                        if (postLeftBracketPos) {
                            if (!keys.length) keys.push(key.slice(0, postLeftBracketPos - 1));

                            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
                            postLeftBracketPos = 0;

                            if (key.charAt(j + 1) !== '[') break;
                        }
                    }
                }

                if (!keys.length) keys = [key];

                for (j = 0; j < keys[0].length; j++) {
                    chr = keys[0].charAt(j);

                    if (chr === ' ' || chr === '.' || chr === '[') {
                        keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1)
                    }

                    if (chr === '[') break;
                }

                obj = array;

                for (j = 0, keysLen = keys.length; j < keysLen; j++) {
                    key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
                    lastObj = obj;
                    if ((key === '' || key === ' ') && j !== 0) {
                        // Insert new dimension
                        ct = -1
                        for (p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                if (+p > ct && p.match(/^\d+$/g)) {
                                    ct = +p
                                }
                            }
                        }
                        key = ct + 1
                    }

                    // if primitive value, replace with object
                    if (Object(obj[key]) !== obj[key]) obj[key] = {};

                    obj = obj[key];
                }
                lastObj[key] = value;
            }
        }
    }

    /**
     * Support ESC(cancel) and Enter(OK) key
     */
    add_keyboard_event();
    function add_keyboard_event() {
        $(document).on('keydown', function (e) {
            if (!$('.tmds-set-price-container').hasClass('tmds-hidden')) {
                if (e.keyCode == 13) {
                    $('.tmds-set-price-button-set').trigger('click');
                } else if (e.keyCode == 27) {
                    $('.tmds-overlay').trigger('click');
                }
            } else if (!$('.tmds-override-product-options-container').hasClass('tmds-hidden')) {
                if (e.keyCode == 13) {
                    $('.tmds-override-product-options-button-override').trigger('click');
                } else if (e.keyCode == 27) {
                    $('.tmds-override-product-overlay').trigger('click');
                }
            }
        });
    }

    function tmds_set_price_hide() {
        $('.tmds-set-price').removeClass('tmds-set-price-editing');
        $('.tmds-attributes-attribute-removing').removeClass('tmds-attributes-attribute-removing');
        $('.tmds-modal-popup-container').addClass('tmds-hidden');
        tmds_enable_scroll()
    }
    function tmds_set_price_show() {
        $('.tmds-modal-popup-container').removeClass('tmds-hidden');
        tmds_disable_scroll();
    }
    function maybe_hide_bulk_actions() {
        let $check = $('.tmds-accordion-bulk-item-check'),
            $bulk_actions = $('.tmds-accordion-bulk-actions-container'),
            show = false;
        if ($check.length > 0) {
            $check.map(function () {
                if ($(this).prop('checked')) {
                    show = true;
                    return false;
                }
            });
        }
        if (show) {
            $bulk_actions.fadeIn(200);
        }else {
            $bulk_actions.fadeOut(200);
            $('.tmds-accordion-bulk-actions').dropdown('clear');
        }
    }

    function hide_message($parent) {
        $parent.find('.tmds-message').html('');
    }

    function show_message($parent, type, message) {
        $parent.find('.tmds-message').html(`<div class="vi-ui message ${type}"><div>${message}</div></div>`);
    }
    function maybe_reload_page() {
        if (!$('.tmds-accordion').length) {
            let url = new URL(document.location.href);
            url.searchParams.delete('tmds_search_id');
            url.searchParams.delete('tmds_search');
            url.searchParams.delete('paged');
            document.location.href = url.href;
        }
    }
    function tmds_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('tmds-noscroll');
        window.scrollTo({top: -scrollTop, behavior: 'instant'});
    }

    function tmds_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('tmds-noscroll').css('top', -scrollTop);
        }
    }
    function select2_params(placeholder, data_send, close_on_select, min_input) {
        let result = {
            width: '100%',
            closeOnSelect: close_on_select,
            placeholder: placeholder,
            allowClear: true,
            cache: true
        };
        if (Object.keys(data_send).length) {
            result['minimumInputLength'] = min_input;
            result['escapeMarkup'] = function (markup) {
                return markup;
            };
            result['ajax'] = {
                url: tmds_params.ajax_url,
                dataType: 'json',
                type: "GET",
                quietMillis: 50,
                delay: 250,
                data: function (params) {
                    let data = $.extend(data_send,{
                        term: params.term,
                    });
                    return data;
                },
                processResults: function (data) {
                    let terms = [];
                    if (!data[0]) {
                        $.each(data, function (id, text) {
                            terms.push({id: id, text: text?.formatted_name || text?.name || text});
                        });
                    }else {
                        terms = data;
                    }
                    return {results: terms};
                },
                cache: true
            };
        }
        return result;
    }
});