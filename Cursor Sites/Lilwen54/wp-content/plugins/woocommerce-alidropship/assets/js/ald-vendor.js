jQuery(document).ready(function ($) {
    'use strict';
    window.onbeforeunload = function (event) {
        $('.woocommerce-alidropship-vendor-overlay').removeClass('vi-wad-hidden');
    }
    $(document).on('click','a' ,function (e){
        let url = $(this).attr('href');
        if (!url || url === '#'){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        let new_url = new URL($(this).attr('href'));
        if (!new_url.searchParams.get('vendor-dashboard')){
            new_url.searchParams.set('vendor-dashboard',1);
        }
        if (!new_url.searchParams.get('vendor_nonce')){
            new_url.searchParams.set('vendor_nonce',(new URL(location.href)).searchParams.get('vendor_nonce'));
        }
        location.href = new_url.href;
    });
});