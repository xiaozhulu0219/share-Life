<template>
    <view>
        <!--动态搜索结果展示页、将来在搜索页输入搜索条件、就会跳到该页面做展示-->
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t">
            <block slot="backText">
            </block>
            <view slot="content">ShareLife</view>
        </cu-custom>

<!--        <HomeSignModal :getActiveTab="getActiveTab" class="home-sign"></HomeSignModal>-->

<!--        <homeModal class="home-infor"></homeModal>-->

    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import homeModal from './homeModal.vue'

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
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            console.log("输出item", item)
            //TODO 这里要 调用查询接口 参数就是传递过来的 然后拿到接口做数据展示 展示的样式跟首页一致

            //this.myFormData = item
            //this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
        },
        methods: {
        }
    };
</script>

<style lang="scss" scoped>

    .home-infor {
        //background-color: #fff;
        background-color: $uni-bg-color-grey;
        //padding: 20rpx 20rpx;
        //border-radius: 20rpx;
        //margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        //line-height: 35rpx; /*行高*/
        //margin-bottom: 16px; /*内容和标题间的间距*/
    }

    .home-sign {
        background-color: $uni-bg-color-grey;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 5rpx; /*盒子距离顶部的距离*/
        line-height: 60rpx; /*行高*/
        //margin-bottom: 16px; /*内容和标题间的间距*/
    }

    .icon-search {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 240rpx;
    }
</style>
