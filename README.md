epoch.js - Wonderful Date Formatting and Calculations
=====================================================

**Breaking change**

The epoch.from() method is being renamed epoch.diff().  Semantically, diff makes more sense as the method name.  Both methods are available for use, but epoch.from() will be removed in the next major release (0.3.0, tentatively).

### Easy to use

	var e = epoch(); // defaults to current date/time
	var date = epoch( '2013-12-08 12:34:56' ); // setting date/time

### Familiar formatting, just like other popular libraries

	date.format('dddd MMM D, YYYY'); // Sunday Dec 8, 2013

### Sexy Intervals

	date.diff('2012-12-08'); // 1 year ago
	date.diff('2019-12-08'); // in 6 years

### Format Methods

**epoch.rfc1123** --- same as Date.toUTCString()

**epoch.rfc2822** --- same as Date.toUTCString()

**epoch.rfc8601** --- YYYY-MM-DD[T]hh:mm:ss[+0000]

### Format Tokens

**a** --- Lowercase am/pm

**A** --- Uppercase AM/PM

**d** --- Numeric representation of the day of the week, 0 - 6 : Sun - Sat

**dd** --- Numeric representation of the day of the week, 1 - 7 : Sun - Sat

**ddd** --- A textual representation of a day, three letters

**dddd** --- A full textual representation of the day of the week

**D** --- Day of the month without leading zeros

**DD** --- Day of the month with leading zeros

**DDD** --- The day of the year (starting from 0)

**h** --- 24-hour format of an hour without leading zeros

**H** --- 12-hour format of an hour without leading zeros

**hh** --- 24-hour format of an hour with leading zeros

**HH** --- 12-hour format of an hour with leading zeros

**L** --- Whether it's a leap year

**mm** --- Minutes with leading zeros

**M** --- Numeric representation of a month, without leading zeros

**MM** --- Numeric representation of a month, with leading zeros

**MMM** --- A short textual representation of a month, three letters

**MMMM** --- A full textual representation of a month, such as January or March

**o** --- Ordinal suffix, can be used in conjuction with virtually any token. Example: Do, hho, Mo, etc...

**ss** --- Seconds, with leading zeros

**u** --- Milliseconds

**U** --- Unix timestamp

**ww** --- ISO-8601 week number of year, weeks starting on Monday

**YY** --- A two digit representation of a year

**YYYY** --- A full numeric representation of a year, 4 digits

**Z** --- 4 digit timezone offset with sign, ex: +/-0000

**ZZ** --- 4 digit timezone offset with sign and colon, ex: +/-00:00

**ZZZ** --- 3 letter time zone abbrev