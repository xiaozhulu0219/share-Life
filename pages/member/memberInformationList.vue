<template>
    <view>
        <!--标题和返回-->
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

        <view>
            <view class="search-tab">
                <view class="tab-title flex justify-center">
                    <view class="padding-sm" v-for="(item, index) in tabs" :key="index" @tap="clickTab(index)">
                        <text :class="activeTab === index ? 'active' : ''">{{ item.name }}</text>
                    </view>
                </view>
            </view>
            <block v-for="(item, idx) in tabs" :key="idx">
                <view v-if="idx === activeTab">
                    <view class="search-list" v-if="item.id === 2">
                        <view class="list-item bg-white padding" v-for="(item, index) in searchHistoryList"
                              :key="index">
                            <view class="flex justify-between align-center">
                                <text class="text-blue">{{ item.nickName }}</text>
                                <text class="text-xs text-gray">{{ item.createTime }}</text>
                            </view>
                            <view class="padding-top padding-bottom text-black">
                                {{ item.createBy }}
                            </view>
                            <view class="text-gray">
                                <text class="margin-right iconfont"
                                      :class="item.status === 1 ? 'icon-like-fill' : 'icon-like'"
                                      @tap="handleStatus(item.status,'like')"></text>
                                <text class="iconfont" :class="item.status === 2 ? 'icon-unlike-fill' : 'icon-unlike'"
                                      @tap="handleStatus(item.status,'unlike')"></text>
                            </view>
                        </view>
                    </view>
                </view>
            </block>
            <block v-for="(item, idx) in tabs" :key="idx">
                <view v-if="idx === activeTab">
                    <view class="search-list" v-if="item.id === 1">
                        <view class="list-item bg-white padding" v-for="(item, index) in searchHistoryList2"
                              :key="index">
                            <view class="flex justify-between align-center">
                                <text class="text-blue">{{ item.nickName }}</text>
                                <text class="text-xs text-gray">{{ item.createTime }}</text>
                            </view>
                            <view class="padding-top padding-bottom text-black">
                                {{ item.createBy }}
                            </view>
                            <view class="text-gray">
                                <text class="margin-right iconfont"
                                      :class="item.status === 1 ? 'icon-like-fill' : 'icon-like'"
                                      @tap="handleStatus(item.status,'like')"></text>
                                <text class="iconfont" :class="item.status === 2 ? 'icon-unlike-fill' : 'icon-unlike'"
                                      @tap="handleStatus(item.status,'unlike')"></text>
                            </view>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';

    export default {
        mixins: [MescrollMixin, Mixin],
        data() {
            return {
                activeTab: 0,
                tabs: [{id: 1, name: '推荐'}, {id: 2, name: '助力'}, {id: 3, name: '百科'}, {id: 4, name: '游戏'}],
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                url: '/umsMember/list',
                inputValue: '',
                searchHistoryList: [{
                    nickName: '反而可能',
                    createTime: '2022-11-30 10:00:00',
                    createBy: '本金额看见你有限公司',
                    status: 1
                }, {nickName: '人家', createTime: '2022-11-30 10:00:00', createBy: '诶接耳机有限公司', status: 2}], //搜索出来的内容
                searchHistoryList2: [{
                    nickName: '就是一个普通首页',
                    createTime: '2022-12-12 10:00:00',
                    createBy: '预科金融有限公司',
                    status: 1
                }, {nickName: '斗战', createTime: '2022-12-12 10:00:00', createBy: '之乎者也有限公司', status: 2}] //搜索出来的内容
            };
        },
        methods: {
            clickTab(index) {
                if (this.activeTab === index) return;
                this.activeTab = index;
            },
            handleStatus(status, type) {

            },
            goHome() {
                this.$Router.push({
                    name: 'index'
                });
            },
            /*	search() {
                        //表单项内容发生改变-- - 助力详情页
                        uni.request({
                            url: "company/movements/findPagePublishByRecommend",
                            success(res) {
                                console.log(res)
                            }
                        })



                    },*/
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

                console.log(list[1].data);

                if (list[1].data) {
                    this.searchHistoryList = JSON.parse(list[1].data);
                }
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
        height: 100 rpx;
        margin: 3% 0;
    }

    .search-bar-box {
        display: flex;
        align-items: center;
        width: 620 rpx;
        height: 70 rpx;
        border: 5 rpx solid #00a8cc;
        border-radius: 50 rpx;
    }

    .search-btn {
        width: 120 rpx;
        height: 70 rpx;
        background-color: #00a8cc;
        color: white;
        line-height: 70 rpx;
        text-align: center;
        border-radius: 35 rpx;
        letter-spacing: 3 rpx;
    }

    .searchHistory {
        width: 100%;
        margin-top: 16 rpx;

        .searchHistoryItem {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            view {
                /* width: 50px; */
                height: 20 rpx;
                background: #f0f0f0;
                padding: 4 rpx;
                margin: 6 rpx 5 rpx;
            }
        }
    }

    .main_classify {
        background: white;

        .main_under_classify {
            .li {
                height: 124 rpx;
                border-bottom: 2 rpx #999999 solid;
                padding: 20 rpx 28 rpx;
                display: flex;
                justify-content: space-between;
                margin-top: 20 rpx;

                image {
                    width: 116 rpx;
                    height: 110 rpx;
                    border-radius: 50%;
                    margin-right: 20 rpx;
                    margin-top: 6 rpx;
                }

                .li_content {
                    width: 254 rpx;

                    .title {
                        display: block;
                        font-weight: 800;
                        font-size: 28 rpx;
                    }

                    text {
                        line-height: 40 rpx;
                    }

                    .zhiwei {
                        color: #666666;
                    }

                    .heng {
                        color: #999999;
                    }
                }

                .li_end {
                    padding: 0 rpx 40 rpx;
                    width: 140 rpx;
                    height: 52 rpx;
                    border: 1 rpx solid red;
                    border-radius: 50 rpx;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 36 rpx;

                    .jia {
                        width: 24 rpx;
                        height: 24 rpx;
                        margin-top: 16 rpx;
                    }

                    .erji {
                        width: 42 rpx;
                        height: 42 rpx;
                    }
                }
            }
        }
    }

    .tab-title {
        color: #666;
    }

    .tab-title text.active {
        color: #000;
        font-weight: bold;
    }

    .list-item {
        margin: 20 rpx auto;
        width: 95%;
        border-radius: 20 rpx;
    }
</style>
