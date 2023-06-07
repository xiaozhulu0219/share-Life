<template>
    <view>
        <!--首页引用的modal-->
        <!-- 这个modal 用户点击哪个标签 拿到value  作为参数 传到列表接口，然后拿回数据作展示  目前默认穿回来的数据字段都是一样的-->
        <mescroll-body ref="mescrollRef"  @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">
            <view v-for="(item,index) in homePublishInforList" :key="index" class="card" @click="toInformationDetail(item.id)">
                <img class="medias_size" :src="fileUrl+item.medias" alt="">
                <view class="card-text">{{item.textContent.substr(0, 35) }}</view>
                <view class="card-nickname">{{item.nickname}}
                    <img class="card-icon" src="@/static/icon/zuobiao.png" mode="aspectFill">
                    {{item.ipAddress}}</view>
            </view>
        </mescroll-body>
    </view>
</template>

<script>
    import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
    import Mixin from '@/common/mixin/Mixin.js';
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
    import HomeSignModal from './homeSignModal.vue'
    import HomeHelpCompanyList from './homeHelpCompanyList.vue'
    import configService from '@/common/service/config.service.js'

    export default {
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        components: {
            HomeSignModal,
            HomeHelpCompanyList
        },
        data() {
            return {
                activeTab: {},
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                findHomePublishComListUrl: '/company/findHomePublishComList',
                findHomePublishInforListUrl: '/information/movements/findHomePublishInforList',
                homePublishComList: [],
                homePublishInforList: [],
                inputValue: '',
                fileUrl: configService.fileSaveURL ,
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
                downOption: {
                    use: true, // 是否启用下拉刷新; 默认true
                    auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
                    native: false, // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
                    autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
                    isLock: false, // 是否锁定下拉刷新,默认false;
                    offset: 60, // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
                    inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
                    outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
                    bottomOffset: 20, // 当手指touchmove位置在距离body底部20upx范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
                    minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
                    bgColor: "#E75A7C", // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
                    textColor: "#fff", // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
                    textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
                    textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
                    textLoading: '稍等加载中 ...'    // 加载中的提示文本
                },
                upOption: {
                    auto: false, // 不自动加载
                    page: {
                        num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                        size: 6 // 每页数据的数量
                    },
                    // noMoreSize: 6, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        tip: '~ 空空如也 ~', // 提示
                        btnText: '去逛逛 >', // 按钮
                        use: true, // 是否显示空布局
                        icon: "https://www.mescroll.com/img/mescroll-empty.png", // 图标路径
                        fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
                        top: "100rpx", // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
                        zIndex: 99 // fixed定位z-index值
                    },
                    toTop: {
                        // 回到顶部按钮,需配置src才显示
                        src: "https://www.mescroll.com/img/mescroll-totop.png", // 图片路径
                        offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
                        duration: 300, // 回到顶部的动画时长,默认300ms (当值为0或300则使用系统自带回到顶部,更流畅; 其他值则通过step模拟,部分机型可能不够流畅,所以非特殊情况不建议修改此项)
                        zIndex: 9990, // fixed定位z-index值
                        left: null, // 到左边的距离, 默认null. 此项有值时,right不生效. (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
                        right: 20, // 到右边的距离, 默认20 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
                        bottom: 120, // 到底部的距离, 默认120 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
                        safearea: false, // bottom的偏移量是否加上底部安全区的距离, 默认false, 需要适配iPhoneX时使用 (具体的界面如果不配置此项,则取mescroll组件props的safearea值)
                        width: 72, // 回到顶部图标的宽度, 默认72 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
                        radius: "50%" // 圆角, 默认"50%" (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
                    },
                },
            };
        },
        created() {
            this.getHomePublishComList();
            this.getHomePublishInforList();
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
                        pagesize: 20
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
                        pagesize: 20
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("res.data.result.items！！",res.data.result.items);
                        this.homePublishInforList = res.data.result.items;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            toInformationDetail(id) {
                uni.navigateTo({
                    url:'/pages/home/informationDetail?item='+ encodeURIComponent(JSON.stringify(id))
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

    .main_classify {
        background: white;

        .main_under_classify {
            .li {
                height: 124rpx;
                border-bottom: 2rpx #999999 solid;
                padding: 20rpx 28rpx;
                display: flex;
                justify-content: space-between;
                margin-top: 20rpx;

                image {
                    width: 116rpx;
                    height: 110rpx;
                    border-radius: 50%;
                    margin-right: 20rpx;
                    margin-top: 6rpx;
                }

                .li_content {
                    width: 254rpx;

                    .title {
                        display: block;
                        font-weight: 800;
                        font-size: 28rpx;
                    }

                    text {
                        line-height: 40rpx;
                    }

                    .zhiwei {
                        color: #666666;
                    }

                    .heng {
                        color: #999999;
                    }
                }

                .li_end {
                    padding: 0rpx 40rpx;
                    width: 140rpx;
                    height: 52rpx;
                    border: 1rpx solid red;
                    border-radius: 50rpx;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 36rpx;

                    .jia {
                        width: 24rpx;
                        height: 24rpx;
                        margin-top: 16rpx;
                    }

                    .erji {
                        width: 42rpx;
                        height: 42rpx;
                    }
                }
            }
        }
    }

    .tab-content {
        background-color: #00a8cc;
        position: fixed;
        width: 100%;
        height: 200rpx;
        top: 260rpx;
    }

    .list-item {
        margin: 20rpx auto;
        width: 95%;
        border-radius: 20rpx;
    }

    .card {
        background-color:  #fff;
        //background-color: $uni-bg-color-grey;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx;/*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx;  /*行高*/
        //margin-bottom: 16px; /*内容和标题间的间距*/

        .card-title {
            font-weight: bold;
        }

        .card-nickname {
            font-weight: bold;
        }

        .card-text {
            font-size: 36rpx;
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }

        .card-icon {
            width: 36rpx;
            height: 36rpx;
            margin-right: 10rpx;
            margin-left: 120rpx;
        }
    }

    .medias_size {
        max-width: 180px;
        width: 180px;
        width:expression(this.width > 180 ? "180px" : this.width);
        height: 180px;
        height:expression(this.height > 180 ? "180px" : this.height);
        overflow:hidden;
        /*text-align:center;*/
        /*width: 21rpx;*/
        /*height: 21rpx;*/
        /*border-radius: 8rpx;*/
    }


</style>
