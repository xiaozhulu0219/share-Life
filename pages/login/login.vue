<template>
	<view class="zai-box">
		<scroll-view scroll-y class="page">
			<view class="text-center" :style="[{animation: 'show ' + 0.4+ 's 1'}]">
				<!--	<image src="https://static.jeecg.com/upload/test/login4_1595818039175.png" mode='aspectFit' class="zai-logo "></image>-->
				<image src="../../static/images/logo.png" mode='aspectFit' class="zai-logo "></image>
				<view class="zai-title text-shadow "> SHARE LIFE </view>
			</view>
			<view class="box padding-lr-xl login-paddingtop" :style="[{animation: 'show ' + 0.6+ 's 1'}]">
				<block>
					<view class="cu-form-group margin-top  shadow-warp" :class="[shape=='round'?'round':'']">
						<view class="title"><text class="cuIcon-people margin-right-xs"></text>账号:</view>
						<input placeholder="请输入手机号" name="input" type="number" maxlength="11" v-model="phoneNo" />
					</view>
					<!-- 手机号密码登录 start -->
					<view v-if="loginWay==1" class="cu-form-group margin-top shadow-warp"
						:class="[{'round': shape == 'round'}]">
						<!--						<view class="title"><text class="cuIcon-lock margin-right-xs"></text>密{{"\u3000"}}码:</view>-->
						<view class="title"><text class="cuIcon-lock margin-right-xs"></text>密码:</view>
						<input class="uni-input" placeholder="请输入密码" :password="!showPassword" v-model="password" />
						<view class="action text-lg">
							<text :class="[showPassword ? 'cuIcon-attention' : 'cuIcon-attentionforbid']"
								@click="changePassword"></text>
						</view>
					</view>
					<!-- 手机号密码登录 end -->
					<!-- 手机号验证码登录 start -->
					<view v-else class="cu-form-group margin-top shadow-warp" :class="[{'round': shape == 'round'}]">
						<view class="title"><text class="cuIcon-lock margin-right-xs"></text>验证码:</view>
						<input class="uni-input" placeholder="请输入验证码" v-model="smsCode" />
						<view class="action">
							<button class="cu-btn line-blue sm" :disabled="!isSendSMSEnable" @click="onSMSSend">
								{{ getSendBtnText }}</button>
						</view>
					</view>
					<!-- 手机号验证码登录 end -->
					<text class="xw-login-form-code" v-if="loginWay !== 1" @click="loginWay = 1">使用密码登录</text>
					<text class="xw-login-form-code" v-if="loginWay !== 2" @click="loginWay = 2">使用短信验证码登录</text>
					<view class="xw-login-form-code" @click="goForgetPass">忘记密码</view>
					<view class="xw-login-form-code register" @click="goRegister">还未注册，去注册</view>
					<view class="padding text-center margin-top">
						<button class="cu-btn bg-blue lg margin-right shadow" :loading="loading"
							:class="[{'round':shape == 'round'}]" @tap="login('password')">
							<text space="emsp">{{loading ? "登录中...":" 登录 "}}</text>
						</button>
					</view>
				</block>

				<!-- #ifdef APP-PLUS -->
				<view class="padding flex flex-direction  text-center">
					当前版本:{{version}}
				</view>
				<!-- #endif -->

			</view>
		</scroll-view>
		<!-- 登录加载弹窗 -->
		<view class="cu-load load-modal" v-if="loading">
			<image src="https://static.jeecg.com/upload/test/login4_1595818039175.png" mode="aspectFit" class="round">
			</image>
			<view class="gray-text">登录中...</view>
		</view>
		<!-- 隐私协议 -->
		<view class="login-agree">
			<view class="login-agree-checked" @click="agree = !agree">
				<view class="checkWrap"><text :class="['cuIcon-check',{'isSelected': agree}]"></text></view>
				<text class="login-agree-btn">已阅读并同意</text>
			</view>
			<view class="login-agree-text" @click="goAgreement()">《隐私及服务协议》</view>
		</view>
		<!-- 隐私协议 -->
		<uni-popup ref="privacyPopup" class="privacyPopup" type="center">
			<view class="privacy-container" style="width: 80vw;height:70vh
			;background-color: #fff;">
			<view class="privacy-title">
				用户服务协议
			</view>
			<view class="privacy-info">
				欢迎您注册并使用share-life的服务！
			</view>
			<view class="">
				本《用户服务协议》（以下简称“本服务协议”）
				是您与share-life之间就注册share-life用户账号及使用share-life
				的各项服务等相关事宜所订立的协议。为使用share-life的服务，
				您应当仔细阅读并遵守本服务协议下的全部内容，
				特别是涉及免除或者责任限制的条款，
				该类条款可能以黑体加粗或加下划线的形式提示您重点注意。
				除非您已阅读并接受本服务协议所有条款，否
				则您将不能注册share-life账号或使用share-life的服务，
				如您不同意本服务条款的任意内容，请勿注册或使用share-life的服务
				，并应立即停止注册程序。如您对本服务协议的内容
				（特别是涉及免除或者责任限制的条款）有任何疑义，
				可随时按照本服务协议中列明的联系方式与我们联系，
				我们将根据您的要求为您进一步解释和说明相关内容。
				如您勾选“我同意《用户服务协议》”并通过注册程序或
				其他任何方式使用或接受share-life的任何服务，
				即视为您已阅读并同意本服务协议，
				自愿接受本服务协议的所有内容的约束。
				请您在决定注册或使用服务前再次确认您
				已知悉并完全理解本服务协议的所有内容。
			</view>
			</view>
		</uni-popup>
	</view>

</template>

<script>
	import {
		ACCESS_TOKEN,
		USER_NAME,
		USER_INFO
	} from '@/common/util/constants';
	import {
		mapActions
	} from 'vuex';
	import configService from '@/common/service/config.service.js';

	export default {
		data() {
			return {
				shape: '', //round 圆形
				loading: false,
				password: '12345678',
				//phoneNo: '16600251650',
				//phoneNo: '15288888888',
				phoneNo: '',
				smsCode: '',
				showPassword: false, //是否显示明文
				loginWay: 1, //1: 账密，2：验证码
				smsCountDown: 0,
				smsCountInterval: null,
				toggleDelay: false,
				version: '',
				agree: true,
				//第三方登录相关信息
				thirdType: '',
				thirdLoginInfo: '',
				thirdLoginState: false,
				bindingPhoneModal: false,
				thirdUserUuid: '',
				url: {
					bindingThirdPhone: '/sys/thirdLogin/bindingThirdPhone'
				}
			};
		},
		onLoad: function(options) {
			console.log(options, 'onload')
			if (options.from === 'setting') {
				uni.showToast({
					title: '退出成功',
					icon: 'none'
				})
			}

			// #ifdef APP-PLUS
			var that = this;
			plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
				that.version = wgtinfo.version;
			});
			// #endif
		},
		computed: {
			// 发送验证码按钮是否可用
			isSendSMSEnable() {
				return this.smsCountDown <= 0 && this.phoneNo.length > 4;
			},
			// 发送验证码按钮文案
			getSendBtnText() {
				if (this.smsCountDown) {
					8
					return this.smsCountDown + '秒后发送';
				} else {
					return '发送验证码';
				}
			}
		},
		methods: {
			...mapActions(['newMLogin', 'PhoneLogin', 'ThirdLogin', 'getMessageCount']),
			// 忘记密码
			goForgetPass() {
				uni.navigateTo({
					url: '/pages/login/forgetPass'
				});
			},
			goRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			},
			// 勾选协议
			goAgreement() {
				// this.$http.request({ //在线协议
				// 	url: '/common/getAgreement',
				// 	success: (res) => {
				// 		if (res.data.code == 200) {
				// 			// #ifdef H5
				// 			window.open(res.data.data);
				// 			// #endif
				// 			// #ifdef APP-PLUS
				// 			this.$fc.openWebView(res.data.data);
				// 			// #endif
				// 		}
				// 	}
				// });
				this.$refs.privacyPopup.open();
			},
			// 登录操作
			login(type) {
				if (type === 'password') {
					this.onLogin();
					return;
				}
				this.onSMSLogin();
			},
			// 手机号密码登录
			onLogin() {
				if (!this.phoneNo || this.phoneNo.length == 0) {
					this.$tip.toast('请输入手机号');
					return;
				}
				if (!this.password || this.password.length == 0) {
					this.$tip.toast('请填写密码');
					return;
				}
				if (!this.agree) {
					uni.showToast({
						title: '请先同意《隐私及服务协议》',
						icon: 'none'
					});
					return;
				}
				if (this.loading) {
					return;
				}
				const loginParams = {
					mobile: this.phoneNo,
					password: this.password
				};
				this.loading = true;
				this.newMLogin(loginParams).then((res) => {
					this.loading = false;
					if (res.data.success) {
						// #ifdef APP-PLUS
						this.saveClientId();
						// #endif
						// #ifndef APP-PLUS
						this.$tip.success('登录成功!');
						// 请求消息数据
						this.getMessageCount()
						this.$Router.replaceAll({
							name: 'index'
						});
						// #endif
					} else {
						this.$tip.alert(res.data.message);
					}
				}).catch((err) => {
					const msg = err.data.message || '请求出现错误，请稍后再试';
					this.loading = false;
					this.$tip.alert(msg);
				}).finally(() => {
					this.loading = false;
				});
			},
			saveClientId() {
				var info = plus.push.getClientInfo();
				var cid = info.clientid;
				this.$http.get('/sys/user/saveClientId', {
					params: {
						clientId: cid
					}
				}).then(res => {
					console.log('res::saveClientId>', res);
					this.$tip.success('登录成功!');
					this.$Router.replaceAll({
						name: 'index'
					});
				});
			},
			// 密码是否可见
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			// 发送验证码到手机
			onSMSSend() {
				const smsParams = {};
				smsParams.mobile = this.phoneNo;
				smsParams.smsmode = '0';
				const checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);
				if (!smsParams.mobile || smsParams.mobile.length == 0) {
					this.$tip.toast('请输入手机号');
					return false;
				}
				if (!checkPhone.test(smsParams.mobile)) {
					this.$tip.toast('请输入正确的手机号');
					return false;
				}
				this.$http.post('/sys/sms', smsParams).then(res => {
					if (res.data.success) {
						this.smsCountDown = 60;
						this.startSMSTimer();
					} else {
						this.smsCountDown = 0;
						this.$tip.toast(res.data.message);
					}
				});
			},
			// 发送验证码倒计时
			startSMSTimer() {
				this.smsCountInterval = setInterval(() => {
					this.smsCountDown--;
					if (this.smsCountDown <= 0) {
						clearInterval(this.smsCountInterval);
					}
				}, 1000);
			},
			// 手机号验证码登录
			onSMSLogin() {
				const checkPhone = new RegExp(/^[1]([3-9])[0-9]{9}$/);

				if (!this.phoneNo || this.phoneNo.length == 0) {
					this.$tip.toast('请填写手机号');
					return;
				}
				if (!checkPhone.test(this.phoneNo)) {
					this.$tip.toast('请输入正确的手机号');
					return false;
				}
				if (!this.smsCode || this.smsCode.length == 0) {
					this.$tip.toast('请填短信验证码');
					return;
				}
				const loginParams = {
					mobile: this.phoneNo,
					captcha: this.smsCode
				};
				this.PhoneLogin(loginParams).then((res) => {
					if (res.data.success) {
						this.$tip.success('登录成功!');
						this.$Router.replaceAll({
							name: 'index'
						});
					} else {
						this.$tip.error(res.data.message);
					}
				}).catch((err) => {
					const msg = ((err.response || {}).data || {}).message || err.data.message || '请求出现错误，请稍后再试';
					this.$tip.error(msg);
				});
			},
			loginSuccess() {
				// 登陆成功，重定向到主页
				this.$Router.replace({
					name: 'index'
				});
			},
			requestFailed(err) {
				this.$message.warning('登录失败');
			}
		},
		beforeDestroy() {
			if (this.smsCountInterval) {
				clearInterval(this.smsCountInterval);
			}
		}
	};
</script>

<style scoped>
	.privacy-container{
		width: 80vw;
		height: 400rpx;
		background-color: #fff;
		padding: 20rpx 30rpx;
		overflow-y: scroll;
	}
	.privacy-title{
		font-size: 1.3em;
	}
	.privacy-info{
		margin: 20rpx 0;
	}
	
	
	.login-paddingtop {
		padding-top: 100upx;
	}

	.zai-box {
		padding: 0 20upx;
		padding-top: 100upx;
		position: relative;
	}

	.zai-logo {
		width: 200upx;
		height: 150px;
	}

	.zai-title {
		font-size: 58upx;
		color: #000000;
		text-align: center;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.zai-btn {
		background: #ff65a3;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}

	.zai-btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.xw-login-form-code {
		font-size: 28rpx;
		padding: 0 12rpx;
		height: 100rpx;
		line-height: 100rpx;
		color: #8295a5;
		cursor: pointer;
	}

	/* 隐私政策 */
	.login-agree {
		margin-bottom: 10px;
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

	.login-agree-text {
		color: #8295a5;
	}

	.cuIcon-check {
		color: transparent;
		font-size: 14px;
	}

	.isSelected {
		color: #007AFF;
	}

	.register {
		text-align: right;
	}
</style>
