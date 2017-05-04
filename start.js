// configurate paths
const config = require('./config');

// create and configure global __server
require(config.SERVER)(config);

var cluster = require('cluster');

if (cluster.isMaster){
	var ports = Object.keys(__server.hosts);
	
	for (var i=0; i<ports.length; i++){
		cluster.fork();
		delete __server.hosts[ports[i]];
	}
	
	cluster.on('exit', (worker, code, signal) => {
		__server.msg('worker %d died', worker.process.pid);
	});
}
else{
	const dispatcher = require(config.DISPATCHER);
	const router = require(__server.hosts[msg.port]);
	__server.start(dispatcher(router), msg.port);
}

