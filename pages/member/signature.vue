<template>
	<!--个人页的一些页面--简介修改页-->
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">编辑简介</view>
			<view slot="right" @click="onSubmit">保存</view>
		</cu-custom>
		<form>
			<view class="title text-grey " style="font-size:120%; height: 40px;padding: 10px;padding-left: 30px; ">
				七天内可修改三次简介</view>

			<view class="cu-form-group textarea">
				<textarea placeholder="个性签名" style="width: 18px; height: 200px; " name="input"
					v-model="myFormData.signature"></textarea>
          	<view class="count-limit"> {{ (myFormData.signature && myFormData.signature.length) || 0 }} / {{ maxLength }}</view>
			</view>

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
        		maxLength: 60,
				uploadUrl: '/sys/common/upload',
				myFormData: {
					signature: '',
					sex: 1,
					orgCode: '',
					workNo: '',
					id: ''
				}
			};
		},
		onLoad: function(option) {
			console.log('this.$Route.query', this.$Route.query);
			const query = this.$Route.query;
			if (query) {
				this.myFormData = query;
				Object.keys(this.myFormData).map(key => {
					if (this.myFormData[key] == '无') {
						this.myFormData[key] = '';
					}
				});
				console.log('this.myFormData', this.myFormData);
			}
		},
		methods: {
			onSubmit() {
				const myForm = this.myFormData;
				console.log('myForm', myForm);
				this.myFormData.id = this.$store.getters.userid;
				this.myFormData.signature = this.myFormData.signature;

				console.log('myform', this.myFormData);
				this.$tip.loading();
				this.$http.get('/sys/editSignature', {
					params: {
						id: this.$store.getters.userid,
						signature: this.myFormData.signature
					}
				}).then(res => {
					console.log(res);
					this.$tip.loaded();
					if (res.data.success) {
						this.$tip.toast('提交成功');
						this.$Router.replace({
							name: 'memberdetail'
						});
						/* uni.navigateTo({
						    url: '/pages/user/userdetail'
						}) */
					}
				}).catch(() => {
					this.$tip.loaded();
					this.$tip.error('提交失败');
				});
			},
			DateChange(e) {
				this.myFormData.birthday = e.detail.value;
			},
			SwitchC(e) {
				this.switchC = e.detail.value;
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
								that.$tip.error(err.data.message);
							});
						this.imgList = res.tempFilePaths;
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
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				});
			}
		}
	};
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);

	}

	.textarea {
		margin-top: 10px;
		border-radius: 20px;
		width: 90%;
		margin: 0 auto;
    position: relative;
	}
  .count-limit {
    position: absolute;
    bottom: 10rpx;
    right: 10rpx;
      font-size: 14rpx;
      color: #666;
    }
</style>
