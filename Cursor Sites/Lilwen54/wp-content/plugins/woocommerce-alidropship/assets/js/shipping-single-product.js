jQuery(document).ready(function ($) {
    'use strict';
    let variation_id = '', current_variation_id = '', quantity = 0, reload_shipping, rerun = true;

    $(document).on('change', 'form.cart input[name="quantity"]', function () {
        rerun = false;
        let $quantity = $(this),
            $form = $quantity.closest('form.cart');
        reload_shipping_selection($quantity, $form);
    });

    let wc_country_select_select2 = function ()     {
        $('select.ald-single-product-change-shipto').each(function () {
            if ($().selectWoo) {
                var $this = $(this);
                var select2_args = $.extend({
                    placeholder: $this.attr('data-placeholder') || $this.attr('placeholder') || '',
                    label: $this.attr('data-label') || null,
                    // width: '100%'
                }, {});

                $(this).on('select2:select', function () {
                    $(this).trigger('focus');
                }).selectWoo(select2_args);
            }
        });
    };

    wc_country_select_select2();

    function reload_shipping_selection($quantity, $form) {
        let product_id = $form.find('[name="add-to-cart"]').val(), $variation_id = $form.find('[name="variation_id"]'),
            $shipping = $form.find('.vi-wad-single-product-shipping-wrap');

        if ($shipping.length === 0 || !product_id) {
            return;
        }

        if ($shipping.hasClass('vi-wad-single-product-shipping-need-select-variation')) {
            if (variation_id === '0') {
                return;
            }
        }

        if (variation_id === '0' || (($variation_id.length > 0 && variation_id === $variation_id.val().toString())) && $shipping.hasClass('vi-wad-single-product-shipping-not-available')) {
            if (quantity === $shipping.data('quantity') && $('.ald-single-product-change-shipto').val() === $shipping.data('country')) {
                return;
            }
        }

        if ($shipping.hasClass('vi-wad-single-product-shipping-not-refresh')) {
            if (quantity === undefined) {
                quantity = $quantity.val();
                return;
            }
        }

        if (reload_shipping !== undefined) {
            reload_shipping.abort();
        }
        let $overlay = $shipping.find('.vi-wad-single-product-shipping-overlay'),
            data = {
                action: 'vi_wad_reload_shipping_single_product',
                language: vi_wad_shipping.language,
                _vi_wad_ajax_nonce: vi_wad_shipping.nonce,
                product_id: product_id,
                quantity: $quantity.val(),
                variation_id: $variation_id.length > 0 ? $variation_id.val().toString() : '',
                country: $('.ald-single-product-change-shipto').val()
            };

        $overlay.removeClass('vi-wad-hidden');

        reload_shipping = $.ajax({
            url: vi_wad_shipping.url,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (response) {
                if (data.variation_id !== '0') {
                    variation_id = data.variation_id;
                }
                quantity = data.quantity;
                if (response.status === 'success') {
                    $shipping.replaceWith($(response.shipping_html));
                    $form.find('.vi-wad-single-product-shipping-wrap').data({country:  $('.ald-single-product-change-shipto').val(), quantity : quantity})
                } else {
                    console.log(response.message);
                }
            },
            error: function (err) {
                console.log(err);
            },
            complete: function (err) {
                $overlay.addClass('vi-wad-hidden');
                reload_shipping = undefined;
                rerun = true;
                // wc_country_select_select2();
            },
        });
    }

    $(document).on('change', '.ald-single-product-change-shipto', function () {
        $('form.cart input[name="quantity"]').trigger('change');
    });


});