<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText"></block>
            <block slot="right" style="margin-left: 2000rpx"> 新增关注消息</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">

            <view v-for="(item,index) in this.myFocusMsg" :key="index" class="card">
                <view class="detail-title">
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
        name: 'focusMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {
                backRouteName: 'index',
                myFocusMsg:[],
                fileUrl: configService.fileSaveURL,
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    queryByUuIdUrl: '/sys/user/queryByUuId',
                    findCommentByIdUrl: '/information/comments/findCommentById',
                    userFocusUrl: '/information/followuser/userFocus',
                    userUnFocusUrl: '/information/followuser/userUnFocus',
                    FocusORFansUrl: '/information/followuser/FocusORFans',
                    getMyFocusMsgAnnouncementSendUrl: "/sys/sysAnnouncementSend/getMyFocusMsgAnnouncementSend",
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
            this.getMyFocusMsgAnnouncementSend();
            this.readFocusMsgAll();
        },
        onLoad(option) {
            //const item = JSON.parse(decodeURIComponent(option.item));
            //this.announcement4 = item
            //console.log("输出item", item)
            //this.focusMsg(this.announcement4); //这是传参后继续调用方法的示例
        },
        methods: {
            //获取我的新增关注消息
            getMyFocusMsgAnnouncementSend() {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.getMyFocusMsgAnnouncementSendUrl, {
                    params: {
                        page: 1,
                        pagesize: 10
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log("获取我的新增关注消息", res.data.result.records)
                        this.myFocusMsg = res.data.result.records;
                        for (let d of this.myFocusMsg) {
                            d.avatar = this.fileUrl + d.avatar
                        }
                    }
                }).catch(err => {
                    console.log(err);
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
                // if(this.uuId == myFormData){
                //     uni.navigateTo({
                //         url: '/pages/member/member'
                //     })
                // }else{
                    uni.navigateTo({
                        url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                    })
               // }
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

                        //初始化判断这个页面是不是自己的  是自己的就把“关注”按钮去掉
                        // if (this.uuId === uuId) {
                        //     this.iffocus = "4"
                        // }
                        console.log("两个用户的关注关系是：", this.iffocus);
                    }
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
