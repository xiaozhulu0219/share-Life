<template>
    <!--个人页的一些页面--（我的助力)分页查询-->
    <scroll-view scroll-y class="page">
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">我的关注</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">
            <view v-for="item in myFocusList" :key="index" class="card">
                <image class="fans-avatar round sm" :src="fileUrl+item.avatar" alt="" @click="toMemberdetail(item.uuId)"></image>
                <view class="card-info">
                    <view class="card-nickname">{{item.nickname}}</view>
                    <view class="card-signature">{{item.signature}}</view>
                    <view class="card-createDate">{{item.createDate}}</view>
                </view>
            </view>
        </mescroll-body>
    </scroll-view>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import Mixin from "@/common/mixin/Mixin.js";
    import configService from '@/common/service/config.service.js'

    export default {
        name: 'focusModal',
        mixins: [MescrollMixin, Mixin],
        data() {
            return {
                findMyFocusPageUrl: '/information/followuser/findMyFocusPage',
                myFocusList: [],
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
            this.getMyFocusList();
        },
        methods: {
            getMyFocusList() {
                this.$http.get(this.findMyFocusPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log(res.data.result);
                        this.myFocusList = res.data.result.items;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击头像跳转用户详情
            toMemberdetail(myFormData) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
        }
    }
</script>

<style lang='scss'>
    .card {
        padding: 30rpx;
        border-bottom: #eee solid 1rpx;
        background-color: $uni-bg-color-grey;
        //padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        display: flex;
    }

    .card-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 150rpx;
    }

    .card-createDate {
        //font-weight: bold;
        font-size: 20rpx;
        //right: 20rpx;
        //margin-left: 550rpx;
    }

    .card-nickname {
        font-weight: bold;
        //position: absolute;
        //right: 20rpx;
        font-size: 35rpx;
        //margin-left: 100rpx;
    }
    .card-signature {
        //font-weight: bold;
        //position: absolute;
        //right: 20rpx;
        font-size: 28rpx;
        //margin-left: 100rpx;
    }
    .fans-avatar {
        max-width: 50px;
        width: 50px;
        width: expression(this.width > 50 ? "50px" : this.width);
        height: 50px;
        height: expression(this.height > 50 ? "50px" : this.height);
        position: absolute;
        font-size: 20rpx;
        //margin-top: 5rpx;
        //margin-right: 10rpx;
        margin-left: 20rpx;
    }


</style>
