<template>
    <view>
        <!--消息页-->
        <cu-custom :bgColor="NavBarColor">
            <block slot="right"> ShareLife <view class="iconfont ml-1" style="color: #2C405A" @click="toSearch(activeTab.value)">&#xe600</view></block>
        </cu-custom>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";


    export default {
        name: 'message',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
        },
        data() {
            return {
                activeTab: {
                    label:"",
                    text:"",
                    title:"",
                    value:"",
                },
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                inputValue: '',
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
        methods: {
            getActiveTab(item) {
                this.activeTab = item;
                console.log("切换tab1",item.value)
                console.log("切换tab2",this.activeTab.value)
            },
            toSearch(item) {
                console.log("首页的activeTab.value进来了",item)
                uni.navigateTo({
                    url: '/pages/home/homeSearch?item=' + item
                })
            },
            handleStatus(status, type) {

            },
            goHome() {
                this.$Router.push({
                    name: 'index'
                });
            },
            model(item, index) {
                this.inputValue = item;
            },
            del(item, index) {
                this.searchHistoryList.splice(0, 1);
            },

            search(inputValue) {
                console.log("进来了",inputValue)
                if (this.inputValue == '') {
                    uni.showModal({
                        title: '搜索内容不能为空'
                    });
                } else {
                }
            },

            //清空历史记录
            empty() {
                uni.showToast({
                    title: '已清空'
                });
                uni.removeStorage({
                    key: 'searchList'
                });
                this.searchHistoryList = [];
            },
            async onLoad() {
                let list = await uni.getStorage({
                    key: 'searchList'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    // 搜索框
    .search {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100rpx;
        margin: 0;
        position: fixed;
    }

    .search-bar-box {
        display: flex;
        align-items: center;
        width: 60%;
        height: 70rpx;
        border: 5rpx solid #00a8cc;
        border-radius: 50rpx;
        margin-top: -20rpx;
    }

    .search-btn {
        width: 120rpx;
        height: 70rpx;
        background-color: #00a8cc;
        color: white;
        line-height: 70rpx;
        text-align: center;
        border-radius: 35rpx;
        letter-spacing: 3rpx;
    }

    .searchHistory {
        width: 100%;
        margin-top: 16rpx;

        .searchHistoryItem {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            view {
                /* width: 50px; */
                height: 20rpx;
                background: #f0f0f0;
                padding: 4rpx;
                margin: 6rpx 5rpx;
            }
        }
    }

    .home-infor {
        background-color: $uni-bg-color-grey;
        margin-top: 100rpx; /*盒子距离顶部的距离*/
    }
    .home-helpCompany {
        background-color: $uni-bg-color-grey;
        margin-top: 100rpx; /*盒子距离顶部的距离*/
    }

    .home-sign {
        background-color: $uni-bg-color-grey;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 5rpx; /*盒子距离顶部的距离*/
        line-height: 60rpx; /*行高*/
        height: 100%;
    }

    .icon-search {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 240rpx;
    }
</style>
