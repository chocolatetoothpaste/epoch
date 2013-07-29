(function() {
	epoch.fn.strftime: function(str) {
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


	};

	epoch.fn._strftime: {

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

		// Equivalent to %m/%d/%y. (American)
		D: function() {

		},

		// Like %d, the day of the month as a decimal number, but a leading zero
		// is replaced by a space. (SU)
		e: function() {

		},

		// Modifier: use alternative format, see below. (SU)
		E: function() {

		},

		// Equivalent to %Y-%m-%d (the ISO 8601 date format). (C99)
		F: function() {

		},

		// The ISO 8601 week-based year (see NOTES) with century as a decimal
		// number. The 4-digit year corresponding to the ISO week number
		// (see %V). This has the same format and value as %Y, except that if
		// the ISO week number belongs to the previous or next year, that year
		// is used instead. (TZ)
		G: function() {

		},

		// Like %G, but without century, that is, with a 2-digit year (00-99).
		// (TZ)
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

		// The hour (24-hour clock) as a decimal number (range 0 to 23); single
		// digits are preceded by a blank. (See also %H.) (TZ)
		k: function() {

		},

		// The hour (12-hour clock) as a decimal number (range 1 to 12); single
		// digits are preceded by a blank. (See also %I.) (TZ)
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

		// Either "AM" or "PM" according to the given time value, or the
		// corresponding strings for the current locale. Noon is treated as "PM"
		// and midnight as "AM".
		p: function() {

		},

		// Like %p but in lowercase: "am" or "pm" or a corresponding string for
		// the current locale. (GNU)
		P: function() {

		},

		// The time in a.m. or p.m. notation. In the POSIX locale this is
		// equivalent to %I:%M:%S %p. (SU)
		r: function() {

		},

		// The time in 24-hour notation (%H:%M). (SU) For a version including
		// the seconds, see %T below.
		R: function() {

		},

		// The number of seconds since the Epoch, 1970-01-01 00:00:00 +0000
		// (UTC). (TZ)
		s: function() {

		},

		// The second as a decimal number (range 00 to 60). (The range is up to
		// 60 to allow for occasional leap seconds.)
		S: function() {

		},

		// A tab character. (SU)
		t: function() {

		},

		// The time in 24-hour notation (%H:%M:%S). (SU)
		T: function() {

		},

		// The day of the week as a decimal, range 1 to 7, Monday being 1. See
		// also %w. (SU)
		u: function() {

		},

		// The week number of the current year as a decimal number, range 00 to
		// 53, starting with the first Sunday as the first day of week 01. See
		// also %V and %W.
		U: function() {

		},

		// The ISO 8601 week number (see NOTES) of the current year as a decimal
		// number, range 01 to 53, where week 1 is the first week that has at
		// least 4 days in the new year. See also %U and %W. (SU)
		V: function() {

		},

		// The day of the week as a decimal, range 0 to 6, Sunday being 0. See
		// also %u.
		w: function() {

		},

		// The week number of the current year as a decimal number, range 00 to
		// 53, starting with the first Monday as the first day of week 01.
		W: function() {

		},

		// The preferred date representation for the current locale without the
		// time.
		x: function() {

		},

		// The preferred time representation for the current locale without the
		// date.
		X: function() {

		},

		// The year as a decimal number without a century (range 00 to 99).
		y: function() {

		},

		// The year as a decimal number including the century.
		Y: function() {

		},

		// The +hhmm or -hhmm numeric timezone (that is, the hour and minute
		// offset from UTC). (SU)
		z: function() {

		},

		// The timezone or name or abbreviation.
		Z: function() {

		}
	};
})();