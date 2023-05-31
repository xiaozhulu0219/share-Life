<template>
	<!--个人页的一些页面--昵称修改页-->
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">编辑昵称</view>
			<view slot="right" @click="onSubmit">保存</view>
		</cu-custom>
		<form>
			<view class="title text-grey " style="font-size:120%; height: 40px;padding: 10px;padding-left: 25px;">
				七天内可修改一次名字</view>

			<view class="cu-form-group" style="border-radius: 10px;width: 95%;margin: 0 auto;">
				<input placeholder="请输入昵称" name="input" v-model="myFormData.nickName" />
			</view>

			<view class="title text-grey "
				style="font-size:30%;width: 300px; height: 40px;padding: 10px;padding-left:25px; ">请输入2-24个字符，不包括@<>
					/等无效字符哦</view>


		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
				switchC: true,
				imgList: [],
				uploadUrl: "/sys/common/upload",
				myFormData: {
					nickName: '',
					orgCode: '',
					workNo: '',
					id: '',
				},
			};
		},
		onLoad: function(option) {
			console.log("this.$Route.query", this.$Route.query);
			let query = this.$Route.query
			if (query) {
				this.myFormData = query;
				if (this.myFormData.sex == '女') {
					this.switchC = false
				} else if (this.myFormData.sex == '男') {
					this.switchC = true
				}
				if (this.myFormData.avatar) {
					this.imgList = [this.myFormData.avatar]
				}
				// if (!this.myFormData.birthday) {
				// 	this.myFormData.birthday = '无'
				// }
				if (this.myFormData.identity == '普通成员') {
					this.myFormData.identity = 1
				} else if (this.myFormData.identity == '上级') {
					this.myFormData.identity = 2
				}
				if (this.myFormData.status == '正常') {
					this.myFormData.status = 1
				} else if (this.myFormData.status == '冻结') {
					this.myFormData.status = 2
				}
				this.Avatar = this.myFormData.avatar

				Object.keys(this.myFormData).map(key => {
					if (this.myFormData[key] == '无') {
						this.myFormData[key] = ''
					}
				})
				console.log("this.myFormData", this.myFormData)
			}
		},
		methods: {
			onSubmit() {
				let myForm = this.myFormData
				console.log("myForm", myForm)
				// if (this.switchC) {
				//     this.myFormData.sex = 1
				// } else {
				//     this.myFormData.sex = 2
				// }
				this.$tip.loading();
				this.$http.get('/sys/editNickName', {
					params: {
						id: this.$store.getters.userid,
						nickName: myForm.nickName
					}
				}).then(res => {
					console.log(res)
					this.$tip.loaded();
					if (res.data.success) {
						this.$tip.toast('提交成功')
						this.$Router.replace({
							name: 'memberdetail'
						})
						/* uni.navigateTo({
						    url: '/pages/user/userdetail'
						}) */
					}
				}).catch(() => {
					this.$tip.loaded();
					this.$tip.error('提交失败')
				});
			},
			DateChange(e) {
				this.myFormData.birthday = e.detail.value
			},
			SwitchC(e) {
				this.switchC = e.detail.value
			},
			ChooseImage() {
				var that = this;
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						that.$http.upload(that.$config.apiUrl + that.uploadUrl, {
								filePath: res.tempFilePaths[0],
								name: 'file'
							})
							.then(res => {
								that.myFormData.avatar = res.data.message;
							})
							.catch(err => {
								that.$tip.error(err.data.message)
							});
						this.imgList = res.tempFilePaths
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除这段回忆吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.save {}
</style>
