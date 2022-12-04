<template>
	<view>
		<!--标题和返回-->
		<cu-custom :bgColor="NavBarColor">
			<block slot="content">首页</block>
		</cu-custom>

		<!-- 搜索框 -->
		<view class="search">
			<view class="search-bar-box">
				<image class="search-span" src="../../static/images/search.png" />
				<!-- @confirm="search" 点击 -->
				<input class="searchInput" v-model="inputValue" @confirm="search" placeholder="搜索内容" maxlength="10"
					   type="text" />
				<button class="search-btn">搜索</button>
			</view>
		</view>
		<!-- 搜索框 -->

		<!-- <view class="cu-tabbar-height"></view> -->
		<view class="mine-tab">
			<view class="tab-title flex justify-center">
				<view class="padding-sm" v-for="(item,index) in tabs" :key="index" @tap="clickTab(index)">
					<text :class="activeTab === index ? 'active' : ''">{{item.name}}</text>
				</view>
			</view>
			<swiper :current="activeTab" class="padding">
				<!--<swiper-item v-for="(item,index) in tabs"  :key="index">
					<view class="swiper-item">{{item.name}}</view>
				</swiper-item>-->
			</swiper>
		</view>


		<!--滚动加载列表-->
		<mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption"
					   @down="downCallback" @up="upCallback">
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item,index) in list" :key="index" @click="goHome">
					<view class="flex" style="width:600%">
						<text class="text-lg" style="font-size:220%;width: 500px; height: 200px; color: #000;padding-right: 200px">
							{{ item.nickName}}
							{{ item.createTime}}
							{{ item.createBy}}
							<image src="../../static/images/dianzan.png" mode="" @click="search"
								   style="width: 15px ;height: 14px"></image>
							<br>
							<image src="../../static/images/cai.png" mode="" @click="search"
								   style="width: 15px ;height: 14px"></image>
						</text>
					</view>
				</view>
			</view>
		</mescroll-body>


	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";

	export default {
		name: '助力详情',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				activeTab:0,
				tabs:[{id:1,name:'推荐'},{id:1,name:'助力'},{id:1,name:'百科'},{id:1,name:'游戏'}],
				personalList:{
					avatar:'',
					realname:'',
					username:'',
					post:''
				},
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				url: "/umsMember/list",
				inputValue: '',
				searchHistoryList: [] //搜索出来的内容
			};
		},
		methods: {
			goHome() {
				this.$Router.push({
					name: "index"
				})
			},
			/*	search() {
                    //表单项内容发生改变-- - 助力详情页
                    uni.request({
                        url: "company/movements/findPagePublishByRecommend",
                        success(res) {
                            console.log(res)
                        }
                    })



                },*/
			model(item, index) {
				this.inputValue = item
			},
			del(item, index) {
				this.searchHistoryList.splice(0, 1)
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
				this.inputValue = ''
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

				console.log(list[1].data);

				if (list[1].data) {
					this.searchHistoryList = JSON.parse(list[1].data);
				}
			}
		}
	}
</script>

<style lang='scss'>
	// 搜索框
	.search {
		width: 100%;
		height: 100rpx;
		margin-top: 2%;
	}

	.search-bar-box {
		display: flex;
		margin: 0 auto;
		width: 620rpx;
		height: 70rpx;
		border: 5rpx solid #00a8cc;
		border-radius: 50rpx;
	}

	.search-span {
		width: 100rpx;
		height: 56rpx;
		margin-top: 6rpx;
		margin-left: 30rpx;
	}

	.searchInput {
		width: 100%;
		margin-top: 10rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #7f7f81;
	}

	.search-btn {
		background-color: #00a8cc;
		/* Green */
		color: white;
		text-align: center;
		display: inline-block;
		font-size: 35rpx;
		width: 240rpx;
		height: 70rpx;
		line-height: 65rpx;
		border-radius: 30rpx;
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
</style>
