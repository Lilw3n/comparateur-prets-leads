jQuery(document).ready(function ($) {
    'use strict';
    let is_current_page_focus = false;
    /*Set paged to 1 before submitting*/
    $('.tablenav-pages').find('.current-page').on('focus', function (e) {
        is_current_page_focus = true;
    }).on('blur', function (e) {
        is_current_page_focus = false;
    });
    $('select[name="ettsydrop_search_product_id"]').on('change', function () {
        let $form = $(this).closest('form');
        if (!is_current_page_focus) {
            $form.find('.current-page').val(1);
        }
        $form.submit();
    });
    $('.tmds-search-product-id').select2({
        placeholder: 'Filter by product',
        allowClear: true,
    });
    $('.tmds-search-product-id-ajax').select2({
        closeOnSelect: true,
        allowClear: true,
        placeholder: "Please enter product title to search",
        ajax: {
            url: "admin-ajax.php?action=tmds_search_product_failed_images&tmds_nonce="+tmds_params.nonce,
            dataType: 'json',
            type: "GET",
            quietMillis: 50,
            delay: 250,
            data: function (params) {
                return {
                    keyword: params.term,
                    p_id: $(this).closest('td').data('id')
                };
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1
    });
    let queue = [], queue_delete = [], is_bulk_delete = false;
    $(document).on('click','.tmds-action-download-all',function (){
        if ($('.tmds-button-all-container').find('.loading').length === 0) {
            $('.tmds-action-download').not('.loading').map(function () {
                if ($(this).closest('.tmds-actions-container').find('.loading').length === 0) {
                    queue.push($(this));
                }
            });
            if (queue.length > 0) {
                queue.shift().click();
                $('.tmds-action-download-all').addClass('loading');
            }
        }
    });
    $(document).on('click','.tmds-action-download',function (){
        let $button = $(this);
        let $row = $button.closest('tr');
        let item_id = $button.data('item_id');
        if ($button.hasClass('loading')) {
            return false;
        }
        $button.addClass('loading');
        $button.find('.tmds-download-image-error').remove();
        $.ajax({
            url: tmds_params.ajax_url,
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'tmds_download_error_product_images',
                tmds_nonce: tmds_params.nonce,
                item_id: item_id
            },
            success: function (response) {
                $button.removeClass('loading');
                if (response.status === 'success') {
                    $row.remove();
                    if ($('.tmds-action-download').length === 0) {
                        $('.tmds-button-all-container').remove();
                    }
                } else {
                    let $result_icon = $('<span class="tmds-download-image-error dashicons dashicons-no" title="' + response.message + '"></span>');
                    $button.append($result_icon);
                }
            },
            error: function (err) {
                console.log(err);
                $button.removeClass('loading');
            },
            complete: function () {
                if (queue.length > 0) {
                    queue.shift().click();
                } else if ($('.tmds-action-download-all').hasClass('loading')) {
                    $('.tmds-action-download-all').removeClass('loading')
                }
            }
        })
    });
    $(document).on('click','.tmds-action-delete-all',function () {
        if ($('.tmds-button-all-container').find('.loading').length === 0) {
            if (confirm(tmds_params.i18n_confirm_delete_all)) {
                $('.tmds-action-delete').not('.loading').map(function () {
                    if ($(this).closest('.tmds-actions-container').find('.loading').length === 0) {
                        queue_delete.push($(this));
                    }
                });
                if (queue_delete.length > 0) {
                    is_bulk_delete = true;
                    queue_delete.shift().click();
                    $('.tmds-action-delete-all').addClass('loading');
                }
            }

        }
    });
    $(document).on('click', '.tmds-action-delete',function () {
        let $button = $(this);
        let $row = $button.closest('tr');
        let item_id = $button.data('item_id');
        if ($button.hasClass('loading')) {
            return;
        }
        if (is_bulk_delete || confirm(tmds_params.i18n_confirm_delete)) {
            $button.addClass('loading');
            $button.find('.tmds-delete-image-error').remove();
            $.ajax({
                url: tmds_params.ajax_url,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    action: 'tmds_delete_error_product_images',
                    tmds_nonce: tmds_params.nonce,
                    item_id: item_id
                },
                success: function (response) {
                    $button.removeClass('loading');
                    if (response.status === 'success') {
                        $row.remove();
                        if ($('.tmds-action-download').length === 0) {
                            $('.tmds-button-all-container').remove();
                        }
                    } else {
                        let $result_icon = $('<span class="tmds-delete-image-error dashicons dashicons-no" title="' + response.message + '"></span>');
                        $button.append($result_icon);
                    }
                },
                error: function (err) {
                    console.log(err);
                    $button.removeClass('loading');
                },
                complete: function () {
                    if (queue_delete.length > 0) {
                        queue_delete.shift().click();
                    } else {
                        if ($('.tmds-action-delete-all').hasClass('loading')) {
                            $('.tmds-action-delete-all').removeClass('loading')
                        }
                        is_bulk_delete = false;
                    }
                }
            })
        }
    });
});