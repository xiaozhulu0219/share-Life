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
		<uni-popup ref="popup" type="bottom">
			<view class="popup-card bg-white">
				<view class="padding text-right cuIcon-close" @tap="closeModal"></view>
				<view class="flex popup-content">
					<view class="card-item padding bg-gradual-green">发动态</view>
					<view class="card-item padding bg-gradual-blue" @tap="goHelpCom">助力公司</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
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
	onLoad: function() {
		this.PageCur = 'home';
		++this.commponent1Key;
		++this.commponent2Key;
		++this.commponent3Key;
		++this.commponent4Key;
	},
	methods: {
		NavChange: function(e) {
			this.PageCur = e.currentTarget.dataset.cur;
		},
		showModal() {
			this.$refs.popup.open();
		},
		closeModal() {
			this.$refs.popup.close();
		},
		goHelpCom() {
			this.$refs.popup.close();
			uni.navigateTo({
				url:'/pages/helpcompany/helpCompanyLikeQueryList'
			})
		}
	}
};
</script>

<style scoped>
.popup-card {
	margin: 0 auto 40rpx;
	width: 90%;
	height: 400rpx;
	border-radius: 40rpx;
}
.popup-content {
	justify-content: space-evenly;
}
.card-item {
	width: 40%;
	/* height: 120rpx; */
	border-radius: 20rpx;
}
</style>
