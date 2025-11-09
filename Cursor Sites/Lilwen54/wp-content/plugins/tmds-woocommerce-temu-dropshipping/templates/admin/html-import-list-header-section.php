<?php
defined( 'ABSPATH' ) || exit;
$bulk_options = [
	""                       => esc_html__( 'Bulk Action', 'tmds-woocommerce-temu-dropshipping' ),
	"set_categories"         => esc_html__( 'Set categories', 'tmds-woocommerce-temu-dropshipping' ),
	"set_tags"               => esc_html__( 'Set tags', 'tmds-woocommerce-temu-dropshipping' ),
	"set_shipping_class"     => esc_html__( 'Set shipping class', 'tmds-woocommerce-temu-dropshipping' ),
	"set_status_publish"     => esc_html__( 'Set status - Publish', 'tmds-woocommerce-temu-dropshipping' ),
	"set_status_pending"     => esc_html__( 'Set status - Pending', 'tmds-woocommerce-temu-dropshipping' ),
	"set_status_draft"       => esc_html__( 'Set status - Draft', 'tmds-woocommerce-temu-dropshipping' ),
	"set_visibility_visible" => esc_html__( 'Set visibility - Shop and search results', 'tmds-woocommerce-temu-dropshipping' ),
	"set_visibility_catalog" => esc_html__( 'Set visibility - Shop only', 'tmds-woocommerce-temu-dropshipping' ),
	"set_visibility_search"  => esc_html__( 'Set visibility - Search results only', 'tmds-woocommerce-temu-dropshipping' ),
	"set_visibility_hidden"  => esc_html__( 'Set visibility - Hidden', 'tmds-woocommerce-temu-dropshipping' ),
	"import"                 => esc_html__( 'Import selected', 'tmds-woocommerce-temu-dropshipping' ),
	"remove"                 => esc_html__( 'Remove selected', 'tmds-woocommerce-temu-dropshipping' ),
];
?>
<form method="get" class="vi-ui segment tmds-pagination-form">
    <input type="hidden" name="page" value="tmds">
	<?php do_action( 'tmds_import_list_search_form' ); ?>
    <div class="tablenav top">
        <div class="tmds-button-import-all-container">
            <input type="checkbox" class="tmds-accordion-bulk-item-check-all">
            <span class="vi-ui button mini primary tmds-button-import-all"
                  title="<?php esc_attr_e( 'Import all products on this page', 'tmds-woocommerce-temu-dropshipping' ) ?>">
	            <?php esc_html_e( 'Import All', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </span>
            <a class="vi-ui button negative mini tmds-button-empty-import-list"
               href="<?php echo esc_url( wp_nonce_url( add_query_arg( 'tmds_empty_product_list', 1 ) ) ) ?>"
               title="<?php esc_attr_e( 'Remove all products(except overriding products) from Import list', 'tmds-woocommerce-temu-dropshipping' ) ?>">
				<?php esc_html_e( 'Empty List', 'tmds-woocommerce-temu-dropshipping' ) ?>
            </a>
            <span class="tmds-accordion-bulk-actions-container">
                <select name="tmds_bulk_actions"
                        class="vi-ui dropdown tmds-accordion-bulk-actions">
                    <?php
                    foreach ( $bulk_options as $value => $text ) {
	                    printf( "<option value='%s'>%s</option>", esc_attr( $value ), esc_html( $text ) );
                    }
                    ?>
                </select>
            </span>
        </div>
        <div class="tablenav-pages">
            <div class="pagination-links">
				<?php
				if ( $paged > 2 ) {
					?>
                    <a class="prev-page button" href="<?php echo esc_url( add_query_arg(
						array(
							'paged'       => 1,
							'tmds_search' => $keyword,
						)
					) ) ?>">
                        <span class="screen-reader-text"><?php esc_html_e( 'First Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                        <span aria-hidden="true">«</span>
                    </a>
					<?php
				} else {
					?>
                    <span class="tablenav-pages-navspan button disabled" aria-hidden="true">«</span>
					<?php
				}
				/*Previous button*/
				$p_paged = $per_page * $paged > $per_page ? $paged - 1 : 0;

				if ( $p_paged ) {
					$p_url = add_query_arg(
						array(
							'paged'       => $p_paged,
							'tmds_search' => $keyword,
						)
					);
					?>
                    <a class="prev-page button" href="<?php echo esc_url( $p_url ) ?>">
                        <span class="screen-reader-text"><?php esc_html_e( 'Previous Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                        <span aria-hidden="true">‹</span>
                    </a>
					<?php
				} else {
					?>
                    <span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
					<?php
				}
				?>
                <span class="screen-reader-text"><?php esc_html_e( 'Current Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                <span id="table-paging" class="paging-input">
                    <input class="current-page" type="text" name="paged" size="1"
                           value="<?php echo esc_html( $paged ) ?>">
                    <span class="tablenav-paging-text"> of <span
                                class="total-pages"><?php echo esc_html( $total_page ) ?></span></span>

                </span>
				<?php /*Next button*/
				$n_paged = $per_page * $paged < $count ? $paged + 1 : 0;
				if ( $n_paged ) {
					$n_url = add_query_arg(
						array(
							'paged'       => $n_paged,
							'tmds_search' => $keyword,
						)
					); ?>
                    <a class="next-page button" href="<?php echo esc_url( $n_url ) ?>">
                        <span class="screen-reader-text"><?php esc_html_e( 'Next Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                        <span aria-hidden="true">›</span>
                    </a>
					<?php
				} else {
					?>
                    <span class="tablenav-pages-navspan button disabled" aria-hidden="true">›</span>
					<?php
				}
				if ( $total_page > $paged + 1 ) {
					$next_page_url = add_query_arg( [
						'paged'       => $total_page,
						'tmds_search' => $keyword,
					] );
					?>
                    <a class="next-page button" href="<?php echo esc_url( $next_page_url ) ?>">
                        <span class="screen-reader-text"><?php esc_html_e( 'Last Page', 'tmds-woocommerce-temu-dropshipping' ) ?></span>
                        <span aria-hidden="true">»</span>
                    </a>
					<?php
				} else {
					?>
                    <span class="tablenav-pages-navspan button disabled" aria-hidden="true">»</span>
					<?php
				}
				?>
            </div>
        </div>
        <p class="search-box">
            <input type="search" class="text short" name="tmds_search"
                   placeholder="<?php esc_attr_e( 'Search product in import list', 'tmds-woocommerce-temu-dropshipping' ) ?>"
                   value="<?php echo esc_attr( $keyword ) ?>">
            <input type="submit" name="submit" class="button"
                   value="<?php echo esc_attr__( 'Search product', 'tmds-woocommerce-temu-dropshipping' ) ?>">
        </p>
    </div>
</form>
