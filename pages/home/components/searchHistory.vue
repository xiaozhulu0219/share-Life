<template>
	<view class="search-history-container" v-if="isShow" :style="{top:50+topSpace-5+'px'}">
		<view class="search-history-title">
			<view class="search-history-title-left">
				历史搜索
			</view>
			<view @click="deleteAllHis" v-if="userSearchList.length!==0" class="search-history-title-right">
				<view class="cuIcon-deletefill">
					
				</view>
			</view>
		</view>
		<view class="search-history-null" v-if="userSearchList.length===0">
			<view class="cuIcon-explore">
				
			</view>
			<view class="">
				空空如也~
			</view>
		</view>
		<view class="search-history-result">
			<view class="search-history-item"  v-for="(it,index) in userSearchList" :key="index"  @click="submitSearch(it)">
				{{it}}
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from "vuex";
	export default{
		props:{
			isShow:false
		},
		computed:{
			...mapState(['userSearchList'])
		},
		methods:{
			...mapMutations(['initSearchList']),
			deleteAllHis(){
				// 删除所有搜索记录
				this.initSearchList()
			},
			submitSearch(target){
				// 点击就进行搜索
				console.log(target)
				this.$emit("searchHistory",target)
			}
		}
	}
</script>

<style scoped>
	.search-history-container{
		position:fixed;
		left: 0px;
		/* height:200rpx; */
		width:100%;
		border:1px solid #ccc;
		z-index: 999;
		background-color: rgba(255,255,255,0.8);
		padding:30rpx;
		
		
	}
	.search-history-title{
		display: flex;
		justify-content: space-between;
	}
	.search-history-title-left{
		font-size: 1.1em;
		font-weight: bold;
	}
	.search-history-null{
		height:150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	.cuIcon-explore{
		font-size: 4em;
	}
	.search-history-result{
		margin-top: 20rpx;
		display: flex;
	}
	.search-history-item{
		background-color: rgba(230,230,230,0.8);
		height:50rpx;
		padding:0 15rpx;
		border-radius: 25rpx;
		line-height: 50rpx;
		margin-right:30rpx;
		
		
	}
</style>