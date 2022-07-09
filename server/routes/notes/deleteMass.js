module.exports = (stores) => ({
	method: 'delete',
	path: '/api/notes/mass',
	async func(req,res) {
		await stores.notes.deleteMass(req.body);
		return res.status(200).send()
	}
})