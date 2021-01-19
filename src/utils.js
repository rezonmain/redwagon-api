const { readFileSync, writeFileSync } = require('fs');
// Returns an object from a file
module.exports.readJsonFile = function (path) {
	try {
		return JSON.parse(readFileSync(path, 'utf-8'));
	} catch (e) {
		console.log(`ME: Unable to read file ${path} ` + e);
		return null;
	}
};

module.exports.writeJsonFile = function (path, data) {
	try {
		data = JSON.stringify(data, null, 4);
		writeFileSync(path, data);
	} catch (e) {
		console.log(`ME: unable to write file ${path}` + e);
	}
};
