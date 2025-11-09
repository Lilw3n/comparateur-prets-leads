<?php
/**
 * Functions and definitions for Lilwen54 Child Theme
 *
 * @package Lilwen54_Child
 * @since 1.0.0
 */

// Sécurité : empêcher l'accès direct au fichier
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

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

    // Charger le style du thème enfant (après le style parent)
    wp_enqueue_style(
        'child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( 'parent-style' ),
        wp_get_theme()->get( 'Version' )
    );
}
add_action( 'wp_enqueue_scripts', 'lilwen54_child_enqueue_styles' );

/**
 * Ajouter des fonctionnalités personnalisées ici
 * 
 * Exemples :
 * - Hooks WordPress
 * - Fonctions personnalisées
 * - Modifications du thème parent
 */

// Exemple : Ajouter un support pour les images mises en avant
add_theme_support( 'post-thumbnails' );

// Exemple : Ajouter un support pour les formats de publication
add_theme_support( 'post-formats', array( 'aside', 'gallery', 'quote', 'image', 'video' ) );

// Exemple : Ajouter un support pour les logos personnalisés
add_theme_support( 'custom-logo', array(
    'height'      => 100,
    'width'       => 400,
    'flex-height' => true,
    'flex-width'  => true,
) );

/**
 * Fonction pour ajouter des scripts personnalisés
 */
function lilwen54_child_enqueue_scripts() {
    // Exemple : Ajouter un script JavaScript personnalisé
    // wp_enqueue_script(
    //     'lilwen54-custom-script',
    //     get_stylesheet_directory_uri() . '/js/custom.js',
    //     array( 'jquery' ),
    //     '1.0.0',
    //     true
    // );
}
add_action( 'wp_enqueue_scripts', 'lilwen54_child_enqueue_scripts' );

/**
 * Personnaliser les couleurs du thème (exemple)
 */
function lilwen54_child_customize_colors() {
    // Ajoutez vos personnalisations de couleurs ici
}
// add_action( 'wp_head', 'lilwen54_child_customize_colors' );

/**
 * Modifier les fonctions du thème parent si nécessaire
 * 
 * Exemple : Pour surcharger une fonction du thème parent,
 * utilisez remove_action() puis add_action() avec votre propre fonction
 */

