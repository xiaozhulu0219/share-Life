<template>
    <!--首页助力的分页查询-->
    <mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">
        <view v-for="(item,index) in homePublishComList" :key="index" class="card"
              @click="toHomeHelpCompanyDetail(item)">
            <view class="card-title">{{item.companyName.substr(0, 18)}}</view>
            <view class="card-text">{{item.legalPerson}}</view>
            <view class="card-text">{{item.registerTime}}</view>
            <view class="card-text">{{item.companyStatus}}</view>
            <view class="card-line">
                <view class="card-text">{{item.registeredCapital}}</view>
                <view class="card-icon">
                <view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-if="item.hotValue > 60">&#xe627</view>
				<view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-else-if="item.hotValue > 20">&#xe60d</view>
				<view class="iconfont ml-1" style="font-size: 60rpx; color: #dd524d;  margin-left: 260rpx" v-else="item.hotValue = 0">&#xe646</view>
                </view>
                <view class="card-hotValue">{{item.hotValue}}</view>
            </view>
        </view>
    </mescroll-body>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import Mixin from "@/common/mixin/Mixin.js";
    import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";

    export default {
        name: 'homeHelpCompanyModal',
        mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
        data() {
            return {
                findHomePublishComListUrl: '/company/findHomePublishComList',
                homePublishComList: [],
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
                        size: 10 // 每页数据的数量
                    },
                    // noMoreSize: 6, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        tip: '~ 空空如也 ~', // 提示
                        btnText: '去逛逛 >', // 按钮
                        use: true, // 是否显示空布局
                        //icon: "https://www.mescroll.com/img/mescroll-empty.png", // 图标路径
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
        },
        methods: {
            getHomePublishComList() {
                this.$http.get(this.findHomePublishComListUrl, {
                    params: {
                        page: 1,
                        pagesize: 10
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log("返回记录", res.data.result);
                        this.homePublishComList = res.data.result.items;
                        for (let d of this.homePublishComList) {
                            d.companyName = "公司名称：" + d.companyName
                            d.legalPerson = "法人：" + d.legalPerson
                            d.registerTime = "注册时间：" + d.registerTime
                            d.registeredCapital = "注册资金：" + d.registeredCapital
                            d.companyStatus = "经营状态：" + d.companyStatus
                            d.bussinessAddress = "经营地：" + d.bussinessAddress
                            d.organizationCode = "组织编码：" + d.organizationCode
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            toHomeHelpCompanyDetail(item) {
                //console.log("进来了111", item)
                uni.navigateTo({
                    url: '/pages/home/homeHelpCompanyDetail?item=' + encodeURIComponent(JSON.stringify(item))
                })
            },
        }
    }
</script>

<style lang='scss'>
	.card {
		background-color:  $uni-bg-color-grey;
		//background-color: $uni-bg-color-grey;
		//padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;/*盒子间的距离*/
		margin-top: 25rpx; /*盒子距离顶部的距离*/
		line-height: 65rpx;  /*行高*/
		//margin-bottom: 16px; /*内容和标题间的间距*/
		margin-left: 20rpx;
		border-bottom: #eee solid 5rpx;
		//background-color: $uni-bg-color-grey;
		//padding: 20rpx 20rpx;
		//border-radius: 20rpx;
		//margin-bottom: 20rpx;

		.card-title {
			font-weight: bold;
			font-size: 38rpx;
			//margin-top: 100rpx; /*盒子距离顶部的距离*/
		}

        .card-line {
            //font-weight: bold;
            display: flex;
            //margin-left: 20rpx;
        }

		.card-text {
			font-size: 32rpx;
		}

		.card-icon {
			position: absolute;
			right: 120rpx;
			font-size: 20rpx;
		}

        .card-hotValue {
            position: absolute;
            font-weight: bold;
            right: 35rpx;
            margin-top: 8rpx;
        }


	}
</style>
