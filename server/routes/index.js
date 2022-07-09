const { recursiveRead } = require('../utils');

module.exports = async (db) => {
	var routes = [];
	var files = recursiveRead(__dirname);
	for(var file of files) {
		if([__dirname+"/index.js"].includes(file)) continue;
		var route = require(file)(db);
		if(route.init) await route.init();
		routes.push(route)
	}

	return routes;
}