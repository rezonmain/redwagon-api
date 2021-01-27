const monk = require('monk');
const db =
	process.env.NODE_ENV === 'production' ? monk(process.env.MONGO_URI) : monk('localhost/test');

// Read all in collection
module.exports.readAll = async function (collectionName) {
	try {
		const collection = db.get(collectionName);
		const items = await collection.find({});
		return items;
	} catch (error) {
		console.log(error);
	} finally {
		db.close();
	}
};

module.exports.insert = async function (collectionName, data) {
	try {
		const collection = db.get(collectionName);
		if (!(data === undefined || data.length == 0)) {
			const inserted = await collection.insert(data);
			return inserted;
		} else {
			throw new Error(
				'DevExpection: Data was null, this means that data was empty or no item with any of the burger categories id was found in the response'
			);
		}
	} catch (error) {
		console.log(error);
	} finally {
		db.close();
	}
};

// module.exports.update = async function (collectionName, data) {
// 	try {
// 		const collection = db.get(collectionName);
// 		const inserted = await collection.insert(data);
// 		return inserted;
// 	} catch (error) {
// 		console.log(error);
// 	} finally {
// 		db.close();
// 	}
// };
