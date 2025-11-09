jQuery(document).ready(function ($) {
    'use strict';
    /*Set paged to 1 before submitting*/
    let is_current_page_focus = false;
    $('.tablenav-pages').find('.current-page')
        .on('focus', () => is_current_page_focus = true)
        .on('blur', () => is_current_page_focus = false);

    $('.search-box').find('input[type="submit"]').on('click', function () {
        let $form = $(this).closest('form');
        if (!is_current_page_focus) {
            $form.find('.current-page').val(1);
        }
    });

    $('.vi-ui.tabular.menu .item').tab();
    $('.vi-ui.accordion').accordion('refresh');
    $('select.vi-ui.dropdown').dropdown();
    // $('.tmds-button-view-and-edit').on('click', e => e.stopPropagation());
    $('.tmds-accordion-store-url').on('click', e => e.stopPropagation());
    let queue = [],is_deleting = false,$imported_list_count = $('.tmds-imported-list-count');
    /*Dismiss product notice*/
    $(document).on('click','.tmds-product-notice-dismiss', function () {
        let $button = $(this);
        $button.closest('.vi-ui.message').fadeOut(200);
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'tmds_dismiss_product_notice',
                tmds_nonce: tmds_params.nonce,
                product_id: $button.data('product_id'),
            },
            success: function (response) {

            },
            error: function (err) {
                console.log(err)
            },
            complete: function () {

            }
        })
    });
    window.addEventListener('message', (ev) => {
        switch (ev.data.action) {
            case 'close_tab_import':
            case 'tmds_import_error':
            case 'tmds_import_completed':
                let {tmds_action,tmds_url_values,popup_name, pid} = ev.data;
                if (!['override','sync'].includes(tmds_action)){
                    break;
                }
                if (!tmds_url_values || !tmds_url_values?.tmds_from_domain || tmds_url_values.tmds_from_domain != tmds_params.site_url){
                    break;
                }
                if (!popup_name && !pid ){
                    break;
                }
                let btn_class = '.tmds-waiting-'+tmds_action+'-from-extension';
                $(btn_class).removeClass(btn_class + ' loading');
                if (ev.data?.message){
                    $(document.body).trigger('villatheme_show_message', [ev.data.message ,[ev.data?.message_type], ev.data?.message_content, ev.data?.message_timeout || 0]);
                }
                if (ev.data?.message_type === 'success' && tmds_action === 'override'){
                    location.href = tmds_params.import_list_url;
                }
                break;
        }
    });
    /*sync product*/
    $(document).on('click','.tmds-button-update-product',function (e){
        e.stopPropagation();
        e.preventDefault();
        let $btn = $(this);
        let url_params = $btn.data(),
            url=$btn.data('sync_url');
        let new_url = new URL(url);
        $.each(url_params, function (k, v){
            if (!v || k==='sync_url'){
                return;
            }
            new_url.searchParams.set('tmds_'+k, v);
        });
        $btn.addClass('tmds-waiting-sync-from-extension loading');
        window.open(new_url.href, 'tmds_sync_'+ url_params.product_id, "width=760,height=760")
    });
    /*override product*/
    let override_product_data, override_product_id;
    $(document).on('click','.tmds-button-override', function () {
        let $button_override = $(this);
        let product_id = $button_override.data('product_id');
        let product_title = $button_override.data('product_title');
        let woo_product_id = $button_override.data('woo_product_id');
        $('.tmds-delete-product-options-product-title').html(product_title);
        $('.tmds-delete-product-options-button-override').data('product_id', product_id).data('woo_product_id', woo_product_id);
        $('.tmds-delete-product-options-override-product-message').addClass('tmds-hidden');
        tmds_delete_product_options_show_override();
    });
    $(document).on('click','.tmds-delete-product-options-button-override', function () {
        let $button_override = $(this);
        let override_product_url = $('#tmds-delete-product-options-override-product').val();
        let product_id = $button_override.data('product_id');
        let woo_product_id = $button_override.data('woo_product_id');
        let $current_button_override = $('.tmds-button-override[data-product_id="' + product_id + '"]');
        let step = 'check';
        if ($button_override.hasClass('tmds-checked')) {
            step = 'override';
        }
        if (step === 'check') {
            if (!$('.tmds-delete-product-options-override-product-new-wrap').hasClass('tmds-hidden')){
                $('.tmds-delete-product-options-override-product-new-close').trigger('click');
                return;
            }
            if (!override_product_url) {
                $(document.body).trigger('villatheme_show_message', ['Please enter url or ID of product you want to use to override current product with' ,['error'], '', false, 4500]);
                $('#tmds-delete-product-options-override-product').trigger('focus');
                return;
            }
        } else {
            if (!override_product_data && !override_product_id) {
                $(document.body).trigger('villatheme_show_message', ['Please enter product url or id to check.' ,['error'], '', false, 4500]);
                $('#tmds-delete-product-options-override-product').trigger('focus');
                return;
            }
        }
        $('.tmds-delete-product-options-override-product-message').addClass('tmds-hidden');
        $current_button_override.addClass('loading');
        $button_override.addClass('loading');
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'tmds_override_product',
                tmds_nonce: tmds_params.nonce,
                product_id: product_id,
                woo_product_id: woo_product_id,
                override_product_url: override_product_url,
                override_product_data: override_product_data,
                override_product_id: override_product_id,
                step: step,
                replace_description: $('.tmds-delete-product-options-override-product-replace-description').prop('checked') ? 1 : 0,
            },
            success: function (response) {
                if (step === 'check') {
                    if (response.status === 'error') {
                        $('.tmds-delete-product-options-override-product-message').removeClass('tmds-hidden').html(response.message);
                    } else {
                        if (response?.redirect_url){
                            let override_product_url = new URL(response.redirect_url);
                            if (response?.redirect_param){
                                $.each(response.redirect_param, function (k,v){
                                    override_product_url.searchParams.set(k, v);
                                });
                            }
                            window.open(override_product_url.href, 'tmds_overriding_'+ product_id, "width=760,height=760")
                        }else {
                            override_product_data = response.data;
                            override_product_id = response.exist_product_id;
                            $('.tmds-delete-product-options-override-product-new-wrap').removeClass('tmds-hidden');
                            $('.tmds-delete-product-options-override-product-new-image').find('img').attr('src', response.image);
                            $('.tmds-delete-product-options-override-product-new-title').html(response.title);
                            if (response.status === 'success') {
                                $button_override.html(tmds_params.override).addClass('tmds-checked');
                            }
                        }
                        if (response.message) {
                            $('.tmds-delete-product-options-override-product-message').removeClass('tmds-hidden').html(response.message);
                        }
                    }
                } else {
                    if (response.status === 'success') {
                        let $product_container = $('#tmds-product-item-id-' + product_id);
                        $product_container.find('div.content').eq(0).prepend(response.data);
                        // $product_container.vi_accordion('close', 0);
                        $current_button_override.remove();
                        $product_container.find('.tmds-button-reimport').remove();
                        $product_container.find('.tmds-button-override-container').append(response.button_override_html);
                        tmds_delete_product_options_hide();
                    } else {
                        $button_override.html(tmds_params.check).removeClass('tmds-checked');
                        if (response.message) {
                            $('.tmds-delete-product-options-override-product-message').removeClass('tmds-hidden').html(response.message);
                        }
                    }
                }
            },
            error: function (err) {
                console.log(err)
            },
            complete: function () {
                $current_button_override.removeClass('loading');
                $button_override.removeClass('loading');
            }
        })
    });
    function tmds_delete_product_options_show_override() {
        $('.tmds-delete-product-options-content-header-override').removeClass('tmds-hidden');
        $('.tmds-delete-product-options-button-override').removeClass('tmds-hidden tmds-checked').html(tmds_params.check);
        $('.tmds-delete-product-options-override-product-wrap').removeClass('tmds-hidden');
        $('.tmds-delete-product-options-override-product-new-image').find('img').attr('src', '');
        $('.tmds-delete-product-options-override-product-new-title').html('');
        $('.tmds-delete-product-options-override-product-new-wrap').addClass('tmds-hidden');
        tmds_delete_product_options_show();
        $('.tmds-delete-product-options-override-product').val('').focus();
    }
    /*override product*/
    /*delete product*/
    $('.tmds-button-restore').on('click', function () {
        let $button = $(this);
        let $trash_count = $('.tmds-imported-products-count-trash');
        let trash_count = parseInt($trash_count.html());
        let $publish_count = $('.tmds-imported-products-count-publish');
        let publish_count = parseInt($publish_count.html());
        let data = {
            action: 'tmds_restore_product',
            tmds_nonce: tmds_params.nonce,
            product_id: $(this).data('product_id')
        };
        let $product_container = $('#tmds-product-item-id-' + data.product_id);
        $button.addClass('loading');

        $.ajax({
            url: tmds_params.ajax_url,
            type: 'post',
            dataType: 'JSON',
            data: data,
            success: function (res) {
                if (res.status === 'success') {
                    let imported_list_count_value = parseInt($imported_list_count.html());
                    if (imported_list_count_value > 0) {
                        let current_count = imported_list_count_value + 1;
                        $imported_list_count.html(current_count);
                        $imported_list_count.parent().attr('class', 'update-plugins count-' + current_count);
                    }
                    trash_count--;
                    publish_count++;
                    $product_container.fadeOut(300);
                    setTimeout(function () {
                        $trash_count.html(trash_count);
                        $publish_count.html(publish_count);
                        $product_container.remove();
                    }, 300)
                }
                if (res.message){
                    jQuery(document.body).trigger('villatheme_show_message', [res.message ,[res.status], '', false, 4500]);
                }
            },
            error: function (res) {
                console.log(res);
            },
            complete: function () {
                $button.removeClass('loading');
            }
        });
    });
    $('.tmds-button-trash').on('click', function () {
        let $button = $(this);
        let $trash_count = $('.tmds-imported-products-count-trash');
        let trash_count = parseInt($trash_count.html());
        let $publish_count = $('.tmds-imported-products-count-publish');
        let publish_count = parseInt($publish_count.html());
        let data = {
            action: 'tmds_trash_product',
            tmds_nonce: tmds_params.nonce,
            product_id: $(this).data('product_id'),
        };
        let $product_container = $('#tmds-product-item-id-' + data.product_id);

        $button.addClass('loading');

        $.ajax({
            url: tmds_params.ajax_url,
            type: 'post',
            dataType: 'JSON',
            data: data,
            success: function (res) {
                if (res.status === 'success') {
                    let imported_list_count_value = parseInt($imported_list_count.html());
                    if (imported_list_count_value > 0) {
                        let current_count = imported_list_count_value - 1;
                        $imported_list_count.html(current_count);
                        $imported_list_count.parent().attr('class', 'update-plugins count-' + current_count);
                    }
                    trash_count++;
                    publish_count--;
                    $product_container.fadeOut(300);
                    setTimeout(function () {
                        $trash_count.html(trash_count);
                        $publish_count.html(publish_count);
                        $product_container.remove();
                    }, 300)
                }
                if (res.message){
                    jQuery(document.body).trigger('villatheme_show_message', [res.message ,[res.status], '', false, 4500]);
                }
            },
            error: function (res) {
                console.log(res);
            },
            complete: function () {
                $button.removeClass('loading');
            }

        });
    });
    $(document).on('click','.tmds-delete-product-options-button-delete', function () {
        let $button = $(this);
        let product_id = $button.data()['product_id'];
        let woo_product_id = $button.data()['woo_product_id'];
        let $button_delete = $(`.tmds-button-delete[data-product_id="${product_id}"]`);
        $button_delete.addClass('loading');
        let $product_container = $(`#tmds-product-item-id-${product_id}`);
        $product_container.addClass('tmds-accordion-deleting').accordion('close', 0);
        let delete_woo_product = $('.tmds-delete-product-options-delete-woo-product').prop('checked') ? 1 : 0;
        tmds_delete_product_options_hide();
        if (is_deleting) {
            queue.push({
                product_id: product_id,
                woo_product_id: woo_product_id,
                delete_woo_product: delete_woo_product,
            });
        } else {
            is_deleting = true;
            tmds_delete_product(product_id, woo_product_id, delete_woo_product);
        }
    });
    $(document).on('click','.tmds-button-delete', function () {
        let $button_delete = $(this);
        if (!$button_delete.hasClass('loading')) {
            let product_title = $button_delete.data()['product_title'];
            let product_id = $button_delete.data()['product_id'];
            let woo_product_id = $button_delete.data()['woo_product_id'];
            $('.tmds-delete-product-options-product-title').html(product_title);
            $('.tmds-delete-product-options-button-delete').data('product_id', product_id).data('woo_product_id', woo_product_id);
            tmds_delete_product_options_show_delete();
        }
    });
    $(document).on('click','.tmds-overlay,.tmds-delete-product-options-close,.tmds-delete-product-options-button-cancel', () => tmds_delete_product_options_hide());
    function tmds_delete_product_options_hide() {
        $('.tmds-delete-product-options-content-header-delete').addClass('tmds-hidden');
        $('.tmds-delete-product-options-button-delete').addClass('tmds-hidden').data('product_id', '').data('woo_product_id', '');
        $('.tmds-delete-product-options-delete-woo-product-wrap').addClass('tmds-hidden');
        $('.tmds-delete-product-options').addClass('tmds-delete-product-options-editing');
        $('.tmds-delete-product-options-container').addClass('tmds-hidden');
        tmds_enable_scroll();
        $('.tmds-delete-product-options-content-header-override').addClass('tmds-hidden');
        $('.tmds-delete-product-options-button-override').addClass('tmds-hidden').data('product_id', '').data('woo_product_id', '');
        $('.tmds-delete-product-options-override-product-wrap').addClass('tmds-hidden');
    }
    function tmds_delete_product_options_show_delete() {
        $('.tmds-delete-product-options-content-header-delete').removeClass('tmds-hidden');
        $('.tmds-delete-product-options-button-delete').removeClass('tmds-hidden');
        $('.tmds-delete-product-options-delete-woo-product-wrap').removeClass('tmds-hidden');
        tmds_delete_product_options_show();
    }
    function tmds_delete_product_options_show() {
        $('.tmds-delete-product-options-container').removeClass('tmds-hidden');
        tmds_disable_scroll();
    }
    function tmds_delete_product(product_id, woo_product_id, delete_woo_product) {
        let $button_delete = $(`.tmds-button-delete[data-product_id="${product_id}"]`);
        let $product_container = $(`#tmds-product-item-id-${product_id}`);
        hide_message($product_container);
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'tmds_delete_product',
                tmds_nonce: tmds_params.nonce,
                product_id: product_id,
                woo_product_id: woo_product_id,
                delete_woo_product: delete_woo_product,
            },
            success: function (response) {
                if (response.status === 'success') {
                    let imported_list_count_value = parseInt($imported_list_count.html());
                    if (imported_list_count_value > 0) {
                        let current_count = parseInt(imported_list_count_value - 1);
                        $imported_list_count.html(current_count);
                        $imported_list_count.parent().attr('class', 'update-plugins count-' + current_count);
                    }

                    $product_container.fadeOut(300);
                    setTimeout(function () {
                        $product_container.remove();
                        maybe_reload_page();
                    }, 300)
                } else {
                    show_message($product_container, 'negative', response.message);
                    $product_container.removeClass('tmds-accordion-deleting').accordion('open', 0);
                }
            },
            error: function (err) {
                show_message($product_container, 'negative', err.statusText);
                $product_container.removeClass('tmds-accordion-deleting').accordion('open', 0);
            },
            complete: function () {
                is_deleting = false;
                $button_delete.removeClass('loading');
                if (queue.length > 0) {
                    let current = queue.shift();
                    tmds_delete_product(current.product_id, current.woo_product_id, current.delete_woo_product);
                }
            }
        })

    }
    /*delete product*/
    add_keyboard_event();
    function add_keyboard_event() {
        $(document).on('keydown', function (e) {
            if (!$('.tmds-delete-product-options-container').hasClass('tmds-hidden')) {
                if (e.keyCode == 13) {
                    if (!$('.tmds-delete-product-options-button-override').hasClass('tmds-hidden')) {
                        $('.tmds-delete-product-options-button-override').trigger('click');
                        $('.tmds-delete-product-options-override-product').focus();
                    } else if (!$('.tmds-delete-product-options-button-delete').hasClass('tmds-hidden')) {
                        $('.tmds-delete-product-options-button-delete').trigger('click');
                    }
                } else if (e.keyCode === 27) {
                    $('.tmds-overlay').trigger('click');
                }
            }
        });
    }

    function tmds_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('tmds-noscroll');
        // $('html,body').scrollTop(-scrollTop);
        window.scrollTo({top: -scrollTop, behavior: 'instant'});
    }

    function tmds_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('tmds-noscroll').css('top', -scrollTop);
        }
    }
    function hide_message($parent) {
        $parent.find('.tmds-message').html('')
    }

    function show_message($parent, type, message) {
        $parent.find('.tmds-message').html(`<div class="vi-ui message ${type}"><div>${message}</div></div>`)
    }
    function maybe_reload_page() {
        if ($('.tmds-accordion').length === 0) {
            let url = new URL(document.location.href);
            url.searchParams.delete('tmds_search_woo_id');
            url.searchParams.delete('tmds_search_id');
            url.searchParams.delete('tmds_search');
            url.searchParams.delete('paged');
            document.location.href = url.href;
        }
    }
});