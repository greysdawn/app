const map = function(data, offset) {
	return Object.keys(data).map((k, i) => k+"=$"+(i+offset)).join(",");
}

function gen(len = 4, table = process.env.CHARS) {
	var hid = '';
	var val;
	while(hid.length < len) {
		val = Math.floor(Math.random() * table.length);
		hid += table[val];
	}

	return hid;
}

class Note {
	id;
	hid;
	title;
	content;
	created;
	edited;
	#store;
	
	constructor(store, data) {
		this.#store = store;
		for(var k in data) this[k] = data[k];
	}

	fetch() {
		return this.#store.get(this.hid);
	}

	update(data) {
		return this.#store.update(this.hid, data);
	}

	delete() {
		return this.#store.delete(this.hid);
	}
}

class NoteStore {
	#db;

	constructor(db) {
		this.#db = db;

		db.query(`
			create table if not exists notes (
				id serial primary key,
				hid text unique,
				title text,
				content text,
				created timestamptz,
				edited timestamptz
			)
		`)
	}

	async create(data) {
		var data = await this.#db.query(`
			INSERT INTO notes (
				hid,
				title,
				content,
				created
			) VALUES ($1,$2,$3,$4)
			RETURNING *
		`, [gen(), data.title, data.content, new Date()])

		return new Note(this, data.rows[0]);
	}

	async get(hid) {
		var data = await this.#db.query(`
			SELECT * FROM notes
			WHERE hid = $1
		`, [hid]);

		if(data?.rows?.[0]) return new Note(this, data.rows[0]);
		else return undefined;
	}

	async getAll() {
		var data = await this.#db.query(`
			SELECT * FROM notes
			ORDER BY id ASC
		`);

		if(data?.rows?.[0]) return data.rows.map(m => new Note(this, m));
		else return undefined;
	}

	async update(hid, data) {
		await this.#db.query(`
			UPDATE notes
			SET ${map(data, 2)}
			WHERE hid = $1
		`,[hid, ...Object.values(data)]);

		return await this.get(hid);
	}

	async delete(hid) {
		await this.#db.query(`
			DELETE FROM notes
			WHERE hid = $1
		`, [hid]);

		return;
	}

	async deleteAll(id) {
		await this.#db.query(`
			DELETE FROM notes
		`);

		return;
	}

	async deleteMass(ids) {
		await this.#db.query(`
			DELETE FROM notes
			WHERE hid = ANY($1)
		`, [ids]);

		return;
	}
}

module.exports = (db) => new NoteStore(db);