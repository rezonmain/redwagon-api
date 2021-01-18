// This function runs with heroku scheduler every day at opening time

const loyverseApi = require('../loyversev2.js');

(async () => {
	const [a, b] = await loyverseApi.getBurgerIds();
	console.log(a, b);
})();
