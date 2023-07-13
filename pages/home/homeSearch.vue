<template>
    <view>
        <!--首页引用的modal-->
        <!-- 这个modal 用户点击哪个标签 拿到value  作为参数 传到列表接口，然后拿回数据作展示  目前默认穿回来的数据字段都是一样的-->
        <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title"> 搜索
            </block>
        </commonTab>
        <form class="search">
            <!-- <view class="uni-form-item uni-column"> -->
                <text class=" text-gray iconfont icon-search"></text>
                <input class="uni-input" v-model="inputValue" maxlength="100" placeholder="请输入搜索内容"/>
                <button form-type="submit" @click="searchList(inputValue)">搜索</button>
            <!-- </view> -->
        </form>

        <view v-for="(item,index) in 5" :key="index" class="detail">
            <view class="detail-content">
                这个搜索页以后看看做一些什么样的数据展示、
                可以是自己的搜索记录、热搜、红黑榜等等，
                如果是动态进来的展示一些点赞多的动态， 如果是助力进来的展示热门公司以及红黑榜
            </view>
        </view>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import commonTab from '../component/commonTab.vue';

    export default {
        name: "homeSearch",
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {commonTab},
        data() {
            return {
                activeTab: {},
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                inputValue: '',
                backRouteName: 'index',
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
            //this.getHomePublishInforList();
        },
        onLoad(option) {
            console.log("params过来了", option)
            //const item = JSON.parse(decodeURIComponent(option.item));
        },
        methods: {
            //搜索点击接口
            searchList(inputValue) {
                //拿到值传递给查询列表的接口，然后查询结果出来以后，跳转到对应界面
                console.log("进来了111", inputValue)
                uni.navigateTo({
                    url: '/pages/home/homeSearchResultPage?item=' + encodeURIComponent(JSON.stringify(inputValue))
                })
            },
            //这是之前关于搜索页面的一些方法、包括展示历史搜索记录、清空等 以后还得用、现在技术不行 暂时搁置
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
        margin-top: 150rpx; /*盒子距离顶部的距离*/
    }

    .detail {
        //padding: 30rpx;
        border-bottom: #eee solid 1rpx;
        margin-top: 300rpx;
    }

    .detail-content {
        display: flex;
        justify-content: space-between;
    }


</style>
