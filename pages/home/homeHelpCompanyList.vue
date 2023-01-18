<template>
	<view>
		<!--首页中的助力页面-->
1111

	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import Mixin from "@/common/mixin/Mixin.js";

	export default {
		name: 'MyHelpCompanyList',
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				findMyPublishComPageUrl: '/company/movements/findMyPublishComPage'
			};
		},
		created() {
			this.getMyHelpCompanyList();
		},
		methods: {
			getMyHelpCompanyList() {
				this.$http.get(this.findMyPublishComPageUrl, {
					params: {
						page: 1,
						pagesize: 20
					}
				}).then(res => {
					if (res.data.success) {
						console.log(res.data.result);
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style lang='scss'>

</style>
