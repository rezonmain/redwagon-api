// I FLIPPING HATE WORKING WITH TIME AND TIME ZONES AAH
// Pacific time is gmt - 8
module.exports.getTimeForApi = function (ts) {
	// This function has to DO THIS:
	// Return a iso 8601 time stamp of current working date with the openning hour - 1 (hour in utc opening time, so 22)
	// For example: if today is october 31 2020 at 15:00 pacific time, function has to return 2020-10-31T22:00:00.000Z
	// For example: if today is november 1 2020 at 00:01 pacific time, function has to return 2020-10-31T22:00:00.000Z
	// For example: if today is november 1 2020 at 15:00 pacific time, function has to return 2020-11-01T22:00:00.000Z
	// So date resets every working hour of each day

	// Rw opens at 2pm = 14:00
	let openingHour = 14; // A esta hora es cuando se resetea para el siguiente dia
	let utcOpeningHour = openingHour + 8;
	// let ts = Date.now(); // Returns time stamp off current date *pacific time* local time
	let d = new Date(ts);
	year = d.getFullYear();
	month = d.getMonth(); // 0 is january, but in ISO 8601 01 is january
	day = d.getDate();

	// Check if is next day on not working hours, if it is, use yesterdays date (so not to give date on the future to API)
	let currentHour = d.getHours();

	// If time is beetween 00:00 and 12:59, use yesterdays date (because restaurant has no opened yet) (New day at 1 hour minus openingHour)
	if (currentHour >= 0 && currentHour < openingHour - 1) {
		// Check for first day of month
		if (day == 1) {
			// Check for january
			if (month == 0) {
				month = 11;
				year = year - 1;
			} else {
				month = month - 1;
			}
			// If is the first day of month, get the last day of last
			day = getNumberOfDaysInMonth(month, year);
		} else {
			day = day - 1;
		}
	}

	year = year.toString();
	month = addZero((month + 1).toString());
	day = addZero(day.toString());
	// To comply with day format DD cat 0, as datetime.now().day returns single char if day has 1 digit

	date = `${year}-${month}-${day}T${utcOpeningHour}:00:00.000Z`; // Una hora antes de abrir
	return date;
};

function getNumberOfDaysInMonth(month, year) {
	switch (month) {
		case 0:
			return 31;
		case 1:
			return isleapYear(year) ? 29 : 28;
		case 2:
			return 31;
		case 3:
			return 30;
		case 4:
			return 31;
		case 5:
			return 30;
		case 6:
			return 31;
		case 7:
			return 31;
		case 8:
			return 30;
		case 9:
			return 31;
		case 10:
			return 30;
		case 11:
			return 31;
		default:
			return null;
	}
}

function isleapYear(year) {
	return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function addZero(date) {
	if (date.length == 1) {
		return `0${date}`;
	} else {
		return date;
	}
}
