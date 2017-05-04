// configurate paths
const config = require('./config');
const cluster = require('cluster');

// create and configure global __server
require(config.SERVER)(config, cluster.isMaster);

if (cluster.isMaster){
	var ports = Object.keys(__server.hosts);
	
	for (var i=0; i<ports.length; i++){
		cluster.fork({port: ports[i]});
	}
	
	cluster.on('exit', (worker, code, signal) => {
		__server.msg('worker %d died', worker.process.pid);
	});
}
else{
	const dispatcher = require(config.DISPATCHER);
	const port = process.env.port;
	const router = require(__server.hosts[port]);
	__server.start(dispatcher(router), port);
}
