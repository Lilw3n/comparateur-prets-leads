jQuery(document).ready(function ($) {
    'use strict';
    init();
    function init() {
        $('.vifewc-customize-checkbox:not(.vifewc-customize-checkbox-init)').each(function () {
            $(this).addClass('vifewc-customize-checkbox-init').checkbox();
            $(this).on('change', function () {
                let input = $(this).parent().find('input[type="hidden"]');
                if ($(this).prop('checked')) {
                    input.val('1');
                }else {
                    input.val('');
                }
                let setting = input.attr('data-customize-setting-link');
                if (setting){
                    wp.customize(setting).set(input.val());
                }
            });
        });
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
        if (!vifewc_preview_setting.enable && !$('.vifewc-deactivate_warning').length){
            $('.vifewc-sections-wrap').parent().prepend(`<div class="vifewc-warning vifewc-deactivate_warning">${vifewc_preview_text.deactivate_warning}</div>`);
        }
    }
    customize_init();
    function customize_init() {
        let sections=[
            'vifewc',
            'vifewc-customize-section',
            'vifewc-customize-fields',
        ];
        $.each(sections, function (k, v) {
            wp.customize.section(v, function (section) {
                section.expanded.bind(function (isExpanded) {
                    if (isExpanded) {
                        switch (v) {
                            case 'vifewc-customize-fields':
                                let id = $('.vifewc-section-editing').data('section_id') || $('.vifewc-customize-section-add_new').find('.vifewc-customize-section-content-id-value').val()||'';
                                if (id) {
                                    $(document.body).trigger('vifewc_checkout_fields_html', [id]);
                                    wp.customize.previewer.send('vifewc_open_section', id);
                                }else {
                                    $(document.body).trigger('vifewc_only_checkout_sections_html');
                                }
                                break;
                            case 'vifewc-customize-section':
                                $(document.body).trigger('vifewc_checkout_section_html',[$('.vifewc-section-editing').data('section_id') || '']);
                                break;
                            default:
                                $(document.body).trigger('vifewc_only_checkout_sections_html');
                        }
                        init();
                        let current_url = wp.customize.previewer.previewUrl.get(),
                            checkout_url = vifewc_preview_setting.checkout_url;
                        if ( current_url.indexOf(checkout_url) === -1) {
                            wp.customize.previewer.send('vifewc_set_preview_url',checkout_url);
                        }
                    }
                });
            });
        });
        wp.customize.previewer.bind('vifewc_set_preview_url', function (url) {
            if (!url){
                url = vifewc_preview_setting.checkout_url;
                wp.customize.previewer.refresh();
            }else {
                wp.customize.previewer.previewUrl.set(url);
            }
        });
        wp.customize.previewer.bind('vifewc_open_section', function (section_id='') {
            if (!section_id){
                section_id = $('.vifewc-section-editing').data('section_id') || $('.vifewc-customize-section-add_new').find('.vifewc-customize-section-content-id-value').val()||'';
            }
            if (section_id) {
                wp.customize.previewer.send('vifewc_open_section', section_id);
            }
        });
        $('.customize-section-back').on('click', function () {
            let id = $(this).parent().parent().parent().prop('id').replace('sub-accordion-section-', '');
            $('.vifewc-section-editing').removeClass('vifewc-section-editing');
            if (sections.indexOf(id) > -1 && id !=='vifewc') {
                wp.customize.section('vifewc').expanded(true);
            }
        });
    }
    edit_checkout_fields();
    function edit_checkout_fields(){
        $(document).on('click', '.vifewc-popup-close, .vifewc-overlay:not(.vifewc-overlay-loading)', function (e) {
            let wrap = $(this).closest('.vifewc-popup-wrap');
            if (wrap.hasClass('vifewc-popup-wrap-show')) {
                wrap.removeClass('vifewc-popup-wrap-show').addClass('vifewc-popup-wrap-hidden');
            }
            $('.vifewc-customize-field-editing').removeClass('vifewc-customize-field-editing');
            setTimeout(function (popup){
                $(popup).remove();
            },100, wrap);
        });
        $(document).on('click', '.vifewc-popup-wrap-field-info-bt-save:not(.loading)', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let wrap = $(this).closest('.vifewc-popup-wrap');
            let section_id = wrap.find('.vifewc-edit-field-section-id').val(),
                field_id = wrap.find('.vifewc-edit-field-id').val(),
                fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get());
            if (!section_id || !field_id ){
                $(document.body).trigger('villatheme_show_message', ['Can not save field data', ['error', 'save-field'], '', false, 4500]);
                return false;
            }
            if (wrap.find('.vifewc-warning-wrap:not(.vifewc-edit-field-option-value):not(.vifewc-edit-field-option-label)').length ){
                $(document.body).trigger('villatheme_show_message', ['Please insert all valid information.', ['error', 'save-field'], '', false, 4500]);
                return false;
            }
            if (!fields[section_id]){
                fields[section_id] ={};
            }
            let save_as = wrap.find('.vifewc-edit-field-save_as').dropdown('get value'),
                meta_key = wrap.find('.vifewc-edit-field-meta_key').val()|| '';
            if(save_as.length && !meta_key){
                $(document.body).trigger('villatheme_show_message', ['Meta key name can not be empty.', ['error', 'save-field'], '', false, 4500]);
                return false;
            }
            $(this).addClass('loading');
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
                        error =vifewc_preview_text.error_option_value_empty;
                        return false;
                    }
                    if (option_value.indexOf(' ') > -1 || option_value.indexOf('"') > -1|| option_value.indexOf("'") > -1){
                        $(v).find('.vifewc-edit-field-option-value').addClass('vifewc-warning-wrap');
                        error =vifewc_preview_text.error_option_value_invalid;
                        return false;
                    }
                    if (temp[option_value]){
                        $(v).find('.vifewc-edit-field-option-value').addClass('vifewc-warning-wrap');
                        error = vifewc_preview_text.error_option_value_unique;
                        return false;
                    }
                    if (!option_label){
                        $(v).find('.vifewc-edit-field-option-label').addClass('vifewc-warning-wrap');
                        error = vifewc_preview_text.error_option_label_empty;
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
                $('.vifewc-customize-field-editing').removeClass('vifewc-customize-field-wrap-enable').data('data', data);
                if (data['enable'] ){
                    $('.vifewc-customize-field-editing').addClass('vifewc-customize-field-wrap-enable');
                    $('.vifewc-customize-field-editing').find('.vifewc-customize-field-disable').addClass('vifewc-hidden');
                    $('.vifewc-customize-field-editing').find('.vifewc-customize-field-enable').removeClass('vifewc-hidden');
                }else {
                    $('.vifewc-customize-field-editing').find('.vifewc-customize-field-disable').removeClass('vifewc-hidden');
                    $('.vifewc-customize-field-editing').find('.vifewc-customize-field-enable').addClass('vifewc-hidden');
                }
                $('.vifewc-customize-field-editing').find('.vifewc-customize-field-title').html(data['label'] || meta_key.replace(section_id+'_',''));
                if (data['enable'] && data['required']){
                    $('.vifewc-customize-field-editing').find('.vifewc-customize-field-title').append('<span>&nbsp;<abbr class="required">*</abbr></span>');
                }
                wp.customize('vifewc_sections_params[section_fields]').set(JSON.stringify(fields));
            }else {
                if (meta_key === section_id+'_'){
                    meta_key += data['type']+'_'+ field_id.replace(meta_key,'');
                }
                data['meta_key'] = meta_key;
                fields[section_id][field_id] = data;
                let html ='';
                html +=`<div class="vifewc-customize-field-wrap${(data['enable'] ? ' vifewc-customize-field-wrap-enable' :'')}">`;
                html +='<div class="vifewc-customize-field">';
                html += `<div class="vifewc-customize-field-title">${(data['label'] || meta_key.replace(section_id+'_',''))}<span>${(data['required'] ? '&nbsp;<abbr class="required">*</abbr>' :'')}</span></div>`;
                html +='<div class="vifewc-customize-field-action">';
                html +=`<span class="vifewc-customize-field-edit" title="${vifewc_preview_text.edit}"><i class="icon edit outline"></i></span>`;
                html +=`<span class="vifewc-customize-field-clone" title="${vifewc_preview_text.clone}"><i class="icon clone outline"></i></span>`;
                html +=`<span class="vifewc-customize-field-remove" title="${vifewc_preview_text.remove}"><i class="icon trash alternate outline"></i></span>`;
                html +=`<span class="vifewc-customize-field-enable${(!data['enable'] ? ' vifewc-hidden' :'')}" title="${vifewc_preview_text.disable}"><i class="dashicons dashicons-visibility"></i></span>`;
                html +=`<span class="vifewc-customize-field-disable${(data['enable'] ? ' vifewc-hidden' :'')}" title="${vifewc_preview_text.enable}"><i class="dashicons dashicons-hidden"></i></span>`;
                html +='</div></div></div>';
                html = $(html);
                html.data({id: field_id, data : data});
                $('.vifewc-customize-fields').append(html);
                $(document.body).trigger('vifewc_checkout_fields_sortable');
            }
            setTimeout(function (){
                $('.vifewc-popup-close').trigger('click');
            },100);
        });
        $(document.body).on('vifewc_popup_checkout_field_validation_min_max', function (e){
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
            $(document.body).trigger('vifewc_popup_checkout_field_validation_min_max');
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
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_option_value_empty, ['error', 'edit-field'], '', false, 4500]);
                return false;
            }
            if (!option.find('.vifewc-edit-field-option-label').val()){
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_option_label_empty, ['error', 'edit-field'], '', false, 4500]);
                return false;
            }
            let newoption = option.clone();
            newoption.find('input').val('');
            newoption.find('input.vifewc-edit-field-option-checkbox').prop('checked', false);
            option.after(newoption);
        });
        $(document).on('click','.vifewc-edit-field-option-remove',function (e){
            if ($('.vifewc-edit-field-option-wrap').length === 1){
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_remove_last_item, ['error', 'edit-field'], '', false, 4500]);
                return false;
            }
            if (confirm(vifewc_preview_text.field_option_remove)){
                $(this).closest('.vifewc-edit-field-option-wrap').remove();
            }
        });
        $(document.body).on('vifewc_popup_checkout_field_type_html', function (e,type, html_type, id, data){
            if (!type){
                return false;
            }
            let html = '';
            switch (type){
                case 'email':
                case 'tel':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'number':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_step}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="step" class="vifewc-edit-field-min" min="1" value="${(data['step']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_minvalue}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="min" class="vifewc-edit-field-min" value="${(data['min']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_maxvalue}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="max" class="vifewc-edit-field-max" value="${(data['max']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'text':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_minlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_maxlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'textarea':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<textarea name="placeholder" class="vifewc-edit-field-placeholder" cols="30" rows="5">${(data['placeholder']||'')}</textarea>`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<textarea name="default" class="vifewc-edit-field-default" cols="30" rows="5">${(data['default']||'')}</textarea>`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_minlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_maxlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'checkbox':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_checked_default}</div>`;
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
                        html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_checkboxgroup_style}</div>`;
                        html += '<div class="vifewc-popup-content-value">';
                        html += `<select class="vifewc-edit-field-checkboxgroup_style vi-ui fluid dropdown" name=checkboxgroup_style>`;
                        $.each(vifewc_preview_setting.checkboxgroup_style, function (k, v) {
                            html += `<option value="${k}" ${checkboxgroup_style === k ? ' selected ' :''}>${v}</option>`;
                        });
                        html += '</select>';
                        html += '</div></div></div>';
                    }
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-vertical vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_options}</div>`;
                    html += '<div class="vifewc-popup-content-value vifewc-popup-content-field-options">';
                    html += '<div class="vifewc-edit-field-options-wrap">';
                    let options_id = data['vifewc_options_id']||{};
                    let options = data['vifewc_options']||{};
                    let selected_tooltip = type ==='checkbox_group' ? vifewc_preview_text.field_title_checked_default: vifewc_preview_text.field_title_selected_default;
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
                            html += `<input type="text" class="vifewc-edit-field-option-value" value="${id}" placeholder="${vifewc_preview_text.field_title_option_value}">`;
                            html +='</div>';
                            html +='<div class="vifewc-edit-field-option-label-wrap">';
                            html += `<input type="text" class="vifewc-edit-field-option-label" value="${option_data['label']||''}" placeholder="${vifewc_preview_text.field_title_option_label}">`;
                            html +='</div>';
                            html +='<div class="vifewc-edit-field-option-checkbox-wrap">';
                            html += `<input type="checkbox" class="vifewc-edit-field-option-checkbox" ${is_selected ? 'checked' : ''} title='${selected_tooltip}'>`;
                            html +='</div>';
                            html +='</div>';
                            html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-clone" title="${vifewc_preview_text.clone}"><i class="clone icon"></i></span>`;
                            html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-remove" title="${vifewc_preview_text.remove}"><i class="times icon"></i></span>`;
                            html +='</div>';
                        });
                    }else {
                        html +='<div class="vifewc-edit-field-option-wrap">';
                        html +='<span class="vifewc-edit-field-option-action vifewc-edit-field-option-move"><i class="expand arrows alternate icon"></i></span>';
                        html +='<div class="vifewc-edit-field-option-container">';
                        html +='<div class="vifewc-edit-field-option-value-wrap">';
                        html += `<input type="text" class="vifewc-edit-field-option-value" value="" placeholder="${vifewc_preview_text.field_title_option_value}">`;
                        html +='</div>';
                        html +='<div class="vifewc-edit-field-option-label-wrap">';
                        html += `<input type="text" class="vifewc-edit-field-option-label" placeholder="${vifewc_preview_text.field_title_option_label}">`;
                        html +='</div>';
                        html +='<div class="vifewc-edit-field-option-checkbox-wrap">';
                        html += `<input type="checkbox" class="vifewc-edit-field-option-checkbox" title='${selected_tooltip}'>`;
                        html +='</div>';
                        html +='</div>';
                        html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-clone" title="${vifewc_preview_text.clone}"><i class="clone icon"></i></span>`;
                        html +=`<span class="vifewc-edit-field-option-action vifewc-edit-field-option-remove" title="${vifewc_preview_text.remove}"><i class="times icon"></i></span>`;
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
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="${type}" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_minvalue}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="${type}" name="min" class="vifewc-edit-field-min" value="${(data['min']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_maxvalue}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="${type}" name="max" class="vifewc-edit-field-max" value="${(data['max']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'hidden':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'password':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_minlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="minlength" class="vifewc-edit-field-minlength" value="${(data['minlength']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_maxlength}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="number" name="maxlength" class="vifewc-edit-field-maxlength" value="${(data['maxlength']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'url':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(data['placeholder']||'')}">`;
                    html += '</div></div></div>';
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_default}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<input type="text" name="default" class="vifewc-edit-field-default" value="${(data['default']||'')}">`;
                    html += '</div></div></div>';
                    break;
                case 'html':
                    html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                    html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                    html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_content}</div>`;
                    html += '<div class="vifewc-popup-content-value">';
                    html += `<textarea name="default" class="vifewc-edit-field-default" cols="30" rows="10">${(data['default']||'')}</textarea>`;
                    html += '</div></div></div>';
                    break;
            }
            if (!['html','hidden'].includes(type)){
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_desc}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="description" class="vifewc-edit-field-description" value="${(data['description']||'')}">`;
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
                    init();
                }, 100, html);
            }
            $('.vifewc-edit-field-type-info-wrap-old').animate({'height': '0px' }, 400, 'swing', function () {
                $('.vifewc-edit-field-type-info-wrap-old').remove();
            });
        });
        $(document.body).on('vifewc_popup_checkout_field_html', function (){
            let section_id = $('.vifewc-customize-fields').data('section_id');
            if (!section_id){
                return false;
            }
            let fields_default = vifewc_preview_setting.section_fields_default[section_id] || {},
                field_id = $('.vifewc-customize-field-editing').data('id') || section_id +'_'+Date.now(),
                field_data = $('.vifewc-customize-field-editing').data('data') || {};
            wp.customize.previewer.send('vifewc_editing_field', field_id);
            let type = field_data['type'] ?? 'text',
                enable = field_data['enable'] ?? 1,
                required =field_data['required'] ?? '',
                html_type = field_data['html_type'] ?? '',
                is_custom_field = typeof fields_default[field_id] === "undefined" ? 1 : '',
                display_in =field_data['display_in'] ?? (['html','hidden','password'].includes(type) ?[] : Object.keys(vifewc_preview_setting.fields_display_in)),
                save_as =field_data['save_as'] ?? ['order_meta'],
                wrap_class =field_data['class'] ?? ['form-row-wide'],
                label_class =field_data['label_class'] ?? [],
                input_class =field_data['input_class'] ?? [],
                not_required =['html','hidden' ];
            required = required ? 1: '';
            wrap_class = wrap_class.join(',');
            label_class = label_class.join(',');
            input_class = input_class.join(',');
            let html = '<div class="vifewc-popup-wrap vifewc-popup-wrap-field-info">';
            html += '<div class="vifewc-popup"><div class="vifewc-overlay vifewc-overlay-loading"></div><div class="vifewc-overlay"></div>';
            html += '<div class="vifewc-popup-container-wrap"><span class="vifewc-popup-close">&#43;</span>';
            html += '<div class="vifewc-popup-container">';
            html += `<div class="vifewc-popup-header-wrap">${vifewc_preview_text.field_info_title}</div>`;
            html += '<div class="vifewc-popup-content-wrap">';
            html += '<div class="vi-ui fluid accordion">';
            html += `<div class="title active"><i class="dropdown icon"></i>${vifewc_preview_text.field_general_title}</div>`;
            html +='<div class="content active"><div class="vifewc-popup-content-container">';
            html += '<div class="vifewc-popup-content">';
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_enable}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<div class="vi-ui toggle checkbox">`;
            html += `<input type="hidden" name="enable" class="vifewc-edit-field-enable" value="${enable}">`;
            html += `<input type="checkbox" class="vifewc-edit-field-enable-checkbox vifewc-customize-checkbox" ${(enable ? 'checked' : '')}><label></label></div>`;
            html += '</div></div></div>';
            html += `<div class="vifewc-popup-content vifewc-edit-field-required-wrap${(not_required.includes(type)? ' vifewc-hidden': '')}">`;
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_required}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<div class="vi-ui toggle checkbox">`;
            html += `<input type="hidden" name="required" class="vifewc-edit-field-required" value="${required}">`;
            html += `<input type="checkbox" class="vifewc-edit-field-required-checkbox vifewc-customize-checkbox" ${(required ? 'checked' : '')}><label></label></div>`;
            html += '</div></div></div>';
            html += '<div class="vifewc-popup-content vifewc-edit-field-label-wrap">';
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_label}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<input type="hidden" class="vifewc-edit-field-section-id" value="${section_id}">`;
            html += `<input type="hidden" class="vifewc-edit-field-id" value="${field_id}">`;
            html += `<input type="hidden" name="is_custom" class="vifewc-edit-field-is_custom" value="${is_custom_field}">`;
            html += `<input type="text" name="label" class="vifewc-edit-field-label" value="${(field_data['label'] || '')}">`;
            html += '</div></div></div>';
            if (is_custom_field) {
                html += `<div class="vifewc-popup-content vifewc-edit-field-type-wrap-wrap">`;
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_type}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += '<div class="vifewc-edit-field-type-wrap">';
                html += `<select class="vifewc-edit-field-type vi-ui fluid dropdown" name="type">`;
                $.each(vifewc_preview_setting.fields_type,function (k,v){
                    html +=`<option value="${k}" ${(type === k || (typeof vifewc_preview_setting.fields_time_type[type] !=="undefined" && k === 'datetime')) ? ' selected ' :''}>${v}</option>`;
                });
                html +='</select>';
                html +='</div>';
                html += `<div class="vifewc-edit-field-html-type-wrap${(type !== 'html' ? ' vifewc-hidden': '')}">`;
                html += `<select class="vifewc-edit-field-html-type vi-ui fluid dropdown" name="html_type">`;
                $.each(vifewc_preview_setting.fields_html_type,function (k,v){
                    html += `<optgroup label="${v['name']|| ''}">`;
                    $.each(v['type'] || {}, function (k1, v1) {
                        html +=`<option value="${k1}" ${html_type === k1 ? ' selected ' :''}>${v1}</option>`;
                    });
                    html+='</optgroup>';
                });
                html +='</select>';
                html +='</div>';
                html += `<div class="vifewc-edit-field-time-type-wrap${(typeof vifewc_preview_setting.fields_time_type[type] ==="undefined" ? ' vifewc-hidden': '')}">`;
                html += `<select class="vifewc-edit-field-time-type vi-ui fluid dropdown" name="time_type">`;
                $.each(vifewc_preview_setting.fields_time_type,function (k,v){
                    html +=`<option value="${k}" ${type === k  ? ' selected ' :''}>${v}</option>`;
                });
                html +='</select>';
                html +='</div>';
                html += '</div></div></div>';
                $(document.body).trigger('vifewc_popup_checkout_field_type_html', [type,html_type, field_id, field_data]);
                html += `<div class="vifewc-popup-content vifewc-edit-field-validate-wrap${(['email','tel','number','text','url'].includes(type) ? '': ' vifewc-hidden')}">`;
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_validation}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<select class="vifewc-edit-field-validate vi-ui fluid dropdown" name="validate">`;
                $.each(vifewc_preview_setting.field_validate, function (k, v) {
                    html += `<option value="${k}" >${v}</option>`;
                });
                html += '</select>';
                html += '</div></div></div>';
            }else if (!['country','state'].includes(type)){
                html += '<div class="vifewc-popup-content vifewc-edit-field-type-info-wrap">';
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_placeholder}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="placeholder" class="vifewc-edit-field-placeholder" value="${(field_data['placeholder']||'')}">`;
                html += '</div></div></div>';
            }
            html +='</div></div>';
            html += `<div class="title"><i class="dropdown icon"></i>${vifewc_preview_text.field_design_title}</div>`;
            html +='<div class="content"><div class="vifewc-popup-content-container">';
            html += '<div class="vifewc-popup-content vifewc-popup-content-desc">';
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row" title='${vifewc_preview_text.wrap_class_desc}'>`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_class}<span class="vifewc-popup-content-tooltip"><i class="icon question circle outline"></i></span></div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<input type="text" name="class" class="vifewc-edit-field-class" value="${(wrap_class)}">`;
            html += '</div></div></div>';
            html += `<div class="vifewc-popup-content vifewc-edit-field-label_class-wrap${(type === 'html' ? ' vifewc-hidden': '')}">`;
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_label_class}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<input type="text" name="label_class" class="vifewc-edit-field-label_class" value="${(label_class)}">`;
            html += '</div></div></div>';
            html += `<div class="vifewc-popup-content vifewc-edit-field-input_class-wrap${(type === 'html' ? ' vifewc-hidden': '')}">`;
            html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
            html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_input_class}</div>`;
            html += '<div class="vifewc-popup-content-value">';
            html += `<input type="text" name="input_class" class="vifewc-edit-field-input_class" value="${(input_class)}">`;
            html += '</div></div></div>';
            html +='</div></div>';
            if (is_custom_field) {
                html += `<div class="title"><i class="dropdown icon"></i>${vifewc_preview_text.field_data_title}</div>`;
                html += '<div class="content"><div class="vifewc-popup-content-container">';
                html += `<div class="vifewc-popup-content vifewc-edit-field-save_as-wrap${(not_required.includes(type) ? ' vifewc-hidden' : '')}">`;
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_save_as}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<select class="vifewc-edit-field-save_as vi-ui fluid dropdown" multiple name=save_as>`;
                $.each(vifewc_preview_setting.field_as_meta, function (k, v) {
                    html += `<option value="${k}" >${v}</option>`;
                });
                html += '</select>';
                html += '</div></div></div>';
                html += `<div class="vifewc-popup-content vifewc-edit-field-save_as-wrap vifewc-edit-field-meta_key-wrap${(not_required.includes(type) || !save_as.length ? ' vifewc-hidden' : '')}">`;
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_meta_key}<span class="vifewc-popup-content-tooltip" title='${vifewc_preview_text.meta_key_desc}'><i class="icon question circle outline"></i></span></div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<input type="text" name="meta_key" class="vifewc-edit-field-meta_key" value="${field_data['meta_key']  ?? section_id+'_'}">`;
                html += '</div></div></div>';
                html += `<div class="vifewc-popup-content vifewc-edit-field-display_in-wrap${(not_required.includes(type) || !save_as.length ? ' vifewc-hidden' : '')}">`;
                html += `<div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">`;
                html += `<div class="vifewc-popup-content-title">${vifewc_preview_text.field_title_display}</div>`;
                html += '<div class="vifewc-popup-content-value">';
                html += `<select class="vifewc-edit-field-display_in vi-ui fluid dropdown" multiple name="display_in">`;
                $.each(vifewc_preview_setting.fields_display_in, function (k, v) {
                    html += `<option value="${k}" >${v}</option>`;
                });
                html += '</select>';
                html += '</div></div></div>';
                html += '</div></div>';
            }
            html += '</div></div>';
            html += '<div class="vifewc-popup-footer-wrap">';
            html +=`<span class="vifewc-button vifewc-popup-bt vifewc-popup-wrap-field-info-bt-save">${vifewc_preview_text.save}</span>`;
            html += '</div>';
            html += '</div></div></div></div>';
            html = $(html);
            html.find('.vi-ui.accordion').villatheme_accordion('refresh');
            html.find('.vi-ui.dropdown').dropdown();
            setTimeout(function (wrap){
                init();
                $(wrap).find('.vi-ui.dropdown.selection').has('optgroup').each(function () {
                    let $menu = $('<div/>').addClass('menu');
                    $(this).find('optgroup').each(function () {
                        $menu.append("<div class=\"vifewc-dropdown-header\">" + this.label + "</div></div>");
                        return $(this).children().each(function () {
                            return $menu.append("<div class=\"item\" data-value=\"" + this.value + "\">" + this.innerHTML + "</div>");
                        });
                    });
                    return $(this).find('.menu').html($menu.html());
                });
                $(wrap).find('.vifewc-edit-field-save_as').dropdown('set selected', save_as);
                $(wrap).find('.vifewc-edit-field-display_in').dropdown('set selected', display_in);
                $(wrap).find('.vifewc-edit-field-validate').dropdown('set selected', field_data['validate'] ? (field_data['validate'][0] ||'') :'');
            },100, html);
            html.find('.vifewc-edit-field-type').dropdown({
                onChange:function (val){
                    if (['email','tel','number','text','url'].includes(val)){
                        html.find('.vifewc-edit-field-validate-wrap').removeClass('vifewc-hidden');
                        $('.vifewc-edit-field-default').val(null);
                        $('.vi-ui.dropdown.vifewc-edit-field-validate').dropdown('set exactly',val ==='tel' ? 'phone' : val );
                    }else {
                        html.find('.vifewc-edit-field-validate-wrap').addClass('vifewc-hidden');
                        $('.vi-ui.dropdown.vifewc-edit-field-validate').dropdown('set exactly','');
                    }
                    if (not_required.includes(val)){
                        if (val === 'html') {
                            html.find('.vifewc-edit-field-html-type-wrap').removeClass('vifewc-hidden');
                        }else {
                            html.find('.vifewc-edit-field-html-type-wrap').addClass('vifewc-hidden');
                        }
                        html.find('.vifewc-edit-field-time-type-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-input_class-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-label_class-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-required-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-save_as-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                    }else {
                        html.find('.vifewc-edit-field-html-type-wrap').addClass('vifewc-hidden');
                        if (val === 'datetime') {
                            val = html.find('.vifewc-edit-field-time-type').dropdown('get value') || 'datetime-local';
                            html.find('.vifewc-edit-field-time-type-wrap').removeClass('vifewc-hidden');
                        }else {
                            html.find('.vifewc-edit-field-time-type-wrap').addClass('vifewc-hidden');
                        }
                        html.find('.vifewc-edit-field-required-wrap').removeClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-save_as-wrap').removeClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-input_class-wrap').removeClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-label_class-wrap').removeClass('vifewc-hidden');
                        if ( !html.find('.vifewc-edit-field-save_as').dropdown('get value').length){
                            html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                            html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                        }else {
                            html.find('.vifewc-edit-field-meta_key-wrap').removeClass('vifewc-hidden');
                            html.find('.vifewc-edit-field-display_in-wrap').removeClass('vifewc-hidden');
                        }
                    }
                    let display_in1;
                    if (['html','hidden','password'].includes(val)){
                        display_in1 = [];
                    }else {
                        display_in1 = field_data['display_in'] ??  Object.keys(vifewc_preview_setting.fields_display_in);
                    }
                    html.find('.vifewc-edit-field-display_in').off().dropdown('set exactly', display_in1);
                    $(document.body).trigger('vifewc_popup_checkout_field_type_html',
                        [val, val === 'html' ? html.find('.vifewc-edit-field-html-type').dropdown('get value'):'', field_id, field_data]);
                }
            });
            html.find('.vifewc-edit-field-html-type').dropdown({
                onChange:function (val){
                    $(document.body).trigger('vifewc_popup_checkout_field_type_html', ['html', val, field_id, field_data]);
                }
            });
            html.find('.vifewc-edit-field-time-type').dropdown({
                onChange:function (val){
                    $(document.body).trigger('vifewc_popup_checkout_field_type_html', [val, '', field_id, field_data]);
                }
            });
            html.find('.vifewc-edit-field-save_as-wrap:not(.vifewc-hidden) .vifewc-edit-field-save_as').dropdown({
                onChange:function (val){
                    if (val && val.length){
                        html.find('.vifewc-edit-field-meta_key-wrap').removeClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-display_in-wrap').removeClass('vifewc-hidden');
                    }else {
                        html.find('.vifewc-edit-field-meta_key-wrap').addClass('vifewc-hidden');
                        html.find('.vifewc-edit-field-display_in-wrap').addClass('vifewc-hidden');
                    }
                }
            });
            $('body').append(html);
            setTimeout(function (){
                $('.vifewc-popup-wrap-field-info').removeClass('vifewc-popup-wrap-hidden').addClass('vifewc-popup-wrap-show');
            },100);
        });
        $(document).on('click','.vifewc-customize-field-enable, .vifewc-customize-field-disable', function (e) {
            $(this).closest('.vifewc-customize-field-wrap').addClass('vifewc-customize-field-editing');
            let section_id = $(this).closest('.vifewc-customize-fields').data('section_id'),
                field_id = $(this).closest('.vifewc-customize-field-wrap').data('id'),
                fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get());
            if (!section_id || !field_id ){
                $(document.body).trigger('villatheme_show_message', ['Can not change field data', ['error', 'save-field'], '', false, 4500]);
                return false;
            }
            let data = fields[section_id][field_id] || {};
            if ($(this).hasClass('vifewc-customize-field-enable')){
                data['enable'] = '';
                $('.vifewc-customize-field-editing').removeClass('vifewc-customize-field-wrap-enable');
                $('.vifewc-customize-field-editing').find('.vifewc-customize-field-disable').removeClass('vifewc-hidden');
                $('.vifewc-customize-field-editing').find('.vifewc-customize-field-enable').addClass('vifewc-hidden');
            }else {
                data['enable'] = 1;
                $('.vifewc-customize-field-editing').addClass('vifewc-customize-field-wrap-enable');
                $('.vifewc-customize-field-editing').find('.vifewc-customize-field-disable').addClass('vifewc-hidden');
                $('.vifewc-customize-field-editing').find('.vifewc-customize-field-enable').removeClass('vifewc-hidden');
            }
            fields[section_id][field_id] = data;
            $('.vifewc-customize-field-editing').removeClass('vifewc-customize-field-editing');
            wp.customize('vifewc_sections_params[section_fields]').set(JSON.stringify(fields));
        });
        $(document).on('click','.vifewc-customize-field-clone', function (e) {
            let section_fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get()),
                fields_wrap = $('.vifewc-customize-fields'),
                field_wrap = $(this).closest('.vifewc-customize-field-wrap');
            let section_id = fields_wrap.data('section_id'),
                field_id = field_wrap.data('id'),
                new_field = field_wrap.clone(),
                now = Date.now(),
                fields = section_fields[section_id] || {};
            let new_id = section_id + '_' + Date.now();
            let new_data = {...(fields[field_id] || {})};
            let old_label = new_data['label'] || new_data['meta_key'].replace(section_id+'_','')|| field_id;
            new_data['label'] = 'Copy of ' + old_label;
            new_field.find('.vifewc-customize-field-title').html(new_data['label']);
            new_data['meta_key'] = section_id + '_' +new_data['type'] + '_'+ now;
            new_field.data({id: new_id, data: new_data});
            field_wrap.after(new_field);
            setTimeout(function (){
                $(document.body).trigger('vifewc_checkout_fields_sortable');
            },100);
        });
        $(document).on('click','.vifewc-customize-field-remove', function (e) {
            if (!confirm(vifewc_preview_text.field_remove)){
                return false;
            }
            let section_fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get()),
                fields_wrap = $('.vifewc-customize-fields'),
                field_wrap = $(this).closest('.vifewc-customize-field-wrap');
            let section_id = fields_wrap.data('section_id'),
                field_id = field_wrap.data('id'),
                fields = section_fields[section_id] || {};
            let fields_default = vifewc_preview_setting.section_fields_default[section_id] || {};
            if (!section_id  || !field_id || typeof fields_default[field_id] !== "undefined" || typeof fields[field_id] === "undefined"){
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_remove_field, ['error', 'edit-field'], '', false, 4500]);
                return false;
            }
            field_wrap.remove();
            setTimeout(function (){
                $(document.body).trigger('vifewc_checkout_fields_sortable');
            },100);
        });
        $(document).on('click','.vifewc-customize-field-edit, .vifewc-fields-add_new', function (e) {
            $(this).closest('.vifewc-customize-field-wrap').addClass('vifewc-customize-field-editing');
            if (!$('.vifewc-popup-wrap-field-info').length){
                $(document.body).trigger('vifewc_popup_checkout_field_html');
            }
        });
        $(document).on('click','.vifewc-fields-reset', function (e) {
            let section_fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get()),
                fields_wrap = $('.vifewc-customize-fields');
            let section_id = fields_wrap.data('section_id');
            if (!section_id ||
                !vifewc_preview_setting.section_fields_default[section_id] ||
                !confirm('Changes you made may be overridden by default.')){
                return false;
            }
            section_fields[section_id] = vifewc_preview_setting.section_fields_default[section_id];
            wp.customize('vifewc_sections_params[section_fields]').set(JSON.stringify(section_fields));
            setTimeout(function (id){
                $(document.body).trigger('vifewc_checkout_fields_html', [id]);
            },100, section_id);
        });
        $(document.body).on('vifewc_checkout_fields_sortable', function (){
            let section_fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get()),
                fields_wrap = $('.vifewc-customize-fields');
            let section_id = fields_wrap.data('section_id');
            if (!section_id ){
                return false;
            }
            let temp ={}, priority = 1;
            fields_wrap.find('.vifewc-customize-field-wrap').each(function (k,v){
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
            wp.customize('vifewc_sections_params[section_fields]').set(JSON.stringify(section_fields));
        });
        $(document.body).on('vifewc_checkout_fields_html', function (e,  section_id='') {
            if (!section_id){
                wp.customize.section('vifewc').expanded(true);
                return false;
            }
            let section_settings = JSON.parse(wp.customize('vifewc_sections_params[section_settings]').get()),
                section_fields = JSON.parse(wp.customize('vifewc_sections_params[section_fields]').get());
            let fields = section_fields[section_id] || {};
            let fields_default = vifewc_preview_setting.section_fields_default[section_id] || {};
            let section_title = $('#sub-accordion-section-vifewc-customize-fields .customize-section-title h3');
            if (section_title.data('vifewc_title')){
                section_title.html(section_title.data('vifewc_title').replace('{checkout_fields}',section_settings[section_id]['name'] || section_id));
            }else {
                section_title.data('vifewc_title',section_title.html());
                section_title.html(section_title.html().replace('{checkout_fields}',section_settings[section_id]['name'] || section_id));
            }
            $('.vifewc-customize-fields').data('section_id', section_id).html('');
            $('.vifewc-customize-fields-action .vifewc-fields-reset').remove();
            if (Object.keys(fields_default).length){
                $('.vifewc-customize-fields-action').append(`<span class="vifewc-button vifewc-fields-reset"><i class="icon redo"></i>${vifewc_preview_text.section_fields_reset}</span>`);
            }
            $.each(fields, function (k, v){
                let html ='', field_enable = v['enable'] ?? 1;
                html +=`<div class="vifewc-customize-field-wrap${(field_enable ? ' vifewc-customize-field-wrap-enable' :'')}">`;
                html +='<div class="vifewc-customize-field">';
                html += `<div class="vifewc-customize-field-title">${(v['label'] || v['meta_key'].replace(section_id+'_','')||k)}<span>${(v['required'] ? '&nbsp;<abbr class="required">*</abbr>' :'')}</span></div>`;
                html +='<div class="vifewc-customize-field-action">';
                html +=`<span class="vifewc-customize-field-edit" title="${vifewc_preview_text.edit}"><i class="vi-ui icon edit outline"></i></span>`;
                if (v['is_custom'] || !fields_default[k]){
                    html +=`<span class="vifewc-customize-field-clone" title="${vifewc_preview_text.clone}"><i class="vi-ui icon clone outline"></i></span>`;
                    html +=`<span class="vifewc-customize-field-remove" title="${vifewc_preview_text.remove}"><i class="vi-ui icon trash alternate outline"></i></span>`;
                }
                html +=`<span class="vifewc-customize-field-enable${(!field_enable ? ' vifewc-hidden' :'')}" title="${vifewc_preview_text.disable}"><i class="dashicons dashicons-visibility"></i></span>`;
                html +=`<span class="vifewc-customize-field-disable${(field_enable ? ' vifewc-hidden' :'')}" title="${vifewc_preview_text.enable}"><i class="dashicons dashicons-hidden"></i></span>`;
                html +='</div></div></div>';
                html = $(html);
                html.data({'id': k, data : v});
                $('.vifewc-customize-fields').append(html);
            });
            $('.vifewc-customize-fields').sortable({
                connectWith: ".vifewc-customize-field-wrap" ,
                handle: ".vifewc-customize-field",
                cancel: ".vifewc-customize-field-action",
                placeholder: "vifewc-placeholder",
                axis: "y",
                stop: function( event, ui ) {
                    $(document.body).trigger('vifewc_checkout_fields_sortable');
                }
            });
        });
    }
    edit_checkout_sections();
    function edit_checkout_sections() {
        $(document).on('click','.vifewc-section', function () {
            $(this).closest('.vifewc-section').addClass('vifewc-section-editing');
            wp.customize.section('vifewc-customize-fields').expanded(true);
        });
        $(document).on('click','.vifewc-section-edit-fields', function () {
            if ($('.vifewc-section-editing').length) {
                wp.customize.section('vifewc-customize-fields').expanded(true);
            }
        });
        $(document).on('click','.vifewc-section-remove', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!confirm(vifewc_preview_text.section_remove)){
                return false;
            }
            let id, section_ids = JSON.parse(wp.customize('vifewc_sections_params[section_id]').get()),
                section_settings = JSON.parse(wp.customize('vifewc_sections_params[section_settings]').get());
            if ($(this).closest('.vifewc-section').length){
                id = $(this).closest('.vifewc-section').data('section_id' || '');
                section_ids.splice(section_ids.indexOf(id.toString()),1);
                delete section_settings[id];
                wp.customize('vifewc_sections_params[section_id]').set(JSON.stringify(section_ids));
                wp.customize('vifewc_sections_params[section_settings]').set(JSON.stringify(section_settings));
                $(this).closest('.vifewc-section').remove();
            }else {
                id = $(this).closest('.vifewc-customize-section-wrap').find('.vifewc-customize-section-content-id-value').val();
                section_ids.splice(section_ids.indexOf(id.toString()),1);
                delete section_settings[id];
                wp.customize('vifewc_sections_params[section_id]').set(JSON.stringify(section_ids));
                wp.customize('vifewc_sections_params[section_settings]').set(JSON.stringify(section_settings));
                setTimeout(function (){
                    wp.customize.section('vifewc').expanded(true);
                },100);
            }
        });
        $(document).on('click','.vifewc-section-add_new', function () {
            wp.customize.section('vifewc-customize-section').expanded(true);
        });
        $(document).on('click','.vifewc-section-edit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.vifewc-section').addClass('vifewc-section-editing');
            wp.customize.section('vifewc-customize-section').expanded(true);
        });
        $(document).on('click','.vifewc-section-save', function () {
            let section_ids = JSON.parse(wp.customize('vifewc_sections_params[section_id]').get()),
                section_settings = JSON.parse(wp.customize('vifewc_sections_params[section_settings]').get());
            let wrap = $(this).closest('.vifewc-customize-section-wrap');
            let old_name='',
                name = wrap.find('.vifewc-customize-section-content-name-value').val(),
                id = wrap.find('.vifewc-customize-section-content-id-value').val();
            if (!name){
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_name_empty, ['error', 'save-section'], '', false, 4500]);
                return false;
            }
            if (!section_ids.includes(id)) {
                section_ids.push(id);
            }else {
                old_name = section_settings[id]?.name;
            }
            let section_names = $.map(section_settings,function (item){
                return item.name ||'';
            });
            if (old_name != name && section_names.includes(name)){
                $(document.body).trigger('villatheme_show_message', [vifewc_preview_text.error_name_unique, ['error','save-section'], '', false, 4500]);
                return false;
            }
            section_settings[id]={
                name : name,
                title : wrap.find('.vifewc-customize-section-content-title-value').val(),
                title_color : wrap.find('.vifewc-customize-section-content-name_color-value').val(),
                position : wrap.find('.vifewc-customize-section-content-position-value').val(),
            }
            wp.customize('vifewc_sections_params[section_id]').set(JSON.stringify(section_ids));
            wp.customize('vifewc_sections_params[section_settings]').set(JSON.stringify(section_settings));
            setTimeout(function (wrap1){
                wrap1 = $(wrap1);
                if (wrap1.find('.vifewc-customize-section-add_new').length){
                    wp.customize.section('vifewc-customize-fields').expanded(true);
                }
            },100, wrap);
        });
        $(document.body).on('vifewc_only_checkout_sections_html',function () {
            let section_ids = JSON.parse(wp.customize('vifewc_sections_params[section_id]').get()),
                section_settings = JSON.parse(wp.customize('vifewc_sections_params[section_settings]').get()),
                section_default_id = ['billing','shipping','order'],
                section_disable=vifewc_preview_setting.section_disable||[];
            let html = '';
            $.each(section_ids, function (k, v) {
                if (!section_settings[v]){
                    return true;
                }
                let wrap_class = 'vifewc-section';
                if (section_disable.includes(v)){
                    wrap_class += ' vifewc-section-disabled';
                }
                html += '<div class="'+wrap_class+'" data-section_id="'+v+'" title="Click to edit fields">';
                html += '<div class="vifewc-section-title">'+(section_settings[v]['name'] ?? v) +'</div>';
                html +='<div class="vifewc-section-actions">';
                if (section_default_id.indexOf(v) === -1){
                    html +='<span class="vifewc-section-edit"><i class="icon edit outline"></i></span>';
                    html +='<span class="vifewc-section-remove"><i class="icon trash alternate outline"></i></span>';
                }
                html += '</div></div>';
            });
            $('.vifewc-sections-container').html(html);
        });
        $(document.body).on('vifewc_checkout_section_html', function (e,  id='') {
            let html='',wrap_class='',
                position_args=vifewc_preview_setting.section_position,
                section_default_id = ['billing','shipping','order'],
                position ='',name='',
                title='<h3> Custom name </h3>',
                title_color='';
            if (id){
                $('.vifewc-section-save').html(vifewc_preview_text.save);
                let section_settings = JSON.parse(wp.customize('vifewc_sections_params[section_settings]').get());
                wrap_class = 'vifewc-customize-section-' + id;
                name = section_settings[id]['name'] || '';
                title = section_settings[id]['title'] || '';
                title_color = section_settings[id]['title_color'] || '';
                position = section_settings[id]['position'] || '';
                html +=`<div class="vifewc-customize-section-action"><span class="vifewc-button vifewc-section-remove" title="${vifewc_preview_text.section_action_delete}"><i class="icon trash alternate outline"></i>${vifewc_preview_text.remove}</span>`;
                html +=`<span class="vifewc-button vifewc-section-edit-fields" title="${vifewc_preview_text.section_action_edit_fields}"><i class="icon edit outline"></i>${vifewc_preview_text.edit}</span></div>`;
            }else {
                id =  Date.now();
                wrap_class = 'vifewc-customize-section-add_new';
                $('.vifewc-section-save').html(vifewc_preview_text.add_section);
            }
            html +=`<div class="vifewc-customize-section-item vifewc-customize-section-show vifewc-customize-section-general ${wrap_class}">`;
            html += `<div class="vifewc-customize-section-title"><span>${vifewc_preview_text.general_settings_title}</span><i class="dropdown icon"></i></div>`;
            html += '<div class="vifewc-customize-section-content-wrap">';
            html +='<div class="vifewc-customize-section-content vifewc-customize-section-content-name">';
            html +=`<label><span class="customize-control-title">${vifewc_preview_text.section_name}</span></label>`;
            html +=`<input type="hidden" value="${(id)}" class="vifewc-customize-section-content-id-value">`;
            html +=`<input type="text" value="${name}" class="vifewc-customize-section-content-name-value">`;
            html +='</div>';
            html +='<div class="vifewc-customize-section-content vifewc-customize-section-content-title">';
            html +=`<label><span class="customize-control-title">${vifewc_preview_text.section_title}</span></label>`;
            html +=`<input type="text" value="${title}" class="vifewc-customize-section-content-title-value">`;
            html +='</div>';
            html +='<div class="vifewc-customize-section-content vifewc-customize-section-content-name_color">';
            html +=`<label><span class="customize-control-title">${vifewc_preview_text.section_title_color}</span></label>`;
            html +=`<input type="text" value="${title_color}" class="vifewc-color vifewc-customize-section-content-name_color-value">`;
            html +='</div>';

            if (section_default_id.indexOf(id) === -1) {
                html += '<div class="vifewc-customize-section-content vifewc-customize-section-content-position">';
                html += `<label><span class="customize-control-title">${vifewc_preview_text.section_position}</span></label>`;
                html += '<select class="vifewc-customize-section-content-position-value">';
                $.each(position_args, function (k, v) {
                    html += '<option value="' + k + '" ' + (k === position ? 'selected' : '') + '>' + v + '</option>';
                });
                html += '</select>';
                html += '</div>';
            }

            html +='</div>';
            html +='</div>';
            $('.vifewc-customize-section').html(html);
        });
    }
});