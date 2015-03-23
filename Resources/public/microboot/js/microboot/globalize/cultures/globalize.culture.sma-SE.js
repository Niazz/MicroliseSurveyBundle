/*
 * Globalize Culture sma-SE
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "sma-SE", "default", {
	name: "sma-SE",
	englishName: "Sami, Southern (Sweden)",
	nativeName: "åarjelsaemiengiele (Sveerje)",
	language: "sma",
	numberFormat: {
		",": " ",
		".": ",",
		percent: {
			",": " ",
			".": ","
		},
		currency: {
			pattern: ["-n $","n $"],
			",": ".",
			".": ",",
			symbol: "kr"
		}
	},
	calendars: {
		standard: {
			"/": "-",
			firstDay: 1,
			days: {
				names: ["aejlege","måanta","dæjsta","gaskevåhkoe","duarsta","bearjadahke","laavvardahke"],
				namesAbbr: ["aej","måa","dæj","gask","duar","bearj","laav"],
				namesShort: ["a","m","d","g","d","b","l"]
			},
			months: {
				names: ["tsïengele","goevte","njoktje","voerhtje","suehpede","ruffie","snjaltje","mïetske","skïerede","golke","rahka","goeve",""],
				namesAbbr: ["tsïen","goevt","njok","voer","sueh","ruff","snja","mïet","skïer","golk","rahk","goev",""]
			},
			monthsGenitive: {
				names: ["tsïengelen","goevten","njoktjen","voerhtjen","suehpeden","ruffien","snjaltjen","mïetsken","skïereden","golken","rahkan","goeven",""],
				namesAbbr: ["tsïen","goevt","njok","voer","sueh","ruff","snja","mïet","skïer","golk","rahk","goev",""]
			},
			AM: null,
			PM: null,
			patterns: {
				d: "yyyy-MM-dd",
				D: "MMMM d'. b. 'yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "MMMM d'. b. 'yyyy HH:mm",
				F: "MMMM d'. b. 'yyyy HH:mm:ss",
				M: "MMMM d'. b. '",
				Y: "MMMM yyyy"
			}
		}
	}
});

}( this ));
