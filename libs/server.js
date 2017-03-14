var http = require('http');
var vm = {}, concat = {};

global.__server = {
	start: function(dispatcher, port, after_start){
		port = port || this.config.defaultPort;
		http.createServer(dispatcher).listen(port, '127.0.0.1', after_start || (() => this.lmsg(`server was started on port ${port}`)));
	},
	requireUrl: function(url, success){
		//vm = require('vm');
		//concat = require('concat-stream'); // this is just a helper to receive the http payload in a single callback
		
		var url_arr = url.split('//');
		var host = url_arr[0] ? url_arr[0]+'//' : '';
		url_arr = url_arr[1].split('/');
		host += url_arr[0];
		url = '/'+url_arr.filter((s, i) => i > 0);
		
		this.lmsg(host);
		this.lmsg(url);
		
		http.get({
				host: host, 
				port: 80, 
				path: url
			},
			function(res) {
				res.setEncoding('utf8');
				success(res);
				//res.pipe(concat({ encoding: 'string' }, function(remoteSrc) {
				//	vm.runInThisContext(remoteSrc, 'remote_modules/hello.js');
				//}));
			}
		);
	},
	msg: function(m){
		console.log(m || 'uncatched msg');
	},
	line: function(){
		console.log('');
	},
	lmsg: function(m){
		this.msg(m);
		this.line();
	}
};

function setHosts(hosts){
	if (Object.keys(hosts).length)
	{
		// set hosts dir if there is no slash at the beginning of the path
		var ch;
		for (var port in hosts){
			ch = hosts[port].charAt(0);
			if (ch != '.' && ch !='/')
				hosts[port] = __server.HOSTS_DIR + '/' + hosts[port];
		}
	}
	else{// set default port and route
		hosts[__server.config.defaultPort] = __server.ROUTER;
	}
}

module.exports = function(config){
	for (var alias in config){
		__server[alias] = config[alias];
	}
	
	__server.config = require(__server.CONFIG_MAIN);
	__server.hosts = require(__server.CONFIG_HOSTS);
	
	setHosts(__server.hosts);
};
