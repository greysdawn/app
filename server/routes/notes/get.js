module.exports = (stores) => ({
	method: 'get',
	path: '/api/note/:hid',
	async func(req, res) {
		var note = await stores.notes.get(req.params.hid);
		if(note) return res.status(200).send(note);
		else return res.status(404).send();
	}
})