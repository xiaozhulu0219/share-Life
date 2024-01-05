<template>
	<!--首页的所有标签页-->
	<view class="menu-scroll">
		<scroll-view class="menu-tab" 
		:scroll-left="disX"
		:scroll-x="true" @scroll.stop.prevent="scroll" :scroll-with-animation="true">
			<view class="menu-wrap">
				<view v-for="(item, index) in tabs" :class="[{'active' : activeTab === index}, 'tab']" :key="index"
					@click="clickTab(item,index)">
					{{ item.title }}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import Mixin from '@/common/mixin/Mixin.js';

	export default {
		mixins: [MescrollMixin, Mixin],
		props: ['getActiveTab'],
		components: {

		},
		data() {
			return {
				disX: 0,
				wWidth: 0,
				activeTab: 0,
				tabs: []
			};
		},
		created() {
			this.$http.get('/sys/dict/querySomeDictItems', {
				params: {
					dicts: 'home_sign'
				}
			}).then(res => {
				if (res.data.success) {
					this.tabs = res.data.result.home_sign;
					console.log("所有tab", this.tabs)
					// 子组间传递所有tab给父组件
					this.$emit("getHomeTotalTab", this.tabs)
					this.getActiveTab(this.tabs[0]);
				}
			});
			// 拿一下设备的信息
			uni.getSystemInfo({
				success: (res) => {
					//拿到设备的css宽度
					this.wWidth = res.windowWidth
				}
			})
		},
		methods: {
			handleMove(){},
			clickTab(item, index) {
				// if (this.activeTab === item.value - 1) return;
				if (this.activeTab === index) return;
				// this.activeTab = item.value - 1;'
				console.log("我运行了 clickTab", this.activeTab)
				this.activeTab = index;
				console.log(this.activeTab)
				this.getActiveTab(item);
				this.countDis(index)
			},
			scroll(e) {
				// console.log(e)
				console.log(e, "这里");
				e.stopPropagation();
			},
			countDis(index) {
				// 计算当前活跃的tab滑动到页面中间走过的距离
				const totalDis = index * 130 + 65;
				if (totalDis <= 375) {
					this.disX = this.disX===0?1:0;
				} else {
					// this.disX = totalDis-350 +'rpx';
					
					const realTargetDis = (totalDis-375) * (this.wWidth) / 750;
					this.$nextTick(function() {
						this.disX = realTargetDis;
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.menu-scroll {
		width: 100vw;
	}

	.menu-tab {
		height: 80rpx;
		width: 100vw;
		// background-color: #fff;
		background-color: rgb(241,241,241);
		.menu-wrap {
			display: flex;
			align-items: center;
			height: 100%;
		}

		.tab {
			color: #666;
			font-size: 36rpx;
			width: 130rpx;
			text-align: center;
			flex-shrink: 0;
		}

		.active {
			color: #000;
			font-weight: bold;
		}

	}
</style>
