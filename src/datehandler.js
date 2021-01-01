// I gave up and used a library
const { DateTime } = require('luxon');
module.exports.getTimeForApi = function () {
	let localOpeningHour = 14;
	let utcOpeningHour = DateTime.fromObject({ hour: localOpeningHour }).toUTC().hour;
	let localTime = DateTime.fromObject({ zone: 'America/Tijuana' });
	let localCurrentHour = localTime.hour;

	if (localCurrentHour >= 0 && localCurrentHour < localOpeningHour) {
		// Send yesterday's date
		return (
			DateTime.fromObject({ year: localTime.year, month: localTime.month, day: localTime.day, hour: utcOpeningHour, minute: 0, second: 0 }).minus({ day: 1 }).toISO({ includeOffset: false }) +
			'Z'
		);
	} else {
		return DateTime.fromObject({ year: localTime.year, month: localTime.month, day: localTime.day, hour: utcOpeningHour, minute: 0, second: 0 }).toISO({ includeOffset: false }) + 'Z';
	}
};
