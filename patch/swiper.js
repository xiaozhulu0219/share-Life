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
			this.startX = e.changedTouches[0].pageX;
			this.startY = e.changedTouches[0].pageY;
		},
		handleDragEnd(e) {
			// console.log(e, "事件结束")
			// 判断左右滑动的事件
			// 首先上下移动的距离不能太夸张
			if (Math.abs(e.changedTouches[0].pageY - this.startY) < 50) {
				if ((e.changedTouches[0].pageX - this.startX) >= 20) {
					console.log("触发向右滑动")
					// 判断当前是不是在首页tab中
					if (this.activeFirstTab === 1) {
						// 找到当前index
						const tempIndex = this.homeTotalTabs.findIndex((item) => {
							
							return item.value == this.activeTab.value
						})
						console.log(tempIndex,"看着看着")
						let targetIndex
						if (tempIndex == 0) {
							console.log("当前是首页tab的第一项")
							// targetIndex = 0;
							// 再向左滑动就需要改变当前页面的activeFirstTab
							this.activeFirstTab = 0;
							return
						} else {
							targetIndex = tempIndex - 1;
						}
						this.$refs.HomeSignModal.clickTab(this.homeTotalTabs[targetIndex], targetIndex)
					}
					if(this.activeFirstTab === 0){
						console.log("划到头了")
					}
					if(this.activeFirstTab === 2){
						// 回到首页
						this.activeFirstTab = 1;
						console.log("回到首页");
						this.$nextTick(()=>{
							this.$refs.HomeSignModal.clickTab(this.homeTotalTabs[this.homeTotalTabs.length-1],this.homeTotalTabs.length-1)
						})
					}
				}
				if ((this.startX - e.changedTouches[0].pageX) >= 20) {
					console.log("触发向左滑动")
					if (this.activeFirstTab === 1) {
						// 在首页中
						// 触发子组件的向右滑动事件
						console.log("当前的活跃tab", this.activeTab.value)
						//拿到子组件的ref
						// 在homeTotalTabs中找到this.activeTab.value的索引
						const tempIndex = this.homeTotalTabs.findIndex((item) => {
							return item.value == this.activeTab.value
						})
						console.log(tempIndex, '找到的index')
						let targetIndex
						if (tempIndex < this.homeTotalTabs.length - 1) {
							//可以往后再找一个index
							targetIndex = tempIndex + 1;
						} else {
							targetIndex = tempIndex;
							// console.log("找到了当前tab列表的最后一个")
							// 再向右滑动就需要改变当前页面的activeFirstTab
							this.activeFirstTab = 2;
						}
						// 调用子组件的方法
						this.$refs.HomeSignModal.clickTab(this.homeTotalTabs[targetIndex], targetIndex)
					}
					if(this.activeFirstTab === 0){
						// 切换
						this.activeFirstTab = 1;
						this.$nextTick(()=>{
							this.$refs.HomeSignModal.clickTab(this.homeTotalTabs[0], 0)
						})
					}
					// console.log(this.homeTotalTabs,"tab数组")
					// if(targetTabVal<)
				}
			}

		},
	}
}
export default swiper
