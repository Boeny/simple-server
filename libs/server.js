var http = require('http');

var message = function(){
	console.log(`server was started on port ${port}`);
};

global.__server = {
	start: function(dispatcher, port, after_start){
		
http.createServer(dispatcher).listen(port || this.config.defaultPort, '127.0.0.1', after_start || message);
	}
};

function setHosts(hosts){
	if (Object.keys(hosts).length)
	{
		// set hosts dir if there is no slash at the beginning of the path
		for (var port in hosts){
			if (!hosts[port].match(/$[./\\]/))
				hosts[port] = __server.HOSTS_DIR + '/' + hosts[port];
		}
	}
	else{// set default port and route
		hosts[__server.config.defaultPort] = __server.ROUTER;
	}
}

module.exports = function(__config){
	for (var alias in __config){
		__server[alias] = __config[alias];
	}
	
	__server.config = require(__server.CONFIG_MAIN);
	__server.hosts = require(__server.CONFIG_HOSTS);
	
	setHosts(__server.hosts);
};
