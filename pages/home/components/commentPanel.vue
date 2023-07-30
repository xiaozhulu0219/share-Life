<template>
	<view class="comment-panel-container" :class="{show:isShow}">
		<view class="" style="text-align: right;">
			<text class="iconfont icon-guanbi" @click="cancelComment" style="font-size: 0.8em;"></text>
		</view>
		<view class="input-box">
			<input type="text" class="input-box-inner" v-model="inputVal" :placeholder="placeholderText"
				maxlength="200">
			<view class="test-btn">
				<button type="default" size="mini" plain="true" @click="sbmitComment">发表</button>
			</view>
		</view>
		<!-- <view class="" style="width: 100%;height: 30rpx; background-color: black;"> -->

	</view>
	<!-- <button type="primary" size="mini" plain="true" @click="sbmitComment">发表</button> -->
	<!-- <button type="warn" size="mini" plain="true" style="margin-left: 20rpx;" @click="cancelComment">取消</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// isShow:false
				inputVal: '',

			}

		},

		methods: {
			cancelComment() {
				// 取消评论
				this.$emit("cancelComment");
				this.inputVal = '';
			},

			sbmitComment() {
				console.log(this.inputVal);
				if (this.inputVal === '') {
					// 空值处理
					return
				} else {
					// 向父级传递
					// console.log("是否是直接评论",this.isDirectedComment)
					this.$emit('commentSubmit', this.inputVal, () => {
						// 成功之后重置当前的输入框
						this.inputVal = '';
					})
				}
			}

		},
		props: {
			isShow: Boolean,
			placeholderText: String,
			// 是否是直接评论 意思是是否是对动态的直接论
			// isDirectedComment:Boolean
		}
	}
</script>

<style>
	@import url("//at.alicdn.com/t/c/font_4189769_b7ngzgwe98s.css");

	.comment-panel-container {
		height: 150rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #ddd;
		border-radius: 20px 20px 0 0;
		width: 100%;
		position: fixed;
		bottom: -100%;
		transition: 200ms;
		text-align: center;




	}

	.test-btn {
		flex: 1 1;
	}

	.input-box {
		width: 100%;
		margin: 0 auto;
		margin-top: 10rpx;
		height: 70rpx;
		/* background-color */
		: #fff;
		text-align: left;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */

		/* margin-bottom: 100rpx; */

	}

	.input-box-inner {
		width: 80%;
		flex: 0 0 auto;
		
	}

	.comment-panel-container.show {
		bottom: 0;
	}
</style>
