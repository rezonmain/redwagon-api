const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loyverseApi = require('./loyversev2.js');
const dateHandler = require('./datehandler.js');
const utils = require('./utils.js');

const app = express();
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 min
	max: 10, // No more than 10 request a minute
});

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(helmet());

//Routes te amooooo osooooo
app.get('/', async (req, res, next) => {
	res.json({
		message: "Hello! This endpoint is redwagon's API 🍔",
	});
});

app.get('/number', async (req, res, next) => {
	try {
		const [beef, chicken] = await loyverseApi.getNumberOfBurgerSoldToday();
		res.json({
			beef: beef,
			chicken: chicken,
			timestamp: Date.now(),
		});
		// Logging
		console.log(`Me: beef: ${beef}, chicken: ${chicken}, date: ${dateHandler.localDate()}`);
	} catch (e) {
		next(e);
	}
});

//WebHooks, should come from loyverse
app.post('/item_update', (req, res, next) => {
	res.send(req.body);
	utils.writeJsonFile('./data/item_update.json', req.body);
	console.log(req.body);
});

app.post('/receipt_update', (req, res, next) => {
	res.send(req.body);
	utils.writeJsonFile('./data/receipt_update.json', req.body);
	console.log(req.body);
});

app.use((req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
});

app.use((error, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
	});
});

const port = process.env.PORT || 5000;
const url =
	process.env.NODE_ENV === 'production'
		? 'https://redwagon-api.herokuapp.com/'
		: `http://localhost:${port}`;
app.listen(port, () => {
	console.log(`Listening at: ${url}`);
});
