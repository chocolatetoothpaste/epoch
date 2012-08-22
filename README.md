Quartz.js - Wonderful Date Formatting and Calculations in JavaScript
====================================================================

Examples:
---------

	Quartz.format('M j, Y');						// Aug 21, 2012
	Quartz.modify('2 weeks ago').format('m/d/y');	// 08/07/12
	Quartz.modify('+1 month').format('F');			// September
	Quartz.year();									// 2012

	Quartz.d().setMonth(11);						// December; d() is native Date object and native function setMonth()