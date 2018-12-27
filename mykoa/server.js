const Koa = require("./koa/application.js");





const app = new Koa();
let logger = function () {
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      console.log('logger')
      resolve();
    }, 1000);
  })
}
app.use(async (ctx,next)=>{
	// console.log(ctx.path);
	// console.log(ctx.query);
	// console.log(ctx.url);
	ctx.body = 1000;
	console.log(1);
	await next();
	console.log(2)
})
app.use(async (ctx,next)=>{
	console.log(3);
	// console.log(ctx.body);
	await logger();
	next();
	console.log(4);
})
app.use(async (ctx,next)=>{
	console.log(5);
	next();
	console.log(6);
})

app.listen(8000);