<template>
  <view>
    <view class="cu-bar tabbar bg-white shadow foot">
            <view :class="PageCur == 'home' ? 'action text-green' : 'action text-gray'" @click="NavChange('home')">
                <view class="cuIcon-homefill"></view>
                首页
            </view>
            <view :class="PageCur == 'publish' ? 'action text-green' : 'action text-gray'" @click="showModal" data-cur="publish">
                <view class="cuIcon-roundaddfill"></view>
            </view>
            <view  :class="PageCur == 'message' ? 'action text-blue' : 'action text-gray'" @click="NavChange('message')">
				
                <view class="messagePos cuIcon-message">
					<view  class="messageNum" v-if="totalCount>0">
					{{totalCount}}
					</view>
				</view>
                消息
            </view>
            <view :class="PageCur == 'member' ? 'action text-blue' : 'action text-gray'" @click="NavChange('member')">
                <view class="cuIcon-people"></view>
                我的
            </view>
    </view>
    <ToPublishPopup ref='toPublishPopup'></ToPublishPopup>
  </view>
</template>
<script>
import ToPublishPopup from '../publish/toPublishPopup.vue';
import {mapGetters} from "vuex"
export default {
  //底部菜单组件
  props: {
    PageCur: {
      type: String,
      default: 'home'
    },
  },
  components: {
    ToPublishPopup
  },
  computed:{
	  ...mapGetters(['totalCount'])
  },
  data() {
    return {
      tabBar: {
        home: '/pages/index/index',
        message: '/pages/message/message',
        member: '/pages/member/member'
      }
    };
  },
        methods: {
            showModal() {
                this.$refs.toPublishPopup.showModal();
            },
            // 切换底部tab
            NavChange(menu) {
              uni.reLaunch({
                url: this.tabBar[menu]
              });
            }
        }
};
</script>
<style scoped>
	.messagePos{
		position:relative;
	}
	.messageNum{
		height:35rpx;
		width:40rpx;
		background-color: red;
		position: absolute;
		top:-80%;
		right:0;
		color: #fff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size:0.6em;
		
		
	}
</style>