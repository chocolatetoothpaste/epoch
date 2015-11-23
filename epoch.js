(function (exports) {
"use strict";

// constructor wrapper
exports.epoch = function epoch( format, lang ) {
	lang = lang || 'en-us';

	return new Epoch( format, lang );
};


// constructor
function Epoch( format, lang ) {
	this._d = ( format ? new Date( this.parse( format ) ) : new Date() );
	this.lang = this._lang[lang];
}


/**
 * Break a format down into componenets and execute their formatting fn
 */

Epoch.prototype.format = function format( str ) {
	if( str.length === 0 ) {
		throw new Error('No format specified');
	}

	var f = this._format,
		self = this,
		// regex breakdown:
		// (it's about perfect, so modify with extreme caution)
		// * looks for text surrounded by brackets "[]",
		// * OR "|"
		// * looks for repeating occurences of a character (or just one),
		// * possibly followed by one "o" (ordinal suffix)
		rx = /\[([^\[]*)\]|(\w)\2*(o)?/g;

	// $0 is format received
	// $1 is value of escaped text, if used
	// $2 is repeating format token
	// $3 is "o" if ordinal suffix is to be used
	return str.replace( rx, function( $0, $1, $2, $3 ) {
		// $1 will only be defined if escaped text was found

		if( typeof $1 === "undefined" ) {
			if( typeof f[$0] !== "function" && typeof $3 === "undefined" ) {
				throw new Error("Invalid format: " + $0);
			}

			// check for ordinal suffix in format
			// ($3 would be undefined if $0 was escaped text)
			return ( $3 === "o"
				? self.ordinal.call( self, f[$0.replace( "o", "" )].call(self) )
				: f[$0].call(self)
			);
		}

		else {
			return $1 || $0;
		}
	} );
};


/**
 * Attempt to accept unpredictable date formats and make them parsable
 */

Epoch.prototype.parse = function parse( date ) {
	// possible additional date parser
	// /\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4}/i;

	// standard YYYY-MM-DD format, with common separators
	if( /^\d{4}[.,-_]\d{2}[.,-_]\d{2}\s*$/.test( date ) ){
		var d = new Date();
		date += ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');
	}

	return date;
};


Epoch.prototype.from = Epoch.prototype.diff = function from( date, rel ) {
	rel = rel || { pre: this.lang.from.pre, suf: this.lang.from.suf };
	date = ( date ? new Date( this.parse( date ) ) : new Date() );

	var interval = '',
		unit = '',
		diff = Math.floor( ( date - this._d ) / 1000 ),
		seconds = Math.abs( diff );

	if( seconds >= 31536000 || Math.floor( seconds / 2592000 ) === 12 ) {
		interval = Math.floor( seconds / 31536000 ) || 1;
		unit = this.lang.from.year;
	}

	// just average it out to 30 days
	else if( seconds >= 2592000 ) {
		interval = Math.floor( seconds / 2592000 );
		unit = this.lang.from.month;
	}

	else if( seconds >= 86400 ) {
		interval = Math.floor( seconds / 86400 );
		unit = this.lang.from.day;
	}

	else if( seconds >= 3600 ) {
		interval = Math.floor( seconds / 3600 );
		unit = this.lang.from.hour;
	}

	else if( seconds >= 60 ) {
		interval = Math.floor( seconds / 60 );
		unit = this.lang.from.minute;
	}

	else {
		interval = this.lang.from.less;
		unit = this.lang.from.minute;
	}

	// singulural
	if( typeof interval === 'number' && interval > 1 )
		unit += 's'

	interval = interval + ' ' + unit;

	return ( diff > 0 ? rel.pre + ' ' + interval : interval + ' ' + rel.suf );
};


// collection of functions to return date formats
Epoch.prototype._format = {

	// Lowercase am/pm
	a: function a() {
		return ( this.hour() > 11 ? 'pm' : 'am' );
	},

	// Uppercase AM/PM
	A: function A() {
		return ( this.hour() > 11 ? 'PM' : 'AM' );
	},

	// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
	d: function d() {
		return this.day();
	},

	// Numeric representation of the day of the week, 1 - 7 : Sun - Sat
	dd: function dd() {
		return this.day() + 1;
	},

	// A textual representation of a day, three letters
	ddd: function ddd() {
		return this.lang.d[ this.day() ];
	},

	// A full textual representation of the day of the week
	dddd: function dddd() {
		return this.lang.day[ this.day() ]
	},

	// Day of the month without leading zeros
	D: function D() {
		return this.date();
	},

	// Day of the month with leading zeros
	DD: function DD() {
		var d = this.date();
		return ( d < 10 ? '0' + d : d );
	},

	// The day of the year (starting from 0)
	DDD: function DDD() {
		var doy = new Date( this.year(), 0, 0 );
		return Math.ceil( ( this._d - doy ) / 86400000 );
	},

	// The day of the year (starting from 0)
	// DDDD: function() {
	// 	var doy = new Date( this.year(), 0, 0 );
	// 	return Math.ceil( ( this._d - doy ) / 86400000 );
	// },

	// 24-hour format of an hour without leading zeros
	h: function h() {
		return this.hour();
	},

	// 12-hour format of an hour without leading zeros
	H: function H() {
		var h = this.hour();
		return ( h > 12 ? h -= 12 : h );
	},

	// 24-hour format of an hour with leading zeros
	hh: function hh() {
		var hh = this.hour();
		return ( hh < 10 ? '0' + hh : hh );
	},

	// 12-hour format of an hour with leading zeros
	HH: function HH() {
		var h = this.hour();
		return ( h > 12 ? h -= 12 : ( h < 10 ? '0' + h : h ) );
	},

	// Minutes with leading zeros
	mm: function mm() {
		var mm = this.min();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// Numeric representation of a month, without leading zeros
	M: function M() {
		return this.month();
	},

	// Numeric representation of a month, with leading zeros
	MM: function MM() {
		var mm = this.month();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// A short textual representation of a month, three letters
	MMM: function MMM() {
		// textual representations should be abstracted into
		// pluggable language files
		return this.lang.mon[ this.month() - 1 ];
	},

	// A full textual representation of a month, such as January or March
	MMMM: function MMMM() {
		return this.lang.month[ this.month() - 1 ];
	},

	// Seconds, with leading zeros
	ss: function ss() {
		var ss = this.sec();
		return ( ss < 10 ? '0' + ss : ss );
	},

	// Milliseconds
	u: function u() {
		return this.milli();
	},

	// Unix timestamp
	U: function U() {
		return Math.round( this.time() / 1000 );
	},

	// ISO-8601 week number of year, weeks starting on Monday
	ww: function ww() {
		var d = new Date( this.year(), 0, 1 );
		d = Math.ceil( ( this._d - d ) / 86400000 );
		d += this.date();
		d -= this.day() + 10;
		return Math.floor( d / 7 );
	},

	// A full numeric representation of a year, 4 digits
	YYYY: function YYYY() {
		return this.year();
	},

	// A two digit representation of a year
	YY: function YY() {
		return parseInt( this.year().toString().substr(-2) );
	},

	// 4 digit timezone offset with sign, ex: +/-0000
	Z: function Z() {
		var z = -( this._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		return sign + ( '0000' + Math.abs(z) ).slice(-4);
	},

	ZZ: function ZZ() {
		var z = -( this._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		z = ( '0000' + Math.abs(z) ).slice(-4);
		return sign + [ z.slice(0,2), z.slice(2,4) ].join(':');
	},

	// 3 letter time zone abbrev
	ZZZ: function ZZZ() {
		return this._d.toString().match(/\((\w*)\)/)[1];
	}

	// return full time zone name
	// ZZZZ: function ZZZZ() {

	// }
};


// unix timestamp
Epoch.prototype.timestamp = function timestamp() {
	return Math.round( this.time() / 1000 );
};


// true/false if year is leap year
Epoch.prototype.leap = Epoch.prototype.leapYear = function leapYear() {
	var y = this.year();
	return ( ( y % 4 === 0 ) && ( y % 100 !== 0 ) ) || ( y % 400 === 0 );
};


// 1123 and 2822 are the same format
Epoch.prototype.rfc2822 = Epoch.prototype.rfc1123 = function rfc1123_rfc2822() {
	return this._d.toUTCString();
};

Epoch.prototype.rfc8601 = Epoch.prototype.iso8601 = function iso8601() {
	return this.format('YYYY-MM-DD[T]hh:mm:ss[+0000]');
};

// format accepted by SQL DATE column type
Epoch.prototype.sqldate = function sqldate() {
	return this.format('YYYY-MM-DD');
};

// format accepted by SQL TIME column type
Epoch.prototype.sqltime = function sqltime() {
	return this.format('hh:mm:ss');
};

// format accepted by SQL DATETIME column type
Epoch.prototype.datetime = function datetime() {
	return this.format('YYYY-MM-DD hh:mm:ss');
};

// return number + ordinal suffix for num
Epoch.prototype.ordinal = function ordinal( num ) {
	if( num >= 11 && num <= 13 )
		num += "th";

	else {
		switch( num % 10 ) {
			case 1:  num += "st"; break;
			case 2:  num += "nd"; break;
			case 3:  num += "rd"; break;
			default: num += "th"; break;
		}
	}

	return num;
};


/**
 * WRAPPER SECTION *******************************************************
 * here be lizards... changing below this line could break things, careful
 */


Epoch.prototype._set = function( val, set, get ) {
	// if val is a string preceeded by "+" or "-", get the current value,
	// parse str to int (making it positive or negative) and add to current val
	// else if val is an int (or stringified int), then just set new value
	set.call( this._d, ( /(\+|-)\d/g.exec( val )
		? get.call( this._d ) + parseInt( val )
		: val ) );
};

Epoch.prototype.date = function( val ) {
	if( val ) {
		this._set( val, this._d.setDate, this._d.getDate );
	}

	return this._d.getDate();
};

Epoch.prototype.hour = function( val ) {
	if( val ) {
		this._set( val, this._d.setHours, this._d.getHours );
	}

	return this._d.getHours();
};

Epoch.prototype.min = function( val ) {
	if( val ) {
		this._set( val, this._d.setMinutes, this._d.getMinutes );
	}

	return this._d.getMinutes();
};

Epoch.prototype.sec = function( val ) {
	if( val ) {
		this._set( val, this._d.setSeconds, this._d.getSeconds );
	}

	return this._d.getSeconds();
};

Epoch.prototype.milli = function( val ) {
	if( val ) {
		this._set( val, this._d.setMilliseconds, this._d.getMilliseconds );
	}

	return this._d.getMilliseconds();
};

Epoch.prototype.month = function( val ) {
	if( val ) {
		if( ! /(\+|-)/g.exec( val ) )
			val = parseInt(val) - 1;
		this._set( val, this._d.setMonth, this._d.getMonth );
	}

	// js returns jan = 0, dec = 11... don't know why
	// don't change this, this is the one true way
	return this._d.getMonth() + 1;
};

Epoch.prototype.year = function( val ) {
	if( val ) {
		this._set( val, this._d.setFullYear, this._d.getFullYear );
	}

	return this._d.getFullYear();
};

Epoch.prototype.day = function() {
	return this._d.getDay();
};

Epoch.prototype.time = function() {
	return this._d.getTime();
};


Epoch.prototype._lang = {
	"en-us": {
		month: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July',
			'August', 'September', 'October', 'November', 'December' ],

		mon: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
			'Oct', 'Nov', 'Dec' ],

		day: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
			'Friday', 'Saturday' ],

		d: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

		from: {
			pre: 'in',
			suf: 'ago',
			minute: 'minute',
			hour: 'hour',
			day: 'day',
			month: 'month',
			year: 'year',
			less: 'less than a'
		}
	}
};

})( typeof window === 'undefined' ? module.exports : window );