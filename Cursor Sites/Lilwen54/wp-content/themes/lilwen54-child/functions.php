<?php
/**
 * Functions and definitions for Lilwen54 Modern Child Theme
 *
 * @package Lilwen54_Child
 * @since 1.0.0
 */

// Sécurité : empêcher l'accès direct au fichier
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Constante pour activer/désactiver le thème moderne facilement
define( 'LILWEN54_MODERN_MODE', true ); // Mettre à false pour désactiver rapidement

/**
 * Enqueue parent and child theme styles
 */
function lilwen54_child_enqueue_styles() {
    // Charger le style du thème parent
    wp_enqueue_style(
        'parent-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->parent()->get( 'Version' )
    );

    // Si le mode moderne est activé, charger les styles modernes
    if ( LILWEN54_MODERN_MODE ) {
        // Vérifier si les assets sont buildés
        $manifest_path = get_stylesheet_directory() . '/dist/.vite/manifest.json';
        
        if ( file_exists( $manifest_path ) ) {
            $manifest = json_decode( file_get_contents( $manifest_path ), true );
            
            // Charger le CSS principal
            if ( isset( $manifest['src/styles/main.css'] ) ) {
                wp_enqueue_style(
                    'lilwen54-modern-style',
                    get_stylesheet_directory_uri() . '/dist/' . $manifest['src/styles/main.css']['file'],
                    array( 'parent-style' ),
                    filemtime( get_stylesheet_directory() . '/dist/' . $manifest['src/styles/main.css']['file'] )
                );
            }
        } else {
            // Fallback : charger le style.css classique
            wp_enqueue_style(
                'child-style',
                get_stylesheet_directory_uri() . '/style.css',
                array( 'parent-style' ),
                wp_get_theme()->get( 'Version' )
            );
        }
    } else {
        // Mode classique : charger uniquement le style.css
        wp_enqueue_style(
            'child-style',
            get_stylesheet_directory_uri() . '/style.css',
            array( 'parent-style' ),
            wp_get_theme()->get( 'Version' )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'lilwen54_child_enqueue_styles' );

/**
 * Enqueue modern scripts (React, Vue, etc.)
 */
function lilwen54_child_enqueue_modern_scripts() {
    if ( ! LILWEN54_MODERN_MODE ) {
        return; // Ne rien charger si le mode moderne est désactivé
    }

    $manifest_path = get_stylesheet_directory() . '/dist/.vite/manifest.json';
    
    if ( ! file_exists( $manifest_path ) ) {
        return; // Pas de build, ne rien charger
    }

    $manifest = json_decode( file_get_contents( $manifest_path ), true );

    // Charger le script principal
    if ( isset( $manifest['src/main.js'] ) ) {
        wp_enqueue_script(
            'lilwen54-modern-main',
            get_stylesheet_directory_uri() . '/dist/' . $manifest['src/main.js']['file'],
            array(),
            filemtime( get_stylesheet_directory() . '/dist/' . $manifest['src/main.js']['file'] ),
            true
        );
    }

    // Charger React app si nécessaire
    if ( isset( $manifest['src/react-app.jsx'] ) ) {
        wp_enqueue_script(
            'lilwen54-react-app',
            get_stylesheet_directory_uri() . '/dist/' . $manifest['src/react-app.jsx']['file'],
            array( 'lilwen54-modern-main' ),
            filemtime( get_stylesheet_directory() . '/dist/' . $manifest['src/react-app.jsx']['file'] ),
            true
        );
    }

    // Charger Vue app si nécessaire
    if ( isset( $manifest['src/vue-app.js'] ) ) {
        wp_enqueue_script(
            'lilwen54-vue-app',
            get_stylesheet_directory_uri() . '/dist/' . $manifest['src/vue-app.js']['file'],
            array( 'lilwen54-modern-main' ),
            filemtime( get_stylesheet_directory() . '/dist/' . $manifest['src/vue-app.js']['file'] ),
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'lilwen54_child_enqueue_modern_scripts' );

/**
 * Support des fonctionnalités WordPress
 */
add_theme_support( 'post-thumbnails' );
add_theme_support( 'title-tag' );
add_theme_support( 'custom-logo', array(
    'height'      => 100,
    'width'       => 400,
    'flex-height' => true,
    'flex-width'  => true,
) );
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
add_theme_support( 'responsive-embeds' );
add_theme_support( 'align-wide' );

/**
 * Ajouter des attributs pour améliorer les performances
 */
function lilwen54_add_script_attributes( $tag, $handle ) {
    if ( strpos( $handle, 'lilwen54' ) !== false ) {
        return str_replace( ' src', ' defer src', $tag );
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'lilwen54_add_script_attributes', 10, 2 );

/**
 * Fonction de désactivation d'urgence
 * Appelez cette fonction pour désactiver complètement le thème moderne
 */
function lilwen54_emergency_disable() {
    // Cette fonction peut être appelée depuis wp-config.php ou un plugin
    // define( 'LILWEN54_MODERN_MODE', false );
}

/**
 * Ajouter des classes au body pour le styling
 */
function lilwen54_body_classes( $classes ) {
    if ( LILWEN54_MODERN_MODE ) {
        $classes[] = 'lilwen54-modern';
    } else {
        $classes[] = 'lilwen54-classic';
    }
    return $classes;
}
add_filter( 'body_class', 'lilwen54_body_classes' );

/**
 * Shortcode pour afficher des composants React/Vue
 */
function lilwen54_react_component_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'component' => 'hero',
        'id' => '',
    ), $atts );

    $id = ! empty( $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
    
    return '<div ' . $id . ' data-react-app="' . esc_attr( $atts['component'] ) . '"></div>';
}
add_shortcode( 'lilwen54_react', 'lilwen54_react_component_shortcode' );

function lilwen54_vue_component_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'component' => 'hero',
        'id' => '',
    ), $atts );

    $id = ! empty( $atts['id'] ) ? 'id="' . esc_attr( $atts['id'] ) . '"' : '';
    
    return '<div ' . $id . ' data-vue-app="' . esc_attr( $atts['component'] ) . '"></div>';
}
add_shortcode( 'lilwen54_vue', 'lilwen54_vue_component_shortcode' );
