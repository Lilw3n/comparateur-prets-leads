jQuery(document).ready(function ($) {
    'use strict';
    if (typeof vifewc_param === "undefined") {
        return;
    }
    setTimeout(function (){
        $(document).trigger('vifewc_checkout_fields_html');
    },100);
    $(document).on('change','[type="checkbox"]', function () {
        let input = $(this).parent().find('input[type="hidden"]');
        if ($(this).prop('checked')) {
            input.val('1');
        }else {
            input.val('');
        }
    });
    $(document).on('click','.vifewc-field-btn-save:not(.loading)', function (e) {
        let button = $('.vifewc-field-btn-save');
        button.addClass('loading');
        console.log(vifewc_param);
        $.ajax({
            url: vifewc_param.ajax_url,
            type: "POST",
            data:{
                action: 'fewc_checkout_save',
                section_fields: JSON.stringify(vifewc_param.section_fields),
                section_settings: JSON.stringify(vifewc_param.section_settings),
                section_id: JSON.stringify(vifewc_param.section_ids),
                nonce:vifewc_param.nonce
            },
            success:function (response) {
                button.removeClass('loading');
                if (response?.message ){
                    $(document.body).trigger('villatheme_show_message', [response.message, [response.status], '', false, 4500]);
                }
            },
            error:function(err){
                console.log(err)
                button.removeClass('loading');
            }
        });
    });
    $(document).on('click','.vifewc-field-btn-reset', function (e) {
        let section_fields = vifewc_param.section_fields,
            fields_wrap = $('.fewc-section-fields-wrap');
        let section_id = fields_wrap.data('section_id');
        if (!section_id ||
            !vifewc_param.section_fields_default[section_id] ||
            !confirm('Changes you made may be overridden by default.')){
            return false;
        }
        section_fields[section_id] = vifewc_param.section_fields_default[section_id];
        vifewc_param.section_fields = section_fields;
        setTimeout(function (id){
            $(document.body).trigger('vifewc_checkout_fields_html', [id]);
        },100, section_id);
    });
    $(document).on('click', '.vifewc-popup-close, .vifewc-overlay:not(.vifewc-overlay-loading)', function (e) {
        let wrap = $(this).closest('.vifewc-popup-wrap');
        if (wrap.hasClass('vifewc-popup-wrap-show')) {
            wrap.removeClass('vifewc-popup-wrap-show').addClass('vifewc-popup-wrap-hidden');
        }
        $('.fewc-field-editing').removeClass('fewc-field-editing');
        setTimeout(function (popup){
            $(popup).remove();
        },100, wrap);
    });
    $(document).on('click', '.fewc-section-field-edit, .vifewc-field-btn-add', function (e) {
        $(this).closest('.fewc-section-field-wrap').addClass('fewc-field-editing');
        if (!$('.vifewc-popup-wrap-field-info').length){
            $(document).trigger('vifewc_popup_checkout_field_html');
        }
    });
    $(document).on('click','.fewc-section-field-enable, .fewc-section-field-disable', function (e) {
        $(this).closest('.fewc-section-field-wrap').addClass('fewc-field-editing');
        let section_id = $('.fewc-section-fields-wrap').data('section_id'),
            field_id =  $('.fewc-field-editing').data('id'),
            fields = vifewc_param.section_fields;
        if (!section_id || !field_id ){
            $(document.body).trigger('villatheme_show_message', ['Can not change field data', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        let data = fields[section_id][field_id] || {};
        $('.fewc-field-editing').removeClass('fewc-section-field-wrap-enable');
        if ($(this).hasClass('fewc-section-field-enable')){
            data['enable'] = '';
            $('.fewc-field-editing').find('.fewc-section-field-disable').removeClass('vifewc-hidden');
            $('.fewc-field-editing').find('.fewc-section-field-enable').addClass('vifewc-hidden');
        }else {
            data['enable'] = 1;
            $('.fewc-field-editing').addClass('fewc-section-field-wrap-enable');
            $('.fewc-field-editing').find('.fewc-section-field-disable').addClass('vifewc-hidden');
            $('.fewc-field-editing').find('.fewc-section-field-enable').removeClass('vifewc-hidden');
        }
        fields[section_id][field_id] = data;
        vifewc_param.section_fields = fields;
        $('.fewc-field-editing').removeClass('fewc-field-editing');
    });
    $(document).on('click','.fewc-section-field-clone', function (e) {
        let section_fields = vifewc_param.section_fields,
            fields_wrap = $('.fewc-section-fields-wrap'),
            field_wrap = $(this).closest('.fewc-section-field-wrap');
        let section_id = fields_wrap.data('section_id'),
            field_id = field_wrap.data('id'),
            new_field = field_wrap.clone(),
            now = Date.now(),
            fields = section_fields[section_id] || {};
        let new_id = section_id + '_' + Date.now();
        let new_data = {...(fields[field_id] || {})};
        let old_label = new_data['label'] || new_data['meta_key'].replace(section_id+'_','')|| field_id;
        new_data['label'] = 'Copy of ' + old_label;
        new_data['meta_key'] = section_id + '_' +new_data['type'] + '_'+ now;
        new_field.data({id: new_id, data: new_data});
        new_field.find('.fewc-section-field-label').html(new_data['label']);
        new_field.find('.fewc-section-field-type').html(new_data['type']);
        new_field.find('.fewc-section-field-id').html(new_data['meta_key']);
        if (new_data['enable'] && new_data['required']){
            new_field.find('.fewc-section-field-id').append('<span>&nbsp;<abbr class="required">*</abbr></span>');
        }
        field_wrap.after(new_field);
        fields[new_id]=new_data;
        vifewc_param.section_fields[section_id]= fields;
        setTimeout(function (){
            $(document.body).trigger('vifewc_checkout_fields_sortable');
        },100);
    });
    $(document).on('click','.fewc-section-field-remove', function (e) {
        if (!confirm(vifewc_param.i18n.field_remove)){
            return false;
        }
        let section_fields = vifewc_param.section_fields,
            fields_wrap = $('.fewc-section-fields-wrap'),
            field_wrap = $(this).closest('.fewc-section-field-wrap');
        let section_id = fields_wrap.data('section_id'),
            field_id = field_wrap.data('id'),
            fields = section_fields[section_id] || {};
        let fields_default = vifewc_param.section_fields_default[section_id] || {};
        if (!section_id  || !field_id || typeof fields_default[field_id] !== "undefined" || typeof fields[field_id] === "undefined"){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_remove_field, ['error', 'edit-field'], '', false, 4500]);
            return false;
        }
        field_wrap.remove();
        delete fields[field_id];
        vifewc_param.section_fields[section_id]= fields;
        setTimeout(function (){
            $(document.body).trigger('vifewc_checkout_fields_sortable');
        },100);
    });
    $(document).on('click', '.fewc-edit-field-bt-save:not(.loading)', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let wrap = $(this).closest('.vifewc-popup-wrap');
        let section_id = wrap.find('.vifewc-edit-field-section-id').val(),
            field_id = wrap.find('.vifewc-edit-field-id').val();
        if (!section_id || !field_id ){
            $(document.body).trigger('villatheme_show_message', ['Can not save field data', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        if (wrap.find('.vifewc-warning-wrap:not(.vifewc-edit-field-option-value):not(.vifewc-edit-field-option-label)').length ){
            $(document.body).trigger('villatheme_show_message', ['Please insert all valid information.', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        let save_as = wrap.find('.vifewc-edit-field-save_as').dropdown('get value'),
            meta_key = wrap.find('.vifewc-edit-field-meta_key').val()|| '';
        if(save_as.length && !meta_key){
            $(document.body).trigger('villatheme_show_message', ['Meta key name can not be empty.', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        $(this).addClass('loading');
        let fields = vifewc_param.section_fields;
        if (!fields[section_id]){
            fields[section_id] ={};
        }
        let data = fields[section_id][field_id] || {};
        data['maxlength'] = '';
        data['max'] = '';
        data['min'] = '';
        data['step'] = '';
        data['save_as'] = save_as;
        data['meta_key'] = meta_key;
        wrap.find('input, select, textarea').each(function (k, v){
            let name = $(v).attr('name');
            if (!name || ['save_as','meta_key'].includes(name)){
                return true;
            }
            if ($(v).is('select')){
                data[name] = name === 'validate' ? [$(v).closest('.dropdown').dropdown('get value')] : $(v).closest('.dropdown').dropdown('get value');
                if (name === 'type' && data[name] ==='datetime'){
                    data[name] = $('.vifewc-edit-field-time-type').dropdown('get value');
                }
            }else if(['class','label_class','input_class'].includes(name)){
                if ($(v).val()) {
                    data[name] = $(v).val().split(',');
                }
            }else {
                data[name] = $(v).val() || '';
            }
        });
        if (['checkbox_group', 'select','radio'].includes(data['type'])){
            let temp={},temp1={},temp2={}, error, default_value = data['type'] === 'checkbox_group'? []:'';
            wrap.find('.vifewc-edit-field-option-wrap .vifewc-warning-wrap').removeClass('vifewc-warning-wrap');
            wrap.find('.vifewc-edit-field-option-wrap').each(function (k,v){
                let option_value = $(v).find('.vifewc-edit-field-option-value').val(),
                    option_label = $(v).find('.vifewc-edit-field-option-label').val();
                if (!option_value && (data['type'] ==='checkbox_group' || typeof temp[option_value] !== "undefined")){
                    $(v).find('.vifewc-edit-field-option-value').addClass('vifewc-warning-wrap');
                    error =vifewc_param.i18n.error_option_value_empty;
                    return false;
                }
                if (option_value.indexOf(' ') > -1 || option_value.indexOf('"') > -1|| option_value.indexOf("'") > -1){
                    $(v).find('.vifewc-edit-field-option-value').addClass('vifewc-warning-wrap');
                    error =vifewc_param.i18n.error_option_value_invalid;
                    return false;
                }
                if (temp[option_value]){
                    $(v).find('.vifewc-edit-field-option-value').addClass('vifewc-warning-wrap');
                    error = vifewc_param.i18n.error_option_value_unique;
                    return false;
                }
                if (!option_label){
                    $(v).find('.vifewc-edit-field-option-label').addClass('vifewc-warning-wrap');
                    error = vifewc_param.i18n.error_option_label_empty;
                    return false;
                }
                temp2[k] = option_value;
                temp[option_value] = option_label;
                if ($(v).find('.vifewc-edit-field-option-checkbox').prop('checked')){
                    if (typeof default_value === "object"){
                        default_value.push(option_value);
                    }else {
                        default_value = option_value;
                    }
                }
                temp1[option_value] = {
                    value:option_value,
                    label:option_label,
                    is_selected: $(v).find('.vifewc-edit-field-option-checkbox').prop('checked') ? 1: ''
                }
            });
            if (error){
                $(document.body).trigger('villatheme_show_message', [error, ['error', 'edit-field'], '', false, 4500]);
                $(this).removeClass('loading');
                return false;
            }
            data['options'] = temp;
            data['vifewc_options'] = temp1;
            data['vifewc_options_id'] = temp2;
            data['default'] = default_value;
        }
        if (fields[section_id][field_id]){
            fields[section_id][field_id] = data;
            vifewc_param.section_fields = fields;
            $('.fewc-field-editing').removeClass('fewc-section-field-wrap-enable').data('data', data);
            if (data['enable'] ){
                $('.fewc-field-editing').addClass('fewc-section-field-wrap-enable');
                $('.fewc-field-editing').find('.fewc-section-field-disable').addClass('vifewc-hidden');
                $('.fewc-field-editing').find('.fewc-section-field-enable').removeClass('vifewc-hidden');
            }else {
                $('.fewc-field-editing').find('.fewc-section-field-disable').removeClass('vifewc-hidden');
                $('.fewc-field-editing').find('.fewc-section-field-enable').addClass('vifewc-hidden');
            }
            $('.fewc-field-editing').find('.fewc-section-field-label').html(data['label'] || meta_key.replace(section_id+'_',''));
            $('.fewc-field-editing').find('.fewc-section-field-type').html(data['type']);
            $('.fewc-field-editing').find('.fewc-section-field-id').find('span').remove();
            if (data['enable'] && data['required']){
                $('.fewc-field-editing').find('.fewc-section-field-id').append('<span>&nbsp;<abbr class="required">*</abbr></span>');
            }
        }else {
            if (meta_key === section_id+'_'){
                meta_key += data['type']+'_'+ field_id.replace(meta_key,'');
            }
            data['meta_key'] = meta_key;
            fields[section_id][field_id] = data;
            vifewc_param.section_fields = fields;
            let html =`
            <tr class="fewc-section-field-wrap${(data['enable'] ? ' fewc-section-field-wrap-enable' :'')}">
                <td class="sort"><i class="dashicons dashicons-menu"></i></td>
                <td class="fewc-section-field-id">${data['meta_key']}<span>${(data['required'] ? '&nbsp;<abbr class="required">*</abbr>' :'')}</span></td>
                <td class="fewc-section-field-label">${(data['label'] || meta_key.replace(section_id+'_',''))}</td>
                <td class="fewc-section-field-type">${data['type']}</td>
                <td class="fewc-section-field-action">
                    <span class="fewc-section-field-edit" title="${vifewc_param.i18n.edit}"><i class="vi-ui icon edit outline"></i></span>
                    <span class="fewc-section-field-clone" title="${vifewc_param.i18n.clone}"><i class="vi-ui icon clone outline"></i></span>
                    <span class="fewc-section-field-remove" title="${vifewc_param.i18n.remove}"><i class="vi-ui icon trash alternate outline"></i></span>
                    <span class="fewc-section-field-enable${(!data['enable'] ? ' vifewc-hidden' :'')}" title="${vifewc_param.i18n.disable}"><i class="dashicons dashicons-visibility"></i></span>
                    <span class="fewc-section-field-disable${(data['enable'] ? ' vifewc-hidden' :'')}" title="${vifewc_param.i18n.enable}"><i class="dashicons dashicons-hidden"></i></span>
                </td>
            </tr>`;
            html = $(html);
            html.data({id: field_id, data : data});
            $('.fewc-section-fields-sort').append(html);
            $(document).trigger('vifewc_checkout_fields_sortable');
        }
        setTimeout(function (){
            $('.vifewc-popup-close').trigger('click');
        },100);
    });
    $(document).on('vifewc_popup_checkout_field_validation_min_max', function (e){
        $('.vifewc-edit-field-type-info-wrap [name="min"], .vifewc-edit-field-type-info-wrap [name="max"], .vifewc-edit-field-type-info-wrap [name="default"]').removeClass('vifewc-warning-wrap');
        let min = $('.vifewc-edit-field-type-info-wrap [name="min"]').val() ?? '',
            max = $('.vifewc-edit-field-type-info-wrap [name="max"]').val() ?? '',
            val = $('.vifewc-edit-field-type-info-wrap [name="default"]').val() ?? '';
        if ($('.vifewc-edit-field-type').dropdown('get value') === 'number'){
            min = min ? parseFloat(min) : min;
            max = max ? parseFloat(max) : max;
            val = val ? parseFloat(val) : val;
        }
        if (val && min && val < min ){
            $('.vifewc-edit-field-type-info-wrap [name="min"], .vifewc-edit-field-type-info-wrap [name="default"]').addClass('vifewc-warning-wrap');
            $(document.body).trigger('villatheme_show_message', ['Default Value must be greater or equal than Minimum Value', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        if (val && max && val > max ){
            $(' .vifewc-edit-field-type-info-wrap [name="max"], .vifewc-edit-field-type-info-wrap [name="default"]').addClass('vifewc-warning-wrap');
            $(document.body).trigger('villatheme_show_message', ['Default Value must be less or equal than Maximum Value', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
        if (min && max && min > max ){
            $('.vifewc-edit-field-type-info-wrap [name="min"], .vifewc-edit-field-type-info-wrap [name="max"]').addClass('vifewc-warning-wrap');
            $(document.body).trigger('villatheme_show_message', ['Minimum Value must be less or equal than Maximum Value', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
    });
    $(document).on('change','.vifewc-edit-field-type-info-wrap [name="min"], .vifewc-edit-field-type-info-wrap [name="max"], .vifewc-edit-field-type-info-wrap [name="default"]',function (e){
        $(document).trigger('vifewc_popup_checkout_field_validation_min_max');
    });
    $(document).on('change','.vifewc-edit-field-type-info-wrap [name="step"]',function (e){
        $(this).removeClass('vifewc-warning-wrap');
        if ($(this).val() < 1 ){
            $(this).addClass('vifewc-warning-wrap');
            $(document.body).trigger('villatheme_show_message', ['Step must be greater or equal than 1', ['error', 'save-field'], '', false, 4500]);
            return false;
        }
    });
    $(document).on('change','.vifewc-edit-field-option-checkbox',function (e){
        if ($('.vifewc-edit-field-type').dropdown('get value') === 'checkbox_group'){
            return false;
        }
        let options = $(this).closest('.vifewc-edit-field-options-wrap');
        $(this).addClass('vifewc-edit-field-option-checkbox1');
        options.find('.vifewc-edit-field-option-checkbox:not(.vifewc-edit-field-option-checkbox1)').prop('checked', false);
        $(this).removeClass('vifewc-edit-field-option-checkbox1');
    });
    $(document).on('click','.vifewc-edit-field-option-clone',function (e){
        let option = $(this).closest('.vifewc-edit-field-option-wrap');
        if (!option.find('.vifewc-edit-field-option-value').val() && $('.vifewc-popup-wrap-field-info .vifewc-edit-field-option-wrap').index(option) > 0){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_option_value_empty, ['error', 'edit-field'], '', false, 4500]);
            return false;
        }
        if (!option.find('.vifewc-edit-field-option-label').val()){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_option_label_empty, ['error', 'edit-field'], '', false, 4500]);
            return false;
        }
        let newoption = option.clone();
        newoption.find('input').val('');
        newoption.find('input.vifewc-edit-field-option-checkbox').prop('checked', false);
        option.after(newoption);
    });
    $(document).on('click','.vifewc-edit-field-option-remove',function (e){
        if ($('.vifewc-edit-field-option-wrap').length === 1){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_remove_last_item, ['error', 'edit-field'], '', false, 4500]);
            return false;
        }
        if (confirm(vifewc_param.i18n.field_option_remove)){
            $(this).closest('.vifewc-edit-field-option-wrap').remove();
        }
    });
    $(document).on('vifewc_popup_checkout_field_type_html', function (e,type, html_type, id, data){
        if (!type){
            return false;
        }
        let html = '';
        switch (type){
            case 'email':
            case 'tel':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'number':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_step}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="step" class="vifewc-edit-field-min" min="1" value="${(data['step']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_minvalue}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="min" class="vifewc-edit-field-min" value="${(data['min']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_maxvalue}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="max" class="vifewc-edit-field-max" value="${(data['max']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'text':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_minlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_maxlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'textarea':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<textarea name="placeholder" class="vifewc-edit-field-placeholder" cols="30" rows="5">${(data['placeholder']||'')}</textarea>`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<textarea name="default" class="vifewc-edit-field-default" cols="30" rows="5">${(data['default']||'')}</textarea>`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_minlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_maxlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'checkbox':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_checked_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<div class="vi-ui toggle checkbox">`;
                html += `<input type="hidden" name="default" class="vifewc-edit-field-default" value="${data['default']||''}">`;
                html += `<input type="checkbox" class="vifewc-edit-field-default-checkbox vifewc-customize-checkbox" ${(data['default']?'checked':'')}><label></label></div>`;
                html += '</div></div></div>';
                break;
            case 'checkbox_group':
            case 'select':
            case 'radio':
                if (type !== 'select') {
                    let checkboxgroup_style = data['checkboxgroup_style'] || 'vertical';
                    html += `<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">`;
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_checkboxgroup_style}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<select class="vifewc-edit-field-checkboxgroup_style vi-ui fluid dropdown" name=checkboxgroup_style>`;
                    $.each(vifewc_param.checkboxgroup_style, function (k, v) {
                        html += `<option value="${k}" ${checkboxgroup_style === k ? ' selected ' :''}>${v}</option>`;
                    });
                    html += '</select>';
                    html += '</div></div></div>';
                }
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-vertical vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_options}</div>`;
                html += '<div class="vifewc-popup-content-value vifewc-popup-content-field-options">';
                html += '<div class="vifewc-edit-field-options-wrap">';
                let options_id = data['vifewc_options_id']||{};
                let options = data['vifewc_options']||{};
                let selected_tooltip = type ==='checkbox_group' ? vifewc_param.i18n.field_title_checked_default: vifewc_param.i18n.field_title_selected_default;
                if (Object.keys(options).length){
                    let has_selected = false;
                    $.each(options_id,function (k,v) {
                        let id = v, option_data = options[v];
                        let is_selected = option_data['is_selected'] ? 'checked':'';
                        if (type !== 'checkbox_group' & has_selected && is_selected){
                            is_selected =  '';
                        }
                        if (is_selected){
                            has_selected = true;
                        }
                        html +='<div class="vifewc-edit-field-option-wrap">';
                        html +='<span class="vifewc-edit-field-option-action vifewc-edit-field-option-move"><i class="expand arrows alternate icon"></i></span>';
                        html +='<div class="vifewc-edit-field-option-container">';
                        html +='<div class="vifewc-edit-field-option-value-wrap">';
                        html += `<input type="text" class="vifewc-edit-field-option-value" value="${id}" placeholder="${vifewc_param.i18n.field_title_option_value}">`;
                        html +='</div>';
                        html +='<div class="vifewc-edit-field-option-label-wrap">';
                        html += `<input type="text" class="vifewc-edit-field-option-label" value="${option_data['label']||''}" placeholder="${vifewc_param.i18n.field_title_option_label}">`;
                        html +='</div>';
                        html +='<div class="vifewc-edit-field-option-checkbox-wrap">';
                        html += `<input type="checkbox" class="vifewc-edit-field-option-checkbox" ${is_selected ? 'checked' : ''} title='${selected_tooltip}'>`;
                        html +='</div>';
                        html +='</div>';
                        html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-clone" title="${vifewc_param.i18n.clone}"><i class="clone icon"></i></span>`;
                        html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-remove" title="${vifewc_param.i18n.remove}"><i class="times icon"></i></span>`;
                        html +='</div>';
                    });
                }else {
                    html +='<div class="vifewc-edit-field-option-wrap">';
                    html +='<span class="vifewc-edit-field-option-action vifewc-edit-field-option-move"><i class="expand arrows alternate icon"></i></span>';
                    html +='<div class="vifewc-edit-field-option-container">';
                    html +='<div class="vifewc-edit-field-option-value-wrap">';
                    html += `<input type="text" class="vifewc-edit-field-option-value" value="" placeholder="${vifewc_param.i18n.field_title_option_value}">`;
                    html +='</div>';
                    html +='<div class="vifewc-edit-field-option-label-wrap">';
                    html += `<input type="text" class="vifewc-edit-field-option-label" placeholder="${vifewc_param.i18n.field_title_option_label}">`;
                    html +='</div>';
                    html +='<div class="vifewc-edit-field-option-checkbox-wrap">';
                    html += `<input type="checkbox" class="vifewc-edit-field-option-checkbox" title='${selected_tooltip}'>`;
                    html +='</div>';
                    html +='</div>';
                    html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-clone" title="${vifewc_param.i18n.clone}"><i class="clone icon"></i></span>`;
                    html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-remove" title="${vifewc_param.i18n.remove}"><i class="times icon"></i></span>`;
                    html +='</div>';
                }
                html += '</div>';
                html += '</div></div></div>';
                break;
            case 'datetime-local':
            case 'time':
            case 'date':
            case 'week':
            case 'month':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="${type}" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_minvalue}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="${type}" name="min" class="vifewc-edit-field-min" value="${(data['min']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_maxvalue}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="${type}" name="max" class="vifewc-edit-field-max" value="${(data['max']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'hidden':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'password':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_minlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_maxlength}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'url':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                html += '</div></div></div>';
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_default}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                html += '</div></div></div>';
                break;
            case 'html':
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_content}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<textarea name="default" class="vifewc-edit-field-default" cols="30" rows="10">${(data['default']||'')}</textarea>`;
                html += '</div></div></div>';
                break;
        }
        if (!['html','hidden'].includes(type)){
            html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_desc}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<textarea name="description" cols="30" rows="10" class="vifewc-edit-field-description">${(data['description']||'')}</textarea>`;
            html += '</div></div></div>';
        }
        $('.vifewc-edit-field-type-info-wrap').addClass('vifewc-edit-field-type-info-wrap-old');
        if (html){
            html = $(html);
            html.find('.vi-ui.dropdown').dropdown();
            html.find('.vifewc-edit-field-options-wrap').sortable({
                connectWith: ".vifewc-edit-field-option-wrap" ,
                handle: ".vifewc-edit-field-option-move",
                placeholder: "vifewc-placeholder",
                axis: "y",
            });
            setTimeout(function (field_type_info){
                $('.vifewc-edit-field-type-wrap-wrap').after(field_type_info);
                $(document).trigger('vifewc_popup_init');
            }, 100, html);
        }
        $('.vifewc-edit-field-type-info-wrap-old').animate({'height': '0px' }, 400, 'swing', function () {
            $('.vifewc-edit-field-type-info-wrap-old').remove();
        });
    });
    $(document).on('vifewc_popup_checkout_field_html', function (){
        let section_id = $('.fewc-section-fields-wrap').data('section_id');
        if (!section_id){
            return false;
        }
        let fields_default = vifewc_param.section_fields_default[section_id] || {},
            field_id = $('.fewc-field-editing').data('id') || section_id +'_'+Date.now(),
            field_data = $('.fewc-field-editing').data('data') || {};
        let type = field_data['type'] ?? 'text',
            enable = field_data['enable'] ?? 1,
            required =field_data['required'] ?? '',
            html_type = field_data['html_type'] ?? '',
            is_custom_field = typeof fields_default[field_id] === "undefined" ? 1 : '',
            display_in =field_data['display_in'] ?? (['html','hidden','password'].includes(type) ?[] : Object.keys(vifewc_param.fields_display_in)),
            save_as =field_data['save_as'] ?? ['order_meta'],
            wrap_class =field_data['class'] ?? ['form-row-wide'],
            label_class =field_data['label_class'] ?? [],
            input_class =field_data['input_class'] ?? [],
            not_required =['html','hidden' ];
        required = required ? 1: '';
        wrap_class = wrap_class.join(',');
        label_class = label_class.join(',');
        input_class = input_class.join(',');
        let html = `<div class="vifewc-popup-wrap vifewc-popup-wrap-field-info">
        <div class="vifewc-popup">
            <div class="vifewc-overlay vifewc-overlay-loading"></div>
            <div class="vifewc-overlay"></div>
            <div class="vifewc-popup-container-wrap">
                <span class="vifewc-popup-close">&#43;</span>
                <div class="vifewc-popup-container">
                    <div class="vifewc-popup-header-wrap">${vifewc_param.i18n.field_info_title}</div>
                    <div class="vifewc-popup-content-wrap">
                        <div class="vi-ui fluid accordion">
                            <div class="title active"><i class="dropdown icon"></i>${vifewc_param.i18n.field_general_title}</div>
                            <div class="content active vifewc-popup-content-general-wrap">
                                <div class="vifewc-popup-content-container">
                                    <div class="vifewc-popup-content">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_enable}</div>
                                            <div class="vifewc-popup-content-value">
                                                <div class="vi-ui toggle checkbox">
                                                    <input type="hidden" name="enable" class="vifewc-edit-field-enable" value="${enable}">
                                                    <input type="checkbox" class="vifewc-edit-field-enable-checkbox vifewc-customize-checkbox" ${(enable ? 'checked' : '')}><label></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="vifewc-popup-content vifewc-edit-field-required-wrap${(not_required.includes(type)? ' vifewc-hidden': '')}">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_required}</div>
                                            <div class="vifewc-popup-content-value">
                                                <div class="vi-ui toggle checkbox">
                                                <input type="hidden" name="required" class="vifewc-edit-field-required" value="${required}">
                                                <input type="checkbox" class="vifewc-edit-field-required-checkbox vifewc-customize-checkbox" ${(required ? 'checked' : '')}><label></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="vifewc-popup-content vifewc-edit-field-label-wrap">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_label}</div>
                                            <div class="vifewc-popup-content-value">
                                                <input type="hidden" class="vifewc-edit-field-section-id" value="${section_id}">
                                                <input type="hidden" class="vifewc-edit-field-id" value="${field_id}">
                                                <input type="hidden" name="is_custom" class="vifewc-edit-field-is_custom" value="${is_custom_field}">
                                                <input type="text" name="label" class="vifewc-edit-field-label" value="${(field_data['label'] || '')}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="title"><i class="dropdown icon"></i>${vifewc_param.i18n.field_design_title}</div>
                            <div class="content vifewc-popup-content-design-wrap">
                                <div class="vifewc-popup-content-container">
                                    <div class="vifewc-popup-content vifewc-popup-content-desc">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row" title='${vifewc_param.i18n.wrap_class_desc}'>
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_class}<span class="vifewc-popup-content-tooltip"><i class="icon question circle outline"></i></span></div>
                                            <div class="vifewc-popup-content-value">
                                                <input type="text" name="class" class="vifewc-edit-field-class" value="${(wrap_class)}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="vifewc-popup-content vifewc-edit-field-label_class-wrap${(type === 'html' ? ' vifewc-hidden': '')}">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_label_class}</div>
                                            <div class="vifewc-popup-content-value">
                                                <input type="text" name="label_class" class="vifewc-edit-field-label_class" value="${(label_class)}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="vifewc-popup-content vifewc-edit-field-input_class-wrap${(type === 'html' ? ' vifewc-hidden': '')}">
                                        <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                            <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_input_class}</div>
                                            <div class="vifewc-popup-content-value">
                                                <input type="text" name="input_class" class="vifewc-edit-field-input_class" value="${(input_class)}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vifewc-popup-footer-wrap">
                        <span class="vi-ui button mini primary vifewc-popup-bt fewc-edit-field-bt-save">${vifewc_param.i18n.save}</span>
                    </div>
                </div>
            </div>
        </div>
        </div>`;
        let $html = $(html),tmp_html ='';
        if (is_custom_field) {
            tmp_html += `<div class="vifewc-popup-content vifewc-edit-field-type-wrap-wrap">`;
            tmp_html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            tmp_html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_type}</div>`;
            tmp_html += '<div class="vifewc-popup-content-value">';
            tmp_html += '<div class="vifewc-edit-field-type-wrap">';
            tmp_html += `<select class="vifewc-edit-field-type vi-ui fluid dropdown" name="type">`;
            $.each(vifewc_param.fields_type,function (k,v){
                tmp_html +=`<option value="${k}" ${(type === k || (typeof vifewc_param.fields_time_type[type] !=="undefined" && k === 'datetime')) ? ' selected ' :''}>${v}</option>`;
            });
            tmp_html +='</select>';
            tmp_html +='</div>';
            tmp_html += `<div class="vifewc-edit-field-html-type-wrap${(type !== 'html' ? ' vifewc-hidden': '')}">`;
            tmp_html += `<select class="vifewc-edit-field-html-type vi-ui fluid dropdown" name="html_type">`;
            $.each(vifewc_param.fields_html_type,function (k,v){
                tmp_html += `<optgroup label="${v['name']|| ''}">`;
                $.each(v['type'] || {}, function (k1, v1) {
                    tmp_html +=`<option value="${k1}" ${html_type === k1 ? ' selected ' :''}>${v1}</option>`;
                });
                tmp_html+='</optgroup>';
            });
            tmp_html +='</select>';
            tmp_html +='</div>';
            tmp_html += `<div class="vifewc-edit-field-time-type-wrap${(typeof vifewc_param.fields_time_type[type] ==="undefined" ? ' vifewc-hidden': '')}">`;
            tmp_html += `<select class="vifewc-edit-field-time-type vi-ui fluid dropdown" name="time_type">`;
            $.each(vifewc_param.fields_time_type,function (k,v){
                tmp_html +=`<option value="${k}" ${type === k  ? ' selected ' :''}>${v}</option>`;
            });
            tmp_html +='</select>';
            tmp_html +='</div>';
            tmp_html += '</div></div></div>';
            $(document).trigger('vifewc_popup_checkout_field_type_html', [type,html_type, field_id, field_data]);
            tmp_html += `<div class="vifewc-popup-content vifewc-edit-field-validate-wrap${(['email','tel','number','text','url'].includes(type) ? '': ' vifewc-hidden')}">`;
            tmp_html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            tmp_html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_validation}</div>`;
            tmp_html += '<div class="vifewc-popup-content-value">';
            tmp_html += `<select class="vifewc-edit-field-validate vi-ui fluid dropdown" name="validate">`;
            $.each(vifewc_param.field_validate, function (k, v) {
                tmp_html += `<option value="${k}" >${v}</option>`;
            });
            tmp_html += '</select>';
            tmp_html += '</div></div></div>';
        }else if (!['country','state'].includes(type)){
            tmp_html =`<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">
                                <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                   <div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_placeholder}</div>
                                   <div class="vifewc-popup-content-value">
                                     <input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(field_data['placeholder']||'')}">
                                   </div>
                                </div>
                            </div>`;
        }
        $html.find('.vifewc-popup-content-general-wrap .vifewc-popup-content-container').append(tmp_html);
        if (is_custom_field) {
            tmp_html ='';
            tmp_html += `<div class="title"><i class="dropdown icon"></i>${vifewc_param.i18n.field_data_title}</div>`;
            tmp_html += '<div class="content"><div class="vifewc-popup-content-container">';
            tmp_html += `<div class="vifewc-popup-content vifewc-edit-field-save_as-wrap${(not_required.includes(type) ? ' vifewc-hidden' : '')}">`;
            tmp_html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            tmp_html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_save_as}</div>`;
            tmp_html += '<div class="vifewc-popup-content-value">';
            tmp_html += `<select class="vifewc-edit-field-save_as vi-ui fluid dropdown" multiple name=save_as>`;
            $.each(vifewc_param.field_as_meta, function (k, v) {
                tmp_html += `<option value="${k}" >${v}</option>`;
            });
            tmp_html += '</select>';
            tmp_html += '</div></div></div>';
            tmp_html += `<div class="vifewc-popup-content vifewc-edit-field-save_as-wrap vifewc-edit-field-meta_key-wrap${(not_required.includes(type) || !save_as.length ? ' vifewc-hidden' : '')}">`;
            tmp_html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            tmp_html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_meta_key}<span class="vifewc-popup-content-tooltip" title='${vifewc_param.i18n.meta_key_desc}'><i class="icon question circle outline"></i></span></div>`;
            tmp_html += '<div class="vifewc-popup-content-value">';
            tmp_html += `<input type="text" name="meta_key" class="vifewc-edit-field-meta_key" value="${field_data['meta_key']  ?? section_id+'_'}">`;
            tmp_html += '</div></div></div>';
            tmp_html += `<div class="vifewc-popup-content vifewc-edit-field-display_in-wrap${(not_required.includes(type) || !save_as.length ? ' vifewc-hidden' : '')}">`;
            tmp_html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            tmp_html += `<div class="vifewc-popup-content-title">${vifewc_param.i18n.field_title_display}</div>`;
            tmp_html += '<div class="vifewc-popup-content-value">';
            tmp_html += `<select class="vifewc-edit-field-display_in vi-ui fluid dropdown" multiple name="display_in">`;
            $.each(vifewc_param.fields_display_in, function (k, v) {
                tmp_html += `<option value="${k}" >${v}</option>`;
            });
            tmp_html += '</select>';
            tmp_html += '</div></div></div>';
            tmp_html += '</div></div>';
            $html.find('.accordion').append(tmp_html);
        }
        $html.find('.vifewc-edit-field-type').addClass('vifewc-dropdown-init').dropdown({
            onChange:function (val){
                console.log(val)
                if (['email','tel','number','text','url'].includes(val)){
                    $html.find('.vifewc-edit-field-validate-wrap').removeClass('vifewc-hidden');
                    $('.vifewc-edit-field-default').val(null);
                    $('.vi-ui.dropdown.vifewc-edit-field-validate').dropdown('set exactly',val ==='tel' ? 'phone' : val );
                }else {
                    $html.find('.vifewc-edit-field-validate-wrap').addClass('vifewc-hidden');
                    $('.vi-ui.dropdown.vifewc-edit-field-validate').dropdown('set exactly','');
                }
                if (not_required.includes(val)){
                    if (val === 'html') {
                        $html.find('.vifewc-edit-field-html-type-wrap').removeClass('vifewc-hidden');
                    }else {
                        $html.find('.vifewc-edit-field-html-type-wrap').addClass('vifewc-hidden');
                    }
                    $html.find('.vifewc-edit-field-time-type-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-input_class-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-label_class-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-required-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-save_as-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                }else {
                    $html.find('.vifewc-edit-field-html-type-wrap').addClass('vifewc-hidden');
                    if (val === 'datetime') {
                        val = $html.find('.vifewc-edit-field-time-type').dropdown('get value') || 'datetime-local';
                        $html.find('.vifewc-edit-field-time-type-wrap').removeClass('vifewc-hidden');
                    }else {
                        $html.find('.vifewc-edit-field-time-type-wrap').addClass('vifewc-hidden');
                    }
                    $html.find('.vifewc-edit-field-required-wrap').removeClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-save_as-wrap').removeClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-input_class-wrap').removeClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-label_class-wrap').removeClass('vifewc-hidden');
                    if ( !$html.find('.vifewc-edit-field-save_as').dropdown('get value').length){
                        $html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                        $html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                    }else {
                        $html.find('.vifewc-edit-field-meta_key-wrap').removeClass('vifewc-hidden');
                        $html.find('.vifewc-edit-field-display_in-wrap').removeClass('vifewc-hidden');
                    }
                }
                let display_in1;
                if (['$html','hidden','password'].includes(val)){
                    display_in1 = [];
                }else {
                    display_in1 = field_data['display_in'] ??  Object.keys(vifewc_param.fields_display_in);
                }
                $html.find('.vifewc-edit-field-display_in').off().dropdown('set exactly', display_in1);
                $(document.body).trigger('vifewc_popup_checkout_field_type_html',
                    [val, val === 'html' ? $html.find('.vifewc-edit-field-html-type').dropdown('get value'):'', field_id, field_data]);
            }
        });
        $html.find('.vifewc-edit-field-html-type').addClass('vifewc-dropdown-init').dropdown({
            onChange:function (val){
                $(document.body).trigger('vifewc_popup_checkout_field_type_html', ['html', val, field_id, field_data]);
            }
        });
        $html.find('.vifewc-edit-field-time-type').addClass('vifewc-dropdown-init').dropdown({
            onChange:function (val){
                $(document.body).trigger('vifewc_popup_checkout_field_type_html', [val, '', field_id, field_data]);
            }
        });
        $html.find('.vifewc-edit-field-save_as-wrap:not(.vifewc-hidden) .vifewc-edit-field-save_as').addClass('vifewc-dropdown-init').dropdown({
            onChange:function (val){
                if (val && val.length){
                    $html.find('.vifewc-edit-field-meta_key-wrap').removeClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-display_in-wrap').removeClass('vifewc-hidden');
                }else {
                    $html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                    $html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                }
            }
        });
        $('body').append($html);
        setTimeout(function (){
            $(document).trigger('vifewc_popup_init');
            let $popup = $('.vifewc-popup-wrap-field-info');
            $popup.find('.vi-ui.dropdown.selection').has('optgroup').each(function () {
                let $menu = $('<div/>').addClass('menu');
                $(this).find('optgroup').each(function () {
                    $menu.append("<div class=\"vifewc-dropdown-header\">" + this.label + "</div></div>");
                    return $(this).children().each(function () {
                        return $menu.append("<div class=\"item\" data-value=\"" + this.value + "\">" + this.innerHTML + "</div>");
                    });
                });
                return $(this).find('.menu').html($menu.html());
            });
            $popup.find('.vifewc-edit-field-save_as').dropdown('set selected', save_as);
            $popup.find('.vifewc-edit-field-display_in').dropdown('set selected', display_in);
            $popup.find('.vifewc-edit-field-validate').dropdown('set selected', field_data['validate'] ? (field_data['validate'][0] ||'') :'');
            $popup.removeClass('vifewc-popup-wrap-hidden').addClass('vifewc-popup-wrap-show');
        },100);
    });
    $(document).on('vifewc_checkout_fields_html', function (e, section_id=''){
        if (!section_id){
            section_id = location.hash.replace('#','');
        }
        if (!section_id || ! vifewc_param.section_fields[section_id]){
            section_id = $('.vifewc-sections-container .item.active').eq(0).data('tab')||$('.vifewc-sections-container .item').eq(0).data('tab');
        }
        if (!section_id){
            return;
        }
        $('.menu .item.active').removeClass('active');
        $('.menu .item[data-tab="'+section_id+'"]').addClass('active');
        location.hash = '#'+ section_id;
        $('.fewc-loading-btn').removeClass('vifewc-hidden');
        $('.fewc-section-fields-wrap').data('section_id', section_id);
        $('.fewc-section-fields-wrap, .vifewc-field-btn-reset').addClass('vifewc-hidden');
        $('.fewc-section-fields-sort').html('');
        let fields = vifewc_param.section_fields[section_id] || {},
            fields_default = vifewc_param.section_fields_default[section_id] || {};
        if (Object.keys(fields_default).length){
            $('.vifewc-field-btn-reset').removeClass('vifewc-hidden');
        }
        $.each(fields, function (k, v){
            let html='' , field_enable = v['enable'] ?? 1;
            html=`<tr class="fewc-section-field-wrap${(field_enable ? ' fewc-section-field-wrap-enable' :'')}">
            <td class="sort"><i class="dashicons dashicons-menu"></i></td>
            <td class="fewc-section-field-id">
            ${k}<span>${(v['required'] ? '&nbsp;<abbr class="required">*</abbr>' :'')}</span>
            </td>
            <td class="fewc-section-field-label">
            ${(v['label'] || v['meta_key'].replace(section_id+'_','')||'')}
            </td>
            <td class="fewc-section-field-type">
            ${(v['type'] || 'text')}
            </td>
            <td class="fewc-section-field-action">
            <span class="fewc-section-field-edit" title="${vifewc_param.i18n.edit}"><i class="vi-ui icon edit outline"></i></span>
            <span class="fewc-section-field-enable${(!field_enable ? ' vifewc-hidden' :'')}" title="${vifewc_param.i18n.disable}"><i class="dashicons dashicons-visibility"></i></span>
            <span class="fewc-section-field-disable${(field_enable ? ' vifewc-hidden' :'')}" title="${vifewc_param.i18n.enable}"><i class="dashicons dashicons-hidden"></i></span>
            </td>
            </tr>`;
            html = $(html);
            if (v['is_custom'] || !fields_default[k]){
                html.find('.fewc-section-field-edit').after(`
                <span class="fewc-section-field-clone" title="${vifewc_param.i18n.clone}"><i class="vi-ui icon clone outline"></i></span>
                <span class="fewc-section-field-remove" title="${vifewc_param.i18n.remove}"><i class="vi-ui icon trash alternate outline"></i></span>`);
            }
            html.addClass('fewc-section-field-wrap-'+k).data({'id': k, data : v});
            $('.fewc-section-fields-wrap table tbody').append(html);
        });
        $('.fewc-section-fields-sort').sortable({
            connectWith: ".fewc-section-field-wrap" ,
            handle: "td",
            cancel: ".fewc-section-field-action",
            placeholder: "vifewc-placeholder",
            axis: "y",
            helper: function(e, tr) {
                let $originals = tr.children();
                let $helper = tr.clone();
                $helper.children().each(function(index) {
                    $(this).width($originals.eq(index).outerWidth());
                    $(this).css({'border-bottom': '1px solid rgba(34, 36, 38, .1)'});
                });
                return $helper;
            },
            stop: function( event, ui ) {
                $(document).trigger('vifewc_checkout_fields_sortable');
            }
        });
        $('.fewc-loading-btn').addClass('vifewc-hidden');
        $('.fewc-section-fields-wrap').removeClass('vifewc-hidden');
        $(document).trigger('vifewc_after_checkout_fields_html');
    });
    $(document).on('vifewc_after_checkout_fields_html', function (){
        let url = new URL(location.href);
        let field_edit = url.searchParams.get('field_edit');
        if (!field_edit || !$('.fewc-section-field-wrap-'+field_edit).length){
            return;
        }
        url.searchParams.delete('field_edit');
        window.history.pushState({}, '', url.href);
        $('.fewc-section-field-wrap-'+field_edit).find('.fewc-section-field-edit').trigger('click');
    });
    $(document).on('vifewc_checkout_fields_sortable', function (){
        let section_fields = vifewc_param.section_fields,
            fields_wrap = $('.fewc-section-fields-wrap');
        let section_id = fields_wrap.data('section_id');
        if (!section_id ){
            return false;
        }
        let temp ={}, priority = 1;
        fields_wrap.find('.fewc-section-field-wrap').each(function (k,v){
            let field_data = $(v).data('data'),
                field_id = $(v).data('id');
            if (!field_id || !field_data || !Object.keys(field_data).length){
                return false;
            }
            field_data['priority'] = priority * 10;
            temp[field_id] = field_data;
            $(v).data('data',field_data);
            priority++;
        });
        section_fields[section_id] = temp;
        vifewc_param.section_fields = section_fields;
        $(document).trigger('vifewc_checkout_fields_after_sortable');
    });
    $(document).on('vifewc_popup_init', function (){
        $('.vi-ui.accordion:not(.vifewc-accordion-init)').addClass('vifewc-accordion-init').villatheme_accordion('refresh');
        $('.vi-ui.dropdown:not(.vifewc-dropdown-init)').addClass('vifewc-dropdown-init').dropdown();
        $('.vi-ui.checkbox:not(.vifewc-checkbox-init)').addClass('vifewc-checkbox-init').checkbox();
        $('.vifewc-color:not(.vifewc-color-init)').each(function () {
            $(this).addClass('vifewc-color-init').css({backgroundColor: $(this).val()}).unbind().minicolors({
                change: function (value, opacity) {
                    $(this).parent().find('.vifewc-color').css({backgroundColor: value});
                },
                animationSpeed: 50,
                animationEasing: 'swing',
                changeDelay: 0,
                control: 'wheel',
                defaultValue: '',
                format: 'rgb',
                hide: null,
                hideSpeed: 100,
                inline: false,
                keywords: '',
                letterCase: 'lowercase',
                opacity: true,
                position: 'bottom left',
                show: null,
                showSpeed: 100,
                theme: 'default',
                swatches: []
            });
        });
    });
});