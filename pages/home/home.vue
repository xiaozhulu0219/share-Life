<template>
    <view class="home-container">
        <!--首页-->
        <!--关于首页的规划，首页将来还是做框架、HomeSignModal从后台拿回多少个标签 home就插多少个modal
        至于modal的命名无所谓， 比如第一个modal是心理方面的 在返回的标签中 心理是1 那就将1作为参数获取列表
        所有标签页获取数据公用一个接口，根据传的标签值（类型）后台返回不同的领域的数据
        -->
        <commonTab :bgColor="NavBarColor">
            <block slot="title"> ShareLife</block>
            <block slot="right">
                <view class="cuIcon-search search-icon" @click="toSearch(activeTab.value)"></view>
            </block>
        </commonTab>

        <HomeSignModal :getActiveTab="getActiveTab"></HomeSignModal>

<!--        <KeepAlive>-->
            <homeHelpCompanyModal class="home-helpCompany" v-if="activeTab.value==2"></homeHelpCompanyModal>

            <homeModal v-else></homeModal>
<!--        </KeepAlive>-->

        <bottomTab PageCur="home"></bottomTab>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from '@/components/mescroll-uni/mixins/mescroll-more.js';
    import HomeSignModal from './homeSignModal.vue';
    import homeHelpCompanyModal from './homeHelpCompanyModal.vue';
    import homeModal from './homeInforModal.vue';
    import bottomTab from '../component/bottomTab.vue';
    import commonTab from '../component/commonTab.vue';
    import listComponent from './components/listComponent.vue';

    export default {
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
            HomeSignModal,
            homeModal,
            homeHelpCompanyModal,
            bottomTab,
            commonTab,
            listComponent
        },
        data() {
            return {
                activeTab: {
                    label: '',
                    text: '',
                    title: '',
                    value: ''
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
                }] //搜索出来的内容(假数据)
            };
        },
        // created() {
        //     this.getHomePublishInforList();
        // },
        methods: {
            getActiveTab(item) {
                this.activeTab = item;
                console.log('切换tab1', item.value);
                console.log('切换tab2', this.activeTab.value);
            },
            toSearch(item) {
                console.log('首页的activeTab.value进来了', item);
                uni.navigateTo({
                   // url: '/pages/home/homeSearch?item=' + item
                    url: '/pages/home/homeSearch?item=' + encodeURIComponent(JSON.stringify(item))
                });
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
                console.log('进来了', inputValue);
                if (this.inputValue == '') {
                    uni.showModal({
                        title: '搜索内容不能为空'
                    });
                } else {
                    //let myForm = this.myFormData
                    //console.log("myForm", myForm)
                    //this.$tip.loading();
                    // this.$http.get('/sys/editNickName', {
                    //     params: {
                    //         id: this.$store.getters.userid,
                    //         nickName: myForm.nickName
                    //     }
                    // }).then(res => {
                    //     console.log(res)
                    //     this.$tip.loaded();
                    //     if (res.data.success) {
                    //         this.$tip.toast('提交成功')
                    //         this.$Router.replace({
                    //             name: 'memberdetail'
                    //         })
                    //         /* uni.navigateTo({
                    //             url: '/pages/user/userdetail'
                    //         }) */
                    //     }
                    // }).catch(() => {
                    //     this.$tip.loaded();
                    //     this.$tip.error('提交失败')
                    // });
                }
                // this.inputValue = '';
            },
            // search() {
            //     if (this.inputValue == '') {
            //         uni.showModal({
            //             title: '搜索内容不能为空'
            //         });
            //     } else {
            //         if (!this.searchHistoryList.includes(this.inputValue)) {
            //             this.searchHistoryList.unshift(this.inputValue);
            //             uni.setStorage({
            //                 key: 'searchList',
            //                 data: JSON.stringify(this.searchHistoryList)
            //             });
            //         } else {
            //             //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
            //             let i = this.searchHistoryList.indexOf(this.inputValue);
            //             this.searchHistoryList.splice(i, 1);
            //             this.searchHistoryList.unshift(this.inputValue);
            //             uni.showToast({
            //                 title: '不能重复添加'
            //             });
            //             uni.setStorage({
            //                 key: 'searchList',
            //                 data: JSON.stringify(this.searchHistoryList)
            //             });
            //         }
            //     }
            //     this.inputValue = '';
            // },
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
                const list = await uni.getStorage({
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
    .home-container {
        width: 100vw;
        height: 100vh;
        padding-bottom: 106rpx;
        padding-top: 100rpx;
        box-sizing: border-box;
    }
    .search-icon {
        color: #fff;
       //margin-left: 10rpx;
        margin-right: 10rpx; //没生效
        font-size: 50rpx;
        //font-weight: 700;
    }
    .home-helpCompany {
        background-color: $uni-bg-color-grey;
        margin-top: 5rpx;
    }
    .home-infor {
        background-color: $uni-bg-color-grey;
        margin-top: 5rpx;
    }

</style>
