<template>
    <view>
        <!--首页引用的modal-->
        <!-- 这个modal 用户点击哪个标签 拿到value  作为参数 传到列表接口，然后拿回数据作展示  目前默认穿回来的数据字段都是一样的-->
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText">
            </block>
            <view slot="content">搜索</view>
        </cu-custom>

        <view class="search">
            <view class="search-bar-box">
                <text class="padding-left text-gray iconfont icon-search"></text>
                <input class="text-df flex-sub" v-model="inputValue" @confirm="search" placeholder="搜索内容" maxlength="10"
                       type="text"/>
                <button class="search-btn text-df" @click="search(inputValue)">搜索</button>
            </view>
        </view>

        <homeModal class="home-infor"></homeModal>
<!--        <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback"-->
<!--                       @up="upCallback">-->
<!--            <view v-for="(item,index) in homePublishInforList" :key="index" class="card"-->
<!--                  @click="toInformationDetail(item)">-->
<!--                <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt=""></image>-->
<!--                <view class="card-text">{{item.textContent.substr(0, 35) }}</view>-->
<!--                <view class="card-nickname">{{item.nickname}}-->
<!--                    <img class="card-icon" src="@/static/icon/ipAddress.png" mode="aspectFill">-->
<!--                    {{item.ipAddress}}-->
<!--                </view>-->
<!--            </view>-->
<!--        </mescroll-body>-->

    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import HomeHelpCompanyList from './homeHelpCompanyList.vue'
    import configService from '@/common/service/config.service.js'
    import homeModal from './homeModal.vue'

    export default {
        name: "homeSearch",
        // props: {
        //     formData: {
        //         type: Object,
        //         default: () => {
        //         },
        //         required: false
        //     }
        // },
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
            HomeSignModal,
            HomeHelpCompanyList,
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
        created() {
            this.getHomePublishComList();
            this.getHomePublishInforList();
            //console.log("进来了2222")
            //inputValue
        },
        methods: {
            getActiveTab(item) {
                this.activeTab = item;
                // this.mescroll.resetUpScroll()
            },
            handleStatus(status, type) {

            },
            //标签为"助力"时展示的特殊数据
            getHomePublishComList() {
                this.$http.get(this.findHomePublishComListUrl, {
                    params: {
                        page: 1,
                        pagesize: 100
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log(res.data.result);
                        this.homePublishComList = res.data.result.items;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //标签为"助力"之外的标签展示的数据--以后将考虑根据类型type来区分调用不同类型的接口，展示在不同标签的列表页
            getHomePublishInforList() {
                this.$http.get(this.findHomePublishInforListUrl, {
                    params: {
                        page: 1,
                        pagesize: 100
                    }
                }).then(res => {
                    if (res.data.success) {
                        this.homePublishInforList = res.data.result.items;
                        for (let d of this.homePublishInforList) {
                            let arr = d.medias.split(',')
                            let arr2 = []
                            for (let e of arr) {
                                e = this.fileUrl + e
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

    .home-infor {
        //background-color: #fff;
        background-color: $uni-bg-color-grey;
        //padding: 20rpx 20rpx;
        //border-radius: 20rpx;
        //margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 400rpx; /*盒子距离顶部的距离*/
        //line-height: 35rpx; /*行高*/
        //margin-bottom: 16px; /*内容和标题间的间距*/
    }

</style>
