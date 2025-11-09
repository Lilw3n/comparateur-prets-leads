jQuery(document).ready(function ($) {
    'use strict';
    if (typeof vifewc_param === "undefined") {
        return;
    }
    $(document).on('click','.vifewc-sections-container .item:not(.active)', function (){
        let section_id = $(this).data('tab');
        if (!section_id){
            return;
        }
        if (section_id ==='add_new'){
            $(document).trigger('vifewc_checkout_section_html');
            return;
        }
        $(document).trigger('vifewc_checkout_fields_html', [section_id]);
    });
    $(document).on('click','.vifewc-section-remove', function (e){
        e.preventDefault();
        e.stopPropagation();
        let $tab = $(this).closest('.item');
        let section_id = $tab.data('tab');
        if (!section_id){
            return;
        }
        if (!confirm(vifewc_param.i18n.section_remove)){
            return;
        }
        if (vifewc_param.section_ids.indexOf(section_id) > -1){
            delete vifewc_param.section_ids[vifewc_param.section_ids.indexOf(section_id)]
        }
        if (vifewc_param.section_settings[section_id]){
            delete vifewc_param.section_settings[section_id]
        }
        if (vifewc_param.section_fields[section_id]){
            delete vifewc_param.section_fields[section_id]
        }
        if ($tab.hasClass('active')){
            $('.vifewc-sections-container .item').eq(0).trigger('click');
        }
        $tab.remove();
    });
    $(document).on('click','.vifewc-section-edit', function (e){
        e.preventDefault();
        e.stopPropagation();
        let $tab = $(this).closest('.item');
        let section_id = $tab.data('tab');
        if (!section_id){
            return;
        }
        $(document).trigger('vifewc_checkout_section_html', [section_id]);
    });
    $(document).on('click','.fewc-edit-section-bt-save', function (){
        let wrap = $(this).closest('.fewc-edit-section-container');
        let old_name='',
            name = wrap.find('.fewc-edit-section-name-value').val(),
            id = wrap.find('.fewc-edit-section-id-value').val();
        if (!name){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_name_empty, ['error', 'save-section'], '', false, 4500]);
            return false;
        }
        let section_ids = vifewc_param.section_ids,
            section_settings = vifewc_param.section_settings;
        if (!section_ids.includes(id)) {
            section_ids.push(id);
        }else {
            old_name = section_settings[id]?.name;
        }
        let section_names = $.map(section_settings,function (item){
            return item.name ||'';
        });
        if (old_name != name && section_names.includes(name)){
            $(document.body).trigger('villatheme_show_message', [vifewc_param.i18n.error_name_unique, ['error','save-section'], '', false, 4500]);
            return false;
        }
        section_settings[id]={
            name : name,
            title : wrap.find('.fewc-edit-section-title-value').val(),
            title_color : wrap.find('.fewc-edit-section-title_color-value').val(),
            position : wrap.find('.fewc-edit-section-position-value select').val(),
        }
        vifewc_param.section_ids = section_ids;
        vifewc_param.section_settings = section_settings;
        if (!vifewc_param.section_fields[id]) {
            vifewc_param.section_fields[id] = {};
        }
        if (! $('.vifewc-sections-container').find('.item[data-tab="'+id+'"]').length){
            $('.fewc-add-new-section').before(`
            <div class="item" data-tab="${id}">
            <div class="vifewc-section">
                <span class="vifewc-section-title">${name}</span>
                <div class="vifewc-section-actions">
                    <span class="vifewc-section-edit"><i class="icon edit outline"></i></span>
                    <span class="vifewc-section-remove"><i class="icon trash alternate outline"></i></span>
                </div>
            </div></div>`);
            setTimeout(function (section_id){
                $('.vifewc-sections-container').find('.item[data-tab="'+section_id+'"]').trigger('click');
            },100, id);
        }else {
            $('.vifewc-sections-container').find('.item[data-tab="'+id+'"]').find('.vifewc-section-title').html(name);
        }
        wrap.find('.vifewc-popup-close').trigger('click');
    });
    $(document).on('vifewc_checkout_section_html', function (e, id=''){
        let html = `<div class="vifewc-popup-wrap fewc-edit-section-container">
        <div class="vifewc-popup">
            <div class="vifewc-overlay vifewc-overlay-loading"></div>
            <div class="vifewc-overlay"></div>
            <div class="vifewc-popup-container-wrap">
                <span class="vifewc-popup-close">&#43;</span>
                <div class="vifewc-popup-container">
                    <div class="vifewc-popup-header-wrap">${vifewc_param.i18n.add_section_title}</div>
                    <div class="vifewc-popup-content-wrap">
                        <div class="vifewc-popup-content-container">
                            <div class="vifewc-popup-content">
                                <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                    <div class="vifewc-popup-content-title">${vifewc_param.i18n.section_name}</div>
                                    <div class="vifewc-popup-content-value">
                                        <input type="hidden" value="" class="fewc-edit-section-id-value">
                                        <input type="text" value="" class="fewc-edit-section-name-value">
                                    </div>
                                </div>
                            </div>
                            <div class="vifewc-popup-content">
                                <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                    <div class="vifewc-popup-content-title">${vifewc_param.i18n.section_title}</div>
                                    <div class="vifewc-popup-content-value">
                                        <input type="text" value="" class="fewc-edit-section-title-value">
                                    </div>
                                </div>
                            </div>
                            <div class="vifewc-popup-content">
                                <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                    <div class="vifewc-popup-content-title">${vifewc_param.i18n.section_title_color}</div>
                                    <div class="vifewc-popup-content-value vifewc-color-value">
                                        <input type="text" value="" class="vifewc-color fewc-edit-section-title_color-value">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="vifewc-popup-footer-wrap">
                        <span class="vi-ui button mini primary vifewc-popup-bt fewc-edit-section-bt-save">${vifewc_param.i18n.add_section}</span>
                    </div>
                </div>
            </div>
        </div>
        </div>`;
        let $html=$(html),
            section_default_id = ['billing','shipping','order'],
            param = {
                id:id,
                name:'',
                title:'<h3> New section </h3>',
                title_color:'',
                position:'',
            };
        if (id){
            let section_settings = vifewc_param.section_settings;
            param.name = section_settings[id]['name'] || '';
            param.title = section_settings[id]['title'] || '';
            param.title_color = section_settings[id]['title_color'] || '';
            param.position = section_settings[id]['position'] || '';
            $html.find('.fewc-edit-section-bt-save').html(vifewc_param.i18n.save);
            $html.find('.fewc-edit-section-container').addClass('fewc-section-'+id+'-wrap');
        }else {
            param.id =  Date.now();
            $html.find('.fewc-edit-section-container').addClass('fewc-section-add_new-wrap');
        }
        if (!section_default_id.includes(id)) {
            if (!param.position){
                param.position ='woocommerce_checkout_before_customer_details';
            }
            let pos_select = $.map(vifewc_param.section_position, function (k,v) {
                return `<option value="${v}">${k}</option>`;
            });
            let pos_html=`<div class="vifewc-popup-content">
                            <div class="vifewc-popup-content-horizontal vifewc-popup-content-full-row">
                                <div class="vifewc-popup-content-title">${vifewc_param.i18n.section_position}</div>
                                <div class="vifewc-popup-content-value">
                                    <select class="vi-ui fluid dropdown fewc-edit-section-position-value">${(pos_select.join(''))}</select>
                                </div>
                            </div>
                        </div>`;
            $html.find('.vifewc-popup-content-container').append(pos_html);
        }
        for (let key of Object.keys(param)) {
            $html.find(`.fewc-edit-section-${key}-value`).val(param[key]).trigger('change');
        }
        $('body').append($html);
        setTimeout(function (){
            $(document).trigger('vifewc_popup_init');
            $('.fewc-edit-section-container').removeClass('vifewc-popup-wrap-hidden').addClass('vifewc-popup-wrap-show');
        },100);
    });
});