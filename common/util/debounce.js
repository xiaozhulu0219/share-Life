export default function (fn){
	// 函数防抖
	let timer = null
	return function(tar){
		if(timer){
			clearTimeout(timer)
		}
		timer=setTimeout(()=>{
			fn(tar)
		},500)
	}
}