<?php
defined( 'ABSPATH' ) || exit;
$settings        = $settings ?? TMDSPRO_DATA::get_instance();
$currency_symbol = get_woocommerce_currency_symbol();
?>
<table class="vi-ui celled table price-rule" data-currency_symbol="<?php echo esc_attr( $currency_symbol ) ?>">
    <thead>
    <tr>
        <th><?php esc_html_e( 'Price range', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th><?php esc_html_e( 'Actions', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th><?php esc_html_e( 'Sale price', 'tmds-woocommerce-temu-dropshipping' ) ?>
            <div class="tmds-description">
				<?php esc_html_e( '(Set -1 to not use sale price)', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </div>
        </th>
        <th class="regular-price-rule"><?php esc_html_e( 'Regular price', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th></th>
    </tr>
    </thead>
    <tbody class="tmds-price-rule-container">
	<?php
	$price_from       = $price_from ?? $settings->get_params( 'price_from' );
	$price_default    = $price_default ?? $settings->get_params( 'price_default' );
	$price_to         = $price_to ?? $settings->get_params( 'price_to' );
	$plus_value       = $plus_value ?? $settings->get_params( 'plus_value' );
	$plus_sale_value  = $plus_sale_value ?? $settings->get_params( 'plus_sale_value' );
	$plus_value_type  = $plus_value_type ?? $settings->get_params( 'plus_value_type' );
	$price_from_count = count( (array) $price_from );

	if ( $price_from_count > 0 ) {
		if ( ! is_array( $price_to ) || count( $price_to ) !== $price_from_count ) {
			if ( $price_from_count > 1 ) {
				$price_to   = array_values( array_slice( $price_from, 1 ) );
				$price_to[] = '';
			} else {
				$price_to = array( '' );
			}
		}
		for ( $i = 0; $i < count( $price_from ); $i ++ ) {
			switch ( $plus_value_type[ $i ] ) {
				case 'fixed':
					$value_label_left  = '+';
					$value_label_right = $currency_symbol;
					break;
				case 'percent':
					$value_label_left  = '+';
					$value_label_right = '%';
					break;
				case 'multiply':
					$value_label_left  = 'x';
					$value_label_right = '';
					break;
				default:
					$value_label_left  = '=';
					$value_label_right = $currency_symbol;
			}
			?>
            <tr class="tmds-price-rule-row">
                <td>
                    <div class="equal width fields">
                        <div class="field">
                            <div class="vi-ui left labeled input fluid">
                                <label for="amount" class="vi-ui label"><?php echo wp_kses_post( $currency_symbol ); ?></label>
                                <input step="any" type="number"
                                       min="0" value="<?php echo esc_attr( $price_from[ $i ] ); ?>"
                                       name="price_from[]" class="tmds-price-from tmds-input-reset">
                            </div>
                        </div>
                        <span class="tmds-price-from-to-separator">-</span>
                        <div class="field">
                            <div class="vi-ui left labeled input fluid">
                                <label for="amount" class="vi-ui label"><?php echo wp_kses_post( $currency_symbol ); ?></label>
                                <input step="any" type="number" min="0"
                                       value="<?php echo esc_attr( $price_to[ $i ] ); ?>" name="price_to[]"
                                       class="tmds-price-to tmds-input-reset">
                            </div>
                        </div>

                    </div>
                </td>
                <td>
                    <select name="plus_value_type[]"
                            class="vi-ui fluid dropdown tmds-plus-value-type">
                        <option value="fixed" <?php selected( $plus_value_type[ $i ], 'fixed' ) ?>>
							<?php printf( esc_html__( 'Increase by Fixed amount(%s)',// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
								'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( $currency_symbol ) ) ?>
                        </option>
                        <option value="percent" <?php selected( $plus_value_type[ $i ], 'percent' ) ?>><?php esc_html_e( 'Increase by Percentage(%)',
								'tmds-woocommerce-temu-dropshipping' ) ?></option>
                        <option value="multiply" <?php selected( $plus_value_type[ $i ], 'multiply' ) ?>><?php esc_html_e( 'Multiply with',
								'tmds-woocommerce-temu-dropshipping' ) ?></option>
                        <option value="set_to" <?php selected( $plus_value_type[ $i ], 'set_to' ) ?>><?php esc_html_e( 'Set to',
								'tmds-woocommerce-temu-dropshipping' ) ?></option>
                    </select>
                </td>
                <td>
                    <div class="vi-ui right labeled input fluid">
                        <label for="amount" class="vi-ui label tmds-value-label-left">
							<?php echo esc_html( $value_label_left ) ?>
                        </label>
                        <input type="number" min="-1"
                               step="any" value="<?php echo esc_attr( $plus_sale_value[ $i ] ); ?>"
                               name="plus_sale_value[]"
                               class="tmds-plus-sale-value">
                        <div class="vi-ui basic label tmds-value-label-right">
							<?php echo esc_html( $value_label_right ) ?>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="vi-ui right labeled input fluid">
                        <label for="amount" class="vi-ui label tmds-value-label-left">
							<?php echo esc_html( $value_label_left ) ?>
                        </label>
                        <input type="number" min="0" step="any"
                               value="<?php echo esc_attr( $plus_value[ $i ] ); ?>" name="plus_value[]"
                               class="tmds-plus-value">
                        <div class="vi-ui basic label tmds-value-label-right">
							<?php echo esc_html( $value_label_right ) ?>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="">
                            <span class="vi-ui button icon negative mini tmds-price-rule-remove" data-tooltip="<?php esc_attr_e( 'Remove', 'tmds-woocommerce-temu-dropshipping' ); ?>"><i
                                        class="icon trash"> </i></span>
                    </div>
                </td>
            </tr>
			<?php
		}
	}
	?>
    </tbody>
    <tfoot>
	<?php
	$plus_value_type_d = isset( $price_default['plus_value_type'] ) ? $price_default['plus_value_type'] : 'multiply';
	$plus_sale_value_d = isset( $price_default['plus_sale_value'] ) ? $price_default['plus_sale_value'] : 1;
	$plus_value_d      = isset( $price_default['plus_value'] ) ? $price_default['plus_value'] : 2;
	switch ( $plus_value_type_d ) {
		case 'fixed':
			$value_label_left  = '+';
			$value_label_right = $currency_symbol;
			break;
		case 'percent':
			$value_label_left  = '+';
			$value_label_right = '%';
			break;
		case 'multiply':
			$value_label_left  = 'x';
			$value_label_right = '';
			break;
		default:
			$value_label_left  = '=';
			$value_label_right = $currency_symbol;
	}
	?>
    <tr class="tmds-price-rule-row-default">
        <th><?php esc_html_e( 'Default', 'tmds-woocommerce-temu-dropshipping' ) ?></th>
        <th>
            <select name="price_default[plus_value_type]"
                    class="vi-ui fluid dropdown tmds-plus-value-type">
                <option value="fixed" <?php selected( $plus_value_type_d, 'fixed' ) ?>><?php printf( esc_html__( 'Increase by Fixed amount(%s)',// phpcs:ignore WordPress.WP.I18n.MissingTranslatorsComment
						'tmds-woocommerce-temu-dropshipping' ), wp_kses_post( $currency_symbol ) ) ?></option>
                <option value="percent" <?php selected( $plus_value_type_d, 'percent' ) ?>><?php esc_html_e( 'Increase by Percentage(%)',
						'tmds-woocommerce-temu-dropshipping' ) ?></option>
                <option value="multiply" <?php selected( $plus_value_type_d, 'multiply' ) ?>><?php esc_html_e( 'Multiply with',
						'tmds-woocommerce-temu-dropshipping' ) ?></option>
                <option value="set_to" <?php selected( $plus_value_type_d, 'set_to' ) ?>><?php esc_html_e( 'Set to',
						'tmds-woocommerce-temu-dropshipping' ) ?></option>
            </select>
        </th>
        <th>
            <div class="vi-ui right labeled input fluid">
                <label for="amount" class="vi-ui label tmds-value-label-left">
					<?php echo esc_html( $value_label_left ) ?>
                </label>
                <input type="number" min="-1" step="any" value="<?php echo esc_attr( $plus_sale_value_d ); ?>"
                       name="price_default[plus_sale_value]"
                       class="tmds-plus-sale-value">
                <div class="vi-ui basic label tmds-value-label-right">
					<?php echo esc_html( $value_label_right ) ?>
                </div>
            </div>
        </th>
        <th>
            <div class="vi-ui right labeled input fluid">
                <label for="amount" class="vi-ui label tmds-value-label-left">
					<?php echo esc_html( $value_label_left ) ?>
                </label>
                <input type="number" min="0" step="any" value="<?php echo esc_attr( $plus_value_d ); ?>"
                       name="price_default[plus_value]"
                       class="tmds-plus-value">
                <div class="vi-ui basic label tmds-value-label-right">
					<?php echo esc_html( $value_label_right ) ?>
                </div>
            </div>
        </th>
        <th>
        </th>
    </tr>
    </tfoot>
</table>
<span class="tmds-price-rule-add vi-ui button icon positive mini" data-tooltip="<?php esc_attr_e( 'Add new', 'tmds-woocommerce-temu-dropshipping' ); ?>"><i class="icon add"> </i></span>
