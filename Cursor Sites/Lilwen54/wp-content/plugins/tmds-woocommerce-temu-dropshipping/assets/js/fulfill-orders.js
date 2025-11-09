jQuery(document).ready(function ($) {
    'use strict';
    /*Set paged to 1 before submitting*/
    let is_current_page_focus = false;
    $(document).on('focus', '.tmds-pagination-form .tablenav-pages .current-page', function (e) {
        is_current_page_focus = true;
    });
    $(document).on('blur', '.tmds-pagination-form .tablenav-pages .current-page',function (e) {
        is_current_page_focus = false;
    });
    $(document).on('click', '.tmds-pagination-form .search-box input[type="submit"]',function (e) {
        let $form = $(this).closest('form');
        if (!is_current_page_focus) {
            $form.find('.current-page').val(1);
        }
    });
    $(document).on('click', '.tmds-order-id',function (e) {
        let link= $(this).attr('href');
        if (!link || ['#'].includes(link)) {
            return false;
        }
    });
    $(document).on('click','.tmds-item-actions-edit',function (){
        let $button = $(this);
        $button.addClass('tmds-hidden');
        let $item_container = $button.closest('.tmds-order-item');
        $item_container.addClass('tmds-order-id-editing');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        $fulfill_order_id.data('o_href', $fulfill_order_id.attr('href')).attr('href','');
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        $fulfill_order_id_input.prop('readonly', false).focus();
        $item_container.find('.tmds-item-actions-save').removeClass('tmds-hidden');
        $item_container.find('.tmds-item-actions-cancel').removeClass('tmds-hidden');
    });
    $(document).on('click','.tmds-item-actions-cancel',function (){
        let $button = $(this);
        $button.addClass('tmds-hidden');
        let $item_container = $button.closest('.tmds-order-item');
        $item_container.removeClass('tmds-order-id-editing');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        $fulfill_order_id.attr('href',$fulfill_order_id.data('o_href'));
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        $fulfill_order_id_input.prop('readonly', true).focus();
        $item_container.find('.tmds-item-actions-save').addClass('tmds-hidden');
        $item_container.find('.tmds-item-actions-edit').removeClass('tmds-hidden');
    });
    $(document).on('click','.tmds-item-actions-save',function (){
        let $button = $(this);
        let $order_container = $button.closest('.tmds-order-container');
        let $overlay = $order_container.find('.tmds-order-overlay');
        let $item_container = $button.closest('.tmds-order-item');
        let item_id = $item_container.data('order_item_id');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        let fulfill_order_id = $fulfill_order_id_input.val();
        let old_fulfill_order_id = $fulfill_order_id.data('old_fulfill_order_id');
        if (fulfill_order_id == old_fulfill_order_id) {
            $item_container.find('.tmds-item-actions-cancel').trigger('click');
        } else {
            $overlay.removeClass('tmds-hidden');
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_manually_update_fulfill_order_id',
                    tmds_nonce: tmds_params.nonce,
                    item_id: item_id,
                    fulfill_order_id: fulfill_order_id,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        $button.addClass('tmds-hidden');
                        $fulfill_order_id_input.prop('readonly', true);
                        if (fulfill_order_id) {
                            $item_container.find('.tmds-order-item-check').prop('disabled', true);
                        }else {
                            $item_container.find('.tmds-order-item-check').prop('disabled', false);
                        }
                        $item_container.find('.tmds-item-actions-edit').removeClass('tmds-hidden');
                        $item_container.find('.tmds-item-actions-cancel').addClass('tmds-hidden');
                        $overlay.addClass('tmds-hidden');
                        $fulfill_order_id.data('old_fulfill_order_id', fulfill_order_id).attr('href', response.fulfill_order_detail_url || '');
                        $item_container.removeClass('tmds-order-id-editing');
                    } else {
                        alert(response.message);
                    }
                    $overlay.addClass('tmds-hidden');
                },
                error: function (err) {
                    console.log(err);
                    $overlay.addClass('tmds-hidden');
                },
            });
        }
    });
    $(document).on('click','.tmds-order-check-all',function (){
        let $order_container = $(this).closest('.tmds-order-container');
        $order_container.find('.tmds-order-item-check').trigger('click');
    });
    $(document).on('click','.tmds-order-with-extension',function (){
        let $order_container = $(this).closest('.tmds-order-container');
        let $fulfill_items =$order_container.find('.tmds-order-item-check:checked');
        let total_fulfill_item = $fulfill_items.length;
        if (!total_fulfill_item){
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_empty_item_id, ['error'], '', false, 4500]);
            return;
        }
        let fulfill_url_params = { action:'add_to_cart',order_id : $order_container.data('order_id'), },
            fulfill_region='',
            order_items= {},
            multi_region= false;
        for (let i = 0; i < total_fulfill_item; i++) {
            let $fulfill_item = $($fulfill_items[i]).closest('.tmds-order-item');
            let item_region = $fulfill_item.data('fulfill_region');
            if (!fulfill_region){
                fulfill_region = item_region;
            }else if (item_region && item_region != fulfill_region){
                multi_region = true;
                break;
            }
            order_items[$fulfill_item.data('order_item_id')]={
                fulfill_product_id : $fulfill_item.data('fulfill_product_id'),
                fulfill_variation_id : $fulfill_item.data('fulfill_variation_id'),
                quantity : $fulfill_item.data('quantity'),
            };
        }
        if (multi_region){
            $(document.body).trigger('villatheme_show_message', [tmds_params.i18n_multi_region, ['error'], '', false, 4500]);
            return;
        }
        fulfill_url_params.fulfill_region = fulfill_region;
        let fulfill_url = new URL(tmds_params.fulfill_url);
        $.each(fulfill_url_params, function (k, v){
            fulfill_url.searchParams.set('tmds_'+k, v);
        });
        let fulfill_params = {...fulfill_url_params, order_items:order_items,domain:fulfill_url.searchParams.get('tmds_from_domain'),fulfill_url:fulfill_url.href};
        postMessage({action: 'tmds_fulfill', fulfill_params:fulfill_params});
    });
    window.addEventListener('message', (ev) => {
        switch (ev.data?.action) {
            case 'tmds_fulfill_message':
                let domain = ev.data?.domain, check_domain = location.origin + location.pathname;
                if (check_domain.includes(domain) && ev.data?.message && ev.data?.message_type){
                    $(document.body).trigger('villatheme_show_message', [ev.data.message, [ev.data.message_type], '', false, 4500]);
                }
                break;
        }
    });
});