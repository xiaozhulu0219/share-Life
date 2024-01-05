<template>
	<view class="editInfor-container" @click.stop="handleClick">
		<view class="editInfor-type">
			{{status}}
		</view>
		<view class="">
			<text style="font-size: 1.1em;font-weight: bold;" class="cuIcon-moreandroid"></text>
		</view>
		<!-- <ToEditPublishPopup ref='toEditPublishPopup' :myFormData="editDetail"></ToEditPublishPopup> -->
		
	</view>
</template>

<script>
export default {
	props:{
		editDetail:Object
	},
	computed:{
		status(){
			if(this.editDetail.seeType ==1){
				return '公开可见'
			}else if(this.editDetail.seeType ==2){
				return '仅自己可见'
			}
			return '公开可见'
		}
	},
	methods:{
		handleClick(){
			console.log("不想下传递")
			// 弹出modal
			// this.$refs.toEditPublishPopup.showModal();
			// this.$refs.editTab.open()
			this.$emit("editpopUp")
		}
	}
}
</script>

<style scoped>
	.editInfor-container{
		position: absolute;
		right:10rpx;
		top:10rpx;
		height:50rpx;
		width:170rpx;
		padding:0 10rpx;
		box-sizing: border-box;
		/* background-color: rgba(255,255,255,0.9); */
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.editInfor-type{
		font-size: 0.8em;
		color:#666;
	}
	
</style>