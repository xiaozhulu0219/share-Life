<template>
	<view class="avatarName">
		<!-- 头像和姓名组件 -->
		<view class="avatarName-avatarcontainer" @click="toMemberdetail">
			<image :src="avatarInfo.avatar" mode="aspectFill" style="height: 100%;width: 100%;border-radius: 50%;"></image>
		</view>
		<view class="avatarName-nickname">
			{{avatarInfo.nickname}}
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
export default {
	props:{
		avatarInfo:Object,
		
	},
	computed:{
		...mapState(['uuId'])
	},
	methods:{
		toMemberdetail() {
			//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
			console.log(this.avatarInfo.uuId,"要跳转的UUid")
			if (this.uuId == this.avatarInfo.uuId) {
				uni.navigateTo({
					url: '/pages/member/member'
				});
			} else {
				uni.navigateTo({
					url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(this.avatarInfo.uuId))
				});
			}
		}
	}
}
</script>

<style scoped>
	.avatarName{
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.avatarName-avatarcontainer{
		height: 70rpx;
		width:70rpx;
		flex : 0 0 auto
	}
	.avatarName-nickname{
		margin-left: 20rpx;
		flex: 1 1 auto;
	}
</style>