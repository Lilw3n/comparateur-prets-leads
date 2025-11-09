jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('click','.tmds-order-id', function (e) {
        let $fulfill_order_id = $(this);
        let $item_container = $fulfill_order_id.closest('.tmds-item-details');
        let $button_edit = $item_container.find('.tmds-item-actions-edit');
        if (!$(this).attr('href') || $button_edit.hasClass('tmds-hidden')) {
            e.preventDefault();
            return false;
        }
    });
    $(document).on('click','.tmds-tracking-number', function (e) {
        if (!$(this).attr('href')) {
            e.preventDefault();
            return false;
        }
    });
    $(document).on('click','.tmds-item-actions-edit', function () {
        let $button = $(this);
        $button.addClass('tmds-hidden');
        let $item_container = $button.closest('.tmds-item-details');
        $item_container.addClass('tmds-order-id-editing');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        $fulfill_order_id_input.prop('readonly', false).focus();
        $item_container.find('.tmds-item-actions-save').removeClass('tmds-hidden');
        $item_container.find('.tmds-item-actions-cancel').removeClass('tmds-hidden');
    });
    $(document).on('click','.tmds-item-actions-cancel', function () {
        let $button = $(this);
        $button.addClass('tmds-hidden');
        let $item_container = $button.closest('.tmds-item-details');
        $item_container.removeClass('tmds-order-id-editing');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        $fulfill_order_id_input.prop('readonly', true).val($fulfill_order_id.data('old_fulfill_order_id'));
        $item_container.find('.tmds-item-actions-edit').removeClass('tmds-hidden');
        $item_container.find('.tmds-item-actions-save').addClass('tmds-hidden');
    });
    $(document).on('click', '.tmds-item-actions-save',function () {
        let $button = $(this);
        let $td = $(this).closest('td');
        let $container = $button.closest('.tmds-item-details-container');
        let $orders_tracking_container = $td.find('.woo-orders-tracking-container');
        let $item_container = $button.closest('.tmds-item-details');
        let item_id = $item_container.data('product_item_id');
        let $overlay = $container.find('.tmds-item-value-overlay');
        let $fulfill_order_id = $item_container.find('.tmds-order-id');
        let $fulfill_order_id_input = $fulfill_order_id.find('.tmds-order-id-input');
        let $tracking_number = $container.find('.tmds-tracking-number');
        let $tracking_number_input = $container.find('.tmds-tracking-number-input');
        let $get_tracking = $container.find('.tmds-item-actions-get-tracking');
        let fulfill_order_id = $fulfill_order_id_input.val();
        let old_fulfill_order_id = $fulfill_order_id.data('old_fulfill_order_id');
        if (fulfill_order_id == old_fulfill_order_id) {
            $('.tmds-item-actions-cancel').trigger('click');
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
});