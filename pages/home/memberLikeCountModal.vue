<template>
    <view class="mask" @click="dimiss">
        <view class="content">
            <view class="flex flex-direction align-center card-text">获赞数：{{FocusFansNumVo.loveCollectCount}}</view>
            <view class="flex flex-direction align-center card-text">收藏数：{{FocusFansNumVo.collectCount}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'memberLikeCountModal',
        data() {
            return {
                FocusFansNumVo: {
                    focusCount: '',
                    fansCount: '',
                    loveCount: '',
                    collectCount: '',
                    loveCollectCount: ''
                },

            }
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            console.log("进来了",item)
            this.FocusFansNumVo = item

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

