module.exports = (stores) => ({
	method: 'delete',
	path: '/api/tasks',
	async func(req,res) {
		await stores.tasks.deleteAll();
		return res.status(200).send()
	}
})