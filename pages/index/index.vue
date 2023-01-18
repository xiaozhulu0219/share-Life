<template>
	<view>
		<home :cur="PageCur" v-if="PageCur=='home'" :key="commponent1Key"></home>
<!--		<information :cur="PageCur" v-if="PageCur == 'information'" :key="commponent3Key"></information>-->
		<member v-if="PageCur == 'member'" :key="commponent4Key"></member>
		<publish v-if="PageCur == 'publish'" :key="commponent4Key"></publish>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view :class="PageCur == 'home' ? 'action text-green' : 'action text-gray'" @click="NavChange" data-cur="home">
				<view class="cuIcon-homefill"></view>
				首页
			</view>
			<view :class="PageCur == 'publish' ? 'action text-green' : 'action text-gray'" @click="showModal" data-cur="publish">
				<view class="cuIcon-roundaddfill"></view>
			</view>
			<view :class="PageCur == 'member' ? 'action text-blue' : 'action text-gray'" @click="NavChange" data-cur="member">
				<view class="cuIcon-people"></view>
				我的
			</view>
		</view>
		<ToPublishPopup ref='toPublishPopup'></ToPublishPopup>
	</view>
</template>

<script>
	import ToPublishPopup from '../publish/toPublishPopup.vue'
export default {
	data() {
		return {
			PageCur: 'home',
			commponent1Key: 0,
			commponent2Key: 0,
			commponent3Key: 0,
			commponent4Key: 0
		};
	},
	components:{
		ToPublishPopup
	},
	onLoad: function() {
		this.PageCur = 'home';
		++this.commponent1Key;
		++this.commponent2Key;
		++this.commponent3Key;
		++this.commponent4Key;
	},
	methods: {
		showModal(){
			this.$refs.toPublishPopup.showModal();
		},
		NavChange: function(e) {
			this.PageCur = e.currentTarget.dataset.cur;
		},
	}
};
</script>

<style scoped>

</style>
