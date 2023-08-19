<template>
	<!--消息页-->
	<view class="container">
		<commonTab :isBack="true" :backRouterName="backRouteName">
			<block slot="title">
				获赞消息
			</block>
		</commonTab>

		<view class="list-wrap" :style="{marginTop:50+topSpace-5+'px'}">
			<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
				<view v-for="(item,index) in this.myLoveMsg" :key="index" class="card">
					<view class="myLoveMsg-item-wrap">
						<view class="myLoveMsg-item-left">
							<view class="item-left-left">
								<image class="card-avatar-img " :src="item.avatar" mode="aspectFill" alt=""
									@click="toInformationDetail(item.busId)"></image>
							</view>
							<view class="item-left-right">
								<view class="item-left-right-top">{{item.nickName }}</view>
								<view class="item-left-right-bottom">
									<text class="cuIcon-titles" style="color: #ddd;">
										
									</text>
								{{item.title }}  <text class="inner-text">{{item.createTime }}</text> 
								</view>
							</view>
						</view>
						<view class="myLoveMsg-item-right">
							<view class="comment-iconlikeCount">
								<!-- 这块将来要根据 业务类型和业务id 去查询具体的东西  -->
								<image class="card-medias-inner" :src="item.medias" mode="aspectFit" alt=""
									@click="toInformationDetail(item.busId)"></image>
							</view>
						</view>
					</view>
					
					
					
					<!-- <view class="detail-title">
						<image class="card-avatar round sm" :src="item.avatar" mode="aspectFit" alt=""
							@click="toInformationDetail(item.busId)"></image>
					</view> -->
					<!-- <view class="detail-content">
						<view class="detail-info">
							<view style="font-size: 40rpx; margin-top: 10rpx">{{item.nickName }}</view>
							<view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }} {{item.createTime }}
							</view>
						</view>
						<view class="comment-iconlikeCount">
							这块将来要根据 业务类型和业务id 去查询具体的东西 
							<image class="card-medias" :src="item.medias" mode="aspectFit" alt=""
								@click="toInformationDetail(item.busId)"></image>
						</view>
					</view> -->
				</view>
				<view v-if='isDownLoading' class="load-text">加载中....</view>
				<view v-if="!isDownLoading && !hasNext" class="noMore">---多发布动态，才会收获更多的赞呦---</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import Mixin from '@/common/mixin/Mixin.js';
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	import configService from '@/common/service/config.service.js'
	import commonTab from '../component/commonTab.vue';
	
	export default {
		name: 'loveMsgModal',
		mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
		components: {
			commonTab
		},
		data() {
			return {
				pageInfo: {
					num: 0,
					size: 10
				},
				hasNext: true,
				isDownLoading: false,
				backRouteName: 'message',
				myLoveMsg: [],
				fileUrl: configService.fileSaveURL,
				getMyLoveMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyLoveMsgAnnouncementSend",
				getByInforIdUrl: '/information/movements/findPublishInforById',
				url: {

					queryByUuIdUrl: '/sys/user/queryByUuId',
					readLoveMsgAllUrl: "/sys/sysAnnouncementSend/readLoveMsgAll",
				},
				FocusFansNumVo: {
					avatar: '',
					busType: '',
					busId: '',
					title: '',
					msgCategory: '',
					fromUser: '',
					createTime: '',
					nickName: '',
					medias: '',
					content: '', //评论内容
					backContent: '', //被评论的评论内容，或者被赞的评论、
					inforId: '', //被评论的评论内容，或者被赞的评论、
				},
			};
		},
		created() {
			console.log(9999);
			this.getMyLoveMsgAnnouncementSend();
			//一键已读所有未读的消息
			this.readLoveMsgAll();
		},
		onLoad(option) {
			//const item = JSON.parse(decodeURIComponent(option.item));
			//this.announcement3 = item
			//console.log("输出item", item)
			//this.loveMsg(this.announcement3); //这是传参后继续调用方法的示例
		},
		methods: {
			// 触底加载
			reachBottom() {
				if (!this.hasNext) return;
				console.log('//// 触底加载');
				this.getMyLoveMsgAnnouncementSend();
			},
			//获取我的点赞消息
			getMyLoveMsgAnnouncementSend() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.pageInfo.num++;
				const {
					getMyLoveMsgAnnouncementSendUrl,
					pageInfo: {
						num,
						size
					}
				} = this;
				this.$http.get(getMyLoveMsgAnnouncementSendUrl, {
					params: {
						page: num,
						pagesize: size
					}
				}).then(res => {
					const {
						success,
						result
					} = res.data;
					//console.log('。。。。。', result.records);
					if (success) {
						const {
							pages,
							records,
							current
						} = result;
						if (num === 1) this.myLoveMsg = [];
						if (records.length) {
							for (const d of records) {
								d.avatar = this.fileUrl + d.avatar
								d.medias = this.fileUrl + d.medias
							}
						}
						this.myLoveMsg = this.myLoveMsg.concat(records);
						this.hasNext = pages > current;
						this.isDownLoading = false;
						console.log(this.myLoveMsg, ",,,")
					} else {
						this.isDownLoading = false;
					}
				}).catch(err => {
					console.log(err);
					this.isDownLoading = false;
				});
			},
			//一键已读点赞信息
			readLoveMsgAll() {
				console.log("进来了一键已读点赞信息方法")
				this.$http.get(this.url.readLoveMsgAllUrl).then(res => {
					if (res.data.success) {
						console.log("点赞信息已经被一键已读")
					}
				}).catch(err => {
					console.log(err);
				});
			},
			toInformationDetail(item) {
				console.log("获赞点击消息拿到动态id", item)
				//进来的是  busId 名字要换为 inforId
				this.FocusFansNumVo.inforId = item;
				// 需要先请求拿到单挑动态
				this.$http.get(this.getByInforIdUrl, {
					params: {
						id: item
					}
				}).then(res => {
					
					if (res.data.success) {
						const result = {...res.data.result};
						// 图片头像格式化
						console.log(result)
						const arr = result.medias?.split(',');
						const arr2 = [];
						for (let e of arr) {
							e = this.fileUrl + e;
							arr2.push(e);
						}
						result.avatar = this.fileUrl + result.avatar
						result.medias = arr2;
						uni.navigateTo({
						    url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(result))
						})
					}
					
				})
				
			},

		}
	};
</script>


<style lang="scss" scoped>
	.list-wrap {
		height: calc(100vh - 100rpx);

		/*盒子距离顶部的距离*/
		box-sizing: border-box;
	}

	.card {
		background-color: #fff;
		//padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;
		/*盒子间的距离*/
		margin-top: 10rpx;
		/*盒子距离顶部的距离*/
		// line-height: 85rpx;
		/*行高*/
	}

	.card-avatar {
		max-width: 25px;
		width: 25px;
		width: expression(this.width > 25 ? "25px" : this.width);
		height: 25px;
		height: expression(this.height > 25 ? "25px" : this.height);
		position: absolute;
		font-size: 20rpx;
		margin-top: 15rpx;
		//margin-right: 10rpx;
		margin-left: 20rpx;
	}

	.detail-title {
		//display: flex;
		margin-right: 100rpx;
		// justify-content: space-between;
	}

	.detail-content {
		display: flex;
		justify-content: space-between;
		margin-left: 80rpx;
	}

	.detail-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.detail-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.comment-iconlikeCount {
		//font-weight: bold;
		// margin-right: 200rpx;
		//margin-left: 35rpx;
		//margin-top: 30rpx;
		//display: flex;
		//justify-content: space-between;
	}

	.card-medias {
		max-width: 80px;
		width: 80px;
		width: expression(this.width > 80 ? "80px" : this.width);
		height: 80px;
		height: expression(this.height > 80 ? "80px" : this.height);
		position: absolute;
		//font-size: 20rpx;
		//margin-top: 1rpx;
		//margin-right: 50rpx;
		//margin-left: 2rpx;
	}

	.load-text,
	.noMore {
		background-color: #fff;
		text-align: center;
		padding: 4rpx;
	}

	.noMore {
		color: #ccc;
	}
	.myLoveMsg-item-wrap{
		display: flex;
		width:100%;
		padding:30rpx 20rpx;
		box-sizing: border-box;
		
	}
	.myLoveMsg-item-left{
		flex:1 1 auto;
		display: flex;
		align-items: flex-start;
	}
	.myLoveMsg-item-right{
		width:30%;
		flex: 0 0 auto;
		// background-color: yellow;
	}
	.item-left-left{
		width: 20% ;
		flex:0 0 auto;
		
		.card-avatar-img{
			height:80rpx;
			width:80rpx;
			border-radius: 50%;
			
		}
	}
	.item-left-right{
		flex:1 1 auto;
		display: flex;
		flex-direction: column;
			.item-left-right-top{
				font-size: 1.1em;
				font-weight: bold;
				margin-bottom:30rpx;
				
			}
			.item-left-right-bottom{
				margin-bottom:30rpx;
			}
			.inner-text{
				font-size: 0.7rem;
				margin-left: 20rpx;
			}
	}
	.card-medias-inner{
		max-height:120rpx;
		
	}
	
	
</style>
