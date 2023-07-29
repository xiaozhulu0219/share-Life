const swiper = {
	data() {
		return {
			startX: 0,
			startY: 0,
		}
	},
	methods: {
		handleDragStart(e) {
			// console.log(e, "事件参数")
			// this.startX = e.changedTouches[0].pageX;
			// this.startY = e.changedTouches[0].pageY;
		},
		handleDragEnd(e) {
			// console.log(e, "事件结束")
			// 判断左右滑动的事件
			
		},
	}
}
export default swiper