<template>

	<!--消息页-->
	<view class="container">
		<commonTab :bgColor="NavBarColor">
			<block slot="title"> 消息 </block>
		</commonTab>

		<view class="card" :style="{marginTop:50+topSpace-5+'px'}">


			<view class="message-box-wrap">
				<view class="message-box-item">
					<view class="message-box-img">
						<image src="../../static/icon／dianzan.png" class="image-icon" mode=""  @click="loveMsg()"></image>
						<view class="message-box-info" v-if="this.msg3Count != 0">
							<view class="">{{this.msg3Count}}</view>
						</view>
					</view>
					<view class="message-box-title">
						赞和收藏
					</view>
				</view>
				<view class="message-box-item">
					<view class="message-box-img">
						<image src="../../static/icon／guanzhu.png" class="image-icon" mode="" @click="focusMsg()" ></image>
						<view class="message-box-info" v-if="this.msg4Count != 0">
							<view class="">{{this.msg4Count}}</view>
						</view>
					</view>
					<view class="message-box-title">
						新增关注
					</view>
				</view>
				<view class="message-box-item">
					<view class="message-box-img">
						<image src="../../static/icon／pinglun.png" class="image-icon" mode="" @click="commentMsg()"></image>
						<view class="message-box-info" v-if="this.msg5Count != 0">
							<view class="">{{this.msg5Count}}</view>
						</view>
					</view>
					<view class="message-box-title">
						评论和@
					</view>
				</view>
			</view>
		</view>
		<view class=" message-notice-area" @click="toNotice">
			<view class="message-notice-left">
				<view class="unNoticecount" v-if="unNoticeMsgCount>0">
					{{unNoticeMsgCount}}
				</view>
				<image class="message-notice-left-img" src="../../static/tongzhi.png" mode=""></image>
				
			</view>
			<view class="message-notice-right">
				<view class="message-notice-top">
					<view class="message-notice-top-left">
						通知小助手
						<view class="message-notice-top-sender">
							官方
						</view>
					</view>
					<view class="message-notice-top-right">
						{{lastNotice.sendTime}}
					</view>
				</view>
				<view class="message-notice-bottom">
					{{lastNotice.reportContent}}
				</view>
			</view>
		</view>
		<bottomTab PageCur="message"></bottomTab>
	</view>

</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import Mixin from '@/common/mixin/Mixin.js';
	import MescrollMoreMixin from '@/components/mescroll-uni/mixins/mescroll-more.js';
	import bottomTab from '../component/bottomTab.vue';
	import commonTab from '../component/commonTab.vue';
	import {
		mapMutations
	} from "vuex";
	export default {
		name: 'message',
		mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
		components: {
			bottomTab,
			commonTab,
		},
		data() {
			return {
				hovered: false,
				NavBarColor: this.NavBarColor,
				announcement3: [],
				announcement4: [],
				announcement5: [],
				// msg1Count: "0",
				// msg2Count: "0",
				msg3Count: '0',
				msg4Count: '0',
				msg5Count: '0',
				// msg1Title: "通知(0)",
				//msg2Title: "",
				msg3Title: '',
				msg4Title: '',
				msg5Title: '',
				url: {
					listMsgUrl: '/sys/annountCement/listMsg',
					editCementSend: '/sys/sysAnnouncementSend/editByAnntIdAndUserId',
					queryById: '/sys/annountCement/queryById',
					noticeListUrl:'/sys/sysAnnouncementSend/getMySystemNoticeSend',
				},
				lastNotice:{},
				unNoticeMsgCount:0
			};
		},
		//这里会拿到所有消息数量、将来展示在index的消息图标上
		computed: {
			msgTotal() {
				//return parseInt(this.msg1Count) + parseInt(this.msg2Count) + parseInt(this.msg3Count) + parseInt(this.msg4Count) + parseInt(this.msg5Count);
				// 将数组存到本地存储中
				return parseInt(this.msg3Count) + parseInt(this.msg4Count) + parseInt(this.msg5Count);
			},
		},
		mounted() {
			this.loadData();
		},
		onShow() {
			// 重新请求数据
			this.loadData();
			this.getLastNotice();
			
		},
		methods: {
			toNotice(){
				// 展示消息列表
				uni.navigateTo({
					url:'/pages/message/noticeList'
				})
			},
			...mapMutations(['changLoveCount', 'changeFollowCount', 'changeCommentsCount']),
			getLastNotice(){
				this.$http.get(this.url.noticeListUrl,{
					params:{
						pageNo:1,
						pageSize:10
					}
				}).then(res=>{
					console.log(res,"官方消息")
					if(res.data.success){
						this.lastNotice = res.data.result.records[0] || {}
						console.log(this.lastNotice )
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			timerFun() {
				this.stopTimer = false;
				const myTimer = setInterval(() => {
					// 停止定时器
					if (this.stopTimer == true) {
						clearInterval(myTimer);
						return;
					}
					this.loadData();
				}, 6000);
			},
			loadData() {
				try {
					// 获取系统消息
					this.$http.get(this.url.listMsgUrl).then((res) => {
						console.log('进入了获取系统消息方法');
						if (res.data.success) {
							console.log('系统消息方法的表单数据', res);
							//this.announcement1 = res.data.result.anntMsgList;
							//this.msg1Count = res.data.result.anntMsgTotal;
							//this.msg1Title = "通知(" + res.data.result.anntMsgTotal + ")";
							//this.announcement2 = res.data.result.sysMsgList;
							//this.msg2Count = res.data.result.sysMsgTotal;
							//this.msg2Title = "系统消息(" + res.data.result.sysMsgTotal + ")";
							//this.announcement3 = res.data.result.loveMsgList;

							// 同步改变仓库里面的数据
							// loadData会改变未读消息的数量
							// 当前未读系统消息数量
							this.unNoticeMsgCount = res.data.result.systemNoticeMsgTotal;
							
							this.msg3Count = res.data.result.loveMsgTotal;
							this.changLoveCount(this.msg3Count);

							this.msg3Title = '赞和收藏(' + res.data.result.loveMsgTotal + ')';
							//console.log("announcement3 的数据为",this.announcement3)
							console.log('msg3ount 的数据为', this.msg3Count);
							console.log('msg3Title 的数据为', this.msg3Title);
							//this.announcement4 = res.data.result.focusMsgList;
							this.msg4Count = res.data.result.focusMsgTotal;
							this.changeFollowCount(this.msg4Count)
							this.msg4Title = '新增关注(' + res.data.result.focusMsgTotal + ')';
							//this.announcement5 = res.data.result.commentMsgList;
							this.msg5Count = res.data.result.commentMsgTotal;
							this.changeCommentsCount(this.msg5Count)
							this.msg5Title = '评论和@(' + res.data.result.commentMsgTotal + ')';
						}
					}).catch(error => {
						console.log('系统消息通知异常', error); //这行打印permissionName is undefined
						this.stopTimer = true;
						console.log('清理timer');
					});
				} catch (err) {
					this.stopTimer = true;
					console.log('通知异常', err);
				}
			},

			//点击"赞和收藏"
			loveMsg() {
				//什么值也不用传 进去在调用新的接口
				//console.log("announcement3 的数据为",this.announcement3)
				//console.log("进来了赞和收藏,拿到的是所有赞和收藏消息", myFormData)
				//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
				uni.navigateTo({
					url: '/pages/message/loveMsgModal'
				});
			},
			//点击"新增关注"
			focusMsg(myFormData) {
				console.log('进来了666应该是uuid');
				//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
				uni.navigateTo({
					url: '/pages/message/focusMsgModal'
				});
			},
			//点击"评论和@"
			commentMsg(myFormData) {
				console.log('进来了666应该是uuid');
				//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
				uni.navigateTo({
					url: '/pages/message/commentMsgModal'
				});
			}

		}
	};
</script>


<style lang="scss" scoped>
	.image-icon {
		height: 80rpx;
		width: 80rpx;
	}

	.container {
		background-color: #ffffff;
	}

	.card {
		background-color: #fff;
		padding: 20rpx 20rpx;
		padding-bottom: 0;
		border-radius: 20rpx;
		box-sizing: border-box;
		margin-bottom: 10rpx;
		/*盒子间的距离*/
		/*盒子距离顶部的距离*/
		line-height: 35rpx;
		/*行高*/

		.card-line {
			font-weight: bold;
			display: flex;
			margin-bottom: 30rpx;
			/*盒子间的距离*/
			margin-top: 45rpx;
			/*盒子距离顶部的距离*/

			.card-loveMessage {
				font-weight: bold;
				display: inline-block;
				margin-bottom: 30rpx;
				/*盒子间的距离*/
				margin-left: 50rpx;
				position: relative;
				text-align: center;
				.card-love {
					font-weight: bold;
					//display: inline-block;
					//margin-bottom: 30rpx; /*盒子间的距离*/
					// margin-left: -20rpx;
					margin-top: 10rpx;

				}

				.card-loveCount {
					font-weight: bold;
					//display: inline-block;
					//margin-bottom: 30rpx; /*盒子间的距离*/
					//position: absolute; //绝对定位
					//margin-left: 85rpx;
					//margin-top: -130rpx;
					color: white;
				}

				.card-love-back {
					//height: 30rpx;
					// width: 30rpx;
					border-radius: 50%;
					background: red;
					position: absolute; //绝对定位
					margin-left: 70rpx;
					top:-20rpx;
					text-align: center;
					//line-height: 30rpx;
					padding: 10rpx 20rpx; //上下左右
				}
			}

			.card-focusMessage {
				font-weight: bold;
				display: inline-block;
				margin-bottom: 30rpx;
				/*盒子间的距离*/
				margin-left: 160rpx;
				position: relative;

				.card-focus {
					font-weight: bold;
					//display: inline-block;
					//margin-bottom: 30rpx; /*盒子间的距离*/
					margin-left: -15rpx;
					margin-top: 10rpx;
				}

				.card-focusCount {
					font-weight: bold;
					//position: absolute; //绝对定位
					//margin-left: 85rpx;
					//margin-top: -130rpx;
					color: white;
				}

				.card-focus-back {
					//height: 30rpx;
					// width: 30rpx;
					border-radius: 50%;
					background: red;
					position: absolute; //绝对定位
					margin-left: 70rpx;
					top:-20rpx;
					text-align: center;
					//line-height: 30rpx;
					padding: 10rpx 20rpx; //上下左右
				}


			}

			.card-commentMessage {
				font-weight: bold;
				display: inline-block;
				margin-bottom: 30rpx;
				/*盒子间的距离*/
				margin-left: 160rpx;
				position:relative;

				.card-comment {
					font-weight: bold;
					//display: inline-block;
					//margin-bottom: 30rpx; /*盒子间的距离*/
					margin-left: -15rpx;
					margin-top: 10rpx;
				}

				.card-commentCount {
					font-weight: bold;
					//position: absolute; //绝对定位
					//margin-left: 85rpx;
					//margin-top: -130rpx;
					color: white;
				}

				.card-comment-back {
					//height: 30rpx;
					// width: 30rpx;
					border-radius: 50%;
					background: red;
					position: absolute; //绝对定位
					margin-left: 70rpx;
					top:-20rpx;
					text-align: center;
					//line-height: 30rpx;
					padding: 10rpx 20rpx; //上下左右


				}
			}
		}
	}
	.container{
		.message-box-wrap{
			padding:30rpx 20rpx;
			box-sizing: border-box;
			width: 100%;
			display:flex
		}
		.message-box-item{
			width:33% ;
			flex: 0 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.message-box-img{
			position: relative;
		}
		.message-box-info{
			position: absolute;
			border-radius: 50%;
			background: red;
			padding: 10rpx 20rpx;
			right: 0rpx;
			top:0rpx;
			transform: translate(50%,-50%);
			text-align: center;
			color: #fff;
			font-weight: bold;
			font-size: 1.1em;
		}
		.message-box-title{
			margin: 10rpx;
			font-weight: bold;
		}

	}
	.message-notice-area{
		// margin: 40rpx 0;
		border-top: 5px solid rgb(241,241,241);
		display: flex;
		width: 100%;
		padding:20rpx 20rpx;
		box-sizing: border-box;
		align-items: center;
	}
	.message-notice-left{
		width: 15%;
		margin-left: 20rpx;
		position: relative;
		
	}
	.unNoticecount{
		position: absolute;
		z-index:999;
		right: 10rpx;
		padding:8rpx 15rpx;
		color: #fff;
		font-size: 0.8em;
		top: -15rpx;
		border-radius: 50%;
		background-color: red;
	}
	.message-notice-left-img{
		height: 80rpx;
		width:80rpx;
		border-radius: 50%;
	}
	.message-notice-right{
		width: 80%;
	}
	.message-notice-top{
		display: flex;
		justify-content: space-between;
	}
	.message-notice-top-left{
		font-size: 1.1em;
		font-weight: bold;
		margin-bottom: 15rpx;
		position: relative;
	}
	.message-notice-top-right{
		font-size: 0.8em;
		color:#aaa;
	}
	.message-notice-top-sender{
		position: absolute;
		right:0rpx;
		color:orangered;
		top:0rpx;
		transform: translateX(120%);
		font-size: 0.6em;
		border: 1rpx solid orangered;
		border-radius: 20%;
		padding:0 5rpx;
		
	}
	.message-notice-bottom{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
