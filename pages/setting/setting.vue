<template>
    <!--设置页-->
    <view>
        <scroll-view scroll-y class="page">
            <cu-custom bgColor="bg-gradual-pink" :isBack="true">
                <block slot="backText">返回</block>
                <block slot="content">设置</block>
                <!--<view slot="right"  @tap="rightClick">编辑</view>-->

            </cu-custom>

            <!-- list列表 -->
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/member/memberdetail">
                    <text class="cuIcon-edit" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">编辑资料</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-share" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">分享app</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-sponsor" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">捐赠</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <view class="cu-item" @click="handleUpdateApp">
                    <text class="cuIcon-link" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">更新app</text>
                    </view>
                </view>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-comment" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content"><!-- 设置页面涉及新增页面的，都放在setting目录下 -->
                        <text class="text-grey" style="font-size: 40rpx;">产品建议</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <view class="cu-item" url="/pages/user/userexit" @click="contactqq">
                    <text class="cuIcon-service" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">联系客服</text>
                    </view>
                </view>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-vipcard" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">信息认证</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <view class="cu-item" @click="handleLogOff">
                    <text class="cuIcon-delete" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">注销账户</text>
                    </view>
                </view>
            </view>
            <view class="cu-list menu">
                <!-- <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-exit" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">退出app</text>
                    </view>
                </navigator> -->
				<view class="cu-item" @click="handleExit" >
					<text class="cuIcon-exit" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
					<view class="content">
					    <text class="text-grey" style="font-size: 40rpx;">退出app</text>
					</view>
				</view>
            </view>

        </scroll-view>
		<popupForUpdate ref="popup" :updateObj="updateObj"
		@updateApp="updateApp"></popupForUpdate>
    </view>
</template>

<script>
    import api from '@/api/api.js';
    import appSelect from '@/components/my-componets/appSelect.vue';
    import secondPickerVue from '@/components/my-componets/secondPicker.vue';
    import myImageUpload from '@/components/my-componets/my-image-upload.vue';
    import myDate from '@/components/my-componets/my-date.vue';
    import {ACCESS_TOKEN} from '@/common/util/constants.js';
    import configService from '@/common/service/config.service.js'
	import {mapMutations,mapState} from "vuex"
	import popupForUpdate from "@/pages/component/popForUpdate.vue"
    export default {
        components: {
            appSelect,
			 myImageUpload,
			 myDate,
			 secondPickerVue,
			popupForUpdate,
        },
		computed:{
			...mapState(['homeListStore','hotListStore'])
		},
        data() {
            return {
                // job_type,
				updateObj:{},
                personalMsg: {
                    avatar: '',
                    nickName: '',
                    signature: '',
                    graduationDate: '',
                    startWorkDate: '',
                    experience: '',
                    job: '1',
                    dreamCompanySign: '',
                    sex: 1,
                    status: 1,
                    identity: ''
                },
				contactUrl:'/systemConfiguration/systemConfiguration/showData',
				accountOffUrl:'/sys/cancelAccount',
				updateUrl:'/systemConfiguration/systemConfiguration/showData',
                userUrl: '/sys/user/queryById',
                positionUrl: '/sys/position/list',
                departUrl: '/sys/user/userDepartList',
                editAvatarUrl: '/sys/editAvatar',
                fileUrl: configService.fileSaveURL,
                imgList: [],
                pathlist: [],
            };
        },
        onShow() {
            this.loadinfo();
        },

        methods: {
			contactqq(){
				// 联系客服
				// 获取qq号
				this.$http.get(this.contactUrl).then(res=>{
					// 获取客服qq
					if(res.data.success){
						const targetServiceCode = res.data.result.serviceContact;
						// 在h5中
						// #ifdef H5

						location.href=`http://wpa.qq.com/msgrd?v=3&uin=${targetServiceCode}&site=qq&menu=yes`
						// #endif
						// #ifdef APP-PLUS
						// 检测升级
						plus.runtime.openURL("mqq://im/chat?chat_type=wpa&uin=${targetServiceCode}&version=1&src_type=web")
						// #endif
					}
				})
				// location.href="http://wpa.qq.com/msgrd?v=3&uin=12345678&site=qq&menu=yes"
			},
			handleLogOff(){
				console.log("用户要注销账户")
				// 弹出确框
				uni.showModal({
					title:'确认注销',
					content:'注销当前账户，账户内数据将全部删除，请谨慎操作',
					success:(res)=>{
						// console.log(res,"选择")
						if(res.confirm){
							// 注销
							this.$http.post(this.accountOffUrl).then(res=>{
								console.log('结果',res)
								if(res.data.success){
									// 注销成功跳转注销成功
									// 弹出注销成功modal
									this.clearUserStoreList()
									uni.navigateTo({
										url:'/pages/login/login?from=setting',

									})
								}
							})
							return
						}
						if(res.cancel){
							return
						}

					}
				})
			},
			updateApp(){
				// 触发更新事件
				console.log("用户点击更新");
				this.$refs.popup.close();
				console.log(this.updateObj.downloadLink)
				uni.downloadFile({
					url:this.updateObj.downloadLink,
					complete(res){
						console.log(res,"下载结果")
					}
				})
			},
			handleUpdateApp(){
				// console.log("用户要更新app");
				// 弹出检测更新modal
				uni.showLoading({
					title:"检测更新..."
				})
				const localVersion = uni.getSystemInfoSync();
				console.log(localVersion,"当前版本")
				// 获取当前版本数据
				const currentCode = localVersion.appVersionCode;
				this.$http.get(this.updateUrl).then(res=>{
					console.log("数据",res)
					const targetObj = res.data.result
					const targetCode =targetObj.versionNum
					uni.hideLoading()
					if(targetCode>currentCode){
						console.log("需要升级");
						// 渲染更新弹窗
						// 传递数据
						console.log( targetObj)
						this.updateObj = targetObj
						this.$refs.popup.open();

					}else{
						console.log("不需要升级");
						return
					}
				})
			},
			...mapMutations(['clearUserStoreList']),
			handleExit(){
				// console.log("用户要退出");
				uni.showModal({
					title:'确认退出',
					success:(res)=>{
						// 跳转登陆页面
						// 清除当前缓存的数据
						if(res.confirm){
							// 用户退出
							this.clearUserStoreList()
							uni.navigateTo({
								url:'/pages/login/login?from=setting',

							})
						}else if(res.cancel){
							return
						}


					}
				})
			},
            getSubStringText(text, len) {
                if (!text || text.length == 0) {
                    return '';
                }
                if (text.length < len) {
                    return text;
                }
                return text.substr(0, len) + '...';
            },
            rightClick() {
                this.$Router.push({name: 'memberedit', params: this.personalMsg});
                /* uni.navigateTo({
                    url: '/pages/user/useredit?item='+item
                }); */
            },
            loadinfo() {
                this.$tip.loading();
                this.$http.get(this.userUrl, {params: {id: this.$store.getters.userid}}).then(res => {
                    if (res.data.success) {
                        const {avatar, sex, status} = res.data.result;
                        if (avatar && avatar.length > 0) {
                            this.personalMsg.avatar = api.getFileAccessHttpUrl(avatar);
                        }
                        this.personalMsg = res.data.result;
                        this.personalMsg.sex = sex === 1 ? '男' : '女';
                        this.personalMsg.sexNum = sex;
                        this.personalMsg.status = status === 1 ? '正常' : '冻结';
                    }
                    this.$tip.loaded();
                }).catch(e => {
                    this.$tip.loaded();
                    console.log('请求错误', e);
                });

                this.$http.get(this.departUrl, {params: {userId: this.$store.getters.userid}}).then(res => {
                    if (res.success) {
                        for (const item of res.result) {
                            this.personalMsg.orgCode = item.title;
                            this.personalMsg.departIds = item.title;
                        }
                    }
                }).catch(e => {
                    console.log('请求错误', e);
                });

                this.$http.get(this.positionUrl).then(res => {
                    if (res.success) {
                        const postArr = res.result.records;
                        for (const item of postArr) {
                            if (this.personalMsg.post == item.code) {
                                this.personalMsg.post = item.name;
                            }
                        }
                    }
                }).catch(e => {
                    console.log('请求错误', e);
                });
            },
            // 更换头像
            changeAvatar() {
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success: (res) => {
                        console.log("res", res)
                        const tempFilePaths = res.tempFilePaths[0];
                        this.uploadAvatar(tempFilePaths);
                    }
                });
            },

            // 上传头像
            uploadAvatar(tempFilePaths) {
                console.log('tempFilePaths///', tempFilePaths);
                uni.uploadFile({
                    url: `${configService.fileUploadURL}`,
                    filePath: tempFilePaths,
                    name: 'file',
                    success: (uploadFileRes) => {
                        console.log('filePath:', tempFilePaths);
                        let path = JSON.parse(uploadFileRes.data).message
                        this.pathlist.push(path);
                        if (this.pathlist.length != 0) {
                            this.editAvatar(path);
                        }
                    }
                });
            },
            editAvatar(path) {
                this.$http.get('/sys/editAvatar', {
                    params: {
                        id: this.$store.getters.userid,
                        avatar: path
                    }
                }).then(res => {
                    console.log(res)
                    this.$tip.loaded();
                    if (res.data.success) {
                        this.$tip.toast('提交成功')
                    }
                }).catch(() => {
                    this.$tip.loaded();
                    this.$tip.error('提交失败')
                });
            },
            // 修改时间
            editDate(graduationDate, url) {
                const params = {
                    id: this.$store.getters.userid,
                    graduationDate
                };
                this.$http.get(url, {params}).then(res => {
                    if (res.data.success) {
                        this.$tip.toast('修改成功');
                    } else {
                        this.$tip.toast('修改失败');
                    }
                }).catch(e => {
                    console.log('请求错误', e);
                });
            },
            // 修改毕业时间
            editGraduationDate(date) {
                this.editDate(date, '/sys/editGraduationDate');
            },
            // 修改工作时间
            editWorkDate(date) {
                this.editDate(date, '/sys/editStartWorkDate');
            }
        }
    };
</script>

<style>
    .page {
        height: 100Vh;
        width: 100vw;
    }

    .page.show {
        overflow: hidden;
    }

    .switch-sex::after {
        content: "\e716";
    }

    .switch-sex::before {
        content: "\e7a9";
    }

    .switch-music::after {
        content: "\e66a";
    }

    .switch-music::before {
        content: "\e6db";
    }

    .signature {
        width: 70%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
    }

    .tag {
        width: 66%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
    }

    .img {
        cursor: pointer;
    }
</style>
