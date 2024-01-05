<template>
	<view class="hometagslist-container">
		<commonTab :isBack="true">
			<block slot="title">
				标签
			</block>
			<block slot="right">
				<view class="cuIcon-roundadd" style="font-size:1.5em" @click="addNewTag"></view>
			</block>
		</commonTab>
		<view class="hometagslist-wrap" :style="{paddingTop:50+topSpace-5+'px'}">
			<view class="" v-if="tagsList.length==0" style="color: #aaa; text-align: center;">
				暂无标签 点击右上角进行新增
			</view>
			<view class="hometagslist-items">
				
				<view class="hometagslist-item-container" v-for="(item,index) in tagsList" :key="index">
					<view class="hometagslist-item-left" 
					:class="{active:item.hasUpLiked==1}"
					@click="loveTag(item,index)">
						{{item.content}}
					</view>
					<view class="hometagslist-item-right">
						<view class="cuIcon-like" v-if="item.hasUpLiked==0" style="color: orange;">

						</view>
						<view class="cuIcon-likefill" v-if="item.hasUpLiked==1" style="color: orangered;">
						
						</view>
						{{item.upLikeCount}}
					</view>
				</view>
				
				
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="addTags-container">
				<view class="addTags-input-box">
					<input placeholder="请输入需要添加的标签" v-model="taginpval" class="inp-box" type="text" @input="onInput">
					<view class="add-bth" @click="handleSubmit">
						提交
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		keyWords
	} from '@/common/util/constants';
	import commonTab from '@/pages/component/commonTab.vue';
	import textTip from "@/pages/component/textTip.js";
	export default {
		data() {
			return {
				tagsList: [],
				taginpval: '',
				getCompTagListUrl:'/company/tags/tagsList',
				addCompTagListUrl: '/company/tags/saveTagForCom',
				loveTagUrl:'/company/tags/likeTag',
				unLoveTagUrl:'/company/tags/disLikeTag',
				postId:'',
				getId:'',
				
			}
		},
		components: {
			commonTab
		},
		onLoad(option) {
			console.log(option, "参数")
			const item = JSON.parse(decodeURIComponent(option.item));
			console.log(item);
			this.tagsList = item.tagListInfo;
			this.postId = item.id;
			this.getId = item.tianyanchaId
		},
		mixins: [textTip],
		methods: {
			loveTag(tar,idx){
				console.log(tar);
				console.log("是否点赞");
				if(tar.hasUpLiked==0){
					// 未点赞 请求点赞
					this.$http.get(this.loveTagUrl,{params:{id:tar.id}}).then(res=>{
						// console.log("点赞结果",res);
						if(res.data.success){
							this.tagsList[idx].upLikeCount = res.data.result;
							this.tagsList[idx].hasUpLiked = 1;
						}
					})
				}if(tar.hasUpLiked==1){
					// 已经点赞 取消点赞
					this.$http.get(this.unLoveTagUrl,{params:{id:tar.id}}).then(res=>{
						console.log("点赞结果",res);
						if(res.data.success){
							this.tagsList[idx].upLikeCount = res.data.result;
							this.tagsList[idx].hasUpLiked = 0;
						}
					})
				}
			},
			onInput() {
				let val = this.taginpval
				if (val !== null) {
					// console.log(value,'2222')
					for (const i in keyWords) {
						const reg = new RegExp(keyWords[i], 'g');
						val = val.replace(reg, ''.padEnd(keyWords[i].length, '*'));
					}
					this.$nextTick(() => {
						this.taginpval = val;
					});
					// console.log(value,'3333')
					// 判断当前是否添加了标签

				}
			},
			addNewTag() {
				// 添加新标签
				this.$refs.popup.open();
			},
			getCompTagList(){
				this.$http.get(this.getCompTagListUrl,{
					params:{
						id:this.getId
					}
				}).then(res=>{
					console.log("公司标签",res)
					// 截取前三个
					this.tagsList = res.data.result.items;
				
				})
			},
			handleSubmit() {
				// 提交新标签
				console.log(this.taginpval)
				if (this.taginpval === '' || this.taginpval.indexOf('*') != -1) {
					console.log('动态内容出现了违规词语、已被拦截：', this.taginpval);
					this.showTextTip('标签');
					this.taginpval=''
					return

				}
				// 进行提交
				this.$http.post(this.addCompTagListUrl, {
					helpCompanyId: this.postId,
					tag: this.taginpval
				}).then(res => {
					if(res.data.success){
						uni.showToast({
							title:"添加成功",
							icon:'none'
						})
						this.getCompTagList();
						this.$refs.popup.close();
						this.taginpval = ''
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.hometagslist-container {
		height: 100vh;
		width: 100vw;

	}


	.hometagslist-wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
	}

	.hometagslist-items {
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
	}

	.hometagslist-item-container {
		display: flex;
		margin: 15rpx;


	}

	.hometagslist-item-left {
		padding: 20rpx;
		border-radius: 40rpx;
		// background-color: rgb(135,116,254);
		background-color: rgb(220, 220, 220);
		// $uni-color-primary
		color: #fff;
	}
	.hometagslist-item-left.active{
		background-color: rgb(135,116,254);
	}

	.hometagslist-item-right {
		display: flex;
		margin-left: 10rpx;
		align-items: center;
	}

	.addTags-container {
		height: 100rpx;
		width: 100vw;
		background-color: #fff;
		padding: 5rpx;
		box-sizing: border-box;
	}

	.addTags-input-box {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: space-between;
	}

	.inp-box {
		flex: 1 1 auto;
	}

	.add-bth {
		height: 100%;
		width: 15%;
		flex: 0 0 auto;
		border-radius: 10rpx;
		background-color: rgb(135, 116, 254);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
</style>
