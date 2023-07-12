<template>
    <!--个人页的一些页面--我的助力-->
    <view class="list-wrap">
        <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">

            <view v-for="(item,index) in myHelpList" :key="index" class="card">
                <view class="card-title">{{item.companyName}}</view>
                <view v-for="(ite,inde) in item.commentVoList" :key="inde" class="">
                    <view class="card-location">{{ite.commentCreateDate}}</view>
                    <view class="card-text">{{ite.content}}</view>
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
        name: 'MyHelpCompanyList',
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                findMyPublishComPageUrl: '/company/findMyPublishComPage',
                myHelpList: [],
                fileUrl: configService.fileSaveURL,
            };
        },
        created() {
            console.log(9999);
            this.getMyHelpCompanyList();
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getMyHelpCompanyList();
            },
            getMyHelpCompanyList() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const { findMyPublishComPageUrl, pageInfo: { num, size } } = this;
                this.$http.get(findMyPublishComPageUrl, {
                    params: { page: num, pagesize: size }
                }).then(res => {
                    const { success, result } = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const { pages, items, page } = result;
                        if (num === 1) this.myHelpList = [];
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
                        this.myHelpList = this.myHelpList.concat(items);
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
