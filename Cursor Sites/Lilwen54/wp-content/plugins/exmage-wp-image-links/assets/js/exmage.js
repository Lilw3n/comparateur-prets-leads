jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('click', '.exmage-migrate-button,.exmage-convert-external-button', function (event) {
        convert_attachment($(this));
    });
    /*Add field filter external image*/
    let ids_media = [];


    $('body').on('click', '.download_exmage_all', (e) => {
        e.preventDefault();
        let text_count = ids_media.length > 0 ? ids_media.length : 'all';
        if (confirm('Do you really want to download ' + text_count + ' images?')) {
            let per_download = 5;

            if(!ids_media.length){
                get_all_attachment_id();
            }
            if(!ids_media.length){
                alert("No Exmage available for download.")
            }
            for (let i = 0; i < per_download; i++) {
                let current_media_id = ids_media[i],
                    button_selector = $('#post-' + current_media_id).find('.exmage-migrate-button');
                convert_attachment(button_selector, true);
            }
        }
    });
    $('body').on('change', 'input[name="media[]"],#cb-select-all-1', (e) => {
        ids_media = [];
        $('.exmage-migrate-button').map(function () {
            let current_tr = $(this).closest('tr');
            if (current_tr.find('input[name="media[]"]').prop('checked')) {
                ids_media.push($(this).data('attachment_id'));
            }
        });
        if (ids_media.length) {
            $('.download_exmage_all .exmage_number_download').html(ids_media.length);
        } else {
            $('.download_exmage_all .exmage_number_download').html("all");
        }
    });
    function get_all_attachment_id() {
        ids_media = [];
        $('.exmage-migrate-button').map(function () {
            ids_media.push($(this).data('attachment_id'));

        });
    }
    function convert_attachment($button, multiple = false) {
        let attachment_id = $button.data('attachment_id'),
            $container = $button.closest('.exmage-external-url-container'),
            $message = $container.find('.exmage-migrate-message'),
            to_external = $button.is('.exmage-migrate-button') ? 0 : 1;
        if (!$button.hasClass('exmage-button-loading')) {
            $button.addClass('exmage-button-loading');
            $message.html('');
            $.ajax({
                url: exmage_admin_params.ajaxurl,
                type: 'POST',
                data: {
                    action: 'exmage_convert_external_image',
                    attachment_id: attachment_id,
                    to_external: to_external,
                    _exmage_ajax_nonce: exmage_admin_params._exmage_ajax_nonce,
                },
                success(response) {
                    if (response.status === 'success') {
                        // $container.find('.exmage-external-url-content').html(response.message);
                        $container.find('.exmage-external-url-content').html('');
                        if(multiple){
                            ids_media = jQuery.grep(ids_media, function(value) {
                                return value !== attachment_id;
                            });

                            if(ids_media.length){
                                let current_media_id = ids_media[0],
                                    button_selector = $('#post-' + current_media_id).find('.exmage-migrate-button');
                                convert_attachment(button_selector, true);
                            }
                        }
                    } else {
                        $message.html('<span class="exmage-message-error"><span class="exmage-use-url-message-content">' + response.message + '</span></span>');
                    }
                },
                error() {
                    $message.html('<span class="exmage-message-error"><span class="exmage-use-url-message-content">An error occurs</span></span>');
                },
                complete() {
                    $button.removeClass('exmage-button-loading');
                }
            });
        }
    }

    /*Process image url*/
    $(document).on('click', '.exmage-use-url-input-multiple-add', function () {
        data_preprocessing($(this).closest('.exmage-container-form').find('.exmage-use-url-input-multiple'));
        exmage_handle_url_input($(this).closest('.exmage-container-form').find('.exmage-use-url-input-multiple'));
    });

    $(document).on('change', '.exmage-add-external-url-field.exmage-add-external-url-media', function (event) {
        let t = $(this),
            t_closest = t.closest('.exmage-table-tr'),
            t_closest_table = t.closest('.exmage-wrap-body-table'),
            t_closest_wrap_loading = t_closest_table.find('.exmage-use-url-input-overlay'),
            t_image_preview_wrap = t_closest.find('.exmage_preview_field'),
            t_image_preview = t_image_preview_wrap.find('.exmage-image-preview'),
            placeholder_src = t_image_preview.data('placeholder_src');

        if (isImageURL(t.val())) {
            t_image_preview.attr('src', t.val());
            t_image_preview_wrap.show();
            t_closest.attr('data-media_type', 'image');
        } else {
            t_closest.attr('data-media_type', 'image');
            t_image_preview.attr('src', placeholder_src);
            t_image_preview_wrap.hide();
        }

        if (t.val() !== '') {
            t_closest.find('.exmage-add-field').trigger('click');
        }

    });

    $(document).on('click', '.exmage-delete-field', function () {
        let t = $(this),
            t_closet = t.closest('.exmage-table-tr'),
            t_body_table = t.closest('.exmage-wrap-body-table');
        let count = t_body_table.find('.exmage-table-tr').length;
        if (count > 1) {
            t_closet.remove();
        } else {
            alert('You cannot delete all fields!');
        }
        return false;
    });
    $(document).on('click', '.exmage-add-field', function () {
        let t = $(this),
            t_closet = t.closest('.exmage-table-tr'),
            t_body_table = t.closest('.exmage-wrap-body-table');
        let template = t_closet.clone();

        let preview_field_img = template.find('.exmage_preview_field img');
        template.find('.exmage-add-external-url-media').val('');/*Remove external video or image clone*/

        template.attr('data-media_type', 'image');/*Set default tr media_type*/

        preview_field_img.attr('src', preview_field_img.data('placeholder_src'));

        t_body_table.append(template);
        return false;
    });
});
function data_preprocessing($input) {
    let $container = $input.closest('.exmage-container-form'),
        tab_content = $container.find('.exmage-wrap-tab-content'),
        tab_content_list = tab_content.find('.exmage-tab-content-item');

    let arr_url = [];

    let tr = tab_content_list.find('.exmage-wrap-body-table .exmage-table-tr');
    tr.each(function (i, e) {
        let tr_this = jQuery(this);
        let field_url = tr_this.find('.exmage-add-external-url-field');
        if (field_url.val()) {
            arr_url.push(field_url.val());
        }

    });

    jQuery('.exmage-use-url-input-multiple').val(arr_url.toString());


}
function exmage_handle_url_input($input, $type) {
    let $container = $input.closest('.exmage-container-form'),
        $overlay = $container.find('.exmage-use-url-input-overlay'),
        $message = $container.find('.exmage-use-url-message');
    if ($overlay.hasClass('exmage-hidden')) {
        $message.html('');
        setTimeout(function () {
            let urls = $input.val();
            let is_url_valid = false, is_single = $input.is('input');
            try {
                if (is_single) {
                    let url_obj = new URL(urls);
                    if (url_obj.protocol === 'https:' || url_obj.protocol === 'http:') {
                        is_url_valid = true;
                    } else {
                        $message.html('<p class="exmage-message-error"><span class="exmage-use-url-message-content">Please enter a valid image URL</span></p>');
                    }
                } else {
                    if (urls) {
                        is_url_valid = true;
                    } else {
                        $message.html('<p class="exmage-message-error"><span class="exmage-use-url-message-content">Please enter at least a valid image URL to continue</span></p>');
                        return;
                    }
                }
            } catch (e) {
                $overlay.addClass('exmage-hidden');
                $message.html('<p class="exmage-message-error"><span class="exmage-use-url-message-content">Please enter a valid image URL</span></p>');
                return;
            }
            if (is_url_valid) {
                $overlay.removeClass('exmage-hidden');
                jQuery.ajax({
                    url: exmage_admin_params.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'exmage_handle_url',
                        urls: urls,
                        post_id: exmage_admin_params.post_id,
                        _exmage_ajax_nonce: exmage_admin_params._exmage_ajax_nonce,
                        is_single: is_single ? 1 : '',
                    },
                    success(response) {
                        let active_frame = wp.media ? wp.media.frame : '';
                        if (response.status === 'success') {
                            let details = response.details, message = '';
                            for (let i in details) {
                                if (details[i].status === 'success') {
                                    if (is_single) {
                                        message += `<p class="exmage-message-${details[i].status}"><span class="exmage-use-url-message-content">${details[i].message}</span>, ID: <a target="_blank" href="${details[i].edit_link}">${details[i].id}</a></p>`;
                                    } else {
                                        message += `<li class="exmage-message-${details[i].status}"><span class="exmage-result-url">${details[i].url} =><span class="exmage-use-url-message-content">${details[i].message}</span>, ID: <a target="_blank" href="${details[i].edit_link}">${details[i].id}</a></li>`;
                                    }
                                    if (active_frame) {
                                        let _state = active_frame.content.view._state;
                                        let selection = active_frame.state().get('selection');

                                        if ('upload' === active_frame.content.mode()) {
                                            active_frame.content.mode('browse');
                                        }
                                        if (_state === 'library' || _state === 'edit-attachment') {
                                            if (selection) {
                                                selection.reset();
                                                selection.add(wp.media.attachment(details[i].id));
                                            }
                                            if (active_frame.content.get() && active_frame.content.get().collection) {
                                                active_frame.content.get().collection._requery(true);
                                            }
                                            active_frame.trigger('library:selection:add');
                                        } else {
                                            if (selection) {
                                                selection.reset();
                                                selection.add(wp.media.attachment(details[i].id));
                                            }
                                            wp.media.attachment(details[i].id).fetch();
                                        }
                                    }
                                } else {
                                    if (details[i].id) {
                                        let item_message = `<span class="exmage-use-url-message-content">${details[i].message}</span>, ID: <a target="_blank" href="${details[i].edit_link}">${details[i].id}</a>`;
                                        if (active_frame && active_frame.content.get() && active_frame.content.get().collection) {
                                            item_message = `${item_message}. <span class="exmage-select-existing-image" data-attachment_id="${details[i].id}">${exmage_admin_params.i18n_select_existing_image}</span>.`;
                                        }
                                        if (is_single) {
                                            message += `<p class="exmage-message-${details[i].status}">${item_message}</p>`;
                                        } else {
                                            message += `<li class="exmage-message-${details[i].status}"><span class="exmage-result-url">${details[i].url} =>${item_message}</li>`;
                                        }
                                    } else {
                                        if (is_single) {
                                            message += `<p class="exmage-message-${details[i].status}"><span class="exmage-use-url-message-content">${details[i].message}</span></p>`;
                                        } else {
                                            message += `<li class="exmage-message-${details[i].status}"><span class="exmage-result-url">${details[i].url} =><span class="exmage-use-url-message-content">${details[i].message}</span></li>`;
                                        }
                                    }
                                }
                            }
                            if (!is_single) {
                                message = `<ol>${message}</ol>`;
                            }
                            $message.html(message);
                        } else if (response.status === 'queue') {
                            $message.html('<p class="exmage-message-queue"><span class="exmage-use-url-message-content">' + response.message + '</span></p>');
                        } else {
                            $message.html('<p class="exmage-message-error"><span class="exmage-use-url-message-content">' + response.message + '</span></p>');
                        }
                    },
                    error() {
                        $message.html('<p class="exmage-message-error"><span class="exmage-use-url-message-content">An error occurs.</span></p>');
                    },
                    complete(jqXHR, textStatus) {
                        $overlay.addClass('exmage-hidden');

                        let responseJSON = jqXHR.responseJSON ?? {};
                        if (responseJSON.details && responseJSON.details.length) {
                            let details = responseJSON.details;
                            if (details.length) {
                                let details_item = details[0];
                                if (typeof details_item.type !== 'undefined') {
                                    jQuery('.exmage-add-external-url-field.exmage-add-external-url-media').val('');
                                } else {
                                    jQuery('.exmage-add-external-url-field').val('');
                                }
                            }
                        }
                    }
                });
            }
        }, 1);
    }
}
function isImageURL(url) {

    var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff)(\?.*)?$/i;


    var imageDomains = [
        /(?:https?:\/\/)?(?:.+\.)?imgur\.com\/.+/,
        /(?:https?:\/\/)?(?:.+\.)?gyazo\.com\/.+/,
        /(?:https?:\/\/)?(?:.+\.)?prnt\.sc\/.+/,
        /(?:https?:\/\/)?drive\.google\.com\/uc\?id=.+/,
        /(?:https?:\/\/)?images\.unsplash\.com\/.+/,
        /(?:https?:\/\/)?cdn\.discordapp\.com\/attachments\/.+/,
        /(?:https?:\/\/)?somecdn\.net\/photo\?id=.+/
    ];


    if (imageExtensions.test(url)) {
        return true;
    }

    for (var i = 0; i < imageDomains.length; i++) {
        if (imageDomains[i].test(url)) {
            return true;
        }
    }

    return false;
}