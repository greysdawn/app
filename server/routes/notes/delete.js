module.exports = (stores) => ({
	method: 'delete',
	path: '/api/note/:hid',
	async func(req,res) {
		await stores.notes.delete(req.params.hid);
		return res.status(200).send()
	}
})