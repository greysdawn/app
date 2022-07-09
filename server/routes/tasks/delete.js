module.exports = (stores) => ({
	method: 'delete',
	path: '/api/task/:hid',
	async func(req,res) {
		await stores.tasks.delete(req.params.hid);
		return res.status(200).send()
	}
})