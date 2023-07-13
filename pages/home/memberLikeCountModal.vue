<template>
    <view class="mask" v-show='show'>
        <view class="content">
          <view class="title">获赞与收藏</view>
          <view class="items">
            <view>当前获赞数：<span class="num">{{FocusFansNumVo.loveCollectCount}}</span> </view>
            <view>当前收藏数：<span class="num">{{FocusFansNumVo.collectCount}}</span> </view>
          </view>
          <view class="btn" @click="close">我知道了</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'memberLikeCountModal',
        props: {
          show: {
            type: Boolean,
            default: false
          },
          FocusFansNumVo: {
            type: Object,
            default: () =>({})
          }
        },
        methods: {
          close(){
            this.$emit('close')
          }
        }
    }
</script>

<style lang="scss" scoped>
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background: rgba(0,0,0,0.4);
        display: flex;
    }
    .content {
      margin: auto;
        width: 400rpx;
        height: 460rpx;
        border-radius: 12rpx;
        color: #111;
        background-color: white;
        .title {
          line-height: 90rpx;
          font-size: 40rpx;
          font-weight: 600;
          text-align: center;
          margin-bottom: 30rpx;
          border-bottom: 2rpx solid #eee;
        }
        .items {
          color: #969696;
          font-size: 34rpx;
          padding: 8rpx  0;
          padding-left: 80rpx;
          line-height: 70rpx;
          box-sizing: border-box;
          .num {
            font-size: 32rpx;
            color: #333;
            font-weight: 500;
          }
        }
        .btn {
          margin: auto;
          width: 240rpx;
          height: 80rpx;
          line-height: 80rpx;
          text-align: center;
          font-size: 36rpx;
          margin-top: 60rpx;
          font-weight: 600;
          border-radius: 40rpx;
          border: 2rpx solid #dd556c;
          background-color: #dd556c;
          color: #fff;
        }
    }

</style>

