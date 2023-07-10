<template>
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
			<view v-for="(item,index) in myPublishInforList" :key="index" class="card" @click="toMemInformationDetail(item)">
				<image class="medias_size" :src="item.medias[0]" mode="widthFix" alt=""></image>
				<view>{{ item.textContent.substr(0, 35) }}</view>
			</view>
			<view v-if='isDownLoading' class="load-text">加载中....</view>
			<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
		</scroll-view>
	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';

	export default {
		name: 'memberLoveInforList',
		data() {
			return {
				pageInfo: {
					num: 0,
					size: 10
				},
				hasNext: true,
				isDownLoading: false,
				findMyPublishInforPageUrl: '/information/movements/findMyLoveInforPage',
				myPublishInforList: [],
				//unloveInforUrl: '/information/movements/unlove',
				//loveInforUrl: '/information/movements/love',
				//homeListUrl: '/information/movements/findHomePublishInforList',
				//homeList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
				fileUrl: configService.fileSaveURL,
			};
		},
		created() {
			console.log(9999);
			this.getMyPublishInforList();
		},
		methods: {
			// 触底加载
			reachBottom() {
				if (!this.hasNext) return;
				console.log('//// 触底加载');
				this.getHomePublishInforList();
			},
			getMyPublishInforList() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.pageInfo.num++;
				const { findMyPublishInforPageUrl, pageInfo: { num, size } } = this;
				this.$http.get(findMyPublishInforPageUrl, {
					params: { page: num, pagesize: size }
				}).then(res => {
					const { success, result } = res.data;
					console.log('。。。。。', result.items);
					if (success) {
						const { pages, items, page } = result;
						if (num === 1) this.myPublishInforList = [];
						if (items.length) {
							for (const d of items) {
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
						this.myPublishInforList = this.myPublishInforList.concat(items);
						this.hasNext = pages > page;
						this.isDownLoading = false;
					} else {
						this.isDownLoading = false;
					}
				}).catch(err => {
					console.log(err);
					this.isDownLoading = false;
				});
			},
			toMemInformationDetail(item) {
				console.log("点击跳转到详情页", item)
				uni.navigateTo({
					url: '/pages/member/memberInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.list-wrap {
		height: calc(100vh - 280rpx);
	}
	.card {
		background-color:  #fff;
		//background-color: $uni-bg-color-grey;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		//margin-bottom: 10rpx;/*盒子间的距离*/
		//margin-top: 10rpx; /*盒子距离顶部的距离*/
		line-height: 35rpx;  /*行高*/
		//margin-bottom: 16px; /*内容和标题间的间距*/
		border-bottom: #eee solid 5rpx;

		.card-line {
			font-weight: bold;
			display: flex;
		}

		.card-nickname {
			font-weight: bold;
			margin-right: 80rpx;
			margin-left: 10rpx;
			margin-top: 8rpx;
		}

		.card-ipAddress {
			font-weight: bold;
			margin-right: 100rpx;
			margin-left: 10rpx;
			margin-top: 8rpx;
		}

		.card-loveCount {
			font-weight: bold;
			//margin-right: 80rpx;
			margin-left: 10rpx;
			margin-top: 8rpx;
		}

		.card-text {
			font-size: 36rpx;
			margin-bottom: 10rpx; /*盒子间的距离*/
			line-height: 55rpx;  /*行高*/
			//margin-bottom: 16px; /*内容和标题间的间距*/
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}

		.card-avatar {
			max-width: 20px;
			width: 20px;
			// width: expression(this.width > 20 ? "20px" : this.width);
			height: 20px;
			// height: expression(this.height > 20 ? "20px" : this.height);
		}

	}
	.medias_size {
		max-width: 180px;
		width: 180px;
		// width:expression(this.width > 180 ? "180px" : this.width);
		height: 180px;
		// height:expression(this.height > 180 ? "180px" : this.height);
		overflow:hidden;
		/*text-align:center;*/
		/*width: 21rpx;*/
		/*height: 21rpx;*/
		/*border-radius: 8rpx;*/
		margin-bottom: 20rpx; /*盒子间的距离*/
	}
	.load-text, .noMore {
		background-color: #fff;
		text-align: center;
		padding: 4rpx;
	}
	.noMore {
		color: #ccc;
	}
</style>
