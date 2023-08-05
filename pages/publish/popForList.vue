<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-card bg-white">
				<!-- 自己的modal :删除 复制 取消
				别人的modal: 举报 复制 取消 -->
				<view class="">
				</view>
				<view class="popup-list">
					<view class="popup-list-item delete" v-if="listInfo.isUser">
						删除
					</view>
					<view class="popup-list-item">
						复制
					</view>
					<view class="popup-list-item" v-if="!listInfo.isUser">
						举报 
					</view>
					<view class="popup-list-item" @click="close">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		methods: {
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open('bottom')
				// 
				// this.$emit("popListUp")
			},
			close(){
				this.$refs.popup.close()
			}
		},
		props:{
			listInfo:Object
		}
	}
</script>

<style>
	.popup-card {
		/* margin: 0 auto 45rpx; */
		width: 100%;
		border-radius: 35rpx 35rpx 0 0;
		padding-top:40rpx;
		
	}
	.popup-list-item{
		width: 80%;
		line-height: 80rpx;
		height:80rpx;
		font-size: 1.3em;
		text-align: center;
		/* border-bottom:1px solid #eee; */
		margin:0 auto;
		
	}
</style>
