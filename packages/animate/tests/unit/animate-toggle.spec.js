/** @jest-environment jsdom */

/**
 * Unit test for the AU.animate.Toggle callback bug.
 *
 * Bug: line ~312 in module.js compares
 *   elements[0].AUtoggleInteration === elements[0].AUinterations
 * but AUinterations is set by AU.animate.Run (to 1 per Run invocation).
 * For multi-element Toggle calls the final options.callback fires after
 * the FIRST element instead of the LAST.
 *
 * Fix: compare against AUtoggleInterations (Toggle's own counter).
 *
 * Timer note:
 *   AU.animate.Run drives the animation with setInterval.
 *   jest.useFakeTimers() + jest.runAllTimers() collapses the animation
 *   synchronously so the callback fires before we assert.
 */

const AU = require('../../lib/js/module.js');

// ---------------------------------------------------------------------------
// Helper: create a minimal DOM element Toggle/Run can work with.
//
// Toggle reads the element's computed height via GetCSSPropertyBecauseIE,
// which calls window.getComputedStyle(element)['height'].
// jsdom returns '' for height by default, so we stub it here.
// ---------------------------------------------------------------------------
function makeDiv( heightPx ) {
	const el = document.createElement( 'div' );
	document.body.appendChild( el );
	// Stub clientHeight for CalculateAuto
	Object.defineProperty( el, 'clientHeight', { get: () => heightPx, configurable: true } );
	// Make getComputedStyle return the expected height for this element
	el._stubbedHeight = heightPx;
	return el;
}

// Patch getComputedStyle globally to return stubbed height for our elements
const originalGetComputedStyle = window.getComputedStyle.bind( window );
window.getComputedStyle = ( el, pseudo ) => {
	if ( el && el._stubbedHeight !== undefined ) {
		return { height: `${ el._stubbedHeight }px` };
	}
	return originalGetComputedStyle( el, pseudo );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach( () => {
	jest.useFakeTimers();
} );

afterEach( () => {
	jest.useRealTimers();
	// Clean up any appended DOM nodes
	while ( document.body.firstChild ) {
		document.body.removeChild( document.body.firstChild );
	}
} );

/**
 * The core regression test.
 *
 * Call Toggle with TWO closed elements (height=0 → opens).
 * The callback spy must fire AFTER both elements' postfunctions have run.
 *
 * Bug: AUinterations=1 (set by each inner Run invocation on a single element),
 * so the condition fires when AUtoggleInteration=1 after ONLY the first
 * element completes. The second element's postfunction hasn't run yet.
 *
 * Fix: compare against AUtoggleInterations (the Toggle-level counter set to
 * elements.length=2). The callback fires only after both postfunctions run.
 *
 * Test strategy: use a postfunction that records whether the callback has
 * already been called when the postfunction fires.
 *
 * Correct order (fixed code, 2 elements):
 *   1. postfunction(el1) — non-final element; fires before callback
 *   2. callback           — fires when the final (el2) Run callback runs
 *   3. postfunction(el2) — final element's postfunction; fires after callback
 *
 * Bug order (AUinterations=1, condition fires after el1):
 *   1. callback           — fires immediately after el1 completes
 *   2. postfunction(el1) — fires after callback (wrong: el2 not done yet)
 *   3. postfunction(el2) — fires after el2 completes
 *
 * The key observable: on buggy code postfunction(el1) fires AFTER callback
 * (i.e., callbackFired=true when post(el1) runs). On fixed code post(el1)
 * fires BEFORE callback (callbackFired=false when post(el1) runs).
 */
test( 'AU.animate.Toggle callback fires only after the last element completes (two elements)', () => {
	const callbackOrder = [];

	const el1 = makeDiv( 0 );
	const el2 = makeDiv( 0 );

	let callbackFired = false;

	AU.animate.Toggle({
		element: [ el1, el2 ],
		property: 'height',
		openSize: 100,
		closeSize: 0,
		speed: 250,
		postfunction: () => {
			callbackOrder.push( { postAt: callbackFired ? 'after-callback' : 'before-callback' } );
		},
		callback: () => {
			callbackFired = true;
			callbackOrder.push( 'callback' );
		},
	});

	jest.runAllTimers();

	// Correct order: post(el1) before callback, then callback, then post(el2)
	// post(el1) must fire BEFORE the callback (el1 is the non-final element)
	expect( callbackOrder ).toHaveLength( 3 );
	expect( callbackOrder[ 0 ] ).toEqual( { postAt: 'before-callback' } ); // post(el1) before callback
	expect( callbackOrder[ 1 ] ).toBe( 'callback' );                        // callback fires when el2 done
	expect( callbackOrder[ 2 ] ).toEqual( { postAt: 'after-callback' } );  // post(el2) after callback
} );

/**
 * Sanity check: single-element Toggle still fires callback exactly once.
 * This should pass on both buggy and fixed code.
 */
test( 'AU.animate.Toggle callback fires exactly once for a single element', () => {
	const callback = jest.fn();

	const el1 = makeDiv( 0 );

	AU.animate.Toggle({
		element: el1,
		property: 'height',
		openSize: 100,
		closeSize: 0,
		speed: 250,
		callback,
	});

	jest.runAllTimers();

	expect( callback ).toHaveBeenCalledTimes( 1 );
} );
