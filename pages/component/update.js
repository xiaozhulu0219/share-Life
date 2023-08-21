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
			}
		},
		methods: {
			updateForce() {
				const localVersion = uni.getSystemInfoSync();
				console.log(localVersion, "当前版本")
				const currentCode = localVersion.appVersionCode;
				this.$http.get(this.updateUrl).then(res => {
					console.log("数据", res)
					const targetObj = res.data.result
					const targetCode = targetObj.versionNum
					if (targetCode > currentCode) {
						console.log("需要升级");
						// 渲染更新弹窗
						// 传递数据
						console.log(targetObj);
						targetObj.force = true
						this.updateObj = targetObj;

						this.$refs.popup.open();

					} else {
						console.log("不需要升级");
						return
					}
				})
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
							this.filename = fileName
							this.handleInstallApp();
						}
					})
				}
				// #endif
			},
			handleInstallApp() {
				if (this.isDownloadFinish && this.filename ) {
					installApp(this.fileName, () => {
						//安装成功,关闭升级弹窗
						this.$refs.popup.close();
					})
				}
			}
		}
	}
