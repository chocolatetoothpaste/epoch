epoch.js - Wonderful Date Formatting and Calculations in JavaScript
====================================================================

Examples:
---------

	epoch.format('M j, Y');						// Aug 21, 2012; the date at time of writing
	epoch.modify('2 weeks ago').format('m/d/y');	// 08/07/12
	epoch.modify('last week').format('n/j');		// 8/14
	epoch.modify('+2 months').format('F');		// October
	epoch.modify('next year').format('Y')			// 2013
	epoch.year();									// 2012

	epoch.d().setMonth(11);						// December; d() is native Date object and native function setMonth()