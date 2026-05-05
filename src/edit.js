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
	} = attributes;

	const [ showColorPicker, setShowColorPicker ] = useState( false );

	// Generate a unique blockId on first insertion
	useEffect( () => {
		if ( ! blockId ) {
			setAttributes( { blockId: 'oudio-modal-' + uuidv4().slice( 0, 8 ) } );
		}
	}, [] );

	const blockProps = useBlockProps( {
		className: 'oudio-modal-block-editor',
	} );

	const iframePreviewSrc = iframeSrc || 'about:blank';

	return (
		<>
			<InspectorControls>
				{/* ─── TRIGGER ─── */}
				<PanelBody
					title={ __( 'Trigger', 'oudio-modal-block' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Trigger CSS Class', 'oudio-modal-block' ) }
						help={ __(
							'Add this class to any element on the page to make it open this modal.',
							'oudio-modal-block'
						) }
						value={ triggerClass }
						onChange={ ( v ) => setAttributes( { triggerClass: v } ) }
					/>
					{ triggerClass && (
						<Notice status="info" isDismissible={ false }>
							{ __( 'Add class ', 'oudio-modal-block' ) }
							<code>{ triggerClass }</code>
							{ __( ' to any element to open this modal.', 'oudio-modal-block' ) }
						</Notice>
					) }
				</PanelBody>

				{/* ─── IFRAME ─── */}
				<PanelBody
					title={ __( 'iFrame Settings', 'oudio-modal-block' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'iFrame URL (src)', 'oudio-modal-block' ) }
						help={ __( 'Paste the full URL of the checkout or embed page.', 'oudio-modal-block' ) }
						value={ iframeSrc }
						onChange={ ( v ) => setAttributes( { iframeSrc: v } ) }
						type="url"
					/>
					<TextControl
						label={ __( 'iFrame Title (accessibility)', 'oudio-modal-block' ) }
						value={ iframeTitle }
						onChange={ ( v ) => setAttributes( { iframeTitle: v } ) }
					/>
					<TextControl
						label={ __( 'allow attribute', 'oudio-modal-block' ) }
						value={ iframeAllow }
						onChange={ ( v ) => setAttributes( { iframeAllow: v } ) }
					/>
					<TextControl
						label={ __( 'referrerpolicy', 'oudio-modal-block' ) }
						value={ iframeReferrerpolicy }
						onChange={ ( v ) => setAttributes( { iframeReferrerpolicy: v } ) }
					/>
					<ToggleControl
						label={ __( 'Lazy load', 'oudio-modal-block' ) }
						checked={ iframeLazy }
						onChange={ ( v ) => setAttributes( { iframeLazy: v } ) }
					/>
				</PanelBody>

				{/* ─── WIDTH (responsive) ─── */}
				<PanelBody
					title={ __( 'Modal Width', 'oudio-modal-block' ) }
					initialOpen={ true }
				>
					<TabPanel
						tabs={ [
							{ name: 'desktop', title: __( '🖥 Desktop', 'oudio-modal-block' ) },
							{ name: 'tablet',  title: __( '📱 Tablet', 'oudio-modal-block' ) },
							{ name: 'mobile',  title: __( '📱 Mobile', 'oudio-modal-block' ) },
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'desktop' ) {
								return (
									<>
										<RangeControl
											label={ __( 'Width (px)', 'oudio-modal-block' ) }
											value={ desktopWidth }
											onChange={ ( v ) => setAttributes( { desktopWidth: v } ) }
											min={ 100 }
											max={ 1400 }
											step={ 10 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-block' ) }
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
											label={ __( 'Width (breakpoint ≤ 1024px)', 'oudio-modal-block' ) }
											value={ tabletWidth }
											onChange={ ( v ) => setAttributes( { tabletWidth: v } ) }
											min={ 100 }
											max={ 1024 }
											step={ 10 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-block' ) }
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
											label={ __( 'Width (breakpoint ≤ 767px)', 'oudio-modal-block' ) }
											value={ mobileWidth }
											onChange={ ( v ) => setAttributes( { mobileWidth: v } ) }
											min={ 10 }
											max={ 100 }
											step={ 1 }
										/>
										<SelectControl
											label={ __( 'Unit', 'oudio-modal-block' ) }
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

				{/* ─── BEHAVIOUR ─── */}
				<PanelBody
					title={ __( 'Behaviour', 'oudio-modal-block' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Animation Duration (ms)', 'oudio-modal-block' ) }
						value={ animationDuration }
						onChange={ ( v ) => setAttributes( { animationDuration: v } ) }
						min={ 100 }
						max={ 1000 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Show Close Button', 'oudio-modal-block' ) }
						checked={ showCloseButton }
						onChange={ ( v ) => setAttributes( { showCloseButton: v } ) }
					/>
					<ToggleControl
						label={ __( 'Close on Overlay Click', 'oudio-modal-block' ) }
						checked={ closeOnOverlayClick }
						onChange={ ( v ) => setAttributes( { closeOnOverlayClick: v } ) }
					/>
					<ToggleControl
						label={ __( 'Close on ESC Key', 'oudio-modal-block' ) }
						checked={ closeOnEsc }
						onChange={ ( v ) => setAttributes( { closeOnEsc: v } ) }
					/>
					<div style={ { marginTop: '16px' } }>
						<label style={ { display: 'block', marginBottom: '8px', fontWeight: 600 } }>
							{ __( 'Overlay Color', 'oudio-modal-block' ) }
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
				<div className="oudio-modal-block-editor__placeholder">
					<div className="oudio-modal-block-editor__icon">
						<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<path d="M15 3v18" />
							<path d="M9 10l3 3-3 3" />
						</svg>
					</div>
					<h3>{ __( 'Oudio Modal Block', 'oudio-modal-block' ) }</h3>
					{ iframeSrc ? (
						<p>
							<strong>{ __( 'src:', 'oudio-modal-block' ) }</strong>{ ' ' }
							<code>{ iframeSrc.length > 60 ? iframeSrc.slice( 0, 57 ) + '…' : iframeSrc }</code>
						</p>
					) : (
						<p className="oudio-modal-block-editor__no-src">
							{ __( '⚠ No iframe src set — open the block settings panel on the right.', 'oudio-modal-block' ) }
						</p>
					) }
					{ triggerClass && (
						<p>
							{ __( 'Trigger class: ', 'oudio-modal-block' ) }
							<code>{ triggerClass }</code>
						</p>
					) }
					<p className="oudio-modal-block-editor__sizes">
						🖥 { desktopWidth }{ desktopWidthUnit } &nbsp;|&nbsp;
						📱 { tabletWidth }{ tabletWidthUnit } (tablet) &nbsp;|&nbsp;
						📱 { mobileWidth }{ mobileWidthUnit } (mobile)
					</p>
				</div>
			</div>
		</>
	);
}
