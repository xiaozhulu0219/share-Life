<template>
	<!--个人页的一些页面--（我的发布)分页查询-->
<!--	<view style="height: 800px">-->
		<mescroll-body ref="mescrollRef" style="height: 100%;"  @init="mescrollInit" :up="upOption" :down="downOption"
			@down="downCallback" @up="upCallback">
			<view v-for="(item,index) in myPublishInforList" :key="index" class="card" @click="toMemInformationDetail(item)">
				<image class="medias_size" :src="item.medias[0]" mode="widthFix" alt=""></image>
				<view>{{ item.textContent.substr(0, 35) }}</view>
			</view>
		</mescroll-body>
<!--	</view>-->
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";
	import configService from '@/common/service/config.service.js'
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";

	export default {
		name: 'MyPublishList',
		mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
		data() {
			return {
				findMyPublishInforPageUrl: '/information/movements/findMyPublishInforPage',
				myPublishInforList: [],
				fileUrl: configService.fileSaveURL ,
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
			this.getMyPublishInforList();
		},
		methods: {
			getMyPublishInforList() {
				this.$http.get(this.findMyPublishInforPageUrl, {
					params: {
						page: 1,
						pagesize: 100
					}
				}).then(res => {
					if (res.data.success) {
						//console.log("res.data.result:",res.data.result);
						//console.log("数据条数:",res.data.result.items.length);
						this.myPublishInforList = res.data.result.items;
						for (let d of this.myPublishInforList) {
							let arr = d.medias.split(',')
							let arr2 = []
							for (let e of arr) {
								e = this.fileUrl+e
								arr2.push(e)
							}
							d.medias = arr2
						}
						//console.log("数据条数222:",this.myPublishInforList.length);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			toMemInformationDetail(item) {
				console.log("点击跳转到详情页", item)
				uni.navigateTo({
					url: '/pages/member/memberInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
		}
	}
</script>

<style lang='scss'>

	.card {
		background-color: $uni-bg-color-grey;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;

		.card-title {
			font-weight: bold;
		}

		.card-text {
			font-size: 20rpx;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
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
