/***************************************************************************************************************************************************************
 *
 * PA11Y TEST
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Helper    = require( './helper.js' );
const Express   = require( 'express' );
const Pa11y     = require( 'pa11y' );
const Puppeteer = require( 'puppeteer' );
const Fs        = require( 'fs' );
const Path      = require( 'path' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GLOBALS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const OPTIONS = {
	timeout: 60000,
	hideElements: '.sr-only, .is-visuallyhidden, .visuallyhidden, .no-a11y-test, .auds-page-alerts__sronly, .auds-skip-link',
}

const trimScope = ( name ) => {
	if( typeof name !== 'string' ) {
		return '';
	}

	if( name.startsWith('@') && name.includes('/') ) {
		return name.slice( name.indexOf('/') + 1 );
	}

	return name;
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLI OUTPUT FORMATTING
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const DisplayResults = results => {
	if( results.issues.length ) {
		results.issues.map( issue => {
			Helper.log.error( `Error found at ${ issue.selector }`)
			console.log( `${ issue.context }\n ${ issue.message }\n` );
		})

		process.exit( 1 );
	}
	else {
		Helper.log.success( 'No errors' );
	}
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RUN TESTS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const RunPa11y = async ( urls ) => {
	const sandboxOverrides = process.env.CI ? {
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
	} : {};

	const browser = await Puppeteer.launch({
		headless: 'new',
		...sandboxOverrides,
	});

	try {
		await Promise.all( urls.map( async ( url ) => {
			const page = await browser.newPage();

			try {
				const result = await Pa11y( url, {
					browser,
					page,
					...OPTIONS,
				});

				console.log( `Pa11y automated ${ result.documentTitle }` );
				DisplayResults( result );
			}
			catch( error ) {
				Helper.log.error(`Pa11y failed for ${ url }`);
				console.error( error );
				throw error;
			}
			finally {
				await page.close();
			}
		}) );
	}
	finally {
		await browser.close();
	}
}


// Global variables
const audsJson = Path.normalize( `${ process.cwd() }/auds.json` );
const TestURL   = 'http://localhost:8080';


// Start the test - immediatley executed async function
( async() => {
	const App = Express();
	const Server = App.listen( '8080' );

	App.use( Express.static( './' ) );

	let urls = [ `${ TestURL }/tests/site` ];

	if( Fs.existsSync( audsJson ) ) {
	urls = Object.keys( require( audsJson ) ).map( key => `${ TestURL }/packages/${ trimScope( key ) }/tests/site` );
	}

	try {
		await RunPa11y( urls );
	}
	catch( error ) {
		Helper.log.error('Accessibility checks failed');
		console.error( error );
		process.exitCode = 1;
	}
	finally {
		await new Promise( ( resolve, reject ) => {
			Server.close( ( closeError ) => closeError ? reject( closeError ) : resolve() );
		});
	}
})();
