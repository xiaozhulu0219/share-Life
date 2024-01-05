<template>
	<!--这个日后要作为启动页-->
	<view class="wx-index">
		<image class="wx-bg" src="../../static/blue.png" mode="aspectFill"></image>
		<view class="wx-btns">
			<view class="wx-btn wx-btn-info" @click="goLogin">登录</view>
			<view class="wx-btn wx-btn-normal" @click="goRegister">注册</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapGetters} from "vuex";
	export default {
		data() {
			return {
				timer:null
			}
		},
		watch:{
			uuId:{
				handler(newVal){
					
					if(this.newVal !==''){
						// console.log('aaa')
						uni.hideLoading();
						clearTimeout(this.timer);
						this.timer = null
						uni.navigateTo({
							url:'/pages/home/home'
						})
					}
				}
			}
		},
		computed:{
			...mapState(['uuId'])
		},
		onLoad() {
			uni.showLoading({
					title:"恢复登录中..."
			});
			// 判断是否有数据
			this.timer = setTimeout(()=>{
				// 如果3000后没有数据就隐藏loading
				if(this.uuId===''){
					// console.log('bbb')
					uni.hideLoading();
					clearTimeout(this.timer);
					this.timer = null
				}
			},10000)
			
		},
		methods: {
			goLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			goRegister(){
				uni.navigateTo({
					url:'../../wx/register/index'
				})
			}
		}
	}
</script>

<style scoped>
	.wx-index{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}
	.wx-btns{display: flex;flex-direction: row;align-items: center;justify-content: space-between;position: absolute;width: 100%;bottom: 40rpx;padding:0 34rpx;box-sizing: border-box;}
	.wx-btn{
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 12rpx;
		background-color: #007AFF;
		color: #fff;
		font-size: 32rpx;
	}
	.wx-btn-info{
		background-color: #05C160;
	}
	.wx-btn-normal{
		background-color: #18181A;
	}
	.wx-bg{
		width: 100vw;
		height: 100vh;
	}
</style>
