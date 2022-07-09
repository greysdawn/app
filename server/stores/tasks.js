const map = function(data, offset) {
	return Object.keys(data).map((k, i) => k+"=$"+(i+offset)).join(",");
}

const Priorities = {
	Urgent: 'urgent',
	High: 'high',
	Medium: 'medium',
	Low: 'low',
	None: 'none'
}

/*
	Checklist schema:
	name text,
	done boolean
*/

class Task {
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

class TaskStore {
	Priorities = Priorities;
	#db;

	constructor(db) {
		this.#db = db;
	}

	async init() {
		await this.#db.query(`
			create table if not exists tasks (
				id serial primary key,
				hid text unique,
				title text,
				content text,
				checklist jsonb,
				priority text,
				tags integer[],
				due_date timestamptz,
				created timestamptz,
				edited timestamptz,
				done boolean
			)
		`)
	}

	async create(data) {
		var checklist;
		if(data.checklist) {
			if(typeof data.checklist == 'string')
				checklist = data.checklist;
			else checklist = JSON.stringify(data.checklist);
		} else checklist = JSON.stringify([])
		console.log(checklist, data)
		var data = await this.#db.query(`
			INSERT INTO tasks (
				hid,
				title,
				content,
				checklist,
				priority,
				tags,
				due_date,
				created
			) VALUES (find_unique('notes'),$1,$2,$3,$4,$5,$6,$7)
			RETURNING *
		`, [data.title, data.content, checklist,
			data.priority ?? Priorities.None, data.tags ?? [],
			data.due_date, new Date()])

		return new Task(this, data.rows[0]);
	}

	async get(hid) {
		var data = await this.#db.query(`
			SELECT * FROM tasks
			WHERE hid = $1
		`, [hid]);
		console.log(data.rows[0])

		if(data?.rows?.[0]) return new Task(this, data.rows[0]);
		else return undefined;
	}

	async getAll() {
		var data = await this.#db.query(`
			SELECT * FROM tasks
			ORDER BY id ASC
		`);

		if(data?.rows?.[0]) return data.rows.map(m => new Task(this, m));
		else return undefined;
	}

	async update(hid, data) {
		var checklist;
		if(data.checklist) {
			if(typeof data.checklist == 'string')
				checklist = data.checklist;
			else checklist = JSON.stringify(data.checklist);
		} else checklist = JSON.stringify([])
		data.checklist = checklist;
		await this.#db.query(`
			UPDATE tasks
			SET ${map(data, 2)}
			WHERE hid = $1
		`,[hid, ...Object.values(data)]);

		return await this.get(hid);
	}

	async delete(hid) {
		await this.#db.query(`
			DELETE FROM tasks
			WHERE hid = $1
		`, [hid]);

		return;
	}

	async deleteAll(id) {
		await this.#db.query(`
			DELETE FROM tasks
		`);

		return;
	}

	async deleteMass(ids) {
		await this.#db.query(`
			DELETE FROM tasks
			WHERE hid = ANY($1)
		`, [ids]);

		return;
	}
}

module.exports = (db) => new TaskStore(db);