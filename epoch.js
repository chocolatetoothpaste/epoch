/*
 * Eventually, epochjs.org but for now http://github.com/chocolatetoothpaste/epoch
 */

(function () {

	var Epoch = function( format ) {
		this._d = ( format ? new Date( format ) : new Date() );
		this._format.parent = this;
	}

	var epoch = function( format ) {
		return new Epoch( format )//.lang();
	}

	epoch.fn = Epoch.prototype = {
		version: '0.0.8',

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

		// lang: function( lang ) {
		// 	lang = lang || 'en';
		// 	var s = document.createElement( "script" );
		// 	s.setAttribute("type", "text/javascript");
		// 	s.setAttribute("src", this.path + "/lang/epoch." + lang + ".js");

		// 	// load language file, then gc on global scope
		// 	document.getElementsByTagName( "head" )[0].appendChild( s );
		// 	delete s;

		// 	return this;
		// },

		// strftime: function( str ) {
			// load epoch.strftime.js to replace this function on the fly
		// },

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

		clear: function() {
			// this._d = ( format ? new Date(format) : new Date() );
			this._date = this._day = this._week = this._month = this._year =
			this._hour = this._min = this._sec = this._milli = this._time = null;
		},

		// wish there was a native method for this
		// zero: function( num, size ) {
		// 	var s = String(num);
		// 	while (s.length < size) s = "0" + s;
		// 	return s;
		// },


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
				return ( this.parent.hour() > 11
					? 'pm' : 'am' );
			},

			// Uppercase Ante meridiem and Post meridiem
			A: function() {
				return ( this.parent.hour() > 11 ? 'PM' : 'AM' );
			},

			// Numeric representation of the day of the week, 0 - 6 : Sun - Sat
			d: function() {
				return this.parent.day();
			},

			// A textual representation of a day, three letters
			ddd: function() {
				return [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
					][ this.parent.day() ];
			},

			// A full textual representation of the day of the week
			dddd: function() {
				return [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
					'Friday', 'Saturday' ][ this.parent.day() ];
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
				return ( y % 4 == 0 ? ( y % 100 == 0 ? year % 400 == 0 : 1 ) : 0 );
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
				return this.parent._lang.mon[ this.parent.month() - 1 ];
			},

			// A full textual representation of a month, such as January or March
			MMMM: function() {
				return this.parent._lang.month[ this.parent.month() - 1 ];
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

		date: function( set ) {
			if( set ) {
				this._date = null;
				this._d.setDate( ( /(\+|-)\d/g.exec(set)
					? this._d.getDate() + parseInt( set )
					: set ) );
			}

			if( ! this._date )
				this._date = this._d.getDate();

			return this._date;
		},

		hour: function( set ) {
			if( set ) {
				this._hour = null;
				this._d.setHours( ( /(\+|-)\d/g.exec(set)
					? this._d.getHours() + parseInt( set )
					: set ) );
			}

			if( ! this._hour )
				this._hour = this._d.getHours();

			return this._hour;
		},

		min: function( set ) {
			if( set ) {
				this._min = null;
				this._d.setMinutes( ( /(\+|-)\d/g.exec(set)
					? this._d.getMinutes() + parseInt( set )
					: set ) );
			}

			if( ! this._min )
				this._min = this._d.getMinutes();

			return this._min;
		},

		sec: function( set ) {
			if( set ) {
				this._sec = null;
				this._d.setSeconds( ( /(\+|-)\d/g.exec(set)
					? this._d.getSeconds() + parseInt( set )
					: set ) );
			}

			if( ! this._sec )
				this._sec = this._d.getSeconds();

			return this._sec;
		},

		milli: function( set ) {
			if( set ) {
				this._milli = null;
				this._d.setMilliseconds( ( /(\+|-)\d/g.exec(set)
					? this._d.getMilliseconds() + parseInt( set )
					: set ) );
			}

			return this._milli;
		},

		month: function( set ) {
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

			return this._month;
		},

		year: function( set ) {
			if( set ) {
				this._year = null;
				this._d.setFullYear( ( /(\+|-)\d/g.exec(set)
					? this._d.getFullYear() + parseInt( set )
					: set ) );
			}

			if( ! this._year )
				this._year = this._d.getFullYear();

			return this._year;
		},

		day: function() {
			if( ! this._day )
				this._day = this._d.getDay();

			return this._day;
		},

		time: function(echo) {
			if( ! this._time )
				this._time = this._d.getTime();

			return this._time;
		}
	};

	var root = this;

	if( typeof module !== 'undefined' && module.exports ) {
		module.exports = epoch;
		epoch.fn.path = __dirname;
	}

	else {
		epoch.fn.path = [].pop.call( document.getElementsByTagName( 'script' ) )
			.src.split( "/" ).slice( 0, -1 ).join( "/" );
		root.epoch = epoch;
	}
})();