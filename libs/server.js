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
	
	setHosts: function(){
		if (this.config.scanHostsDir){
			
		}
		
		if (Object.keys(this.hosts).length)
		{
			var ch, path;
			
			for (var port in this.hosts)
			{
				path = this.hosts[port];
				
				// if there is no "." or "/" at the beginning of the path - set the "home sites dir"/<site>
				if (path.charAt(0).match(/[.\/]/)) continue;
				
				this.hosts[port] = __server.HOSTS_DIR + '/' + path;
				if (!path.match(/\//)) this.hosts[port] += '/'+this.config.defaultSiteRouter;
			}
		}
		else{// set default port and route
			this.hosts[__server.config.defaultPort] = __server.ROUTER;
		}
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

module.exports = function(config){
	for (var alias in config){
		__server[alias] = config[alias];
	}
	
	__server.config = require(__server.CONFIG_MAIN);
	__server.hosts = require(__server.CONFIG_HOSTS);
	
	__server.setHosts();
};
