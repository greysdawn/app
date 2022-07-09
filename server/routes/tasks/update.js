module.exports = (stores) => ({
	method: 'patch',
	path: '/api/task/:hid',
	async func(req,res) {
		var t = await stores.tasks.get(req.params.hid);
		if(!t) return res.status(404).send();

		t = await t.update({
			...req.body,
			edited: new Date()
		})
		return res.status(200).send(t);
	}
})