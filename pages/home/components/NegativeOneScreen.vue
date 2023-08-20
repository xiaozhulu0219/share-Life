<template>
	<!-- 首页的负一屏页面 -->
	<view :class="{show:nScreenShow}" class="negativeOneScreen-container">
		<h2>负一屏</h2>
		<button size="mini" @click="handleClick" type="primary" plain="true">
			点击返回首页
		</button> 
 

	</view>
</template>  

<script>
	export default {
		
		props: {
			nScreenShow: Boolean,
			isLoading: false
		},
		
		methods: {
			
			
			handleClick() {
				// 回到首页
				this.$emit('nScreenHide')
			},
			

		}, 
		
	}
</script>

<style scoped>
	.negativeOneScreen-container {
		height: 100vh;
		width: 100vw;
		transition: 400ms;
		background-color: rgb(32, 33, 36);
		position: absolute;
		left: -100%;
		top: 0rpx;
		z-index: 999;
		color: #fff;
		text-align: center;
		padding: 200rpx 0;
		box-sizing: border-box;
		transform: translateX(0);
	}

	.negativeOneScreen-container.show {
		transform: translateX(100%);
	}
</style>
