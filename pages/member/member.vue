<template>
	<view>
		<scroll-view scroll-y class="page">
			<!-- 头部logo-->
			<view class="UCenter-bg">
				<view class="padding text-right text-xl text-exit">
					<navigator url="/pages/user/userexit"><text class="cuIcon-exit"></text></navigator>
				</view>
				<view class="padding">
					<view class="margin-bottom-xl flex personInfo">
						<!--						<image src="https://static.jeecg.com/upload/test/login4_1595818039175.png" class="png round" mode="aspectFit"></image>-->
						<image src="../../static/images/touxiang.jpg" mode="" @click="updateHeadPic" class="png round">
						</image>
						<!-- <image :src="personalList.avatar" class="png round" mode="scaleToFill"></image>	 -->
						<!-- <image src="https://static.jeecg.com/upload/test/wave_1595818053612.gif" mode="scaleToFill" class="gif-wave"></image> -->
						<view class="margin-left-xl flex flex-sub flex-direction justify-around">
							<text class="text-bold">{{personalList.nickName}}</text>
							<text :class="[{'cuIcon-male text-blue': personalList.sex === 1},{'cuIcon-female text-pink': personalList.sex === 2}]"></text>
            </view>
					</view>
					<text class="flex flex-sub flex-direction signature">{{personalList.signature}}</text>
					<view class="flex justify-between align-center personData">
						<view class="flex text-sm">
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text
									:style="{color:'#ddd'}">关注</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text
									:style="{color:'#ddd'}">粉丝</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text
									:style="{color:'#ddd'}">获赞与收藏</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text
									:style="{color:'#ddd'}">助力</text></view>
						</view>
						<navigator url="/pages/member/memberdetail">
							<view class="edit text-sm">
								编辑资料
							</view>
						</navigator>
					</view>
				</view>
			</view>

			<!-- <view class="cu-tabbar-height"></view> -->
			<view class="mine-tab">
				<view class="tab-title flex justify-center">
					<view class="padding-sm" v-for="(item,index) in tabs" :key="index" @tap="clickTab(index)">
						<text :class="activeTab === index ? 'active' : ''">{{item.name}}</text>
					</view>
				</view>
				<swiper :current="activeTab" class="padding">
					<swiper-item v-for="(item,index) in tabs" :key="index">
						<MyHelpCompanyList v-if="index === 1" />
						<view v-else class="swiper-item">{{item.name}}</view>
					</swiper-item>
				</swiper>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import api from '@/api/api';
	import MyHelpCompanyList from '../helpcompany/MyhelpCompanyList'
	export default {
		name: 'member',
		components:{
			MyHelpCompanyList
		},
		data() {
			return {
				activeTab: 0,
				tabs: [{
					id: 1,
					name: '我的发布'
				}, {
					id: 2,
					name: '我的助力'
				}, {
					id: 3,
					name: '收藏'
				}, {
					id: 4,
					name: '赞过'
				}],
				personalList: {
					avatar: '',
					realname: '',
					username: '',
					nickName: '',
					post: '',
					signature: ''
				},
				positionUrl: '/sys/position/list',
				departUrl: '/sys/user/userDepartList',
				userUrl: '/sys/user/queryById',
				postUrl: '/sys/position/queryByCode',
				userId: '',
				id: ''
			};
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch', this.cur);
					this.userId = this.$store.getters.userid;
					this.load();
				}
			}
		},
		methods: {
			scan() {
				console.log('进来了');
				// #ifndef H5
				uni.scanCode({
					success: function(res) {
						console.log('条码res：' + res);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				// #endif
				// #ifdef H5
				this.$tip.alert('暂不支持');
				// #endif
			},
			load() {
				if (!this.userId) {
					return;
				}
				this.$http.get(this.userUrl, {
					params: {
						id: this.userId
					}
				}).then(res => {
					if (res.data.success) {
						const { avatar: originalAvatar, departIds, post } = res.data.result;
            this.personalList = res.data.result;
						const avatar = (originalAvatar && originalAvatar.length > 0)
            ? api.getFileAccessHttpUrl(originalAvatar)
            : '/static/avatar_boy.png';
						this.personalList.avatar = avatar;
						this.personalList.depart = departIds;
						this.getpost(post);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			getpost(code) {
				if (!code || code.length == 0) {
					this.personalList.post = '员工';
					return false;
				}
				this.$http.get(this.postUrl, {
					params: {
						code: code
					}
				}).then(res => {
					console.log('postUrl', res);
					if (res.data.success) {
						this.personalList.post = res.data.result.name;
					}
				}).catch(err => {
					console.log(err);
				});
			},
			clickTab(index) {
				if (this.activeTab === index) return;
				this.activeTab = index;
			}
		}
	};
</script>

<style>
	.UCenter-bg {
		/* #ifdef MP-WEIXIN */
		/* background-image: url('https://static.jeecg.com/upload/test/blue_1595818030310.png'); */
		/* #endif */
		/* #ifndef MP-WEIXIN */
		/* background-image: url('/static/blue.png'); */
		/* #endif */
		/* background-size: cover; */
		background-color: rgba(0, 0, 0, .5);
		height: 500rpx;
		/* display: flex; */
		/* justify-content: center; */
		/* padding-top: 40rpx; */
		overflow: hidden;
		/* position: relative; */
		/* flex-direction: column; */
		/* align-items: center; */
		color: #fff;
		/* font-weight: 300; */
		/* text-shadow: 0 0 3px rgba(0, 0, 0, 0.3); */
	}

	/* .UCenter-bg text {
		opacity: 0.8;
	} */

	.text-exit {
		margin-top: 30rpx;
		position: absolute;
		top: 10px;
		right: 0;
		bottom: 0;
	}

	.UCenter-bg .edit {
		padding: 10rpx 20rpx;
		border: 2rpx solid #fff;
		border-radius: 30rpx;
	}

	.UCenter-bg image {
		width: 160rpx;
		height: 160rpx;
	}

	.UCenter-bg .personInfo {
		/* background-color: aquamarine; */
		margin-top: 30rpx;
	}

	.UCenter-bg .signature {
		margin-top: -30rpx;
		width: 100%;
		height: 110rpx;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.UCenter-bg .personData {
		margin-top: 30rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}

	.mine-tab {
		position: relative;
		top: -50rpx;
		height: calc(100vh - 200rpx - env(safe-area-inset-bottom) / 2);
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
	}

	.tab-title {
		color: #888;
		border-bottom: 1px solid #eee;
	}

	.tab-title text.active {
		color: #000;
		font-weight: bold;
	}
</style>
