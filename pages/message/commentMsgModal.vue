<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText"></block>
            <block slot="right" style="margin-left: 2000rpx"> 评论消息</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">

            <view v-for="(item,index) in this.myCommentMsg" :key="index" class="card">
                <view class="detail-title">
                    <image class="card-avatar round sm" :src="item.avatar" mode="aspectFit" alt="" @click="toInformationDetail(item)"></image>
                </view>
                <view class="detail-content">
                    <view class="detail-info">
                        <view style="font-size: 40rpx; margin-top: 10rpx">{{item.nickName }}</view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.title }}  {{item.createTime }} </view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx">{{item.content }}</view>
                        <view style="margin-right: 10rpx; margin-top: 10rpx" v-if="item.pubType == 3">{{item.backContent }}</view>
                    </view>
                    <view class="comment-iconlikeCount"> <!-- 这块将来要根据 业务类型和业务id 去查询具体的东西  -->
                        <image class="card-medias" :src="item.medias" mode="aspectFit" alt="" @click="toInformationDetail(item.busId)"></image>
                    </view>
                </view>
            </view>
        </mescroll-body>
    </view>

</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import configService from '@/common/service/config.service.js'


    export default {
        name: 'commentMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {
                backRouteName: 'index',
                myCommentMsg:[],
                fileUrl: configService.fileSaveURL,
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    queryByUuIdUrl: '/sys/user/queryByUuId',
                    findCommentByIdUrl: '/information/comments/findCommentById',
                    getMyCommentMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyCommentMsgAnnouncementSend",
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
            this.getMyCommentMsgAnnouncementSend();

        },
        onLoad(option) {
            //const item = JSON.parse(decodeURIComponent(option.item));
            //this.announcement5 = item
            //console.log("输出item", item)
            //this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
            //this.commentMsg(this.announcement5); //这是传参后继续调用方法的示例
        },
        methods: {
            //获取我的评论消息
            getMyCommentMsgAnnouncementSend() {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.getMyCommentMsgAnnouncementSendUrl, {
                    params: {
                        page: 1,
                        pagesize: 10
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log("获取我的评论消息", res.data.result.records)
                        this.myCommentMsg = res.data.result.records;
                        for (let d of this.myCommentMsg) {
                            d.avatar = this.fileUrl + d.avatar
                            d.medias = this.fileUrl + d.medias
                        }
                        this.readCommentMsgAll();
                    }
                }).catch(err => {
                    console.log(err);
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
            commentMsg(list){
                //console.log("初始list数组", list)
                for (let d of list) {
                    d.avatar = this.fileUrl + d.avatar
                    d.medias = this.fileUrl + d.medias
                    //d.medias = arr2
                }
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

    /*.container{*/
    /*    background-color: #ffffff;*/
    /*}*/

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


</style>
