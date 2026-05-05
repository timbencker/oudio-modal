/**
 * Oudio Modal Block – view.js (pre-built, no bundler required)
 *
 * Frontend vanilla JS that:
 *  1. Finds all .oudio-modal-wrap elements
 *  2. Registers click listeners on elements with the configured trigger class
 *  3. Handles open / close with CSS class toggling
 *  4. Uses MutationObserver to catch dynamically added triggers
 */

( function () {
	'use strict';

	function initModal( panel, overlay, cfg ) {
		var closeBtn = panel.querySelector( '.oudio-modal-close' );
		var isOpen   = false;

		function openModal() {
			if ( isOpen ) { return; }
			isOpen = true;
			document.body.classList.add( 'oudio-modal-open' );
			overlay.classList.add( 'is-open' );
			panel.classList.add( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'false' );
			if ( closeBtn ) {
				setTimeout( function () { closeBtn.focus(); }, Number( cfg.duration ) + 50 );
			}
		}

		function closeModal() {
			if ( ! isOpen ) { return; }
			isOpen = false;
			overlay.classList.remove( 'is-open' );
			panel.classList.remove( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'true' );
			setTimeout( function () {
				document.body.classList.remove( 'oudio-modal-open' );
			}, Number( cfg.duration ) );
		}

		function registerTriggers() {
			if ( ! cfg.triggerClass ) { return; }
			var els = document.querySelectorAll( '.' + cfg.triggerClass );
			for ( var i = 0; i < els.length; i++ ) {
				var el = els[ i ];
				if ( el.dataset.oudioBound === cfg.blockId ) { continue; }
				el.dataset.oudioBound = cfg.blockId;
				el.style.cursor = 'pointer';
				( function ( target ) {
					target.addEventListener( 'click', function ( e ) {
						e.preventDefault();
						openModal();
					} );
				} )( el );
			}
		}

		if ( cfg.closeOnOverlayClick ) {
			overlay.addEventListener( 'click', closeModal );
		}

		if ( cfg.closeOnEsc ) {
			document.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Escape' && isOpen ) { closeModal(); }
			} );
		}

		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', closeModal );
		}

		registerTriggers();

		if ( typeof MutationObserver !== 'undefined' ) {
			var mo = new MutationObserver( registerTriggers );
			mo.observe( document.body, { childList: true, subtree: true } );
		}
	}

	function boot() {
		var wraps = document.querySelectorAll( '.oudio-modal-wrap' );
		for ( var i = 0; i < wraps.length; i++ ) {
			var wrap    = wraps[ i ];
			var panel   = wrap.querySelector( '.oudio-modal-panel' );
			var overlay = wrap.querySelector( '.oudio-modal-overlay' );
			if ( ! panel || ! overlay ) { continue; }

			initModal( panel, overlay, {
				blockId:            panel.dataset.blockId            || '',
				triggerClass:       panel.dataset.triggerClass       || '',
				closeOnOverlayClick: panel.dataset.closeOnOverlayClick === '1',
				closeOnEsc:         panel.dataset.closeOnEsc         === '1',
				duration:           panel.dataset.duration           || '380',
			} );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
