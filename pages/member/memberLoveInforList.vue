<template>
	<!--个人页的一些页面--我赞过-->
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
			<view v-for="(item,index) in myPublishInforList" :key="index" class="card" >
				<AvatarName :avatarInfo="{nickname:item.nickname,avatar:item.avatar,uuId:item.uuId}"></AvatarName>
				
				<image class="medias_size" v-if="item.inforType !=1"  :src="item.medias[0]" mode="widthFix" alt="" @click="toMemInformationDetail(item)"></image>
				<view class="inforText" @click="toMemInformationDetail(item)">{{ item.textContent}}</view>
			</view>
			<view v-if='isDownLoading' class="load-text">加载中....</view>
			<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
		</scroll-view>
	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import AvatarName from "./avatarName.vue"
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
				fileUrl: configService.fileSaveURL,
			};
		},
		components:{
			AvatarName
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
				this.getMyPublishInforList();
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
				// console.log("点击跳转到详情页", item)
				// uni.navigateTo({
				// 	url: '/pages/member/memberInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
				// })
				uni.navigateTo({
					url: '/pages/home/homeInforDetail?' + 'item=' + encodeURIComponent(JSON
						.stringify(item))
				});
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
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		line-height: 35rpx;  /*行高*/
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
			margin-left: 10rpx;
			margin-top: 8rpx;
		}

		.card-text {
			font-size: 36rpx;
			margin-bottom: 10rpx; /*盒子间的距离*/
			line-height: 55rpx;  /*行高*/
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
		overflow:hidden;
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
	.text-space{
		height:40rpx;
	}
	.inforText{
		display: -webkit-box; /* 将容器以弹性盒子形式布局 */
		  -webkit-line-clamp: 3; /* 限制文本显示为两行 */
		  -webkit-box-orient: vertical; /* 将弹性盒子的主轴方向设置为垂直方向 */
		  overflow: hidden; /* 隐藏容器中超出部分的内容 */
		  text-overflow: ellipsis; /* 超出容器范围的文本显示省略号 */
		word-break:break-all;
		
	}
</style>
