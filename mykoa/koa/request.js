const url = require("url");
const request = {
	get path(){
		let {pathname} = url.parse(this.req.url);
		return pathname
	},
	get url(){
		return this.req.url
	},
	get query(){
		let {query} = url.parse(this.req.url,true)
		return query
	},
};







module.exports = request;