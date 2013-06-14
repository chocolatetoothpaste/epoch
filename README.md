tiktok.js - Wonderful Date Formatting and Calculations in JavaScript
====================================================================

Examples:
---------

	tiktok.format('M j, Y');						// Aug 21, 2012; the date at time of writing
	tiktok.modify('2 weeks ago').format('m/d/y');	// 08/07/12
	tiktok.modify('last week').format('n/j');		// 8/14
	tiktok.modify('+2 months').format('F');		// October
	tiktok.modify('next year').format('Y')			// 2013
	tiktok.year();									// 2012

	tiktok.d().setMonth(11);						// December; d() is native Date object and native function setMonth()