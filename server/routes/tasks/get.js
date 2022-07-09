module.exports = (stores) => ({
	method: 'get',
	path: '/api/task/:hid',
	async func(req, res) {
		var task = await stores.tasks.get(req.params.hid);
		if(task) return res.status(200).send(task);
		else return res.status(404).send();
	}
})