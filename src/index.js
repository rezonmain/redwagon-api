const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loyverseApi = require('./loyverse.js');

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

app.get('/', async (req, res, next) => {
	res.json({
		message: "Hello! This endpoint is redwagon's API 🍔",
	});
});

app.get('/number', async (req, res, next) => {
	try {
		const burgers = await loyverseApi.numberOfBurgers();
		res.json({
			number_burgers: burgers,
			timestamp: Date.now(),
		});
	} catch (e) {
		next(e);
	}
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
const url = process.env.NODE_ENV === 'production' ? 'https://redwagon-api.herokuapp.com/' : `http://localhost:${port}`;
app.listen(port, () => {
	console.log(`Listening at: ${url}`);
});
