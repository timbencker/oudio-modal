<?php
/**
 * Server-side render template for the Oudio Modal Block.
 *
 * Available variables:
 *   $attributes  (array)  Block attributes
 *   $content     (string) Inner blocks HTML (empty – we have no inner blocks)
 *   $block       (WP_Block) Block instance
 *
 * @package OudioModalBlock
 */

$block_id         = esc_attr( $attributes['blockId'] ?? ( 'oudio-modal-' . wp_unique_id() ) );
$trigger_class    = esc_attr( $attributes['triggerClass'] ?? 'oudio-open-modal' );
$iframe_src       = esc_url( $attributes['iframeSrc'] ?? '' );
$iframe_title     = esc_attr( $attributes['iframeTitle'] ?? 'Checkout' );
$iframe_allow     = esc_attr( $attributes['iframeAllow'] ?? 'payment *' );
$iframe_referrer  = esc_attr( $attributes['iframeReferrerpolicy'] ?? 'strict-origin-when-cross-origin' );
$iframe_lazy      = ! empty( $attributes['iframeLazy'] ) ? 'lazy' : 'eager';

$desktop_width      = (int) ( $attributes['desktopWidth'] ?? 480 );
$desktop_unit       = esc_attr( $attributes['desktopWidthUnit'] ?? 'px' );
$tablet_width       = (int) ( $attributes['tabletWidth'] ?? 420 );
$tablet_unit        = esc_attr( $attributes['tabletWidthUnit'] ?? 'px' );
$mobile_width       = (int) ( $attributes['mobileWidth'] ?? 100 );
$mobile_unit        = esc_attr( $attributes['mobileWidthUnit'] ?? 'vw' );

$overlay_color      = esc_attr( $attributes['overlayColor'] ?? 'rgba(0,0,0,0.5)' );
$anim_duration      = (int) ( $attributes['animationDuration'] ?? 380 );
$show_close         = ! empty( $attributes['showCloseButton'] );
$close_on_overlay   = ! empty( $attributes['closeOnOverlayClick'] ) ? '1' : '0';
$close_on_esc       = ! empty( $attributes['closeOnEsc'] ) ? '1' : '0';

// Inline CSS custom properties – scoped to this block instance
$inline_style = sprintf(
	'--oudio-overlay-color:%s;--oudio-anim-duration:%dms;--oudio-modal-width-desktop:%d%s;--oudio-modal-width-tablet:%d%s;--oudio-modal-width-mobile:%d%s',
	$overlay_color,
	$anim_duration,
	$desktop_width, $desktop_unit,
	$tablet_width,  $tablet_unit,
	$mobile_width,  $mobile_unit
);

// Panel data attributes – read by view.js
$panel_data = sprintf(
	'data-block-id="%s" data-trigger-class="%s" data-close-on-overlay-click="%s" data-close-on-esc="%s" data-duration="%d"',
	$block_id,
	$trigger_class,
	$close_on_overlay,
	$close_on_esc,
	$anim_duration
);
?>
<div
	class="oudio-modal-wrap"
	id="<?php echo $block_id; ?>-wrap"
	style="<?php echo $inline_style; ?>"
	aria-label="<?php esc_attr_e( 'Modal container', 'oudio-modal-block' ); ?>"
>
	<?php /* ── Overlay backdrop ─────────────────────────────────── */ ?>
	<div
		class="oudio-modal-overlay"
		aria-hidden="true"
	></div>

	<?php /* ── Sliding panel ───────────────────────────────────── */ ?>
	<div
		class="oudio-modal-panel"
		id="<?php echo $block_id; ?>"
		role="dialog"
		aria-modal="true"
		aria-label="<?php echo $iframe_title; ?>"
		aria-hidden="true"
		<?php echo $panel_data; ?>
	>
		<?php if ( $show_close ) : ?>
		<button
			class="oudio-modal-close"
			type="button"
			aria-label="<?php esc_attr_e( 'Close modal', 'oudio-modal-block' ); ?>"
		>
			<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<line x1="3" y1="3" x2="19" y2="19"/>
			<line x1="19" y1="3" x2="3" y2="19"/>
		</svg>
		</button>
		<?php endif; ?>

		<?php /* ── iFrame ─────────────────────────────────────────── */ ?>
		<div class="oudio-modal-iframe-wrap">
			<?php if ( $iframe_src ) : ?>
			<iframe
				title="<?php echo $iframe_title; ?>"
				src="<?php echo $iframe_src; ?>"
				loading="<?php echo $iframe_lazy; ?>"
				allow="<?php echo $iframe_allow; ?>"
				referrerpolicy="<?php echo $iframe_referrer; ?>"
				style="width:100%;height:100%;border:0;display:block;"
			></iframe>
			<?php else : ?>
			<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-family:sans-serif;font-size:14px;padding:24px;text-align:center;">
				<?php esc_html_e( 'No iframe URL configured. Edit the block and enter the embed URL.', 'oudio-modal-block' ); ?>
			</div>
			<?php endif; ?>
		</div>
	</div>
</div>
