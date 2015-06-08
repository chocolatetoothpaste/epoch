(function () {
"use strict";

	var g = {
		// this is one of the many reasons why javascript is awesome
		path: Array.prototype.slice
			.call( document.getElementsByTagName('script'), -1 )[0].src
			.split( "/" ).slice( 0, -1 ).join( "/" ),
	};

// constructor
function Epoch( format, lang ) {
	this._d = ( format ? new Date( format ) : new Date() );
	this._format.parent = this;
	this.path = g.path;
	this.lang = this._lang[lang];
}


// constructor wrapper
var epoch = function epoch( format, lang ) {
	lang = lang || 'en-us';
	// locale(lang);

	return new Epoch( format, lang );
};

if( typeof module !== 'undefined' && module.exports ) {
	// Epoch.prototype.locale = function() {
	// 	require('./lang/' + this.lang);
	// };

	module.exports = epoch;
}

else {
	// var locale = function( lang ) {
	// 	var s = document.createElement( "script" );
	// 	s.setAttribute("type", "text/javascript");
	// 	s.setAttribute("src", g.path + "/lang/" + lang + ".js");

	// 	document.getElementsByTagName( "head" )[0].appendChild( s );
	// }

	window.epoch = epoch;
}


/**
 * Break a format down into componenets and execute their formatting fn
 */

Epoch.prototype.format = function( str ) {
	try {
		if( str.length <= 0 )
			throw new Error('(empty string)');

		var f = this._format,
			// regex breakdown:
			// (it's about perfect, so modify with extreme caution)
			// * looks for text surrounded by brackets "[]",
			// * OR "|"
			// * looks for repeating occurences of a character (or just one),
			// * possibly followed by one "o" (ordinal suffix)
			rx = /\[([^\[]*)\]|(\w)\2*(o)?/g;

		return str.replace( rx, function( $0, $1, $2, $3 ) {
			// $1 will only be defined if escaped text was found
			if( typeof $1 === "undefined" ) {
				if( typeof f[$0] !== "function" && typeof $3 === "undefined" )
					throw new Error("Invalid format: " + $0);
				// check for ordinal suffix in format
				// ($3 would be undefined if $0 was escaped text)
				return ( $3 === "o"
					? f._o( f[$0.replace( "o", "" )]() )
					: f[$0]()
				);
			}

			else {
				return $1 || $0;
			}
		} );
	} catch( e ) {
		console.error( e.message );
	}
};


/**
 * Reset the date object
 */

Epoch.prototype.reset = function() {
	// this._d = ( format ? new Date(format) : new Date() );
	this._date = this._day = this._week = this._month = null;
	this._year = this._hour = this._min = this._sec = null;
	this._milli = this._time = null;
};


Epoch.prototype.diff = function( date, rel ) {
	rel = rel || { pre: this.lang.from.pre, suf: this.lang.from.suf };

	var interval = '',
		retval = '',
		unit = '',
		from = ( date ? new Date( date ) : new Date() ) - this._d,
		diff = Math.floor( from / 1000 ),
		seconds = Math.abs( diff );

	// displays "in 1 year" instead of "in 12 months"... roughly
	if( this._d < from && seconds >= 30304745 ) {
		interval = Math.floor( seconds / 30304745 );
		unit = this.lang.from.year;
	}

	else if( seconds >= 31536000 ) {
		interval = Math.floor( seconds / 31536000 );
		unit = this.lang.from.year;
	}

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

	// find out if unit is singular or plural
	if( typeof interval === 'number' && interval > 1 )
		unit += 's'

	// assemble the relative string, past/future
	if( diff > 0 )
		retval = rel.pre + ' ' + interval + ' ' + unit;
	else
		retval = interval + ' ' + unit + ' ' + rel.suf;

	return retval;
};

Epoch.prototype.from = Epoch.prototype.diff;

// collection of functions to return date formats

Epoch.prototype._format = {

	// Lowercase am/pm
	a: function() {
		return ( this.parent.hour() > 11 ? 'pm' : 'am' );
	},

	// Uppercase AM/PM
	A: function() {
		return ( this.parent.hour() > 11 ? 'PM' : 'AM' );
	},

	// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
	d: function() {
		return this.parent.day();
	},

	// Numeric representation of the day of the week, 1 - 7 : Sun - Sat
	dd: function() {
		return this.parent.day() + 1;
	},

	// A textual representation of a day, three letters
	ddd: function() {
		return this.parent.lang.d[ this.parent.day() ];
	},

	// A full textual representation of the day of the week
	dddd: function() {
		return this.parent.lang.day[ this.parent.day() ]
	},

	// Day of the month without leading zeros
	D: function() {
		return this.parent.date();
	},

	// Day of the month with leading zeros
	DD: function() {
		var d = this.parent.date();
		return ( d < 10 ? '0' + d : d );
	},

	// The day of the year (starting from 0)
	DDD: function() {
		var doy = new Date( this.parent.year(), 0, 0 );
		return Math.ceil( ( this.parent._d - doy ) / 86400000 );
	},

	// The day of the year (starting from 0)
	// DDDD: function() {
	// 	var doy = new Date( this.parent.year(), 0, 0 );
	// 	return Math.ceil( ( this.parent._d - doy ) / 86400000 );
	// },

	// 24-hour format of an hour without leading zeros
	h: function() {
		return this.parent.hour();
	},

	// 12-hour format of an hour without leading zeros
	H: function() {
		var h = this.parent.hour();
		return ( h > 12 ? h -= 12 : h );
	},

	// 24-hour format of an hour with leading zeros
	hh: function() {
		var hh = this.parent.hour();
		return ( hh < 10 ? '0' + hh : hh );
	},

	// 12-hour format of an hour with leading zeros
	HH: function() {
		var h = this.parent.hour();
		return ( h > 12 ? h -= 12 : ( h < 10 ? '0' + h : h ) );
	},

	// Whether it's a leap year
	L: function() {
		var y = this.parent.year();
		return ( y % 4 === 0 ? ( y % 100 === 0 ? y % 400 === 0 : 1 ) : 0 );
	},

	// Minutes with leading zeros
	mm: function() {
		var mm = this.parent.min();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// Numeric representation of a month, without leading zeros
	M: function() {
		return this.parent.month();
	},

	// Numeric representation of a month, with leading zeros
	MM: function() {
		var mm = this.parent.month();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// A short textual representation of a month, three letters
	MMM: function() {
		// textual representations should be abstracted into
		// pluggable language files
		return this.parent.lang.mon[ this.parent.month() - 1 ];
	},

	// A full textual representation of a month, such as January or March
	MMMM: function() {
		return this.parent.lang.month[ this.parent.month() - 1 ];
	},

	// English ordinal suffix for the day of the month, 2 characters
	_o: function( j ) {
		if( j >= 11 && j <= 13 )
			j += "th";

		else {
			switch( j % 10 ) {
				case 1:  j += "st"; break;
				case 2:  j += "nd"; break;
				case 3:  j += "rd"; break;
				default: j += "th"; break;
			}
		}

		return j;
	},

	// Seconds, with leading zeros
	ss: function() {
		var ss = this.parent.sec();
		return ( ss < 10 ? '0' + ss : ss );
	},

	// Milliseconds
	u: function() {
		return this.parent.milli();
	},

	// Unix timestamp
	U: function() {
		Math.round( this.parent._d.time() / 1000 );
	},

	// ISO-8601 week number of year, weeks starting on Monday
	ww: function() {
		var d = new Date( this.parent.year(), 0, 1 );
		d = Math.ceil( ( this.parent._d - d ) / 86400000 );
		d += this.parent.date();
		d -= this.parent.day( true ) + 10;
		return Math.floor( d / 7 );
	},

	// A full numeric representation of a year, 4 digits
	YYYY: function() {
		return this.parent.year();
	},

	// A two digit representation of a year
	YY: function() {
		return parseInt( this.parent.year().toString().substr(-2) );
	},

	// 4 digit timezone offset with sign, ex: +/-0000
	Z: function() {
		var z = -( this.parent._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		return sign + this.parent.zero( Math.abs(z), 4 );
	},

	ZZ: function() {
		var z = -( this.parent._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		z = this.parent.zero( Math.abs(z), 4 );
		return sign + [ z.slice(0,2), z.slice(2,4) ].join(':');
	},

	// 3 letter time zone abbrev
	ZZZ: function() {
		return this.parent._d.toString().match(/\((\w*)\)/)[1];
	},

	// return full time zone name
	ZZZZ: function() {

	}
};

// 1123 and 2822 are the same format
Epoch.prototype.rfc1123 = Epoch.prototype.rfc2822 = function() {
	return this._d.toUTCString();
};


Epoch.prototype.rfc8601 = function() {
	return this.format('YYYY-MM-DD[T]hh:mm:ss[+0000]');
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
		this._hour = null;
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
		if( ! /(\+|-)\d/g.exec( val ) )
			val = val - 1;
		this._set( val, this._d.setMonth, this._d.getMonth );
	}

	// js returns jan = 0, dec = 11... don't know why
	// don't change this, I've tried adjusting at different stages
	// this is the one true way
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


/**
 * Get the number of milliseconds since the epoch
 */

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

})();