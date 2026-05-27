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

	let bodyLockCount = 0;

	function lockBodyScroll() {
		bodyLockCount += 1;
		if ( bodyLockCount === 1 ) {
			document.body.classList.add( 'oudio-modal-beta-open' );
		}
	}

	function unlockBodyScroll() {
		if ( bodyLockCount <= 0 ) {
			return;
		}
		bodyLockCount -= 1;
		if ( bodyLockCount === 0 ) {
			document.body.classList.remove( 'oudio-modal-beta-open' );
		}
	}

	function getFocusableElements( panel ) {
		return panel.querySelectorAll(
			'button:not([disabled]), iframe, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
	}

	/**
	 * Initialise a single modal instance.
	 *
	 * @param {HTMLElement} wrap        The .oudio-modal-beta-wrap element
	 * @param {HTMLElement} panel       The .oudio-modal-beta-panel element
	 * @param {HTMLElement} overlay     The .oudio-modal-beta-overlay element
	 * @param {Object}      cfg         Configuration from data attributes
	 */
	function initModal( wrap, panel, overlay, cfg ) {
		const closeBtn = panel.querySelector( '.oudio-modal-beta-close' );
		let isOpen = false;
		let lastTrigger = null;
		let focusTrapHandler = null;

		function removeFocusTrap() {
			if ( focusTrapHandler ) {
				panel.removeEventListener( 'keydown', focusTrapHandler );
				focusTrapHandler = null;
			}
		}

		function installFocusTrap() {
			removeFocusTrap();
			focusTrapHandler = ( e ) => {
				if ( e.key !== 'Tab' || ! isOpen ) {
					return;
				}
				const focusable = getFocusableElements( panel );
				if ( ! focusable.length ) {
					return;
				}
				const first = focusable[ 0 ];
				const last = focusable[ focusable.length - 1 ];
				if ( e.shiftKey && document.activeElement === first ) {
					e.preventDefault();
					last.focus();
				} else if ( ! e.shiftKey && document.activeElement === last ) {
					e.preventDefault();
					first.focus();
				}
			};
			panel.addEventListener( 'keydown', focusTrapHandler );
		}

		function openModal( triggerEl ) {
			if ( isOpen ) {
				return;
			}
			isOpen = true;
			if ( triggerEl instanceof HTMLElement ) {
				lastTrigger = triggerEl;
			}
			lockBodyScroll();
			overlay.classList.add( 'is-open' );
			panel.classList.add( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'false' );
			installFocusTrap();
			if ( closeBtn ) {
				setTimeout( () => closeBtn.focus(), Number( cfg.duration ) + 50 );
			}
		}

		function closeModal() {
			if ( ! isOpen ) {
				return;
			}
			isOpen = false;
			removeFocusTrap();
			overlay.classList.remove( 'is-open' );
			panel.classList.remove( 'is-open' );
			panel.setAttribute( 'aria-hidden', 'true' );
			setTimeout( () => {
				unlockBodyScroll();
			}, Number( cfg.duration ) );
			if ( lastTrigger instanceof HTMLElement ) {
				try {
					lastTrigger.focus();
				} catch ( err ) {
					/* ignore focus errors */
				}
			}
		}

		// Trigger elements anywhere on the page
		function registerTriggers() {
			if ( ! cfg.triggerClass ) {
				return;
			}
			document.querySelectorAll( '.' + cfg.triggerClass ).forEach( ( el ) => {
				// Avoid double-binding
				if ( el.dataset.oudioBound === cfg.blockId ) {
					return;
				}
				el.dataset.oudioBound = cfg.blockId;
				el.style.cursor = 'pointer';
				el.addEventListener( 'click', ( e ) => {
					e.preventDefault();
					openModal( el );
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
				if ( e.key === 'Escape' && isOpen ) {
					closeModal();
				}
			} );
		}

		// Close button
		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', closeModal );
		}

		// Checkout complete — close from OudioEmbed onClose
		wrap.addEventListener( 'oudio-modal-beta-request-close', ( e ) => {
			const detail = e.detail || {};
			if ( detail.blockId && detail.blockId !== cfg.blockId ) {
				return;
			}
			closeModal();
		} );

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
		document.querySelectorAll( '.oudio-modal-beta-wrap' ).forEach( ( wrap ) => {
			const panel   = wrap.querySelector( '.oudio-modal-beta-panel' );
			const overlay = wrap.querySelector( '.oudio-modal-beta-overlay' );
			if ( ! panel || ! overlay ) {
				return;
			}

			const cfg = {
				blockId:            panel.dataset.blockId            || '',
				triggerClass:       panel.dataset.triggerClass       || '',
				closeOnOverlayClick: panel.dataset.closeOnOverlayClick === '1',
				closeOnEsc:         panel.dataset.closeOnEsc         === '1',
				duration:           panel.dataset.duration           || '380',
			};

			initModal( wrap, panel, overlay, cfg );
		} );
	}

	// Run after DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
