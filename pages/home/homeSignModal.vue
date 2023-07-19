<template>
	<!--首页的所有标签页-->
	<view class="menu-scroll">
		<scroll-view class="menu-tab" :scroll-x="true" @scroll="scroll">
			<view class="menu-wrap">
				<view v-for="(item, index) in tabs"
          :class="[{'active' : activeTab === index}, 'tab']" :key="index"
          @tap="clickTab(item,index)">
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
					this.getActiveTab(this.tabs[0]);
				}
			});
		},
		methods: {
			clickTab(item,index) {
				// if (this.activeTab === item.value - 1) return;
						if (this.activeTab === index) return;
				// this.activeTab = item.value - 1;
				this.activeTab =index;
				console.log(this.activeTab)
				this.getActiveTab(item);
			},
			scroll(e) {
				// console.log(e)
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
	  background-color: #fff;

	  .menu-wrap {
		display: flex;
		align-items: center;
		height: 100%;
	  }

	  .tab {
		color: #666;
			font-size: 36rpx;
		min-width: 130rpx;
		text-align: center;
		flex-shrink: 0;
	  }

	  .active {
		color: #000;
			font-weight: bold;
	  }

	}

</style>
