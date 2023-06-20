<template>
    <view>
        <!--动态搜索结果展示页、将来在搜索页输入搜索条件、就会跳到该页面做展示-->
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t">
            <block slot="backText">
            </block>
            <view slot="content">ShareLife</view>
        </cu-custom>

        <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback"
                       @up="upCallback">
            <view v-for="(item,index) in homePublishInforList" :key="index" class="card" >
                <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt="" @click="toInformationDetail(item)"></image>
                <view class="card-text" @click="toInformationDetail(item)">{{item.textContent.substr(0, 35) }}</view>
                <view class="card-line">
                    <image class="card-avatar round" :src="item.avatar" mode="aspectFit" alt=""></image>
                    <view class="card-nickname" >{{item.nickname}}</view>
                    <view class="iconfont ml-1" style="color: #dd524d; margin-top: 8rpx">&#xe60b</view>
                    <view class="card-ipAddress">{{item.ipAddress}}</view>
                    <view class="iconfont ml-1" style="color: #dd524d; margin-top: 8rpx" @click="loveInfor(item.inforId,index)">&#xe617</view>
                    <view class="card-loveCount">{{item.loveCount}}</view>
                </view>
            </view>
        </mescroll-body>

    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import homeModal from './homeInforModal.vue'
    import configService from '@/common/service/config.service.js'

    export default {
        name: "homeSearchResultPage",
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
            HomeSignModal,
            homeModal
        },
        data() {
            return {
                activeTab: {},
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                inputValue: '',
                findHomePublishInforListUrl: '/inforcommon/queryInforList',
                fileUrl: configService.fileSaveURL,
                homePublishInforList: [],
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
            this.getHomePublishInforList();
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.inputValue = item;
            //console.log("输出item", item)
            console.log("this.inputValue", this.inputValue)
            //TODO 这里要 调用查询接口 参数就是传递过来的 然后拿到接口做数据展示 展示的样式跟首页一致
        },
        methods: {
            getHomePublishInforList() {
                this.$http.get(this.findHomePublishInforListUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        text:this.inputValue
                    }
                }).then(res => {
                    console.log("查看条数：",res.data.result.items);
                    if (res.data.success) {
                        this.homePublishInforList = res.data.result.items;
                        for (let d of this.homePublishInforList) {
                            let arr = d.medias.split(',')
                            let arr2 = []
                            for (let e of arr) {
                                e = this.fileUrl+e
                                arr2.push(e)
                            }
                            d.medias = arr2
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            toInformationDetail(item) {
                //console.log("进来了111", item)
                uni.navigateTo({
                    url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
                })
            },
        }
    };
</script>

<style lang="scss" scoped>

    .home-infor {
        background-color: $uni-bg-color-grey;
        margin-top: 100rpx; /*盒子距离顶部的距离*/
    }

    .home-sign {
        background-color: $uni-bg-color-grey;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 5rpx; /*盒子距离顶部的距离*/
        line-height: 60rpx; /*行高*/
    }

    .icon-search {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 240rpx;
    }

    .medias_size {
        max-width: 180px;
        width: 180px;
        width:expression(this.width > 180 ? "180px" : this.width);
        height: 180px;
        height:expression(this.height > 180 ? "180px" : this.height);
        overflow:hidden;
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        margin-bottom: 20rpx; /*盒子间的距离*/
    }


    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx;/*盒子间的距离*/
        margin-top: 10rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx;  /*行高*/

        .card-line {
            font-weight: bold;
            display: flex;
        }

        .card-nickname {
            font-weight: bold;
            margin-right: 80rpx;
            margin-left: 10rpx;
            margin-top: 8rpx;
        }

        .card-ipAddress {
            font-weight: bold;
            margin-right: 100rpx;
            margin-left: 10rpx;
            margin-top: 8rpx;
        }

        .card-loveCount {
            font-weight: bold;
            margin-left: 10rpx;
            margin-top: 8rpx;
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
            width: expression(this.width > 20 ? "20px" : this.width);
            height: 20px;
            height: expression(this.height > 20 ? "20px" : this.height);
        }

    }

</style>
