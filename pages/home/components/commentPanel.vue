<template>
	<view class="comment-panel-wrap" :class="{show:isShow}" @transitionend="tEnd">
		<view class="comment-space" @click="cancelComment">
			
		</view>
		<view class="comment-panel-container" :class="{show:isShow}" >
			<!-- <view class="" style="text-align: right;">
				<text class="iconfont icon-guanbi" @click="cancelComment" style="font-size: 0.8em;"></text>
			</view> -->
			<view class="input-box">
				<view class="box-inner-left">
					<text class="iconfont icon-wenbenshuru"></text>
				</view>
				<input 
				@input="onInput(inputVal)"
				:adjust-position="false"
				@focus="handlefocus"
				ref="commentInput" :focus="inpFocus" type="text" class="input-box-inner" v-model="inputVal"
					:placeholder="placeholderText" maxlength="200"
					@blur="cancelComment"
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
	import textTip from "@/pages/component/textTip.js";
	import {
		keyWords
	} from '@/common/util/constants.js';
	export default {
		data() {
			return {
				// isShow:false
				inputVal: '',
				inpFocus: false,
				height:'',
				isclicked:false,
			}

		},
		mixins:[textTip],
		watch: {
			// 监听
			'isShow': {
				handler(newVal, oldVal) {
					// 监听isshow时间自动对焦
					if (newVal) {
						// 面板显示
						console.log("显示")
						// this.inputFocus()
						this.inpFocus = true;
						setTimeout(()=>{
							this.inpFocus = true;
						},100)
						// console.log();

						// this.$refs.commentInput.focus=true
					}else{
						this.inpFocus = false
					}
				}
			}
		},
		methods: {
			handlefocus(e){
				// this.$nextTick(()=>{
				// 	this.test = e
				// 	console.log(e)
				// 	console.log("输入法被点击")
				// })
				this.height = 300+'px'
			
			},
			onInput(value) {
				// console.log(value,'1111')
				if (value !== null) {
					// console.log(value,'2222')
					for (const i in keyWords) {
						const reg = new RegExp(keyWords[i], 'g');
						value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
					}
					// console.log(value,'3333')
				}
				// 数据改变是异步的
				this.$nextTick(() => {
					
					this.inputVal= value;
					console.log(this.inputVal,"数据改变了")
				});
				console.log('置换后value:', value);
			},
			handleChange(e){
				// 按下enter提交
				this.isclicked = true;
				console.log("提交评论");
				// 关键词拦截
				
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
				setTimeout(()=>{
					this.$emit("cancelComment");
					this.inputVal = '';
				},500)
			},

			sbmitComment() {
				console.log(this.inputVal);
				if (this.inputVal === '' || this.inputVal.indexOf('*') != -1) {
					console.log('动态内容出现了违规词语、已被拦截：',this.inputVal);
					this.showTextTip('评论')
					return 
					} else {
					// 向父级传递
					// console.log("是否是直接评论",this.isDirectedComment)
					this.$emit('commentSubmit', this.inputVal, () => {
						// 成功之后重置当前的输入框
						this.inputVal = '';
						this.isclicked = false;
					})
				}
			}

		},
		props: {
			isShow: Boolean,
			placeholderText: String,
			test:{
				
			}
			// 是否是直接评论 意思是是否是对动态的直接论
			// isDirectedComment:Boolean
		}
	}
</script>

<style>
	@import url("//at.alicdn.com/t/c/font_4189769_b7ngzgwe98s.css");
	.test-inner{
		top: 50%;
		left:0;
		position:absolute
		
	}
	.comment-panel-wrap{
		left: 0px;
		height:100vh;
		width:100vw;
		/* display: flex; */
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
		/* flex:1 1 auto; */
		height: 100vh;
		width:100vw;
		background-color:transparent;
	}
	.comment-panel-container.show{
		display: flex;
	}
	.comment-panel-container {
		/* flex:0 0 auto; */
		
		height: 120rpx;
		/* padding: 20rpx 30rpx; */
		background-color: #fff;
		border-top: 1px solid #ddd;
		box-sizing: border-box;
		position: fixed;
		bottom:0;
		left:0;
		display: none;
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
		border-radius:40rpx ;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(21,173,198);
		color: #fff;
	}
	
	.input-box {
		/* width: 90%; */
		flex: 1 1 auto;
		height:70%;
		/* border:1px solid #ccc; */
		margin: 0 10rpx;
		border-radius: 40rpx;
		background-color: #eee;
		display: flex;
		align-items: center;
		/* background-color */
		text-align: left;
		/* justify-content: space-between; */

		/* margin-bottom: 100rpx; */

	}

	.input-box-inner {
		flex: 1 1 auto;
		font-size: 1em;
	}
	.box-inner-left{
		width:10%;
		flex: 0 0 auto;
		text-align: center;
	}
	
</style>
