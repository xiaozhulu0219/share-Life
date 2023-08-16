<template>
	<!--点击用户头像跳转的用户页（区别于用户自己看自己的个人页）-->
	<view class="memberDetial-container">
		<commonTab :isBack="true">
			<block slot="title">
				用户详情
			</block>
			<block slot="right">
				<view @click="handleClick" class="cuIcon-more" style="font-size:2em"></view>
			</block>
		</commonTab>
		<!-- :style="{marginTop:50+topSpace-5+'px',height:'calc(100vh' +  ' - ' + 45 + 'px' + ' - ' + topSpace + 'px' + ')'}" -->
		<!-- <view class="spaceTop " :style="{height:topSpace+'px',backgroundColor:'red'}">
			
		</view> -->
		<scroll-view scroll-y class="page" :style="{marginTop:50+topSpace-5+'px'}">
			<!-- <cu-custom style="" isBack="t" :backRouterName="backRouteName">
                <block slot="backText"></block>
            </cu-custom> -->
			
			<view class="UCenter-bg">

				<!-- 回到首页 -->
				<!-- <view class="cuIcon-home" @click="turnToHome">
						
					</view> -->
				<!-- 举报 -->

				<!-- <view class="cuIcon-more" @click="handleClick">
						
					</view> -->

				<block slot="backText"></block>

				<view class="padding">
					<view class="margin-bottom-xl flex personInfo">
						<image class="png_avatar round" :src="fileUrl+personalList.avatar" alt=""></image>
						<view class="margin-left-xl flex flex-sub flex-direction justify-around">
							<text class="text-bold">{{personalList.nickName}}</text>
							<text
								:class="[{'cuIcon-male text-blue': personalList.sex === 1},{'cuIcon-female text-pink': personalList.sex === 2}]"></text>
							<!--                            <view class="cuIcon-location"> </view>-->
							<view class="card-ipAddress">ip属地：{{personalList.ipAddress}}</view>
						</view>
					</view>
					<text class="flex flex-sub flex-direction signature">{{personalList.signature}}</text>
					<view class="flex justify-between align-center personData">
						<view class="flex text-sm">
							<view class="flex flex-direction align-center margin-right-xl"
								@click="toFocus(personalList.uuId)">
								<text>{{FocusFansNumVo.focusCount}}</text>
								<text :style="{color:'#ddd'}">关注</text>
							</view>
							<view class="flex flex-direction align-center margin-right-xl"
								@click="toFans(personalList.uuId)">
								<text>{{FocusFansNumVo.fansCount}}</text>
								<text :style="{color:'#ddd'}">粉丝</text>
							</view>
							<view class="flex flex-direction align-center margin-right-xl" @click="showLikeModel=true">
								<text>{{FocusFansNumVo.loveCollectCount}}</text>
								<text :style="{color:'#ddd'}">获赞与收藏</text>
							</view>
							<!-- 获赞收藏弹框 -->
							<memberLikeCountModal :show="showLikeModel" @close="showLikeModel=false"
								:FocusFansNumVo="FocusFansNumVo"></memberLikeCountModal>
							<view class="flex flex-direction align-center margin-right-xl">
								<text>{{HelpCompanyNumVo.helpComCount}}</text>
								<text :style="{color:'#ddd'}">助力</text>
							</view>
						</view>
						<view>
							<button class="edit text-sm" @click="focusUser(personalList.uuId)" v-if="iffocus == 0">
								关注
							</button>
							<button class="edit text-sm" @click="unFocusUser(personalList.uuId)"
								v-else-if="iffocus == 1">
								取消关注
							</button>
							<button class="edit text-sm" @click="focusUser(personalList.uuId)" v-else-if="iffocus == 2">
								回关
							</button>
							<button class="edit text-sm" @click="unFocusUser(personalList.uuId)"
								v-else-if="iffocus == 3">
								互相关注
							</button>

						</view>
					</view>
				</view>
			</view>

			<view class="mine-tab">
				
				<view class="tab-title flex justify-center">
					<view class="padding-sm" v-for="(item,index) in tabs" :key="index" @tap="clickTab(index)">
						<text class="tab-item" :class="activeTab === index ? 'active' : ''">{{item.name}}</text>
					</view>
				</view>
				<swiper :current="activeTab" class="padding" style="height: 100%;" @change="changeSwiper">
					<swiper-item class="swiper-item" v-for="(item,index) in tabs" :key="index">
						<view class="" style="height:100%" v-if="index === 0">
							<scroll-view class="scroll" scroll-y="true" @scrolltolower="reachBottom">
								<view v-for="(ite,inde) in focusOrFansPublishInforList" :key="inde"
									class="card-PublishInfor" @click="toMemInformationDetail(ite)">
									<view class="text-space"  v-if="ite.inforType ==1">
										
									</view>
									<image class="medias_size" v-if="ite.inforType!=1"   :src="ite.medias[0]" mode="widthFix" alt=""></image>
									<view>{{ ite.textContent.substr(0, 35) }}</view>
								</view>
								<view class="isNext" v-if="!publishinforNext">
									- 到底了-
								</view>
							</scroll-view>
						</view>



						<view v-for="(ite,inde) in focusOrFansHelpList" :key="inde" class="card-Help"
							v-if="index === 1">
							<view class="card-title">{{ite.companyName}}</view>
							<view v-for="(it,ind) in ite.commentVoList" :key="ind" class="">
								<view class="card-location">{{it.commentCreateDate}}</view>
								<view class="card-text">{{it.content}}</view>
							</view>
							<!-- 这是主力 -->
						</view>
						<view class="" style="height: 100%;" v-if="index === 2">
							<scroll-view class="scroll" scroll-y="true">
								<view v-for="(ite,inde) in focusOrFansLoveInforList" :key="inde"
									class="card-PublishInfor" @click="toMemInformationDetail(ite)">
									<AvatarName :avatarInfo="{nickname:ite.nickname,avatar:ite.avatar,uuId:ite.uuId}"></AvatarName>
									<view class="text-space"  v-if="ite.inforType ==1">
										
									</view>
									<image class="medias_size" v-if="ite.inforType !=1" :src="ite.medias[0]" mode="widthFix" alt=""></image>
									<view>{{ ite.textContent.substr(0, 35) }}</view>
								</view>
							</scroll-view>
						</view>


						<view v-if="index !== 0 && index !== 1 && index !== 2" class="swiper-item">什么乱七八糟的</view>

					</swiper-item>
				</swiper>
			</view>
		</scroll-view>
		<popForList ref="popforlist" :listInfo="popupInfo" @reportSubmit="handleSubmitRepot"></popForList>
	</view>
</template>

<script>
	import configService from '@/common/service/config.service.js'
	import memberLikeCountModal from '../member/memberLikeCountModal.vue';
	import commonTab from '../component/commonTab.vue';
	import popForList from "@/pages/publish/popForList.vue"
	import AvatarName from "../member/avatarName.vue"
	export default {
		name: 'homeMemberDetail',
		components: {
			memberLikeCountModal,
			commonTab,
			popForList,
			AvatarName
		},

		data() {
			return {
				userDetail: {},
				targetuuId: '',
				popupInfo: {},
				targetUuidItem: '',
				showLikeModel: false, // 是否显示获赞弹框
				iffocus: '', //0未关注对方、 1、我的关注、2、我的粉丝、3、互相关注 4、就是当前用户
				activeTab: 0,
				tabs: [{
					id: 1,
					name: '动态'
				}, {
					id: 2,
					name: '助力'
				}, {
					id: 3,
					name: '赞过'
				}],
				personalList: {
					avatar: '',
					realname: '',
					username: '',
					nickName: '',
					post: '',
					signature: ''
				},
				FocusFansNumVo: {
					focusCount: '',
					fansCount: '',
					loveCount: '',
					collectCount: '',
					loveCollectCount: '',
				},
				HelpCompanyNumVo: {
					helpComCount: '',
				},
				userUrl: '/sys/user/queryById',
				queryByUuIdUrl: '/sys/user/queryByUuId',
				findFocusOrFansPublishInforPageUrl: '/information/movements/findFocusOrFansPublishInforPage', //获取用户的动态发布数据
				findFocusOrFansLoveInforPageUrl: '/information/movements/findFocusOrFansLoveInforPage', //获取用户赞过的动态数据
				findFocusOrFansPublishComPageUrl: '/company/findFocusOrFansPublishComPage', //用户信息页公开可见助力返回列表
				userFocusUrl: '/information/followuser/userFocus',
				userUnFocusUrl: '/information/followuser/userUnFocus',
				FocusORFansUrl: '/information/followuser/FocusORFans',
				queryfocusFansByUuIdUrl: '/inforcommon/queryfocusFansByUuId',
				queryHelpComNumByUuIdUrl: '/comcommon/queryHelpComNumByUuId',
				reportSubmitUrl: '/reportviolations/sendReportViolations',
				userId: '',
				uuId: '',
				id: '',
				fileUrl: configService.fileSaveURL,
				backRouteName: 'index',
				focusOrFansPublishInforList: [],
				focusOrFansLoveInforList: [],
				focusOrFansHelpList: [],
				pagenum: 0,
				publishinforNext: true,
			};
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch2222', this.$store.getters);
					this.userId = this.$store.getters.userid;
					this.uuId = this.$store.getters.uuId;
				}
			}
		},
		created() {

		},
		onLoad(option) {
			//这里的item其实是uuid 这个uuid 是从动态也拿过来的 是准确的 this.uuid是当前登录用户 在这里用不正确
			const item = JSON.parse(decodeURIComponent(option.item));
			//this.myFormData = item
			console.log("个人页拿到了uuid准备大干一番", item);
			this.targetuuId = item;
			this.targetUuidItem = item
			this.findPersonInfor(item); //这是传参后继续调用方法的示例
			this.getFocusOrFansPublishInforList(item); //获取用户发布的动态列表
			this.getFocusOrFansLoveInforList(item); //获取用户赞过的动态列表
			this.getFocusOrFansHelpCompanyList(item); //获取用户助力的列表
			this.getFocusORFans(item); //判断两个用户的关注关系
			this.queryfocusFansByUuId(item);
			this.queryHelpComNumByUuId(item);
		},
		methods: {
			toMemInformationDetail(item){
				console.log(item,"详情")
				
				uni.navigateTo({
					url: '/pages/home/homeInforDetail?from=othermember' + '&item=' + encodeURIComponent(JSON
						.stringify(item))
				});
			},
			reachBottom() {
				// console.log("动态触底")
				this.getFocusOrFansPublishInforList(this.targetuuId)
			},
			turnToHome() {
				// 回到首页清空页面栈
				uni.reLaunch({
					url: '/pages/home/home'
				})
			},
			handleSubmitRepot(target, cb) {
				// 举报
				console.log("举报当前用户");
				console.log(target)
				uni.showLoading({
					title: 'loading...'
				})
				const submitObj = {
					type: target.type,
					uuId: target.detail.uuId,
					id: target.detail.id,
					reportContent: '',

				}

				this.$http.post(this.reportSubmitUrl, submitObj).then(res => {
					if (res.statusCode === 200) {
						// 举报成功
						uni.hideLoading();
						uni.showToast({
							title: "举报成功",
							icon: 'none'
						});
						cb(); // 弹框消失

					} else {
						uni.hideLoading();
						uni.showToast({
							title: "未知错误",
						});
					}
				})
			},
			handleClick() {
				const tar = {
					detail: {
						id: this.userDetail.id,
						uuId: this.targetuuId
					},
					type: '2',
					typeText: '用户',
					isUser: false
				}
				this.popupInfo = tar;
				this.$refs.popforlist.open()
			},
			changeSwiper(e) {

				const curTab = e.detail.current;
				this.activeTab = curTab;
				console.log(this.activeTab, "获取")
			},
			scan() {
				console.log('进来了');
				// #ifndef H5
				uni.scanCode({
					success: function(res) {
						console.log('条码res：' + res);
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				// #endif
				// #ifdef H5
				this.$tip.alert('暂不支持');
				// #endif
			},

			//根据uuId查询详情
			findPersonInfor(uuId) {

				console.log("进来了方法", uuId)
				this.$http.get(this.queryByUuIdUrl, {
					params: {
						uuId: uuId
					}
				}).then((res) => {
					console.log(res, "返回的数据")
					if (res.data.success) {
						this.personalList = res.data.result;
						//console.log("this.personalList.avatar", this.personalList.avatar);
						//console.log("res.data.result.avatar", res.data.result.avatar);
						console.log("查询个人信息返回的数据是：", res.data.result);
						this.userDetail = res.data.result
						if (res.data.result.avatar === "") {
							console.log("头像不存在")
						} else {
							console.log("有头像", res.data.result.avatar)
						}
					}
				})
			},
			//获取用户公开的动态列表
			getFocusOrFansPublishInforList(item) {
				if (!this.publishinforNext) {
					// console.log("没有数据来 返回")
					return;
				}
				this.pagenum += 1;
				console.log("加载第几页", this.pagenum)
				this.$http.get(this.findFocusOrFansPublishInforPageUrl, {
					params: {
						page: this.pagenum,
						pagesize: 10,
						uuId: item
					}
				}).then(res => {

					if (res.data.success) {
						const {
							pages,
							page
						} = res.data.result
						this.publishinforNext = (pages > page) ? true : false;
						console.log("res.data.result:", res.data.result);
						//console.log("数据条数:",res.data.result.items.length);
						for (let d of res.data.result.items) {
							let arr = d.medias.split(',')
							let arr2 = []
							for (let e of arr) {
								e = this.fileUrl + e
								arr2.push(e)
							}
							d.medias = arr2
						}
						if (this.focusOrFansPublishInforList.length > 0) {
							// 进行触底加载
							this.focusOrFansPublishInforList.push(...res.data.result.items);
							// console.log(this.focusOrFansPublishInforList,"嘻嘻嘻")
						} else {
							this.focusOrFansPublishInforList = res.data.result.items
						}

						console.log(res.data.result, "返回结果")
						//console.log("数据条数222:",this.myPublishInforList.length);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			//获取用户助力列表
			getFocusOrFansHelpCompanyList(item) {
				this.$http.get(this.findFocusOrFansPublishComPageUrl, {
					params: {
						page: 1,
						pagesize: 20,
						uuId: item
					}
				}).then(res => {
					if (res.data.success) {
						console.log(res.data.result);
						this.focusOrFansHelpList = res.data.result.items;
					}
				}).catch(err => {
					console.log(err);
				});
			},
			//获取用户的赞过的数据列表
			getFocusOrFansLoveInforList(item) {
				this.$http.get(this.findFocusOrFansLoveInforPageUrl, {
					params: {
						page: 1,
						pagesize: 10,
						uuId: item
					}
				}).then(res => {
					if (res.data.success) {
						//console.log("res.data.result:",res.data.result);
						//console.log("数据条数:",res.data.result.items.length);
						this.focusOrFansLoveInforList = res.data.result.items;
						for (let d of this.focusOrFansLoveInforList) {
							let arr = d.medias.split(',')
							let arr2 = []
							for (let e of arr) {
								e = this.fileUrl + e
								arr2.push(e)
							}
							d.medias = arr2
						}
						console.log(this.focusOrFansLoveInforList,"...")
					}
				}).catch(err => {
					console.log(err);
				});
			},
			//获取用户"关注"modal
			toFocus(uuID) {
				//console.log("点击关注按钮传递参数", uuID)
				uni.navigateTo({
					url: '/pages/member/focusModal?item=' + uuID
				})
			},
			//获取用户"粉丝"modal
			toFans(uuID) {
				//console.log("进来了666", myFormData)
				uni.navigateTo({
					url: '/pages/member/fansModal?item=' + uuID
				})
			},
			//点击关注按钮、关注用户
			focusUser(item) {
				console.log("点击了关注方法：", item);
				console.log("关注嘻嘻嘻!!")
				this.$http.get(this.userFocusUrl, {
					params: {
						uuId: item
					}
				}).then(res => {
					if (res.data.success) {
						//关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
						//this.iffocus = false;
						console.log("关注方法返回的提示信息为：", res.data.result);
						//重新调用接口判断两个用户之间的关系
						this.getFocusORFans(item);
						console.log()
						this.queryfocusFansByUuId(this.targetUuidItem)
					}
				}).catch(err => {
					console.log(err);
				});
			},
			//点击取消关注按钮、不再关注用户
			unFocusUser(item) {
				console.log("点击了取消关注方法：", item);
				this.$http.get(this.userUnFocusUrl, {
					params: {
						uuId: item
					}
				}).then(res => {
					console.log(res, "后端回复")
					if (res.data.success) {
						//关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
						//this.iffocus = true;
						console.log("取消关注方法返回的提示信息为：", res.data.result);
						//重新调用接口判断两个用户之间的关系
						this.getFocusORFans(item);
						console.log("嘻嘻")
						this.queryfocusFansByUuId(this.targetUuidItem)

					}
				}).catch(err => {
					console.log(err);
				});
			},
			//判断两个用户的关注关系
			getFocusORFans(uuId) {
				console.log("进来了方法", uuId)
				this.$http.get(this.FocusORFansUrl, {
					params: {
						uuId: uuId
					}
				}).then((res) => {
					if (res.data.success) {
						//console.log("两个用户的关注关系是：", res.data.result);
						this.iffocus = res.data.result;
						console.log("两个用户的关注关系是：", this.iffocus);
					}
				})
			},

			clickTab(index) {
				if (this.activeTab === index) return;
				this.activeTab = index;
			},
			//获取用户的粉丝和关注和获赞与收藏数量
			queryfocusFansByUuId(uuId) {
				//let a = this.uuId;
				console.log("获取用户的粉丝和关注和获赞与收藏数量", uuId)
				this.$http.get(this.queryfocusFansByUuIdUrl, {
					params: {
						uuId: uuId
					}
				}).then((res) => {
					if (res.data.success) {
						console.log("表单数据2222", res);
						this.FocusFansNumVo = res.data.result;
					}
				})
			},
			//获取助力数量
			queryHelpComNumByUuId(uuId) {
				//let a = this.uuId;
				console.log("获取助力数量", uuId)
				this.$http.get(this.queryHelpComNumByUuIdUrl, {
					params: {
						uuId: uuId
					}
				}).then((res) => {
					if (res.data.success) {
						console.log("表单数据333", res);
						this.HelpCompanyNumVo = res.data.result;
					}
				})
			},

		}
	};
</script>

<style lang="scss" scoped>
	.memberDetial-container {}

	.icon-bar {
		position: absolute;
		right: 30rpx;
		top: 10rpx;
		font-size: 1.5em;
		display: flex;
		width: 100rpx;
		height: 60rpx;
		justify-content: space-between;
		align-items: center;
		/* background-color: red; */


	}

	.UCenter-bg {
		background-color: rgba(0, 0, 0, .5);
		max-height: 500rpx;
		overflow: hidden;
		color: #fff;
		position: relative;

	}

	.UCenter-bg .edit {
		padding: 10rpx 20rpx;
		border: 2rpx solid #fff;
		border-radius: 30rpx;
		
	}

	.UCenter-bg image {
		width: 160rpx;
		height: 160rpx;
	}

	.UCenter-bg .personInfo {
		/* background-color: aquamarine; */
		margin-top: 30rpx;
	}

	.UCenter-bg .signature {
		margin-top: -30rpx;
		width: 100%;
		max-height: 110rpx;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.UCenter-bg .personData {
		margin-top: 30rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}

	/* .lower-bg {
		position: absolute;
		height: 200rpx;
		width: 100%;
		background-color: red;
		top:0rpx;
		left: -20rpx;
		z-index: 22;
		border-radius: 0rpx;
	} */

	.mine-tab {
		position: relative;
		top: -50rpx;
		height: calc(100vh - 200rpx - env(safe-area-inset-bottom) / 2);
		/* height: 300rpx; */
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
		margin-top: 50rpx;
		overflow-y: scroll;
		
	}

	.swiper-item {
		height: 100%;
		overflow-y: scroll;
	}

	.scroll {
		height: 100%;
	}

	.tab-title {
		color: #888;
		border-bottom: 1px solid #eee;
	}


	.tab-title text.active {
		color: #000;
		font-weight: bold;
	}

	.png_avatar {
		max-width: 120px;
		width: 120px;
		width: expression(this.width > 120 ? "120px" : this.width);
		height: 120px;
		height: expression(this.height > 120 ? "120px" : this.height);
	}

	.card-PublishInfor {
		background-color:$uni-bg-color-grey;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 30rpx;

		.card-title {
			font-weight: bold;
		}

		.card-text {
			font-size: 20rpx;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}
	}

	.medias_size {
		max-width: 180px;
		width: 180px;
		width: expression(this.width > 180 ? "180px" : this.width);
		height: 180px;
		height: expression(this.height > 180 ? "180px" : this.height);
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.card-Help {
		background-color: $uni-bg-color-grey;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;

		.card-title {
			font-weight: bold;
		}

		.card-text {
			font-size: 20rpx;
		}

		.card-location {
			position: absolute;
			right: 20rpx;
			font-size: 20rpx;
		}
	}

	.isNext {
		text-align: center;
		color: #ccc;
		margin-top: 20rpx;
	}

	.tab-title .padding-sm .tab-item {
		margin: 0 30rpx;
	}
	.text-space{
		height:40rpx;
	}
</style>
