import {
		downloadApp,
		installApp
	} from "@/pages/component/updateUtils.js"
	export default {
		data() {
			return {
				updateUrl: '/systemConfiguration/systemConfiguration/showData',
				isDownloadFinish:false,
				filename:'',
				version:''
			}
		},
		methods: {
			updateNotForce(){
				//	#ifdef H5
				uni.hideLoading()
				console.log("直接弹出")
				this.$refs.popup.open()
				// #endif
				
				// #ifdef APP-PLUS
				// var that = this;
				plus.runtime.getProperty(plus.runtime.appid, (wgtinfo)=> {
					this.version = wgtinfo.version;
					console.log(this.version,"版本")
					this.$http.get(this.updateUrl).then(res => {
						console.log("数据", res)
						const targetObj = res.data.result
						const targetCode = targetObj.versionNum
						// console.log(version,"当前版本",targetCode,"下载版本" )
						uni.hideLoading()
						if (targetCode >this.version ) {
							console.log("需要升级");
							// 渲染更新弹窗
							console.log(targetObj);
							targetObj.force = false
							this.updateObj = targetObj;
				
							this.$refs.popup.open();
				
						} else {
							uni.showToast({
								title:'不需要更新',
								icon:'none'
							})
							console.log("不需要升级");
							return
						}
					})
				
				});
				// #endif
			},
			updateForce() {
				// const localVersion = uni.getSystemInfoSync();
				// const currentCode = localVersion.appVersionCode;

				// #ifdef APP-PLUS
				// var that = this;
				plus.runtime.getProperty(plus.runtime.appid, (wgtinfo)=> {
					this.version = wgtinfo.version;
					console.log(this.version,"版本")
					this.$http.get(this.updateUrl).then(res => {
						console.log("数据", res)
						const targetObj = res.data.result
						const targetCode = targetObj.versionNum
						// console.log(version,"当前版本",targetCode,"下载版本" )
						const isforcedUpdate = targetObj.forceUpdate
						if (targetCode >this.version && isforcedUpdate == 1) {
							console.log("需要升级");
							// 渲染更新弹窗
							// 传递数据  慢的有点不正常  我重启一下  你来吧
							console.log(targetObj);
							targetObj.force = true
							this.updateObj = targetObj;

							this.$refs.popup.open();

						} else {
							console.log("不需要升级");
							return
						}
					})

				});
				// #endif


			},
			updateApp() {
				console.log("点击下载了");
				// console.log(this.updateObj)
				const tarUrl = this.updateObj.downloadLink
				console.log("H5无法看到下载结果",tarUrl)
				// #ifdef APP-PLUS
				let platform = uni.getSystemInfoSync().platform //手机平台
				if (platform === 'android') {
					uni.showLoading({
						title: '下载中...'
					})
					downloadApp(tarUrl).then((fileName) => {
						if (fileName) {
							uni.hideLoading()
							uni.showToast({
								title:"下载完成",
								icon:'none'
							})
							this.isDownloadFinish = true;
							this.filename = fileName;
							console.log(this.filename,"下载结果")
							this.handleInstallApp();
						}
					})
				}
				// #endif
			},
			handleInstallApp() {
				if (this.isDownloadFinish && this.filename ) {
					installApp(this.filename, () => {
						//安装成功,关闭升级弹窗
						this.$refs.popup.close();
					})
				}
			}
		}
	}
