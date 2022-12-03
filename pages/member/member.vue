<template>
	<view>
		<scroll-view scroll-y class="page">
			<!-- 头部logo-->
			<view class="UCenter-bg">
				<view class="padding text-right text-xl">
					<navigator url="/pages/user/userexit"><text class="cuIcon-exit"></text></navigator>
				</view>
				<view class="padding">
					<view class="margin-bottom-xl flex">
						<image src="https://static.jeecg.com/upload/test/login4_1595818039175.png" class="png round" mode="aspectFit"></image>
						<!-- <image :src="personalList.avatar" class="png round" mode="scaleToFill"></image>	 -->
						<!-- <image src="https://static.jeecg.com/upload/test/wave_1595818053612.gif" mode="scaleToFill" class="gif-wave"></image> -->
						<view class="margin-left-xl flex flex-sub flex-direction justify-around">
							<text class="text-bold">昵称</text>
							<text class="cuIcon-male text-blue"></text>
						</view>
					</view>
					<view class="flex justify-between align-center">
						<view class="flex text-sm">
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text :style="{color:'#ddd'}">我的发布</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text :style="{color:'#ddd'}">我的助力</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text :style="{color:'#ddd'}">收藏</text></view>
							<view class="flex flex-direction align-center margin-right-xl"><text>0</text><text :style="{color:'#ddd'}">赞过</text></view>
						</view>
						<navigator url="/pages/member/memberdetail">
							<view class="edit text-sm">
								编辑资料
							</view>
						</navigator>
					</view>
				</view>
			</view>
			<!-- <view class="padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right animation-slide-top" :style="[{animationDelay: '0.2s'}]">
					<view class="text-xl text-orange">{{personalList.username}}</view>
					<view class="margin-top-sm"><text class="cuIcon-people"></text> 用户</view>
				</view>

				<view class="flex flex-sub flex-direction animation-slide-top" :style="[{animationDelay: '0.2s'}]">
					<view class="text-xl text-green">{{personalList.post?personalList.post:'员工'}}</view>
					<view class="margin-top-sm"><text class="cuIcon-news"></text> 职务</view>
				</view>

			</view> -->


			<!-- 列表list-->

			<!-- <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">

				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/memberdetail" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="cuIcon-settingsfill text-cyan"></text>
						<text class="text-grey">编辑资料</text>
					</view>
				</navigator>

				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.15s'}]">
					<view class="content" >
						<text class="cuIcon-favorfill text-yellow"></text>
						<text class="text-grey">收藏</text>
					</view>
				</view>
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.3s'}]">
					<view class="content">
						<text class="cuIcon-redpacket_fill text-red"></text>
						<text class="text-grey">红包</text>
					</view>
				</view>
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.4s'}]" @tap="scan">
					<view class="content">
						<text class="cuIcon-scan text-red"></text>
						<text class="text-grey">扫码</text>
					</view>
				</view>
				<navigator class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.3s'}]" url="/pages/user/location" hover-class="none">
				</navigator>
				<navigator class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.2s'}]" url="/pages/user/location" hover-class="none">
					<view class="content" >
						<text class="cuIcon-location text-cyan"></text>
						<text class="text-grey">定位</text>
					</view>
				</navigator>


				<navigator class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.25s'}]" url="/pages/user/userexit" hover-class="none">
					<view class="content" >
						<text class="cuIcon-exit text-cyan"></text>
						<text class="text-grey">退出</text>
					</view>
				</navigator>
			</view> -->
			<!-- <view class="cu-tabbar-height"></view> -->
			<view class="mine-tab">
				<view class="tab-title flex justify-center">
					<view class="padding-sm" v-for="(item,index) in tabs" :key="index" @tap="clickTab(index)">
						<text :class="activeTab === index ? 'active' : ''">{{item.name}}</text>
					</view>
				</view>
				<swiper :current="activeTab" class="padding">
					<swiper-item v-for="(item,index) in tabs"  :key="index">
						<view class="swiper-item">{{item.name}}</view>
					</swiper-item>
				</swiper>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import api from '@/api/api'
	export default {
		name: "member",
		data() {
			return {
				activeTab:0,
				tabs:[{id:1,name:'我的发布'},{id:1,name:'我的助力'},{id:1,name:'收藏'},{id:1,name:'赞过'}],
				personalList:{
					avatar:'',
					realname:'',
					username:'',
					post:''
				},
				positionUrl:'/sys/position/list',
				departUrl:'/sys/user/userDepartList',
				userUrl:'/sys/user/queryById',
				postUrl:'/sys/position/queryByCode',
				userId:'',
				id:''
			};
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch',this.cur)
					this.userId=this.$store.getters.userid;
					this.load()
				},
			},
		},
		methods: {
			scan(){
				console.log("进来了")
				// #ifndef H5
				uni.scanCode({
					success: function (res) {
						console.log('条码res：' + res);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				// #endif
				// #ifdef H5
				this.$tip.alert("暂不支持")
				// #endif
			},
			load(){
				if(!this.userId){

					return;
				}
				this.$http.get(this.userUrl,{params:{id:this.userId}}).then(res=>{
					console.log("res",res)
					if (res.data.success) {
						let perArr = res.data.result
						let avatar=(perArr.avatar && perArr.avatar.length > 0)? api.getFileAccessHttpUrl(perArr.avatar):'/static/avatar_boy.png'
						this.personalList.avatar =avatar
						this.personalList.realname = perArr.realname
						this.personalList.username = perArr.username
						this.personalList.depart = perArr.departIds
						this.getpost(perArr.post)
					}
				}).catch(err => {
					console.log(err);
				});

			},
			getpost(code){
				if(!code||code.length==0){
					this.personalList.post='员工'
					return false;
				}
				this.$http.get(this.postUrl,{params:{code:code}}).then(res=>{
					console.log("postUrl",res)
					if (res.data.success) {
						this.personalList.post=res.data.result.name
					}
				}).catch(err => {
					console.log(err);
				});

			},
			clickTab(index){
				if(this.activeTab === index) return
				this.activeTab = index
			},
		}
	}
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
	
	.UCenter-bg .edit {
		padding: 10rpx 20rpx;
		border: 2rpx solid #fff;
		border-radius: 30rpx;
	}
	
	.UCenter-bg image {
		width: 160rpx;
		height: 160rpx;
	}

	.UCenter-bg .gif-wave{
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,.mapBox{
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,.mapBox{
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
