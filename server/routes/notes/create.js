module.exports = (stores) => ({
	method: 'post',
	path: '/api/notes',
	async func(req, res) {
		var n = await stores.notes.create(req.body)
		return res.status(200).send(n);
	}
})