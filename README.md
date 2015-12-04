epoch.js - Wonderful Date Formatting and Calculations
=====================================================

**Important Notice**

Something weird happened right around version 0.2.6 or 0.2.7 that changed the way epoch was exported.  I don't know or understand what changed, so the code to export had to be changed.  Because of this, a breaking change is possible.  See "Easy to use" section below for how to correctly require and use epoch.  Unit testing is being built to make sure this mistake does not happen again.  Sorry for the inconvenience.

**Breaking change**

The epoch.from() method is reinstated, epoch.diff() will be introduced with new functionality in a future version.  Please update your code.


### Easy to use
	npm install epoch.js

	var epoch = require('epoch.js');

	var e = epoch();
	var date = epoch('2013-12-08 12:34:56');

	var e = epoch(); // defaults to current date/time
	var date = epoch( '2013-12-08 12:34:56' ); // setting date/time


### Familiar formatting tokens

	date.format('dddd MMM D, YYYY'); // Sunday Dec 8, 2013


### Intervals

	date.from('2012-12-08'); // 1 year ago
	date.from('2019-12-08'); // in 6 years
	date.from('2013-12-08 12:34:48'); // less than a minute ago


### Common Format Methods

**epoch.leapYear() or epoch.leap()** --- true/false if year is leap year

**epoch.rfc1123()** --- same as Date.toUTCString()

**epoch.rfc2822()** --- same as Date.toUTCString()

**epoch.iso8601()** --- YYYY-MM-DD[T]hh:mm:ss[+0000]

**epoch.sqldate()** --- YYYY-MM-DD

**epoch.sqltime()** --- hh:mm:ss

**epoch.datetime()** --- YYYY-MM-DD hh:mm:ss

**epoch.ordinal()** --- pass in any number and get back the number + ordinal suffix

### Setting/Getting

For all methods listed here, if the method is called with no argument, the current value of that date fragment is returned.  If a value is supplied, the internal Date object is updated and the updated date fragment returned.  These methods are wrappers for their native equivalents of a similar name.

#### Possible values:

- 5 or "9", integer or stringified integer - sets value
- "-2" or "+4" - adds or subtracts from existing value

#### Setters/Getters:

**epoch.date()**

**epoch.hour()**

**epoch.min()**

**epoch.sec()**

**epoch.milli()**

**epoch.month()**

**epoch.year()**

#### Getters only:

**epoch.day()**

**epoch.time()**


### Formatting

Dates can be formatted using epoch.format() and supplying tokens.  Example:

    // Sunday Dec 8, 2013
    epoch( '2013-12-08 12:34:56' ).format('dddd MMM D, YYYY');


#### Tokens

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

**m** --- Minutes without leading zeros

**mm** --- Minutes with leading zeros

**M** --- Numeric representation of a month, without leading zeros

**MM** --- Numeric representation of a month, with leading zeros

**MMM** --- A short textual representation of a month, three letters

**MMMM** --- A full textual representation of a month, such as January or March

**o** --- Ordinal suffix, can be used in conjuction with virtually any token. Example: Do, hho, Mo, etc...

**s** --- Seconds, without leading zeros

**ss** --- Seconds, with leading zeros

**u** --- Milliseconds

**U** --- Unix timestamp

**ww** --- ISO-8601 week number of year, weeks starting on Monday

**YY** --- A two digit representation of a year

**YYYY** --- A full numeric representation of a year, 4 digits

**Z** --- 4 digit timezone offset with sign, ex: +/-0000

**ZZ** --- 4 digit timezone offset with sign and colon, ex: +/-00:00

**ZZZ** --- 3 letter time zone abbrev