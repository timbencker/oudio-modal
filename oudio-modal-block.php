<?php
/**
 * Plugin Name:       Oudio Modal Block
 * Plugin URI:        https://oudio.io
 * Description:       A Gutenberg block that renders a full-height slide-in modal from the right, triggered by any element with a custom CSS class. Supports an iframe embed (e.g. Oudio Checkout) with separate width settings for desktop, tablet and mobile.
 * Version:           1.0.0
 * Requires at least: 6.3
 * Requires PHP:      8.0
 * Author:            Oudio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       oudio-modal-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OUDIO_MODAL_BLOCK_VERSION', '1.0.0' );
define( 'OUDIO_MODAL_BLOCK_DIR', plugin_dir_path( __FILE__ ) );
define( 'OUDIO_MODAL_BLOCK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register the Gutenberg block.
 */
function oudio_modal_block_init(): void {
	register_block_type( OUDIO_MODAL_BLOCK_DIR . 'build' );
}
add_action( 'init', 'oudio_modal_block_init' );

/**
 * Enqueue frontend CSS + JS (only when block is present on page).
 * The block's render_callback already handles the script / style via
 * block.json's viewScript / style entries, but we also enqueue globally
 * so triggered modals work when the block is inside a reusable block or
 * template part that has already been cached.
 */
function oudio_modal_block_enqueue_frontend(): void {
	if ( ! is_admin() ) {
		wp_enqueue_style(
			'oudio-modal-block-frontend',
			OUDIO_MODAL_BLOCK_URL . 'build/style-index.css',
			[],
			OUDIO_MODAL_BLOCK_VERSION
		);
		wp_enqueue_script(
			'oudio-modal-block-view',
			OUDIO_MODAL_BLOCK_URL . 'build/view.js',
			[],
			OUDIO_MODAL_BLOCK_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'oudio_modal_block_enqueue_frontend' );
