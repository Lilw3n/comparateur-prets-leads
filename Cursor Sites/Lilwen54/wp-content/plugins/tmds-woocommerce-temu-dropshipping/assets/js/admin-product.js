jQuery(document).ready(function ($) {
    'use strict';
    $(document).on('click','.tmds-video-shortcode',function (e){
        navigator.clipboard.writeText($(this).val());
        $(document.body).trigger('villatheme_show_message', [tmds_admin_product_params.i18n_video_shortcode_copied, ['success'], '', false, 5000]);
    });
});