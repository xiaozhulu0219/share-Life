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
            <view :class="PageCur == 'message' ? 'action text-blue' : 'action text-gray'" @click="NavChange('message')">
                <view class="cuIcon-message"></view>
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
export default {
  //底部菜单组件
  props: {
    PageCur: {
      type: String,
      default: 'home'
    }
  },
  components: {
    ToPublishPopup
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