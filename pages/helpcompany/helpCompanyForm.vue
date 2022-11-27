<template>
	<!--表单区域-->
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
						<input placeholder="输入要助力的公司简称或者邮箱后缀" v-model="model.enterpriseName" class="ipt" @confirm="searchCompany"/>
						<!-- <button class="cu-btn block bg-blue margin-tb-sm lg" @click="searchCompany">
							<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>搜索
						</button>-->
					</view>
					<button class="cu-btn block bg-gray margin-tb-sm lg" @click="clear">
						<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text>取消
					</button>

				</view>

			</form>
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
				model:{
					enterpriseName: '',
				},
				url: {
					queryById: "/member/queryById",
					add: "/member/add",
					edit: "/member/edit",
					findPageByEnterpriseName: "/enterprise/list", //助力新增页面模糊查询调用企查查
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
							this.model = res.data.result;
						}
					})
				}
			},

		}
	}
</script>
<style>
	.search{
		display: flex;
		background-color: #ffffff;
		align-items: center;
	}
	.iptbox{
		width: 80%;
		background-color:#ccc;
		height: 40px;
		border-radius: 20rpx;
		padding-left: 20px;
	}
	.ipt{
		display: block;
		height: 100%;
	}
	.lg{
		height: 40px;
	}

</style>
