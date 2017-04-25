var http = require('http');

global.__server = {
	start: function(dispatcher, port, after_start){
		port = port || this.config.defaultPort;
		http.createServer(dispatcher).listen(port, '127.0.0.1', after_start || (() => this.lmsg(`server was started on port ${port}`)));
	},
	
	setHosts: function(){
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
	
	read: function(path, encoding){
		return require('fs').readFileSync(path+'.js', encoding || 'utf-8');
	},
	
	e: function(msg){
		throw new Error(msg);
	},
	msg: function(m){
		console.log(m || 'empty msg');
	},
	line: function(){
		console.log('');
	},
	lmsg: function(m){
		this.msg(m);
		this.line();
	},
	
	end: function(msg){
		this.response.end(msg || '');
	},
	send: function(code, msg){
		this.response.writeHead(code, http.STATUS_CODES[code] || 'unknown code', {'Content-type': 'text/html'});
		this.end(msg);
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
