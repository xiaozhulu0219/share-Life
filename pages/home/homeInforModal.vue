<template>
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;" refresher-enabled="true"
			:refresher-triggered="triggered" :refresher-threshold="100" refresher-background="#fff"
			@refresherrefresh="onRefresh">
			
			<view class="" v-for="(item,index) in homeListStore" :key="'s'+index">
				<homeInforItem v-if="item.state!=2" :inforItem="item" 
				@tomemberDetailEvent="toMemberdetail"
				@toInforDetailEvent="toInformationDetail(item,index)"
				@toReportEvent="handleLongpress(item)"
				@toLoveInforEvent="loveInfor(item.inforId,index)"
				@toUnLoveInforEvent="unloveInfor(item.inforId,index)"></homeInforItem>
				
			</view>
			<!-- <view :id="'s'+item.id" v-for="(item,index) in homeListStore" :key="index">
				<view class="card" v-if="item.state!=2">

					<view class="report-btn" @click="handleLongpress(item)">
						<view class="cuIcon-info" style="font-size: 1.2em;">

						</view>
					</view>
					<view v-if="item.imgIsNull" class="space-for-no-img" @click="toInformationDetail(item,index)">
					</view>
					<view v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
						<image v-if="item.medias.length>0" class="medias_size" :src="item.medias[0]" mode="widthFix"
							alt="" @click="toInformationDetail(item,index)"></image>
						<image v-else class="nomedias_size"></image>
					</view>

					<view class="card-text"
						style="-webkit-line-clamp: 2;-webkit-box-orient: vertical;display: -webkit-box;"
						@click="toInformationDetail(item,index)">
						{{item.textContent}}
						<view class="colpose"></view>
						<view v-if="item.imgIsNull" class="space-for-no-img">

						</view>
					</view>
					<view class="card-line">
						<view class="left">
							<image class="card-avatar round" :src="item.avatar" mode="aspectFill" alt=""
								@click="toMemberdetail(item.uuId)"></image>
							<view class="card-nickname">{{item.nickname.substr(0, 12)}}</view>
						</view>
						<view class="right">
							<view class="cart-flex card-width">
								<view class="cuIcon-location"> </view>
								<view class="card-ipAddress">{{item.ipAddress}}</view>
							</view>
							<view class="cart-flex">
								<view class="cuIcon-like" style="color: #fbbd08" v-if="item.hasLoved == 0"
									@click="loveInfor(item.inforId,index)"></view>
								<view class="cuIcon-likefill" style="color: #dd524d" v-else
									@click="unloveInfor(item.inforId,index)"></view>
								<view class="card-loveCount">{{item.loveCount}}</view>
							</view>
						</view>
					</view>

				</view>
			</view> -->

			<view v-if='isDownLoading' class="load-text">加载中....</view>
			<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多动态了，快去分享你的美好生活吧---</view>
		</scroll-view>
		<popForList ref="popforlist" :listInfo="popupInfo" @reportSubmit="handleSubmitRepot"
			@deleteSubmit="handleSubmitDelete"></popForList>

	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import popForList from "@/pages/publish/popForList.vue";
	import homeInforItem from "./components/homeInforItem.vue"
	// import {subscrib} from "../../common/util/eventBus.js";
	import {
		mapMutations,
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				isLongPress: false,
				longpressTimer: null, // 长按计时器
				popupInfo: {},
				triggered: false,
				pageInfo: {
					num: 0,
					size: 10
				},
				imageList: [],
				hasNext: true,
				isDownLoading: false,
				deleteInforUrl: '/information/movements/deleteInfor',
				reportSubmitUrl: '/reportviolations/sendReportViolations',
				unloveInforUrl: '/information/movements/unlove',
				loveInforUrl: '/information/movements/love',
				homeListUrl: '/information/movements/findHomePublishInforList',
				homeList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
				fileUrl: configService.fileSaveURL,
				activeType: ''
			};
		},
		components: {
			popForList,
			homeInforItem
		},
		computed: {
			contentFormat() {
				return function(content) {
					return `${content.substring(0, 38)}${content.length > 38 ? ' ...' : ''}`;
				};
			},
			...mapState(['homeListStore', 'pageInfoStore', 'uuId']),

		},
		props: {
			activeTab: Object
		},
		watch: {
			'activeTab.value': {
				handler(newVal) {
					console.log("active变了", newVal)
					console.log(newVal, "新的值")
					if (newVal === '1') {
						// 请求推荐接口
						this.homeListUrl = '/information/movements/findHomePublishInforList'
						this.changehomeListStore([]);
						this.initPage([]);
						// 重新请求列表
						this.getHomePublishInforList()
					} else if (newVal === '2') {
						return
					} else {
						// 需要调用其他接口
						this.activeType = newVal;

						this.homeListUrl = '/inforcommon/findInforPageByTabType';
						this.changehomeListStore([]);
						this.initPage([]);
						this.getHomePublishInforList()
					}
					// if(newVal==='2'){
					// 	// 不是公司列表就进行请求
					// 	// 清空当前的home列表
					// 	this.changehomeListStore([]);
					// 	this.initPage([]);
					// 	// 重新请求列表
					// 	this.getHomePublishInforList()
					// }else{
					// 	// console.log("由另外一个页面进行渲染")
					// 	return
					// }




				}
			}
		},
		created() {
			//activated() {
			console.log(9999);
			// 看一下当前的仓库有没有数据
			// console.log(,"仓库的数据")
			if (this.homeListStore.length !== 0) {
				console.log(this.homeListStore);
				console.log("不需要重新请求数据");
				// 进行默认滚动
				// this.scrollHeight = this.scrollIdStore === '' ? '' : this.scrollIdStore
				// 希望回到之前的浏览位置

				return
			}
			console.log("需要重新请求数据")
			this.getHomePublishInforList();
			// 注册eventBus
			// subscrib('likeEvent',(id,index)=>{
			// 	console.log("运行了父级的点赞事件");
			// 	// console.log(this.homeList,"是否能拿到数据")
			// 	// console.log(id,index)
			// 	// 找到inforid 把里面的hasLoved变成1
			// 	this.homeList[index].hasLoved = 1;
			// 	this.homeList[index].loveCount+=1;

			// }),
			// subscrib('dislikeEvent',(id,index)=>{
			// 	console.log("运行了父级的取消点赞事件");
			// 	// console.log(this.homeList,"是否能拿到数据")
			// 	this.homeList[index].hasLoved = 0;
			// 	this.homeList[index].loveCount-=1;
			// })
		},

		methods: {
			// confirmReport(item) {

			// 	// 判断当前动态是不是自己的
			// 	// console.log("咦")
			// 	console.log(this.uuId, '2', item.uuId)
			// 	if (this.uuId !== item.uuId) {
			// 		// 当前动态不是自己的进行举报
			// 		uni.showModal({
			// 			title: '进行举报',
			// 			content: "您确认要举报该条动态吗？ (恶意举报会被处理的呦)",
			// 			confirmText: '举报',
			// 			success: (res) => {
			// 				console.log("举报", res)
			// 				if (res.confirm) {
			// 					// 弹出弹框
			// 					this.handleLongpress(item);
								
			// 				} else if (res.cancel) {
			// 					return
			// 				}
			// 			}
			// 		})
			// 	} else {
			// 		this.handleLongpress(item)
			// 	}

			// },
			
			handleSubmitDelete(tar, cb) {
				// 删除动态
				console.log(tar, "用户要删除")
				// 提交删除动态申请
				// 本地仓库也要删除
				uni.showLoading({
					title: 'loading...'
				})
				this.$http.delete(this.deleteInforUrl + '?id=' + tar.detail.inforId).then(async res => {
					console.log("结果数据", res)
					if (res.data.success) {
						// 本地仓库刷新
						// 重新请求数据
						uni.hideLoading();
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						cb()
						this.changehomeListStore([]);
						this.initPage();
						await this.getHomePublishInforList();


					}
				}).catch(e => {
					console.log("al delUrl请求错误2", e)
				})
			},
			handleSubmitRepot(tar, cb) {
				console.log("发送举报请求", tar)
				uni.showLoading({
					title: 'loading....'
				})
				const submitObj = {
					type: tar.type,
					id: tar.detail.id,
					reportContent: tar.detail.textContent,
					uuId: tar.detail.uuId

				}
				console.log(submitObj)
				this.$http.post(this.reportSubmitUrl, submitObj).then((res) => {
					if (res.statusCode === 200) {
						// 举报成功
						uni.hideLoading();
						uni.showToast({
							title: "感谢您的积极反馈",
							icon: 'none'
						});
						cb(); // 弹框消失
						// 将当前列表的当前state变成2 不显示
						const targetIdx = this.homeListStore.findIndex(item=>{
							return item.inforId === tar.detail.inforId
						
						})
						this.homeListStore[targetIdx].state = 2;

					} else {
						uni.hideLoading();
						uni.showToast({
							title: "未知错误",
						});
					}

				})
			},
			// 长按弹窗
			touchstart(item) {
				//1.5后触发弹窗事件
				this.longpressTimer = setTimeout(() => {
					this.handleLongpress(item)
				}, 750)
			},
			touchend() {
				clearTimeout(this.longpressTimer);
				this.longpressTimer = null;

			},
			handleLongpress(item) {
				// console.log(this.popupInfo)
				// console.log(this.uuId,"1")
				// console.log(item.uuId,"2")

				console.log("弹框出现");
				this.isLongPress = true;
				let tar = {
					isUser: this.uuId === item.uuId,
					detail: {
						...item
					},
					type: "1",
					typeText: '动态'
				}
				console.log(tar, "zhezheh")
				this.popupInfo = tar
				this.$refs.popforlist.open()
			},

			// 下拉刷新
			async onRefresh() {
				this.triggered = true;

				// 重新加载列表
				this.changehomeListStore([]);
				this.initPage()
				await this.getHomePublishInforList()
				this.triggered = false;
				console.log("重新加载完毕")

			},
			...mapMutations(['changehomeListStore', 'unloveInforStore', 'loveInforStore', 'pageNext', 'initPage']),
			imgLoad(e) {
				console.log("图片加载了")
			},
			reachBottom() {
				console.log("触底了!!!")

				if (!this.hasNext) return;
				console.log('//// 触底加载');
				this.getHomePublishInforList();
			},
			getHomePublishInforList() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				// this.pageInfo.num++;
				this.pageNext()
				const {
					homeListUrl,
					pageInfoStore: {
						num,
						size
					}
				} = this;
				console.log(num, "请求的参数第几页");
				console.log("请求的分类", this.activeTab.value);
				return this.$http.get(homeListUrl, {
					params: {
						page: num,
						pagesize: size,
						type: this.activeType
					}
				}).then(res => {
					const {
						success,
						result
					} = res.data;
					console.log(res.data, "<---")
					console.log('。。。。。', result.items, '数据');
					if (success) {
						console.log(result, "从后端直接拿的数据")
						const {
							pages,
							items,
							page
						} = result;
						console.log("页数", pages, items, page)
						if (num === 1) this.homeList = [];
						if (items.length) {
							for (const d of items) {
								if (d.medias === '') {
									d.imgIsNull = true
								}

								const arr = d?.medias?.split(',');
								const arr2 = [];
								for (let e of arr) {
									e = this.fileUrl + e;
									arr2.push(e);
								}
								d.avatar = this.fileUrl + d.avatar;
								d.medias = arr2;

							}
						}
						console.log(items, '首页数据')
						console.log(this.homeList, "1")
						const tempList = [...this.homeListStore, ...items]
						this.changehomeListStore(tempList)
						this.homeList = this.homeList.concat(items);
						console.log(this.homeList, "2")
						this.hasNext = pages > page;
						this.isDownLoading = false;;
						// 修改仓库数据
					} else {
						this.isDownLoading = false;
					}
					//
					console.log(this.homeList, "homeList变了")
					// 注册一个全局数据
					// 改变仓库数据
				}).catch(err => {
					console.log(err);
					this.isDownLoading = false;
				});
			},
			toInformationDetail(item, index) {
				// 存一下item.id

				uni.navigateTo({
					url: '/pages/home/homeInforDetail?from=infor&index=' + index + '&item=' + encodeURIComponent(
						JSON
						.stringify(item))
				});
			},
			//喜欢动态
			loveInfor(id, index) {
				console.log(index, "直接点赞的index")
				this.$http.get(this.loveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						//this.getHomePublishInforList();
						//console.log('喜欢动态11', res);
						// 点赞需提交mutation

						// this.homeList[index].loveCount=res.data.result;
						// this.homeList[index].hasLoved = 1;
						this.loveInforStore({
							index,
							count: res.data.result
						})
						console.log('喜欢动态22', this.homeList[index].hasLoved);
					}
				});
			},
			//取消喜欢动态
			unloveInfor(id, index) {
				this.$http.get(this.unloveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						//this.getHomePublishInforList();
						this.unloveInforStore({
							index,
							count: res.data.result
						})
						// this.homeList[index].loveCount=res.data.result;
						// this.homeList[index].hasLoved = 0;
						console.log('取消喜欢动态', this.homeList[index].hasLoved);
					}
				});
			},
			//点击头像跳转用户详情

			toMemberdetail(myFormData) {
				//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
				console.log(myFormData, "myFormData")
				if (this.$store.getters.uuId == myFormData) {
					uni.navigateTo({
						url: '/pages/member/member'
					});
				} else {
					uni.navigateTo({
						url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.space-for-no-img {
		height: 30rpx;
		width: 100%;
	}

	.list-wrap {
		height: calc(100vh - 280rpx);

		.no_img {
			margin-bottom: 50rpx;
		}
	}

	.card {
		background-color: #fff;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		line-height: 35rpx;
		/*行高*/
		border-bottom: #eee solid 5rpx;
		position: relative;

		.cart-flex {
			display: flex;
			align-items: center;
			// justify-content: space-between
		}

		.card-line {
			font-weight: bold;
			display: flex;
		}

		.card-nickname {
			font-weight: bold;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 80%;
			overflow: hidden;
		}

		.card-ipAddress,
		.card-loveCount {
			font-weight: bold;
			margin-left: 8rpx;
		}

		.card-ipAddress {
			margin-right: 50rpx;
		}

		.card-loveCount {
			font-weight: bold;
			margin-left: 8rpx;
		}

		.card-width {
			width: 200rpx;
			text-align: center
		}

		.card-text {
			font-size: 36rpx;
			margin-bottom: 10rpx;
			/*盒子间的距离*/
			line-height: 55rpx;
			max-height: 110rpx;
			overflow: hidden;
			/*行高*/
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}

		.card-avatar {
			max-width: 20px;
			width: 20px;
			height: 20px;
		}


	}

	.medias_size {
		max-width: 180px;
		width: 180px;
		height: 180px;
		overflow: hidden;
		margin-bottom: 20rpx;
		/*盒子间的距离*/
	}

	.nomedias_size {
		// max-width: 80px;
		width: 80px;
		// height: 80px;
		//overflow:hidden;
		margin-bottom: 20rpx;
		/*盒子间的距离*/
	}

	.load-text,
	.noMore {
		// background-color: #fff;
		text-align: center;
		padding: 4rpx;
	}

	.noMore {
		color: #ccc;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		//flex: 1;
	}

	.left {
		overflow: hidden;
		flex: 3;
	}

	.right {
		flex-shrink: 0;
		flex: 2;
	}

	.report-btn {
		height: 40rpx;
		width: 40rpx;
		position: absolute;
		top: 10rpx;
		right: 25rpx;


	}
</style>
