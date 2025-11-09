<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! $key || empty( $args ) ) {
	return;
}
$container_class = implode( ' ', $args['class'] );
$container_id    = $args['id'] . '_field';
$sort            = $args['priority'] ?? '';
$html_type       = $args['html_type'] ?? 'div';
printf( '<div class="%1s" id="%2s" data-priority="%3s">', esc_attr( $container_class ), esc_attr( $container_id ), esc_attr( $sort ) );
printf( '<%1s>%2s</%3s>', esc_attr( $html_type ), do_shortcode(wp_kses_post( $value) ), esc_attr( $html_type ) );
printf( '</div>' );
?>