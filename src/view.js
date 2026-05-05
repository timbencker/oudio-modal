/**
 * Frontend view script for Oudio Modal Block.
 *
 * Bootstraps all modal instances found on the page and registers
 * click listeners on every element that carries the trigger class.
 *
 * No dependencies – pure vanilla JS, works with any theme.
 */

( function () {
	'use strict';

	/**
	 * Initialise a single modal instance.
	 *
	 * @param {HTMLElement} panel       The .oudio-modal-panel element
	 * @param {HTMLElement} overlay     The .oudio-modal-overlay element
	 * @param {Object}      cfg         Configuration from data attributes
	 */
	function initModal( panel, overlay, cfg ) {
		const closeBtn = panel.querySelector( '.oudio-modal-close' );
		let isOpen = false;

		function openModal() {
			if ( isOpen ) return;
			isOpen = true;
			document.body.classList.add( 'oudio-modal-open' );
			overlay.classList.add( 'is-open' );
			panel.classList.add( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'false' );
			// Return focus to close btn if visible
			if ( closeBtn ) {
				setTimeout( () => closeBtn.focus(), Number( cfg.duration ) + 50 );
			}
		}

		function closeModal() {
			if ( ! isOpen ) return;
			isOpen = false;
			overlay.classList.remove( 'is-open' );
			panel.classList.remove( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'true' );
			setTimeout( () => {
				document.body.classList.remove( 'oudio-modal-open' );
			}, Number( cfg.duration ) );
		}

		// Trigger elements anywhere on the page
		function registerTriggers() {
			if ( ! cfg.triggerClass ) return;
			document.querySelectorAll( '.' + cfg.triggerClass ).forEach( ( el ) => {
				// Avoid double-binding
				if ( el.dataset.oudioBound === cfg.blockId ) return;
				el.dataset.oudioBound = cfg.blockId;
				el.style.cursor = 'pointer';
				el.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					openModal();
				} );
			} );
		}

		// Overlay click
		if ( cfg.closeOnOverlayClick ) {
			overlay.addEventListener( 'click', closeModal );
		}

		// ESC key
		if ( cfg.closeOnEsc ) {
			document.addEventListener( 'keydown', ( e ) => {
				if ( e.key === 'Escape' && isOpen ) closeModal();
			} );
		}

		// Close button
		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', closeModal );
		}

		// Initial trigger registration
		registerTriggers();

		// Re-register on DOM mutations (for dynamically added elements / page builders)
		if ( typeof MutationObserver !== 'undefined' ) {
			const mo = new MutationObserver( () => registerTriggers() );
			mo.observe( document.body, { childList: true, subtree: true } );
		}
	}

	/**
	 * Boot – find all modals and initialise them.
	 */
	function boot() {
		document.querySelectorAll( '.oudio-modal-wrap' ).forEach( ( wrap ) => {
			const panel   = wrap.querySelector( '.oudio-modal-panel' );
			const overlay = wrap.querySelector( '.oudio-modal-overlay' );
			if ( ! panel || ! overlay ) return;

			const cfg = {
				blockId:            panel.dataset.blockId            || '',
				triggerClass:       panel.dataset.triggerClass       || '',
				closeOnOverlayClick: panel.dataset.closeOnOverlayClick === '1',
				closeOnEsc:         panel.dataset.closeOnEsc         === '1',
				duration:           panel.dataset.duration           || '380',
			};

			initModal( panel, overlay, cfg );
		} );
	}

	// Run after DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
