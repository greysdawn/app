module.exports = (stores) => ({
	method: 'delete',
	path: '/api/tasks/mass',
	async func(req,res) {
		await stores.tasks.deleteMass(req.body);
		return res.status(200).send()
	}
})