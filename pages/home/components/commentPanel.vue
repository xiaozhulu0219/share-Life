<template>
	<view class="comment-panel-wrap" :class="{show:isShow}" @transitionend="tEnd">
		<view class="comment-space" @click="cancelComment">
			
		</view>
		<view class="comment-panel-container"  >
			<!-- <view class="" style="text-align: right;">
				<text class="iconfont icon-guanbi" @click="cancelComment" style="font-size: 0.8em;"></text>
			</view> -->
			<view class="input-box">
				<view class="box-inner-left">
					<text class="iconfont icon-wenbenshuru"></text>
				</view>
				<input 
				ref="commentInput" :focus="inpFocus" type="text" class="input-box-inner" v-model="inputVal"
					:placeholder="placeholderText" maxlength="200"
					@keydown.enter="handleChange">
				<!-- <view class="test-btn">
					<button type="default" size="mini" plain="true" @click="sbmitComment">发表</button>
				</view> -->
			</view>
			<view class="submit-box" @click="handleChange">
				发送
				
			</view>
			<!-- <view class="" style="width: 100%;height: 30rpx; background-color: black;"> -->
		
		</view>
	</view>
	
	<!-- <button type="primary" size="mini" plain="true" @click="sbmitComment">发表</button> -->
	<!-- <button type="warn" size="mini" plain="true" style="margin-left: 20rpx;" @click="cancelComment">取消</button> -->

</template>

<script>
	export default {
		data() {
			return {
				// isShow:false
				inputVal: '',
				inpFocus: false
			}

		},

		// watch: {
		// 	// 监听
		// 	'isShow': {
		// 		handler(newVal, oldVal) {
		// 			// 监听isshow时间自动对焦
		// 			if (newVal) {
		// 				// 面板显示
		// 				console.log("显示")
		// 				this.inputFocus()
		// 				this.inpFocus = true;
		// 				setTimeout(()=>{
		// 					this.inpFocus = true;
		// 				},100)
		// 				// console.log();

		// 				// this.$refs.commentInput.focus=true
		// 			}else{
		// 				this.inpFocus = false
		// 			}
		// 		}
		// 	}
		// },
		methods: {
			handleChange(e){
				// 按下enter提交
				console.log("提交评论");
				this.sbmitComment()
			},
			tEnd() {
				if (this.isShow) {
					// console.log("聚焦");
					this.inpFocus = true;
				} else {
					this.inpFocus = false;
				}
			},
			// inputFocus() {
			// 	this.$nextTick(() => {
			// 		// console.log()
			// 		// this.$refs.commentInput.focus=true
			// 		this.inpFocus = true

			// 	})
			// },
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
	.comment-panel-wrap{
		left: 0px;
		height:100vh;
		width:100vw;
		display: flex;
		flex-direction: column;
		position: fixed;
		top:100%;
		/* bottom: -100%; */
		transition: 200ms;
		
	}
	.comment-panel-wrap.show{
		top: 0;
	}
	.comment-space{
		flex:1 1 auto;
		background-color:transparent;
	}
	.comment-panel-container {
		flex:0 0 auto;
		height: 100rpx;
		/* padding: 20rpx 30rpx; */
		background-color: #eee;
		box-sizing: border-box;
		position: absolute;
		bottom:0;
		left:0;
		display: flex;
		/* border-radius: 20px 20px 0 0; */
		width: 100%;
		transition: 200ms;
		text-align: center;
		align-items: center;




	}

	.submit-box{
		width: 15%;
		height:60%;
		/* border:1px solid #ccc; */
		flex: 0 0 auto;
		margin:0 10rpx;
		border-radius:30rpx ;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(21,173,198);
		color: #fff;
	}
	
	.input-box {
		/* width: 90%; */
		flex: 1 1 auto;
		height:60%;
		border:1px solid #ccc;
		margin: 0 10rpx;
		border-radius: 30rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		/* background-color */
		text-align: left;
		/* justify-content: space-between; */

		/* margin-bottom: 100rpx; */

	}

	.input-box-inner {
		width: 80%;
		flex: 1 1 auto;
		font-size: 0.9em;
	}
	.box-inner-left{
		width:10%;
		flex: 0 0 auto;
		text-align: center;
	}
	
</style>
