// 创建eventBus
const bus = {
	
}


// 假设我的列表页需要订阅点赞事件 ,如果详情
// 订阅函数
export function subscrib(eventName,fn){
	// 传第事件名称
	if(!bus[eventName]){
		// 如果当前事件不存在
		// 初始化当前事件
		bus[eventName] = [];
	}
	bus[eventName].push(fn)
}
// trigger函数
export function emit(eventName,p1,p2){
	// 看一下触发的这个事件是否在bus中
	if(!bus[eventName]){
		console.log("事件不存在")
		
	}
	const eventQuene = bus[eventName];
	// 按顺序执行
	for(let i=0;i<eventQuene.length;i++){
		eventQuene[i](p1,p2)
	}
}
