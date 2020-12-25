// Port python code
const fetch = require("node-fetch");

const api_key = process.env.API_KEY;
const auth_header = { Authorization: `Bearer ${api_key}` };

module.exports.numberOfBurgers = function () {
	return new Promise((resolve, reject) => {
		// Everything happens here!! 
		fetch(`https://api.loyverse.com/v1.0/items?limit=250`, {
			method: "get",
			headers: auth_header,
		})
			.then(handleBadResponse)
			.then(res => res.json()) // This returns data as json
			.then(jsonData => getBurgersId(jsonData)) // This returns id_s
			.then(id_s => burgerSoldToday(id_s)) // Returns number of burgers
			.then(number => resolve(number)) // Resolve returns the fufilled promise with the number
			.catch(error => {console.log(error); reject(error)})
	});
}

function handleBadResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}

// Get items with id of the burgers category (Basically get the item id of the burgers)
function getBurgersId(response) {
	let id_s = {};
    let category_id = '9a3d4344-71b4-11ea-8d93-0603130a05b8'
    let j = 0;

    for (let i = 0; i < response['items'].length; i++){
        let element = response['items'][i]['category_id'];
        if (element == category_id) {
            id_s[j] = response['items'][i]['id'];
            j++;
        }
	}
	return id_s;
}

// Generate time stamp of current day with opening hour time
function getOpeningDate() {
	let openingHour = 9;
	let ts = Date.now();
	let d = new Date(ts);
	let year = d.getUTCFullYear();
	let month = d.getUTCMonth() + 1;
	let day = d.getUTCDate();

	// Check if is next day on not working hours, if it is, use yesterdays date (so not to give date on the future to API)
	currentHour = d.getUTCHours();
	currentMinute = d.getUTCMinutes();

	// 8 => una hora antes de abrir 8:00 = 15:00utc
	if (currentHour >= 0 && currentHour < (openingHour)) {
		year = d.getUTCFullYear();
		month = d.getUTCMonth() + 1;
		day = d.getUTCDate() - 1;

		// To comply with day format DD cat 0, as datetime.now().day returns single char if day has 1 digit
		if (day.length == 1) {
			day = `0${day}`;
		}
		date = year + '-' + month + '-' + day;
	}
	date = `${year}-${month}-${day}T15:00:00.000Z` // Una hora antes de abrir
	return date;
}

// Extract burgers sold from todays receipts 
function burgerSoldToday(id_s) {
	return new Promise((resolve, reject) => {
		date = getOpeningDate();
		fetch(`https://api.loyverse.com/v1.0/receipts?created_at_min=${date}&limit=250`, {
			method: "get",
			headers: auth_header,
		})
			.then(response => response.json())
			.then((response) => {
				let burgersSold = {};
				let element = '';
				let p = 0;

				for (let i = 0; i < response['receipts'].length; i++) {
					for (let j = 0; j < response['receipts'][i]['line_items'].length; j++) {
						for(let x in id_s) {
							element = response['receipts'][i]['line_items'][j]['item_id'];
							if (id_s[x] == element) {
								burgersSold[p] = {};
								burgersSold[p]['id'] = element;
								burgersSold[p]['cantidad'] = response['receipts'][i]['line_items'][j]['quantity'];
								burgersSold[p]['nombre'] = response['receipts'][i]['line_items'][j]['item_name'];
								p++;
							}
						}
					}
				}
				return burgersSold;
			})
			.then(burgersSold => getNumber(burgersSold))
			.then(number => resolve(number)); // Resolve returns the promise with the number
		})
}

// Count number of burgers
function getNumber(burgersSold) {
	let numberOfBurgers = 0
	for (let i in burgersSold) {
		numberOfBurgers = numberOfBurgers + burgersSold[i]['cantidad'];
	}
	return numberOfBurgers;
}
