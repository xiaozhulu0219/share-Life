<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-card bg-white">
				<!-- 自己的modal :删除  取消
				别人的modal: 举报  取消 -->
				<view class="">
				</view>
				<view class="popup-list">
					<view class="popup-list-item" >
						分享
					</view>
					<view class="popup-list-item delete" v-if="listInfo.isUser" @click="handleDelete">
						删除
					</view>

					<view class="popup-list-item" v-if="!listInfo.isUser" @click="handleClick">
						举报
					</view>
					<view class="popup-list-item cancle" @click="close">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup-report" class="report-wrap" :mask-click="false">
			<view class="report-container">
				<view class="report-title">
					确认举报
				</view>
				<view class="report-body">
					确认举报当前{{listInfo.typeText}}吗？
					<view class="" style="font-size: 0.8em;">
						(对于不友好评论，您也可以通过长按对应评论进行举报)
					</view>
					<view class="" style="font-size: 0.8em;color:#aaa">
						提示:恶意举报会被处理的呦
					</view>
				</view>
				<view class="report-bottom ">
					<view class="report-btn submit-report bg-gradual-blue" @click="reportSubmit">
						确定
					</view>
					<view class="report-btn cancel-report" @click="reportClose">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup-delete" class="delete-wrap" :mask-click="false">
			<view class="delete-container">
				<view class="delete-title">
					确认删除
				</view>
				<view class="delete-body">
					确认删除当前{{listInfo.typeText}}
				</view>
				<view class="delete-bottom ">
					<view class="delete-btn submit-delete " @click="deleteSubmit">
						确定
					</view>
					<view class="delete-btn cancel-delete" @click="deleteClose">
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
			},
			handleClick(){
				// 点击举报
				this.$refs.popup.close()
				this.$refs['popup-report'].open()
				console.log(this.listInfo,"测试")
			},
			reportClose(){
				this.$refs['popup-report'].close()
			},
			reportSubmit(){
				this.$emit("reportSubmit",this.listInfo,()=>{
					this.$refs['popup-report'].close()
				});

			},
			handleDelete(){
				// 删除动态
				// 弹出删除动态modal
				this.$refs.popup.close();
				this.$refs['popup-delete'].open()

			},
			deleteClose(){
				// 关闭弹窗
				this.$refs['popup-delete'].close()
			},
			deleteSubmit(){
				// 删除事件
				this.$emit('deleteSubmit',this.listInfo,()=>{
					this.$refs['popup-delete'].close()
				})
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
		line-height: 110rpx;
		height:110rpx;
		font-size: 1.3em;
		text-align: center;
		/* border-bottom:1px solid #eee; */
		margin:0 auto;
		color:#111
		}
	.popup-list-item.cancle{
		color:#888
	}

	.report-container,.delete-container{
		width: 70vw;
		background-color: #fff;
		border-radius: 30rpx;
		padding: 36.23rpx;
		box-sizing: border-box;
	}
	.report-title,.delete-title{
		text-align: center;
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 40rpx;
	}
	.report-body,.delete-body{
		color:#666;

	}
	.report-bottom,.delete-bottom{
		margin-top: 30rpx;

	}
	.submit-report,.submit-delete{
		margin-bottom: 25rpx;
	}
	.report-btn,.delete-btn{
		width:100%;
		height: 70rpx;
		border-radius: 35rpx;
		line-height:70rpx;
		text-align: center;

	}
	.submit-delete{
		background-color: #e54d42;
		color:#fff;
	}
	.cancel-report,.cancel-delete{
		background-color: #eee;
	}

</style>
