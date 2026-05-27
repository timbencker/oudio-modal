<?php
/**
 * Server-side render template for the Oudio Modal Block.
 *
 * Available variables:
 *   $attributes  (array)  Block attributes
 *   $content     (string) Inner blocks HTML (empty – we have no inner blocks)
 *   $block       (WP_Block) Block instance
 *
 * @package OudioModalBeta
 */

$block_id         = esc_attr( $attributes['blockId'] ?? ( 'oudio-modal-beta-' . wp_unique_id() ) );
$trigger_class    = esc_attr( $attributes['triggerClass'] ?? 'oudio-open-modal-beta' );
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
$enable_tracking    = ! empty( $attributes['enableTracking'] );
$oudio_app_origin   = esc_url( $attributes['oudioAppOrigin'] ?? 'https://oudio.io' );
$meta_pixel_id      = sanitize_text_field( $attributes['metaPixelId'] ?? '' );
$ga4_measurement_id = sanitize_text_field( $attributes['ga4MeasurementId'] ?? '' );
$tiktok_pixel_id    = sanitize_text_field( $attributes['tiktokPixelId'] ?? '' );
$should_track_fn    = sanitize_text_field( $attributes['shouldTrackFunction'] ?? '' );
if ( $should_track_fn && ! preg_match( '/^[A-Za-z_$][\w$]*$/', $should_track_fn ) ) {
	$should_track_fn = '';
}

// Inline CSS custom properties – scoped to this block instance
$inline_style = sprintf(
	'--oudio-overlay-color:%s;--oudio-anim-duration:%dms;--oudio-modal-beta-width-desktop:%d%s;--oudio-modal-beta-width-tablet:%d%s;--oudio-modal-beta-width-mobile:%d%s',
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
	class="oudio-modal-beta-wrap"
	id="<?php echo $block_id; ?>-wrap"
	style="<?php echo $inline_style; ?>"
	aria-label="<?php esc_attr_e( 'Modal container', 'oudio-modal-beta' ); ?>"
>
	<?php /* ── Overlay backdrop ─────────────────────────────────── */ ?>
	<div
		class="oudio-modal-beta-overlay"
		aria-hidden="true"
	></div>

	<?php /* ── Sliding panel ───────────────────────────────────── */ ?>
	<div
		class="oudio-modal-beta-panel"
		id="<?php echo $block_id; ?>"
		role="dialog"
		aria-modal="true"
		aria-label="<?php echo $iframe_title; ?>"
		aria-hidden="true"
		<?php echo $panel_data; ?>
	>
		<?php if ( $show_close ) : ?>
		<button
			class="oudio-modal-beta-close"
			type="button"
			aria-label="<?php esc_attr_e( 'Close modal', 'oudio-modal-beta' ); ?>"
		>
			<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<line x1="3" y1="3" x2="19" y2="19"/>
			<line x1="19" y1="3" x2="3" y2="19"/>
		</svg>
		</button>
		<?php endif; ?>

		<?php /* ── iFrame ─────────────────────────────────────────── */ ?>
		<div class="oudio-modal-beta-iframe-wrap">
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
				<?php esc_html_e( 'No iframe URL configured. Edit the block and enter the embed URL.', 'oudio-modal-beta' ); ?>
			</div>
			<?php endif; ?>
		</div>
	</div>
</div>
<?php
$oudio_embed_adapters = array();
if ( $enable_tracking && $oudio_app_origin ) {
	if ( $meta_pixel_id ) {
		$oudio_embed_adapters[] = 'meta';
	}
	if ( $ga4_measurement_id ) {
		$oudio_embed_adapters[] = 'ga4';
	}
	if ( $tiktok_pixel_id ) {
		$oudio_embed_adapters[] = 'tiktok';
	}
}
?>
<?php if ( $enable_tracking && $oudio_app_origin && ! empty( $oudio_embed_adapters ) ) : ?>
<?php
	$json_hex            = JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
	$tracker_src         = trailingslashit( $oudio_app_origin ) . 'embed-tracker.js?v=2';
	$tracker_origin      = untrailingslashit( $oudio_app_origin );
	$tracker_selector    = '#' . $block_id . '-wrap .oudio-modal-beta-iframe-wrap iframe';
	$tracker_wrap_id     = $block_id . '-wrap';
	$tracker_err         = esc_js( __( 'Oudio embed tracker failed to load. Conversion events from checkout will not reach your pixels.', 'oudio-modal-beta' ) );
	$tracker_origin_js   = wp_json_encode( $tracker_origin, $json_hex );
	$tracker_sel_js      = wp_json_encode( $tracker_selector, $json_hex );
	$tracker_wrap_js     = wp_json_encode( $tracker_wrap_id, $json_hex );
	$tracker_block_js    = wp_json_encode( $block_id, $json_hex );
	$tracker_ga4_js      = wp_json_encode( $ga4_measurement_id, $json_hex );
	$tracker_meta_js     = wp_json_encode( $meta_pixel_id, $json_hex );
	$tracker_tiktok_js   = wp_json_encode( $tiktok_pixel_id, $json_hex );
	$tracker_consent_js  = wp_json_encode( $should_track_fn, $json_hex );
?>
<script>
(function () {
	var origin = <?php echo $tracker_origin_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var iframeSelector = <?php echo $tracker_sel_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var wrapId = <?php echo $tracker_wrap_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var blockId = <?php echo $tracker_block_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var ga4Id = <?php echo $tracker_ga4_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var metaId = <?php echo $tracker_meta_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var tiktokId = <?php echo $tracker_tiktok_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	var shouldTrackFnName = <?php echo $tracker_consent_js; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>;
	function wireOudioEmbedPixels(opts) {
		if (shouldTrackFnName && typeof window[shouldTrackFnName] === "function") {
			opts.shouldTrack = function () {
				return window[shouldTrackFnName]() !== false;
			};
		}
		opts.onPurchase = function (e) {
			if (!window.OudioEmbed) return;
			var ga = OudioEmbed.helpers.toGA4PurchaseParams(e);
			var meta = OudioEmbed.helpers.toMetaPurchaseParams(e);
			if (!ga4Id && window.dataLayer && Array.isArray(window.dataLayer)) {
				window.dataLayer.push(OudioEmbed.helpers.toDataLayerPurchase(e));
			}
			if (ga4Id && typeof window.gtag === "function") {
				window.gtag("event", "purchase", ga);
			}
			if (metaId && typeof window.fbq === "function") {
				var metaOpts = e.sessionId ? { eventID: e.sessionId } : {};
				window.fbq("track", "Purchase", meta, metaOpts);
			}
			if (tiktokId && typeof window.ttq === "object" && typeof window.ttq.track === "function") {
				window.ttq.track("CompletePayment", {
					content_id: e.productId || e.skuId || undefined,
					value: typeof e.amountCents === "number" ? e.amountCents / 100 : undefined,
					currency: e.currency ? e.currency.toUpperCase() : undefined,
				});
			}
		};
		opts.onTrialStarted = function (e) {
			if (metaId && typeof window.fbq === "function") {
				window.fbq("track", "StartTrial", { content_ids: [e.productId] });
			}
			if (ga4Id && typeof window.gtag === "function") {
				window.gtag("event", "start_trial", {
					items: [{ item_id: e.productId, quantity: 1 }],
				});
			}
		};
		opts.onClose = function () {
			var wrap = document.getElementById(wrapId);
			if (!wrap) return;
			wrap.dispatchEvent(
				new CustomEvent("oudio-modal-beta-request-close", { detail: { blockId: blockId } })
			);
		};
		opts.onPostMessageTargetMissing = function () {
			console.warn(
				"[Oudio modal] Checkout could not resolve an allowlisted parent origin for postMessage. " +
					"Ask Oudio to register this site in EMBED_ALLOWED_ORIGINS. Conversion tracking will not fire."
			);
		};
		opts.onError = function (message) {
			console.warn("[Oudio modal] Checkout error:", message);
		};
		return opts;
	}
	var initOpts = wireOudioEmbedPixels({ origin: origin, iframeSelector: iframeSelector });
	if (window.OudioEmbed && typeof window.OudioEmbed.enqueueInit === "function") {
		window.OudioEmbed.enqueueInit(initOpts);
	} else if (window.OudioEmbed && typeof window.OudioEmbed.init === "function") {
		window.OudioEmbed.init(initOpts);
	} else {
		window.__OUDIO_EMBED_PENDING_INIT__ = window.__OUDIO_EMBED_PENDING_INIT__ || [];
		window.__OUDIO_EMBED_PENDING_INIT__.push(initOpts);
	}
})();
</script>
<?php oudio_modal_beta_print_tracker_script_once( $tracker_src, $tracker_err ); ?>
<?php endif; ?>
