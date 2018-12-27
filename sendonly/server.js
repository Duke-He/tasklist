const http = require("http");
const fs = require("fs");
const url = require("url");
const mime = require('mime');
const path = require("path");
const util = require("util");
let stat = util.promisify(fs.stat);

let server = http.createServer(async function(req,res) {
	let {pathname} = url.parse(req.url);
	let uri = path.join(__dirname,pathname);
	let statObj = await stat(uri);
	let media = /\.m4a$/
	if(media.test(uri)){
		res.setHeader("Content-Type",mime.getType(uri));
		let range = req.headers['range']; 
		let [,start,end] = range.match(/(\d*)-(\d*)/);
		console.log(start,end);
		start = start ? Number(start) : 0;
    	end = (end && end<statObj.size)? Number(end) : statObj.size;
		// res.setHeader("Content-Range","bytes 0-1837307/1837308")
		res.setHeader("Content-Length",end-start+1);
		res.setHeader("Content-Range",`bytes ${start}-${end}/${statObj.size}`);
		res.statusCode = 206;
		console.log(uri);
		console.log(start,end);
		fs.createReadStream(uri,{start,end}).pipe(res);
		return; 
	}else{
		try{
			
			if(statObj.isFile()){
				res.setHeader("Content-Type",mime.getType(uri)+';charset=utf-8')
				fs.createReadStream(uri).pipe(res);
			}else{
				let realPath = path.join(uri,'index.html');

				res.setHeader("Content-Type",mime.getType(realPath)+';charset=utf-8')
				fs.createReadStream(realPath).pipe(res);
			}
		}catch(e){
			res.statusCode=404;
			res.end("Not Found");
		}
	}
	

	// body...
});
server.listen(8080,'127.0.0.1',function(){
	console.log("success");
})

