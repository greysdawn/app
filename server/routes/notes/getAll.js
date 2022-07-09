module.exports = (stores) => ({
	method: 'get',
	path: '/api/notes',
	async func(req, res) {
		var notes = await stores.notes.getAll();
		return res.status(200).send(notes ?? []);
	}
})