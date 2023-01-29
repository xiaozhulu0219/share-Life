<template>
	<view style="height: 800rpx">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption"
			:up="upOption">
			<view v-for="(item,index) in homeHelpList" :key="index" class="card">
				<view class="card-location">{{item.locationName}}</view>
				<view class="card-title">{{item.companyName}}</view>
				<view class="card-text">{{item.textContent}}</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";

	export default {
		name: 'HomeHelpCompanyList',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				findHomePublishComPageUrl: '/company/movements/findHomePublishComPage',
				homeHelpList: [],
				upOption: {
					page: {
						size: 1 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无相关数据'
					}
				},
			};
		},
		methods: {
			downCallback(){
				console.log('down');
			},
			upCallback(page) {
				//联网加载数据
				console.log('up');
				this.$http.get(this.findHomePublishComPageUrl, {
					params: {
						page: page.num,
						pagesize: page.size
					}
				}).then(res => {
					// 后台接口有返回列表的总页数 totalPage
					this.mescroll.endByPage(res.data.result.items.length, res.data.result
						.pages); //必传参数(当前页的数据个数, 总页数)

					//设置列表数据
					if (page.num == 1) this.homeHelpList = []; //如果是第一页需手动置空列表
					this.homeHelpList = this.homeHelpList.concat(res.data.result.items); //追加新数据
				}).catch(() => {
					//  请求失败,隐藏加载状态
					this.mescroll.endErr();
				})
			},

		}
	}
</script>

<style lang='scss'>
	.card {
		background-color: $uni-bg-color-grey;
		position: relative;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;

		.card-title {
			font-weight: bold;
		}

		.card-text {
			font-size: 20rpx;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}
	}
</style>
