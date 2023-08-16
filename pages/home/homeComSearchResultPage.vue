<template>
    <view class="container">
        <!--助力搜索结果展示页、将来在搜索页输入搜索条件、就会跳到该页面做展示-->
        <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title"> ShareLife
            </block>
			<block slot="right" >
				<backToHome style="font-size:1.4em;"></backToHome>
			</block>
        </commonTab>
        <view class="card" :style="{marginTop:50+topSpace-5+'px'}">
            <view class="list-wrap">
                <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
                    <view v-for="(item,index) in homeSearchComList" :key="index" class="card"
                          @click="toSearchCompanyDetail(item)">
                        <view class="card-title">{{item.companyName.substr(0, 18)}}</view>
                        <view class="card-text">{{item.legalPerson}}</view>
                        <view class="card-text">{{item.registerTime.substr(0, 15)}}</view>
                        <view class="card-text">{{item.bussinessAddress}}</view>
                        <view class="card-text">{{item.companyStatus}}</view>
                        <view class="card-line">
                            <view class="card-text">{{item.registeredCapital}}</view>
                            <view class="card-icon">
                                <view class="iconfont ml-1"
                                      style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx"
                                      v-if="item.hotValue > 60">&#xe627
                                </view>
                                <view class="iconfont ml-1"
                                      style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx"
                                      v-else-if="item.hotValue > 20">&#xe60d
                                </view>
                                <view class="iconfont ml-1"
                                      style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-else>&#xe646
                                </view>
                            </view>
                            <view class="card-hotValue" v-show="item.hotValue > 0">{{item.hotValue}}</view>
                        </view>
                    </view>
                    <view v-if='isDownLoading' class="load-text">加载中....</view>
                    <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import homeModal from './homeInforModal.vue'
    import configService from '@/common/service/config.service.js'
    import commonTab from '../component/commonTab.vue';
	import backToHome from "@/pages/component/backToHome.vue"
    export default {
        name: "homeSearchResultPage",
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
            HomeSignModal,
            homeModal,
            commonTab,
			backToHome
        },
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                backRouteName: 'homeSearch',
                inputValue: '',
                findSearchComListUrl: '/comcommon/queryComList',
                homeSearchComList: [],
                fileUrl: configService.fileSaveURL,
                searchHistoryList: [{
                    locationName: '反而可能',
                    createTime: '2022-11-30 10:00:00',
                    createBy: '本金额看见你有限公司',
                    status: 1
                }, {
                    locationName: '人家',
                    createTime: '2022-11-30 10:00:00',
                    createBy: '诶接耳机有限公司',
                    status: 2
                }], //搜索出来的内容
                searchHistoryList2: [{
                    locationName: '就是一个普通首页',
                    createTime: '2022-12-12 10:00:00',
                    createBy: '预科金融有限公司',
                    status: 1
                }, {
                    locationName: '斗战',
                    createTime: '2022-12-12 10:00:00',
                    createBy: '之乎者也有限公司',
                    status: 2
                }], //搜索出来的内容(假数据)
            };
        },
        created() {
            //这是首页助力的模糊搜索接口
            this.getSearchComList();
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.inputValue = item;
            //console.log("输出item", item)
            console.log("拿到搜索页面的搜索内容", this.inputValue)
            //TODO 这里要 调用查询接口 参数就是传递过来的 然后拿到接口做数据展示 展示的样式跟首页一致
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getSearchComList();
            },
            //这是首页助力的模糊搜索接口
            getSearchComList() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const {findSearchComListUrl, pageInfo: {num, size}} = this;
                this.$http.get(findSearchComListUrl, {
                    params: {
                        page: num,
                        pagesize: size,
                        text: this.inputValue
                    }
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。',result, result.items);
                    if (success) {
                        const {pages, items, page} = result;
                        if (num === 1) this.homeSearchComList = [];
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
                        this.homeSearchComList = this.homeSearchComList.concat(items);
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
            //跳转到企业详情
            toSearchCompanyDetail(item) {
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
        height: calc(117vh - 280rpx);
    }

    .container{
        background-color: #ffffff;
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
