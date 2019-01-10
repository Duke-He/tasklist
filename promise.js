class Promise{
	constructor(executor){
		//promise 有三个状态 pedding fulfilled rejected
		//设置promise的初始状态
		this.state = "pendding";
		this.value = null;	
		//成功时候的回调
		this.onFulfilledCallbacks = [];
		//失败的回调
		this.onRejectedCallbacks = [];



		let _resolve = (value)=>{
			//处理成功的
			if(this ==value){
				throw new TypeError('TypeError: Chaining cycle detected for promise #<Promise>')
			}
			if(this.state!=="pendding")return;
			this.value = value;
			this.state = "fulfilled";
			//一次调用成功的回调
			this.onFulfilledCallbacks.forEach(callback=>callback())	
			
		}
		let _reject = (reason)=>{
			//处理失败的
			if(this ==reason){
				throw new TypeError('TypeError: Chaining cycle detected for promise #<Promise>')
			}
			if(this.state!=="pendding")return;
			this.value = reason;
			this.state = "rejected";
			//一次调用失败的回调
			this.onRejectedCallbacks.forEach(callback=>callback())	
			

		}


		//执行器立即执行传入两个参数 _resolve(成功时的函数),_reject(失败时的函数)
		//首先 不能把__resolve,_reject写在原型上。
		//写在原型上外部就能拿到 可以随时更改状态。
		//不符合只能通过执行器更改状态的初衷
		try{
			executor(_resolve,_reject);
		}catch(e){
			//报错的话直接调用_reject
			_reject(e);
		}
	}

	then(onFulfilled,onRejected){
		//then方法 返回的是一个promise
		//检测then中传递的值是不是函数
		onFulfilled = typeof onFulfilled == "function"? onFulfilled:function(data){
			return data;
		};
		onRejected = typeof onRejected == "function"? onRejected:function(err){
			throw err;
		};

		let promise2 = new Promise((resolve,reject)=>{
				//新的promise的状态和上一个then方法的返回值有关系
				//then执行的时候 promise处于pendding
				if(this.state === "pendding"){
					this.onFulfilledCallbacks.push(()=>{
						setTimeout(()=>{
						//获取then中的返回值
						//判断返回值类型
						try{
							let x = onFulfilled(this.value);
							resolvePromise(promise2,x,resolve,reject);	
						}catch(e){
							reject(e);
						}
						
					},0)
					});
					this.onRejectedCallbacks.push(()=>{
						setTimeout(()=>{
						//获取then中的返回值
						//判断返回值类型
						try{
							let x = onRejected(this.value);
							resolvePromise(promise2,x,resolve,reject);	
						}catch(e){
							reject(e);
						}
					},0)
					});
				}
				if(this.state === "fulfilled"){
					setTimeout(()=>{
						//获取then中的返回值
						//判断返回值类型
						try{
							let x = onFulfilled(this.value);
							resolvePromise(promise2,x,resolve,reject);	
						}catch(e){
							reject(e);
						}
					},0)
				}
				if(this.state === "rejected"){
					setTimeout(()=>{
						//获取then中的返回值
						
						//判断返回值类型
						try{
							let x = onRejected(this.value);
							resolvePromise(promise2,x,resolve,reject);	
						}catch(e){
							reject(e);
						}
					},0)
				}





		})

		return promise2;
	}
	catch(onRejected) {
	  return this.then(null, onRejected);
	}
	//finally无论成功还是失败都要调用
	finally(cb){
		cb();
		return this.then();
	}
}

function resolvePromise(promise2,x,resolve,reject){
	if(promise2===x){
		throw new TypeError('TypeError: Chaining cycle detected for promise #<Promise>')
	}
	 let called; // 保证x.then中resolvePromise和rejectPromise只执行一个
	if((typeof x==="object"&&x!==null)||typeof x === "function"){
		//说明x可能是一个promise
		try{
			let  then = x.then;
			if(typeof then === "function"){
				// 说明是promise.
				//x中then调用
				
				then.call(x,(y)=>{
				//接收成功的值 接收的值y可能还是个promise
				//递归检查
					 if(!called){called = true;} else{ return;}
					resolvePromise(x,y,resolve,reject)
					

				},(r)=>{
					//接收失败的值 接收的值r可能还是个promise
					//递归检查
					 if(!called){called = true;} else{ return;}
					reject(r);
				});
			
			}else{
				//是普通对象
				resolve(x);
			}
		}catch(e){
			// 错误处理
			 if(!called){called = true;} else{ return;}
			reject(e);
		}

	}else{
		resolve(x);
	}
}
Promise.resolve = function(value){
	return new Promise(function(resolve,reject){
		resolve(value);
	})
}
Promise.reject = function(reason){
	return new Promise(function(resolve,reject){
		reject(reason);
	})
}
Promise.all = function(promises){
	return new Promise(function(resolve,reject){
		let arrs = [];
		let len = promises.length;
		let j = 0;
		for(let i=0;i<len;i++){
			if(typeof promises[i].then==="function"){
				promises[i].then(function(data){
					arrs[i] = data;
					++j;
					if(j==len)resolve(arrs);

				},reject)
			}else{
				arrs[i] = promises[i];
				++j;
				if(j==len)resolve(arrs);
			}
		}

	})
}
Promise.race = function(promises){
	return new Promise(function(resolve,reject){
		let len = promises.length;
		for(let i=0;i<len;i++){
			console.log(11111);
			if(typeof promises[i].then==="function"){
				promises[i].then(resolve,reject)
			}else{
				resolve(promises[i]);
			}
		}

	})
}



// npm install promises-aplus-tests -g
//可以测试是否符合promise A+规范

Promise.deferred  = function() {
  const defer = {}
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

try {
  module.exports = Promise
} catch (e) {
}


// module.exports = Promise;

