<template>
	<view>
		<view class="search-tab">
			<view class="tab-title flex justify-between">
				<view class="padding-sm" v-for="(item, index) in tabs" :key="index" @tap="clickTab(index)">
					<text :class="activeTab === index ? 'active' : ''">{{ item.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import Mixin from '@/common/mixin/Mixin.js';

	export default {
		mixins: [MescrollMixin, Mixin],
		data() {
			return {
				activeTab: 0,
				tabs: [{ id: 1, name: '推荐' }, { id: 2, name: '助力' }, { id: 3, name: '百科' }, { id: 4, name: '游戏' }, { id: 5, name: '关注' }],
			};
		},
		created() {
			this.$http.get('/sys/dict/querySomeDictItems', {
				params: {
					dicts: "home_sign"
				}
			}).then(res => {
				if (res.data.success) {
					this.tabs = res.data.result.home_sign;
				}
			})
		},
		methods:{
			clickTab(index) {
				if (this.activeTab === index) return;
				this.activeTab = index;
			},
		}
	};
</script>

<style lang="scss" scoped>
	
</style>
