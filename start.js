// configurate paths
var config = require('./config');

// create and configure global __server
require(config.SERVER)(config);

var dispatcher = require(config.DISPATCHER);
var router;

// start routes from different locations (web sites)
for (var port in __server.hosts){
	router = require(__server.hosts[port]);
	__server.start(dispatcher(router), port));
}