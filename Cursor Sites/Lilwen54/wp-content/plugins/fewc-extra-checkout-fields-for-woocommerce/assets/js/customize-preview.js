(function ($) {
    'use strict';
    wp.customize.bind('preview-ready', function () {
        wp.customize.preview.bind('vifewc_set_preview_url', function (url) {
            wp.customize.preview.send('vifewc_set_preview_url', url);
        });
        wp.customize.preview.bind('vifewc_editing_field', function (field_id) {
            if ($('#'+field_id+'_field').length) {
                let offset = $('#' + field_id + '_field').offset();
                window.scrollTo({top:offset.top - 50, left: offset.left,behavior: 'smooth'});
            }
        });
        wp.customize.preview.bind('vifewc_open_section', function (section_id) {
            if ($(`.woocommerce-${section_id}-fields`).length){
                let offset = $(`.woocommerce-${section_id}-fields`).offset();
                window.scrollTo({top:offset.top - 50, left: offset.left,behavior: 'smooth'});
                if (section_id === 'shipping') {
                    if (!$('form.checkout').find('#ship-to-different-address input').prop('checked')) {
                        $('form.checkout').find('#ship-to-different-address input').prop('checked', true).trigger('change');
                    }
                }
            }
        });
        wp.customize.preview.bind('active', function () {
            $( window ).on( 'updated_checkout', function (e, data) {
                wp.customize.preview.send('vifewc_open_section');
            } );
        });
    });
    wp.customize('vifewc_sections_params[section_settings]', function (value) {
        value.bind(function (newval) {
            wp.customize.preview.send('vifewc_set_preview_url');
        });
    });
    wp.customize('vifewc_sections_params[section_fields]', function (value) {
        value.bind(function (newval) {
            wp.customize.preview.send('vifewc_set_preview_url');
        });
    });
})(jQuery, wp);