<template>
	<!--个人页的一些页面--我的收藏-->
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
			<view v-for="(item,index) in MyCollectList" :key="index" class="card" >
				<AvatarName :avatarInfo="{nickname:item.nickname,avatar:item.avatar,uuId:item.uuId}"></AvatarName>
				<image class="medias_size" :src="item.medias[0]" mode="widthFix" alt="" @click="toMemInformationDetail(item)"></image>
				<view @click="toMemInformationDetail(item)">{{ item.textContent.substr(0, 35) }}</view>
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
		name: 'MyCollectList',
		
		data() {
			return {
				pageInfo: {
					num: 0,
					size: 10
				},
				hasNext: true,
				isDownLoading: false,
				findMyCollectPageUrl: '/information/movements/findMyCollectPage',
				MyCollectList: [],
				fileUrl: configService.fileSaveURL,
			};
		},
		created() {
			console.log(9999);
			this.getMyCollectList();
		},
		components:{
			AvatarName
		},
		methods: {
			// 触底加载
			reachBottom() {
				if (!this.hasNext) return;
				console.log('//// 触底加载');
				this.getMyCollectList();
			},
			getMyCollectList() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.pageInfo.num++;
				const { findMyCollectPageUrl, pageInfo: { num, size } } = this;
				this.$http.get(findMyCollectPageUrl, {
					params: { page: num, pagesize: size }
				}).then(res => {
					const { success, result } = res.data;
					console.log('。。。。。', result.items);
					if (success) {
						const { pages, items, page } = result;
						if (num === 1) this.MyCollectList = [];
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
						this.MyCollectList = this.MyCollectList.concat(items);
						console.log(this.MyCollectList,"收藏列表")
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
</style>
