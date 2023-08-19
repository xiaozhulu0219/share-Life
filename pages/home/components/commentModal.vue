<template>
	<!-- 使用uni modal框 看看是否会被弹上去 -->
	<view class="" >
		<uni-popup ref="popup" type="bottom">
			<view 
			
			class="pop-container">
				输入框
				<input type="text">
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
	   methods:{
	      open(){
	        // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
	        this.$refs.popup.open();
	      }
	   }
	}
</script>

<style scoped>
	.pop-container{
		background-color: aquamarine;
		height:100px;
	}
</style>