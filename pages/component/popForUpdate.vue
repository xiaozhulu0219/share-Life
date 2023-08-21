<template>
		<view>
			<uni-popup ref="popup-update" 
			:mask-click="false">
				<view class="update-container ">
					<view class="update-header bg-gradual-blue">
							<view class="cuIcon-discover update-icon">
								
							</view>
							<view class="update-title">
								发现新版本
							</view>
							<view class="update-code">
								{{updateObj.versionNum}}
							</view>
					</view>
					<view class="update-body">
						<view class="body-title">
							更新内容:
						</view>
						<view class="update-detail">
							{{updateObj.content}}
						</view>
						
					</view>
					<view class="update-footer">
						<view class="update-btn btn bg-gradual-blue" @click="handleUpdate">
							立即更新
						</view>
						<view class="cancel-btn btn" @click="close" v-if="!updateObj.force">
							取消
						</view>
					</view>
					
				</view>
			</uni-popup>
		</view>
</template>

<script>
	export default {
		data(){
			return {}
		},
		methods:{
			handleMask(){
				if(updateObj.force){
					return
				}
			},
			// 打开弹窗
			open(){
				this.$refs['popup-update'].open();
			},
			handleUpdate(){
				this.$emit("updateApp")
			},
			close(){
				this.$refs['popup-update'].close();
			}
			
		},
		props:{
			updateObj:Object
		}
	}
</script>

<style scoped>
	.update-container{
		width:70vw;
		background-color: #fff;
		border-radius: 30rpx;
		
	}
	.update-header{
		padding:20rpx 0;
		box-sizing: border-box;
		
		/* height: rpx; */
		border-radius: 30rpx 30rpx 0 0 ;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.update-title{
		font-size: 1.2em;
		/* margin:15rpx 0; */
	}
	.update-icon{
		font-size: 3em;
		
	}
	.update-body{
		padding:20rpx;
		box-sizing: border-box;
		
	}
	.body-title{
		font-size: 1.4em;
		font-weight: bold;
		
	}
	.update-footer{
		width: 100%;
		padding-bottom:20rpx;
		
	}
	.btn{
		height:60rpx;
		width:80%;
		margin: 0 auto;
		border-radius: 30rpx;
		line-height:60rpx;
		text-align: center;
		
		
		
	}
	.cancel-btn{
		margin-top: 10rpx;
		font-size: 0.8em;
		color:#aaa;
		
		/* background-color: #ddd; */
	}
	
</style>