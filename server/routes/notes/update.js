module.exports = (stores) => ({
	method: 'patch',
	path: '/api/note/:hid',
	async func(req,res) {
		var n = await stores.notes.get(req.params.hid);
		if(!n) return res.status(404).send();

		n = await n.update({
			...req.body,
			edited: new Date()
		})
		return res.status(200).send(n);
	}
})