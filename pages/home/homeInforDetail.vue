<template>
	<!--这个是首页点击动态后跳转的动态详情页-->
	<view class="container">
		<commonTab v-if="this.fromPage!=='member'" :isBack="true" :backRouterName="backRouteName">
			<block slot="title">
				<image class="medias_avatar round" :src="myFormData.avatar" alt=""
					@click="toMemberdetail(myFormData.uuId)" style="margin-right: 20rpx"></image>
				{{myCommentForm.nickname}}
			</block>
		</commonTab>
		<commonTab v-if="this.fromPage==='member'" :isBack="true" >
			<block slot="title">
				<text>动态详情</text>
			</block>
			<block slot="right" >
			    <view @click="showModal" class="cuIcon-more" style="font-size:2em"></view>
			</block>
		</commonTab>
		<view class="card" :style="{marginTop:CustomBar+'px'}" >
			 
				
			<view class="" @touchstart="touchstart({...myFormData,isinfor:true},false)" @touchend="touchend">
				
			
			<view v-if="myFormData.imgIsNull" class="space-for-no-img" >

			</view>
			<view class="" v-if="!myFormData.imgIsNull" >

				<swiper v-if="myFormData.medias.length>1" indicator-dots indicator-color="#94afce"
					indicator-active-color="red" style="height: 1000rpx;width: 750rpx">
					<view class="" v-if="">

					</view>
					<swiper-item v-for="(item, index) in myFormData.medias" :index="index" :key="index">
						<image :src="item" @click="TanPreviewImage(index)" mode="aspectFit"
							style="height: 980rpx;width: 720rpx"></image>
					</swiper-item>
				</swiper>
				<swiper v-else style="height: 1000rpx;width: 750rpx">
					<swiper-item v-for="(item, index) in myFormData.medias" :index="index" :key="index">
						<image :src="item" @click="TanPreviewImage(index)" mode="aspectFit"
							style="height: 980rpx;width: 720rpx"></image>
					</swiper-item>
				</swiper>
			</view>

			<view class="card-text text-wrap " :class="{autoHeight:textMore,maxText:!textMore}" >
				{{myFormData.textContent}}
				<view class="text-box" @click="showMoreText" v-if="!textMore">
					--点击展开更多--
				</view>

			</view>
			<view v-if="myFormData.imgIsNull" class="space-for-no-img" >

			</view>
			</view>
			<view class="card-line">
				<view class="card-createDate">{{myCommentForm.createDate}}</view>
				<view class="cuIcon-location"></view>
				<view class="card-ipAddress">{{myFormData.ipAddress}}</view>
			</view>

			<view class="card-line">
				<view class="iconfont ml-1" style="font-size: 45rpx; color: #fbbd08;" v-if="myCommentForm.hasLiked == 0"
					@click="likeInfor(myCommentForm.id)">&#xe8ad
				</view>
				<view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" v-else
					@click="dislikeInfor(myCommentForm.id)">&#xe60f
				</view>
				<view class="card-likeCount">{{myCommentForm.likeCount}}</view>
				<view class="cuIcon-like" style="font-size: 45rpx; color: #fbbd08;" v-if="myCommentForm.hasLoved == 0"
					@click="loveInfor(myCommentForm.inforId)"></view>
				<view class="cuIcon-likefill" style="font-size: 45rpx; color: #dd524d;" v-else
					@click="unloveInfor(myCommentForm.inforId)"></view>
				<view class="card-loveCount">{{myCommentForm.loveCount}}</view>
				<view class="cuIcon-comment" style="font-size: 45rpx;"></view>
				<view class="card-commentCount">{{myCommentForm.commentCount}}</view>
			</view>
			<view class="card-divider"></view>
			
			<view class="list-wrap">
				<scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;" :scroll-top="scrollTop">
					<view v-for="(item,index) in commentRenderList" :key="index" class="comment">
						<view class="comment-parent" @touchstart="touchstart(item,false)" @touchend="touchend">
							<image class="comment-avatar round sm" :src="item.avatar" alt=""
								@click="toMemberdetail(item.uuId)"></image>
							<view class="comment-nickcon">
								<view class="comment-nickname">{{ item.nickname }}</view>
								<view class="comment-content" @click="tofocus(item.id,item)">{{ item.content }}</view>
								<view class="comment-createDate">
									{{item.createDate}}
									<view style="margin-left: 15rpx">{{ item.ipAddress }}</view>
									<text style="margin-left: 15rpx" @click="tofocus(item.id,item)">回复</text>
								</view>
							</view>
							<view class="comment-iconlikeCount">
								<view class="iconfont ml-1" style="font-size: 30rpx; color: #fbbd08;;"
									v-if="item.hasLiked == 0" @click="likeComment(item.id)">&#xe8ad
								</view>
								<view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;" v-else
									@click="dislikeComment(item.id)">&#xe60f
								</view>
								<view class="comment-likeCount">{{item.likeCount}}</view>
							</view>
						</view>

						<view v-if="item.hasChild=='1'">
							<text v-if="item.loadingState=='loadmore'" style="margin-left: 150rpx; font-size:30rpx;">
								—展开{{item.childCommentList.length}}条回复—
							</text>
							<!-- <text v-if="loadingState!='loadmore'">{{loadingState=="nomore"?"收起":"展开更多"}}</text>-->
							<view v-if="item.loadingState=='loadmore'" class="cuIcon-triangledownfill"
								@click="showMore(index)" style="font-size: 40rpx;  margin-left: 200rpx"></view>

							<view v-if="item.loadMoreStatus===true" v-for="(sonitem,inde) in item.childCommentList"
								:key=inde @touchstart="touchstart({...sonitem,fartherindex:index,fartherid:item.id},true)" @touchend="touchend">
								<view class="comment-son">
									<image class="comment-avatar round sm" :src="fileUrl+sonitem.avatar" alt=""
										@click="toMemberdetail(sonitem.uuId)"></image>
									<view class="comment-nickcon">
										<view class="comment-nickname">{{ sonitem.nickname }}</view>
										<view class="comment-content" @click="tofocus(item.id,sonitem,'replayto')">
											<text class="replay-name" v-if="sonitem.commentedNickName">回复<text
													class="replay-name-inner">{{sonitem.commentedNickName}} :</text>
											</text> {{ sonitem.content }}
										</view>
										<view class="comment-createDate">
											{{sonitem.createDate}}
											<view style="margin-left: 15rpx">{{ sonitem.ipAddress }}</view>
											<text style="margin-left: 15rpx"
												@click="tofocus(item.id,sonitem,'replayto')">回复</text>
										</view>
									</view>

									<view class="comment-iconlikeCount">
										<view class="iconfont ml-1" style="font-size: 30rpx; color: #fbbd08;;"
											v-if="sonitem.hasLiked == 0" @click="likeComment(sonitem.id,item.id)">
											&#xe8ad
										</view>
										<view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;" v-else
											@click="dislikeComment(sonitem.id,item.id)">&#xe60f
										</view>
										<view class="comment-likeCount">{{sonitem.likeCount}}</view>
									</view>
								</view>
							</view>
						</view>

					</view>
					<view v-if="inforCommentsList.length>0" class="card-divider"></view>
					<view v-if='isDownLoading' class="load-text">评论加载中....</view>
					<view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多评论了，快快留下你的赞美吧---</view>

				</scroll-view>

			</view>
			<view class="space">
				<!-- 一个底部的垫片 -->

			</view>
		</view>

		<!-- <view class="footer">
			<input :focus="focus" class="input-form"
			 v-model="inputValue" maxlength="200"
			  :placeholder="placeholderText"
				@input="onInput(inputValue)" />
			<button class="input-button" form-type="submit" @click="saveComment(inputValue)">发送</button>
		</view> -->


		<view class="foot-panel" @click="commentIsShow">
			<view class="foot-panel-inner">
				<view class="foot-inner-left">
					<text class="iconfont icon-wenbenshuru"></text>
				</view>
				<view class="foot-inner-right">
					说点什么...
				</view>
			</view>

		</view>



		<commentPanel ref="commentPanel" :isShow="commentShow" @cancelComment="handleCancelComment"
			@commentSubmit="handleCommentSubmit" :placeholderText="placeholderText"></commentPanel>

		<popForList ref="popforlist" 
		:listInfo="popupInfo" 
		@reportSubmit="handleSubmitRepot"
		@deleteSubmit="handleSubmitDelete"
		></popForList>
		<ToEditPublishPopup ref='toEditPublishPopup' :myFormData="myFormData"></ToEditPublishPopup>

	</view>

</template>

<script>
	import myDate from '@/components/my-componets/my-date.vue';
	import configService from '@/common/service/config.service.js';
	import commonTab from '../component/commonTab.vue';
	import commentPanel from "./components/commentPanel.vue"
	import popForList from "@/pages/publish/popForList.vue"
	import ToEditPublishPopup from '@/pages/member/toEditPublishPopup.vue';
	import {
		mapMutations,
		mapState
	} from "vuex"

	import {
		keyWords
	} from '../../common/util/constants';

	export default {
		name: 'homeInformationDetail',
		components: {
			myDate,
			commonTab,
			commentPanel,
			popForList,
			ToEditPublishPopup
		},
		props: {
			formData: {
				type: Object,
				default: () => {},
				required: false
			}
		},

		data() {
			return {
				myFormData: {
				    latitude: '',
				    longitude: '',
				    location: '',
				    medias: '',
				    textContent: '',
				    uuId: '',
				    avatar: '',
				    id: ''
				},
				// 重置当前的滚动条
				
				popupInfo:{},
				isLongPress: false,
				longpressTimer: null,
				textMore: false,
				fromPage: '',
				fatherIndex: 0,
				alreadyComment: [],
				scrollTop: 0,
				isDirectedComment: false,
				commentShow: false,
				placeholderText: '评论字数最多输入200字',
				loadingState: 'loadmore', //加载前值为loadmore，没有数据为nomore
				zhankai: false,
				focus: false,
				isfocus: true,
				pageInfo: {
					num: 1,
					size: 10
				},
				// 回复具体的昵称
				targetNickname: '',
				hasNext: true,
				isDownLoading: false,
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				loading: false,
				backRouteName: 'index',
				arr: [],
				inputValue: '',
				findInforCommentsPageUrl: '/information/comments/list',
				findSonCommentListPageUrl: '/information/comments/findSonCommentListById',
				url: {
					deleteInforUrl:'/information/movements/deleteInfor',
					findPublishInforByIdUrl: '/information/movements/findPublishInforById',
					saveCommentUrl: '/information/comments/saveCommentForInfor',
					saveCommentForCommentUrl: '/information/comments/saveCommentForComment',
					likeCommentUrl: '/information/comments/like',
					dislikeCommentUrl: '/information/comments/dislike',
					//likeSonCommentUrl: '/information/comments/like',
					deleteCommentUrl: '/information/comments/deleteComment',
					likeInforUrl: '/information/movements/like',
					dislikeInforUrl: '/information/movements/dislike',
					loveInforUrl: '/information/movements/love',
					unloveInforUrl: '/information/movements/unlove',
					reportSubmitUrl:'/reportviolations/sendReportViolations',
				},
				text: '',
				vBlock: 'block',
				toupiao: false,
				voteBc: 'white',
				voteList: [{
						id: 1,
						content: ''
					},
					{
						id: 2,
						content: ''
					},
					{
						id: 3,
						content: ''
					}
				],
				publishId: '',
				commentId: '',
				myFormData: {
					latitude: '',
					longitude: '',
					location: '',
					medias: '',
					textContent: '',
					uuId: '',
					avatar: ''
				},
				myCommentForm: {
					latitude: '',
					longitude: '',
					location: '',
					medias: '',
					textContent: '',
					uuId: '',
					avatar: '',
					likeCount: '',
					loveCount: '',
					createDate: '',
					nickname: '',
					id: '',
					inforId: ''
				},
				fileUrl: configService.fileSaveURL,
				inforCommentsList: [],
				inforSonCommentsList: []
			};
		},
		computed: {
			// ...mapState(['uuId']),
			commentRenderList() {
				return this.inforCommentsList.map((item) => {
					//评论是否进行过二级评论
					const tempChild = [...item.childCommentList];
					const temObj = {
						...item,
						childCommentList: tempChild
					}
					if (this.alreadyComment.includes(item.id)) {
						temObj.loadMoreStatus = true;
						temObj.loadingState = 'nomore';

					}
					return temObj
				})
			}
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch!!!!', this.cur);
					this.userId = this.$store.getters.userid;
					this.uuId = this.$store.getters.uuId;
					console.log(this.userId, this.uuId)
				}
			}
		},

		created() {
			this.getInforCommentsList(this.myFormData.inforId);
			this.findPublishInfor(this.myFormData.inforId);
		},
		onLoad(option) {
			console.log(option, "父级传递过来的参数")
			const item = JSON.parse(decodeURIComponent(option.item));
			if (option.from === 'follow') {
				// console.log("從好友列表頁面進入");
				this.fromPage = 'follow'
			} else if (option.from === 'hot') {
				this.fromPage = 'hot'
			}else if(option.from ==='infor'){
				this.fromPage = 'infor'
			}else if(option.from ==='member'){
				// 从个人资料过来
				this.fromPage = 'member'
			}
			console.log(this.fromPage)
			this.fatherIndex = option.index
			this.myFormData = item;
			console.log(item)
			console.log('this.myFormData1:', this.myFormData);
			console.log('this.myFormData2:', this.myFormData.medias);
			console.log('this.myFormData3:', this.myFormData.medias.length);
			this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
			this.myFormData = item
		},
		methods: {
			showModal() {
			    this.$refs.toEditPublishPopup.showModal();
			},
			handleSubmitRepot(target,cb){
				// 举报评论
				// 不分一级二级
				console.log(target,"举报")
				const submitObj = {
					type:target.type,
					id:target.detail.id,
					reportContent:target.detail.content,
					uuId:target.detail.uuId
				}
				if(target.type==='1'){
					// 如果举报是动态需要拿到textContent
					submitObj.reportContent = target.detail.textContent
				}
				// console.log(submitObj,"举报内容")
				this.$http.post(this.url.reportSubmitUrl,submitObj).then((res)=>{
						if(res.statusCode===200){
							// 举报成功
							uni.hideLoading();
							uni.showToast({
								title:"举报成功",
								icon:'none'
							});
							cb();// 弹框消失
							
						}else{
							uni.hideLoading();
							uni.showToast({
								title:"未知错误",
							});
						}
					
				})
			},
			handleSubmitDelete(target,cb){
				// 删除当前评论 
				console.log(target,"要删除的评论");
				uni.showLoading({
					title:'loading...'
				})
				// 判断删除的是不是动态
				// 如果删除的是动态 需要 提交删除请求
				// 刷新仓库
				// 路由跳转首页
				if(target.detail.isinfor){
					
					console.log(target.detail,"删除详情")
					const deleteId = target.detail.inforId;
					
					this.$http.delete(this.url.deleteInforUrl + '?id=' + deleteId).then(async res => {
					    console.log("结果数据", res)
					    if (res.data.success) {
							// 本地仓库刷新
							// 重新请求数据
							uni.hideLoading();

							cb()
							this.changehomeListStore([]);
							this.initPage();
							// 路由跳转
							uni.navigateTo({
								url:'/pages/home/home',
								complete(){
									uni.showToast({
										title:'删除成功',
										icon:'none'
									})
								}
							})
							// await this.getHomePublishInforList();
							
							
					    }
					}).catch(e => {
					    console.log("al delUrl请求错误2", e)
					});
					return 
				}
				if(target.detail.isChildComment){
					// 删除的是二级评论
					console.log("正在删除回复的回复",target)
					const id = target.detail.id;
					const fartherindex = target.detail.fartherindex;
					const publishId = this.myFormData.id
					console.log(id,publishId,'删除详情')
					this.$http.delete(this.url.deleteCommentUrl+  '?id=' + id + '&publishId=' +publishId).then(async res=>{
						if(res.data.message){
							// 删除成功 重新请求列表
							// 当前数组进行切割
							// 找到index
							const targetIndex = this.inforCommentsList[fartherindex].childCommentList.findIndex((item)=>{
								return item.id ===id
							})
							this.inforCommentsList[fartherindex].childCommentList.splice(targetIndex,1);
							// await this.getInforCommentsList(this.myFormData.inforId);
							// this.scrollTop = this.scrollTop === 0 ? 1 : 0;
							uni.hideLoading();
							uni.showToast({
								icon:'none',
								title:'删除成功',
							})
							cb();
						}
					})
				}else{
					// 删除的是一级评论
					// 重新请求列表
					
					console.log(this.myFormData)
					const id = target.detail.id;
					const publishId = this.myFormData.id
					// 
					this.$http.delete(this.url.deleteCommentUrl+  '?id=' + id + '&publishId=' +publishId).then(async res=>{
						if(res.data.message){
							// 删除成功 重新请求列表
							this.pageInfo.num = 1;
							// 滚动条置为0
							await this.getInforCommentsList(this.myFormData.inforId);
							this.scrollTop = this.scrollTop === 0 ? 1 : 0;
							uni.hideLoading();
							uni.showToast({
								icon:'none',
								title:'删除成功',
							})
							cb();
						}
					})
					
				}
				
			},
			touchstart(item,isChildComment) {
				//1.5后触发弹窗事件
				this.longpressTimer = setTimeout(() => {
					this.handleLongpress(item,isChildComment)
				}, 750)
			},
			touchend() {
				clearTimeout(this.longpressTimer);
				this.longpressTimer = null;

			},
			handleLongpress(item,isChildComment) {
				// console.log(this.popupInfo)
				// console.log(this.uuId,"1")
				// console.log(item.uuId,"2")
				
				console.log(item,"长按详情")
				console.log("评论弹框出现");
				this.isLongPress = true;
				// 判断点击的评论是否是本人的评论
				const isUser = this.uuId === item.uuId
				// 判断点击的是评论还是动态
				let type ,typeText
				console.log(item.isinfor,"评论还是动态")
				if(item.isinfor){
					type = "1";
					typeText='动态'
				}else{
					type = "3";
					typeText='评论'
				}
				const tar = {
					isUser,
					detail: {...item,isChildComment},
					type,
					typeText
				}
				// // console.log(isUser)
				// // console.log(tar,"子评论")
				// // console.log(tar,"zhezheh")
				this.popupInfo = tar
				this.$refs.popforlist.open()
			},
			showMoreText() {
				this.$nextTick(() => {
					this.textMore = true;
				})
			},
			...mapMutations(['unloveInforStore', 'loveInforStore', 'loveInforFollowStore', 'unloveInforFollowStore',
				'loveInforHotStore', 'unloveInforHotStore','changehomeListStore','initPage','clearUserStoreList'
			]),
			handleCancelComment() {
				this.commentShow = false;
			},
			commentIsShow() {
				this.isDirectedComment = true
				this.commentShow = true;
				this.placeholderText = '评论字数最多输入200字'

			},
			handleCommentSubmit(inputVal, callback) {
				// 拿到子组件传递的评论数据
				// 向后端传递
				// console.log(inputVal, "子组件传递");

				// console.log(`是否是直接评论`, this.isDirectedComment)
				if (callback) {
					callback();
				}
				uni.showLoading({
					title: "loading..."
				})
				if (this.isDirectedComment) {
					console.log('直接回复');
					this.saveCommentForInfor(inputVal);
				} else {
					// 针对回复的回复
					console.log(this.commentId,'我的评论id')
					this.saveCommentForComment(this.commentId, inputVal)
				}
				// 收起评论板
				this.commentShow = false
			},
			showMore(index) {
				// this.zhankai = true

				// 传递具体点击的是哪一个评论对象
				// console.log(index, "具体评论index");
				// 更改评论列表的展开状态
				this.inforCommentsList[index].loadMoreStatus = true;
				// 每一个评论都要维护自己的展示状态

				this.inforCommentsList[index].loadingState = 'nomore';
				// 代表需要加载更多评论

			},
			tofocus(commentId, target, para) {
				// console.log(commentId, "--》评论")
				// 拿到
				// console.log(target.nickname)
				// 拿到target的昵称
				// console.log(target)
				// console.log(target.uuId, this.uuId)
				if (target.uuId !== this.uuId) {
					// 回复的人不是自己
					// placeholder要改
					this.placeholderText = `回复 ${target.nickname}`
				} else {
					this.placeholderText = `评论字数最多输入200字`
				}
				if (para === 'replayto') {
					// 点击二级回复 判断目标是否是自己的回复
					// console.log(target.uuId,this.uuId,"回复的二级回复是否是自己的")
					if (target.uuId !== this.uuId) {
						// 回复的不是自己的二级回复
						this.targetNickname = target.nickname;
					} else {
						this.targetNickname = '';
					}
				} else {
					this.targetNickname = '';
				}
				// 调出评论面板
				// 更改是否是直接评论
				this.isDirectedComment = false
				this.commentShow = true
				this.focus = false;
				this.$nextTick(() => {
					this.focus = true;
				})
				this.commentId = commentId;
				//this.saveCommentForComment(commentId,);
				console.log('//// 点击了');
				console.log('//// 第一次', this.focus);
			},
			saveComment(inputValue) {
				if (this.focus) {
					console.log('//// 第二次', this.focus);
					const commentId = this.commentId
					console.log('this.commentId拿到了', this.commentId);
					this.saveCommentForComment(commentId, inputValue);
				} else {
					this.saveCommentForInfor(inputValue);
				}
			},
			// 触底加载
			reachBottom() {
				if (!this.hasNext) return;
				console.log('//// 触底加载');
				// 触底加载增加一个参数
				this.getInforCommentsList(this.myFormData.inforId, true);
			},
			onInput(value) {
				if (value !== null) {
					for (const i in keyWords) {
						const reg = new RegExp(keyWords[i], 'g');
						value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
					}
				}
				// 数据改变是异步的
				this.$nextTick(() => {
					this.inputValue = value;
				});
				console.log('置换后value:', value);
			},

			//点击图片进入函数，传入当前列表的索引index
			TanPreviewImage(indexa) {
				uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://21111889:8970/6_1597822634094.png"]
					current: indexa, //这里是判断到点击列表上的某个图片，就读取索引的图片
					urls: this.myFormData.medias, //这是整个内容的图片数组，放一个数组里，就可以左右切换了
					longPressActions: { //长按保存图片到相册
						itemList: ['保存图片'],
						success: (data) => {
							console.log(data);
							uni.saveImageToPhotosAlbum({ //保存图片到相册
								filePath: payUrl,
								success: function() {
									uni.showToast({
										icon: 'success',
										title: '保存成功'
									});
								},
								fail: (err) => {
									uni.showToast({
										icon: 'none',
										title: '保存失败，请重新尝试'
									});
								}
							});
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				});
			},
			//根据inforId查询详情
			findPublishInfor(inforId) {
				//console.log("进来了方法", inforId)
				this.$http.get(this.url.findPublishInforByIdUrl, {
					params: {
						id: inforId
					}
				}).then((res) => {
					if (res.data.success) {
						console.log('表单数据', res);
						this.myCommentForm = res.data.result;
					}
				});
			},
			//获取评论列表
			async getInforCommentsList(inforId, isPageTurn = false) {
				console.log("进行了请求全部评论")
				console.log("当前页数", this.pageInfo.num)
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				// 这里 如果普通刷新不应该让页数加一
				// this.pageInfo.num++;
				// 判断当前是否属于触底加载
				if (isPageTurn) {
					// 如果是触底加载
					//当前的页面页数加一
					this.pageInfo.num += 1;
				}
				// console.log("加载第",this.pageInfo.num,"的数据")
				const {
					findInforCommentsPageUrl,
					pageInfo: {
						num,
						size
					}
				} = this;
				this.$http.get(findInforCommentsPageUrl, {
					params: {
						page: num,
						pagesize: size,
						id: inforId
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
						if (num === 1) this.inforCommentsList = [];
						if (items.length) {
							for (const d of items) {
								d.avatar = this.fileUrl + d.avatar;
								d.loadMoreStatus = false;
								d.loadingState = 'loadmore';
								// console.log('每条数据子级评论的第一条是', d.childCommentList[0]);
							}
						}
						// console.log(items, "是否拿到实时数据")
						// 这里要区分是属于普通增加评论还是进行翻页 
						// 如果是翻页就需要push新的数据
						// 如果只是请求增加一条数据 就整个改
						if (isPageTurn) {
							// 翻页的逻辑
							const tempArr = [...this.inforCommentsList];
							tempArr.push(...items);
							this.inforCommentsList = tempArr
						} else {
							// 重新赋值数组
							this.inforCommentsList = [...items]
						}
						console.log("页数", page, pages)
						// this.inforCommentsList = this.inforCommentsList.concat(items);
						uni.hideLoading()
						// console.log(this.inforCommentsList, "评论列表")
						this.hasNext = pages > page;
						this.isDownLoading = false;
					} else {
						this.isDownLoading = false;
					}
				}).catch(err => {
					// console.log(err);
					this.isDownLoading = false;
				});
			},
			//获取评论的子级评论列表
			getSonCommentsList(item) {
				if (this.isDownLoading) return;
				this.isDownLoading = true;
				this.pageInfo.num++;
				const {
					findSonCommentListPageUrl,
					pageInfo: {
						num,
						size
					}
				} = this;
				this.$http.get(this.findSonCommentListPageUrl, {
					// 这里是item直接就代表目标id
					params: {
						id: item
					}
				}).then(res => {

					const {
						success,
						result
					} = res.data;
					console.log(res, "结果")
					console.log('。。。。。', result);
					// result 就是结果数组
					if (success) {

						if (num === 1) this.inforSonCommentsList = [];
						if (result.length) {
							for (const d of result) {
								d.avatar = this.fileUrl + d.avatar;
							}
						}
						// console.log(items,"拿到子评论")
						// 在当前一级评论列表找到当前数组重新赋值
						const targetIndex = this.inforCommentsList.findIndex((it) => {
							return it.id === item
						})
						if (targetIndex !== -1) {
							// 找到了index
							this.inforCommentsList[targetIndex].childCommentList = [...result];
							// console.log(this.inforCommentsList);
							// 判断是否是刚刚添加的评论 如果是的话就更改展开状态
							if (this.inforCommentsList[targetIndex].childCommentList.length === 1) {
								// 第一条二级评论刚刚添加
								this.inforCommentsList[targetIndex].hasChild = '1'
								this.inforCommentsList[targetIndex].loadMoreStatus = true
								this.inforCommentsList[targetIndex].loadingState = 'nomore'
							}
						}

						this.inforSonCommentsList = this.inforSonCommentsList.concat(result);
						uni.hideLoading()
						// this.hasNext = pages > page;
						this.isDownLoading = false;

						// console.log('子级评论列表', this.inforSonCommentsList);

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
				console.log('进来了666应该是uuid', myFormData);
				//判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
				//判断如果跳转的动态页的uuid 不是当前登录用户的  那就跳到用户的个人页
				if (this.uuId == myFormData) {
					uni.navigateTo({
						url: '/pages/member/member'
					});
				} else {
					uni.navigateTo({
						url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
					});
				}
			},

			//保存评论 这里有两种评论、一种是对动态 一种是对评论
			saveCommentForInfor(inputValue) {
				//若评论中包含 “*” 或者为空 不允许保存
				//console.log("inputValue值为空1：", inputValue);
				if (inputValue === '' || inputValue.indexOf('*') != -1) {
					console.log('评论出现了违规词语、已被拦截：', inputValue);
				} else {
					const InforCommentDto = {};
					InforCommentDto.publishId = this.myCommentForm.id;
					console.log(InforCommentDto.publishId, "评论id")
					InforCommentDto.comment = inputValue;
					this.$http.post(this.url.saveCommentUrl, InforCommentDto).then(async res => {
						//刷新留言列表、并将返回的评论数量 回显页面上 并将输入框文字置空
						if (res.data.success) {
							//回显最新评论数
							this.myCommentForm.commentCount = res.data.result;
							console.log("请求成功数据", res.data)

							//刷新评论列表
							// 重置页数
							this.pageInfo.num = 1;
							// 滚动条置为0
							await this.getInforCommentsList(this.myFormData.inforId);
							this.scrollTop = this.scrollTop === 0 ? 1 : 0
							console.log(this.myFormData, 'myFormData')

							console.log('当前页数是：', this.pageInfo.num);
							//置空输入框
							this.inputValue = '';

						}
					});
				}
			},
			//保存对评论进行的评论
			saveCommentForComment(commentId, inputValue) {
				console.log('调用了保存对评论进行的评论111：', inputValue);
				console.log('调用了保存对评论进行的评论222：', commentId);
				//若评论中包含 “*” 或者为空 不允许保存
				//console.log("inputValue值为空1：", inputValue);
				if (inputValue === '' || inputValue.indexOf('*') != -1) {
					console.log('评论出现了违规词语、已被拦截：', inputValue);
				} else {
					const InforCommentDto = {};

					InforCommentDto.commentId = commentId; //这个应该是评论的id
					InforCommentDto.comment = inputValue;
					if (this.targetNickname !== '') {
						InforCommentDto.commentedNickName = this.targetNickname;
					}
					console.log(InforCommentDto, "提交对象")
					this.$http.post(this.url.saveCommentForCommentUrl, InforCommentDto).then(res => {
						//刷新子级留言列表  并将输入框文字置空
						if (res.data.success) {
							// 记录评论的这个一级对象
							console.log("这里.....")
							this.alreadyComment.push(commentId);
							// 在进行请求的时候匹配这个id 进行展开
							//刷新子级评论列表
							this.getSonCommentsList(commentId); //拿的也不是动态id  而应该是评论的id
							// 也需要重新渲染界面 但是只找到当前这条评论的子评论进行渲染
							console.log(commentId, "评论id<---")
							// 针对评论id为commentId进行的评论,
							this.targetNickname = ''
							//进行请求评论列表 拿到rawdata 做数组操作来更改


							//置空输入框

							this.inputValue = '';
						}
					});
				}
			},

			//点赞动态
			likeInfor(id) {
				console.log('进来了点赞动态方法', id);
				this.$http.get(this.url.likeInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						console.log('表单数据', res);
						this.myCommentForm.likeCount = res.data.result;
						//刷新页面
						this.findPublishInfor(this.myFormData.inforId);

					}
				});
			},
			//取消点赞动态
			dislikeInfor(id) {
				//console.log("进来了方法", inforId)
				this.$http.get(this.url.dislikeInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						console.log('表单数据', res);
						this.myCommentForm.likeCount = res.data.result;
						//刷新页面
						this.findPublishInfor(this.myFormData.inforId);
					}
				});
			},
			//喜欢动态
			loveInfor(id) {
				//console.log("进来了方法", inforId)
				this.$http.get(this.url.loveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						console.log('表单数据', res);
						this.myCommentForm.loveCount = res.data.result;
						//刷新页面
						this.findPublishInfor(this.myFormData.inforId);
						console.log("看下面")
						console.log(this.fatherIndex, "父级index")
						// emit("likeEvent", id, this.fatherIndex)
						console.log(this.fromPage, "来")
						if (this.fromPage === 'follow') {
							console.log('好友列表的index', this.fatherIndex)
							// 从关注页面进入
							this.loveInforFollowStore({
								index: this.fatherIndex,
								count: res.data.result
							})

						} else if (this.fromPage === 'hot') {
							// 从hot页面进入
							this.loveInforHotStore({
								index: this.fatherIndex,
								count: res.data.result
							})
						} else if(this.fromPage === 'infor'){
							this.loveInforStore({
								index: this.fatherIndex,
								count: res.data.result
							})
						}else if(this.fromPage==='member'){
							// 从资料详情中进入  点赞数改变重新刷新首页列表
							this.clearUserStoreList()
						}
						

					}
				});
			},
			//取消喜欢动态
			unloveInfor(id) {
				//console.log("进来了方法", inforId)
				this.$http.get(this.url.unloveInforUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						console.log('表单数据', res);
						this.myCommentForm.loveCount = res.data.result;
						//刷新页面
						this.findPublishInfor(this.myFormData.inforId);
						// emit("dislikeEvent", id, this.fatherIndex)
						console.log(this.fromPage, "来")
						if (this.fromPage === 'follow') {
							this.unloveInforFollowStore({
								index: this.fatherIndex,
								count: res.data.result
							})
						} else if (this.fromPage === 'hot') {
							// 从hot页面进入
							this.unloveInforHotStore({
								index: this.fatherIndex,
								count: res.data.result
							})
						} else if(this.fromPage ==='infor'){
							this.unloveInforStore({
								index: this.fatherIndex,
								count: res.data.result
							})
						}else if(this.fromPage==='member'){
							// 从资料详情中进入  点赞数改变重新刷新首页列表
							this.clearUserStoreList()
						}
						

					}
				});
			},
			//点赞评论
			likeComment(id, parentId) {
				console.log('进来了点赞评论方法', id);
				// 
				// uni.showLoading({
				// 	title:"加载中"
				// })

				this.$http.get(this.url.likeCommentUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						// console.log("进行点赞")
						// console.log('表单数据', res);
						// console.log("点赞结果", res.data.result)
						let targetIndex;
						if (!parentId) {
							// 直接进行点赞
							// 找到当前的列表进行更改
							targetIndex = this.inforCommentsList.findIndex(item => {
								return item.id == id
							})
							// console.log(targetIndex, "修改的点赞index")
							this.inforCommentsList[targetIndex].hasLiked = 1
							this.inforCommentsList[targetIndex].likeCount = res.data.result
						} else {
							// 在二级评论进行点赞
							//首先找到一级的index
							const tempIndex = this.inforCommentsList.findIndex(item => {
								return item.id == parentId
							})
							// console.log(tempIndex, "点赞第几个一级评论");
							const parentObj = this.inforCommentsList[tempIndex];
							// 找到具体的二级评论索引
							targetIndex = parentObj.childCommentList.findIndex(item => {
								return item.id === id
							})
							// console.log("点赞的子评论是", targetIndex)
							// 找到这条数据
							parentObj.childCommentList[targetIndex].hasLiked = 1;
							parentObj.childCommentList[targetIndex].likeCount = res.data.result
							// 
						}
						// uni.hideLoading()
						//this.myCommentForm.likeCount = res.data.result;
						//重新赋页码数、并刷新评论列表
						//this.pageInfo.num = 0;
						// this.getInforCommentsList(this.myFormData.inforId);

					}
				});
			},
			//取消点赞评论
			dislikeComment(id, parentId) {
				//console.log("进来了方法", inforId)
				// uni.showLoading({
				// 	title:"加载中"
				// })


				this.$http.get(this.url.dislikeCommentUrl, {
					params: {
						id: id
					}
				}).then((res) => {
					if (res.data.success) {
						// console.log("取消点赞")
						// console.log('表单数据', res);
						// console.log("点赞结果", res.data.result)
						let targetIndex
						if (!parentId) {
							// console.log("直接进行取消点赞")
							targetIndex = this.inforCommentsList.findIndex(item => {
								return item.id == id
							});
							this.inforCommentsList[targetIndex].hasLiked = 0;
							this.inforCommentsList[targetIndex].likeCount = res.data.result;
						} else {
							// 对子评论进行取消点赞
							const tempIndex = this.inforCommentsList.findIndex(item => {
								return item.id == parentId
							});
							const parentObj = this.inforCommentsList[tempIndex];
							targetIndex = parentObj.childCommentList.findIndex(item => {
								return item.id === id
							})
							parentObj.childCommentList[targetIndex].hasLiked = 0;
							parentObj.childCommentList[targetIndex].likeCount = res.data.result

						}
						// uni.hideLoading()
						//this.myCommentForm.likeCount = res.data.result;
						//重新赋页码数、并刷新评论列表
						//this.pageInfo.num = 0;
						// this.getInforCommentsList(this.myFormData.inforId);
					}
				});
			}
		}
	};
</script>


<style lang="scss" scoped>
	@import url("//at.alicdn.com/t/c/font_4189769_b7ngzgwe98s.css");

	.space-for-no-img {
		height: 30rpx;
		width: 100%;
	}

	.list-wrap {
		height: calc(100vh - 280rpx);
	}

	.container {
		background-color: #ffffff;
		position: relative;
	}

	.card {
		background-color: #fff;
		padding: 20rpx 20rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;
		/*盒子间的距离*/
		margin-top: 100rpx;
		/*盒子距离顶部的距离*/
		line-height: 35rpx;
		/*行高*/

		.card-line {
			font-weight: bold;
			display: flex;
			margin-bottom: 30rpx;
			/*盒子间的距离*/
		}

		.card-createDate {
			font-weight: bold;
			margin-right: 400rpx;
			margin-left: 10rpx;
		}

		.card-ipAddress {
			font-weight: bold;
			margin-left: 15rpx;
		}

		.card-likeCount {
			font-weight: bold;
			margin-right: 200rpx;
			margin-left: 20rpx;
		}

		.card-loveCount {
			font-weight: bold;
			margin-right: 200rpx;
			margin-left: 20rpx;
		}

		.card-commentCount {
			font-weight: bold;
			margin-right: 80rpx;
			margin-left: 20rpx;
		}

		.text-box {
			color: #000;
			background-color: #fff;
			font-weight: bold;
			font-size: 0.8em;
			text-align: center;
			width: 100%;
			top: 350rpx;
			position: absolute;
		}

		.autoHeight.text-wrap.card-text {
			height: auto;
		}

		.text-wrap {
			// background-color: blueviolet;
			overflow: hidden;
			position: relative;
		}

		.maxText {
			max-height: 400rpx;
		}

		.card-text {
			color: #444;
			width: 95%;
			font-size: 38rpx;
			margin-bottom: 20rpx;
			/*盒子间的距离*/
			line-height: 50rpx;
			/*行高*/
			margin-top: 30rpx;

			// box-sizing: border-box;
		}

		.text-main {
			max-height: 400rpx;
			overflow: hidden;
		}

		.comment {
			background-color: #fff;
			margin-bottom: 10rpx;
			/*盒子间的距离*/
			margin-top: 30rpx;
			/*盒子距离顶部的距离*/

			//这个虽然目前没用但是要留下来、这个是绝对位置的样式
			.comment-parent {
				display: flex;
				justify-content: space-between;

				.comment-avatar {
					max-width: 25px;
					width: 25px;
					width: expression(this.width > 25 ? "25px" : this.width);
					height: 25px;
					height: expression(this.height > 25 ? "25px" : this.height);
					position: absolute;
					left: 20rpx;
					font-size: 20rpx;
					margin-top: 15rpx;
				}

				.comment-nickcon {
					margin-left: 80rpx;

					.comment-nickname {
						font-size: 30rpx;
						color: #6e6e6e;
					}

					.comment-content {
						font-size: 35rpx;
						color: #2c2c2c;
					}

					.comment-createDate {
						margin-left: 10rpx;
						display: flex;
					}
				}

				.comment-iconlikeCount {
					margin-right: 25rpx;
					margin-top: 30rpx;
					display: flex;

					.comment-likeCount {
						margin-left: 10rpx;
					}
				}

			}

			.comment-son {
				display: flex;
				justify-content: space-between;
				margin-left: 85rpx;

				.comment-avatar {
					max-width: 25px;
					width: 25px;
					width: expression(this.width > 25 ? "25px" : this.width);
					height: 25px;
					height: expression(this.height > 25 ? "25px" : this.height);
					position: absolute;
					left: 80rpx;
					font-size: 20rpx;
					margin-top: 15rpx;
				}

				.comment-nickcon {
					margin-left: 60rpx;

					.comment-nickname {
						font-size: 30rpx;
						color: #6e6e6e;
					}

					.comment-content {
						font-size: 35rpx;
						color: #2c2c2c;
					}

					.comment-createDate {
						margin-left: 10rpx;
						display: flex;
					}
				}

				.comment-iconlikeCount {
					margin-right: 25rpx;
					margin-top: 30rpx;
					display: flex;

					.comment-likeCount {
						margin-left: 10rpx;
					}
				}
			}
		}

	}

	.medias_avatar {
		max-width: 35px;
		width: 35px;
		width: expression(this.width > 35 ? "35px" : this.width);
		height: 35px;
		height: expression(this.height > 35 ? "35px" : this.height);
		overflow: hidden;
		display: inline;
		float: left;
	}

	.footer {
		width: 100%;
		background-color: #eee;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.foot-panel {
		height: 120rpx;
		width: 100%;
		background-color: #fff;
		border-top: 1px solid #ddd;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.foot-panel-inner {
			height: 70%;
			width: 90%;
			// border: 1px solid #ccc;
			margin: 0 auto;
			border-radius: 40rpx;
			background-color: #eee;
			display: flex;
			align-items: center;

			.foot-inner-left {
				width: 10%;
				flex: 0 0 auto;
				text-align: center;
			}

			.foot-inner-right {
				font-size: 1em;
				flex: 1 1 auto;
			}
		}
	}


	.input-form {
		width: 250px;
		height: 40px;
	}

	.input-button {
		width: 75px;
		height: 40px;
		margin-right: 6rpx;
	}

	//居左
	.alignleft {
		display: inline;
		float: left;
	}

	//居右
	.alignright {
		display: inline;
		float: right;
	}

	//居中
	.aligncenter {
		clear: both;
		display: block;
		margin: auto;
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

	.card-divider {
		height: 10rpx;
		border-bottom: 1px dashed #CCC
	}

	.space {
		height: 70px;
		width: 100%;
		background-color: transparent;
	}

	.replay-name {
		.replay-name-inner {
			color: #333;
			font-size: 1em;
			font-weight: bold;
			margin-left: 10rpx;
		}
	}
</style>
