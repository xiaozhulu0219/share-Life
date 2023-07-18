<template>
    <view class="list-wrap">
        <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">

            <view v-for="(item,index) in homeComList" :key="index" class="card"
                  @click="toHomeHelpCompanyDetail(item)">
                <view class="card-title">{{item.companyName.substr(0, 18)}}</view>
                <view class="card-text">{{item.legalPerson}}</view>
                <view class="card-text">{{item.registerTime.substr(0, 15)}}</view>
                <view class="card-text">{{item.bussinessAddress}}</view>
                <view class="card-text">{{item.companyStatus}}</view>
                <view class="card-line">
                    <view class="card-text">{{item.registeredCapital}}</view>
                    <view class="card-icon">
                        <view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-if="item.hotValue > 60">&#xe627</view>
                        <view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-else-if="item.hotValue > 20">&#xe60d</view>
                        <view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-else>&#xe646</view>
                    </view>
                    <view class="card-hotValue" v-show="item.hotValue > 0">{{item.hotValue}}</view>
                </view>
            </view>
            <view v-if='isDownLoading' class="load-text">加载中....</view>
            <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
        </scroll-view>
    </view>
</template>

<script>
    import configService from '@/common/service/config.service.js';

    export default {
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 20
                },
                hasNext: true,
                isDownLoading: false,
                comListUrl: '/company/findHomeComList',
                homeComList: [],
                fileUrl: configService.fileSaveURL,
            };
        },
        created() {
            console.log(9999);
            this.getHomeComList();
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getHomeComList();
            },
            getHomeComList() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const { comListUrl, pageInfo: { num, size } } = this;
                this.$http.get(comListUrl, {
                    params: { page: num, pagesize: size }
                }).then(res => {
                    const { success, result } = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const { pages, items, page } = result;
                        if (num === 1) this.homeComList = [];
                        if (items.length) {
                            for (const d of items) {
                                d.companyName = "公司名称：" + d.companyName
                                d.legalPerson = "法人：" + d.legalPerson
                                d.registerTime = "注册时间：" + d.registerTime
                                d.registeredCapital = "注册资金：" + d.registeredCapital
                                d.companyStatus = "经营状态：" + d.companyStatus
                                d.bussinessAddress = "经营地：" + d.bussinessAddress
                                d.organizationCode = "组织编码：" + d.organizationCode
                            }
                        }
                        this.homeComList = this.homeComList.concat(items);
                        this.hasNext = pages > page;
                        this.isDownLoading = false;
                    } else {
                        this.isDownLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.isDownLoading = false;
                });
            },
            toHomeHelpCompanyDetail(item) {
                //console.log("进来了111", item)
                uni.navigateTo({
                    url: '/pages/home/homeHelpCompanyDetail?item=' + encodeURIComponent(JSON.stringify(item))
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
        background-color:  $uni-bg-color-grey;
        border-radius: 20rpx;
        margin-bottom: 10rpx;/*盒子间的距离*/
        margin-top: 25rpx; /*盒子距离顶部的距离*/
        line-height: 65rpx;  /*行高*/
        margin-left: 20rpx;
        border-bottom: #eee solid 5rpx;

        .card-title {
            font-weight: bold;
            font-size: 38rpx;
        }

        .card-line {
            display: flex;
        }

        .card-text {
            font-size: 32rpx;
        }

        .card-icon {
            position: absolute;
            right: 120rpx;
            font-size: 20rpx;
        }

        .card-hotValue {
            position: absolute;
            font-weight: bold;
            right: 35rpx;
            margin-top: 8rpx;
        }

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
