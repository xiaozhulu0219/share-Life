<template>
    <view class="wx-login">
        <!--这个是找回密码页-->
        <!-- <watermark></watermark> -->
        <!-- <view class="wx-login-title">找回密码</view> -->
        <view class="text-center" :style="[{animation: 'show ' + 0.4+ 's 1'}]">
            <image src="../../static/avatar_boy.png" mode='aspectFit' class="logo"></image>
            <view class="wx-register-title text-shadow"> SHARE LIFE</view>
        </view>
        <view class="xw-login-form">
            <form @submit="forgetPassword">
                <view class="xw-login-form-item">
                    <view class="xw-login-form-label">手机号</view>
                    <input class="xw-login-form-input" maxlength="11" placeholder="请填写手机号" type="text" name="mobile"
                           v-model="mobile"/>
                    <view class="login-form-icon login-form-seepass" @click="mobile=''" v-if="mobile.length">
                        <uni-icons type="clear" size="26" color="#B9CCE0"></uni-icons>
                    </view>
                </view>
                <view class="xw-login-form-item">
                    <view class="xw-login-form-label">验证码</view>
                    <view class="code-box">
                        <input class="xw-login-form-input" placeholder="请填写验证码" v-model="captcha" name="captcha"
                               type="text"/>
                        <view class="wx-btn wx-btn-info" @click="getMsgCode()" v-if="!loading">获取验证码</view>
                        <view class="wx-btn wx-btn-grad" v-else>{{time}}秒后重试</view>
                    </view>
                </view>
                <view class="xw-login-form-item">
                    <view class="xw-login-form-label">新密码</view>
                    <input class="xw-login-form-input" placeholder="请输入密码" name="password" :password="showPassword"
                           type="text" value=""/>
                    <view class="login-form-icon login-form-seepass" @click="changePassword">
                        <image src="../../static/images/l03.png" mode="aspectFill" v-if="showPassword"></image>
                        <image src="../../static/images/l04.png" mode="aspectFill" v-else></image>
                    </view>
                </view>
                <text class="xw-login-form-code" @click="goLogin">已修改，去登录</text>
                <button class="wx-btn wx-btn-info xw-login-form-btn" form-type="submit">找回密码</button>
                <view class="login-agree">
                    <view class="login-agree-checked" @click="agree = !agree">
                        <view class="checkWrap">
                            <text :class="['cuIcon-check',{isSelected: agree}]"></text>
                        </view>
                        <text class="login-agree-btn">已阅读并同意</text>
                    </view>
                    <view class="login-agree-text" @click="goAgreement()">《隐私及服务协议》</view>
                </view>
            </form>
        </view>
    </view>
</template>

<script>
    import formChecker from '@/common/formChecker.js';

    export default {
        data() {
            return {
                captcha: '',
                loading: false,
                timer: null,
                time: 60,
                mobile: '',
                cid: '',
                showPassword: true,
                agree: false,
                rules: [
                    {
                        name: 'mobile',
                        checkType: 'required',
                        errorMsg: '请填写手机号码'
                    },
                    {
                        name: 'mobile',
                        checkType: 'phone',
                        checkRule: '11',
                        errorMsg: '请填写正确的手机号码'
                    },
                    {
                        name: 'captcha',
                        checkType: 'required',
                        errorMsg: '请输入验证码'
                    },
                    {
                        name: 'password',
                        checkType: 'required',
                        errorMsg: '请输入密码'
                    },
                    {
                        name: 'password',
                        checkType: 'string',
                        checkRule: '8,20',
                        errorMsg: '密码至少输入8-20位'
                    }
                ]
            };
        },
        onLoad() {
        },
        methods: {
            changePassword() {
                this.showPassword = !this.showPassword;
            },
            goLogin() {
                uni.navigateTo({
                    url: '/pages/login/login'
                });
            },
            goAgreement() {
                // uni.navigateTo({//本地协议
                // 	url: '../../pages/agreement/index?name=微聊'
                // })
                this.$http.request({ //在线协议
                    url: '/common/getAgreement',
                    success: (res) => {
                        if (res.data.code == 200) {
                            // #ifdef H5
                            window.open(res.data.data);
                            // #endif
                            // #ifdef APP-PLUS
                            this.$fc.openWebView(res.data.data);
                            // #endif
                        }
                    }
                });
            },
            getMsgCode() {
                var reg = /^1[0-9]{10,10}$/;
                if (!reg.test(this.mobile)) {
                    uni.showToast({
                        title: '请输入正确的手机号',
                        icon: 'none'
                    });
                    return;
                }
                this.loading = true;
                this.timer = setInterval(() => {
                    this.time--;
                    if (this.time <= 0) {
                        clearInterval(this.timer);
                        this.loading = false;
                        this.time = 60;
                    }
                }, 1000);
                this.$http.get('/sys/sharelifeSend', {params: {phone: this.mobile}}).then(res => {
                    if (res.data.success) {
                        this.captcha = res.data.result;
                        uni.showToast({
                            title: '验证码已发送至你的手机',
                            icon: 'none'
                        });
                    }
                });
            },
            forgetPassword(e) {
                var formData = e.detail.value;
                var checkRes = formChecker.check(formData, this.rules);
                if (checkRes) {
                    if (!this.agree) {
                        uni.showToast({
                            title: '请先同意《隐私及服务协议》',
                            icon: 'none'
                        });
                        return;
                    }

                    this.$http.post('/sys/sharelifeForget', formData).then(res => {
                        if (res.data.success) {
                            uni.showToast({
                                title: '密码修改成功',
                                complete() {
                                    setTimeout(() => {
                                        uni.redirectTo({
                                            url: '/pages/login/login'
                                        });
                                    }, 1500);
                                }
                            });
                        }
                    });
                } else {
                    uni.showToast({
                        title: formChecker.error,
                        icon: 'none',
                        position: 'bottom'
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wx-login-title {
        text-align: center;
        padding-top: 120rpx;
        font-size: 42rpx;
        padding-bottom: 24rpx;
    }

    .xw-login-form {
        padding: 34rpx;
    }

    .xw-login-form-item {
        position: relative;
        padding: 0 12rpx;
        border-bottom: 1px #eee solid;
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 100rpx;
        height: 100rpx;
        background-color: #ffffff;
        padding: 1px 15px;
        min-height: 50px;
        margin-bottom: 15px;
        box-shadow: 0 0 5px rgba(0,0,0, 0.1);
        border-radius: 4px;
    }

    .xw-login-form-label {
        width: 160rpx;
        min-width: 160rpx;
    }

    .xw-login-form-input {}
    .code-box {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;
    }
    .login-agree {
        margin-top: 34rpx;
        justify-content: center;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .login-agree-text,
    .login-agree-btn {
        font-size: 24rpx;
        color: #222;
    }

    .login-agree-text {
        color: #8295a5;
    }

    .login-form-icon {
        width: 50rpx;
        height: 50rpx;
    }

    .login-form-seepass {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .login-form-icon image {
        float: left;
        width: 50rpx;
        height: 50rpx;
    }

    .xw-login-form-code {
        padding: 0 12rpx;
        height: 100rpx;
        line-height: 100rpx;
        color: #8295a5;
        cursor: pointer;
    }

    .wx-btn {
        min-width: 200rpx;
        height: 75rpx;
        line-height: 75rpx;
        text-align: center;
        border-radius: 12rpx;
        background-color: #007AFF;
        color: #fff;
        font-size: 32rpx;
    }

    .wx-btn-info {
        background-color: #007AFF;
    }
    .wx-btn-grad {
        background-color: #ccc;
        color: #fff;
        cursor: not-allowed;
    }

    .xw-login-form-btn {
        width: 300rpx;
        margin-top: 10rpx;
    }
    .login-agree-checked {
        display: flex;
        align-items: center;
    }
    .checkWrap {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid #ccc;
        margin-right: 8px;
    }
    .cuIcon-check {
        color: transparent;
        font-size: 14px;
    }
    .isSelected {
        color: #007AFF;
    }
    .wx-register-title {
        text-align: center;
        padding-top: 60rpx;
        font-size: 42rpx;
        padding-bottom: 24rpx;
    }
    .logo {
        height: 90px;
        margin-top: 20px;
    }
</style>
