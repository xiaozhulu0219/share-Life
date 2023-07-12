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
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-link" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">更新app</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-service" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">联系客服</text>
                    </view>
                </navigator>
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
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-delete" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">注销账户</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <navigator class="cu-item" url="/pages/user/userexit">
                    <text class="cuIcon-exit" style="font-size: 40rpx; margin-left: 240rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view class="content">
                        <text class="text-grey" style="font-size: 40rpx;">退出app</text>
                    </view>
                </navigator>
            </view>

        </scroll-view>
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

    export default {
        components: {
            appSelect, myImageUpload, myDate, secondPickerVue
        },
        data() {
            return {
                // job_type,
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
