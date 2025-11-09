<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! $key || empty( $args ) || empty( $args['options'] ) ) {
	return;
}
$container_class       = implode( ' ', $args['class'] );
$container_id          = $args['id'] . '_field';
$label_id              = $args['id'];
$sort                  = $args['priority'] ?? '';
$label_id              .= '_' . current( array_keys( $args['options'] ) );
$args['label_class'][] = 'radio';
$args['input_class'][] = 'input-radio';
?>
<p class="<?php echo esc_attr( $container_class ); ?>" id="<?php echo esc_attr( $container_id ); ?>" data-priority="<?php echo esc_attr( $sort ) ?>">
    <label for="<?php echo esc_attr( $label_id ) ?>">
		<?php echo wp_kses_post( ( $args['label'] ?? '' ) . $required ); ?>
    </label>
    <span class="woocommerce-input-wrapper">
        <?php
        printf( '<span class="vifewc-options-wrap">' );
        foreach ( $args['options'] as $option_key => $option_text ) {
	        printf( '<label for="%1s" class="%2s"><input type="radio" class="%3s" value="%4s" name="%5s" %6s id="%7s" %8s><span>%9s</span></label>',
		        esc_attr( $args['id'] . '_' . $option_key ),
		        esc_attr( implode( ' ', $args['label_class'] ) ),
		        esc_attr( implode( ' ', $args['input_class'] ) ), esc_attr( $option_key ), esc_attr( $key ),
		        wp_kses_post(implode( ' ', isset($custom_attributes) && is_array($custom_attributes) ? $custom_attributes : array() )),
		        esc_attr( $args['id'] . '_' . $option_key ),
		        checked( $value, $option_key, false ),
		        esc_html( $option_text )
	        );
        }
        printf( '</span>' );
        if ( ! empty( $args['description'] ) ) {
	        printf( '<span class="description" id="%1s" aria-hidden="true">%2s</span>', esc_attr( $args['id'] . '-description' ), wp_kses_post( $args['description'] ) );
        }
        ?>
    </span>
</p>
