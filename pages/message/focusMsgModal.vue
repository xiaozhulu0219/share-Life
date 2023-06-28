<template>

    <!--消息页-->
    <view class="container">
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="right" style="margin-left: 2000rpx"> 新增关注消息</block>
        </cu-custom>
        <view class="card">
            <a-list>
                <a-list-item :key="index" v-for="(record, index) in this.announcement4">
                    <div style="margin-left: 5%;width: 80%">
                        <p><a @click="showAnnouncement(record)">{{ record.titile }}</a></p>
                        <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 发布</p>
                    </div>
                    <div style="text-align: right">
                        <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般消息</a-tag>
                        <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要消息</a-tag>
                        <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">紧急消息</a-tag>
                    </div>
                </a-list-item>
                <div style="margin-top: 5px;text-align: center">
                    <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
                </div>
            </a-list>
            </view>
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
            return {
                backRouteName: 'index',
                announcement4:[],
            };
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.announcement4 = item
            //console.log("输出item", item)
            //this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
        },
        methods: {

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
