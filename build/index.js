/**
 * Oudio Modal Block – build/index.js
 *
 * Pre-built editor script. Registers the block with a minimal editor UI.
 * For the full React inspector UI, run `npm run build` in the plugin directory.
 *
 * This file is the fallback that makes the block USABLE without npm:
 * - The block appears in the inserter
 * - Settings are shown as basic text inputs in the block sidebar
 * - Server-side rendering (render.php) handles the frontend
 */

( function ( blocks, blockEditor, element, components, i18n ) {
	var el              = element.createElement;
	var useBlockProps   = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody       = components.PanelBody;
	var TextControl     = components.TextControl;
	var ToggleControl   = components.ToggleControl;
	var RangeControl    = components.RangeControl;
	var SelectControl   = components.SelectControl;
	var TabPanel        = components.TabPanel;
	var Notice          = components.Notice;
	var __              = i18n.__;

	var UNITS = [
		{ value: 'px',  label: 'px' },
		{ value: '%',   label: '%' },
		{ value: 'vw',  label: 'vw' },
	];

	function Edit( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;

		// Generate blockId on first use
		if ( ! attrs.blockId ) {
			setAttrs( { blockId: 'oudio-modal-' + Math.random().toString(36).slice(2,10) } );
		}

		var blockProps = useBlockProps( { className: 'oudio-modal-block-editor' } );

		return el(
			element.Fragment,
			null,

			/* ── Inspector sidebar ─────────────────────────────── */
			el( InspectorControls, null,

				/* Trigger */
				el( PanelBody, { title: __( 'Trigger', 'oudio-modal-block' ), initialOpen: true },
					el( TextControl, {
						label:    __( 'Trigger CSS Class', 'oudio-modal-block' ),
						help:     __( 'Add this class to any element to open the modal.', 'oudio-modal-block' ),
						value:    attrs.triggerClass,
						onChange: function( v ) { setAttrs( { triggerClass: v } ); },
					} ),
					attrs.triggerClass && el( Notice, { status: 'info', isDismissible: false },
						__( 'Class: ', 'oudio-modal-block' ),
						el( 'code', null, attrs.triggerClass )
					)
				),

				/* iFrame */
				el( PanelBody, { title: __( 'iFrame Settings', 'oudio-modal-block' ), initialOpen: true },
					el( TextControl, {
						label:    __( 'iFrame URL (src)', 'oudio-modal-block' ),
						value:    attrs.iframeSrc,
						type:     'url',
						onChange: function( v ) { setAttrs( { iframeSrc: v } ); },
					} ),
					el( TextControl, {
						label:    __( 'iFrame Title', 'oudio-modal-block' ),
						value:    attrs.iframeTitle,
						onChange: function( v ) { setAttrs( { iframeTitle: v } ); },
					} ),
					el( TextControl, {
						label:    __( 'allow attribute', 'oudio-modal-block' ),
						value:    attrs.iframeAllow,
						onChange: function( v ) { setAttrs( { iframeAllow: v } ); },
					} ),
					el( TextControl, {
						label:    __( 'referrerpolicy', 'oudio-modal-block' ),
						value:    attrs.iframeReferrerpolicy,
						onChange: function( v ) { setAttrs( { iframeReferrerpolicy: v } ); },
					} ),
					el( ToggleControl, {
						label:    __( 'Lazy load', 'oudio-modal-block' ),
						checked:  attrs.iframeLazy,
						onChange: function( v ) { setAttrs( { iframeLazy: v } ); },
					} )
				),

				/* Width */
				el( PanelBody, { title: __( 'Modal Width', 'oudio-modal-block' ), initialOpen: true },
					el( TabPanel, {
						tabs: [
							{ name: 'desktop', title: '🖥 Desktop' },
							{ name: 'tablet',  title: '📱 Tablet (≤1024px)' },
							{ name: 'mobile',  title: '📱 Mobile (≤767px)' },
						],
					}, function( tab ) {
						if ( tab.name === 'desktop' ) {
							return el( element.Fragment, null,
								el( RangeControl, {
									label:    __( 'Width', 'oudio-modal-block' ),
									value:    attrs.desktopWidth,
									min:      100, max: 1400, step: 10,
									onChange: function( v ) { setAttrs( { desktopWidth: v } ); },
								} ),
								el( SelectControl, {
									label:    __( 'Unit', 'oudio-modal-block' ),
									value:    attrs.desktopWidthUnit,
									options:  UNITS,
									onChange: function( v ) { setAttrs( { desktopWidthUnit: v } ); },
								} )
							);
						}
						if ( tab.name === 'tablet' ) {
							return el( element.Fragment, null,
								el( RangeControl, {
									label:    __( 'Width', 'oudio-modal-block' ),
									value:    attrs.tabletWidth,
									min:      100, max: 1024, step: 10,
									onChange: function( v ) { setAttrs( { tabletWidth: v } ); },
								} ),
								el( SelectControl, {
									label:    __( 'Unit', 'oudio-modal-block' ),
									value:    attrs.tabletWidthUnit,
									options:  UNITS,
									onChange: function( v ) { setAttrs( { tabletWidthUnit: v } ); },
								} )
							);
						}
						if ( tab.name === 'mobile' ) {
							return el( element.Fragment, null,
								el( RangeControl, {
									label:    __( 'Width', 'oudio-modal-block' ),
									value:    attrs.mobileWidth,
									min:      10, max: 100, step: 1,
									onChange: function( v ) { setAttrs( { mobileWidth: v } ); },
								} ),
								el( SelectControl, {
									label:    __( 'Unit', 'oudio-modal-block' ),
									value:    attrs.mobileWidthUnit,
									options:  UNITS,
									onChange: function( v ) { setAttrs( { mobileWidthUnit: v } ); },
								} )
							);
						}
					} )
				),

				/* Behaviour */
				el( PanelBody, { title: __( 'Behaviour', 'oudio-modal-block' ), initialOpen: false },
					el( RangeControl, {
						label:    __( 'Animation Duration (ms)', 'oudio-modal-block' ),
						value:    attrs.animationDuration,
						min:      100, max: 1000, step: 10,
						onChange: function( v ) { setAttrs( { animationDuration: v } ); },
					} ),
					el( ToggleControl, {
						label:    __( 'Show Close Button', 'oudio-modal-block' ),
						checked:  attrs.showCloseButton,
						onChange: function( v ) { setAttrs( { showCloseButton: v } ); },
					} ),
					el( ToggleControl, {
						label:    __( 'Close on Overlay Click', 'oudio-modal-block' ),
						checked:  attrs.closeOnOverlayClick,
						onChange: function( v ) { setAttrs( { closeOnOverlayClick: v } ); },
					} ),
					el( ToggleControl, {
						label:    __( 'Close on ESC Key', 'oudio-modal-block' ),
						checked:  attrs.closeOnEsc,
						onChange: function( v ) { setAttrs( { closeOnEsc: v } ); },
					} ),
					el( TextControl, {
						label:    __( 'Overlay Color (CSS value)', 'oudio-modal-block' ),
						help:     __( 'e.g. rgba(0,0,0,0.5) or #000', 'oudio-modal-block' ),
						value:    attrs.overlayColor,
						onChange: function( v ) { setAttrs( { overlayColor: v } ); },
					} )
				)
			),

			/* ── Editor canvas preview ─────────────────────────── */
			el( 'div', blockProps,
				el( 'div', { className: 'oudio-modal-block-editor__placeholder' },
					el( 'div', { className: 'oudio-modal-block-editor__icon' },
						el( 'svg', { viewBox:'0 0 24 24', width:40, height:40, fill:'none', stroke:'currentColor', strokeWidth:'1.5' },
							el( 'rect', { x:'3', y:'3', width:'18', height:'18', rx:'2' } ),
							el( 'path', { d:'M15 3v18' } ),
							el( 'path', { d:'M9 10l3 3-3 3' } )
						)
					),
					el( 'h3', null, __( 'Oudio Modal Block', 'oudio-modal-block' ) ),
					attrs.iframeSrc
						? el( 'p', null,
								el( 'strong', null, 'src: ' ),
								el( 'code', null, attrs.iframeSrc.length > 60
									? attrs.iframeSrc.slice(0,57) + '…'
									: attrs.iframeSrc
								)
							)
						: el( 'p', { className: 'oudio-modal-block-editor__no-src' },
								__( '⚠ No iframe src set — open the settings panel →', 'oudio-modal-block' )
							),
					attrs.triggerClass && el( 'p', null,
						__( 'Trigger class: ', 'oudio-modal-block' ),
						el( 'code', null, attrs.triggerClass )
					),
					el( 'p', { className: 'oudio-modal-block-editor__sizes' },
						'🖥 ' + attrs.desktopWidth + attrs.desktopWidthUnit + '  |  ' +
						'📱 ' + attrs.tabletWidth  + attrs.tabletWidthUnit  + ' (tablet)  |  ' +
						'📱 ' + attrs.mobileWidth  + attrs.mobileWidthUnit  + ' (mobile)'
					)
				)
			)
		);
	}

	blocks.registerBlockType( 'oudio/modal-block', {
		edit: Edit,
		save: function() { return null; }, // Server-side rendered
	} );

} )(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.components,
	window.wp.i18n
);
