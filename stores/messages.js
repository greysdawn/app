const map = function(data, offset) {
	return Object.keys(data).map((k, i) => k+"=$"+(i+offset)).join(",");
}

class Message {
	id;
	content;
	sent;
	edited;
	#store;
	
	constructor(store, data) {
		this.#store = store;
		for(var k in data) this[k] = data[k];
	}

	fetch() {
		return this.#store.get(this.id);
	}

	update(data) {
		return this.#store.update(this.id, data);
	}

	delete() {
		return this.#store.delete(this.id);
	}
}

class MsgStore {
	#db;

	constructor(db) {
		this.#db = db;

		db.query(`
			create table if not exists messages (
				id serial primary key,
				content text,
				sent timestamptz,
				edited timestamptz
			)
		`)
	}

	async create(data) {
		var data = await this.#db.query(`
			INSERT INTO messages (
				content,
				sent
			) VALUES ($1,$2)
			RETURNING *
		`, [data.content, new Date()])

		return new Message(this, data.rows[0]);
	}

	async get(id) {
		var data = await this.#db.query(`
			SELECT * FROM messages
			WHERE id = $1
		`, [id]);

		if(data?.rows?.[0]) return new Message(this, data.rows[0]);
		else return undefined;
	}

	async getAll() {
		var data = await this.#db.query(`
			SELECT * FROM messages
			ORDER BY id ASC
		`);

		if(data?.rows?.[0]) return data.rows.map(m => new Message(this, m));
		else return undefined;
	}

	async update(id, data) {
		await this.#db.query(`
			UPDATE messages
			SET ${map(data, 2)}
			WHERE id = $1
		`,[id, ...Object.values(data)]);

		return await this.get(id);
	}

	async delete(id) {
		await this.#db.query(`
			DELETE FROM messages
			WHERE id = $1
		`, [id]);

		return;
	}

	async deleteAll(id) {
		await this.#db.query(`
			DELETE FROM messages
		`);

		return;
	}
}

module.exports = (db) => new MsgStore(db);