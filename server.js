require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const stores = require('./stores/__db')();

app.post('/api/notes', async (req, res) => {
	var n = await stores.notes.create(req.body)
	return res.status(200).send(n);
})

app.get('/api/notes', async (req, res) => {
	console.log('get', new Date())
	var notes = await stores.notes.getAll();
	return res.status(200).send(notes ?? []);
})

app.get('/api/note/:hid', async (req, res) => {
	var note = await stores.notes.get(req.params.hid);
	if(note) return res.status(200).send(note);
	else return res.status(404).send();
})

app.patch('/api/note/:hid', async (req, res) => {
	var n = await stores.notes.get(req.params.hid);
	if(!n) return res.status(404).send();

	n = await n.update({
		...req.body,
		edited: new Date()
	})
	return res.status(200).send(n);
})

app.delete('/api/note/:hid', async (req, res) => {
	await stores.notes.delete(req.params.hid);
	return res.status(200).send()
})

app.delete('/api/notes', async (req, res) => {
	await stores.notes.deleteAll();
	return res.status(200).send()
})

app.delete('/api/notes/mass', async (req, res) => {
	await stores.notes.deleteMass(req.body);
	return res.status(200).send()
})

app.listen(process.env.PORT || 8080)