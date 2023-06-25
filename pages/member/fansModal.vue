<template>
    <!--个人页的一些页面--（我的助力)分页查询-->
    <scroll-view scroll-y class="page">
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <block slot="backText">返回</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption"
                       @down="downCallback" @up="upCallback">
            <view v-for="(item,index) in myFansList" :key="index" class="card">
                <image class="comment-avatar round sm" :src="fileUrl+item.avatar" alt=""
                       @click="toMemberdetail(item)"></image>
                <view class="card-location">{{item.nickname}}</view>
                <view class="card-title">{{item.createDate}}</view>
            </view>
        </mescroll-body>
    </scroll-view>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import Mixin from "@/common/mixin/Mixin.js";
    import configService from '@/common/service/config.service.js'

    export default {
        name: 'fansModal',
        mixins: [MescrollMixin, Mixin],
        data() {
            return {
                findMyFansPageUrl: '/information/followuser/findMyFansPage',
                myFansList: [],
                fileUrl: configService.fileSaveURL,
                upOption: {
                    auto: false, // 不自动加载
                    page: {
                        num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                        size: 6 // 每页数据的数量
                    },
                    // noMoreSize: 6, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        tip: '~ 空空如也 ~', // 提示
                        btnText: '去看看'
                    }
                },
            };
        },
        created() {
            this.getMyFansList();
        },
        methods: {
            getMyFansList() {
                this.$http.get(this.findMyFansPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log(res.data.result);
                        this.myFansList = res.data.result.items;
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>

<style lang='scss'>
    .card {
        background-color: $uni-bg-color-grey;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;

        .card-title {
            font-weight: bold;
        }

        .card-text {
            font-size: 20rpx;
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }
        .comment-avatar {
            max-width: 25px;
            width: 25px;
            width: expression(this.width > 25 ? "25px" : this.width);
            height: 25px;
            height: expression(this.height > 25 ? "25px" : this.height);
            position: absolute;
            left: 20rpx;
            font-size: 20rpx;
            margin-top: 15rpx;
        }
    }
</style>
