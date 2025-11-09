<?php
defined( 'ABSPATH' ) || exit;
if ( empty( $reviews ) || ! is_array( $reviews ) ) {
	?>
    <div class="vi-ui positive message">
        <div class="header">
            <p><?php esc_html_e( 'No valid reviews are available.', 'tmds-woocommerce-temu-dropshipping' ) ?></p>
        </div>
    </div>
	<?php
	return;
}
$rate_args = [
	'1' => '&#9733;',
	'2' => '&#9733;&#9733;',
	'3' => '&#9733;&#9733;&#9733;',
	'4' => '&#9733;&#9733;&#9733;&#9733;',
	'5' => '&#9733;&#9733;&#9733;&#9733;&#9733;',
]
?>
<table class="form-table tmds-review-table tmds-table-fix-head">
    <thead>
    <tr>
        <th width="1%"></th>
        <th><?php esc_html_e( 'Author', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
        <th><?php esc_html_e( 'Rating', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
        <th><?php esc_html_e( 'Review', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
        <th><?php esc_html_e( 'Date', 'tmds-woocommerce-temu-dropshipping' ); ?></th>
    </tr>
    </thead>
    <tbody>
	<?php
	foreach ( $reviews as $review ) {
		TMDSPRO_Admin_Import_List::$reviews_count ++;
		$review_key = TMDSPRO_Admin_Import_List::$reviews_count;
		?>
        <tr class="tmds-product-review-row">
            <td class="tmds-product-review-row-number"><?php echo esc_html( $review_key ) ?></td>
            <td>
				<?php echo wp_kses( $review['name'] ?? '', TMDSPRO_DATA::filter_allowed_html() ) ?>
            </td>
            <td>
				<?php echo wp_kses( $rate_args[ $review['score'] ?? '5' ], TMDSPRO_DATA::filter_allowed_html() ) ?>
            </td>
            <td>
				<?php echo wp_kses( $review['tmds_comment'] ?? '', TMDSPRO_DATA::filter_allowed_html() ) ?>
            </td>
            <td>
				<?php echo wp_kses( wp_date( wc_date_format(), $review['time'] ?? '' ), TMDSPRO_DATA::filter_allowed_html() ) ?>
            </td>
        </tr>
		<?php
	}
	?>
    </tbody>
</table>
