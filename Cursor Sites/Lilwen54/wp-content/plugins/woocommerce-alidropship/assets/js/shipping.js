jQuery(document).ready(function ($) {
    'use strict';
    let $item_shipping, $footer = $('.vi-wad-item-shipping-select-popup-holder'), company = '';
    if (typeof wc !== "undefined" && typeof wc.blocksCheckout !== "undefined"){
        let cart_item_shipping={};
        let { registerCheckoutFilters, extensionCartUpdate } = wc.blocksCheckout;
        registerCheckoutFilters( 'viwad_add_checkout_filter', {
            cartItemClass: function (defaultValue, extensions, args){
                let classes=[defaultValue];
                if ($footer.find('.vi-wad-item-shipping-selecting').length){
                    $footer.find('.vi-wad-item-shipping-select-popup-close').trigger('click');
                }
                if (['summary', 'cart'].includes(args?.context )){
                    let cart_item = args?.cartItem;
                    let key = cart_item?.key,
                        item_data = cart_item?.item_data;
                    if (key && item_data.length){
                        if (typeof cart_item_shipping[key]){
                            delete cart_item_shipping[key];
                        }
                        $.each(item_data, function (k,v){
                            if (v.key === 'vi_wad_item_shipping'){
                                cart_item_shipping[key] = JSON.parse(v.value);
                                classes.push(`viwad-block-cart-item-shipping-select-popup`);
                                classes.push(`viwad-block-cart-item-${key}`);
                                return false;
                            }
                        });
                    }
                }
                return classes.join(' ');
            }
        } );
        $(document).on('click','.wc-block-components-product-details__shipping', function (e){
            if (!Object.keys(cart_item_shipping).length || !$(this).closest('.viwad-block-cart-item-shipping-select-popup').length ){
                return;
            }
            $item_shipping = $(this).find('.wc-block-components-product-details__value');
            let item_wrap = $(this).closest('.viwad-block-cart-item-shipping-select-popup'),$modal = '';
            $.each(cart_item_shipping, function (k, v){
                if (item_wrap.hasClass(`viwad-block-cart-item-${k}`) && v?.freight){
                    company = v?.company;
                    let $popup_item = '',
                        $content_class = ['vi-wad-item-shipping-select-popup-content'],
                        $ali_shipping_show_tracking = v?.ali_shipping_show_tracking;
                    if ( $ali_shipping_show_tracking ) {
                        $content_class.push('vi-wad-item-shipping-select-popup-content-show-tracking');
                    }
                    $modal = $('<div class="vi-wad-item-shipping-select-popup-modal"><div class="vi-wad-item-shipping-select-popup-overlay"></div><div class="vi-wad-item-shipping-select-popup-main"></div></div>');
                    $modal.data('cart_item_key',k);
                    let $modal_content = $modal.find('.vi-wad-item-shipping-select-popup-main');
                    $.each(v.freight, function (i, $freight_v){
                        $popup_item += `<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-item-company">
                                <input class="vi-wad-item-shipping-select" type="radio"
                                       value="${$freight_v?.company}"
                                       data-shipping_amount_html="${$freight_v?.ali_option_text}"
                                       name="vi_wad_item_shipping[${k}][company]"
                                    ${(company=== $freight_v?.company? 'checked':'' )}>
                            </div>`;
                        $popup_item +=`<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-item-delivery-time">
                                <span>${$freight_v?.ali_delivery_time}</span>
                            </div>`;
                        $popup_item +=`<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-item-shipping-amount">
                                <span>${$freight_v?.ali_shipping_cost_html}</span>
                            </div>`;
                        $popup_item +=`<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-item-company-name">
                                <span>${$freight_v?.ali_company_name}</span>
                            </div>`;
                        if ($ali_shipping_show_tracking){
                            let $tracking_class = [
                                'vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-item-tracking',
                                'vi-wad-item-shipping-select-popup-content-item-tracking-availability-' + ( $freight_v['tracking'] ? 'yes' : 'no' )
                            ];
                            $popup_item +=`<div class="${($tracking_class.join(' '))}">
                                <span>${($freight_v?.tracking ? v?.ali_yes_title : v?.ali_no_title)}</span>
                            </div>`;
                        }
                    });
                    $modal_content.append(`<div class="vi-wad-item-shipping-select-popup-header">
								<div class="vi-wad-item-shipping-select-popup-header-content">
									<div class="vi-wad-item-shipping-select-popup-title">
										${v?.ali_shipping_popup_title}
									</div>
									<span class="vi-wad-item-shipping-select-popup-close"></span>
								</div>
							</div>`);
                    $modal_content.append(`<div class="${($content_class.join(' '))}">
								<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-head"></div>
								<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-head">${v?.ali_estimated_delivery_title}</div>
								<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-head">${v?.ali_cost_title}</div>
								<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-head">${v?.ali_carrier_title}</div>
								${($ali_shipping_show_tracking?'<div class="vi-wad-item-shipping-select-popup-content-item vi-wad-item-shipping-select-popup-content-head">'+v?.ali_tracking_title+'</div>':'')}
								${$popup_item}
							</div>`);
                    $modal_content.append(`<div class="vi-wad-item-shipping-select-popup-footer">
								<span class="vi-wad-item-shipping-select-popup-confirm">${v?.ali_shipping_confirm_button_title}</span>
							</div>`);
                    return false;
                }
            });
            if ($modal){
                $footer.append($modal);
                vi_wad_disable_scroll();
            }
        });
        $(document).on('click', '.vi-wad-item-shipping-select-popup-overlay,.vi-wad-item-shipping-select-popup-close', function () {
            $footer.html('');
            vi_wad_enable_scroll();
        });
        $(document).on('click', '.vi-wad-item-shipping-select-popup-confirm', function () {
            let $button = $(this),
                $modal = $button.closest('.vi-wad-item-shipping-select-popup-modal');
            let new_company = get_shipping_company($modal);
            if (new_company !== company) {
                company = new_company;
                $modal.addClass('vi-wad-item-shipping-selecting');
                $item_shipping.html($modal.find(`.vi-wad-item-shipping-select[value="${company}"]`).data('shipping_amount_html'));
                //https://github.com/woocommerce/woocommerce-blocks/blob/trunk/docs/third-party-developers/extensibility/rest-api/extend-rest-api-update-cart.md
                extensionCartUpdate( {
                    namespace: 'viwad-cart-item-update-shipping',
                    data: {
                        cart_item_key: $modal.data('cart_item_key'),
                        company: company,
                    },
                } );
            }else {
                $footer.find('.vi-wad-item-shipping-select-popup-close').trigger('click');
            }
            vi_wad_enable_scroll();
        });
    }else {
        $(document).on('change', '[name="billing_city"],[name="billing_state"]', function () {
            if (vi_wad_shipping.countries_supported_shipping_by_province_city.indexOf($('[name="billing_country"]').val()) > -1) {
                $(document.body).trigger('update_checkout');
            }
        });
        $(document).on('change', '[name="shipping_city"],[name="shipping_state"]', function () {
            if ($('[name="ship_to_different_address"]').prop('checked')) {
                if (vi_wad_shipping.countries_supported_shipping_by_province_city.indexOf($('[name="shipping_country"]').val()) > -1) {
                    $(document.body).trigger('update_checkout');
                }
            }
        });
        /*Update cart/checkout when item shipping company changes*/
        $(document).on('change', '.vi-wad-cart-item-shipping-container .vi-wad-item-shipping-select', function () {
            /*Update checkout*/
            jQuery(document.body).trigger('update_checkout');//Do not change jQuery to $ here, weird but for some themes it only works if using exact jQuery to trigger update_checkout
            /*Update cart*/
            let $update_cart = $('[name="update_cart"]');
            if ($update_cart.length > 0) {
                if ($update_cart.prop('disabled')) {
                    $update_cart.prop('disabled', false);
                }
                $update_cart.trigger('click');
            }
        });
        $(document).on('click', '.vi-wad-item-shipping-select-popup', function () {
            let $button = $(this);
            $item_shipping = $button.closest('.vi-wad-item-shipping');
            let $modal = $item_shipping.find('.vi-wad-item-shipping-select-popup-modal');
            company = get_shipping_company($modal);
            $modal.removeClass('vi-wad-hidden');
            $footer.append($modal);
            vi_wad_disable_scroll();
        });
        $(document).on('click', '.vi-wad-item-shipping-select-popup-overlay,.vi-wad-item-shipping-select-popup-close', function () {
            let $button = $(this),
                $modal = $button.closest('.vi-wad-item-shipping-select-popup-modal');
            $modal.addClass('vi-wad-hidden');
            $item_shipping.append($modal);
            let new_company = get_shipping_company($modal);
            if (new_company !== company) {
                $modal.find(`.vi-wad-item-shipping-select`).prop('checked', false);
                $modal.find(`.vi-wad-item-shipping-select[value=${company}]`).prop('checked', true);
            }
            vi_wad_enable_scroll();
        });
        $(document).on('click', '.vi-wad-item-shipping-select-popup-confirm', function () {
            let $button = $(this),
                $modal = $button.closest('.vi-wad-item-shipping-select-popup-modal');
            $modal.addClass('vi-wad-hidden');
            $item_shipping.append($modal);
            let new_company = get_shipping_company($modal);
            if (new_company !== company) {
                company = new_company;
                $modal.find(`.vi-wad-item-shipping-select`).prop('checked', false);
                $modal.find(`.vi-wad-item-shipping-select[value=${company}]`).prop('checked', true).trigger('change');
                $item_shipping.find('.vi-wad-item-shipping-select-popup-selected').html($item_shipping.find(`.vi-wad-item-shipping-select[value="${company}"]`).data('shipping_amount_html'));
            }
            vi_wad_enable_scroll();
        });
    }

    function get_shipping_company($modal) {
        let $shipping_select = $modal.find('.vi-wad-item-shipping-select'), shipping_company = '';
        for (let i = 0; i < $shipping_select.length; i++) {
            if ($shipping_select.eq(i).prop('checked')) {
                shipping_company = $shipping_select.eq(i).val();
                break;
            }
        }
        return shipping_company;
    }

    function vi_wad_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('vi_wad-noscroll');
        $('html,body').scrollTop(-scrollTop);
    }

    function vi_wad_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('vi_wad-noscroll').css('top', -scrollTop);
        }
    }
});