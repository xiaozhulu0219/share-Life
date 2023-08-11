<template>
    <!--个人页的一些页面--人员详情-->
    <view>
        <scroll-view scroll-y class="page">
            <cu-custom bgColor="bg-gradual-pink" :isBack="true">
                <block slot="backText">返回</block>
                <block slot="content">编辑资料</block>
				<block slot="right">
					<backToHome></backToHome>
				</block>
            </cu-custom>

            <!-- list列表 -->
            <view class="cu-list menu">
                <view class="cu-item"  :style="[{animationDelay: '0.1s'}]">
                    <view class="img imgwrap" @tap="changeAvatar">
                        <!--	<img src="../../static/avatar_boy.png" mode="" class="png round" style="width: 90px;height: 90px;top: 20%;left: 50%;"></img>-->
                        <image class="cu-avatar round sm " :src="fileUrl+personalMsg.avatar" alt="" style="width: 90px;height: 90px;top: 20%;left: 50%;">
							<text  class="cuIcon-cameraaddfill cameraadd"></text>
						</image>
						
                    </view>
                </view>
            </view>

            <view class="cu-list menu">
                <navigator class="cu-item arrow"
                           :url="`/pages/member/nickName?query=${JSON.stringify(this.personalMsg)}`"
                           :style="[{animationDelay: '0.2s'}]">
                    <view class="content">
                        <text class="text-grey">昵称</text>
                    </view>
                    <view class="action">
                        <text class="text-grey">{{personalMsg.nickName}}</text>
                    </view>
                </navigator>
            </view>

            <view class="cu-list menu">
                <navigator class="cu-item arrow"
                           :url="`/pages/member/sex?query=${this.personalMsg.sexNum}`"
                           :style="[{animationDelay: '0.3s'}]">
                    <view class="content">
                        <text class="text-grey">性别</text>
                    </view>
                    <view class="action">
                        <text class="text-grey">{{personalMsg.sex}}</text>
                    </view>
                </navigator>
            </view>

            <view class="cu-list menu">
                <navigator class="cu-item arrow"
                           :url="`/pages/member/signature?query=${JSON.stringify(this.personalMsg)}`"
                           :style="[{animationDelay: '0.4s'}]">
                    <view class="content">
                        <text class="text-grey">个性签名</text>
                    </view>
                    <!-- todo 默认值最好前端给 要不然回显 空空如也～ -->
                    <view class="action signature">
                        <text class="text-grey">{{personalMsg.signature}}</text>
                    </view>
                </navigator>
            </view>
            <view class="cu-list menu">
                <my-date label="毕业时间" class="text-grey" @input="editGraduationDate"
                         v-model="personalMsg.graduationDate" placeholder="请选择毕业时间" fields="month"></my-date>
            </view>

            <view class="cu-list menu">
                <my-date label="参加工作时间" class="text-grey" @input="editWorkDate"
                         v-model="personalMsg.startWorkDate" placeholder="请选择参加工作时间" fields="month"></my-date>
            </view>

            <!--  这个是配字典将来可以滚动选择  -->
            <view class="cu-list menu">
                <secondPickerVue label="职    业"
                                 class="text-grey" v-model="personalMsg.job"
                                 placeholder="请选择职业"></secondPickerVue>
            </view>

            <view class="cu-list menu">
                <navigator class="cu-item arrow"
                           :url="`/pages/member/dreamCompanySign?query=${JSON.stringify(this.personalMsg.dreamCompanySign)}`"
                           :style="[{animationDelay: '0.8s'}]">
                    <view class="content">
                        <text class="text-grey">憧憬公司标签</text>
                    </view>
                    <view class="action tag">
                        <text class="text-grey">{{personalMsg.dreamCompanySign}}</text>
                    </view>
                </navigator>
            </view>

            <!-- <view class="cu-list menu">
                <navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/dreamCompanySign" :style="[{animationDelay: '0.9s'}]">
                    <view class="content">
                        <text class="text-grey">是否匿名</text>
                    </view>
                    <view class="action">
                        <text class="text-grey">{{personalMsg.dreamCompanySign}}</text>
                    </view>
                </navigator>
            </view> -->

        </scroll-view>
    </view>
</template>

<script>
    import api from '@/api/api.js';
    import appSelect from '@/components/my-componets/appSelect.vue';
    import secondPickerVue from '@/components/my-componets/secondPicker.vue';
    import myImageUpload from '@/components/my-componets/my-image-upload.vue';
    import myDate from '@/components/my-componets/my-date.vue';
    import configService from '@/common/service/config.service.js'
	import {mapState,mapMutations} from "vuex";
	import backToHome from "@/pages/component/backToHome.vue";
    export default {
        components: {
            appSelect, myImageUpload, myDate, secondPickerVue,backToHome
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
                editAvatarUrl: '/sys/editAvatar',
                fileUrl: configService.fileSaveURL,
                imgList: [],
                pathlist:[],
            };
        },
        onShow() {
            this.loadinfo();
        },
        methods: {
			...mapMutations(['changeMyLabelList']),
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
            },
            loadinfo() {
                this.$tip.loading();
                this.$http.get(this.userUrl, {params: {id: this.$store.getters.userid}}).then(res => {
                    if (res.data.success) {
                        const {avatar, sex, status} = res.data.result;
                        if (avatar && avatar.length > 0) {
                            this.personalMsg.avatar = api.getFileAccessHttpUrl(avatar);
                        }
						// console.log(res.data,"数据")
						// 存一下请求的标签到仓库中
                        this.personalMsg = res.data.result;
						if(!res.data.result.dreamCompanySign){
							this.changeMyLabelList([])
						}else
						{
						 	const labelList = res.data.result.dreamCompanySign.split(',');
							
							this.changeMyLabelList(labelList)
						}
                        this.personalMsg.sex = sex === 1 ? '男' : '女';
                        this.personalMsg.sexNum = sex;
                        this.personalMsg.status = status === 1 ? '正常' : '冻结';
                    }
                    this.$tip.loaded();
                }).catch(e => {
                    this.$tip.loaded();
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
                    	console.log("res",res)
                        const tempFilePaths = res.tempFilePaths[0];
                        this.uploadAvatar(tempFilePaths);
                    }
                });
            },
            // 上传头像
            uploadAvatar(tempFilePaths) {
                console.log('tempFilePaths///',tempFilePaths );
                uni.uploadFile({
                    url: `${configService.fileUploadURL}`,
                    filePath: tempFilePaths,
                    name: 'file',
                    success: (uploadFileRes) => {
                        console.log('filePath:',tempFilePaths );
                        let path = JSON.parse(uploadFileRes.data).message
                        this.pathlist.push(path);
                        if (this.pathlist.length != 0) {
                            this.editAvatar(path);
                        }
                    }
                });
            },
            editAvatar(path){
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
		/* background-color: antiquewhite; */
        margin-top: -45rpx;
		/* position: relative */
    }
	.imgwrap{
		position: relative;
	}
    .cameraadd {
        /* position: absolute; */
		position: absolute;
		bottom:20rpx;
		right:40rpx;
    }

</style>
