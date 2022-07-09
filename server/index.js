require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function setup() {
	const stores = await require('./stores/__db.js')();
	const routes = await require('./routes')(stores);

	for(var route of routes) {
		app[route.method](route.path, route.func);
	}
}

setup()
.then(() => app.listen(process.env.PORT || 8080))