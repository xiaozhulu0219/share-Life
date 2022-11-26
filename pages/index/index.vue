<template>
	<view>
		<home :cur="PageCur" v-if="PageCur=='home'" :key="commponent1Key"></home>
		<information  :cur="PageCur" v-if="PageCur=='information'" :key="commponent3Key"></information>
		<people v-if="PageCur=='people'" :key="commponent2Key"></people>
		<member v-if="PageCur=='member'" :key="commponent4Key"></member>
		<helpCompanyList v-if="PageCur=='helpCompanyList'" :key="commponent4Key"></helpCompanyList>
		<view class="cu-bar tabbar bg-white shadow foot">
			<!--<view :class="PageCur=='home'?'action text-green':'action text-gray'" @click="NavChange" data-cur="home">
				<view class='cuIcon-homefill'></view>原主页
			</view>-->
			<view :class="PageCur=='information'?'action text-green':'action text-gray'" @click="NavChange" data-cur="information">
            <view class='cuIcon-homefill'></view>首页
        	</view>

<!--			<view :class="PageCur=='message'?'action text-green':'action text-gray'" @click="NavChange" data-cur="message">-->
<!--				<view class='cuIcon-message'></view>消息-->
<!--			</view>-->

<!--			<view :class="PageCur=='informationForm'?'action text-green':'action text-gray'" @click="NavChange" data-cur="informationForm">-->
<!--				<view class='cuIcon-roundaddfill'></view>1-->
<!--			</view>-->

			<view :class="PageCur=='helpCompanyList'?'action text-green':'action text-gray'" @click="NavChange" data-cur="helpCompanyList">
				<view class='cuIcon-roundaddfill'></view>
			</view>

			<view :class="PageCur=='member'?'action text-blue':'action text-gray'" @click="NavChange" data-cur="member">
				<view class='cuIcon-people'></view>我的
			</view>
			<!--<view :class="PageCur=='people'?'action text-green':'action text-gray'" @click="NavChange" data-cur="people">
				<view class='cuIcon-people'></view>原个人
			</view>-->
		</view>
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
				commponent4Key: 0,
			}
		},
		onLoad:function(){
			this.PageCur='home'
			++this.commponent1Key
			++this.commponent2Key
			++this.commponent3Key
			++this.commponent4Key
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}

		}
	}
</script>

<style>

</style>
