<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor">
            <!--            <block slot="content">ShareLife</block>-->
            <block slot="right" style="margin-left: 2000rpx"> 消息</block>

        </cu-custom>
        <view class="card">
            <view class="card-line">
                <view class="card-loveMessage">
                    <view class="cuIcon-like" style="font-size: 80rpx; color: #dd524d;"
                          @click="loveMsgTotal(announcement3)"></view>
                    <view class="card-loveCount">赞和收藏</view>
<!--                    <view class="card-loveCount">{{this.announcement3}}</view>-->
                </view>
                <view class="card-focusMessage">
                    <view class="cuIcon-people" style="font-size: 80rpx; color: #dd524d;"
                          @click="focusMsgTotal(announcement4)"></view>
                    <view class="card-focusCount">新增关注</view>
                </view>
                <view class="card-commentMessage">
                    <view class="cuIcon-message" style="font-size: 80rpx; color: #dd524d;"
                          @click="commentMsgTotal(announcement5)"></view>
                    <view class="card-commentCount">评论和@</view>
                </view>
            </view>
        </view>
    </view>

</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";

    export default {
        name: 'message',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {
                url: {
                    listCementByUser: "/sys/annountCement/listByUser",
                    editCementSend: "/sys/sysAnnouncementSend/editByAnntIdAndUserId",
                    queryById: "/sys/annountCement/queryById",
                },
                hovered: false,
                announcement1: [],
                announcement2: [],
                announcement3: [],
                announcement4: [],
                announcement5: [],
                msg1Count: "0",
                msg2Count: "0",
                msg3Count: "0",
                msg4Count: "0",
                msg5Count: "0",
                msg1Title: "通知(0)",
                msg2Title: "",
                msg3Title: "",
                msg4Title: "",
                msg5Title: "",
            };
        },
        //这里会拿到所有消息数量、将来展示在index的消息图标上
        computed: {
            msgTotal() {
                return parseInt(this.msg1Count) + parseInt(this.msg2Count) + parseInt(this.msg3Count) + parseInt(this.msg4Count) + parseInt(this.msg5Count);
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            timerFun() {
                this.stopTimer = false;
                let myTimer = setInterval(() => {
                    // 停止定时器
                    if (this.stopTimer == true) {
                        clearInterval(myTimer);
                        return;
                    }
                    this.loadData()
                }, 6000)
            },
            loadData() {
                try {
                    // 获取系统消息
                    this.$http.get(this.url.listCementByUser).then((res) => {
                        console.log("进入了获取系统消息方法")
                        if (res.data.success) {
                            console.log("系统消息方法的表单数据", res);
                            this.announcement1 = res.data.result.anntMsgList;
                            this.msg1Count = res.data.result.anntMsgTotal;
                            this.msg1Title = "通知(" + res.data.result.anntMsgTotal + ")";
                            this.announcement2 = res.data.result.sysMsgList;
                            this.msg2Count = res.data.result.sysMsgTotal;
                            this.msg2Title = "系统消息(" + res.data.result.sysMsgTotal + ")";
                            this.announcement3 = res.data.result.loveMsgList;
                            this.msg3Count = res.data.result.loveMsgTotal;
                            this.msg3Title = "赞和收藏(" + res.data.result.loveMsgTotal + ")";
                            console.log("announcement3 的数据为",this.announcement3)
                            console.log("msg3ount 的数据为",this.msg3Count)
                            console.log("msg3Title 的数据为",this.msg3Title)
                            this.announcement4 = res.data.result.focusMsgList;
                            this.msg4Count = res.data.result.focusMsgTotal;
                            this.msg4Title = "新增关注(" + res.data.result.focusMsgTotal + ")";
                            this.announcement5 = res.data.result.commentMsgList;
                            this.msg5Count = res.data.result.commentMsgTotal;
                            this.msg5Title = "评论和@(" + res.data.result.commentMsgTotal + ")";
                        }
                    }).catch(error => {
                        console.log("系统消息通知异常", error);//这行打印permissionName is undefined
                        this.stopTimer = true;
                        console.log("清理timer");
                    });
                } catch (err) {
                    this.stopTimer = true;
                    console.log("通知异常", err);
                }
            },

            //点击"赞和收藏"
            loveMsgTotal(myFormData) {
                console.log("announcement3 的数据为",this.announcement3)
                console.log("进来了赞和收藏,拿到的是所有赞和收藏消息", myFormData)
                //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
                uni.navigateTo({
                    url: '/pages/message/loveMsgModal?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
            //点击"新增关注"
            focusMsgTotal(myFormData) {
                console.log("进来了666应该是uuid")
                //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
                uni.navigateTo({
                    url: '/pages/message/focusMsgModal?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
            //点击"评论和@"
            commentMsgTotal() {
                console.log("进来了666应该是uuid")
                //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
                uni.navigateTo({
                    url: '/pages/message/commentMsgModal'
                })
            },


        }
    };
</script>


<style lang="scss" scoped>

    .container{
        background-color: #ffffff;
    }

    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx; /*行高*/

        .card-line {
            font-weight: bold;
            display: flex;
            margin-bottom: 30rpx; /*盒子间的距离*/

            .card-loveMessage {
                font-weight: bold;
                display: inline-block;
                margin-bottom: 30rpx; /*盒子间的距离*/
                margin-left: 50rpx;

                .card-loveCount {
                    font-weight: bold;
                    //display: inline-block;
                    //margin-bottom: 30rpx; /*盒子间的距离*/
                    margin-left: -20rpx;
                    margin-top: 40rpx;
                }
            }

            .card-focusMessage {
                font-weight: bold;
                display: inline-block;
                margin-bottom: 30rpx; /*盒子间的距离*/
                margin-left: 160rpx;

                .card-focusCount {
                    font-weight: bold;
                    //display: inline-block;
                    //margin-bottom: 30rpx; /*盒子间的距离*/
                    margin-left: -20rpx;
                    margin-top: 40rpx;
                }
            }

            .card-commentMessage {
                font-weight: bold;
                display: inline-block;
                margin-bottom: 30rpx; /*盒子间的距离*/
                margin-left: 160rpx;


                .card-commentCount {
                    font-weight: bold;
                    //display: inline-block;
                    //margin-bottom: 30rpx; /*盒子间的距离*/
                    margin-left: -20rpx;
                    margin-top: 40rpx;
                }
            }
        }
    }


</style>
