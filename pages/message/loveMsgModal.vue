<template>
    <!--消息页-->
    <view class="container">
        <!--        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">-->
        <!--            <block slot="backText"></block>-->
        <!--            <block slot="right" style="margin-left: 2000rpx"> 获赞消息</block>-->
        <!--        </cu-custom>-->
        <cu-custom :bgColor="NavBarColor" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">获赞消息</block>
        </cu-custom>

        <view class="list-wrap">
            <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
                <view v-for="(item,index) in this.myLoveMsg" :key="index" class="card">
                    <view class="detail-title">
                        <image class="card-avatar round sm" :src="item.avatar" mode="aspectFit" alt=""
                               @click="toInformationDetail(item)"></image>
                    </view>
                    <view class="detail-content">
                        <view class="detail-info">
                            <view style="font-size: 40rpx; margin-top: 10rpx">{{item.nickName }}</view>
                            <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }} {{item.createTime }}
                            </view>
                        </view>
                        <view class="comment-iconlikeCount"> <!-- 这块将来要根据 业务类型和业务id 去查询具体的东西  -->
                            <image class="card-medias" :src="item.medias" mode="aspectFit" alt=""
                                   @click="toInformationDetail(item.busId)"></image>
                        </view>
                    </view>
                </view>
                <view v-if='isDownLoading' class="load-text">加载中....</view>
                <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import configService from '@/common/service/config.service.js'

    export default {
        name: 'loveMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                backRouteName: 'index',
                myLoveMsg: [],
                fileUrl: configService.fileSaveURL,
                getMyLoveMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyLoveMsgAnnouncementSend",
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    queryByUuIdUrl: '/sys/user/queryByUuId',
                    findCommentByIdUrl: '/information/comments/findCommentById',
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
                const {getMyLoveMsgAnnouncementSendUrl, pageInfo: {num, size}} = this;
                this.$http.get(getMyLoveMsgAnnouncementSendUrl, {
                    params: {page: num, pagesize: size}
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。', result.records);
                    if (success) {
                        const {pages, records, current} = result;
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
            //根据inforId查询动态详情----  TODO 需要注意的是即使点赞的是评论，在赞里边跳转的也是 评论所在的动态，而不是评论本身
            findPublishInfor(inforId) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: inforId}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.myCommentForm = res.data.result;
                    }
                })
            },
            //根据uuId查询用户详情
            findPersonInfor(uuId) {
                console.log("进来了方法", uuId)
                this.$http.get(this.queryByUuIdUrl, {params: {uuId: uuId}}).then((res) => {
                    if (res.data.success) {
                        this.personalList = res.data.result;
                        //console.log("this.personalList.avatar", this.personalList.avatar);
                        //console.log("res.data.result.avatar", res.data.result.avatar);
                        console.log("查询个人信息返回的数据是：", res.data.result);
                        if (res.data.result.avatar === "") {
                            console.log("头像不存在")
                        } else {
                            console.log("有头像", res.data.result.avatar)
                        }
                    }
                })
            },
            //根据评论的id查询评论的内容
            findComment(item) {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.findCommentByIdUrl, {params: {id: item.id}}).then(res => {
                    if (res.data.success) {
                        //this.inforSonCommentsList = res.data.result;
                        //console.log("数据:",this.inforSonCommentsList);
                        //console.log("数据条数222:",this.inforSonCommentsList.length);
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
        height: calc(100vh - 280rpx);
    }
    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx; /*行高*/
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

    .card-medias {
        max-width: 55px;
        width: 55px;
        width: expression(this.width > 55 ? "55px" : this.width);
        height: 55px;
        height: expression(this.height > 55 ? "55px" : this.height);
        position: absolute;
        font-size: 20rpx;
        //margin-top: 1rpx;
        margin-right: 50rpx;
        //margin-left: 2rpx;
    }

    .detail {
        padding: 30rpx;
        border-bottom: #eee solid 1rpx;
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
        margin-right: 110rpx;
        //margin-left: 35rpx;
        //margin-top: 30rpx;
        display: flex;
        //justify-content: space-between;
    }

    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }
    .noMore {
        color: #ccc;
    }
</style>
