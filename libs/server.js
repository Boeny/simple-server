const http = require('http');

global.__server = {
	show_msg: true,
	
	// auto props:
	is_mobile: false,
	GET: {},
	POST: {},
	request: {},
	response: {},
	
	// methods:
	start: function(dispatcher, port, after_start){
		port = port || this.config.defaultPort;
		
		http.createServer(dispatcher).listen(port, '127.0.0.1', () => {
			this.lmsg('server was started on port '+port);
			after_start && after_start();
		});
	},
	
	setHosts: function(){
		var ports = Object.keys(this.hosts);
		if (ports.length)
		{
			var port, ch, path;
			
			for (var i=0; i<ports.length; i++)
			{
				port = ports[i];
				path = this.hosts[port];
				
				// if there is no "." or "/" at the beginning of the path - set the "home sites dir"/<site>
				if (path.charAt(0).match(/[.\/]/)) continue;
				
				this.hosts[port] = this.HOSTS_DIR + '/' + path;
				if (!path.match(/\//)) this.hosts[port] += '/'+this.config.defaultSiteRouter;
			}
		}
		else{// set default port and route
			this.hosts[this.config.defaultPort] = this.ROUTER;
		}
	},
	
	read: function(path, encoding){
		return require('fs').readFileSync(path+'.js', encoding || 'utf-8');
	},
	
	setPOST: function(){
		this.POST = {};
		
		this.request.on('data', (chunk) => {
			chunk = chunk.toString();
			
			if (chunk.length > 1e7) {// 1*10^7 byte (9.5 Mb)
				this.send(413);
				return;
			}
			
			if (chunk.indexOf('&') == -1)
				return this.POST = JSON.parse(chunk);
			
			chunk = chunk.split('&');
			var v;
			
			for (var i in chunk){
				v = chunk[i].split('=');
				this.POST[v[0]] = v[1];
			}
		});
	},
	
	json: function(o){
		return typeof o == 'object' ? JSON.stringify(o) : o;
	},
	e: function(m){
		throw new Error(this.json(m));
	},
	
	msg: function(){
		if (this.show_msg) console.log.apply(null, arguments);
	},
	line: function(){
		if (this.show_msg) console.log('');
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

module.exports = function(config, is_master_process){
	for (var alias in config){
		__server[alias] = config[alias];
	}
	
	__server.config = require(__server.CONFIG_MAIN);
	__server.hosts = require(__server.CONFIG_HOSTS);
	
	__server.setHosts();
};
