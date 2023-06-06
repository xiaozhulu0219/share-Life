<template>
    <view>
        <!--首页-->
        <!--关于首页的规划，首页将来还是做框架、HomeSignModal从后台拿回多少个标签 home就插多少个modal
        至于modal的命名无所谓， 比如第一个modal是心理方面的 在返回的标签中 心理是1 那就将1作为参数获取列表
        所有标签页获取数据公用一个接口，根据传的标签值（类型）后台返回不同的领域的数据
        -->
        <cu-custom :bgColor="NavBarColor">
            <block slot="content">首页</block>
        </cu-custom>

        <!-- 搜索框 -->
        <view class="search">
            <view class="search-bar-box">
                <!-- <image class="search-span" src="../../static/images/search.png" /> -->
                <!-- @confirm="search" 点击 -->
                <text class="padding-left text-gray iconfont icon-search"></text>
                <input class="text-df flex-sub" v-model="inputValue" @confirm="search" placeholder="搜索内容" maxlength="10"
                       type="text"/>
                <button class="search-btn text-df">搜索</button>
            </view>
        </view>
        <HomeSignModal :getActiveTab="getActiveTab"></HomeSignModal>

        <homeModal ></homeModal>

    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import homeModal from './homeModal.vue'

    export default {
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
        // created() {
        //     this.getHomePublishComList();
        //     this.getHomePublishInforList();
        // },
        methods: {
            getActiveTab(item) {
                this.activeTab = item;
                // this.mescroll.resetUpScroll()
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
            search() {
                if (this.inputValue == '') {
                    uni.showModal({
                        title: '搜索内容不能为空'
                    });
                } else {
                    if (!this.searchHistoryList.includes(this.inputValue)) {
                        this.searchHistoryList.unshift(this.inputValue);
                        uni.setStorage({
                            key: 'searchList',
                            data: JSON.stringify(this.searchHistoryList)
                        });
                    } else {
                        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
                        let i = this.searchHistoryList.indexOf(this.inputValue);
                        this.searchHistoryList.splice(i, 1);
                        this.searchHistoryList.unshift(this.inputValue);
                        uni.showToast({
                            title: '不能重复添加'
                        });
                        uni.setStorage({
                            key: 'searchList',
                            data: JSON.stringify(this.searchHistoryList)
                        });
                    }
                }
                this.inputValue = '';
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
               // console.log(list[1].data);
                // if (list[1].data) {
                //     this.searchHistoryList = JSON.parse(list[1].data);
                // }
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
</style>
