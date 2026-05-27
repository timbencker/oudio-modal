import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
	SelectControl,
	__experimentalUnitControl as UnitControl,
	TabPanel,
	Notice,
	ColorPicker,
	Popover,
	Button,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';

const UNITS = [
	{ value: 'px', label: 'px' },
	{ value: '%', label: '%' },
	{ value: 'vw', label: 'vw' },
];

export default function Edit( { attributes, setAttributes } ) {
	const {
		blockId,
		triggerClass,
		iframeSrc,
		iframeTitle,
		iframeAllow,
		iframeReferrerpolicy,
		iframeLazy,
		desktopWidth,
		desktopWidthUnit,
		tabletWidth,
		tabletWidthUnit,
		mobileWidth,
		mobileWidthUnit,
		overlayColor,
		animationDuration,
		showCloseButton,
		closeOnOverlayClick,
		closeOnEsc,
		enableTracking,
		oudioAppOrigin,
		metaPixelId,
		ga4MeasurementId,
		tiktokPixelId,
		shouldTrackFunction,
	} = attributes;

	const [ showColorPicker, setShowColorPicker ] = useState( false );

	// Generate a unique blockId on first insertion
	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( { blockId: 'oudio-modal-beta-' + uuidv4().slice( 0, 8 ) } );
		}
	}, [] );

	const blockProps = useBlockProps( {
		className: 'oudio-modal-beta-editor',
	} );

	const iframePreviewSrc = iframeSrc || 'about:blank';

	const iframeHostMismatch = ( () => {
		if ( ! enableTracking || ! iframeSrc?.trim() || ! oudioAppOrigin?.trim() ) {
			return false;
		}
		try {
			const iframeHost = new URL( iframeSrc ).host;
			const originHost = new URL( oudioAppOrigin ).host;
			return iframeHost !== originHost;
		} catch {
			return false;
		}
	} )();

	return (
		<>
			<InspectorControls>
				{/* ─── TRIGGER ─── */}
				<PanelBody
					title={ __( 'Trigger', 'oudio-modal-beta' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Trigger CSS Class', 'oudio-modal-beta' ) }
						help={ __(
							'Add this class to any element on the page to open this modal. Use a unique class per block when several modals share one page.',
							'oudio-modal-beta'
						) }
						value={ triggerClass }
						onChange={ ( v ) => setAttributes( { triggerClass: v } ) }
					/>
					{ triggerClass && (
						<Notice status="info" isDismissible={ false }>
							{ __( 'Add class ', 'oudio-modal-beta' ) }
							<code>{ triggerClass }</code>
							{ __( ' to any element to open this modal.', 'oudio-modal-beta' ) }
						</Notice>
					) }
				</PanelBody>

				{/* ─── IFRAME ─── */}
				<PanelBody
					title={ __( 'iFrame Settings', 'oudio-modal-beta' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'iFrame URL (src)', 'oudio-modal-beta' ) }
						help={ __( 'Paste the full URL of the checkout or embed page.', 'oudio-modal-beta' ) }
						value={ iframeSrc }
						onChange={ ( v ) => setAttributes( { iframeSrc: v } ) }
						type="url"
					/>
					<TextControl
						label={ __( 'iFrame Title (accessibility)', 'oudio-modal-beta' ) }
						value={ iframeTitle }
						onChange={ ( v ) => setAttributes( { iframeTitle: v } ) }
					/>
					<TextControl
						label={ __( 'allow attribute', 'oudio-modal-beta' ) }
						value={ iframeAllow }
						onChange={ ( v ) => setAttributes( { iframeAllow: v } ) }
					/>
					<TextControl
						label={ __( 'referrerpolicy', 'oudio-modal-beta' ) }
						value={ iframeReferrerpolicy }
						onChange={ ( v ) => setAttributes( { iframeReferrerpolicy: v } ) }
					/>
					<ToggleControl
						label={ __( 'Lazy load', 'oudio-modal-beta' ) }
						checked={ iframeLazy }
						onChange={ ( v ) => setAttributes( { iframeLazy: v } ) }
					/>
				</PanelBody>

				{/* ─── WIDTH (responsive) ─── */}
				<PanelBody
					title={ __( 'Modal Width', 'oudio-modal-beta' ) }
					initialOpen={ true }
				>
					<TabPanel
						tabs={ [
							{ name: 'desktop', title: __( '🖥 Desktop', 'oudio-modal-beta' ) },
							{ name: 'tablet',  title: __( '📱 Tablet', 'oudio-modal-beta' ) },
							{ name: 'mobile',  title: __( '📱 Mobile', 'oudio-modal-beta' ) },
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'desktop' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Width (px)', 'oudio-modal-beta' ) }
											value={ desktopWidth }
											onChange={ ( v ) => setAttributes( { desktopWidth: v } ) }
											min={ 100 }
											max={ 1400 }
											step={ 10 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-beta' ) }
											value={ desktopWidthUnit }
											options={ UNITS }
											onChange={ ( v ) => setAttributes( { desktopWidthUnit: v } ) }
										/>
									</>
								);
							}
							if ( tab.name === 'tablet' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Width (breakpoint ≤ 1024px)', 'oudio-modal-beta' ) }
											value={ tabletWidth }
											onChange={ ( v ) => setAttributes( { tabletWidth: v } ) }
											min={ 100 }
											max={ 1024 }
											step={ 10 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-beta' ) }
											value={ tabletWidthUnit }
											options={ UNITS }
											onChange={ ( v ) => setAttributes( { tabletWidthUnit: v } ) }
										/>
									</>
								);
							}
							if ( tab.name === 'mobile' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Width (breakpoint ≤ 767px)', 'oudio-modal-beta' ) }
											value={ mobileWidth }
											onChange={ ( v ) => setAttributes( { mobileWidth: v } ) }
											min={ 10 }
											max={ 100 }
											step={ 1 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-beta' ) }
											value={ mobileWidthUnit }
											options={ UNITS }
											onChange={ ( v ) => setAttributes( { mobileWidthUnit: v } ) }
										/>
									</>
								);
							}
						} }
					</TabPanel>
				</PanelBody>

				{/* ─── CONVERSION TRACKING ─── */}
				<PanelBody
					title={ __( 'Conversion tracking', 'oudio-modal-beta' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Oudio embed tracker', 'oudio-modal-beta' ) }
						help={ __(
							'Loads embed-tracker.js when at least one pixel ID is set below. Fires Purchase / StartTrial via your site’s gtag, fbq, or ttq when checkout completes in the iframe.',
							'oudio-modal-beta'
						) }
						checked={ enableTracking }
						onChange={ ( v ) => setAttributes( { enableTracking: v } ) }
					/>
					{ enableTracking &&
						! metaPixelId &&
						! ga4MeasurementId &&
						! tiktokPixelId && (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Add a Meta, GA4, or TikTok ID to load the tracker script.',
									'oudio-modal-beta'
								) }
							</Notice>
						) }
					{ enableTracking && iframeHostMismatch && (
						<Notice status="warning" isDismissible={ false }>
							{ __(
								'iFrame URL host should match Oudio app origin or postMessage and conversion pixels may not fire.',
								'oudio-modal-beta'
							) }
						</Notice>
					) }
					{ enableTracking && (
						<Notice status="info" isDismissible={ false }>
							{ __(
								'Your site must already load gtag, fbq, or ttq. See Oudio docs: Embed checkout – parent events & analytics.',
								'oudio-modal-beta'
							) }
						</Notice>
					) }
					<TextControl
						label={ __( 'Oudio app origin', 'oudio-modal-beta' ) }
						help={ __( 'e.g. https://staging.oudio.io or https://oudio.io', 'oudio-modal-beta' ) }
						value={ oudioAppOrigin }
						onChange={ ( v ) => setAttributes( { oudioAppOrigin: v } ) }
					/>
					<TextControl
						label={ __( 'Meta pixel ID (optional)', 'oudio-modal-beta' ) }
						help={ __(
							'Gates Meta Purchase when fbq is already on the page. Does not inject the pixel.',
							'oudio-modal-beta'
						) }
						value={ metaPixelId }
						onChange={ ( v ) => setAttributes( { metaPixelId: v } ) }
					/>
					<TextControl
						label={ __( 'GA4 measurement ID (optional)', 'oudio-modal-beta' ) }
						value={ ga4MeasurementId }
						onChange={ ( v ) => setAttributes( { ga4MeasurementId: v } ) }
					/>
					<TextControl
						label={ __( 'TikTok pixel ID (optional)', 'oudio-modal-beta' ) }
						value={ tiktokPixelId }
						onChange={ ( v ) => setAttributes( { tiktokPixelId: v } ) }
					/>
					<TextControl
						label={ __( 'Consent function name (optional)', 'oudio-modal-beta' ) }
						help={ __(
							'Global function on window; return false to skip Purchase / StartTrial (CMP). Example: myOudioShouldTrack',
							'oudio-modal-beta'
						) }
						value={ shouldTrackFunction }
						onChange={ ( v ) => setAttributes( { shouldTrackFunction: v } ) }
					/>
				</PanelBody>

				{/* ─── BEHAVIOUR ─── */}
				<PanelBody
					title={ __( 'Behaviour', 'oudio-modal-beta' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Animation Duration (ms)', 'oudio-modal-beta' ) }
						value={ animationDuration }
						onChange={ ( v ) => setAttributes( { animationDuration: v } ) }
						min={ 100 }
						max={ 1000 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Show Close Button', 'oudio-modal-beta' ) }
						checked={ showCloseButton }
						onChange={ ( v ) => setAttributes( { showCloseButton: v } ) }
					/>
					<ToggleControl
						label={ __( 'Close on Overlay Click', 'oudio-modal-beta' ) }
						checked={ closeOnOverlayClick }
						onChange={ ( v ) => setAttributes( { closeOnOverlayClick: v } ) }
					/>
					<ToggleControl
						label={ __( 'Close on ESC Key', 'oudio-modal-beta' ) }
						checked={ closeOnEsc }
						onChange={ ( v ) => setAttributes( { closeOnEsc: v } ) }
					/>
					<div style={ { marginTop: '16px' } }>
						<label style={ { display: 'block', marginBottom: '8px', fontWeight: 600 } }>
							{ __( 'Overlay Color', 'oudio-modal-beta' ) }
						</label>
						<Button
							style={ {
								background: overlayColor,
								width: '32px',
								height: '32px',
								border: '2px solid #ccc',
								borderRadius: '4px',
								cursor: 'pointer',
							} }
							onClick={ () => setShowColorPicker( ! showColorPicker ) }
						/>
						{ showColorPicker && (
							<Popover onClose={ () => setShowColorPicker( false ) }>
								<div style={ { padding: '16px' } }>
									<ColorPicker
										color={ overlayColor }
										onChange={ ( v ) => setAttributes( { overlayColor: v } ) }
										enableAlpha
									/>
								</div>
							</Popover>
						) }
					</div>
				</PanelBody>
			</InspectorControls>

			{/* ─── EDITOR PREVIEW ─── */}
			<div { ...blockProps }>
				<div className="oudio-modal-beta-editor__placeholder">
					<div className="oudio-modal-beta-editor__icon">
						<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<path d="M15 3v18" />
							<path d="M9 10l3 3-3 3" />
						</svg>
					</div>
					<h3>{ __( 'Oudio Modal Beta', 'oudio-modal-beta' ) }</h3>
					{ iframeSrc ? (
						<p>
							<strong>{ __( 'src:', 'oudio-modal-beta' ) }</strong>{ ' ' }
							<code>{ iframeSrc.length > 60 ? iframeSrc.slice( 0, 57 ) + '…' : iframeSrc }</code>
						</p>
					) : (
						<p className="oudio-modal-beta-editor__no-src">
							{ __( '⚠ No iframe src set — open the block settings panel on the right.', 'oudio-modal-beta' ) }
						</p>
					) }
					{ triggerClass && (
						<p>
							{ __( 'Trigger class: ', 'oudio-modal-beta' ) }
							<code>{ triggerClass }</code>
						</p>
					) }
					<p className="oudio-modal-beta-editor__sizes">
						🖥 { desktopWidth }{ desktopWidthUnit } &nbsp;|&nbsp;
						📱 { tabletWidth }{ tabletWidthUnit } (tablet) &nbsp;|&nbsp;
						📱 { mobileWidth }{ mobileWidthUnit } (mobile)
					</p>
				</div>
			</div>
		</>
	);
}
