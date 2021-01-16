// I gave up and used a library
const { DateTime } = require('luxon');
module.exports.getTimeForApi = function () {
	const localOpeningHour = 14;
	const utcOpeningHour = DateTime.fromObject({
		zone: 'America/Tijuana',
		hour: localOpeningHour,
	}).toUTC().hour;
	const localTime = DateTime.fromObject({ zone: 'America/Tijuana' });
	const localCurrentHour = localTime.hour;

	if (localCurrentHour >= 0 && localCurrentHour < localOpeningHour) {
		// Send yesterday's date
		return (
			DateTime.fromObject({
				year: localTime.year,
				month: localTime.month,
				day: localTime.day,
				hour: utcOpeningHour,
				minute: 0,
				second: 0,
			})
				.minus({ day: 1 })
				.toISO({ includeOffset: false }) + 'Z'
		);
	} else {
		return (
			DateTime.fromObject({
				year: localTime.year,
				month: localTime.month,
				day: localTime.day,
				hour: utcOpeningHour,
				minute: 0,
				second: 0,
			}).toISO({ includeOffset: false }) + 'Z'
		);
	}
};

module.exports.localDate = function () {
	let options = {
			timeZone: 'America/Tijuana',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		},
		formatter = new Intl.DateTimeFormat([], options);
	return formatter.format(new Date());
};
