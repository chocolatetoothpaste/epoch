Quartz.js - Wonderful Date Formatting and Calculations in JavaScript
====================================================================

Examples:
---------

	Quartz.format('M j, Y');						// Aug 21, 2012; the date at time of writing
	Quartz.modify('2 weeks ago').format('m/d/y');	// 08/07/12
	Quartz.modify('last week').format('n/j');		// 8/14
	Quartz.modify('+2 months').format('F');			// October
	Quartz.modify('next year').format('Y')			// 2013
	Quartz.year();									// 2012

	Quartz.d().setMonth(11);						// December; d() is native Date object and native function setMonth()