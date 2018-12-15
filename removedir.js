const fs = require("fs");
const path = require("path");
const {promisify} = require('util');
let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
let unlink = promisify(fs.unlink);
let rvdir = promisify(fs.rmdir);
//异步版本 二维数组
// function rmdir(p,callback){
// 	let arr = [[p]];
// 	function next(paths){
// 		let len = paths.length;
// 		let index = 0;
// 		let temp = [];
// 		function all(){
			
// 			if(index==len){
// 				if(!temp.length){
// 					!paths.length&&arr.pop();
// 					return del();
// 				}else{
// 					arr = [...arr,temp];
// 					next(arr[arr.length-1]);
// 				}
// 			}
// 		}
// 		paths.forEach((v,id)=>{
// 			fs.stat(v,function(err,statObj){
// 				if(statObj.isDirectory()){
// 					//是文件夹
// 					fs.readdir(v,function(err,dirs){

// 						dirs = dirs.map(i=>path.join(v,i));
// 						temp = [...temp,...dirs];
// 						index++;
// 						all();
// 					})
// 				}else{
					
// 					//是文件
// 					fs.unlink(v,function(err,data){
// 						paths.splice(id,1);
// 						len--;
// 						all();
// 					})	
// 				}
// 			})



// 		})
// 	}
// 	next(arr[0]);
// 	function del(){
// 		let index = arr.length-1;
// 		function next(paths){
// 			if(!paths)return callback();
// 			let len = arr[arr.length-1].length;
// 			paths.forEach(v=>{
// 				fs.rmdir(v,function(err,data){
// 					if(!--len){
// 						next(arr[index--]);
// 					}
// 				})
// 			})

// 		}
// 		next(arr[index]);

// 	}

// }

rmdir('a',function(){
	console.log("删除成功");
});

//promise版本。二维数组
// function rmdir(p,callback){
// 	let arr = [[p]];
// 	function next(p){
// 		let temp = [];
// 		let pm = p.map((v,i)=>{
// 			return new Promise(function(resolve,reject){
// 				fs.stat(v,function(err,statObj){
// 					if(statObj.isDirectory()){
// 						fs.readdir(v,function(err,dirs){
// 							dirs = dirs.map(p=>path.join(v,p));
// 							temp = [...temp,...dirs];
// 							resolve();
// 						})
// 					}else{
// 						fs.unlink(v,function(){
// 							p.splice(i,1);
// 							resolve();
// 						})
// 					}
// 				})
// 			})
// 		})
// 		Promise.all(pm).then(function(){
			
// 			if(!temp.length) {
// 				!arr[arr.length-1].length&&arr.pop();
// 				return del();
// 			}
// 			arr = [...arr,temp]
// 			next(temp);
// 		})
// 	}
// 	next(arr[0]);
// 	function del(){
// 		let index = arr.length-1;
// 		!function next(){
// 			if(index<0)return;
// 			let ps = arr[index--].map(v=>{
// 				return new Promise(function(resolve,reject){
// 					console.log(v);
// 					fs.rmdir(v,function(err,data){
// 						resolve()
// 					})
// 				})
// 			})
// 			Promise.all(ps).then(function(){
// 				next();
// 			})
// 		}();
		
// 	}
	

// }




//async await 版本  一个一个找

async function rmdir(dir,callback){
	let arr = [dir];
	let index = 0;
	let current;
	while(current = arr[index++]){	
		let statObj = await stat(current);
		if(statObj.isDirectory()){
			let dirs = await readdir(current);
			dirs = dirs.map(v=>path.join(current,v));
			arr = [...arr,...dirs];
		}else{
			await unlink(current);
			arr.splice(--index,1);
		}
	}
	--index;
	while(current = arr[--index]){
		await rvdir(current);
	}
	callback();

} 



