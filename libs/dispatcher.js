/**
 * Module dispatcher
 * @param {function} route
 * @returns {function} handler on request event
 */
var url = require('url');

module.exports = function(route){
	return function(request, response){
		var pathname = url.parse(request.url).pathname;
		this.msg(`Request for ${pathname} received.`);
		
		request.on('data', (c) => {
			var pairs = c.toString().split('&');
			
		});
		
		request.on('end', () => {
			route(pathname, response);
		});
	};
};
