<?php
defined( 'ABSPATH' ) || exit;
$settings                = $settings ?? TMDSPRO_DATA::get_instance();
$current_currency        = get_woocommerce_currency();
$import_currency_rate    = $settings->get_params( 'import_currency_rate' );
$exchange_rate_api       = $settings->get_params( 'exchange_rate_api' );
$exchange_rate_decimals  = $settings->get_params( 'exchange_rate_decimals' );
$exchange_rate_api_class = 'tmds-exchange-rate-info';
if ( ! $exchange_rate_api ) {
	$exchange_rate_api_class .= ' tmds-hidden';
}
if ( ! is_array( $import_currency_rate ) ) {
	$import_currency_rate = [];
}
$accept_currency = $settings::get_temu_data();
if ( empty( $import_currency_rate ) ) {
	if ( isset( $accept_currency[ $current_currency ] ) ) {
		$import_currency_rate[ $current_currency ] = 1;
	} else {
		$import_currency_rate['USD'] = 1;
	}
}
?>
<table class="vi-ui celled table price-exchange-rates price-rule">
    <thead>
    <tr>
        <th><?php esc_html_e( 'Temu currency', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th><?php printf( esc_html__( 'Exchange rate( your store currency: %s )', 'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( $current_currency ) ) // phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment ?></th>
        <th class="<?php echo esc_attr( $exchange_rate_api_class ) ?>">
			<?php esc_html_e( 'Rate Decimals', 'tmds-woocommerce-temu-dropshipping' ); ?>
        </th>
        <th></th>
    </tr>
    </thead>
    <tbody class="tmds-price-exchange-rates-container tmds-price-rule-container">
	<?php
	if ( ! empty( $import_currency_rate ) ) {
		foreach ( $import_currency_rate as $currency => $rate ) {
			?>
            <tr class="tmds-price-rule-row">
                <td>
					<?php
					$settings::villatheme_render_field( 'import_currency_rate', [
						'type'             => 'select',
						'empty_name_field' => 1,
						'is_search'        => 1,
						'value'            => $currency,
						'options'          => $accept_currency,
					] );
					?>
                </td>
                <td>
                    <input type="number" min="0" step="any"
                           value="<?php echo esc_attr( $rate ); ?>" name="import_currency_rate[<?php echo esc_attr( $currency ) ?>]"
                           data-name="import_currency_rate[{currency_code}]"
                           class="tmds-price-exchange-rate tmds-input-reset">
                </td>
                <td class="<?php echo esc_attr( $exchange_rate_api_class ) ?>">
                    <input type="number" min="0" step="1"
                           value="<?php echo esc_attr( $exchange_rate_decimals[ $currency ] ?? 2 ); ?>" name="exchange_rate_decimals[<?php echo esc_attr( $currency ) ?>]"
                           data-name="exchange_rate_decimals[{currency_code}]"
                           class="tmds-price-exchange-rate-decimals tmds-input-reset">
                </td>
                <td>
                    <div class="buttons small vi-ui">
                        <span class="vi-ui button icon mini tmds-price-rule-update <?php echo esc_attr( $exchange_rate_api_class ) ?>" data-tooltip="<?php esc_attr_e( 'Update rate', 'tmds-woocommerce-temu-dropshipping' ); ?>"><i
                                    class="icon cloud download"> </i></span>
                        <span class="vi-ui button icon negative mini tmds-price-rule-remove" data-tooltip="<?php esc_attr_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ); ?>"><i class="icon trash"> </i></span>
                    </div>
                </td>
            </tr>
			<?php
		}
	}
	?>
    </tbody>
</table>
<div class="buttons small vi-ui">
<span class="tmds-exchange-rate-add tmds-price-rule-add vi-ui button icon positive mini" data-tooltip="<?php esc_attr_e( 'Add new rate', 'tmds-woocommerce-temu-dropshipping' ); ?>">
    <i class="icon add"> </i>
</span>
    <span class="tmds-exchange-rate-add tmds-price-rule-update-all vi-ui button icon mini <?php echo esc_attr( $exchange_rate_api_class ) ?>" data-tooltip="<?php esc_attr_e( 'Update all rates', 'tmds-woocommerce-temu-dropshipping' ); ?>">
    <i class="icon cloud download"> </i>
</span>
</div>