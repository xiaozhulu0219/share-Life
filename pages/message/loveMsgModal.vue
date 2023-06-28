<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText"></block>
            <block slot="right" style="margin-left: 2000rpx"> 获赞消息</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">
            <view v-for="(item,index) in announcement3" :key="index" class="card">

<!--                <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt=""-->
<!--                       @click="toInformationDetail(item)"></image>-->

                <view class="card-text" @click="toInformationDetail(item)">{{item.titile.substr(0, 35) }}</view>
                <view class="card-text" @click="toInformationDetail(item)">{{item.createTime.substr(0, 35) }}</view>
<!--                <view class="card-line">-->
<!--                    <image class="card-avatar round" :src="item.avatar" mode="aspectFit" alt="" @click="toMemberdetail(item.uuId)"></image>-->
<!--                    <view class="card-nickname">{{item.nickname.substr(0, 12)}}</view>-->
<!--                    <view class="iconfont ml-1" style="color: #dd524d; margin-top: 8rpx">&#xe60b</view>-->
<!--                    <view class="card-ipAddress">{{item.ipAddress}}</view>-->
<!--                    <view class="cuIcon-like" style="color: #fbbd08 ; margin-top: 8rpx" v-if="item.hasLoved == 0" @click="loveInfor(item.inforId,index)"></view>-->
<!--                    <view class="cuIcon-likefill" style="color: #dd524d ; margin-top: 8rpx" v-else="item.hasLoved == 1" @click="unloveInfor(item.inforId,index)"></view>-->
<!--                    <view class="card-loveCount">{{item.loveCount}}</view>-->
<!--                </view>-->
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
        name: 'loveMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {
                backRouteName: 'index',
                announcement3:[],
                fileUrl: configService.fileSaveURL,
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    findInforCommentsPageUrl: '/information/comments/list',
                    findSonCommentListPageUrl: '/information/comments/findSonCommentListById',
                    saveCommentUrl: '/information/comments/saveCommentForInfor',
                    likeCommentUrl: '/information/comments/like',
                    dislikeCommentUrl: '/information/comments/dislike',
                    likeSonCommentUrl: '/information/comments/like',
                    deleteCommentUrl: '/information/comments/deleteComment',
                    likeInforUrl: '/information/movements/like',
                    dislikeInforUrl: '/information/movements/dislike',
                    loveInforUrl: '/information/movements/love',
                    unloveInforUrl: '/information/movements/unlove',
                },
                FocusFansNumVo: {
                    avatar: '',
                    busType: '',
                    busId: '',
                    title: '',
                    msgCategory: '',
                    fromUser: '',
                    createTime: '',

                },
            };
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.announcement3 = item
            //console.log("输出item", item)
            this.loveMsg(this.announcement3); //这是传参后继续调用方法的示例
        },
        methods: {
            loveMsg(list){
                console.log("初始list数组", list)
                for (let d of list) {
                    this.$http.get(this.queryByUuIdUrl, {params: {uuId: d.uuId}}).then((res) => {
                        if (res.data.success) {
                            //将的的每一项给到 FocusFansNumVo 然后再 push 到一个新数组
                            this.FocusFansNumVo = d;



                            d.avatar = this.fileUrl + d.avatar



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


                    let arr = d.medias.split(',')
                    let arr2 = []
                    for (let e of arr) {
                        e = this.fileUrl + e
                        arr2.push(e)
                    }
                    d.avatar = this.fileUrl + d.avatar
                    d.medias = arr2
                }


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
