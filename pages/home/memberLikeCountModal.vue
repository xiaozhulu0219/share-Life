<template>
    <view class="mask" @click="dimiss">
        <view class="content">
            <view class="card-text">获赞数：32</view>
            <view class="card-text">喜欢数：66</view>

        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        onLoad(option) {

            console.log("进来了")

        },
        methods: {
            //点击mask消失，由于是页面实际相当于返回
            dimiss(){
                uni.navigateBack({
                    delta: 1
                })
            }
        }
    }
</script>

<style>
    page {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
    }
    .mask {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .content {
        width: 600rpx;
        height: 800rpx;
        border-radius: 20rpx;
        background-color: white;
    }

</style>

