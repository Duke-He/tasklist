//koa.js.  作业：reduceRight 和 reduce 来实现一下这个compose 

const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const crypto = require("crypto");
let server = http.createServer(function(req,res) {
	//强制缓存。静态资源
	 // console.log(url.parse(req.url));
	 let {pathname} = url.parse(req.url);
	 console.log(pathname);
	  	res.setHeader("Content-type","text/html");
		res.setHeader('Cache-Control','no-cache'); // http 1.1
		res.setHeader('Exipres', new Date(Date.now() + 100 * 1000).toLocaleString()); // 绝对时间

	 if(pathname=='/'){
	 	// let prv = req.headers["if-modified-since"]; 	
	 	let prv = req.headers["if-none-match"]; 
	 	console.log(prv);	
	 	fs.stat('index.html',function(err,statObj){
	 		// let cur = statObj.ctime.toGMTString();
	 		fs.readFile('index.html','utf8',function(err,data){
	 			let hash = crypto.createHash("md5").update(data).digest("base64");
	 			// res.setHeader("Last-Modified",statObj.ctime.toGMTString());
	 			res.setHeader("Etag",hash);
	 			console.log(prv==hash);
	 			if(prv==hash){
		 			res.statusCode = 304;
		 			res.end();
		 		}else{
	 				res.end(data)
	 			}
	 		})
	 		
	 		
	 	})
	 		
			// fs.createReadStream('index.html','utf8').pipe(res);
	 }
	 if(pathname == '/music.png'){
	 	let prv = req.headers["if-none-match"]; 
	 	console.log(prv);	
	 	fs.stat('music.png',function(err,statObj){
	 		// let cur = statObj.ctime.toGMTString();
	 		fs.readFile('music.png',function(err,data){
	 			let hash = crypto.createHash("md5").update(data).digest("base64");
	 			// res.setHeader("Last-Modified",statObj.ctime.toGMTString());
	 			res.setHeader("Etag",hash);
	 			console.log(prv==hash);
	 			if(prv==hash){
		 			res.statusCode = 304;
		 			res.end();
		 		}else{
	 				res.end(data)
	 			}
	 		})
	 		
	 		
	 	})
	 }


	
})

server.listen(8899,'127.0.0.1',function(){
	console.log("success");
});
server.on('error',function(err){
	console.log(err);
})


