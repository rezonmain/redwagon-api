const fetch = require('node-fetch');
const { readFileSync, writeFileSync } = require('fs');
const dateHandler = require('./datehandler.js');
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
// Fetch data from api:
// returns a promise
function requestFromApi(option) {
	return new Promise((resolve, reject) => {
		const api_key = process.env.API_KEY;
		const authHeader = { Authorization: `Bearer ${api_key}` };
		fetch(`https://api.loyverse.com/v1.0/${option}`, {
			method: 'GET',
			headers: authHeader,
		})
			.then(handleBadResponse)
			.then((res) => res.json())
			.then((res) => resolve(res))
			.catch((error) => {
				console.log('API ERROR: ' + error);
				reject(error);
			});
	});
}

// Handles a bad response
function handleBadResponse(res) {
	if (!res.ok) {
		throw Error(res.statusText);
	}
	return res;
}

// TODO: only run this function on opening hour with heroku scheduler (cron)
// BTW IT WORKS AWESOMEEEEE
async function getBurgerIds() {
	// Category ids:
	const beef = '9a3d4344-71b4-11ea-8d93-0603130a05b8';
	const chicken = '13489b13-bc2f-47ed-ae7e-d0f6c98d59b7';
	const items = await requestFromApi('items?limit=250');
	let ids_beef = findItemsWithCategoryId(items, beef);
	let ids_chicken = findItemsWithCategoryId(items, chicken);
	writeJsonFile('./data/ids_beef.json', ids_beef);
	writeJsonFile('./data/ids_chicken.json', ids_chicken);
}

// Returns object with items with that category id
// Only used by getBurgersIds method
function findItemsWithCategoryId(items, category_id) {
	let data = {};
	let i = 0;
	items['items'].forEach((item, index) => {
		if (item.category_id === category_id) {
			data[i] = item.id;
			i++;
		}
	});
	return data;
}

// Exported function
module.exports.getNumberOfBurgerSoldToday = async function (readReceiptsFromFile = false) {
	const idsBeef = readJsonFile('./data/ids_beef.json');
	const idsChicken = readJsonFile('./data/ids_chicken.json');
	let burgers = {
		beef: [],
		chicken: [],
	};
	const date = dateHandler.getTimeForApi();
	let receipts;
	if (readReceiptsFromFile) {
		receipts = readJsonFile('./data/receipts.json');
	} else {
		receipts = await requestFromApi(`receipts?created_at_min=${date}&limit=250`);
	}
	receipts['receipts'].forEach((receipts, index) => {
		receipts['line_items'].forEach((lineItem, index) => {
			// Check for beef burgers
			Object.keys(idsBeef).forEach((key) => {
				if (lineItem.item_id === idsBeef[key]) {
					burgers.beef.push({
						id: lineItem.id,
						name: lineItem.item_name,
						quantity: lineItem.quantity,
					});
				}
			});
			// Check for chicken burgers
			Object.keys(idsChicken).forEach((key) => {
				if (lineItem.item_id === idsChicken[key]) {
					burgers.chicken.push({
						id: lineItem.id,
						name: lineItem.item_name,
						quantity: lineItem.quantity,
					});
				}
			});
		});
	});
	// writeJsonFile('./data/burgersSold.json', burgers);
	return countBurgers(burgers);
};

function countBurgers(burgersSold) {
	let beef = 0;
	let chicken = 0;
	for (let i in burgersSold.beef) {
		beef = beef + burgersSold.beef[i]['quantity'];
	}
	for (let i in burgersSold.chicken) {
		chicken = chicken + burgersSold.chicken[i]['quantity'];
	}
	return [beef, chicken];
}

// Returns an object from a file
function readJsonFile(path) {
	try {
		return JSON.parse(readFileSync(path, 'utf-8'));
	} catch (e) {
		console.log(`ME: Unable to read file ${path} ` + e);
		return null;
	}
}

function writeJsonFile(path, data) {
	try {
		data = JSON.stringify(data, null, 4);
		writeFileSync(path, data);
	} catch (e) {
		console.log(`ME: unable to write file ${path}` + e);
	}
}

// // async IFFE for testing
// (async () => {
// 	let [b, c] = await getNumberOfBurgerSoldToday();
// 	console.log(b, c);
// })();
