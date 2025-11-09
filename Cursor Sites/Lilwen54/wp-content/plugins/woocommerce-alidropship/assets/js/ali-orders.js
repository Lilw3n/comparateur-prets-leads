jQuery(document).ready(function ($) {
    'use strict';
    let _vi_wad_ajax_nonce = vi_wad_ali_orders._vi_wad_ajax_nonce;
    /*Set paged to 1 before submitting*/
    let is_current_page_focus = false;
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
    $('select.vi-ui.dropdown:not(.viwad-dropdown-init)').addClass('viwad-dropdown-init').dropdown();

    window.addEventListener('message', (ev) => {
        switch (ev.data.action) {
            case 'viwad_render_dropdown':
                $('select.vi-ui.dropdown:not(.viwad-dropdown-init)').addClass('viwad-dropdown-init').dropdown();
                break;
        }
    });
    $('.vi-wad-ali-tracking-number').on('click', function (e) {
        if (!$(this).attr('href')) {
            e.preventDefault();
            return false;
        }
    });
    $('.vi-wad-ali-order-id').on('click', function (e) {
        let $ali_order_id = $(this);
        let $item_container = $ali_order_id.closest('.vi-wad-item-ali-order-details');
        let $button_edit = $item_container.find('.vi-wad-item-actions-edit');
        if (!$(this).attr('href') || $button_edit.hasClass('vi-wad-hidden')) {
            e.preventDefault();
            return false;
        }
    });
    $('.vi-wad-item-actions-edit').on('click', function () {
        let $button = $(this);
        $button.addClass('vi-wad-hidden');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        $item_container.addClass('vi-wad-ali-order-id-editing');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        $ali_order_id_input.prop('readonly', false).focus();
        $item_container.find('.vi-wad-item-actions-save').removeClass('vi-wad-hidden');
        $item_container.find('.vi-wad-item-actions-cancel').removeClass('vi-wad-hidden');
    });
    $('.vi-wad-item-actions-cancel').on('click', function () {
        let $button = $(this);
        $button.addClass('vi-wad-hidden');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        $item_container.removeClass('vi-wad-ali-order-id-editing');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        $ali_order_id_input.prop('readonly', true).val($ali_order_id.data('old_ali_order_id'));
        $item_container.find('.vi-wad-item-actions-edit').removeClass('vi-wad-hidden');
        $item_container.find('.vi-wad-item-actions-save').addClass('vi-wad-hidden');
    });
    $('.vi-wad-item-actions-save').on('click', function () {
        let $button = $(this);
        let $order_container = $button.closest('.vi-wad-order-container');
        let $order_item = $button.closest('.vi-wad-order-item');
        let $td = $button.closest('td');
        let $ali_order_container = $button.closest('.vi-wad-item-ali-order-container');
        let $orders_tracking_container = $td.find('.woo-orders-tracking-container');
        let $item_container = $button.closest('.vi-wad-item-ali-order-details');
        let item_id = $item_container.data('product_item_id');
        let $overlay = $ali_order_container.find('.vi-wad-item-ali-order-value-overlay');
        let $ali_order_id = $item_container.find('.vi-wad-ali-order-id');
        let $ali_order_id_input = $ali_order_id.find('.vi-wad-ali-order-id-input');
        let $tracking_number = $ali_order_container.find('.vi-wad-ali-tracking-number');
        let $tracking_number_input = $ali_order_container.find('.vi-wad-ali-tracking-number-input');
        let $get_tracking = $ali_order_container.find('.vi-wad-item-actions-get-tracking');
        let ali_order_id = $ali_order_id_input.val();
        let old_ali_order_id = $ali_order_id.data('old_ali_order_id');
        if (ali_order_id == old_ali_order_id) {
            $('.vi-wad-item-actions-cancel').click();
        } else {
            $overlay.removeClass('vi-wad-hidden');
            $.ajax({
                url: vi_wad_ali_orders.url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'vi_wad_manually_update_ali_order_id',
                    _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                    order_id: $order_container.data('order_id'),
                    item_id: item_id,
                    ali_order_id: ali_order_id,
                    return_shipping: $order_item.find('select[name="vi_wad_shipping_info_company"]').length > 0 ? 0 : 1,
                },
                success: function (response) {
                    if (response.status === 'success') {
                        $button.addClass('vi-wad-hidden');
                        $ali_order_id_input.prop('readonly', true);
                        $item_container.find('.vi-wad-item-actions-edit').removeClass('vi-wad-hidden');
                        $item_container.find('.vi-wad-item-actions-cancel').addClass('vi-wad-hidden');
                        $overlay.addClass('vi-wad-hidden');
                        $tracking_number_input.val('');
                        let href = '';
                        if (ali_order_id) {
                            $tracking_number.attr('href', 'http://track.aliexpress.com/logisticsdetail.htm?tradeId=ali_order_id');
                            $get_tracking.removeClass('vi-wad-hidden');
                            href = 'https://trade.aliexpress.com/order_detail.htm?orderId=' + ali_order_id;
                            $order_item.find('.vi-wad-order-item-check').prop('checked', false).trigger('change');
                            $order_item.find('.vi-wad-order-item-check').prop('disabled', true);
                            $order_item.addClass('vi-wad-order-item-can-not-be-ordered');
                            postMessage({action: 'viwad_handle_order_check_button',order_id: $order_container.data('order_id')});
                        } else {
                            if ($order_item.find('select[name="vi_wad_shipping_info_company"]').length > 0) {
                                $order_item.find('.vi-wad-order-item-check').prop('disabled', false);
                                $order_container.find('.vi-wad-order-check-all').prop('disabled', false);
                            } else if (response.hasOwnProperty('shipping_company_html') && response.shipping_company_html) {
                                $order_item.find('.vi-wad-order-item-check').prop('disabled', false);
                                $order_item.find('.vi-wad-order-item-shipping').html(response.shipping_company_html);
                                $order_item.find('select[name="vi_wad_shipping_info_company"]').dropdown().val(response.shipping_company_selected).trigger('change');
                                $order_container.find('.vi-wad-order-check-all').prop('disabled', false);
                            }
                            $order_item.removeClass('vi-wad-order-item-can-not-be-ordered');
                            $tracking_number.attr('href', '');
                            $get_tracking.addClass('vi-wad-invisibility');
                        }
                        $ali_order_id.data('old_ali_order_id', ali_order_id).attr('href', href);
                        $item_container.removeClass('vi-wad-ali-order-id-editing');
                    } else {
                        alert(response.message);
                    }
                    $overlay.addClass('vi-wad-hidden');
                },
                error: function (err) {
                    console.log(err);
                    $overlay.addClass('vi-wad-hidden');
                },
            });
        }
    });

    $(document).on('change', 'select[name="vi_wad_shipping_info_company"]', function (e) {
        let $shipping_company = $(this);
        let $order_item = $shipping_company.closest('.vi-wad-order-item');
        let $selected = $shipping_company.find('option[value="' + $shipping_company.val() + '"]');
        $order_item.find('.vi-wad-shipping-info-company-name span').html($selected.data('company'));
        $order_item.find('.vi-wad-order-item-shipping-cost').html($selected.data('shipping_amount_html'));
        $order_item.find('.vi-wad-order-item-shipping-time').html($selected.data('delivery_time'));
        $.ajax({
            url: vi_wad_ali_orders.url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'vi_wad_save_selected_shipping_company',
                _vi_wad_ajax_nonce: _vi_wad_ajax_nonce,
                order_id: $shipping_company.closest('.vi-wad-order-container').data('order_id'),
                item_id: $order_item.data('order_item_id'),
                company: $shipping_company.val(),
                company_name: $selected.data('company'),
                delivery_time: $selected.data('delivery_time'),
                shipping_cost: $selected.data('shipping_amount'),
            },
            success: function (response) {
            },
            error: function (err) {
                console.log(err);
            },
            complete: function () {
            }
        });
    });

});
