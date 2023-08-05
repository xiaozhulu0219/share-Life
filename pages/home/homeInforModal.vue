<template>
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;" refresher-enabled="true"
			:refresher-triggered="triggered" :refresher-threshold="100" refresher-background="#fff"
			@refresherrefresh="onRefresh">
			<view :id="'s'+item.id" v-for="(item,index) in homeListStore" :key="index" class="card" @longpress="handleLongpress(item)">
				<view v-if="item.imgIsNull" class="space-for-no-img" @click="toInformationDetail(item,index)">
				</view>
				<view v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
					<image v-if="item.medias.length>0" class="medias_size" :src="item.medias[0]" mode="widthFix" alt=""
						@click="toInformationDetail(item,index)"></image>
					<image v-else class="nomedias_size"></image>
				</view>
				<!-- <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt="" @click="toInformationDetail(item)"></image> -->

				<view class="card-text" style="-webkit-line-clamp: 2;-webkit-box-orient: vertical;display: -webkit-box;" @click="toInformationDetail(item,index)">
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
			<view v-if='isDownLoading' class="load-text">加载中....</view>
			<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多动态了，快去分享你的美好生活吧---</view>
		</scroll-view>
		<popForList ref="popforlist" :listInfo="popupInfo"></popForList>
	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import popForList from "@/pages/publish/popForList.vue"
	// import {subscrib} from "../../common/util/eventBus.js";
	import {
		mapMutations,
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				popupInfo:{},
				triggered: false,
				pageInfo: {
					num: 0,
					size: 10
				},
				imageList: [],
				hasNext: true,
				isDownLoading: false,
				unloveInforUrl: '/information/movements/unlove',
				loveInforUrl: '/information/movements/love',
				homeListUrl: '/information/movements/findHomePublishInforList',
				homeList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
				fileUrl: configService.fileSaveURL,
			};
		},
		components:{
			popForList
		},
		computed: {
			contentFormat() {
				return function(content) {
					return `${content.substring(0, 38)}${content.length > 38 ? ' ...' : ''}`;
				};
			},
			...mapState(['homeListStore', 'pageInfoStore','uuId']),
			
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
				this.scrollHeight = this.scrollIdStore === '' ? '' : this.scrollIdStore
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
			// 长按弹窗
			handleLongpress(item){
				// console.log(this.popupInfo)
				// console.log(this.uuId,"1")
				// console.log(item.uuId,"2")
				let tar = {
					isUser:this.uuId===item.uuId,
					test:item.textContent
				}
				console.log(tar,"zhezheh")
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
				console.log(num, "请求的参数第几页")
				this.$http.get(homeListUrl, {
					params: {
						page: num,
						pagesize: size
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
					url: '/pages/home/homeInforDetail?index=' + index + '&item=' + encodeURIComponent(JSON
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
		background-color: #fff;
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
</style>
