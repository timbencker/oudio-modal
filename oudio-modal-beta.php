<?php
/**
 * Plugin Name:       Oudio Modal Beta
 * Plugin URI:        https://oudio.io
 * Description:       Gutenberg slide-in checkout modal (beta). Install alongside the legacy Oudio Modal Block plugin under a different folder name.
 * Version:           1.2.1
 * Requires at least: 6.3
 * Requires PHP:      8.0
 * Author:            Oudio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       oudio-modal-beta
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OUDIO_MODAL_BETA_VERSION', '1.2.1' );
define( 'OUDIO_MODAL_BETA_DIR', plugin_dir_path( __FILE__ ) );
define( 'OUDIO_MODAL_BETA_URL', plugin_dir_url( __FILE__ ) );

/**
 * Print embed-tracker.js once per page when multiple blocks enable tracking.
 *
 * @param string $tracker_src Tracker script URL.
 * @param string $tracker_err Escaped onerror message.
 */
function oudio_modal_beta_print_tracker_script_once( string $tracker_src, string $tracker_err ): void {
	static $printed = false;
	if ( $printed ) {
		return;
	}
	$printed = true;
	?>
<script src="<?php echo esc_url( $tracker_src ); ?>" defer onerror="console.warn('<?php echo $tracker_err; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>')"></script>
	<?php
}

/**
 * Register the Gutenberg block.
 */
function oudio_modal_beta_block_init(): void {
	register_block_type( OUDIO_MODAL_BETA_DIR . 'build' );
}
add_action( 'init', 'oudio_modal_beta_block_init' );
