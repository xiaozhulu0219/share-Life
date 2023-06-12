<template>
	<!--助力公司详情页面-->
	<view class="container">
		<!--标题和返回-->
		<cu-custom :bgColor="NavBarColor" isBack :backRouterName="backRouteName">
			<block slot="backText">返回</block>
			<block slot="content">助力公司详情</block>
		</cu-custom>
		<!--详情区域-->
		<view class="company">
			<span class="companyName">{{companyName}}</span>
			<view class="companyTag">
				<span>#歧视女生</span> <span>#可接受残疾人</span> <span>#体恤员工</span> <span>#米面粮油</span>
			</view>
		</view>
		<view v-for="item in 7" :key="index" class="detail">
			<view class="detail-title">有理有据</view>
			<vie class="detail-content">
				<image class="detail-avatar" src="../../static/avatar_girl.png"></image>
				<view class="detail-info">
					<view style="background-color: antiquewhite;">王五（在职）</view>
					<view>确实还不错呢</view>
					<view style="margin-right: 10rpx;">10min前 北京</view>
				</view>
				<view>
					<image class="detail-icon" src="../../static/images/dianzan.png"></image>56
					<br />
					<image class="detail-icon" src="../../static/images/cai.png"></image>2
				</view>
			</vie>
		</view>
		<view style="width: 100%;height: 100rpx;"></view>
		<view class="footer">
			<input placeholder="评论"/>
			<image style="width: 40rpx;height: 40rpx;" src="../../static/icon/user16.png"></image>
			<button>发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "helpCompanyDetailForm",
		components: {

		},
		props: {
			// formData: {
			// 	type: Object,
			// 	default: () => {},
			// 	required: false
			// }
		},
		data() {
			return {
				companyName: '',
				NavBarColor: this.NavBarColor,
				url: {
					findPageByEnterpriseName: "/enterprise/list", //助力新增页面模糊查询调用企查查
				},
			}
		},
		onLoad(params) {
			console.log("params过来了", params)
			this.companyName = params.companyName;
		},
		methods: {

		}
	}
</script>
<style>
	.container{
		background-color: #ffffff;
	}
	.company {
		margin: 20rpx;
	}

	.companyName {
		font-weight: bold;
	}

	.companyTag {
		margin-top: 20rpx;
	}

	.detail {
		padding: 30rpx;
		border-bottom: #eee solid 1rpx;
	}

	.detail-content {
		display: flex;
		justify-content: space-between;
	}

	.detail-avatar {
		width: 100rpx;
		height: 100rpx;
	}

	.detail-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.detail-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.footer{
		width: 100%;
		background-color: #eee;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:10rpx;
	}
	.footer input{
		border-top: #eee solid 1rpx;
		width: 70%;
		background: #ffffff;
	}
</style>
