<template>
	<!-- 单个消息组件 -->
	<view class="msg-item-container">
		<view class="msg-item-time">
			{{item.sendTime}}
		</view>
		<view class="msg-item-main">
			<view class="msg-item-left">
				<image class="msg-item-img" src="../../static/tongzhi.png" mode=""></image>
			</view>
			<view class="msg-item-right">
				<view class="msg-item-right-top">
					{{item.title}}
				</view>
				<view class="msg-item-right-bottom">
					{{item.reportContent}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object
		}
	}
</script>

<style scoped>
	.msg-item-container{
		margin: 40rpx 0;
	}
	.msg-item-time{
		text-align: center;
		font-size: 0.9em;
		color: #aaa;
		margin-bottom: 20rpx;
		
	}
	.msg-item-main{
		display: flex;
		align-items: flex-start;
	}
	.msg-item-left{
		flex:0 0 auto;
		width:15%;
		margin-left:20rpx
		
	}
	.msg-item-right{
		width:60%;
		flex:0 0 auto;
		padding:15rpx;
		background-color: #fff;
		border-radius: 15rpx;
	}
	.msg-item-img{
		height:80rpx;
		width:80rpx;
		border-radius: 50%;
	}
	.msg-item-right-top{
		font-size: 1.1em;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
</style>