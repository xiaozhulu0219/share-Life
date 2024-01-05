<template>
	<!-- 用来添加到顶部bar中进行返回首页 -->
	<view class="cuIcon-radiobox" @click="toHome">
	
	</view>
</template>

<script>
	export default {
		methods:{
			toHome(){
				// 清空页面栈
				uni.reLaunch({
					url:'/pages/home/home'
				})
			}
		}
	}
</script>

<style>
</style>