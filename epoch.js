/*
 * Eventually, epochjs.org but for now http://github.com/chocolatetoothpaste/epoch
 */

var Epoch = function( format ) {
	this._d = ( format ? new Date( format ) : new Date() );
	this._format.parent = this;
}

var epoch = function( format ) {
	return new Epoch( format ).lang();
}

epoch.fn = Epoch.prototype = {
	version: '0.0.4',

	// the lang loading function isn't working the way I want it to
	// ( for obvious reasons [to some] ), so hard coded for now
	// translators and contributors would be most welcome, esp for a solution
	// to loading languages dynamically, would love to hear ideas
	_lang: {
		month: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July',
			'August', 'September', 'October', 'November', 'December' ],

		mon: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
			'Oct', 'Nov', 'Dec' ]
	},

	lang: function( lang ) {
		lang = lang || 'en';
		var s = document.createElement( "script" );
		s.setAttribute("type", "text/javascript");
		s.setAttribute("src", this.path + "/lang/epoch." + lang + ".js");

		// load language file, then gc on global scope
		document.getElementsByTagName( "head" )[0].appendChild( s );
		delete s;

		return this;
	},

	format: function( str ) {
		var f = this._format, re = /(\[.*)?(\w)\2*(o)?(?!\])/g;

		return str.replace( re, function( $0, $1, $2, $3 ) {
			if( $3 === "o" )
				$0 = $0.replace( "o", "" );

			if( ! $1 ) {
				return ( $3 === "o" ? f._o( f[$0]() ) : f[$0]() );
			}
			else
				return $0;
		} ).replace(/\[|\]/g, "");
	},

	// strftime: function(str) {
	// 	var s = this._strftime;

	// 	var ff = str.replace(/%(\w)/g, function($0, $1) {
	// 		return 'asdf';
	// 	});

	// 	console.log(ff);

	// 	// var pattern = new RegExp(/%(\w)/g), match, tok = [];

	// 	// while (match = pattern.exec(str)) {
	// 	// 	if( tok.indexOf(match[1]) === -1 )
	// 	// 		tok.push(match[1]);
	// 	// }


	// },

	clear: function() {
		// this._d = ( format ? new Date(format) : new Date() );
		this._date = null, this._day = null, this._week = null,
		this._month = null, this._year = null, this._hour = null,
		this._min = null, this._sec = null, this._milli = null,
		this._time = null;

		return this;
	},

	zero: function( num, size ) {
		var s = String(num);
		while (s.length < size) s = "0" + s;
		return s;
	},


	// better

	from: function( date, rel ) {
		rel = rel || { pre: 'in ', suf: ' ago' };

		var interval, unit = '',
			from = ( date ? new Date( date ) : new Date() )
			diff = Math.floor( ( from - this._d ) / 1000 ),
			seconds = Math.abs( diff );

		delete from, date;

		if( seconds >= 31536000 ) {
			interval = Math.floor( seconds / 31536000 );
			unit = " year";
		}

		else if( seconds >= 2592000 ) {
			interval = Math.floor( seconds / 2592000 );
			unit = " month";
		}

		else if( seconds >= 86400 ) {
			interval = Math.floor( seconds / 86400 );
			unit = " day";
		}

		else if( seconds >= 3600 ) {
			interval = Math.floor( seconds / 3600 );
			unit = " hour";
		}

		else if( seconds >= 60 ) {
			interval = Math.floor( seconds / 60 );
			unit = " minute";
		}

		else
			interval = 'less than a minute';

		// check the interval first, the block below will modify it's value
		if( typeof interval === 'number' && interval > 1 )
			unit += 's'

		// check if the date is a value in the past or future
		if( diff > 0 )
			interval = rel.pre + interval;
		else
			unit += rel.suf;

		return interval + unit;

	},


	// collection of functions to calculate and return date formats
	_format: {

		// Lowercase Ante meridiem and Post meridiem
		a: function() {
			return ( this.parent.hour( null, true ) > 11
				? 'pm' : 'am' );
		},

		// Uppercase Ante meridiem and Post meridiem
		A: function() {
			return ( this.parent.hour( null, true ) > 11 ? 'PM' : 'AM' );
		},

		// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
		d: function() {
			return this.parent.day( true );
		},

		// A textual representation of a day, three letters
		ddd: function() {
			return [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
				][ this.parent.day( true ) ];
		},

		// A full textual representation of the day of the week
		dddd: function() {
			return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
				'Friday', 'Saturday' ][ this.parent.day( true ) ];
		},

		// Day of the month without leading zeros
		D: function() {
			return this.parent.date( null, true );
		},

		// Day of the month with leading zeros
		DD: function() {
			var d = this.parent.date( null, true );
			return ( d < 10 ? '0' + d : d );
		},

		// The day of the year (starting from 0)
		DDD: function() {
			var doy = new Date( this.parent.year( null, true ), 0, 0 );
			return Math.ceil( ( this.parent._d - doy ) / 86400000 );
		},

		// The day of the year (starting from 0)
		// DDDD: function() {
		// 	var doy = new Date( this.parent.year( null, true ), 0, 0 );
		// 	return Math.ceil( ( this.parent._d - doy ) / 86400000 );
		// },

		// 24-hour format of an hour without leading zeros
		h: function() {
			return this.parent.hour( null, true );
		},

		// 12-hour format of an hour without leading zeros
		H: function() {
			var h = this.parent.hour( null, true );
			return ( h > 12 ? h -= 12 : h );
		},

		// 24-hour format of an hour with leading zeros
		hh: function() {
			var hh = this.parent.hour( null, true );
			return ( hh < 10 ? '0' + hh : hh );
		},

		// 12-hour format of an hour with leading zeros
		HH: function() {
			var h = this.parent.hour( null, true );
			return ( h > 12 ? h -= 12 : ( h < 10 ? '0' + h : h ) );
		},

		// Whether it's a leap year
		L: function() {
			var y = this.parent.year( null, true );
			return ( y % 4 == 0 ? ( y % 100 == 0 ? year % 400 == 0 : 1 ) : 0 );
		},

		// Minutes with leading zeros
		mm: function() {
			var mm = this.parent.min( null, true );
			return ( mm < 10 ? '0' + mm : mm );
		},

		// Numeric representation of a month, without leading zeros
		M: function() {
			return this.parent.month( null, true );
		},

		// Numeric representation of a month, with leading zeros
		MM: function() {
			var mm = this.parent.month( null, true );
			return ( mm < 10 ? '0' + mm : mm );
		},

		// A short textual representation of a month, three letters
		MMM: function() {
			// textual representations should be abstracted into
			// pluggable language files
			return this.parent._lang.mon[ this.parent.month( null, true ) - 1 ];
		},

		// A full textual representation of a month, such as January or March
		MMMM: function() {
			return this.parent._lang.month[ this.parent.month( null, true ) - 1 ];
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

		// RFC 1123 formatted date
		r: function() {
			return this.parent._d.toUTCString();
		},

		// Seconds, with leading zeros
		ss: function() {
			var ss = this.parent.sec( null, true );
			return ( ss < 10 ? '0' + ss : ss );
		},

		// Milliseconds
		u: function() {
			return this.parent.milli( null, true );
		},

		// Unix timestamp
		U: function() {
			Math.round( this.parent._d.time() / 1000 );
		},

		// ISO-8601 week number of year, weeks starting on Monday
		ww: function() {
			var d = new Date( this.parent.year( null, true ), 0, 1 );
			d = Math.ceil( ( this.parent._d - d ) / 86400000 );
			d += this.parent.date( null, true );
			d -= this.parent.day( true ) + 10;
			return Math.floor( d / 7 );
		},

		// A full numeric representation of a year, 4 digits
		YYYY: function() {
			return this.parent.year( null, true );
		},

		// A two digit representation of a year
		YY: function() {
			return parseInt( this.parent.year( null, true ).toString().substr(-2) );
		},

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
	},


	// formatting token collection to use with strftime

	// _strftime: {

	// 	// The abbreviated weekday name according to the current locale.
	// 	a: function() {

	// 	},

	// 	// The full weekday name according to the current locale.
	// 	A: function() {

	// 	},

	// 	// The abbreviated month name according to the current locale.
	// 	b: function() {

	// 	},

	// 	// The full month name according to the current locale.
	// 	B: function() {

	// 	},

	// 	// The preferred date and time representation for the current locale.
	// 	c: function() {

	// 	},

	// 	// The century number (year/100) as a 2-digit integer. (SU)
	// 	C: function() {

	// 	},

	// 	// The day of the month as a decimal number (range 01 to 31).
	// 	d: function() {

	// 	},

	// 	// Equivalent to %m/%d/%y. (American)
	// 	D: function() {

	// 	},

	// 	// Like %d, the day of the month as a decimal number, but a leading zero
	// 	// is replaced by a space. (SU)
	// 	e: function() {

	// 	},

	// 	// Modifier: use alternative format, see below. (SU)
	// 	E: function() {

	// 	},

	// 	// Equivalent to %Y-%m-%d (the ISO 8601 date format). (C99)
	// 	F: function() {

	// 	},

	// 	// The ISO 8601 week-based year (see NOTES) with century as a decimal
	// 	// number. The 4-digit year corresponding to the ISO week number
	// 	// (see %V). This has the same format and value as %Y, except that if
	// 	// the ISO week number belongs to the previous or next year, that year
	// 	// is used instead. (TZ)
	// 	G: function() {

	// 	},

	// 	// Like %G, but without century, that is, with a 2-digit year (00-99).
	// 	// (TZ)
	// 	g: function() {

	// 	},

	// 	// Equivalent to %b. (SU)
	// 	h: function() {

	// 	},

	// 	// The hour as a decimal number using a 24-hour clock (range 00 to 23).
	// 	H: function() {

	// 	},

	// 	// The hour as a decimal number using a 12-hour clock (range 01 to 12).
	// 	I: function() {

	// 	},

	// 	// The day of the year as a decimal number (range 001 to 366).
	// 	j: function() {

	// 	},

	// 	// The hour (24-hour clock) as a decimal number (range 0 to 23); single
	// 	// digits are preceded by a blank. (See also %H.) (TZ)
	// 	k: function() {

	// 	},

	// 	// The hour (12-hour clock) as a decimal number (range 1 to 12); single
	// 	// digits are preceded by a blank. (See also %I.) (TZ)
	// 	l: function() {

	// 	},

	// 	// The month as a decimal number (range 01 to 12).
	// 	m: function() {

	// 	},

	// 	// The minute as a decimal number (range 00 to 59).
	// 	M: function() {

	// 	},

	// 	// A newline character. (SU)
	// 	n: function() {

	// 	},

	// 	// Modifier: use alternative format, see below. (SU)
	// 	O: function() {

	// 	},

	// 	// Either "AM" or "PM" according to the given time value, or the
	// 	// corresponding strings for the current locale. Noon is treated as "PM"
	// 	// and midnight as "AM".
	// 	p: function() {

	// 	},

	// 	// Like %p but in lowercase: "am" or "pm" or a corresponding string for
	// 	// the current locale. (GNU)
	// 	P: function() {

	// 	},

	// 	// The time in a.m. or p.m. notation. In the POSIX locale this is
	// 	// equivalent to %I:%M:%S %p. (SU)
	// 	r: function() {

	// 	},

	// 	// The time in 24-hour notation (%H:%M). (SU) For a version including
	// 	// the seconds, see %T below.
	// 	R: function() {

	// 	},

	// 	// The number of seconds since the Epoch, 1970-01-01 00:00:00 +0000
	// 	// (UTC). (TZ)
	// 	s: function() {

	// 	},

	// 	// The second as a decimal number (range 00 to 60). (The range is up to
	// 	// 60 to allow for occasional leap seconds.)
	// 	S: function() {

	// 	},

	// 	// A tab character. (SU)
	// 	t: function() {

	// 	},

	// 	// The time in 24-hour notation (%H:%M:%S). (SU)
	// 	T: function() {

	// 	},

	// 	// The day of the week as a decimal, range 1 to 7, Monday being 1. See
	// 	// also %w. (SU)
	// 	u: function() {

	// 	},

	// 	// The week number of the current year as a decimal number, range 00 to
	// 	// 53, starting with the first Sunday as the first day of week 01. See
	// 	// also %V and %W.
	// 	U: function() {

	// 	},

	// 	// The ISO 8601 week number (see NOTES) of the current year as a decimal
	// 	// number, range 01 to 53, where week 1 is the first week that has at
	// 	// least 4 days in the new year. See also %U and %W. (SU)
	// 	V: function() {

	// 	},

	// 	// The day of the week as a decimal, range 0 to 6, Sunday being 0. See
	// 	// also %u.
	// 	w: function() {

	// 	},

	// 	// The week number of the current year as a decimal number, range 00 to
	// 	// 53, starting with the first Monday as the first day of week 01.
	// 	W: function() {

	// 	},

	// 	// The preferred date representation for the current locale without the
	// 	// time.
	// 	x: function() {

	// 	},

	// 	// The preferred time representation for the current locale without the
	// 	// date.
	// 	X: function() {

	// 	},

	// 	// The year as a decimal number without a century (range 00 to 99).
	// 	y: function() {

	// 	},

	// 	// The year as a decimal number including the century.
	// 	Y: function() {

	// 	},

	// 	// The +hhmm or -hhmm numeric timezone (that is, the hour and minute
	// 	// offset from UTC). (SU)
	// 	z: function() {

	// 	},

	// 	// The timezone or name or abbreviation.
	// 	Z: function() {

	// 	}
	// },

	/**
	 * CACHE SECTION ***********************************************************
	 * here be lizards... changing below this line could break things, careful
	 */

	_d: null,
	_date: null,
	_day: null,
	_week: null,
	_month: null,
	_hour: null,
	_min: null,
	_sec: null,
	_milli: null,
	_year: null,
	_time: null,

	// modify: function( set, dSet, dGet ) {
	// 	dSet( ( /(\+|-)\d/g.exec( set )
	// 					? dGet() + parseInt( set )
	// 					: set - 1 ) );
	// },

	date: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._date = null;
			this._d.setDate( ( /(\+|-)\d/g.exec(set)
				? this._d.getDate() + parseInt( set )
				: set ) );
		}

		if( ! this._date )
			this._date = this._d.getDate();

		return ( echo ? this._date : this );
	},

	hour: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._hour = null;
			this._d.setHours( ( /(\+|-)\d/g.exec(set)
				? this._d.getHours() + parseInt( set )
				: set ) );
		}

		if( ! this._hour )
			this._hour = this._d.getHours();

		return ( echo ? this._hour : this );
	},

	min: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._min = null;
			this._d.setMinutes( ( /(\+|-)\d/g.exec(set)
				? this._d.getMinutes() + parseInt( set )
				: set ) );
		}

		if( ! this._min )
			this._min = this._d.getMinutes();

		return ( echo ? this._min : this );
	},

	sec: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._sec = null;
			this._d.setSeconds( ( /(\+|-)\d/g.exec(set)
				? this._d.getSeconds() + parseInt( set )
				: set ) );
		}

		if( ! this._sec )
			this._sec = this._d.getSeconds();

		return ( echo ? this._sec : this );
	},

	milli: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._milli = null;
			this._d.setMilliseconds( ( /(\+|-)\d/g.exec(set)
				? this._d.getMilliseconds() + parseInt( set )
				: set ) );
		}

		return ( echo ? this._milli : this );
	},

	month: function( set, echo ) {
		echo = echo || false;
		if( set ) {
			this._month = null;
			// console.log(setMonth);
			// this.modify(set, this._d.setMonth, this._d.getMonth);
			this._d.setMonth( ( /(\+|-)\d/g.exec(set)
				? this._d.getMonth() + parseInt( set )
				: set - 1 ) );
		}

		if( ! this._month )
			// js returns jan = 0, dec = 11... don't know why
			// don't change this, I've tried it both ways, this is the one true
			this._month = this._d.getMonth() + 1;

		return ( echo ? this._month : this );
	},

	year: function( set, echo ) {
		echo = echo || false;

		if( set ) {
			this._year = null;
			this._d.setFullYear( ( /(\+|-)\d/g.exec(set)
				? this._d.getFullYear() + parseInt( set )
				: set ) );
		}

		if( ! this._year )
			this._year = this._d.getFullYear();

		return ( echo ? this._year : this );
	},

	day: function( echo ) {
		echo = echo || false;

		if( ! this._day )
			this._day = this._d.getDay();

		return ( echo ? this._day : this );
	},

	time: function(echo) {
		echo = echo || false;

		if( ! this._time )
			this._time = this._d.getTime();

		return ( echo ? this._time : this );
	}
};

var arr = document.getElementsByTagName('script');
epoch.fn.path = arr[arr.length - 1].src.split( "/" ).slice( 0, -1 ).join( "/" );