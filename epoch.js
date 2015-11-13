(function (exports) {
"use strict";

// constructor wrapper
exports.epoch = function epoch( format, lang ) {
	lang = lang || 'en-us';

	// if format does not include time, add current time
	// otherwise GMT offset will push date to the next/previous day (+/- offset)
	if( /^\d{4}[.,-_]\d{2}[.,-_]\d{2}\s*$/.test(format) ){
		var cur = new Date();
		format += ' ' + [
			cur.getHours(),
			cur.getMinutes(),
			cur.getSeconds()
		].join(':');
	}

	return new Epoch( format, lang );
};


// constructor
function Epoch( format, lang ) {
	this._d = ( format ? new Date( format ) : new Date() );
	this.lang = this._lang[lang];
}


/**
 * Break a format down into componenets and execute their formatting fn
 */

Epoch.prototype.format = function format( str ) {
	try {
		if( str.length <= 0 ) {
			throw new Error('No format specified');
			return;
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

		return str.replace( rx, function( $0, $1, $2, $3 ) {
			// $1 will only be defined if escaped text was found

			if( typeof $1 === "undefined" ) {
				if( typeof f[$0] !== "function" && typeof $3 === "undefined" ) {
					throw new Error("Invalid format: " + $0);

					return;
				}

				// check for ordinal suffix in format
				// ($3 would be undefined if $0 was escaped text)
				return ( $3 === "o"
					? f._o.call( self, f[$0.replace( "o", "" )].call(self) )
					: f[$0].call(self)
				);
			}

			else {
				return $1 || $0;
			}
		} );
	} catch( e ) {
		throw new Error( e.message );
	}
};


/**
 * Reset the date object
 */

Epoch.prototype.reset = function reset() {
	this._date = this._day = this._week = this._month = null;
	this._year = this._hour = this._min = this._sec = null;
	this._milli = this._time = null;
};


/**
 * Attempt to accept unpredictable date formats and make them parsable
 */

Epoch.prototype.normalize = function normalize( date ) {
	if( /^\d{4}[.,-_]\d{2}[.,-_]\d{2}\s*$/.test( date ) ){
		var d = new Date();
		date += ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');
	}

	return date;
};


Epoch.prototype.diff = function( date, rel ) {
	rel = rel || { pre: this.lang.from.pre, suf: this.lang.from.suf };
	date = ( date ? new Date( this.normalize( date ) ) : new Date() );

	var interval = '',
		unit = '',
		diff = Math.floor( ( date - this._d ) / 1000 ),
		seconds = Math.abs( diff );

	if( seconds >= 31536000 || Math.floor( seconds / 2592000 ) === 12 ) {
		interval = Math.floor( seconds / 31536000 ) || 1;
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

	// singulural
	if( typeof interval === 'number' && interval > 1 )
		unit += 's'

	interval = interval + ' ' + unit;

	return ( diff > 0 ? rel.pre + ' ' + interval : interval + ' ' + rel.suf );
};

Epoch.prototype.from = Epoch.prototype.diff;

// collection of functions to return date formats

Epoch.prototype._format = {

	// Lowercase am/pm
	a: function() {
		return ( this.hour() > 11 ? 'pm' : 'am' );
	},

	// Uppercase AM/PM
	A: function() {
		return ( this.hour() > 11 ? 'PM' : 'AM' );
	},

	// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
	d: function() {
		return this.day();
	},

	// Numeric representation of the day of the week, 1 - 7 : Sun - Sat
	dd: function() {
		return this.day() + 1;
	},

	// A textual representation of a day, three letters
	ddd: function() {
		return this.lang.d[ this.day() ];
	},

	// A full textual representation of the day of the week
	dddd: function() {
		return this.lang.day[ this.day() ]
	},

	// Day of the month without leading zeros
	D: function() {
		return this.date();
	},

	// Day of the month with leading zeros
	DD: function() {
		var d = this.date();
		return ( d < 10 ? '0' + d : d );
	},

	// The day of the year (starting from 0)
	DDD: function() {
		var doy = new Date( this.year(), 0, 0 );
		return Math.ceil( ( this._d - doy ) / 86400000 );
	},

	// The day of the year (starting from 0)
	// DDDD: function() {
	// 	var doy = new Date( this.year(), 0, 0 );
	// 	return Math.ceil( ( this._d - doy ) / 86400000 );
	// },

	// 24-hour format of an hour without leading zeros
	h: function() {
		return this.hour();
	},

	// 12-hour format of an hour without leading zeros
	H: function() {
		var h = this.hour();
		return ( h > 12 ? h -= 12 : h );
	},

	// 24-hour format of an hour with leading zeros
	hh: function() {
		var hh = this.hour();
		return ( hh < 10 ? '0' + hh : hh );
	},

	// 12-hour format of an hour with leading zeros
	HH: function() {
		var h = this.hour();
		return ( h > 12 ? h -= 12 : ( h < 10 ? '0' + h : h ) );
	},

	// Minutes with leading zeros
	mm: function() {
		var mm = this.min();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// Numeric representation of a month, without leading zeros
	M: function() {
		return this.month();
	},

	// Numeric representation of a month, with leading zeros
	MM: function() {
		var mm = this.month();
		return ( mm < 10 ? '0' + mm : mm );
	},

	// A short textual representation of a month, three letters
	MMM: function() {
		// textual representations should be abstracted into
		// pluggable language files
		return this.lang.mon[ this.month() - 1 ];
	},

	// A full textual representation of a month, such as January or March
	MMMM: function() {
		return this.lang.month[ this.month() - 1 ];
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
		var ss = this.sec();
		return ( ss < 10 ? '0' + ss : ss );
	},

	// Milliseconds
	u: function() {
		return this.milli();
	},

	// Unix timestamp
	U: function() {
		Math.round( this._d.time() / 1000 );
	},

	// ISO-8601 week number of year, weeks starting on Monday
	ww: function() {
		var d = new Date( this.year(), 0, 1 );
		d = Math.ceil( ( this._d - d ) / 86400000 );
		d += this.date();
		d -= this.day( true ) + 10;
		return Math.floor( d / 7 );
	},

	// A full numeric representation of a year, 4 digits
	YYYY: function() {
		return this.year();
	},

	// A two digit representation of a year
	YY: function() {
		return parseInt( this.year().toString().substr(-2) );
	},

	// 4 digit timezone offset with sign, ex: +/-0000
	Z: function() {
		var z = -( this._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		return sign + this.zero( Math.abs(z), 4 );
	},

	ZZ: function() {
		var z = -( this._d.getTimezoneOffset() / .6 );
		var sign = ( z >= 0 ? '+' : '-' );
		z = this.zero( Math.abs(z), 4 );
		return sign + [ z.slice(0,2), z.slice(2,4) ].join(':');
	},

	// 3 letter time zone abbrev
	ZZZ: function() {
		return this._d.toString().match(/\((\w*)\)/)[1];
	},

	// return full time zone name
	ZZZZ: function() {

	}
};

Epoch.prototype.leapYear = function leapYear() {
	var y = this.year();
	return ( ( y % 4 === 0 ) && ( y % 100 !== 0 ) ) || ( y % 400 === 0 );
};

// 1123 and 2822 are the same format
Epoch.prototype.rfc1123 = function rfc1123() {
	return this._d.toUTCString();
};

Epoch.prototype.rfc2822 = function rfc2822() {
	return this._d.toUTCString();
};

Epoch.prototype.rfc8601 = function rfc8601() {
	return this.format('YYYY-MM-DD[T]hh:mm:ss[+0000]');
};

Epoch.prototype.sqldate = function sqldate() {
	return this.format('YYYY-MM-DD');
};

Epoch.prototype.sqltime = function sqltime() {
	return this.format('hh:mm:ss');
};

Epoch.prototype.datetime = function datetime() {
	return this.format('YYYY-MM-DD hh:mm:ss');
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
		if( ! /(\+|-)\d/g.exec( val ) )
			val = val - 1;
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

})( typeof window === 'undefined' ? module.exports : window );