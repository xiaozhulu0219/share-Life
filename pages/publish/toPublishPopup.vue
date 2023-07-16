<template>
	<!--app页面中间的加号页-->
	<uni-popup ref="popup" type="bottom">
		<view class="popup-card bg-white">
			<view class="padding text-right cuIcon-close" @tap="closeModal"></view>
			<view class="flex popup-content">
				<view class="card-tag bg-gradual-green" @tap="goInformation">发动态</view>
				<view class="card-tag bg-gradual-blue" @tap="goHelpCom">助力公司</view>
			</view>
			<view class="flex popup-content">
				<view class="card-content">分享健康美好生活</view>
				<view class="card-content">给出有态度的评价</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>

	export default {
		name: 'toPublishPopup',
		data() {
			return {

			};
		},
		created() {

		},
		methods: {
			showModal() {
				this.$refs.popup.open();
			},
			closeModal() {
				this.$refs.popup.close();
			},
			goInformation() {
				this.$refs.popup.close();
				uni.navigateTo({
					url:'/pages/information/inforPublishForm'
				})
			},
			goHelpCom() {
				this.$refs.popup.close();
				uni.navigateTo({
					url:'/pages/helpcompany/helpCompanyLikeQueryList'
				})
			}
		}
	}
</script>

<style lang='scss'>

	.popup-card {
		margin: 0 auto 45rpx;
		width: 90%;
		height: 350rpx;
		border-radius: 35rpx;
	}

	.popup-content {
		justify-content: space-evenly;
	}

	.card-tag {
		margin: auto;
		width: 240rpx;
		height: 85rpx;
		line-height: 85rpx;
		text-align: center;
		font-size: 38rpx;
		margin-top: 15rpx;
		font-weight: 600;
		border-radius: 20rpx;
	}

	.card-content {
		width: 280rpx;
		/* height: 120rpx; */
		border-radius: 20rpx;
		margin-top: 25rpx;
		font-size: 33rpx;
		font-weight: 600;
		text-align: center;
	}



</style>
