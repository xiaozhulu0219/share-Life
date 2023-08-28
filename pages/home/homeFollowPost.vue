<template>
	<view class="follow-container" >
		<scroll-view scroll-y 
		@scrolltolower="reachBottom" 
		style="height: 100%"
		refresher-enabled="true" 
		:refresher-triggered="triggered"
		:refresher-threshold="100" 
		refresher-background="#fff"
		@refresherrefresh="onRefresh">
			<view class="follow-post-wrap" v-for="(item,index) in followListStore" :key="item.id">
				<view class="follow-post-top">
					<view class="follow-post-top-left">
						<view class="follow-post-top-avatar" @click="toMemberdetail(item.uuId)">
							<image :src="item.avatar" class="top-avatar" mode="aspectFill"></image>
						</view>
						<view class="follow-post-top-nickName">
							{{item.nickname.substr(0, 12)}}
						</view>
						<view class="follow-post-publishDate">
							{{item.createDate}}
						</view>
					</view>
					<view class="follow-post-top-right">
						<view class="follow-post-body-info">
							<view class="post-body-info-item ">
								<view class="cuIcon-location" style="font-size:1.5em"> </view>
								{{item.ipAddress}}
							</view>
							<view class="post-body-info-item ">
								<view class="cuIcon-like" style="color: #fbbd08;font-size:1.5em" v-if="item.hasLoved == 0" @click="loveInfor(item.inforId,index)">
								</view>
								<view class="cuIcon-likefill" style="color: #dd524d;font-size:1.5em" v-else @click="unloveInfor(item.inforId,index)"></view>
								<view class="card-loveCount">{{item.loveCount}}</view>
							</view>
						</view>
					</view>
					
				</view>
				<view class="follow-post-body-text" v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
					 {{ item.textContent }}
				</view>
				<view class="follow-post-body-img" v-if="!item.imgIsNull" @click="toInformationDetail(item,index)">
					<image class="body-img-inner" :src="item.medias[0]" mode="widthFix"></image>
				</view>
				<view class="follow-post-body-text-imgnull" v-if="item.imgIsNull" @click="toInformationDetail(item,index)">
					 {{ item.textContent }}
				</view>
				
				

			</view>
		
			 <view class="loading-box">
			 	<view v-if='isDownLoading' class="load-text">加载中....</view>
			 	<view v-if="!isDownLoading && !hasNext" class="noMore">--到底了---</view>
			 </view>
			<view class="bottom-space">
				
				
			</view>
			
		</scroll-view>

	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js';
	import {mapState,mapMutations} from "vuex"
	export default {
		data() {
			return {
				triggered:false,
				unloveInforUrl: '/information/movements/unlove',
				loveInforUrl: '/information/movements/love',
				isDownLoading:false,
				hasNext:false,
				followList: [],
				followPostUrl: '/inforcommon/findFollowUserInforPage',
				fileUrl: configService.fileSaveURL,
			}
		},
		created() {
			// 判断当前的缓存列表中有没有数据
			if(this.followListStore.length>0){
				return
			}else{
				this.uploadFollowPost()
			}
		},
		computed:{
			contentFormat() {
			  return function(content) {
			    return `${content.substring(0, 38)}${content.length > 38 ? ' ...' : ''}`;
			  };
			},
			...mapState(['followListStore','followListPage'])
		},
		methods: {
			async onRefresh(){
				this.triggered = true;
				// 重置列表
				this.changeFollowListStore([]);
				// 重置頁碼
				this.followInitPage()
				await this.uploadFollowPost();
				this.triggered = false;
				console.log("關注頁面重新加載完畢")
				
			},
			loveInfor(id,index){
				console.log(index,"直接点赞的index");
				this.$http.get(this.loveInforUrl,{ params: { id: id } }).then((res)=>{
					 if (res.data.success){
						 // 在好友的緩存數組中更改當前點贊信息
						 this.loveInforFollowStore({
						 	index,
						 	count:res.data.result
						 })
					 }
				})
			},
			//取消喜欢动态
			unloveInfor(id,index) {
				this.$http.get(this.unloveInforUrl,{ params: { id: id } }).then(res=>{
					 if (res.data.success){
						 this.unloveInforFollowStore({
							 index,
							 count:res.data.result
						 })
					 }
				})
			},
			...mapMutations(['followPageNext','changeFollowListStore','followInitPage','loveInforFollowStore','unloveInforFollowStore']),
			toMemberdetail(myFormData) {
			    //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
			    if (this.$store.getters.uuId == myFormData) {
			        uni.navigateTo({
			            url: '/pages/member/member'
			        });
			    } else {
			        uni.navigateTo({
			            url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
			        });
			    }
			},
			toInformationDetail(item,index) {
				// 存一下item.id
				
			    uni.navigateTo({
			        url: '/pages/home/homeInforDetail?from=follow&index='+index+'&item=' + encodeURIComponent(JSON.stringify(item))
			    });
			},
			uploadFollowPost() {
				if (this.isDownLoading) return;
				 this.isDownLoading = true;
				 // 翻頁
				 this.followPageNext();
				 
				 const {num,size} = this.followListPage;
				 console.log("請求好友頁第",num)
				return this.$http.get(this.followPostUrl, {
					params: {
						page: this.followListPage.num,
						pagesize:size
					}
				}).then(res => {
					const {
						success,
						result
					} = res.data;
					if (success) {
						const {
							pages,
							items,
							page
						} = result;
						
						if (items.length) {
							for (const d of items) {
								if (d.medias === '') {
									d.imgIsNull = true
								}

								const arr = d?.medias?.split(',');
								const arr2 = [];
						  for (let e of arr) {
									e = this.fileUrl + e;
									arr2.push(e);
								}
								d.avatar = this.fileUrl + d.avatar;
								d.medias = arr2;

							}
						}
						// console.log('!!!!',pages,page)
						this.followList = [...items];
						const tempArr = [...this.followListStore,...items];
						// 存入緩存
						this.changeFollowListStore(tempArr)
						console.log(this.followList, "关注列表")
						this.hasNext = pages > page;
						this.isDownLoading = false;
						console.log("有没有下一页",this.hasNext)
					}
				})
			},
			reachBottom() {
				console.log("触底了");
				 if (!this.hasNext) return;
				// 触底加载
				this.uploadFollowPost()
			}
		}
	}
</script>

<style scoped>
	.follow-container {
		height: calc(100vh - 100rpx);
		background-color: #fff;
		font-size: 1em;
		overflow: hidden;
		box-sizing: border-box;
	}

	.follow-post-wrap {
		/* margin-bottom: 50rpx; */
		padding-top: 15rpx;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		border-bottom: 3px solid #eee;
	}

	.follow-post-top {
		/* border-bottom:1px solid #eee; */
		/* box-shadow: 0px 1px 5px 1px #eee; */
		/* border-top:1px solid #eee; */
		width: 100%;
		height: 80rpx;
		/* background-color: rgb(250, 250, 250); */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}
	.follow-post-top-left{
		display: flex;
		height:100%;
		align-items: center;
	}
	.follow-post-top-avatar {
		height: 60rpx;
		width: 60rpx;
		margin-right: 20rpx;
	}
	.follow-post-body-text-imgnull{
		padding: 30rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		
		overflow:hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.top-avatar {
		height: 100%;
		border-radius: 50%;
		width: 100%;
	}

	.follow-post-publishDate {
		color: #666;
		font-size: 0.8em;
		margin-left: 20rpx;
	}

	.follow-post-body-img {
		padding: 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.body-img-inner {
		width: 100%;
	}
	.follow-post-top-right{
		height:100%;
	}
	.follow-post-body-info{
		height:100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		
	}
	.post-body-info-item{
		margin-right: 30rpx;
		display: flex;
		height: 100%;
		align-items: center;
	}
	.follow-post-body-text{
		padding: 0 20rpx;
		overflow:hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 20rpx;
	}
	.loading-box{
		margin-bottom: 30rpx;
	}
	.bottom-space{
		height:100rpx;
	}
	.load-text{
		text-align:center;
		color:#ccc;
	}
	.noMore{
		text-align:center;
		color:#ccc;
	}
</style>
