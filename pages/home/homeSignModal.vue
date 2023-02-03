<template>
	<view>
		<scroll-view class="uni-swiper-tab" :scroll-x="true" @scroll="scroll">
			<view class="tab-title flex justify-between">
				<view class="padding-sm" v-for="(item, index) in tabs" :key="index" @tap="clickTab(item)">
					<text :class="activeTab === index ? 'active' : ''">{{ item.title }}</text>
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
		props: ["getActiveTab"],
		components:{
			
		},
		data() {
			return {
				activeTab: 0,
				tabs: [{
					value: 1,
					title: '推荐'
				}, {
					value: 2,
					title: '助力'
				}, {
					value: 3,
					title: '百科'
				}, {
					value: 4,
					title: '游戏'
				}, {
					value: 5,
					title: '关注'
				}],
			};
		},
		created() {
			this.$http.get('/sys/dict/querySomeDictItems', {
				params: {
					dicts: "home_sign"
				}
			}).then(res => {
				if (res.data.success) {
					this.tabs = res.data.result.home_sign;
					this.getActiveTab(this.tabs[0])
				}
			})
		},
		methods: {
			clickTab(item) {
				if (this.activeTab === item.value- 1) return;
				this.activeTab = item.value- 1;
				this.getActiveTab(item)
			},
			scroll(e) {
				// console.log(e)
			},
		}
	};
</script>

<style lang="scss" scoped>
	.uni-swiper-tab {
		white-space: nowrap;
		width: 100%;
		top: 180rpx;
		position: fixed;
	}
	
	.tab-title {
		color: #666;
		width: 90%;
		margin-top: -30rpx;
		font-size: 36rpx;
	}
	
	.tab-title text.active {
		color: #000;
		font-weight: bold;
	}
</style>


