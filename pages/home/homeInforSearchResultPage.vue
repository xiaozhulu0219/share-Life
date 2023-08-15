<template>
    <view>
        <!--动态搜索结果展示页、将来在搜索页输入搜索条件、就会跳到该页面做展示-->
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
                    <view v-for="(item,index) in homeSearchInforList" :key="index" class="card">
                        <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt=""
                               @click="toInformationDetail(item)"></image>
                        <view class="card-text" @click="toInformationDetail(item)">{{item.textContent.substr(0, 35) }}
                        </view>
                        <view class="card-line">
                            <image class="card-avatar round" :src="item.avatar" mode="aspectFit" alt=""></image>
                            <view class="card-nickname">{{item.nickname}}</view>
                            <view class="iconfont ml-1" style="color: #dd524d; margin-top: 8rpx">&#xe60b</view>
                            <view class="card-ipAddress">{{item.ipAddress}}</view>
                            <view class="iconfont ml-1" style="color: #dd524d; margin-top: 8rpx"
                                  @click="loveInfor(item.inforId,index)">&#xe617
                            </view>
                            <view class="card-loveCount">{{item.loveCount}}</view>
                        </view>
                    </view>
                    <view v-if='isDownLoading' class="load-text">加载中....</view>
                    <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多动态了，快去分享你的美好生活吧---</view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
   // import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
   // import Mixin from '@/common/mixin/Mixin.js';
  //  import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import homeModal from './homeInforModal.vue'
    import configService from '@/common/service/config.service.js'
    import commonTab from "../component/commonTab";
	import backToHome from "@/pages/component/backToHome.vue"
    export default {
        name: "homeSearchResultPage",
        mixins: [],
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
                findSearchInforListUrl: '/inforcommon/queryInforList',
                homeSearchInforList: [],
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
            //这是首页动态的模糊搜索接口
            this.getSearchInforList();
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.inputValue = item;
            console.log("拿到搜索页面的搜索内容", this.inputValue)
            //TODO 这里要 调用查询接口 参数就是传递过来的 然后拿到接口做数据展示 展示的样式跟首页一致
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getSearchInforList();
            },
            //这是首页动态的模糊搜索接口
            getSearchInforList() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const {findSearchInforListUrl, pageInfo: {num, size}} = this;
                this.$http.get(findSearchInforListUrl, {
                    params: {
                        page: num, pagesize: size,
                        text: this.inputValue
                    }
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const {pages, items, page} = result;
                        if (num === 1) this.homeSearchInforList = [];
                        if (items.length) {
                            for (const d of items) {
                                const arr = d?.medias?.split(',');
                                const arr2 = [];
                                for (let e of arr) {
                                    e = this.fileUrl + e;
                                    arr2.push(e);
                                }
                                d.avatar = this.fileUrl + d.avatar;
                                d.medias = arr2;
                            }
                        }
                        this.homeSearchInforList = this.homeSearchInforList.concat(items);
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
            //跳转到动态详情
            toInformationDetail(item) {
                console.log("查询详情", item)
                uni.navigateTo({
                    url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
                })
            },
        }
    };
</script>

<style lang="scss" scoped>

    .list-wrap {
        height: calc(117vh - 280rpx);
    }
    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
		
        border-radius: 20rpx;
        line-height: 35rpx;  /*行高*/
        border-bottom: #eee solid 5rpx;

        .card-line {
            font-weight: bold;
            display: flex;
        }

        .card-nickname {
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 80%;
            overflow: hidden;
        }

        .card-ipAddress, .card-loveCount {
            font-weight: bold;
            margin-left: 8rpx;
        }
        .card-ipAddress {
            margin-right: 50rpx;
        }
        .card-loveCount {
            font-weight: bold;
            margin-left: 8rpx;
        }

        .card-text {
            font-size: 36rpx;
            margin-bottom: 10rpx; /*盒子间的距离*/
            line-height: 55rpx;  /*行高*/
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }

        .card-avatar {
            max-width: 20px;
            width: 20px;
            height: 20px;
        }

    }
    .medias_size {
        max-width: 180px;
        width: 180px;
        height: 180px;
        overflow:hidden;
        margin-bottom: 20rpx; /*盒子间的距离*/
    }

    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }

    .noMore {
        color: #ccc;
    }
    .left,.right {
        display: flex;
        align-items: center;
        //flex: 1;
    }
    .left {
        overflow: hidden;
        flex: 3;
    }
    .right{
        flex-shrink: 0;
        flex: 2;
    }
</style>
