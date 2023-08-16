<template>
	<!--发布功能的表单页-->
	<view>
		<!--标题和返回-->
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{ myFormData.id ? '编辑动态' : '发动态'}}</block>
			<block slot="right">
				<view class="" @click="submit">
					发布
				</view>
				<!--  <button class="cu-btn block bg-gray margin-tb-sm " size="small" >
		            发布
		        </button> -->
			</block>

		</cu-custom>
		<!-- <cu-custom isBack="t" :backRouterName="backRouteName">
            <block slot="backText">
            </block>
            <block slot="content">{{ myFormData.id ? '编辑动态' : '发动态'}}</block>
            <block slot="right">
                <button class="cu-btn block bg-gray margin-tb-sm " size="small" @click="submit">
                    发布
                </button>
            </block>
        </cu-custom> -->

		<view class="">
			<form :model="myFormData">
				<view class="main bg-white" :style="{backgroundColor:voteBc}">
					<view class="cu-form-group textarea">
						<textarea :placeholder="'你可以在这里:\n1.爆料职场新鲜事 \n2.分享面试跳槽经验 \n3.与同行交流、吐槽解压'"
							style="width: 18px; height: 180px;" name="input" v-model="myFormData.textContent"
							:maxlength="maxLength" @input="onInput(myFormData.textContent)">
                        </textarea>
						<view class="maxlength-tip" v-if="(myFormData.textContent.length)>=(maxLength*0.8)">
							{{myFormData.textContent.length}}/{{maxLength}}
						</view>
					</view>
					<view class="bottom_bar">

						<my-image-upload ref="imageUpload" v-if="inforType===2" v-model="myFormData.medias">
						</my-image-upload>

						<view class="fixed-content">

							<view class="bottom-content">
								<view class="middle">
									<view class="huati">
										<p>#</p>
										<p>话题</p>
									</view>
									<view class="cuIcon-rankfill lg" @click="vote()"></view>
									<view class="vote_window" v-show="toupiao">
										<view class="vote_top_bar">
											<p>投票</p>
											<view class="cuIcon-close vote_close" @click="closeVote()"></view>
										</view>
										<view class="vote_content">
											<view class="cuIcon-mark"></view>
											<input type="text" placeholder="请填写投票标题,不超过15个字">
											<view class="idea_list" v-for="(item,index) in voteList" :key="index">
												<p>观点{{item.id}}</p>
												<input type="text" placeholder="请填写选项,不超过14个字">
											</view>
											<view class="add" @click="addIdea()">
												<view class="cuIcon-roundadd"></view>
												<p>添加观点</p>
											</view>
											<button @click="submitVote()">完成编辑</button>
										</view>
									</view>
									<view class="cuIcon-emojifill lg"></view>
								</view>
								<view class="location">
									<view class="cuIcon-location"></view>
									<p>添加地点</p>
								</view>
								<view class="auth-status" @click="changeAuth">
									{{seeType==1?'公开可见':'仅自己可见'}}
									<text class="cuIcon-right"></text>
								</view>
							</view>
							<view class="infortype-list">

								<view class="infortype-list-item" @click="changeInforType(1)">
									发文字
									<view class="active-status" :class="{show:inforType===1}">

									</view>
								</view>
								<view class="infortype-list-item" @click="changeInforType(2)">
									发图片
									<view class="active-status" :class="{show:inforType===2}">

									</view>
								</view>
								<view class="infortype-list-item" >
									发视频
									<view class="active-status" :class="{show:inforType===3}">

									</view>
								</view>

							</view>

						</view>


					</view>
				</view>
			</form>
		</view>
		<uni-popup ref="status" :mask-click="true" type="bottom">
			<view class="popup-card bg-gray" style="height: 100px;">
				<view class="st-container">
					<view class="st-item" @click="seeType=1">
						<view class="st-item-left">
							<text class="cuIcon-unlock"></text>
						</view>
						<view class="st-item-right">
							公开可见
						</view>
						<view class="st-item-check" v-if="seeType==1">
							<text class="cuIcon-check" style="color:red"></text>
						</view>
					</view>
					<!-- @click="handleChangeStatus('toPrivate')" -->
					<view class="st-item" @click="seeType=2">
						<view class="st-item-left">
							<text class="cuIcon-lock"></text>
						</view>
						<view class="st-item-right">
							私密
						</view>
						<view class="st-item-check" v-if="seeType==2">
							<text class="cuIcon-check" style="color:red"></text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import myDate from '@/components/my-componets/my-date.vue'
	import myImageUpload from '@/components/my-componets/my-image-upload.vue'
	import {
		keyWords
	} from '../../common/util/constants';
	import {
		mapMutations
	} from "vuex"
	export default {
		name: "inforPublishForm",
		components: {
			myDate,
			myImageUpload
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
				seeType:1,
				inforType: 2,
				maxLength: 100,
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				loading: false,
				model: {},
				sysOrgCode: {},
				backRouteName: 'index',
				url: {
					submitUrl: '/information/movements/savePublish',
					editUrl: '/information/movements/editPublish',
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
				myFormData: {
					latitude: '',
					longitude: '',
					location: '',
					medias: '',
					textContent: '',
					uuId: '',
				},
			}
		},
		created() {
			//this.initFormData();
			this.shijiao();
			// 判断当前是否为编辑
			if(this.myFormData.id ){
				console.log("编辑");
				this.seeType = this.myFormData.seeType
				this.inforType = this.myFormData.inforType
				
			}else{
				// console.log("新发动态");
				
			}
		},
		onLoad(option) {
			//const item = JSON.parse(decodeURIComponent(option.item));
			if (option.item) {
				const item = JSON.parse(decodeURIComponent(option.item));
				this.myFormData = item
				console.log("编辑页带进来的数据", item)
			}
		},
		methods: {
			changeAuth() {
				// 选择动态权限
				this.$refs.status.open()
			},
			changeInforType(tar) {
				// 改变发布类型 
				this.inforType = tar
			},
			...mapMutations(['changehomeListStore', 'initPage']),
			onInput(value) {
				if (value !== null) {
					for (const i in keyWords) {
						const reg = new RegExp(keyWords[i], 'g');
						value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
					}
				}
				// 数据改变是异步的
				this.$nextTick(() => {
					this.myFormData.textContent = value;
				});
				console.log('置换后value:', value);
			},
			//失焦
			shijiao() {
				if (this.text == '') {
					uni.createSelectorQuery().select('.default_text').boundingClientRect(() => {
						this.vBlock = 'block'
					})
				} else {
					this.vBlock = 'none'
				}
			},
			//聚焦
			jujiao() {
				const that = this;
				if (this.text != '') {
					uni.createSelectorQuery().select('.default_text').boundingClientRect(() => {
						that.vBlock = 'none'
					})

				}
			},
			//投票
			vote() {
				console.log('投票')
				this.toupiao = true;
				this.voteBc = 'gray';
			},
			//关闭投票
			closeVote() {
				console.log('关闭投票')
				this.toupiao = false;
				this.voteBc = 'white';
			},
			//添加观点
			addIdea() {
				// var newIdea={id:this.voteList.length,content:''}
				this.voteList.push({
					"id": this.voteList.length + 1,
					"content": ''
				});
			},
			clear() {
				// 重置
				this.sysOrgCode = [];
				this.model.sysOrgCode = [];
				this.sysOrgCode = null;
				this.queryParam = {};
				this.loadList(1);
			},
			submit() {
				//若评论中包含 “*” 或者为空 不允许保存
				//console.log("inputValue值为空1：", inputValue);
				if (this.myFormData.textContent === '' || this.myFormData.textContent.indexOf('*') != -1) {
					console.log('动态内容出现了违规词语、已被拦截：', this.myFormData.textContent);
				} else {
					console.log('medias2', this.myFormData.medias)
					// 判断是否有编辑好的数组
					if(this.inforType==1){
						// 文字内容不需要图片
						this.myFormData.medias = ''
					}
					if (typeof this.myFormData.medias != 'string' ) {
						console.log("没有添加直接提交")
						// 拿子组件的图片数组转换为str
						
						const mediasTarget = this.$refs.imageUpload.pathlist.join(',')
						// console.log(mediasTarget,"转换后")
						this.myFormData.medias = mediasTarget
					}
					// 添加两个属性
					const targetObj = {...this.myFormData,seeType:this.seeType,inforType:this.inforType}
					console.log(targetObj,'..')
					this.$http.post(this.myFormData.id ? this.url.editUrl : this.url.submitUrl, targetObj, {}).then(
						res => {
							console.log('myFormData', this.myFormData)
							console.log('res', res);
							if (res.data.success) {
								console.log('发布成功');
								console.log('res.data', res.data);
								uni.showToast({
									title: '发布成功',
									complete: () => {
										setTimeout(() => {
											// 发动态重新刷新当前的首页列表
											this.changehomeListStore([])
											// 初始化页数
											this.initPage()
											uni.redirectTo({
												url: '/pages/home/home'
											});
										}, 1500);
									}
								});
							}
						})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.textarea {
		position: relative;

	}

	.maxlength-tip {
		position: absolute;
		bottom: 200rpx;
		right: 40rpx;
		font-size: 2em;
		color: #fbbd08;
	}

	.middle {
		display: flex;
		align-items: center;
	}

	.huati {
		display: flex;
		border-radius: 5px;
		font-size: 18px;
		margin: 5px;
		padding: 5px;
		justify-content: center;
		align-items: center;
	}

	.huati p:nth-child(1) {
		margin-top: 2px;
		margin-right: 5px;
	}

	.location {
		display: flex;
		border-radius: 5px;
		font-size: 18px;
		margin: 5px;
		justify-content: flex-start;
		align-items: center;
	}

	.main {
		position: absolute;
		width: 100%;
		height: calc(100% - 45px);
		display: flex;
		flex-direction: column;

		.main_content {
			height: 70%;
		}

		.default_text {
			position: absolute;
			top: 0;
			left: 10px;
		}

		.bottom_bar {
			height: 30%;
		}
	}

	/* 图标大小 */
	.lg {
		width: 30px;
		height: 30px;
		font-size: 24px;
		line-height: 30px;
	}

	.vote_window {
		background-color: white;
		width: 100%;
		height: 500px;
		position: absolute;
		bottom: 0;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;

		.vote_top_bar {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #e0e2e3;
			display: flex;

			p {
				font-size: 16px;
				width: 60px;
				display: block;
				margin: auto;
			}

			.vote_close {
				font-size: 18px;
				justify-content: flex-end;
				width: 40px;
			}
		}

		.vote_content {
			margin: 10px;

			.cuIcon-mark {
				font-size: 20px;
				color: black;
			}

			input {
				border-bottom: 1px solid #e0e2e3;
				height: 40px;
			}

			input:nth-child(1) {
				font-size: 20px;
				margin: 10px;
				float: center;
			}

			.idea_list {
				display: flex;
				align-items: center;
				height: 80px;
				padding: 5px;

				p {
					font-size: 12px;
					color: black;
					background-color: #e0e2e3;
					padding: 3px 10px;
					border-radius: 3px;
				}

				input {
					width: 80%;
					margin-left: 10px;
					font-size: 14px;
				}
			}

			.add {
				display: flex;
				align-items: center;
				margin-left: 8px;
				font-size: 16px;

				.cuIcon-roundadd {
					font-size: 16px;
					color: black;
				}

				p {
					margin-left: 10px;
				}
			}

		}
	}

	.auth-status {
		margin-right: 10rpx;
	}

	.infortype-list {
		display: flex;
		width: 100%;
		margin-bottom: 10rpx;
		height: 60rpx;

	}

	.fixed-content {
		width: 100%;
		position: fixed;
		bottom: 0px;
		left: 0px;
	}

	.bottom-content {
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.infortype-list-item {
		text-align: center;
		width: 33%;
		color: #000;
		font-size: 1.2em;
		font-weight: bold;
		position: relative;

	}

	.active-status {
		transition: 300ms;
		width: 0%;
		position: absolute;
		bottom: 0px;
		left: 0px;
		height: 3px;
		background-color: #f37b1d;
	}

	.active-status.show {
		width: 100%
	}
	.st-item-right{
		margin-left: 20rpx;
		flex:1 1 auto;
	}
	.st-item{
		padding: 0 30rpx;
		box-sizing: border-box;
		
		display:flex;
		height:80rpx;
		width:100%;
		line-height: 80rpx;
		align-items: center;
		
		
	}
	.st-item-check{
		width:5%;
		flex: 0 0 auto;
	}
	.st-item-left{
		width:5%;
	}
	.st-container{
		
		padding: 15rpx;
		height: 100%;
		width: 100%;
		boxbox-sizing: border-box;
	
	}
</style>
