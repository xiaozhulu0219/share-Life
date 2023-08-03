<template>
			<view :style="{'background': bgColor}" class="nav-wrap bg-gradual-blue">
				<view @tap="BackPage" v-if="isBack" class="back">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="title">
					<slot name="title"></slot>
				</view>
				<view class="action">
					<slot name="right"></slot>
				</view>
			</view>
</template>

<script>
    export default {
        data() {
            return {};
        },
        name: 'cu-custom',
        computed: {},
        props: {
            bgColor: {
                type: String,
                default: ''
            },
            isBack: {
                type: [Boolean, String],
                default: false
            },
            bgImage: {
                type: String,
                default: ''
            },
            zIndex: {
                type: String,
                default: '10'
            },
            backRouterName: {
                type: String,
                default: ''
            }
        },
        methods: {
            BackPage() {
				uni.navigateBack({
				    delta: 1
				});
     //            if (!this.backRouterName) {
					// console.log("运行回到后一页")
     //                uni.navigateBack({
     //                    delta: 1
     //                });
     //            } else {
					// console.log("运行替换")
     //                this.$Router.replace({ name: this.backRouterName });
     //            }
            }
        }
    };
</script>

<style lang="scss" scoped>

	.nav-wrap {
		min-width:54px ;
	  height: 100rpx;
	  display: flex;
	  align-items: center;
	  position: fixed;
	  z-index: 99;
	  left: 0;
	  right: 0;
	  top: 0;
	}

	.back, .action {
	  width: 50rpx;
	  flex-shrink: 0;
	  text-align: center;
	}

	.title {
	  flex: 1;
	  flex-grow: 1;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: 45rpx;
	}

</style>
