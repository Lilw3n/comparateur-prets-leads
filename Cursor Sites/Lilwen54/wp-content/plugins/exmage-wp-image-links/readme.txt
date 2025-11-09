=== EXMAGE - WordPress Image Links ===
Contributors: villatheme, mrt3vn
Donate link: http://www.villatheme.com/donate
Tags: elementor gallery with links, woocommerce product image external url,wordpress gallery custom links, wordpress gallery with links, wordpress image links
Requires at least: 5.0.0
Tested up to: 6.8.2
Requires PHP: 7.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Stable tag: trunk

Add images using external links - Save your storage with EXMAGE effortlessly

== Description ==

EXMAGE - WordPress Image Links helps you save storage by using external image URLs. These images are shown in Media library like normal images so that you can choose them for post/product featured image, WooCommerce product gallery... or everywhere that images are chosen from Media library.

[Try the Demo](https://new2new.com/?item=exmage "Demo EXMAGE - WordPress Image Links") | [Documents](https://docs.villatheme.com/?item=exmage "Documents") | [Pro Version](https://1.envato.market/N9DKr7 "Premium Version") | | [Facebook group](https://www.facebook.com/groups/villatheme "VillaTheme")

###Preview EXMAGE - WordPress Image Links
[youtube https://youtu.be/R_hNwUIGqIQ]

###How to install and use the plugin
[youtube https://youtu.be/KSQoZjM7yBI]

### Important Notice:

- This plugin only supports real image URLs that have correct image mime type. It does not support image URLs from an image hosting service(such as Flickr, Imgur, Photobucket ...) or a file storage service(such as Google drive)

- External images added by this plugin will no longer work if the plugin is not active

### FEATURES

- Ability to add single image URL on Upload files tab of the Media library

- Ability to add multiple image URLs at once on below the File upload on Upload New Media page

- External images have an icon to distinguish them from normal attachments.

- External images also have attachment ID like normal attachments so that you can use them wherever that allows to insert images from Media library such as Post/Product featured image, product gallery images, variation image, product category image...

- Compatible with ALD plugin: when this plugin is active, there will be an option named "Use external links for images" in the ALD plugin settings/Products. By enabling this option, AliExpress products imported by ALD plugin will use original AliExpress image URLs for product featured images, gallery images and variation images instead of saving images to your server.

=Integration=

`
if(class_exists( 'EXMAGE_WP_IMAGE_LINKS' )){
    $add_image = EXMAGE_WP_IMAGE_LINKS::add_image( $url, $image_id, $post_parent );
}
`
-$url: URL of the image you want to process
-$image_id: Passed by reference
-$post_parent: ID of the post that you want the image to be attached to. If empty, the image will not be attached to any post
-Return:
`
        [
        'url'       => $url,//Input URL
		'message'   => '',//Additional information
		'status'    => 'error',//error or success
		'id'        => '',//Attachment ID if added new or the attachment exists
		'edit_link' => '',//Attachment's edit link if added new or the attachment exists
		]
`
### MAY BE YOU NEED

[AFFI – Affiliate Marketing for WooCommerce](https://wordpress.org/plugins/affi-affiliate-marketing-for-woo)

[9Map – Map Multi Locations](https://wordpress.org/plugins/9map-map-multi-locations)

[TMDS - Dropshipping for TEMU and Woo](https://wordpress.org/plugins/tmds-dropshipping-for-temu-and-woo)

[DEPART - Deposit and Part payment for Woo](https://wordpress.org/plugins/depart-deposit-and-part-payment-for-woo)

[REES - Real Estate for Woo](https://wordpress.org/plugins/rees-real-estate-for-woo)

[HANDMADE - Dropshipping for Etsy and WooCommerce](https://wordpress.org/plugins/handmade-dropshipping-for-etsy-and-woo)

[HAPPY - Helpdesk Support Ticket System](https://wordpress.org/plugins/happy-helpdesk-support-ticket-system)

[GIFT4U - Gift Cards All in One for Woo](https://wordpress.org/plugins/gift4u-gift-cards-all-in-one-for-woo)

[SUBRE – Product Subscription for WooCommerce](https://wordpress.org/plugins/subre-product-subscription-for-woo)

[Clear Autoptimize Cache Automatically](https://wordpress.org/plugins/clear-autoptimize-cache-automatically)

[FEWC – WooCommerce Extra Checkout Fields](https://wordpress.org/plugins/fewc-extra-checkout-fields-for-woocommerce)

[EPOW – Custom Product Options for WooCommerce](https://wordpress.org/plugins/epow-custom-product-options-for-woocommerce)

[ChinaDS – Taobao Dropshipping for WooCommerce](https://wordpress.org/plugins/chinads-dropshipping-taobao-woocommerce)

[9MAIL – WordPress Email Templates Designer](https://wordpress.org/plugins/9mail-wp-email-templates-designer)

[EPOI – WP Points and Rewards](https://wordpress.org/plugins/epoi-wp-points-and-rewards)

[WebPOS – Point of Sale for WooCommerce](https://wordpress.org/plugins/webpos-point-of-sale-for-woocommerce)

[Jagif – WooCommerce Free Gift](https://wordpress.org/plugins/jagif-woo-free-gift)

[Coreem – Coupon Reminder for WooCommerce](https://wordpress.org/plugins/woo-coupon-reminder)

[COMPE – WooCommerce Compare Products](https://wordpress.org/plugins/compe-woo-compare-products)

[W2S – Migrate WooCommerce to Shopify](https://wordpress.org/plugins/w2s-migrate-woo-to-shopify)

[REDIS - WooCommerce Dynamic Pricing and Discounts](https://wordpress.org/plugins/redis-woo-dynamic-pricing-and-discounts)

[EXMAGE – WordPress Image Links](https://wordpress.org/plugins/exmage-wp-image-links)

[Pofily – WooCommerce Product Filters](https://wordpress.org/plugins/pofily-woo-product-filters)

[Bopo - WooCommerce Product Bundle Builder](https://wordpress.org/plugins/bopo-woo-product-bundle-builder)

[WPBulky – WordPress Bulk Edit Post Types](https://wordpress.org/plugins/wpbulky-wp-bulk-edit-post-types)

[Bulky - Bulk Edit Products for WooCommerce](https://wordpress.org/plugins/bulky-bulk-edit-products-for-woo)

[Catna – Woo Name Your Price and Offers](https://wordpress.org/plugins/catna-woo-name-your-price-and-offers)

[Product Size Chart For WooCommerce](https://wordpress.org/plugins/product-size-chart-for-woo)

[Product Pre-Orders for WooCommerce](https://wordpress.org/plugins/product-pre-orders-for-woo)

[Checkout Upsell Funnel for WooCommerce](https://wordpress.org/plugins/checkout-upsell-funnel-for-woo)

[Cart All In One For WooCommerce](https://wordpress.org/plugins/woo-cart-all-in-one)

[Email Template Customizer for WooCommerce](https://wordpress.org/plugins/email-template-customizer-for-woo)

[ALD - Dropshipping and Fulfillment for AliExpress and WooCommerce](https://wordpress.org/plugins/woo-alidropship)

[Product Variations Swatches for WooCommerce](https://wordpress.org/plugins/product-variations-swatches-for-woocommerce)

[Orders Tracking for WooCommerce](https://wordpress.org/plugins/woo-orders-tracking)

[Abandoned Cart Recovery For WooCommerce](https://wordpress.org/plugins/woo-abandoned-cart-recovery)

[Import Shopify to WooCommerce](https://wordpress.org/plugins/import-shopify-to-woocommerce)

[Customer Coupons for WooCommerce](https://wordpress.org/plugins/woo-customer-coupons)

[Virtual Reviews for WooCommerce](https://wordpress.org/plugins/woo-virtual-reviews)

[Thank You Page Customizer for WooCommerce](https://wordpress.org/plugins/woo-thank-you-page-customizer)

[Sales Countdown Timer](https://wordpress.org/plugins/sales-countdown-timer)

[Suggestion Engine for WooCommerce](https://wordpress.org/plugins/woo-suggestion-engine)

[EU Cookies Bar](https://wordpress.org/plugins/eu-cookies-bar)

[Lucky Wheel for WooCommerce](https://wordpress.org/plugins/woo-lucky-wheel)

[WordPress Lucky Wheel](https://wordpress.org/plugins/wp-lucky-wheel)

[Advanced Product Information for WooCommerce](https://wordpress.org/plugins/woo-advanced-product-information)

[LookBook for WooCommerce](https://wordpress.org/plugins/woo-lookbook)

[Photo Reviews for WooCommerce](https://wordpress.org/plugins/woo-photo-reviews)

[Product Builder for WooCommerce](https://wordpress.org/plugins/woo-product-builder)

[Boost Sales for WooCommerce](https://wordpress.org/plugins/woo-boost-sales)

[Free Shipping Bar for WooCommerce](https://wordpress.org/plugins/woo-free-shipping-bar)

[Notification for WooCommerce](https://wordpress.org/plugins/woo-notification)

[CURCY – Multi Currency for WooCommerce](https://wordpress.org/plugins/woo-multi-currency)

[Coupon Box for WooCommerce](https://wordpress.org/plugins/woo-coupon-box)

[VARGAL - Additional Variation Gallery for Woo](https://wordpress.org/plugins/vargal-additional-variation-gallery-for-woo/)

### Plugin Links

- [Project Page](https://villatheme.com/extensions/exmage-wordpress-image-links/)
- [Report Bugs/Issues](https://villatheme.com/knowledge-base/security-is-our-priority/)

== Installation ==

1. Unzip the download package
2. Upload `exmage-wp-image-links` to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

== Screenshots ==
1. Photos added to gallery using external link
2. Add images using external link in "Add Media File"
3. Add image using external link on Upload popup
4. AI generated Alt text
5. Display video anywhere using shortcode
6. Video displayed using shortcode

== Changelog ==
/**1.1.0 - 2025.09.05**/
– Updated: Updated to new interface
– Updated: Compatible with WC 10.1.2
– Updated: Update support class

/**1.0.25 - 2025.07.26**/
– Updated: Compatible with WP 6.8.2 and WC 10.0.3
– Updated: Update support class

/**1.0.24 - 2025.04.18**/
– Updated: Compatible with WP 6.8 and WC 9.8
– Updated: Update support class

/**1.0.23 - 2025.03.03**/
- Fixed: Fixed call to undefined function get_current_screen()

/**1.0.22 - 2025.02.28**/
- Added: Added filter images by Exmage on the upload.php page
- Added: Bulk download external images on the upload.php page.
– Updated: Compatible with WP 6.7.2 and WC 9.7
– Updated: Update support class

/**1.0.21 - 2025.01.20**/
– Updated: Compatible with WC 9.5.2
– Updated: Update support class

/**1.0.20 - 2024.12.06**/
– Updated: Compatible with WP 6.7.1 and  WC 9.4.3
- Fixed: Cannot add image by URL in Media

/**1.0.19 - 2024.11.21**/
– Updated: Compatible with WP 6.7 and  WC 9.4
– Updated: Update support class

/**1.0.18 - 2024.06.14**/
– Updated: Update support class

/**1.0.17 - 2024.04.13**/
– Updated: Compatible with WP 6.5
– Updated: Update support class

/**1.0.16 - 2023.09.06**/
- Updated: Add stop processing button

/**1.0.15 - 2023.05.12**/
- Updated: Keep exmage link of product when import product from csv

/**1.0.14 - 2023.01.11**/
- Updated: If the number of images is greater than threshold(20 by default, able to change via exmage_ajax_handle_url_threshold hook), they will be processed in the background
- Updated: Compatible with WPML's attachment translations feature
- Dev: Added exmage_insert_attachment_image_name filter hook

/**1.0.13 - 2023.01.10**/
- Fixed: Compatibility issue with Photon CDN(Jetpack)
- Dev: Added exmage_get_supported_image_sizes, exmage_image_size_url filter hooks

/**1.0.12 - 2022.11.17**/
- Fixed: Image URL processing in some cases
- Updated: Compatibility check with WP 6.1

/**1.0.11 - 2022.08.29**/
- Dev: Added exmage_get_supported_mime_types filter hook

/**1.0.10 - 2022.07.22**/
- Updated: VillaTheme_Support
- Updated: Data sanitization/escaping check

/**1.0.9 - 2022.05.07**/
- Fixed: Error with URLs that contains more than 255 characters

/**1.0.8 - 2022.04.19**/
- Updated: VillaTheme_Support

/**1.0.7 - 2022.04.14**/
- Fixed: Use wp_http_validate_url before remote call

/**1.0.6 - 2022.03.29**/
- Updated: VillaTheme_Support

/**1.0.5 - 2022.03.28**/
- Fixed: Use wp_safe_remote_get instead of wp_remote_get to avoid redirection and request forgery attacks

/**1.0.4 - 2022.03.21**/
- Updated: VillaTheme_Support

/**1.0.3 - 2022.01.14**/
- Optimized: Enqueue script

/**1.0.2.2 - 2022.01.10**/
- Updated: VillaTheme_Support

/**1.0.2.1 - 2021.12.13**/
- Updated: Missing css/image files for class VillaTheme_Support

/**1.0.2 - 2021.12.11**/
- Added: Button to store external images to server in Media library/list view mode

/**1.0.1 - 2021.12.08**/
- Updated: Do not allow to edit(crop, rotate...) external images to avoid unexpected errors

/**1.0.0 - 2021.12.07**/
 - Released