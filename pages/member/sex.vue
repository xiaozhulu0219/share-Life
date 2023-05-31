<template>
	<!--个人页的一些页面--性别修改页-->
	<view class="sex-container">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">编辑性别</view>
			<view slot="right" @click="onSubmit()">保存</view>
		</cu-custom>
		<form>
      <view class="title">选择你的性别</view>
			<view class="sex-options">
          <view @tap="switchSex(2)" class="sex">女<view v-show="sex === 2" class='cuIcon-check'></view></view>
          <view class="gap"></view>
          <view @tap="switchSex(1)" class="sex">男<view v-show="sex === 1" class='cuIcon-check'></view></view>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
        sex: 0
			};
		},
		onLoad: function(option) {
			const sex = this.$Route.query;
      this.sex = sex;
		},
		methods: {
      switchSex(sex) {
        this.sex = sex;
      },
			onSubmit() {
				const id = this.$store.getters.userid;
				this.$tip.loading();
				this.$http.get('/sys/editSex', {
					params: {
						id,
						sex: this.sex
					}
				}).then(res => {
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
				}).catch((err) => {
					console.log(err, 'err');
					this.$tip.loaded();
					this.$tip.error('提交失败');
				});
			}
		}
	};
</script>

<style>
.right {
  cursor: pointer;
}
.sex-container {
  background-color: #f0f0f0;
}
	 .title {
		min-width: calc(4em + 15px);
    color: #666;
    font-size: 16px;
    margin-left: 20px;
    margin-top: 20px;

	}
  .sex-options {
    box-sizing: border-box;
    width: 96%;
    margin: 20rpx;
    height: 200rpx;
    background-color: #fff;
    border-radius: 16rpx;
  }
  .sex {
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    line-height: 100rpx;
    cursor: pointer;
  }
  .cuIcon-check {
    color:#0081ff;
  }
  .gap{
    width: 98%;
    height: 1px;
    margin: 0 auto;
    background: #f0f0f0;
  }
</style>
