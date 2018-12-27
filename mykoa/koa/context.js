let context = {

};

function defineGetter(target,property) {
	//代理获取属性 从当前对象的request。或者response上获取
	context.__defineGetter__(property,function(){
		return this[target][property]
	})
}

function defineSetter(target,property) {
	//代理获取属性 从当前对象的request。或者response上获取
	context.__defineSetter__(property,function(val){
		this[target][property] = val;
	})
}
defineGetter("request","path");
defineGetter("request","url");
defineGetter("request","query");
defineGetter("response","body");
defineSetter("response","body");



module.exports = context;