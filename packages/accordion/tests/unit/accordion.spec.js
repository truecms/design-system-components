/** @jest-environment jsdom */

/**
 * Unit tests for the accordionToggle callback bug in react.js.
 *
 * Module resolution note:
 *   `react.js` imports '@truecms/animate'. Under pnpm workspaces this
 *   resolves to packages/accordion/node_modules/@truecms/animate whose
 *   package.json "main" points to lib/js/module.js — the pre-built
 *   CommonJS file. That file exists and Jest's default resolver picks it
 *   up automatically, so no moduleNameMapper is needed.
 *
 * Timer note:
 *   AU.animate.Toggle/Run drive the animation with setInterval.
 *   We use jest.useFakeTimers() and jest.runAllTimers() to collapse the
 *   entire animation into a single synchronous tick so the postfunction
 *   fires before we assert.
 *
 * Bug description:
 *   In accordionToggle's postfunction (react.js ~lines 210-228), the guard
 *   and invocation are crossed in both branches:
 *     - state === 'closed' (just finished closing): guards `afterOpen` but
 *       calls `afterClose()` — wrong guard means if only afterClose is
 *       provided the guard fails and afterClose is never called.
 *     - else (state === 'open', just finished opening): guards `afterClose`
 *       but calls `afterOpen()` — wrong guard means if only afterOpen is
 *       provided the guard passes (afterClose is undefined? No — it passes
 *       if afterClose IS a function, which it isn't) causing a TypeError
 *       when afterOpen is provided without afterClose.
 *
 *   The two most clearly observable symptoms tested here:
 *   1. Provide ONLY afterOpen, click open → buggy code guards `afterClose`
 *      (undefined) → guard fails → afterOpen never called (count 0 not 1).
 *   2. Provide ONLY afterClose, click close → buggy code guards `afterOpen`
 *      (undefined) → guard fails → afterClose never called (count 0 not 1).
 *   3. Provide ONLY afterOpen (no afterClose), click CLOSE → buggy code
 *      guards `afterOpen` (a function) → passes → calls afterClose() →
 *      TypeError: afterClose is not a function.
 *   4. Smoke: aria-expanded toggles correctly through open/close.
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import AUaccordion from '../../src/js/react.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Render a single accordion and return the button (trigger) + body element.
 */
function renderAccordion( props = {} ) {
	const { container } = render(
		<AUaccordion
			header="Test header"
			closed={ props.closed !== undefined ? props.closed : false }
			{ ...props }
		>
			<p>Body content</p>
		</AUaccordion>
	);

	const button = container.querySelector( 'button.au-accordion__title' );
	const body   = container.querySelector( '.au-accordion__body' );

	return { container, button, body };
}

/**
 * Stub getComputedStyle so AU.animate.GetCSSPropertyBecauseIE returns the
 * given height in pixels. jsdom returns '' for height; without this stub the
 * animate library cannot determine the animation direction.
 */
function stubComputedHeight( element, heightPx ) {
	element.style.height = `${ heightPx }px`;
	const original = window.getComputedStyle;
	window.getComputedStyle = ( el, pseudo ) => {
		if ( el === element ) {
			return { height: `${ heightPx }px` };
		}
		return original( el, pseudo );
	};
	return () => { window.getComputedStyle = original; };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach( () => {
	jest.useFakeTimers();
} );

afterEach( () => {
	jest.useRealTimers();
} );


/**
 * Test 1 — Provide ONLY afterOpen, then click a CLOSED accordion OPEN.
 *
 * Correct behaviour: afterOpen fires (count=1).
 *
 * Buggy behaviour: the postfunction else-branch (state='open') guards
 *   `typeof callbacks.afterClose === 'function'` — but afterClose is
 *   undefined, so the guard fails and afterOpen is NEVER called (count=0).
 * This test FAILS on buggy code.
 */
test( 'afterOpen fires after clicking a closed accordion open (only afterOpen provided)', () => {
	const afterOpen = jest.fn();

	const { button, body } = renderAccordion( {
		closed: true,
		afterOpen,
		// No afterClose — exposes the wrong guard
	} );

	const restore = stubComputedHeight( body, 0 );

	act( () => {
		fireEvent.click( button );
		jest.runAllTimers();
	} );

	restore();

	expect( afterOpen ).toHaveBeenCalledTimes( 1 );
} );


/**
 * Test 2 — Provide ONLY afterClose, then click an OPEN accordion CLOSED.
 *
 * Correct behaviour: afterClose fires (count=1).
 *
 * Buggy behaviour: the postfunction state==='closed' branch guards
 *   `typeof callbacks.afterOpen === 'function'` — but afterOpen is
 *   undefined, so the guard fails and afterClose is NEVER called (count=0).
 * This test FAILS on buggy code.
 */
test( 'afterClose fires after toggling an open accordion closed (only afterClose provided)', () => {
	const afterClose = jest.fn();

	const { button, body } = renderAccordion( {
		closed: false,
		afterClose,
		// No afterOpen — exposes the wrong guard
	} );

	const restore = stubComputedHeight( body, 200 );

	act( () => {
		fireEvent.click( button );
		jest.runAllTimers();
	} );

	restore();

	expect( afterClose ).toHaveBeenCalledTimes( 1 );
} );


/**
 * Test 3 — Passing ONLY afterOpen and toggling an OPEN accordion CLOSED
 * must not throw and must NOT call afterOpen.
 *
 * Correct behaviour: neither callback fires, no error thrown.
 *
 * Buggy behaviour: state==='closed' branch guards `typeof afterOpen ===
 *   'function'` (true!), then calls `callbacks.afterClose()` → TypeError
 *   because afterClose is undefined.
 * This test FAILS on buggy code (TypeError thrown).
 */
test( 'passing only afterOpen and toggling open→closed does not throw', () => {
	const afterOpen = jest.fn();

	const { button, body } = renderAccordion( {
		closed: false,
		afterOpen,
		// No afterClose — this is the TypeError scenario
	} );

	const restore = stubComputedHeight( body, 200 );

	expect( () => {
		act( () => {
			fireEvent.click( button );
			jest.runAllTimers();
		} );
	} ).not.toThrow();

	restore();

	// afterOpen should NOT fire when we close (even without the bug)
	expect( afterOpen ).not.toHaveBeenCalled();
} );


/**
 * Test 5 — Clicking the accordion header must stop event propagation.
 *
 * Bug: `event` is not in scope inside accordionToggle; the try/catch block
 *   containing `event.stopPropagation()` swallows the ReferenceError silently.
 *   The `window.event.cancelBubble = true` line on the previous line does work
 *   in jsdom (window.event is set during dispatch), masking the bug. To expose
 *   the real bug we suppress window.event, simulating modern browsers where the
 *   IE-era fallback is unavailable.
 *
 * Fix: `toggle(event)` passes the React SyntheticEvent as the 4th argument to
 *   accordionToggle, which calls `event.stopPropagation()` directly.
 *
 * Test strategy:
 *   1. Suppress window.event so the old cancelBubble path is a no-op.
 *   2. Render the accordion inside a wrapper div with a click spy.
 *   3. Assert the wrapper spy is NOT called after clicking the button.
 *   Pre-fix: spy IS called (propagation not stopped). FAILS on buggy code.
 *   Post-fix: spy is NOT called. PASSES.
 */
test( 'clicking the accordion header stops event propagation to parent elements', () => {
	const wrapperClickSpy = jest.fn();

	const { container, button, body } = renderAccordion( { closed: false } );

	const wrapper = document.createElement( 'div' );
	wrapper.addEventListener( 'click', wrapperClickSpy );
	wrapper.appendChild( container );
	document.body.appendChild( wrapper );

	const restore = stubComputedHeight( body, 200 );

	// Suppress window.event to simulate modern browsers where the IE-era
	// cancelBubble fallback does not exist, exposing the real bug.
	const origWindowEventDescriptor = Object.getOwnPropertyDescriptor( window, 'event' );
	Object.defineProperty( window, 'event', { get: () => undefined, configurable: true } );

	act( () => {
		fireEvent.click( button );
		jest.runAllTimers();
	} );

	// Restore window.event
	if ( origWindowEventDescriptor ) {
		Object.defineProperty( window, 'event', origWindowEventDescriptor );
	}

	restore();

	expect( wrapperClickSpy ).not.toHaveBeenCalled();

	document.body.removeChild( wrapper );
} );


/**
 * Test 4 — Smoke: aria-expanded on the button toggles correctly.
 *
 * AU.animate.Toggle calls prefunction with state='closing'/'opening'.
 * setAriaRoles sets aria-expanded=false on 'closing', true otherwise.
 * This should work regardless of the callback bug.
 */
test( 'aria-expanded on the button toggles correctly through open/close', () => {
	const { button, body } = renderAccordion( { closed: false } );

	// Initially open: aria-expanded should be true
	expect( button ).toHaveAttribute( 'aria-expanded', 'true' );

	// Click to close
	const restoreOpen = stubComputedHeight( body, 200 );
	act( () => {
		fireEvent.click( button );
		jest.runAllTimers();
	} );
	restoreOpen();

	expect( button ).toHaveAttribute( 'aria-expanded', 'false' );

	// Click again to open
	const restoreClosed = stubComputedHeight( body, 0 );
	act( () => {
		fireEvent.click( button );
		jest.runAllTimers();
	} );
	restoreClosed();

	expect( button ).toHaveAttribute( 'aria-expanded', 'true' );
} );
