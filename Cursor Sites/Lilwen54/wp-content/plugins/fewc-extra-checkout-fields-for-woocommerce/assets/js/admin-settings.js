jQuery(document).ready(function ($) {
    'use strict';
    $('.vi-ui.vi-ui-main.tabular.menu .item').vi_tab({
        history: true,
        historyType: 'hash'
    });
    $('.vi-ui.checkbox').off().checkbox();
    $('input[type="checkbox"]').off().on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parent().find('input[type="hidden"]').val(1);
        } else {
            $(this).parent().find('input[type="hidden"]').val(0);
        }
    });
    $(document).on('click','.vifewc-reset:not(.loading)', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(vifewc_param.reset_message)){
            return false;
        }
        let button = $(this), wranning = $('.vifewc-import-wrap .vifewc-warning');
        wranning.html(null);
        $.ajax({
            url: vifewc_param.ajax_url,
            type: "POST",
            data:{
                action: 'vifewc_import_settings',
                type: 'reset',
                nonce:$('#_vifewc_setting').val()
            },
            beforeSend:function () {
                button.addClass('loading');
            },
            success:function (response) {
                button.removeClass('loading');
                if (response.message ){
                    wranning.html(response.message);
                }
                if (response.status === 'success'){
                    location.reload();
                }
            },
            error:function(err){
                console.log(err)
                button.removeClass('loading');
            }
        })
    });
    $(document).on('click','.vifewc-import:not(.loading)', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let input = $('[name=import_settings]'), wranning = $('.vifewc-import-wrap .vifewc-warning');
        wranning.html(null);
        if (!input.val()){
            wranning.html(vifewc_param.import_empty_warning);
            input.trigger('focus');
            return false;
        }
        if (!confirm(vifewc_param.import_message)){
            return false;
        }
        let button = $(this);
        $.ajax({
            url: vifewc_param.ajax_url,
            type: "POST",
            data:{
                action: 'vifewc_import_settings',
                data: input.val(),
                nonce:$('#_vifewc_setting').val()
            },
            beforeSend:function () {
                button.addClass('loading');
            },
            success:function (response) {
                button.removeClass('loading');
                if (response.message ){
                    wranning.html(response.message);
                }
                if (response.status === 'success'){
                    location.reload();
                }
            },
            error:function(err){
                console.log(err)
                button.removeClass('loading');
            }
        })
    });
});