module.exports = (stores) => ({
	method: 'post',
	path: '/api/tasks',
	async func(req, res) {
		var n = await stores.tasks.create(req.body)
		return res.status(200).send(n);
	}
})