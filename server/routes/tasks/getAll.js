module.exports = (stores) => ({
	method: 'get',
	path: '/api/tasks',
	async func(req, res) {
		var tasks = await stores.tasks.getAll();
		return res.status(200).send(tasks ?? []);
	}
})