var fs = require('fs');
var {Pool} = require('pg');

module.exports = () => {
	const db = new Pool();
	
	var stores = {};
	var files = fs.readdirSync(__dirname);
	for(var file of files) {
		if(["__db.js", "migrations", "tmp.js"].includes(file)) continue;
		var name = file.replace(/\.js/i, "");

		stores[name] = require(__dirname+'/'+file)(db);
		if(stores[name].init) stores[name].init();
	}

	return stores;
}