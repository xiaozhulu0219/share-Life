<template>
	<uni-popup ref="popup" type="bottom">
		<view class="popup-card bg-white">
			<view class="padding text-right cuIcon-close" @tap="closeModal"></view>
			<view class="flex popup-content">
				<view class="card-item padding bg-gradual-green" @tap="goInformation">发动态</view>
				<view class="card-item padding bg-gradual-blue" @tap="goHelpCom">助力公司</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	
	export default {
		name: 'toPublishPopup',
		props:['showPopup'],
		data() {
			return {
				
			};
		},
		created() {
			
		},
		watch:{
			showPopup:{
				immediate:true,
				handler(val){
					console.log(val);
					if(val) this.showModal();
					else this.closeModal();
				}
			}
			
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
					url:'/pages/information/informationForm'
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
		margin: 0 auto 40rpx;
		width: 90%;
		height: 400rpx;
		border-radius: 40rpx;
	}
	.popup-content {
		justify-content: space-evenly;
	}
	.card-item {
		width: 40%;
		/* height: 120rpx; */
		border-radius: 20rpx;
	}
</style>
