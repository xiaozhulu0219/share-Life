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
						<view class="update-btn btn " 
						@click="handleUpdate"
						:class="{isLoading:loadingMode,'bg-gradual-blue':!loadingMode}"
						>
							<text class="progress-text">{{loadingMode?'下载中:'+loadProgress+'%':'立即更新'}}</text>
							<view v-if="loadingMode" class="progress bg-gradual-blue"
							:style="{width:progressWidth}">
								
								
							</view>
						</view>
						<view class="cancel-btn btn" @click="close" v-if="!updateObj.force">
							取消
						</view>
					</view>
					<!-- <view class="progress-container">
						<view class="load-progress">
							
						</view>
					</view> -->
				</view>
			</uni-popup>
		</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		computed:{
			progressWidth(){
				return (this.loadProgress*400/100) +'rpx'
			}
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
			updateObj:Object,
			loadingMode:Boolean,
			loadProgress:Number
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
		width:400rpx;
		margin: 0 auto;
		border-radius: 30rpx;
		line-height:60rpx;
		text-align: center;
		position: relative;
		overflow: hidden;
		z-index: 0;
	}
	.progress-text{
		color: #fff;
		z-index: 99;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.progress{
		height: 100%;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		z-index: 9;
	}
	.cancel-btn{
		margin-top: 10rpx;
		font-size: 0.8em;
		color:#aaa;
		
		/* background-color: #ddd; */
	}
	.update-footer .isLoading.btn{
		background-color: #ccc;
		
	}
</style>