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
				<view class="align-center padding text-black text-lg" v-for="(item,index) in listData" :key="index">
					<view class="padding-left">
						{{item.companyName}}
						{{item.bussinessAddress}}
						{{item.legalPerson}}
						{{item.companyStatus}}
						{{item.registeredCapital}}
						<button style="font-size: 18rpx;"  @click="confirmHelp(item)">拿捏此企业</button>
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
						}
					})
				}
			},
			confirmHelp(item) {
				//console.log("11111：",this.model.tianyanchaId)
				console.log("22222：",item.tianyanchaId)
				this.$http.get(this.url.toEvaluate, {
					params: {
						tianyanchaId:Number(item.tianyanchaId),
					}
				}).then(res => {
					//console.log("33333：",this.model)
					console.log("444444：",res.data.result)
					if (res.data.success) {
						uni.navigateTo({//pages/helpcompany/homeHelpCompanyDetail.vue
							url: '/pages/home/homeHelpCompanyDetail?item=' + encodeURIComponent(JSON.stringify(res.data.result))
						})
					}
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
		/* background-color:#ccc; */
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
</style>
