<template>
	<view style="height: 800rpx">
		<mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption"
			@down="downCallback" @up="upCallback">
			<view v-for="(item,index) in myHelpList" :key="index" class="card">
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
		name: 'MyHelpCompanyList',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				findMyPublishComPageUrl: '/company/movements/findMyPublishComPage',
				myHelpList: []
			};
		},
		created() {
			this.getMyHelpCompanyList();
		},
		methods: {
			getMyHelpCompanyList() {
				this.$http.get(this.findMyPublishComPageUrl, {
					params: {
						page: 1,
						pagesize: 20
					}
				}).then(res => {
					if (res.data.success) {
						console.log(res.data.result);
						this.myHelpList = res.data.result.items;
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
