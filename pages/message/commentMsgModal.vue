<template>

    <!--消息页-->
    <view class="container">
        <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title">
                评论消息
            </block>
        </commonTab>
        <view class="list-wrap" :style="{marginTop:50+topSpace-5+'px'}">
            <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
            <view v-for="(item,index) in this.myCommentMsg" :key="index" class="card">
                
                <view class="detail-content">
                    <!-- <view class="detail-info">
                        <view style="font-size: 40rpx; margin-top: 10rpx">{{item.nickName }}</view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }}  {{item.createTime }} </view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.content }}</view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx" v-if="item.pubType == 3">{{item.backContent }}</view>
                    </view> -->
					<view class="detail-content-top">
						<view class="detail-title">
						    <image class="card-avatar-img" :src="item.avatar" mode="aspectFill" alt="" @click="toInformationDetail(item.busId)"></image>
						</view>
						<view class="detail-title-info">
							<view class="detail-title-name">{{item.nickName }}</view>
							<view class="info-time">{{item.title }}  {{item.createTime }} </view>
							<view class="infor-content">
								<view class="cuIcon-titles" style="color: #ddd;">
									
								</view>
								<view  class="infor-content-text">{{item.content }}</view>
							</view>
						</view>
					</view>
					
					<!-- <view class="detail-content-top-detail">
						<view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }}  {{item.createTime }} </view>
					</view> -->
                    <view class="comment-iconlikeCount"> <!-- 这块将来要根据 业务类型和业务id 去查询具体的东西  -->
                        <image class="card-medias" :src="item.medias" mode="aspectFit" alt="" @click="toInformationDetail(item.busId)"></image>
                    </view>
                </view>
            </view>
                <view v-if='isDownLoading' class="load-text">加载中....</view>
                <view v-if="!isDownLoading && !hasNext" class="noMore">---多多互动，才会收获更多的评论呦---</view>
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
        name: 'commentMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {commonTab},
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                backRouteName: 'message',
                myCommentMsg:[],
                fileUrl: configService.fileSaveURL,
                getMyCommentMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyCommentMsgAnnouncementSend",
                url: {
                    queryByUuIdUrl: '/sys/user/queryByUuId',
                    readCommentMsgAllUrl: "/sys/sysAnnouncementSend/readCommentMsgAll",
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
            this.getMyCommentMsgAnnouncementSend();
            //一键已读所有未读的消息
            this.readCommentMsgAll();

        },
        onLoad(option) {
            //const item = JSON.parse(decodeURIComponent(option.item));
            //this.announcement5 = item
            //this.commentMsg(this.announcement5);
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getMyCommentMsgAnnouncementSend();
            },
            //获取我的评论消息
            getMyCommentMsgAnnouncementSend() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const {getMyCommentMsgAnnouncementSendUrl, pageInfo: {num, size}} = this;
                this.$http.get(getMyCommentMsgAnnouncementSendUrl, {
                    params: {page: num, pagesize: size}
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。', result.records);
                    if (success) {
                        const {pages, records, current} = result;
                        if (num === 1) this.myCommentMsg = [];
                        if (records.length) {
                            for (const d of records) {
                                d.avatar = this.fileUrl + d.avatar
                                d.medias = this.fileUrl + d.medias
                            }
                        }
                        this.myCommentMsg = this.myCommentMsg.concat(records);
						console.log(this.myCommentMsg,"need")
                        this.hasNext = pages > current;
                        this.isDownLoading = false;
                    } else {
                        this.isDownLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.isDownLoading = false;
                });
            },
            //一键已读评论消息
            readCommentMsgAll() {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.readCommentMsgAllUrl).then(res => {
                    if (res.data.success) {
                        console.log("评论消息已经被一键已读")
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            toInformationDetail(item) {
                //console.log("进来了111", item)
                //进来的是  busId 名字要换为 inforId
                this.FocusFansNumVo.inforId = item
                uni.navigateTo({
                    url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(this.FocusFansNumVo))
                })
            },
        }
    };
</script>


<style lang="scss" scoped>
    .list-wrap {
        height: calc(114vh - 280rpx);
        /*盒子距离顶部的距离*/
    }

    .card {
        background-color:  #fff;
        //padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 10rpx; /*盒子距离顶部的距离*/
        line-height: 85rpx; /*行高*/
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
        // justify-content: space-between;
    }

    .detail-content {
        display: flex;
        justify-content: space-between;
        // margin-left: 80rpx;
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
        margin-right: 200rpx;
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
        //margin-right: 150rpx;
        //margin-left: 2rpx;
    }
    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }

    .noMore {
        color: #ccc;
    }
	.container{
		.list-wrap{
			.detail-content{
				padding: 10rpx;
				box-sizing: border-box;
				.detail-content-top{
					display: flex;
					align-items: flex-start;
					width:100%;
					.detail-title{
						width: 20%;
						flex:0 0 auto;
						overflow: hidden;
						.card-avatar-img{
							height: 90rpx;
							width: 90rpx;
							border-radius: 50%;
						}
					}
					.detail-title-info{
						flex: 1 1 auto;
						line-height: 40rpx;
						display: flex;
						flex-direction: column;
						.detail-title-name{
							margin-top: 10rpx;
							color: #333;
							font-weight: bold;
						}
						.info-time{
							margin-top: 10rpx;
							font-size: 0.8em;
							color: #ccc;
						}
						.infor-content{
							display: flex;
							margin-top:10rpx;
							.infor-content-text{
								font-size:0.9em;
								display: -webkit-box; /* 将容器以弹性盒子形式布局 */
								  -webkit-line-clamp: 3; /* 限制文本显示为两行 */
								  -webkit-box-orient: vertical; /* 将弹性盒子的主轴方向设置为垂直方向 */
								  overflow: hidden; /* 隐藏容器中超出部分的内容 */
								  text-overflow: ellipsis; /* 超出容器范围的文本显示省略号 */
								word-break:break-all;
							}
						}
					}
				}
			}
		}
	}
</style>
