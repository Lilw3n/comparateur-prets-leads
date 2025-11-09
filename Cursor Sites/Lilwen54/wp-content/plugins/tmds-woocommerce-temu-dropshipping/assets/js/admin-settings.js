jQuery(document).ready(function ($) {
    'use strict';
    if (typeof tmds_params === "undefined") {
        return;
    }
    if (tmds_params.go_to_tmds_bt && $('.woocommerce-BlankState-buttons').length) {
        $('.woocommerce-BlankState-buttons').append(tmds_params.go_to_tmds_bt)
        return;
    }
    if (!tmds_params.nonce) {
        return;
    }
    let ajax_nonce = tmds_params.nonce, ajax_url = tmds_params.ajax_url;
    if ($('.vi-ui.tabular.menu').length) {
        $('.vi-ui.tabular.menu .item').tab({history: true, historyType: 'hash'});
    }
    if ($('.vi-ui.accordion').length) {
        $('.vi-ui.accordion:not(.tmds-accordion-init)').addClass('tmds-accordion-init').accordion('refresh');
        // $('.vi-ui.accordion:not(.tmds-accordion-init)').addClass('tmds-accordion-init').vi_accordion('refresh');
    }
    $('.vi-ui.checkbox:not(.tmds-checkbox-init)').addClass('tmds-checkbox-init').off().checkbox();
    $('.vi-ui.dropdown:not(.tmds-dropdown-init)').addClass('tmds-dropdown-init').off().dropdown({fullTextSearch: true});

    $(document).on('click', '.tmds-save-settings', function (e) {
        let rateInput = $('#tmds-import_currency_rate');
        if (rateInput.length && !rateInput.val()) {
            $(document.body).trigger('villatheme_show_message', ['Please enter Import products currency exchange rate', ['error'], '', false, 4500]);
            rateInput.trigger('focus');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        $(this).addClass('loading');
    });
    //
    $(document).on('change', 'input[type=checkbox]', function () {
        let val = $(this).prop('checked') ? 1: 0,
            $input = $(this).parent().find('input[type=hidden]');
        $input.val(val);
        if ($(this).prop('checked')){
            $('.tmds-'+$input.attr('name')+'-disable-class').addClass('tmds-hidden');
            $('.tmds-'+$input.attr('name')+'-enable-class').removeClass('tmds-hidden');
        }else {
            $('.tmds-'+$input.attr('name')+'-disable-class').removeClass('tmds-hidden');
            $('.tmds-'+$input.attr('name')+'-enable-class').addClass('tmds-hidden');
        }
    });
    $(document).on('change', '.tmds-toggle-field select', function () {
        let val = parseFloat( $(this).val()),
            name = $(this).attr('id')||$(this).attr('name');
        let $enable = $('.tmds-'+ name+'-enable-class'),
            $disable = $('.tmds-'+ name+'-disable-class');
        if (val){
            $enable.removeClass('tmds-hidden');
            $disable.addClass('tmds-hidden');
        }else {
            $enable.addClass('tmds-hidden');
            $disable.removeClass('tmds-hidden');
        }
    });
    //fulfill
    $(document).on('tmds_render_fulfill_map_html', function (e, countries) {
        let  $table = $('#tmds-fulfill_map_countries').closest('table');
        if (!countries.length){
            $table.find('.tmds-fulfill_map_fields-wrap').remove();
            return;
        }
        $.each(countries, function (k,v){
            $table.after(tmds_params['fulfill_map_html'][v]);
        });
        $('.tmds-fulfill_map_fields-wrap').find('.vi-ui.dropdown').addClass('tmds-dropdown-init').off().dropdown({fullTextSearch: true});
        $('.tmds-fulfill_map_fields-wrap').addClass('tmds-accordion-init').off().accordion('refresh');
        $table.find('.tmds-fulfill_map_fields-wrap').remove();
    });
    $(document).on('change', '#tmds-fulfill_map_countries', function () {
        let val = $(this).val(), $table = $(this).closest('table');
        if (!tmds_params['fulfill_map_html']){
            tmds_params['fulfill_map_html']={};
        }
        if ($('.tmds-fulfill_map_fields-wrap').length){
            $('.tmds-fulfill_map_fields-wrap').each(function (k,v){
               let country = $(v).data('country');
               if (!country || tmds_params['fulfill_map_html'][country]){
                   return true;
               }
                tmds_params['fulfill_map_html'][country] = $(v).clone();
            });
        }
        $('.tmds-fulfill_map_fields-wrap').remove();
        if ( tmds_params?.fulfill_map_xhr ) {
            tmds_params.fulfill_map_xhr.abort();
        }
        if (!val.length){
            return;
        }
        $table.append(`<tr class="tmds-warehouse_enable-enable-class tmds-fulfill_map_fields-wrap"><td colspan="2"><span class="vi-ui button loading"></span></td></tr>`);
        let need_map=[];
        $.each(val, function (k,v){
            if (!tmds_params['fulfill_map_html'][v]){
                need_map.push(v);
            }
        });
        if (need_map.length){
            tmds_params.fulfill_map_xhr = $.ajax({
                url: ajax_url,
                type: 'POST',
                data: {
                    action: 'tmds_get_fulfill_map_html',
                    tmds_nonce: ajax_nonce,
                    countries: need_map,
                },
                success: function (response) {
                    if (response?.html){
                        let $html= $('<div>'+response.html+'</div>');
                        $html.find('.tmds-fulfill_map_fields-wrap').each(function (k,v){
                            let country = $(v).data('country');
                            if (country){
                                tmds_params['fulfill_map_html'][country] = $(v).clone();
                            }
                        });
                        $(document).trigger('tmds_render_fulfill_map_html',[val]);
                    }
                    if (response?.message) {
                        $.each(response.message, function (k, v) {
                            $(document.body).trigger('villatheme_show_message', [v, [response.status], '', false, 4500]);
                        });
                    }
                },
                error: function (err) {
                    if (err?.status != 0) {
                        console.log(err);
                        $(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
                    }
                }
            });
            return;
        }
        $(document).trigger('tmds_render_fulfill_map_html',[val]);
    });
    //warehouse
    $(document).on('change', '#tmds-warehouse_enable', function () {
        let val = $(this).val(),
            $enable = $('.tmds-'+ $(this).attr('name')+'-enable-class'),
            $disable = $('.tmds-'+ $(this).attr('name')+'-disable-class');
        if (val !== '0'){
            $enable.removeClass('tmds-hidden');
            for (let i = 0; i < $enable.length; i++) {
                if ($enable.eq(i).is('.tmds-toggle-field')){
                    $enable.eq(i).find('select').trigger('change');
                }
            }
        }else {
            $enable.addClass('tmds-hidden');
        }
        if (val !== '1'){
            $disable.removeClass('tmds-hidden');
        }else {
            $disable.addClass('tmds-hidden');
        }
    });
    $(document).on('change','.warehouse_fields_country select', function (e){
        let old_val = $(this).data('old_val'), val = $(this).val();
        if (!tmds_params['warehouse_fields_html']){
            tmds_params['warehouse_fields_html']={};
        }
        if (!tmds_params['warehouse_fields_html'][old_val]){
            tmds_params['warehouse_fields_html'][old_val]=$('.tmds-warehouse_enable-enable-class.tmds-warehouse_fields-class').clone();
        }
        if (val == old_val){
            return;
        }
        if (tmds_params?.warehouse_address_xhr){
            tmds_params.warehouse_address_xhr.abort();
        }
        $(this).data('old_val', val);
        $('.tmds-warehouse_fields-class').remove();
        if (tmds_params?.warehouse_fields_html[val]){
            $('.tmds-warehouse_enable-enable-class').after(tmds_params.warehouse_fields_html[val]);
            $('.tmds-warehouse_fields-class').find('.vi-ui.dropdown').addClass('tmds-dropdown-init').off().dropdown({fullTextSearch: true});
            select2_init();
            return;
        }
        $('.tmds-warehouse_enable-enable-class').after(`<tr class="tmds-warehouse_enable-enable-class tmds-warehouse_fields-class"><td colspan="2"><span class="vi-ui button loading"></span></td></tr>`);
        tmds_params['warehouse_address_xhr'] = $.ajax({
            url: ajax_url,
            type: 'POST',
            data: $.param({
                action: 'tmds_get_warehouse_fields',
                tmds_nonce: ajax_nonce,
                country: val,
            }),
            success: function (response) {
                if (response?.html){
                    tmds_params['warehouse_fields_html'][val] = response.html;
                    $('.tmds-warehouse_fields-class').remove();
                    $('.tmds-warehouse_enable-enable-class').after(response.html);
                    $('.tmds-warehouse_fields-class').find('.vi-ui.dropdown').addClass('tmds-dropdown-init').off().dropdown({fullTextSearch: true});
                    select2_init();
                }
                if (response?.message) {
                    $.each(response.message, function (k, v) {
                        $(document.body).trigger('villatheme_show_message', [v, [response.status], '', false, 4500]);
                    });
                }
            },
            error: function (err) {
                if (err?.status != 0) {
                    console.log(err);
                    $(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
                }
            }
        });
    });
    $(document).on('tmds_render_warehouse_address_html',function (e,address,$detect){
        switch (address?.type){
            case 'html':
                $detect.html(address?.data);
                let selected = '';
                if ($detect.find('option').length === 2){
                    selected = $detect.find('option').eq(1).val();
                }
                $detect.dropdown('refresh');
                $detect.dropdown('clear');
                setTimeout(function ($detect, selected) {
                    $detect.dropdown('set selected', selected);
                },550, $detect, selected);
                break;
            case 'val':
                $detect.val(address?.data);
                break;
            case 'select':
                $detect.after(address?.data);
                break;
        }
        $('.warehouse_fields_detect-loading').remove();
        if (address?.show) {
            $detect.closest('.warehouse_fields_detect').removeClass('tmds-hidden');
        }
        $detect.closest('td').find('.tmds-not-click').removeClass('tmds-not-click');
    });
    $(document).on('change','.tmds-warehouse-field-detect select', function (e){
        let country = $('.warehouse_fields_country select').val(),
            region_id = $(this).val(),
            detect_type = $(this).data('type'),
            $detect = $('.warehouse_fields_detect [data-detect="'+detect_type+'"]');
        if (!detect_type || !$detect.length){
            if (detect_type ==='region3' && $('#warehouse_fields_post_code').length && !['DE'].includes(country)){
                let region_name = $(this).find('option[value="'+region_id+'"]').text(),regex = /\((.*?)\)/gm ;
                let match = regex.exec(region_name );
                if(match && match[1]){
                    $('#warehouse_fields_post_code').val(match[1]);
                }
            }
            return;
        }
        if (tmds_params?.warehouse_address_xhr){
            tmds_params.warehouse_address_xhr.abort();
        }
        if (!tmds_params['warehouse_address']){
            tmds_params['warehouse_address']={};
        }
        if (!tmds_params['warehouse_address'][country]){
            tmds_params['warehouse_address'][country]={};
        }
        $detect.closest('.warehouse_fields_detect').addClass('tmds-hidden');
        if (!$('.warehouse_fields_detect-loading').length) {
            $detect.closest('.tmds-warehouse_enable-enable-class').find('td').append('<span class="warehouse_fields_detect-loading vi-ui button loading"></span>');
        }
        if (tmds_params['warehouse_address'][country][region_id]){
            $(document).trigger('tmds_render_warehouse_address_html',[tmds_params['warehouse_address'][country][region_id],$detect]);
            return;
        }
        tmds_params['warehouse_address_xhr'] = $.ajax({
            url: ajax_url,
            type: 'POST',
            data: $.param({
                action: 'tmds_get_warehouse_address',
                tmds_nonce: ajax_nonce,
                country: country,
                region_id: region_id,
                is_postcode: $detect.data('type') ==='post_code' ? 1:'',
                is_postcode_options: $detect.is('select') ? 1:'',
            }),
            success: function (response) {
                if (response?.data){
                    tmds_params['warehouse_address'][country][region_id] = response.data;
                    $(document).trigger('tmds_render_warehouse_address_html',[response.data , $detect]);
                }
                if (response?.message) {
                    $.each(response.message, function (k, v) {
                        $(document.body).trigger('villatheme_show_message', [v, [response.status], '', false, 4500]);
                    });
                }
            },
            error: function (err) {
                if (err?.status != 0) {
                    console.log(err);
                    $(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
                }
            }
        });
    });
    //price rule
    $(document).on('change', '.tmds-price-exchange-rate-decimals', function () {
        let decimal = $(this).val(), $rate = $(this).closest('tr').find('.tmds-price-exchange-rate');
        $rate.val(new Intl.NumberFormat('en-US', {
            maximumFractionDigits: decimal
        }).format($rate.val()));
    });
    $(document).on('tmds_currency_update_rate',function (e, button, curcy,api){
        if (!curcy.length || ['0',''].includes(api)){
            button.removeClass('loading');
            return;
        }
        let tooltip = button.data('tooltip');
        button.removeAttr('data-tooltip');
        button.addClass('loading');
        tmds_ajax({
            url: ajax_url,
            type: 'POST',
            data: $.param({
                action: 'tmds_currency_update_rate',
                tmds_nonce: ajax_nonce,
                curcy: curcy,
                api: api,
            }),
            success: function (response) {
                if (response?.rates){
                    $.each(response.rates, function (k,v){
                        $(`input[name="import_currency_rate[${k}]"]`).val(v);
                    });
                }
                if (response?.decimals){
                    $.each(response.decimals, function (k,v){
                        $(`input[name="exchange_rate_decimals[${k}]"]`).val(v);
                    });
                }
                if (response?.message) {
                    $.each(response.message, function (k, v) {
                        $(document.body).trigger('villatheme_show_message', [v, [response.status], '', false, 4500]);
                    });
                }
            },
            error: function (err) {
                console.log(err);
                $(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
            },
            complete: function () {
                button.removeClass('loading');
                if (tooltip){
                    button.attr({'data-tooltip': tooltip});
                }
            }
        });
    });
    $(document).on('click','.tmds-price-rule-update',function (){
        let exchange_rate_api = $('select#tmds-exchange_rate_api').val(), $button = $(this);
        if (exchange_rate_api === '0'){
            return;
        }
        if ($('.tmds-price-rule-update.loading').length || $('.tmds-price-rule-update-all.loading').length ){
            return;
        }
        let $row = $button.closest('.tmds-price-rule-row');
        $(document).trigger('tmds_currency_update_rate',[$button,[{currency:$row.find('#tmds-import_currency_rate').val(),decimal: $row.find('.tmds-price-exchange-rate-decimals').val()}], $('select#tmds-exchange_rate_api').val()]);
    });
    $(document).on('click','.tmds-price-rule-update-all',function (){
        let exchange_rate_api = $('select#tmds-exchange_rate_api').val(), $button = $(this),curcy =[];
        if (exchange_rate_api === '0'){
            return;
        }
        if ($('.tmds-price-rule-update.loading').length  ){
            return;
        }
        jQuery('.tmds-price-exchange-rates-container').find('.tmds-price-rule-row').each(function (k,v) {
            let $row = $(v);
            curcy.push({currency:$row.find('#tmds-import_currency_rate').val(),decimal: $row.find('.tmds-price-exchange-rate-decimals').val()});
        });
        $(document).trigger('tmds_currency_update_rate',[$button,curcy,$('select#tmds-exchange_rate_api').val()]);
    });
    $(document).on('change', 'select#tmds-exchange_rate_api', function () {
        if ($(this).val() === '0'){
            $('.tmds-exchange-rate-info').closest('.buttons').addClass('tmds-exchange-rate-info-hidden');
            $('.tmds-exchange-rate-info').addClass('tmds-hidden');
        }else {
            $('.tmds-exchange-rate-info').removeClass('tmds-hidden');
            $('.tmds-exchange-rate-info').closest('.buttons').removeClass('tmds-exchange-rate-info-hidden');
        }
    });
    $(document).on('change', 'select#tmds-import_currency_rate', function () {
        let currency = $(this).val(), import_currency_rate_input = $(this).closest('tr').find('input.tmds-input-reset');
        import_currency_rate_input.each(function (k,v) {
            $(v).attr('name', $(v).data('name').replace('{currency_code}', currency));
        });
    });
    $(document).on('change', 'select[name="plus_value_type[]"], select[name="price_default[plus_value_type]"]', function () {
        let $current = $(this).closest('tr');
        switch ($(this).val()) {
            case 'fixed':
                $current.find('.tmds-value-label-left').html('+');
                $current.find('.tmds-value-label-right').html($current.closest('.price-rule').data('currency_symbol'));
                break;
            case 'percent':
                $current.find('.tmds-value-label-left').html('+');
                $current.find('.tmds-value-label-right').html('%');
                break;
            case 'multiply':
                $current.find('.tmds-value-label-left').html('x');
                $current.find('.tmds-value-label-right').html('');
                break;
            default:
                $current.find('.tmds-value-label-left').html('=');
                $current.find('.tmds-value-label-right').html($current.closest('.price-rule').data('currency_symbol'));
        }
    });
    $(document).on('click', '.tmds-price-rule-add', function () {
        let wrap = $(this).closest('.accordion');
        let $rows = wrap.find('.tmds-price-rule-row'),
            $lastRow = $rows.last(),
            $newRow = $lastRow.clone();
        $newRow.find('.tmds-input-reset').val('');
        $newRow.find('.tmds-price-to').val('');
        $newRow.find('.vi-ui.dropdown').off().dropdown();
        wrap.find('.tmds-price-rule-container').append($newRow);
    });
    $(document).on('click', '.tmds-price-rule-remove', function () {
        let wrap = $(this).closest('.accordion');
        let $rows = wrap.find('.tmds-price-rule-row'),
            $row = $(this).closest('.tmds-price-rule-row');
        if ($rows.length > 1) {
            if (confirm('Do you want to remove this row?')) {
                $row.fadeOut(300);
                setTimeout(() => $row.remove(), 300);
            }
        }
    });
    //price rule

    //search select2
    select2_init();
    function select2_init(){
        $('.tmds-search-select2:not(.tmds-search-select2-init)').each(function () {
            let select = $(this);
            let close_on_select = !select.prop('multiple'), min_input = 2, placeholder = 'select', data_send={}, type_select2 = select.data('type_select2');
            switch (type_select2) {
                case 'category':
                    placeholder = 'Please enter category name to search';
                    data_send = {
                        action: 'woocommerce_json_search_categories',
                        show_empty: true,
                        security: wc_enhanced_select_params.search_categories_nonce,
                    }
                    break;
                case 'tag':
                    placeholder = 'Please enter tag to search';
                    data_send = {
                        action: 'woocommerce_json_search_taxonomy_terms',
                        security: wc_enhanced_select_params.search_taxonomy_terms_nonce,
                        limit: 50,
                        taxonomy: 'product_tag',
                    }
                    break;
                case 'product':
                    placeholder = 'Please enter product title to search';
                    data_send = {
                        action: 'woocommerce_json_search_products_and_variations',
                        security: wc_enhanced_select_params.search_products_nonce,
                    }
                    break;
                default:
                    data_send={not_ajax: 1, data:[], select:select};
                    select.find('option').each( function (k,v){
                        let remove = true;
                        data_send.data.push({
                            id: $(v).val(),
                            text: $(v).text()
                        });
                        if ($(v).prop('selected')){
                            remove = false;
                        }
                        if (remove){
                            $(v).remove();
                        }
                    });
            }
            select.addClass('tmds-search-select2-init').select2(select2_params(placeholder, data_send, close_on_select, min_input));
        });
    }
    function select2_params(placeholder, data_send, close_on_select, min_input) {
        let result = {
            width: '100%',
            closeOnSelect: close_on_select,
            placeholder: placeholder,
            cache: true
        };
        if (Object.keys(data_send).length) {
            result['minimumInputLength'] = min_input;
            result['escapeMarkup'] = function (markup) {
                return markup;
            };
            if (data_send?.not_ajax){
                let data_check = data_send.data,$select=$(data_send.select),old_term, found={};
                $select.on('select2:open', function() {
                    let $search = $('.select2-search__field'), val = $select.val();
                    $search.off('input blur').on('input blur', function() {
                        let term = $(this).val().trim().toLowerCase(), terms=[];
                        if (term.length < min_input || old_term === term ){
                            return;
                        }
                        old_term = term;
                        if (found[term]){
                            terms = found[term];
                        }else {
                            terms = data_check.filter(item =>
                                item.text.toLowerCase().includes(term)
                            );
                            found[term] = terms;
                        }
                        $select.find('option:not([value="'+val+'"])').remove();
                        terms.forEach(item => {
                            if (val != item.id) {
                                $select.append(new Option(item.text, item.id, false, false));
                            }
                        });
                        $select.trigger('change.select2');
                    });
                });
            }else {
                result['ajax'] = {
                    url: ajax_url,
                    dataType: 'json',
                    type: "GET",
                    quietMillis: 50,
                    delay: 250,
                    data: function (params) {
                        let data = $.extend(data_send, {
                            term: params.term,
                        });
                        return data;
                    },
                    processResults: function (data) {
                        console.log(data)
                        let terms = [];
                        if (data) {
                            $.each(data, function (id, text) {
                                terms.push({
                                    id:  text?.term_id||id,
                                    text: text?.formatted_name || text?.name || text
                                });
                            });
                        }
                        console.log(terms)
                        return {results: terms};
                    },
                    cache: true
                };
            }
        }
        return result;
    }

    //search select2

    //recommend_plugins
    $(document).on('change', '.tmds-select-plugin', function () {
        let checkedCount = $('.tmds-select-plugin:checked').length;
        $('.tmds-finish span').text(checkedCount > 0 ? 'Install & Return to Dashboard' : 'Return to Dashboard');
        if (!checkedCount) {
            $('.tmds-toggle-select-plugin').prop('checked', false);
        }
    });
    $(document).on('change', '.tmds-toggle-select-plugin', function () {
        let checked = $(this).prop('checked');
        $('.tmds-select-plugin').prop('checked', checked);
        $('.tmds-finish span').text(checked ? 'Install & Return to Dashboard' : 'Return to Dashboard');
    });
    $(document).on('click', '.tmds-finish', function () {
        let $button = $(this);
        let install_plugins = $('.tmds-select-plugin:checked').map((i, el) => $(el).data('plugin_slug')).toArray();
        if (install_plugins.length) {
            $button.addClass('loading');
            let active_plugin = false;
            tmds_ajax({
                url: ajax_url,
                type: 'POST',
                data: $.param({
                    action: 'tmds_setup_install_plugins',
                    tmds_nonce: ajax_nonce,
                    install_plugins: install_plugins,
                }),
                success: function (response) {
                    if ( response.status === 'success' && response?.installed_plugins) {
                        active_plugin = response.installed_plugins;
                    }
                    if (response?.message) {
                        $.each(response?.message, function (k, v) {
                            jQuery(document.body).trigger('villatheme_show_message', [v, [response.status], '', false, 4500]);
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                    active_plugin = false;
                    jQuery(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
                },
                complete: function () {
                    if (!active_plugin) {
                        $button.removeClass('loading');
                        return false;
                    }
                    tmds_ajax({
                        url: ajax_url,
                        type: 'POST',
                        data: $.param({
                            action: 'tmds_setup_activate_plugins',
                            tmds_nonce: ajax_nonce,
                            install_plugins: active_plugin,
                        }),
                        error: function (err) {
                            console.log(err);
                            $button.removeClass('loading');
                            jQuery(document.body).trigger('villatheme_show_message', [err.statusText, ['error'], err.responseText === '-1' ? '' : err.responseText, false, 4500]);
                        },
                        success: function (response) {
                            if (!response.success && response.data) {
                                jQuery(document.body).trigger('villatheme_show_message', [response.data, ['error'], '', false, 4500]);
                            }
                        },
                        complete: function (response) {
                            $button.removeClass('loading');
                            window.location.href = tmds_params.settings_page_url;
                        }
                    });
                }
            });
        } else {
            window.location.href = tmds_params.settings_page_url;
        }
        return false;
    });
    //recommend_plugins

    //Auto update
    jQuery('.villatheme-get-key-button').one('click', function (e) {
        let v_button = jQuery(this);
        v_button.addClass('loading');
        let data = v_button.data();
        let item_id = data.id;
        let app_url = data.href;
        let main_domain = window.location.hostname;
        main_domain = main_domain.toLowerCase();
        let popup_frame;
        e.preventDefault();
        let download_url = v_button.attr('data-download');
        popup_frame = window.open(app_url, "myWindow", "width=380,height=600");
        window.addEventListener('message', function (event) {
            /*Callback when data send from child popup*/
            let obj = jQuery.parseJSON(event.data);
            let update_key = '';
            let message = obj.message;
            let support_until = '';
            let check_key = '';
            if (obj['data'].length > 0) {
                for (let i = 0; i < obj['data'].length; i++) {
                    if (obj['data'][i].id == item_id && (obj['data'][i].domain == main_domain || obj['data'][i].domain == '' || obj['data'][i].domain == null)) {
                        if (update_key == '') {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        } else if (support_until < obj['data'][i].support_until) {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        }
                        if (obj['data'][i].domain == main_domain) {
                            update_key = obj['data'][i].download_key;
                            break;
                        }
                    }
                }
                if (update_key) {
                    check_key = 1;
                    jQuery('.villatheme-autoupdate-key-field').val(update_key);
                }
            }
            v_button.removeClass('loading');
            if (check_key) {
                jQuery('<p><strong>' + message + '</strong></p>').insertAfter(".villatheme-autoupdate-key-field");
                jQuery(v_button).closest('form').submit();
            } else {
                jQuery('<p><strong> Your key is not found. Please contact support@villatheme.com </strong></p>').insertAfter(".villatheme-autoupdate-key-field");
            }
        });
    });
});

function tmds_ajax(options) {
    'use strict';
    window.fetch(options.url, {
        method: options.type,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: options.data
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw {statusText: response.statusText, responseText: text}
            });
        }
        return response.json();
    }).then(options.success).catch(error => options.error && options.error(error)).finally(() => options.complete && options.complete());
}