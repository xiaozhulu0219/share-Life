<template>
	<!--个人页的一些页面--我的发布-->
	<view class="list-wrap">
		<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
			<view v-for="(item,index) in myPublishInforList" :key="index" class="card" @click="toMemInformationDetail(item)">
				<editInfor :editDetail="item" @editpopUp="handlePopUp(item)" ></editInfor>
				<image class="medias_size" :src="item.medias[0]" mode="widthFix" alt=""></image>
				<view>{{ item.textContent.substr(0, 35) }}</view>
			</view>
			<view v-if='isDownLoading' class="load-text">加载中....</view>
			<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多数据---</view>
		</scroll-view>
		<!-- <ToEditPublishPopup ref='toEditPublishPopup' :myFormData="editTarget"></ToEditPublishPopup> -->
	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import editInfor from "./editMyPublishInfor.vue"
	// import ToEditPublishPopup from '@/pages/member/toEditPublishPopup.vue';
	export default {
		name: 'MyPublishList',
		data() {
			return {
				pageInfo: {
					num: 0,
					size: 10
				},
				hasNext: true,
				isDownLoading: false,
				findMyPublishInforPageUrl: '/information/movements/findMyPublishInforPage',
				myPublishInforList: [],
				//unloveInforUrl: '/information/movements/unlove',
				//loveInforUrl: '/information/movements/love',
				//homeListUrl: '/information/movements/findHomePublishInforList',
				//homeList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
				fileUrl: configService.fileSaveURL,
			};
		},
		components:{
			editInfor,
		},
		created() {
			console.log(9999);
			this.getMyPublishInforList();
		},
		methods: {
			// 弹出底部编辑框
			// 还需要向上抛事件
			
			handlePopUp(item){
				// this.editTarget = item;
				this.$emit("editpopUp",item)
			},
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
						console.log(this.myPublishInforList ,"发布列表")
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
				// 直接跳转到动态页面
				
				uni.navigateTo({
					url: '/pages/home/homeInforDetail?from=member' + '&item=' + encodeURIComponent(JSON
						.stringify(item))
				});
				// uni.navigateTo({
				// 	url: '/pages/member/memberInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
				// })
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
		position: relative;
		
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
