require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Pool();
const stores = require('./stores/__db')();
console.log(stores);

app.post('/api/msg', async (req, res) => {
	var m = await stores.messages.create({content: req.body.text})
	console.log(m);
	return res.status(200).send(m);
})

app.patch('/api/msg/:id', async (req, res) => {
	var m = await stores.messages.get(req.params.id);
	if(!m) return res.status(404).send();

	m = await m.update({
		content: req.body.text,
		edited: new Date()
	})
	return res.status(200).send(m);
})

app.get('/api/msgs', async (req, res) => {
	var msgs = await stores.messages.getAll();
	console.log(msgs)
	return res.status(200).send(msgs ?? []);
})

app.delete('/api/msg/:id', async (req, res) => {
	await stores.messages.delete(req.params.id);
	return res.status(200).send()
})

app.delete('/api/msgs', async (req, res) => {
	await stores.messages.deleteAll();
	return res.status(200).send()
})

app.listen(8080)