<template>
	<view class="search-page">
		<!--首页引用的modal-->
		<!-- 这个modal 用户点击哪个标签 拿到value  作为参数 传到列表接口，然后拿回数据作展示  目前默认穿回来的数据字段都是一样的-->
		<!-- <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title"> 搜索
            </block>
        </commonTab> -->
		<searchHistory :isShow="historyShow" @searchHistory="handleSearchHistory"></searchHistory>
		
		<commonTab :isBack="true" >
			<block slot="title">
				<view class="search">
					<text class="text-gray iconfont icon-search"></text>
					<input @focus="handleFocus" class="uni-input" v-model="inputValue" maxlength="100" v-if="activeTab == 2"
						placeholder="请输入感兴趣的公司简称"></input>
					<input @focus="handleFocus"   class="uni-input" v-model="inputValue" maxlength="100" v-else
						placeholder="请输入感兴趣的动态内容"></input>
				</view>
			</block>
			<block slot="right">
				<view class="btn " form-type="submit" @click="searchList(inputValue)">搜索</view>
			</block>
		</commonTab>
		<!-- <view class="top-space" :style="{height:topSpace-5+'px'}">
		</view>
		<view class="search-top-container">
			<view class="search-top-left">
				<view @tap="BackPage" class="back">
					<text class="cuIcon-back"></text>
				</view>
			</view>
				<view class="search">
					<view class="search-left">
						<text class="text-gray iconfont icon-search"></text>
						<input class="uni-input" v-model="inputValue" maxlength="100" v-if="activeTab == 2"
							placeholder="请输入感兴趣的公司简称"></input>
						<input class="uni-input" v-model="inputValue" maxlength="100" v-else
							placeholder="请输入感兴趣的动态内容"></input>
					</view>
					<button class="btn" form-type="submit" @click="searchList(inputValue)">搜索</button>
				</view>
		</view> -->



		<!--        <view class="search-scroll">-->
		<!--          <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">-->
		<!--          <view v-for="(item,index) in 5" :key="index" class="detail">-->
		<!--            <view class="detail-content">-->
		<!--                {{activeTab}}-->
		<!--                这个搜索页以后看看做一些什么样的数据展示、-->
		<!--                可以是自己的搜索记录、热搜、红黑榜等等，-->
		<!--                如果是动态进来的展示一些点赞多的动态， 如果是助力进来的展示热门公司以及红黑榜-->
		<!--            </view>-->
		<!--        </view>-->
		<!--        </scroll-view>-->
		<!--        </view>-->
		<view class="list-wrap" @click="historyShow=false" :style="{marginTop:50+topSpace-5+'px'}">
			<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
				<view v-for="(item,index) in popularList" :key="index" class="card">
					<!--                <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt="" @click="toInformationDetail(item)"></image>-->
					<view class="space-text" v-if="item.inforType==1">
						
					</view>
					<image class="medias_size" :src="item.medias[0]" v-if="item.inforType!=1" mode="widthFix" alt=""
						@click="toInformationDetail(item)"></image>
					<view class="card-text" @click="toInformationDetail(item)">
						{{ contentFormat(item.textContent) }}
						<view class="colpose"></view>
					</view>
					<view class="card-line">
						<view class="left">
							<image class="card-avatar round" :src="item.avatar" mode="aspectFit" alt=""
								@click="toMemberdetail(item.uuId)"></image>
							<view class="card-nickname">{{item.nickname.substr(0, 12)}}</view>
						</view>
						<view class="right">
							<view class="cuIcon-location"> </view>
							<view class="card-ipAddress">{{item.ipAddress}}</view>
							<view class="cuIcon-like" style="color: #fbbd08" v-if="item.hasLoved == 0"
								@click="loveInfor(item.inforId,index)"></view>
							<view class="cuIcon-likefill" style="color: #dd524d" v-else
								@click="unloveInfor(item.inforId,index)"></view>
							<view class="card-loveCount">{{item.loveCount}}</view>
						</view>
					</view>
				</view>
				<view v-if='isDownLoading' class="load-text">加载中....</view>
				<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多动态了，快去分享你的美好生活吧---</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import Mixin from '@/common/mixin/Mixin.js';
	import MescrollMoreMixin from "@/components/mescroll-uni/mixins/mescroll-more.js";
	import commonTab from '../component/commonTab.vue';
	import configService from '@/common/service/config.service.js';
	import searchHistory from "@/pages/home/components/searchHistory.vue"
	import {mapState,mapMutations} from "vuex";
	export default {
		name: "homeSearch",
		mixins: [MescrollMixin, Mixin, MescrollMoreMixin],
		components: {
			commonTab,
			searchHistory
		},
		data() {
			return {
				historyShow:false,
				pageInfo: {
					num: 0,
					size: 10
				},
				hasNext: true,
				isDownLoading: false,
				popularList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
				activeTab: '',
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				inputValue: '',
				backRouteName: 'index',
				unloveInforUrl: '/information/movements/unlove',
				loveInforUrl: '/information/movements/love',
				popularListUrl: '/inforcommon/findPopularInforPage',
				fileUrl: configService.fileSaveURL,
				searchHistoryList: [{
					locationName: '反而可能',
					createTime: '2022-11-30 10:00:00',
					createBy: '本金额看见你有限公司',
					status: 1
				}, {
					locationName: '人家',
					createTime: '2022-11-30 10:00:00',
					createBy: '诶接耳机有限公司',
					status: 2
				}], //搜索出来的内容
				searchHistoryList2: [{
					locationName: '就是一个普通首页',
					createTime: '2022-12-12 10:00:00',
					createBy: '预科金融有限公司',
					status: 1
				}, {
					locationName: '斗战',
					createTime: '2022-12-12 10:00:00',
					createBy: '之乎者也有限公司',
					status: 2
				}], //搜索出来的内容(假数据)
			};
		},
		computed: {
			contentFormat() {
				return function(content) {
					return `${content.substring(0, 38)}${content.length > 38 ? ' ...' : ''}`;
				};
			},
			...mapState(['userSearchList'])
			
		},
		created() {
			//这个方法放在这里 这样获取，真机的时候不行
			//const { activeKey } = this.$route.query;
			//this.activeTab = activeKey;
			//console.log("拿到了activeKey", activeKey)
			this.getPopularPublishInforList();
		},
		onShow() {
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			console.log("当前页面的路由", curRoute);
			let curParam = routes[routes.length - 1].options; //获取路由参数
			console.log("当前页面的参数", curParam);
			console.log("当前页面的参数22:", curParam.activeKey);
			this.activeTab = curParam.activeKey;
		},
		// onLoad(option) { 在这里 onLoad 拿不到传递过来的参数，只能换 onShow
		//     const item = JSON.parse(decodeURIComponent(option));
		//     const item2 = JSON.parse(decodeURIComponent(option.activeKey));
		//     console.log("params过来了11", item)
		//     console.log("params过来了22", item2)
		// },
			
		methods: {
			...mapMutations(['changeSearchList','initSearchList']),
			handleFocus(){
				console.log("弹出搜索框");
				this.historyShow = true
			},
			// 触底加载
			reachBottom() {
				if (!this.hasNext) return;
				console.log('//// 触底加载');
				this.getPopularPublishInforList();
			},
			//当是从动态页进来时，默认获取的最热门动态的接口
			getPopularPublishInforList() {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.pageInfo.num++;
				const {
					popularListUrl,
					pageInfo: {
						num,
						size
					}
				} = this;
				this.$http.get(popularListUrl, {
					params: {
						page: num,
						pagesize: size
					}
				}).then(res => {
					const {
						success,
						result
					} = res.data;
					console.log('。。。。。', result.items);
					if (success) {
						const {
							pages,
							items,
							page
						} = result;
						if (num === 1) this.popularList = [];
						if (items.length) {
							for (const d of items) {
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
						this.popularList = this.popularList.concat(items);
						this.hasNext = pages > page;
						this.isDownLoading = false;
					} else {
						this.isDownLoading = false;
					}
				}).catch(err => {
					console.log(err);
					this.isDownLoading = false;
				});
			},
			//点击头像跳转用户详情
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
			//点击动态，跳转到动态详情
			toInformationDetail(item) {
				uni.navigateTo({
					url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			//喜欢动态
			loveInfor(id) {
				this.$http.get(this.loveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						this.getHomePublishInforList();
					}
				});
			},
			//取消喜欢动态
			unloveInfor(id) {
				this.$http.get(this.unloveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						this.getHomePublishInforList();
					}
				});
			},
			//搜索点击接口
			//这是之前关于搜索页面的一些方法、包括展示历史搜索记录、清空等 以后还得用、现在技术不行 暂时搁置
			handleSearchHistory(tar){
				// 直接进行搜索
				this.inputValue = tar;
				this.searchList();
			},
			searchList() {
				// 关闭弹框
				this.historyShow=false
				if (this.inputValue == '') {
					uni.showModal({
						title: '搜索内容不能为空'
					});
				} else {
					if (!this.searchHistoryList.includes(this.inputValue)) {
						this.searchHistoryList.unshift(this.inputValue);
						uni.setStorage({
							key: 'searchList',
							data: JSON.stringify(this.searchHistoryList)
						});
					} else {
						//有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
						let i = this.searchHistoryList.indexOf(this.inputValue);
						this.searchHistoryList.splice(i, 1);
						this.searchHistoryList.unshift(this.inputValue);
						uni.showToast({
							title: '不能重复添加'
						});
						uni.setStorage({
							key: 'searchList',
							data: JSON.stringify(this.searchHistoryList)
						});
						
						
					}
					// 将当前搜索记录添加一下
					this.changeSearchList(this.inputValue);
					
					console.log(this.searchHistoryList,"搜索历史")
					if (this.activeTab == 2) {
						uni.navigateTo({
							url: '/pages/home/homeComSearchResultPage?item=' + encodeURIComponent(JSON.stringify(
								this.inputValue))
						})
					} else {
						uni.navigateTo({
							url: '/pages/home/homeInforSearchResultPage?item=' + encodeURIComponent(JSON.stringify(
								this.inputValue))
						})
					}
				}
				this.inputValue = '';
			},
			//清空历史记录
			empty() {
				uni.showToast({
					title: '已清空'
				});
				uni.removeStorage({
					key: 'searchList'
				});

				this.searchHistoryList = [];
			},
			async onLoad() {
				let list = await uni.getStorage({
					key: 'searchList'
				});
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		},

	};
</script>


<style lang="scss" scoped>
	.top-space{
		background-color: #fff;
	}
	.search-top-container{
		display: flex;
		// hieght:200rpx;
		align-items: center;
		padding: 10rpx 0;
		box-sizing: border-box;
		border: 1px solid #eee;
		box-shadow: 0px 1px 5px 1px #eee;;
	}
	.search-top-left{
		width: 10%;
		flex:  0 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
	.search-top-right{
	}
	.search-page {
		height: 100vh;
		width: 100vw;
		box-sizing: border-box;
		// padding-top: 110rpx;
		background-color: #fff;
	}

	.search-scroll {
		height: calc(100vh - 200rpx);
	}


	// 搜索框
	.search {
		// background-color: red;
		// background-color: #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.search-left{
			width:80%;
		}
		.icon-search {
			position: absolute;
			left: 34rpx;
			top: 25rpx;
			font-size: 30rpx !important;
		}

		.uni-input {
			flex: 9;
			background-color: #fff;
			margin-right: 20rpx;
			height: 76rpx;
			border-radius: 38rpx;
			box-sizing: border-box;
			padding: 0 20rpx 0 56rpx;
			margin-left: 20rpx;
			color: #333
		}

		.btn {
			flex: 1;
			flex-shrink: 0;
			background-color: #fff;
			color: #0081ff;
		}

		.btn::after {
			border: none;
		}
	}

	.detail {
		padding: 30rpx;
		border-bottom: #ccc solid 1rpx;
		margin-top: 300rpx;
	}

	.detail-content {
		display: flex;
		justify-content: space-between;
	}

	.list-wrap {
		// height: calc(100vh - 280rpx);
		// margin-top: 200rpx;
		height: 100vh;
		// margin-top:20rpx ;
	}

	.card {
		background-color: #fff;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		line-height: 35rpx;
		/*行高*/
		border-bottom: #eee solid 5rpx;

		.card-line {
			font-weight: bold;
			display: flex;
		}

		.card-nickname {
			font-weight: bold;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 80%;
			overflow: hidden;
		}

		.card-ipAddress,
		.card-loveCount {
			font-weight: bold;
			margin-left: 8rpx;
		}

		.card-ipAddress {
			margin-right: 50rpx;
		}

		.card-loveCount {
			font-weight: bold;
			margin-left: 8rpx;
		}

		.card-text {
			font-size: 36rpx;
			margin-bottom: 10rpx;
			/*盒子间的距离*/
			line-height: 55rpx;
			/*行高*/
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}

		.card-avatar {
			max-width: 20px;
			width: 20px;
			height: 20px;
		}

	}

	.medias_size {
		max-width: 180px;
		width: 180px;
		height: 180px;
		overflow: hidden;
		margin-bottom: 20rpx;
		/*盒子间的距离*/
	}

	.load-text,
	.noMore {
		background-color: #fff;
		text-align: center;
		padding: 4rpx;
	}

	.noMore {
		color: #ccc;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		//flex: 1;
	}

	.left {
		overflow: hidden;
		flex: 3;
	}

	.right {
		flex-shrink: 0;
		flex: 2;
	}
	.btn-wrap{
	}
	.btn{
		height:76rpx;
		font-size: 1em;
		width: 100rpx;
		margin-left: -40rpx;
		line-height: 76rpx;
		text-align: center;
		border-radius: 30rpx;
	}
	.space-text{
		height:40rpx;
	}
</style>
