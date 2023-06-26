<template>
	<!--点击用户头像跳转的用户页（区别于用户自己看自己的个人页）中的“助力”-->
		<mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption"
			@down="downCallback" @up="upCallback">
			<view v-for="(item,index) in focusOrFansHelpList" :key="index" class="card">
				<view class="card-location">{{item.commentCreateDate}}</view>
				<view class="card-title">{{item.companyName}}</view>
				<view class="card-text">{{item.content}}</view>
			</view>
		</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";
	import configService from '@/common/service/config.service.js'

	export default {
		name: 'MyHelpCompanyList',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				findFocusOrFansPublishComPageUrl: '/company/findFocusOrFansPublishComPage',
				focusOrFansHelpList: [],
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 6 // 每页数据的数量
					},
					// noMoreSize: 6, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '去看看'
					}
				},
			};
		},
		created() {
			//this.getFocusOrFansHelpCompanyList();
		},
		onLoad(option) {
			const item = JSON.parse(decodeURIComponent(option.item));
			//this.myFormData = item
			console.log("传进来了uuid", item)
			this.getFocusOrFansHelpCompanyList(item); //这是传参后继续调用方法的示例
		},
		methods: {
			getFocusOrFansHelpCompanyList(item) {
				this.$http.get(this.findFocusOrFansPublishComPageUrl, {
					params: {
						page: 1,
						pagesize: 20,
						uuId:item
					}
				}).then(res => {
					if (res.data.success) {
						console.log(res.data.result);
						this.focusOrFansHelpList = res.data.result.items;
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style lang='scss'>
	.card {
		background-color: $uni-bg-color-grey;
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
