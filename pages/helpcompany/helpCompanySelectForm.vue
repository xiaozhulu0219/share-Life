<template>
	<!--模糊查询后，被选择的企业的页面-->
	<view>
		<!--标题和返回-->
		<cu-custom :bgColor="NavBarColor" isBack :backRouterName="backRouteName">
			<block slot="backText">返回</block>
			<block slot="content">助力公司</block>
		</cu-custom>
		<!--表单区域-->
		<view>
			<form>
				<view class="search">
					<view class="iptbox">
						<input placeholder="输入要助力的公司简称或者邮箱后缀" v-model="model.enterpriseName" class="ipt"
							@confirm="searchCompany" @input="searchCompany" />
					</view>
					<button class="cu-btn block bg-gray margin-tb-sm lg" @click="clear">
						<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>取消
					</button>
				</view>

			</form>
			<!-- 模糊搜索列表 -->
			<view class="cu-list menu">
				<view class="cu-item" v-for="(item,index) in listData" :key="index" @click="goHome">
					<view class="flex" style="width:100%;align-items:center;">
						<image src="../../static/images/weixuanze.png" mode="" @click="search"
							style="width: 15px ;height: 15px"></image>
						<view style="width: 60%;margin-left: 10rpx;">{{item.enterpriseName}}</view>
						<view>
							<button @click="showModal">拿捏此企业</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="popup" type="center">
			<view class="popup-card bg-white">
				<view class="popup-body">
					<view class="flex popup-content popup-title">助力公司</view>
					<view class="flex popup-content popup-text">助力该公司后，您需要认证自己资料为在职、离职、面试者身份后，可为该企业添加标签以及首条评论</view>
					<view class="flex popup-content">
						<view class="card-item padding bg-gradual-green" @click="confirmHelp">确认助力</view>
						<view class="card-item padding bg-gradual-blue" @tap="closeModal">再想想</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import myDate from '@/components/my-componets/my-date.vue'

	export default {
		name: "informationForm",
		components: {
			myDate
		},
		props: {
			formData: {
				type: Object,
				default: () => {},
				required: false
			}
		},
		onLoad(option) {
			this.model.enterpriseName = option.name;
			this.searchCompany()
		},
		data() {
			return {
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				loading: false,
				backRouteName: 'index',
				listData: [], //模糊搜索列表
				model: {
					enterpriseName: '',
				},
				url: {
					queryById: "/member/queryById",
					add: "/member/add",
					edit: "/member/edit",
					findPageByEnterpriseName: "/enterprise/list", //助力新增页面模糊查询调用企查查
					savePublish: "/company/movements/savePublish"
				},
			}
		},
		created() {
			this.initFormData();
		},
		methods: {

			initFormData() {
				if (this.formData) {
					let dataId = this.formData.dataId;
					this.$http.get(this.url.queryById, {
						params: {
							id: dataId
						}
					}).then((res) => {
						if (res.data.success) {
							console.log("表单数据", res);
							this.model = res.data.result;
						}
					})
				}
			},
			clear() {
				// 重置
				this.model.enterpriseName = []
				this.enterpriseName = null
				this.queryParam = {}
				this.loadList(1)

				this.model.listData = [] //模糊搜索列表
				this.listData = []
			},
			searchCompany() {
				// 助力新增页面模糊查询调用企查查
				//表单项内容发生改变
				if (this.model) {
					let enterpriseName = this.model.enterpriseName;
					this.$http.get(this.url.findPageByEnterpriseName, {
						params: {
							enterpriseName: enterpriseName
						}
					}).then((res) => {
						if (res.data.success) {
							console.log("表单数据", res);
							console.log("过滤数据", res.data.result);
							this.listData = res.data.result.records
							// this.model = res.data.result;
						}
					})
				}
			},
			goHome(){

			},
			showModal() {
				this.$refs.popup.open();
			},
			closeModal() {
				this.$refs.popup.close();
			},
			confirmHelp() {
				this.$http.post(this.url.savePublish, {
					params: {
						companyName: this.model.enterpriseName
					}
				}).then(res => {
					if (res.data.success) {
						console.log("助力成功");
					// }else{
						this.$router.push(`helpCompanyDetailForm?companyName=${this.model.enterpriseName}`)
					}
				})
			}
		}
	}
</script>
<style scoped>
	.search {
		display: flex;
		background-color: #ffffff;
		align-items: center;
	}

	.iptbox {
		width: 80%;
		background-color: #ccc;
		height: 40px;
		border-radius: 20rpx;
		padding-left: 20px;
	}

	.ipt {
		display: block;
		height: 100%;
	}

	.lg {
		height: 40px;
	}


	.popup-card {
		margin: 0 auto 40rpx;
		width: 70%;
		border-radius: 40rpx;
	}

	.popup-content {
		justify-content: space-evenly;
	}

	.card-item {
		width: 40%;
		text-align: center;
		border-radius: 20rpx;
	}

	.popup-body {
		padding: 30rpx;
		justify-content: space-between;
	}

	.popup-title {
		font-weight: bold;
		height: 60rpx;
	}

	.popup-text {
		margin: 20rpx 10rpx 60rpx 10rpx;
	}
</style>
