<template>
	<!--首页助力的分页查询-->
	<mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption"
				   @down="downCallback" @up="upCallback">
		<view v-for="(item,index) in homePublishComList" :key="index" class="card" @click="toHomeHelpCompanyDetail(item)">
			<view class="card-title">{{item.companyName}}</view>
			<view class="card-text">{{item.legalPerson}}</view>
			<view class="card-text">{{item.registerTime}}</view>
			<view class="card-text">{{item.companyStatus}}</view>
			<view class="card-text">{{item.registeredCapital}}</view>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";
	import configService from '@/common/service/config.service.js'

	export default {
		name: 'homeHelpCompanyModal',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				findHomePublishComListUrl: '/company/findHomePublishComList',
				homePublishComList: [],
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
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
			this.getHomePublishComList();
		},
		methods: {
			getHomePublishComList() {
				this.$http.get(this.findHomePublishComListUrl, {
					params: {
						page: 1,
						pagesize: 20
					}
				}).then(res => {
					if (res.data.success) {
						console.log("返回记录",res.data.result);
						this.homePublishComList = res.data.result.items;
						for (let d of this.homePublishComList) {
							d.companyName = "公司名称：" + d.companyName
							d.legalPerson = "法人：" + d.legalPerson
							d.registerTime = "注册时间：" + d.registerTime
							d.registeredCapital = "注册资金：" + d.registeredCapital
							d.companyStatus = "经营状态：" + d.companyStatus
							d.bussinessAddress = "经营地：" + d.bussinessAddress
							d.organizationCode = "组织编码：" + d.organizationCode
						}

					}
				}).catch(err => {
					console.log(err);
				});
			},
			toHomeHelpCompanyDetail(item) {
				//console.log("进来了111", item)
				uni.navigateTo({
					url: '/pages/home/homeHelpCompanyDetail?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
		}
	}
</script>

<style lang='scss'>
	.card {
		background-color:  $uni-bg-color-grey;
		//background-color: $uni-bg-color-grey;
		//padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;/*盒子间的距离*/
		margin-top: 25rpx; /*盒子距离顶部的距离*/
		line-height: 65rpx;  /*行高*/
		//margin-bottom: 16px; /*内容和标题间的间距*/
		margin-left: 20rpx;
		//background-color: $uni-bg-color-grey;
		//padding: 20rpx 20rpx;
		//border-radius: 20rpx;
		//margin-bottom: 20rpx;

		.card-title {
			font-weight: bold;
			font-size: 38rpx;
			//margin-top: 100rpx; /*盒子距离顶部的距离*/
		}

		.card-text {
			font-size: 32rpx;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}
	}
</style>
