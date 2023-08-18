<template>

    <!--消息页-->
    <view class="container">
        <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title">
                新增关注消息
            </block>
        </commonTab>
        <view class="list-wrap" :style="{marginTop:50+topSpace-5+'px'}">
            <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
            <view v-for="(item,index) in this.myFocusMsg" :key="index" class="card">
				<view class="myLoveMsg-item-wrap">
					<view class="item-left-left">
						<image class="card-avatar-img " :src="item.avatar" mode="aspectFill" alt=""
							@click="toMemberdetail(item.uuId)"></image>
					</view>
					<view class="item-left-right">
						<view class="item-left-right-top">{{item.nickName }}</view>
						<view class="item-left-right-bottom">
							<text class="cuIcon-titles" style="color: #ddd;">
								
							</text>
						{{item.title }}  <text class="inner-text"> {{item.createTime }}</text>
						</view>
					</view>
				</view>
                <!-- <view class="detail-title">
                    <image class="card-avatar round sm" :src="item.avatar" mode="aspectFit" alt="" @click="toMemberdetail(item.uuId)"></image>
                </view>
                <view class="detail-content">
                    <view class="detail-info">
                        <view style="font-size: 40rpx; margin-top: 10rpx">{{item.nickName }}</view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }}  {{item.createTime }} </view>
                    </view>
                    <view>
                        <button class="edit text-sm" @click="focusUser(item.uuId)" v-if="item.iffocus == 0">
                            关注
                        </button>
                        <button class="edit text-sm" @click="unFocusUser(item.uuId)" v-else-if="item.iffocus == 1">
                            取消关注
                        </button>
                        <button class="edit text-sm" @click="focusUser(item.uuId)" v-else-if="item.iffocus == 2">
                            回关
                        </button>
                        <button class="edit text-sm" @click="unFocusUser(item.uuId)" v-else-if="item.iffocus == 3">
                            互相关注
                        </button>
                    </view>
                </view> -->
            </view>
                <view v-if='isDownLoading' class="load-text">加载中....</view>
                <view v-if="!isDownLoading && !hasNext" class="noMore">---多多互动，才会收获更多的关注呦---</view>
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
        name: 'focusMsgModal',
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
                myFocusMsg:[],
                fileUrl: configService.fileSaveURL,
                getMyFocusMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyFocusMsgAnnouncementSend",
                url: {
                    queryByUuIdUrl: '/sys/user/queryByUuId',
                    userFocusUrl: '/information/followuser/userFocus',
                    userUnFocusUrl: '/information/followuser/userUnFocus',
                    FocusORFansUrl: '/information/followuser/FocusORFans',
                    readFocusMsgAllUrl: "/sys/sysAnnouncementSend/readFocusMsgAll",
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
            this.getMyFocusMsgAnnouncementSend();
            //一键已读所有未读的消息
            this.readFocusMsgAll();
        },
        onLoad(option) {
            //const item = JSON.parse(decodeURIComponent(option.item));
            //this.announcement4 = item
            //this.focusMsg(this.announcement4); //这是传参后继续调用方法的示例
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getMyFocusMsgAnnouncementSend();
            },
            //获取我的新增关注消息
            getMyFocusMsgAnnouncementSend() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const {getMyFocusMsgAnnouncementSendUrl, pageInfo: {num, size}} = this;
                this.$http.get(getMyFocusMsgAnnouncementSendUrl, {
                    params: {page: num, pagesize: size}
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。', result.records);
                    if (success) {
                        const {pages, records, current} = result;
                        if (num === 1) this.myFocusMsg = [];
                        if (records.length) {
                            for (const d of records) {
                                d.avatar = this.fileUrl + d.avatar
                            }
                        }
                        this.myFocusMsg = this.myFocusMsg.concat(records);
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
            //一键已读新增关注消息
            readFocusMsgAll() {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.readFocusMsgAllUrl).then(res => {
                    if (res.data.success) {
                        console.log("新增关注消息已经被一键已读")
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击头像跳转用户详情
            toMemberdetail(myFormData) {
                console.log("进来了666应该是uuid", myFormData)
                    uni.navigateTo({
                        url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                    })
            },
            //点击关注按钮、关注用户
            focusUser(item) {
                console.log("点击了关注方法：", item);
                this.$http.get(this.userFocusUrl, {
                    params: {
                        uuId: item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = false;
                        console.log("关注方法返回的提示信息为：", res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        this.getFocusORFans(item);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击取消关注按钮、不再关注用户
            unFocusUser(item) {
                console.log("点击了取消关注方法：", item);
                this.$http.get(this.userUnFocusUrl, {
                    params: {
                        uuId: item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = true;
                        console.log("取消关注方法返回的提示信息为：", res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        this.getFocusORFans(item);

                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //判断两个用户的关注关系
            getFocusORFans(uuId) {
                console.log("进来了方法", uuId)
                this.$http.get(this.FocusORFansUrl, {params: {uuId: uuId}}).then((res) => {
                    if (res.data.success) {
                        //console.log("两个用户的关注关系是：", res.data.result);
                        this.announcement4 = res.data.result;
                        console.log("两个用户的关注关系是：", this.iffocus);
                    }
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
        // line-height: 85rpx; /*行高*/
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
        //margin-right: 50rpx;
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
.myLoveMsg-item-wrap{
		display: flex;
		width:100%;
		box-sizing: border-box;
		padding:20rpx 20rpx;
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
		width: 15% ;
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
				margin-bottom:15rpx;
				
			}
			.item-left-right-bottom{
				margin-bottom:30rpx;
				color:#bbb
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
