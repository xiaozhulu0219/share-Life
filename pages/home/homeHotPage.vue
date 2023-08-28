<template>
	<!-- 热门页面 -->
	<view class="hot-page-container">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%" refresher-enabled="true"
			:refresher-triggered="triggered" :refresher-threshold="100" refresher-background="#fff"
			@refresherrefresh="onRefresh">

			<view class="hot-page-wrap" v-for="(item,index) in hotListStore" :key="item.id">
				<view class="hot-post-top">
					<view class="hot-post-top-left">
						<view class="hot-post-top-avatar" @click="toMemberdetail(item.uuId)">
							<image :src="item.avatar" class="top-avatar" mode="aspectFill"></image>
						</view>
						<view class="hot-post-top-nickName">
							{{item.nickname.substr(0, 12)}}
						</view>
						<view class="hot-post-publishDate">
							{{item.createDate}}
						</view>
					</view>
					<view class="hot-post-top-right">
						<view class="hot-post-body-info">
							<view class="post-body-info-item ">
								<view class="cuIcon-location" style="font-size:1.5em"> </view>
								{{item.ipAddress}}
							</view>
							<view class="post-body-info-item ">
								<view class="cuIcon-like" style="color: #fbbd08;font-size:1.5em"
									v-if="item.hasLoved == 0" @click="loveInfor(item.inforId,index)">
								</view>
								<view class="cuIcon-likefill" style="color: #dd524d;font-size:1.5em" v-else
									@click="unloveInfor(item.inforId,index)"></view>
								<view class="card-loveCount">{{item.loveCount}}</view>
							</view>
						</view>
					</view>

				</view>
				<view class="hot-post-body-img" v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
					<image class="body-img-inner" :src="item.medias[0]" mode="widthFix"></image>
				</view>
				<view class="hot-post-body-text-imgnull"
					style="-webkit-line-clamp: 3;-webkit-box-orient: vertical;display: -webkit-box;"
					v-if="item.imgIsNull" @click="toInformationDetail(item,index)">
					{{ item.textContent }}
				</view>

				<view class="hot-post-body-text"
					style="-webkit-line-clamp: 3;-webkit-box-orient: vertical;display: -webkit-box;"
					v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
					{{ item.textContent }}
				</view>
			</view>
			<view class="loading-box">
				<view v-if='isDownLoading' class="load-text">加载中....</view>
				<view v-if="!isDownLoading && !hasNext" class="noMore">--到底了---</view>
			</view>
			<view class="bottom-space">


			</view>
		</scroll-view>

	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				triggered: false,
				unloveInforUrl: '/information/movements/unlove',
				loveInforUrl: '/information/movements/love',
				hasNext: false,
				hotPageList: [],
				isDownLoading: false,
				fileUrl: configService.fileSaveURL,
				hotPageUrl: '/inforcommon/findPopularInforPage'
			}
		},
		created() {
			if (this.hotListStore.length > 0) {
				console.log("缓存有值不需要重新请求")
				return
			} else {
				this.updataHotPage()
				//
			}
		},
		computed: {
			...mapState(['hotListStore', 'hotListPage'])
		},
		methods: {
			async onRefresh() {
				this.triggered = true;
				// 重置列表
				this.changeHotListStore([]);
				this.hotPageInit();
				await this.updataHotPage();
				this.triggered = false;
			},
			loveInfor(id, index) {
				// 热门页面点赞
				this.$http.get(this.loveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						// 在好友的緩存數組中更改當前點贊信息
						this.loveInforHotStore({
							index,
							count: res.data.result
						})
					}
				})

			},
			unloveInfor(id, index) {
				this.$http.get(this.unloveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						// 在好友的緩存數組中更改當前點贊信息
						this.unloveInforHotStore({
							index,
							count: res.data.result
						})
					}
				})
			},
			...mapMutations(['changeHotListStore', 'hotPageNext', 'hotPageInit', 'loveInforHotStore',
				'unloveInforHotStore'
			]),
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
			},
			toInformationDetail(item, index) {
				// 存一下item.id

				uni.navigateTo({
					url: '/pages/home/homeInforDetail?from=hot&index=' + index + '&item=' + encodeURIComponent(JSON
						.stringify(item))
				});
			},
			 reachBottom() {
				
				console.log("触底了");
				if (!this.hasNext) return;
				// 触底加载
				 this.updataHotPage()
				
			},
			updataHotPage() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.hotPageNext();
				const {
					num,
					size
				} = this.hotListPage;

				return this.$http.get(this.hotPageUrl, {
					params: {
						page: num,
						pagesize: size
					}
				}).then(res => {
					const {
						success,
						result
					} = res.data;
					if (success) {
						const {
							pages,
							items,
							page
						} = result;
						console.log("热门页面", pages,
							items,
							page);
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
						console.log(items, "热门list")
						const tempArr = [...this.hotListStore, ...items]
						// 提交新增数组
						this.changeHotListStore(tempArr)
						this.hotPageList = [...items];
						this.hasNext = pages > page;
						this.isDownLoading = false;
						console.log("有没有下一页", this.hasNext)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.hot-page-container {
		height: calc(100vh - 100rpx);
		font-size: 1em;
		overflow: hidden;
		background-color: #fff;
		/* padding-top: 30rpx; */
		box-sizing: border-box;
	}

	.hot-page-wrap {
		padding-top: 15rpx;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		border-bottom: 3px solid #eee;
	}

	.hot-post-top {
		/* border-bottom: 1px solid #eee; */
		/* box-shadow: 0px 1px 5px 1px #eee; */
		/* border-top:1px solid #eee; */
		width: 100%;
		height: 80rpx;
		/* background-color: rgb(250, 250, 250); */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.hot-post-top-left {
		height: 100%;
		display: flex;
		align-items: center;

	}

	.hot-post-top-avatar {
		height: 60rpx;
		width: 60rpx;
		margin-right: 20rpx;
	}

	.hot-post-body-text-imgnull,
	.hot-post-body-text {
		margin: 20rpx;
		line-height: 35rpx;
		max-height: 105rpx;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.top-avatar {
		height: 100%;
		border-radius: 50%;
		width: 100%;
	}

	.hot-post-publishDate {
		color: #666;
		font-size: 0.8em;
		margin-left: 20rpx;
	}

	.hot-post-body-img {
		padding: 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.body-img-inner {
		width: 100%;
	}

	.hot-post-top-right {
		height: 100%;
	}

	.hot-post-body-info {
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;

	}

	.post-body-info-item {
		margin-right: 30rpx;
		display: flex;
		height: 100%;
		align-items: center;
	}

	/* .hot-post-body-text {
		padding: 0 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	} */

	.loading-box {
		margin-bottom: 30rpx;
	}

	.bottom-space {
		height: 100rpx;
	}

	.load-text {
		text-align: center;
		color: #ccc;
	}

	.noMore {
		text-align: center;
		color: #ccc;
	}
</style>
