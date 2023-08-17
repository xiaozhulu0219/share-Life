<template>
	<view class="tap-space-wrap bg-gradual-blue" :style="{'background': bgColor}">
		<view class="spaceTop " :style="{height:barHeight+'px'}">
			
		</view>
		<view  class="nav-wrap ">

			<view @tap="BackPage"  class="back">
				<block v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</block>
				<view class="left" v-if="!isBack">
					<slot name="left"></slot>
				</view>
			</view>
			<!-- 负一屏的唤醒 -->
			
			<view class="title">
				<slot name="title"></slot>
			</view>
			<view class="action">
				<slot name="right"></slot>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				barHeight : 0
			};
		},
		created(){
			this.barHeight = this.topSpace-5
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
	.tap-space-wrap{
		position: fixed;
		left: 0;
		z-index: 99;
		right: 0;
		top: 0;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	.spaceTop{
		// background-color: red;
	}
	.nav-wrap {
		min-width:54px ;
		height:50px;
		display: flex;
		align-items: center;
	}

	.back,
	.action {
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
