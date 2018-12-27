const EventEmitter = require('events');
const http = require("http");
const context = require("./context.js");
const response = require("./response.js");
const request = require("./request.js");
const Stream = require("stream");
class Koa extends EventEmitter{
	constructor(){
		super();
		this.middleWares = [];
		this.context = Object.create(context);
		this.response = Object.create(response);
		this.request = Object.create(request);
	}
	use(fn){
		this.middleWares.push(fn);
	}
	//洋葱模型的核心代码
	// compose(middles,ctx){
	// 	function dispath(index){
	// 		if(index==middles.length)return Promise.resolve();
	// 		return Promise.resolve(middles[index](ctx,()=>dispath(++index)));
	// 	}
	// 	return dispath(0);

	// }
	//reduce promise异步版本
	// compose(middles,ctx){
		/*精简版*/
		/*	let fn =  middles.reduce((prv,cur,index,arr)=>(...arg)=>prv(ctx,()=>Promise.resolve(cur(...arg))));*/
		/*精简版*/
		/*复杂代码版*/
		/*let fn =  middles.reduce((prv,cur,index,arr)=>{

			return (...arg)=>{
				prv(ctx,()=>Promise.resolve(cur(...arg)));
			}	

		})*/
		/*复杂代码版

		//精简和复杂都需要入口调用
		//return Promise.resolve(fn(ctx,()=>Promise.resolve()));
		
	// }	
	//reduceRight版本 promise异步版本
	compose(middles,ctx){
		//复杂代码版
		// let fn =  middles.reduceRight((prv,cur,index,arr)=>{

		// 	return ()=>{
		// 		return Promise.resolve(cur(ctx,prv));  //;
		// 	}	

		// },()=>Promise.resolve)
		// return fn();
		//精简版
		return middles.reduceRight((prv,cur,index,arr)=>()=>Promise.resolve(cur(ctx,prv)),()=>Promise.resolve)();
		
		
	}

	//处理请求
	handleRequest(req,res){
		let ctx = this.context;
		ctx.response = this.response;
		ctx.request = this.request;
		ctx.req = ctx.request.req = req; //请求
		ctx.res = ctx.response.req = res; //响应

		let fn = this.compose(this.middleWares,ctx);
		fn.then(()=>{
			if(!ctx.body){
				res.end('Not Found');
			}else if(ctx.body instanceof Stream){
				res.setHeader('Content-Type','text/html;charset=utf-8')
				ctx.body.pipe(res);
			}else if(typeof ctx.body === 'object'){
				 res.setHeader('Content-Type','application/json;charset=utf-8');
				res.end(JSON.stringify(ctx.body));
			}else{
				res.end(ctx.body+'0');
			}
			
		}).catch(err=>{
			this.emit("error",err);
		})
	}
	listen(port,address,callback=()=>console.log("启动成功")){
		let ser = http.createServer((req,res)=>this.handleRequest(req,res));
		ser.listen(port,address,callback);
	}
}

module.exports = Koa;