/*
 * Simple, logical, wonderful
 */

var Epoch = function(format){
	this.version = '0.1';
	this._d = ( format ? new Date(format) : new Date() );
	this._format.parent = this;
}

Epoch.prototype = {
	format: function( str ) {

		var f = this._format;

		// this is the new format token matcher when the switch to ISO formats
		// is made. it should end up being a lot faster than this one
		var tok = str.match(/(\w)\1*/g).filter(function(value, index, self) {
			return self.indexOf(value) === index;
		});


		for( token in tok ) {
			if( typeof f[tok[token]] === 'function' ) {
				var t = tok[token][0];

				// the first group is to mimick lookbehind because JS doesn't
				// have support for it (WTFF!!)

				// need to get this section working, it is one complicated expression
				/* var patt = new RegExp('(\\[).*?(' + t + ')?(' + tok[token] + ')(?!' + t + ')(o?)(?!\\])?', 'g');

				str = str.replace(patt, function( $0, $1, $2, $3, $4 ) {
					console.log($1);
					if( ! $1 ) {
						// var ret = ( $1 ? $0 : f[tok[token]]() );
						var ret = ( $2 ? $0 : f[tok[token]]() );
						return ret;
						// ret = ( $1 ? $0 : ret );
						// return ( $4 === 'o' ? f._o(ret) : ret );
					}
				});*/

				var patt = new RegExp('(' + t + ')?(' + tok[token] + ')(?!' + t + ')(o?)', 'g');

				str = str.replace(patt, function( $0, $1, $2, $3, $4 ) {
					var ret = ( $1 ? $0 : f[tok[token]]() );
					return ( $4 === 'o' ? f._o(ret) : ret );
				});
			}
		}

		return str;

		/*var flags = Object.getOwnPropertyNames( f ).filter( function( property ) {
			return typeof f[property] == 'function';
		});

		// console.log(flags);
		var len = str.length;
		var ret = '';

		for( var ii = 0; ii < len; ++ii )
			ret += ( this._format[ str[ii] ] != undefined
				? this._format[ str[ii] ]()
				: str[ii] );

		return ret;*/
	},

	strftime: function(str) {
		var s = this._strftime;

		var ff = str.replace(/%(\w)/g, function($0, $1) {
			return 'asdf';
		});

		console.log(ff);

		// var pattern = new RegExp(/%(\w)/g), match, tok = [];

		// while (match = pattern.exec(str)) {
		// 	if( tok.indexOf(match[1]) === -1 )
		// 		tok.push(match[1]);
		// }


	},

	/*reset: function(format) {
		this._d = ( format ? new Date(format) : new Date() );
		this._date = this._day = this._week = this._month = this._year = null;
		this._hour = this._min = this._sec = this._milli = this._time = null;

		return this;
	},*/

	modify: function( str ) {
		// search for relative statements like:
		// +/- x week(s), last/next month, x week(s) ago
		var m = /(\+?\d*|\-\d*|next|last)?\s+(day|week|month|year)s?\s?(ago)*/gi
			.exec( str );
		m.splice( 0, 1 );

		// test if the relative time is numeric
		var num = /(\-|\+)?\d+/.test( m[0] );
		var unit = m[1];

		if( m[0] == 'next' || num || m[0] == 'last' ) {

			var rel = ( num ? parseInt( m[0] ) : 1 );

			if( m[0] == 'last' )
				rel = -1;

			// if ago is found, make rel negative so it is subtracted
			if( m[2] == 'ago' )
				rel = -rel;

			// calling the native "get" methods because calling .month(), etc
			// was causing the _month, etc to get cached and not work properly
			if( unit == 'day' )
				this._d.setDate( this._d.getDate() + rel );
			else if( unit == 'month' )
				this._d.setMonth( this._d.getMonth() + rel );
			else if( unit == 'week' )
				// no use calculating 7*24*60*60*1000 every time;
				// 604800000 = 1 week in milliseconds
				this._d.setTime( this._d.getTime() + ( 604800000 * rel ) );
			else if( unit == 'year' )
				this._d.setFullYear( this._d.getFullYear() + rel );
			else
				throw "Unrecognized unit: " + unit;

		}

		return this;
	},

	from: function( date ) {
		var interval, unit = '',
			from = ( date ? new Date( date ) : new Date() )
			diff = Math.floor( ( from - this._d ) / 1000 ),
			seconds = Math.abs( diff );

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
			interval = 'in ' + interval;
		else
			unit += ' ago';

		return interval + unit;

	},

	// zero pad numbers less than 10
	zero: function( num ) {
		return ( num < 10 ? '0' + num : num );
	},

	// collection of functions to calculate and return date formats
	_format: {

/*
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]*/

		// Lowercase Ante meridiem and Post meridiem
		a: function() {
			return ( this.parent.hour() > 11
				? 'pm' : 'am' );
		},

		// Uppercase Ante meridiem and Post meridiem
		A: function() {
			return ( this.parent.hour() > 11
				? 'PM' : 'AM' );
		},


		// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
		d: function() {
			return this.parent.day();
		},

		// A textual representation of a day, three letters
		// ISO:
		ddd: function() {
			return [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu',
				'Fri', 'Sat' ][ this.parent.day() ];
		},

		// A full textual representation of the day of the week
		dddd: function() {
			return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday' ][ this.parent.day() ];
		},

		// Day of the month without leading zeros
		D: function() {
			return this.parent.date();
		},

		// Day of the month with leading zeros
		// ISO: DD
		DD: function() {
			return this.parent.zero( this.parent.date() );
		},

		// The day of the year (starting from 0)
		// DDD
		DDD: function() {
			var f = new Date( this.parent.year(), 0, 1 );
			return Math.ceil( ( this.parent._d - f ) / 86400000 );
		},

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
		// hh
		hh: function() {
			return this.parent.zero( this.parent.hour() );
		},

		// 12-hour format of an hour with leading zeros
		// HH
		HH: function() {
			var h = this.parent.hour();
			return ( h > 12 ? h -= 12 : this.parent.zero( h ) );
		},

		// Whether it's a leap year
		L: function() {
			var y = this.parent.year();
			if( y % 4 == 0)
				return ( y % 100 == 0 ? year % 400 == 0 : 1 );
			else
				return 0;
		},

		// Minutes with leading zeros
		// mm
		mm: function() {
			return this.parent.zero( this.parent.min() );
		},


		// Numeric representation of a month, without leading zeros
		// M
		M: function() {
			return this.parent.month();
		},

		// Numeric representation of a month, with leading zeros
		// ISO: MM
		// m: function() {
		MM: function() {
			return this.parent.zero( this.parent.month() );
		},

		// A short textual representation of a month, three letters
		// MMM
		MMM: function() {
			return [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
				'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][ this.parent.month() - 1 ];
		},

		// A full textual representation of a month, such as January or March
		// F: function() {
		MMMM: function() {
			return [ 'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November',
				'December' ][ this.parent.month() - 1 ];
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
		// RFC1123
		// r: function() {
		r: function() {
			return this.parent._d.toUTCString();
		},

		// Seconds, with leading zeros
		// ss
		ss: function() {
			return this.parent.zero( this.parent.sec() );
		},

		// Milliseconds
		u: function() {
			return this.parent.milli();
		},

		// Unix timestamp
		// This one stays the same!
		U: function() {
			Math.round( this.parent._d.time() / 1000 );
		},

		// ISO-8601 week number of year, weeks starting on Monday
		// ISO: ww
		ww: function() {
			var d = new Date( this.parent.year(), 0, 1 );
			d = Math.ceil( ( this.parent._d - d ) / 86400000 );
			d += this.parent.date();
			d -= this.parent.day() + 10;
			return Math.floor( d / 7 );
		},

		// A full numeric representation of a year, 4 digits
		// ISO: YYYY
		YYYY: function() {
			return this.parent.year();
		},

		// A two digit representation of a year
		// y: function() {
		YY: function() {
			return parseInt( this.parent.year().toString().substr(-2) );
		},

	},

	_strftime: {
		// The abbreviated weekday name according to the current locale.
		a: function() {

		},

		// The full weekday name according to the current locale.
		A: function() {

		},

		// The abbreviated month name according to the current locale.
		b: function() {

		},

		// The full month name according to the current locale.
		B: function() {

		},

		// The preferred date and time representation for the current locale.
		c: function() {

		},

		// The century number (year/100) as a 2-digit integer. (SU)
		C: function() {

		},

		// The day of the month as a decimal number (range 01 to 31).
		d: function() {

		},

		// Equivalent to %m/%d/%y. (Yecch-for Americans only. Americans should note that in other countries %d/%m/%y is rather common. This means that in international context this format is ambiguous and should not be used.) (SU)
		D: function() {

		},

		// Like %d, the day of the month as a decimal number, but a leading zero is replaced by a space. (SU)
		e: function() {

		},

		// Modifier: use alternative format, see below. (SU)
		E: function() {

		},

		// Equivalent to %Y-%m-%d (the ISO 8601 date format). (C99)
		F: function() {

		},

		// The ISO 8601 week-based year (see NOTES) with century as a decimal number. The 4-digit year corresponding to the ISO week number (see %V). This has the same format and value as %Y, except that if the ISO week number belongs to the previous or next year, that year is used instead. (TZ)
		G: function() {

		},

		// Like %G, but without century, that is, with a 2-digit year (00-99). (TZ)
		g: function() {

		},

		// Equivalent to %b. (SU)
		h: function() {

		},

		// The hour as a decimal number using a 24-hour clock (range 00 to 23).
		H: function() {

		},

		// The hour as a decimal number using a 12-hour clock (range 01 to 12).
		I: function() {

		},

		// The day of the year as a decimal number (range 001 to 366).
		j: function() {

		},

		// The hour (24-hour clock) as a decimal number (range 0 to 23); single digits are preceded by a blank. (See also %H.) (TZ)
		k: function() {

		},

		// The hour (12-hour clock) as a decimal number (range 1 to 12); single digits are preceded by a blank. (See also %I.) (TZ)
		l: function() {

		},

		// The month as a decimal number (range 01 to 12).
		m: function() {

		},

		// The minute as a decimal number (range 00 to 59).
		M: function() {

		},

		// A newline character. (SU)
		n: function() {

		},

		// Modifier: use alternative format, see below. (SU)
		O: function() {

		},

		// Either "AM" or "PM" according to the given time value, or the corresponding strings for the current locale. Noon is treated as "PM" and midnight as "AM".
		p: function() {

		},

		// Like %p but in lowercase: "am" or "pm" or a corresponding string for the current locale. (GNU)
		P: function() {

		},

		// The time in a.m. or p.m. notation. In the POSIX locale this is equivalent to %I:%M:%S %p. (SU)
		r: function() {

		},

		// The time in 24-hour notation (%H:%M). (SU) For a version including the seconds, see %T below.
		R: function() {

		},

		// The number of seconds since the Epoch, 1970-01-01 00:00:00 +0000 (UTC). (TZ)
		s: function() {

		},

		// The second as a decimal number (range 00 to 60). (The range is up to 60 to allow for occasional leap seconds.)
		S: function() {

		},

		// A tab character. (SU)
		t: function() {

		},

		// The time in 24-hour notation (%H:%M:%S). (SU)
		T: function() {

		},

		// The day of the week as a decimal, range 1 to 7, Monday being 1. See also %w. (SU)
		u: function() {

		},

		// The week number of the current year as a decimal number, range 00 to 53, starting with the first Sunday as the first day of week 01. See also %V and %W.
		U: function() {

		},

		// The ISO 8601 week number (see NOTES) of the current year as a decimal number, range 01 to 53, where week 1 is the first week that has at least 4 days in the new year. See also %U and %W. (SU)
		V: function() {

		},

		// The day of the week as a decimal, range 0 to 6, Sunday being 0. See also %u.
		w: function() {

		},

		// The week number of the current year as a decimal number, range 00 to 53, starting with the first Monday as the first day of week 01.
		W: function() {

		},

		// The preferred date representation for the current locale without the time.
		x: function() {

		},

		// The preferred time representation for the current locale without the date.
		X: function() {

		},

		// The year as a decimal number without a century (range 00 to 99).
		y: function() {

		},

		// The year as a decimal number including the century.
		Y: function() {

		},

		// The +hhmm or -hhmm numeric timezone (that is, the hour and minute offset from UTC). (SU)
		z: function() {

		},

		// The timezone or name or abbreviation.
		Z: function() {

		}
	},

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

	date: function() {
		if( ! this._date )
			this._date = this._d.getDate();
		return this._date;
	},

	hour: function() {
		if( ! this._hour )
			this._hour = this._d.getHours();
		return this._hour;
	},

	min: function() {
		if( ! this._min )
			this._min = this._d.getMinutes();
		return this._min;
	},

	sec: function() {
		if( ! this._sec )
			this._sec = this._d.getSeconds();
		return this._sec;
	},

	milli: function() {
		if( ! this._milli )
			this._milli = this._d.getMilliseconds();
		return this._milli;
	},

	month: function() {
		if( ! this._month )
			// js returns jan = 0, dec = 11... don't know why
			this._month = this._d.getMonth() + 1;
		return this._month;
	},

	year: function() {
		if( ! this._year )
			this._year = this._d.getFullYear();
		return this._year;
	},

	day: function() {
		if( ! this._day )
			this._day = this._d.getDay();
		return this._day;
	},

	time: function() {
		if( ! this._time )
			this._time = this._d.getTime();
		return this._time;
	}
};


var epoch = function(format) {
	return new Epoch(format);
}