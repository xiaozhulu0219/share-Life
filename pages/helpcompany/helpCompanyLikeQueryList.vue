<template>
	<!--助力公司模糊搜索页、表单区域-->
	<view>
		<!--标题和返回-->
		<cu-custom  isBack :backRouterName="backRouteName">
			<block slot="backText">返回</block>
			<block slot="content">助力公司</block>
		</cu-custom>
		<!--表单区域-->
		<view>
			<form>
				<view class="search padding">
					<view class="iptbox">
						<input placeholder="输入要助力的公司简称或者邮箱后缀" v-model="model.companyName" class="ipt text-df"
							@confirm="searchCompany" @input="searchCompany" />
					</view>
					<button class="cu-btn block bg-gray lg" @click="clear">
						<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>取消
					</button>
				</view>

			</form>
			<!-- 模糊搜索列表 -->
			<view class="cu-list bg-white">
				<view class="card" v-for="(item,index) in listData" :key="index" >
					<view class="padding-left">
						<view class="card-title">{{item.companyName}}</view>
						<view class="card-text">{{item.bussinessAddress}}</view>
						<view class="card-text">{{item.legalPerson}}</view>
						<view class="card-text">{{item.companyStatus}}</view>
						<view class="card-text">{{item.registeredCapital}}</view>

						<button @click="confirmHelp(item)">
							<view class="iconfont ml-1" style="color: #fbbd08 ; margin-top: 8rpx "  @click="confirmHelp(item)"> 拿捏此企业 &#xe69f
							</view>
						</button>
					</view>
					<view class="list-line"></view>
				</view>
			</view>
		</view>
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
		data() {
			return {
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				loading: false,
				backRouteName: 'index',
				listData: [], //模糊搜索列表
				model: {
					companyName: '',
					companyId: '',
					bussinessAddress: '',
					legalPerson: '',
					companyStatus: '',
					registeredCapital: '',
				},
				url: {
					findPageByCompanyName: "/company/findPageByCompanyName", //助力新增页面模糊查询调用天眼查
					toEvaluate: "/company/toEvaluate"   //去拿捏-直接跳转到该企业详情
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
				this.model.companyName = []
				this.companyName = null
				this.queryParam = {}
				this.loadList(1)
				this.model.listData = [] //模糊搜索列表
				this.listData = []
			},
			searchCompany() {
				// 助力新增页面模糊查询调用天眼查
				// 表单项内容发生改变
				if (this.model) {
					let companyName = this.model.companyName;
					this.$http.get(this.url.findPageByCompanyName, {
						params: {
							companyName: companyName
						}
					}).then((res) => {
						if (res.data.success) {
							this.listData = res.data.result.records
							for (let d of this.listData) {
								d.companyName = "公司名称：" + d.companyName
								d.legalPerson = "法人：" + d.legalPerson
								d.registerTime = "注册时间：" + d.registerTime
								d.registeredCapital = "注册资金：" + d.registeredCapital
								d.companyStatus = "经营状态：" + d.companyStatus
								d.bussinessAddress = "经营地：" + d.bussinessAddress
								d.organizationCode = "组织编码：" + d.organizationCode
							}
						}
					})
				}
			},
			//临时不再从数据库查，默认这是第一次搜索到这个公司、以后这里模糊查就是从数据库，所以传过来就是最全的结果
			confirmHelp(item) {
				console.log("11111：",item)
						uni.navigateTo({
							url: '/pages/home/homeHelpCompanyDetail?item=' + encodeURIComponent(JSON.stringify(item))
						})
			},
		}
	}
</script>
<style>

	.search {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-bottom: 1px solid #eee;
	}

	.iptbox {
		flex: 1;
		padding-left: 20px;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 10rpx;
	}

	.ipt {
		display: block;
		height: 100%;
	}

	.lg {
		height: 40px;
	}

	.list-line {
		background-color: #eee;
		width: 100%;
		height: 1rpx;
		margin-top: 5rpx;
	}


	.card {
		background-color:  $uni-bg-color-grey;
		border-radius: 20rpx;
		margin-bottom: 10rpx;/*盒子间的距离*/
		margin-top: 25rpx; /*盒子距离顶部的距离*/
		line-height: 65rpx;  /*行高*/
		margin-left: 20rpx;

		.card-title {
			font-weight: bold;
			font-size: 38rpx;
		}

		.card-text {
			font-size: 32rpx;
		}
	}
</style>
