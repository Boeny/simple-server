/**
 * Module dispatcher
 * @param {function} route
 * @returns {function} handler on request event
 */
module.exports = function(route){
	return function(request, response){
		__server.request = request;
		__server.response = response;
		
		var params = require('url').parse(request.url, true);
		var pathname = params.pathname;
		__server.msg(`Request for ${pathname} received.`);
		
		switch (request.method){
			case 'GET':
				__server.GET = params.query;
				route(pathname, response);
				break;
			
			case 'POST':
				__server.POST = {};
				
				request.on('data', (chunk) => {
					chunk = chunk.toString();
					
					if (chunk.length > 1e6) {
						__server.send(413);
						return;
					}
					
					chunk = chunk.split('&');
					var v;
					
					for (var i in chunk){
						v = chunk[i].split('=');
						__server.POST[v[0]] = v[1];
					}
					__server.POST qs.parse(chunk);
				});
				
				request.on('end', () => {
					route(pathname, response);
				});
				break;
			
			default:
				__server.send(405);
		}
	};
};
