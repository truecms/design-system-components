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

const REPORT_DIR = process.env.PA11Y_REPORT_DIR
    ? Path.resolve( process.cwd(), process.env.PA11Y_REPORT_DIR )
    : null;

const COMPONENT_FILTER = new Set(
    ( process.env.PA11Y_COMPONENTS || '' )
        .split( ',' )
        .map( token => token.trim().toLowerCase() )
        .filter( Boolean )
);

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
            Helper.log.error( `Error found at ${ issue.selector }`);
            console.log( `${ issue.context }\n ${ issue.message }\n` );
        });

        return false;
    }

    Helper.log.success( 'No errors' );
    return true;
}

const normaliseComponentName = name => {
    if( !name ) {
        return 'site';
    }

    return name
        .toLowerCase()
        .replace( /[^a-z0-9]+/g, '-' )
        .replace( /^-+|-+$/g, '' ) || 'site';
};

const ensureDirectory = directory => {
    if( !directory ) {
        return;
    }

    Fs.mkdirSync( directory, { recursive: true } );
};

const createReportWriters = baseDir => {
    if( !baseDir ) {
        return null;
    }

    ensureDirectory( baseDir );

    return {
        writeScenario( scenario, payload ) {
            const fileName = `${ normaliseComponentName( scenario.component ) }.json`;
            const outputPath = Path.join( baseDir, fileName );
            ensureDirectory( Path.dirname( outputPath ) );
            Fs.writeFileSync( outputPath, JSON.stringify( payload, null, 2 ) );
        },
        writeIndex( summaries ) {
            const outputPath = Path.join( baseDir, 'index.json' );
            Fs.writeFileSync( outputPath, JSON.stringify( summaries, null, 2 ) );
        }
    };
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RUN TESTS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const RunPa11y = async ( scenarios ) => {
    const sandboxOverrides = process.env.CI ? {
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    } : {};

    const browser = await Puppeteer.launch({
        headless: 'new',
        ...sandboxOverrides,
    });

    const reportWriters = createReportWriters( REPORT_DIR );
    let hasFailures = false;
    let summaries = [];

    try {
        summaries = await Promise.all( scenarios.map( async ( scenario ) => {
            const page = await browser.newPage();

            try {
                const result = await Pa11y( scenario.url, {
                    browser,
                    page,
                    ...OPTIONS,
                });

                console.log( `Pa11y automated ${ result.documentTitle }` );
                const passed = DisplayResults( result );

                const summary = {
                    component: scenario.component,
                    url: scenario.url,
                    documentTitle: result.documentTitle,
                    issues: result.issues.length,
                    status: passed ? 'passed' : 'failed',
                    timestamp: new Date().toISOString()
                };

                if( reportWriters ) {
                    reportWriters.writeScenario( scenario, {
                        ...summary,
                        issues: result.issues
                    } );
                }

                if( !passed ) {
                    hasFailures = true;
                }

                return summary;
            }
            catch( error ) {
                Helper.log.error(`Pa11y failed for ${ scenario.url }`);
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

    if( reportWriters ) {
        reportWriters.writeIndex( summaries );
    }

    if( hasFailures ) {
        throw new Error( 'Accessibility regressions detected' );
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

    const scenarios = [
        {
            component: 'site',
            url: `${ TestURL }/tests/site`
        }
    ];

    if( Fs.existsSync( audsJson ) ) {
        const packages = Object.keys( require( audsJson ) );

        packages.forEach( key => {
            const component = trimScope( key );
            scenarios.push({
                component,
                url: `${ TestURL }/packages/${ component }/tests/site`
            });
        });
    }

    const filteredScenarios = COMPONENT_FILTER.size > 0
        ? scenarios.filter( scenario => COMPONENT_FILTER.has( scenario.component.toLowerCase() ) )
        : scenarios;

    try {
        await RunPa11y( filteredScenarios );
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
