tik.js - Wonderful Date Formatting and Calculations in JavaScript
====================================================================

Examples:
---------

	tik.format('M j, Y');						// Aug 21, 2012; the date at time of writing
	tik.modify('2 weeks ago').format('m/d/y');	// 08/07/12
	tik.modify('last week').format('n/j');		// 8/14
	tik.modify('+2 months').format('F');		// October
	tik.modify('next year').format('Y')			// 2013
	tik.year();									// 2012

	tik.d().setMonth(11);						// December; d() is native Date object and native function setMonth()