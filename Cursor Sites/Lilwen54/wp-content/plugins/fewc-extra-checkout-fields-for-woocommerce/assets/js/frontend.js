( function( $ ){
    'use strict';
    if (typeof wc_address_i18n_params === "undefined"){
        return false;
    }
    $(document).ready(function () {
        $( 'form.checkout' ).on('validate change', '.input-text, select, input:checkbox',function (e){
            let event_type        = e.type,
                $this = $(this);
            let field = $this.closest('.form-row');
            if (['change','validate'].includes(event_type) && $this.val() &&
                ( field.is('.validate-url') ||  field.is('.validate-number'))){
                let validated = true;
                if ( field.is('.validate-url') ) {
                    try {
                        let url = new URL($this.val());
                        if (url.protocol !== "http:" && url.protocol !== "https:"){
                            field.removeClass( 'woocommerce-validated' ).addClass( 'woocommerce-invalid woocommerce-invalid-url' );
                            validated = false;
                        }
                    }catch (e) {
                        field.removeClass( 'woocommerce-validated' ).addClass( 'woocommerce-invalid woocommerce-invalid-url' );
                        validated = false;
                    }
                }
                if ( field.is('.validate-number') && isNaN($this.val())) {
                    field.removeClass( 'woocommerce-validated' ).addClass( 'woocommerce-invalid woocommerce-invalid-number' );
                    validated = false;
                }
                if ( validated ) {
                    field.removeClass( 'woocommerce-invalid woocommerce-invalid-url woocommerce-invalid-phone' ).addClass( 'woocommerce-validated' ); // eslint-disable-line max-len
                }
            }
        });
    });
    $( document.body ).on( 'country_to_state_changed', function( event, country, wrapper ) {
            setTimeout(function (form){
                let  locale_fields = JSON.parse( wc_address_i18n_params.locale_fields );
                $.each( locale_fields, function( key, value ) {
                    let field       = $(form).find( value );
                    field_is_required( field, field.is('.vifewc-validate-required') );
                });
            },100, wrapper);
    });
    function field_is_required( field, is_required ) {
        if ( is_required ) {
            field.find( 'label .optional' ).remove();
            field.addClass( 'validate-required' );
            if ( field.find( 'label .required' ).length === 0 ) {
                field.find( 'label' ).append('&nbsp;<abbr class="required" title="' + wc_address_i18n_params.i18n_required_text + '">*</abbr>');
            }
        } else {
            field.find( 'label .required' ).remove();
            field.removeClass( 'validate-required woocommerce-invalid woocommerce-invalid-required-field' );
            if ( field.find( 'label .optional' ).length === 0 ) {
                field.find( 'label' ).append( '&nbsp;<span class="optional">(' + wc_address_i18n_params.i18n_optional_text + ')</span>' );
            }
        }
    }
})(jQuery);