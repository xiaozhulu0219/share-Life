<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor">
            <!--            <block slot="content">ShareLife</block>-->
            <block slot="right" style="margin-left: 2000rpx"> 新增关注消息</block>

        </cu-custom>
        <view class="card">
            <view class="card-line">
<!--                <view class="card-loveMessage">-->
<!--                    <view class="cuIcon-like" style="font-size: 80rpx; color: #dd524d;" @click="loveMsgTotal()"></view>-->
<!--                    <view class="card-loveCount">赞和收藏</view>-->
<!--                </view>-->
<!--                <view class="card-focusMessage">-->
<!--                    <view class="cuIcon-people" style="font-size: 80rpx; color: #dd524d;" @click="focusMsgTotal()"></view>-->
<!--                    <view class="card-focusCount">新增关注</view>-->
<!--                </view>-->
<!--                <view class="card-commentMessage">-->
<!--                    <view class="cuIcon-message" style="font-size: 80rpx; color: #dd524d;" @click="commentMsgTotal()"></view>-->
<!--                    <view class="card-commentCount">评论和@</view>-->
<!--                </view>-->
            </view>

            <!--                <view v-for="(item,index) in inforCommentsList" :key="index" class="comment">-->
            <!--                    <view class="comment-parent">-->
            <!--                        <image class="comment-avatar round sm" :src="item.avatar" alt=""-->
            <!--                               @click="toMemberdetail(myFormData.uuId)"></image>-->
            <!--                        <view class="comment-nickcon">-->
            <!--                            <view class="comment-nickname">{{ item.nickname }}</view>-->
            <!--                            <view class="comment-content">{{ item.content }}</view>-->
            <!--                            <view class="comment-createDate">{{item.createDate}}</view>-->
            <!--                        </view>-->
            <!--                        <view class="comment-iconlikeCount">-->
            <!--                            <view class="iconfont ml-1" style="font-size: 30rpx; color: #fbbd08;;" v-if="item.hasLiked == 0" @click="likeComment(item.id)">&#xe8ad</view>-->
            <!--                            <view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;" v-else="item.hasLiked == 1" @click="dislikeComment(item.id)">&#xe60f</view>-->
            <!--                            <view class="comment-likeCount">{{item.likeCount}}</view>-->
            <!--                        </view>-->
            <!--                    </view>-->
            <!--                    <view class="iconfont ml-1" style="font-size: 40rpx;  margin-left: 200rpx"-->
            <!--                          @click="getSonCommentsList(item)">&#xe631-->
            <!--                    </view>-->
            <!--                </view>-->
        </view>
    </view>

</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";


    export default {
        name: 'focusMsgModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {},
        data() {
            return {};
        },
        methods: {}
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
