module.exports = (stores) => ({
	method: 'delete',
	path: '/api/notes',
	async func(req,res) {
		await stores.notes.deleteAll();
		return res.status(200).send()
	}
})