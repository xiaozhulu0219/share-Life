<template>
	<view class="homeInforItem-container">
		<!-- 单个动态组件 -->
		<view class="homeInforItem-header">
			<!-- 头像 -->
			<!-- 昵称 -->
			<!-- 时间 -->
			<view class="homeInforItem-header-info" @click="tomemberDetail(inforItem.uuId)">
				<view class="homeInforItem-header-avatar">
					<image class="header-avatar-img" :src="inforItem.avatar" mode="aspectFill"></image>
				</view>
				<view class="homeInforItem-header-nickname">
					{{inforItem.nickname.substr(0, 12)}}
				</view>
			</view>
			<view class="homeInforItem-header-time">
				{{inforItem.createDate}}
			</view>
			
		</view>
		<view class="homeInforItem-content" @click="toInforDetail">
			{{inforItem.textContent}}
		</view>
		<!-- 图片 图片不同的长度显示不同 -->
		<!-- 只有一张直接填充 -->
		<view class=""  @click="toInforDetail" v-if="inforItem.inforType==2">
			<view v-if="inforItem.medias.length==1"  class="homeInforItem-imgs-container img-container-1">
				<image class="img-container-1-img" :src="inforItem.medias[0]" mode="widthFix"></image>
			</view>
			<!-- 三张 -->
			<view v-if="inforItem.medias.length==3"  class="homeInforItem-imgs-container img-container-3">
				<image class="img-container-3-img" v-for="(img,idx) in inforItem.medias" :key="img" :src="img" mode="aspectFill"></image>
			</view>
			<!-- 六张 -->
			<view v-if="inforItem.medias.length==6"  class="homeInforItem-imgs-container img-container-6">
				<image class="img-container-6-img" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			<!-- 两张 -->
			<view v-if="inforItem.medias.length==2"  class="homeInforItem-imgs-container img-container-2">
				<image class="img-container-2-img" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			<!-- 四张 -->
			<view v-if="inforItem.medias.length==4"  class="homeInforItem-imgs-container img-container-4">
				<image class="img-container-4-img" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			
			<!-- 五张 -->
			<view v-if="inforItem.medias.length==5"  class="homeInforItem-imgs-container img-container-6 container-5">
				<image class="img-container-6-img img-5" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			<!-- 九张 -->
			<view v-if="inforItem.medias.length==9 || inforItem.medias.length==7"  class="homeInforItem-imgs-container img-container-9">
				<image class="img-container-9-img" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			<!-- 八张 -->
			<view v-if="inforItem.medias.length==8"  class="homeInforItem-imgs-container img-container-9 container-8">
				<image class="img-container-9-img img-8" v-for="(img,idx) in inforItem.medias" :key="img+idx" :src="img" mode="aspectFill"></image>
			</view>
			
		</view>
		
		<view class="homeInforItem-ipbox">
			<view class="homeInforItem-ipbox-title">
			<text class="cuIcon-location" style="font-size: 1.2em;"></text>	{{inforItem.ipAddress}}
			</view>
		</view>
		<view class="homeInforItem-operationbox">
			<view class="homeInforItem-operationbox-item" @click="toReport">
				<text class="cuIcon-info" style="font-size: 1.5em;"></text>
			</view>
			<view class="homeInforItem-operationbox-item" @click="toInforDetail">
				<text class="cuIcon-comment" style="font-size: 1.5em;"></text>
				 <text class="operationbox-item-text">{{inforItem.commentCount}}</text> 
			</view>
			<view class="homeInforItem-operationbox-item">
				<text class="cuIcon-like" style="font-size: 1.5em;" @click="toLoveInfor" v-if="inforItem.hasLoved == 0"></text>
					<!-- @click="loveInfor(item.inforId,index)" -->
				<text class="cuIcon-likefill" @click="toUnLoveInfor" style="color: #dd524d;font-size: 1.5em;" v-else></text>	
				<text class="operationbox-item-text">{{inforItem.loveCount}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data(){
			return {}
		},
		props:{
			inforItem:Object
		},
		methods:{
			// 添加事件
			tomemberDetail(uuId){
				this.$emit("tomemberDetailEvent",uuId)
			},
			toInforDetail(){
				this.$emit("toInforDetailEvent")
			},
			toReport(){
				this.$emit("toReportEvent")
			},
			toLoveInfor(){
				this.$emit("toLoveInforEvent")
			},
			toUnLoveInfor(){
				this.$emit("toUnLoveInforEvent")
			}
		}
	}
</script>

<style scoped>
	.homeInforItem-container{
		width: 90vw;
		padding:30rpx;
		box-sizing: border-box;
		
		margin: 20rpx auto;
		background-color: #fff;
		border-radius: 30rpx;
	}
	.homeInforItem-header{
		display: flex;
		align-items: center;
		color:#777;
	}
	.header-avatar-img{
		height:70rpx;
		width:70rpx;
		border-radius: 50%;
	}
	.homeInforItem-header-info{
		width: 70%;
		display: flex;
		flex : 1 1 auto;
		align-items: center;
	}
	.homeInforItem-header-time{
		text-align: right;
		width:30%;
		flex:0 0 auto;
		font-size: 0.8em;
	}
	.homeInforItem-header-nickname{
		margin-left: 20rpx;
	}
	.homeInforItem-content{
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}
	.homeInforItem-imgs-container{
		border-radius: 30rpx;
		overflow: hidden;
	}
	
	.img-container-1{
		
		max-width: 60%;
	}
	.img-container-1-img{
		width: 100%;
	}
	.img-container-3{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.img-container-3-img{
		width: 32%;
		height: 200rpx;
	}
	.img-container-6{
		width: 100%;
		height:410rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.img-container-6-img{
		height:200rpx;
		margin-bottom: 10rpx;
		width: 32%;
		height: 200rpx;
	}
	.img-container-2{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.img-container-2-img{
		height: 300rpx;
		width:49%;
		
		
	}
	.img-container-4{
		height: 510rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.img-container-4-img{
		height: 250rpx;
		width:49%;
		margin-bottom: 10rpx;
		
	}
	.container-5{
		justify-content: flex-start;
	}
	.img-5{
		margin-right: 8rpx;
	}
	.img-container-9{
		height: 620rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.img-container-9-img{
		height: 200rpx;
		width:32%;
		margin-bottom: 10rpx;
	}
	.container-8{
		justify-content: flex-start;
	}
	.img-8{
		margin-right: 8rpx;
	}
	.homeInforItem-ipbox{
		margin: 20rpx 0;
		margin-bottom: 30rpx;
		display: inline-block;
		padding:10rpx 20rpx;
		background-color: rgb(245,245,245);
		border-radius: 20rpx;
		font-size: 0.8em;
	}
	.homeInforItem-operationbox{
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.homeInforItem-operationbox-item{
		display: flex;
		align-items: center;
	}
	.operationbox-item-text{
		font-size: 1.2em;
		margin-left: 15rpx;
	}
</style>