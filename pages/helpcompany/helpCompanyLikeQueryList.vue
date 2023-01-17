<template>
	<!--助力公司模糊搜索页、表单区域-->
	<view>
		<!--标题和返回-->
		<cu-custom :bgColor="NavBarColor" isBack :backRouterName="backRouteName">
			<block slot="backText">返回</block>
			<block slot="content">助力公司</block>
		</cu-custom>
		<!--表单区域-->
		<view>
			<form>
				<view class="search padding">
					<view class="iptbox">
						<input placeholder="输入要助力的公司简称或者邮箱后缀" v-model="model.enterpriseName" class="ipt text-df"
							@confirm="searchCompany" @input="searchCompany" />
					</view>
					<button class="cu-btn block bg-gray lg" @click="clear">
						<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>取消
					</button>

				</view>

			</form>
			<!-- 模糊搜索列表 -->
			<view class="cu-list bg-white">
				<view class="align-center padding text-black text-lg" v-for="(item,index) in listData" :key="index"
					@click="search(item.id,item.enterpriseName)">
					<!-- <checkbox style="transform:scale(0.7)" value="cb" checked="false" /> -->
					<view class="padding-left">
						{{item.enterpriseName}}
					</view>
					<view class="list-line"></view>
					<!-- <view class="flex" style="width:600%">
						<text class="">
							<image src="../../static/images/weixuanze.png" mode="" @click="search"
								   style="width: 15px ;height: 14px"></image>
							<br>
							{{item.enterpriseName}}
						</text>
					</view> -->
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
					enterpriseName: '',
				},
				url: {
					queryById: "/member/queryById",
					add: "/member/add",
					edit: "/member/edit",
					findPageByEnterpriseName: "/enterprise/list", //助力新增页面模糊查询调用企查查
					showResultPage: "/company/movements/showResultPage"
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
			search(companyId,companyName) {
				this.$http.get(this.url.showResultPage, {
					params: {
						companyId: companyId
					}
				}).then(res => {
					if (res.data.success) {
						console.log(res.data);
						this.$router.push(`helpCompanySelectForm?name=${companyName}&id=${companyId}`)
					}
				})
			}
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
