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
		var len = str.length;
		var ret = '';

		for( var ii = 0; ii < len; ++ii )
			ret += ( this._format[ str[ii] ] != undefined
				? this._format[ str[ii] ]()
				: str[ii] );

		return ret;
	},

	reset: function(format) {
		this._d = ( format ? new Date(format) : new Date() );
		this._date = this._day = this._week = this._month = this._year = null;
		this._hour = this._min = this._sec = this._milli = this._time = null;

		return this;
	},

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

	interval: function() {
		var interval, seconds = Math.floor( ( new Date() - this._d ) / 1000 );

		interval = Math.floor( seconds / 31536000 );
		if( interval > 1 ) {
			return interval + " years";
		}

		interval = Math.floor( seconds / 2592000 );
		if( interval > 1 ) {
			return interval + " months";
		}

		interval = Math.floor( seconds / 86400 );
		if( interval > 1 ) {
			return interval + " days";
		}

		interval = Math.floor( seconds / 3600 );
		if( interval > 1 ) {
			return interval + " hours";
		}

		interval = Math.floor( seconds / 60 );
		if( interval > 1 ) {
			return interval + " minutes";
		}

		return "less than a minute";
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

		// A textual representation of a day, three letters
		// ISO:
		D: function() {
			return [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu',
				'Fri', 'Sat' ][ this.parent.day() ];
		},

		// Day of the month with leading zeros
		// ISO: DD
		d: function() {
			return this.parent.zero( this.parent.date() );
		},

		// A full textual representation of a month, such as January or March
		// MMMM
		F: function() {
			return [ 'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November',
				'December' ][ this.parent.month() - 1 ];
		},

		// 24-hour format of an hour without leading zeros
		// H
		G: function() {
			return this.parent.hour();
		},

		// 12-hour format of an hour without leading zeros
		// h
		g: function() {
			var h = this.parent.hour();
			return ( h > 12 ? h -= 12 : h );
		},

		// 24-hour format of an hour with leading zeros
		// HH
		H: function() {
			return this.parent.zero( this.parent.hour() );
		},

		// 12-hour format of an hour with leading zeros
		// hh
		h: function() {
			var h = this.parent.hour();
			return ( h > 12 ? h -= 12 : this.parent.zero( h ) );
		},

		// Minutes with leading zeros
		// mm
		i: function() {
			return this.parent.zero( this.parent.min() );
		},

		// Day of the month without leading zeros
		// D
		j: function() {
			return this.parent.date();
		},

		// Whether it's a leap year
		L: function() {
			var y = this.parent.year();
			if( y % 4 == 0)
				return ( y % 100 == 0 ? year % 400 == 0 : 1 );
			else
				return 0;
		},

		// A full textual representation of the day of the week
		// dddd
		l: function() {
			return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday' ][ this.parent.day() ];
		},

		// A short textual representation of a month, three letters
		// MMM
		M: function() {
			return [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
				'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][ this.parent.month() - 1 ];
		},

		// Numeric representation of a month, with leading zeros
		// ISO: MM
		m: function() {
			return this.parent.zero( this.parent.month() );
		},

		// Numeric representation of a month, without leading zeros
		// M
		n: function() {
			return this.parent.month();
		},

		// RFC 1123 formatted date
		// RFC1123
		r: function() {
			return this.parent._d.toUTCString();
		},

		// English ordinal suffix for the day of the month, 2 characters
		// o
		S: function() {
			var j = this.parent._d;
			if( j >= 11 && j <= 13 )
				return "th";

			switch( j % 10 ) {
				case 1:  return "st";
				case 2:  return "nd";
				case 3:  return "rd";
				default: return "th";
			}
		},

		// Seconds, with leading zeros
		// ss
		s: function() {
			return this.parent.zero( this.parent.sec() );
		},

		// Milliseconds
		u: function() {
			return this.parent.milli();
		},

		// ISO-8601 week number of year, weeks starting on Monday
		// ISO: ww
		W: function() {
			var d = new Date( this.parent.year(), 0, 1 );
			d = Math.ceil( ( this.parent._d - d ) / 86400000 );
			d += this.parent.date();
			d -= this.parent.day() + 10;
			return Math.floor( d / 7 );
		},

		// Numeric representation of the day of the week
		// ddd
		w: function() {
			return this.parent.day();
		},

		// A full numeric representation of a year, 4 digits
		// ISO: YYYY
		Y: function() {
			console.log(this.parent);
			return this.parent.year();
		},

		// A two digit representation of a year
		// YY
		y: function() {
			return parseInt( this.parent.year().toString().substr(-2) );
		},

		// The day of the year (starting from 0)
		// DDD
		z: function() {
			var f = new Date( this.parent.year(), 0, 1 );
			return Math.ceil( ( this.parent._d - f ) / 86400000 );
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
			this._date = this._d.getDate();;
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
			// js returns jan = 0, dec = 11 so add 1 (because most programmers
			// will end up doing this anyway, and most other languages do too)
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
