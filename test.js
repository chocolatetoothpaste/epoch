var epoch = require('./epoch');

exports.formats = function formats(test) {
	var a = epoch('2010-07-31 12:34:06');
	var c = epoch('1984-02-08 08:59:42');
	var b = epoch('2009-12-09 21:43:10');
	var f = epoch('2000-02-01 00:00:00');
	var n = epoch('2002-02-21 00:00:00');

	test.deepEqual(
		b.format('MMM Do, YYYY'),
		'Dec 9th, 2009',
		'Abbreviated text month with ordinal'
	);

	test.deepEqual(
		f.format('MMMM LL'),
		'February 29',
		'Last day of month (february, leap year)'
	);

	test.deepEqual(
		n.format('M/LL'),
		'2/28',
		'Last day of month (february, not leap year)'
	);

	test.deepEqual(
		a.format('MM-DD-YY'),
		'07-31-10',
		'american M/D/Y format'
	);

	test.deepEqual(
		c.format('DDDo [day since Jan 1]'),
		'40th day since Jan 1',
		'Day of the year with escaped text'
	);

	test.deepEqual(
		b.format('H:mm a'),
		'9:43 pm',
		'12-hour time with am/pm'
	);

	test.deepEqual(
		c.format('HH:mm:ss A'),
		'08:59:42 AM',
		'12-hour time with AM/PM'
	);

	test.deepEqual(
		c.format('ddd'),
		'Wed',
		'Short day of week'
	);

	test.deepEqual(
		a.format('dddd'),
		'Saturday',
		'Long day of week'
	);

	test.deepEqual(
		f.format('d'),
		'2',
		'Numeric day (0 - 6)'
	);

	test.deepEqual(
		n.format('ddo [day of the week]'),
		'5th day of the week',
		'Numeric day of the week (1 - 7) with escaped text'
	);

	test.deepEqual(
		b.format('hh'),
		'21',
		'hour (0 - 23)'
	);

	test.deepEqual(
		b.format('hh'),
		'21',
		'hour (0 - 23)'
	);

	test.deepEqual(
		a.format('s [seconds past] h'),
		'6 seconds past 12',
		'seconds without leading zero and escaped text'
	);

	test.deepEqual(
		c.format('U'),
		'445103982',
		'unix epoch seconds'
	);

	test.deepEqual(
		n.format('ww'),
		'8',
		'week of the year'
	);

	test.done();
};

exports.utility = function utility(test) {
	var a = epoch('2010-07-31 12:34:56');
	var c = epoch('1984-02-08 08:59:42');
	var b = epoch('2009-12-09 21:43:10');
	var f = epoch('2000-02-01 00:00:00');
	var n = epoch('2002-02-21 00:00:00');

	test.deepEqual(
		n.leap(),
		false,
		'boolean not leap year'
	);

	test.deepEqual(
		f.leap(),
		true,
		'boolean leap year'
	);

	test.deepEqual(
		a.sqldate(),
		'2010-07-31',
		'sqldate'
	);

	test.deepEqual(
		c.sqltime(),
		'08:59:42',
		'sqltime'
	);

	test.deepEqual(
		b.datetime(),
		'2009-12-09 21:43:10',
		'datetime'
	);

	test.deepEqual(
		a.sqleod(),
		'2010-07-31 23:59:59',
		'sqleod'
	);

	test.deepEqual(
		c.sqlsod(),
		'1984-02-08 00:00:00',
		'sqlsod'
	);

	test.deepEqual(
		n.rfc1123(),
		'Thu, 21 Feb 2002 07:00:00 GMT',
		'rfc1123'
	);

	test.deepEqual(
		b.iso8601(),
		'2009-12-09T21:43:10+0000',
		'iso8601'
	);

	test.done();
};


exports.shorthand = function shorthand(test) {
	var a = epoch('2010-07-31 12:34:56');
	var c = epoch('1984-02-08 08:59:42');
	var b = epoch('2009-12-09 21:43:10');
	var f = epoch('2000-02-01 00:00:00');
	var n = epoch('2002-02-21 00:00:00');

	test.deepEqual(
		b.month(),
		'12',
		'month()'
	);

	test.deepEqual(
		b.month('-3'),
		'9',
		'month(-3)'
	);

	test.deepEqual(
		n.month('+5'),
		'7',
		'month(+5)'
	);

	test.deepEqual(
		n.month('2'),
		'2',
		'month(\'2\')'
	);

	test.deepEqual(
		b.month(12),
		'12',
		'month(12s)'
	);

	test.deepEqual(
		a.year(),
		'2010',
		'year()'
	);

	test.deepEqual(
		a.year('+12'),
		'2022',
		'year(+12)'
	);

	test.deepEqual(
		c.year('-4'),
		'1980',
		'year(-4)'
	);

	test.deepEqual(
		c.year('1984'),
		'1984',
		'year(-4)'
	);

	test.deepEqual(
		a.year(2010),
		'2010',
		'year()'
	);

	test.deepEqual(
		f.date(),
		'1',
		'date()'
	);

	test.deepEqual(
		f.date('+14'),
		'15',
		'date(+14)'
	);

	test.deepEqual(
		c.date('-3'),
		'5',
		'date(-3)'
	);

	test.deepEqual(
		f.date('1'),
		'1',
		'date(\'1\')'
	);

	test.deepEqual(
		c.date(8),
		'8',
		'date(8)'
	);

	test.deepEqual(
		n.day(),
		'4',
		'day()'
	);

	test.deepEqual(
		a.time(),
		'1280601296000',
		'time()'
	);

	// test.deepEqual(
	// 	a.year('+12'),
	// 	'2022',
	// 	'year(+12)'
	// );

	// test.deepEqual(
	// 	c.year('-4'),
	// 	'1980',
	// 	'year(-4)'
	// );

	test.done();

};

exports.clone = function clone(test) {
	var e = epoch('2015-12-12 12:34:56');
	var f = epoch(e);

	test.deepEqual(
		e.datetime(),
		f.datetime(),
		'datetime'
	);

	// modify e to mismatch f
	e.month(5);

	test.deepEqual(
		f.format('M'),
		'12',
		'unmodified'
	);

	test.deepEqual(
		e.format('MM'),
		'05',
		'modified'
	);

	test.notDeepEqual(
		e.month(),
		f.month(),
		'not equal'
	);

	test.done();
};