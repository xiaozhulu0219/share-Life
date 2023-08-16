<template>
	<view class="advice-container">
		<!-- 这是产品建议页面 -->
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">产品与建议</block>
			<!--<view slot="right"  @tap="rightClick">编辑</view>-->

		</cu-custom>

		<view class="advice-form-container">
			<view class="advice-form-item">
				<view class="advice-form-title">
					请选择产品建议类型
				</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							当前选择
						</view>
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="index" :range="array">
								<view class="uni-input">{{array[index]}}</view>
							</picker>
						</view>
						<view class="cuIcon-triangledownfill" style="font-size: 1.8em;">
							
						</view>
					</view>
				</view>
			</view>
			<view class="advice-form-item">
				<view class="advice-form-title">
					建议内容
				</view>
				<view class="text-wrap">
					<textarea v-model.trim="contentVal" style="font-size: 1em;height:100%;width: 100%;"  placeholder="请输入建议内容"/>
				</view>
			</view>
		</view>
		
		<view class="advice-btn bg-gradual-blue" @click="submit">
			提交
		</view>

	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				array: ['功能异常', '产品建议', '投诉举报', '联系官方','其他问题'],
				index: 0,
				pickerVal:1,
				contentVal:'',
				proAdviceUrl:'/systemAdvise/systemAdvise/add'
			}
		},
		computed:{
			...mapState(['uuId'])
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value;
				// console.log("选中的是",this.array[this.index])
				this.pickerVal = this.index+1;
			},
			submit(){
				if(this.pickerVal===''){
					uni.showToast({
						title:'请选择建议类型',
						icon:'none'
					})
					return
				}
				if(this.contentVal===''){
					uni.showToast({
						title:'请填写产品建议',
						icon:'none'
					})
					return
				}
				console.log(this.pickerVal.toString(),"这")
				const submitObj = {
					uuId:this.uuId,
					item:this.pickerVal.toString(),
					adviseContent:this.contentVal
				}
				this.$http.post(this.proAdviceUrl,submitObj).then(res=>{
					if(res.data.success){
						// 添加成功
						uni.showToast({
							title:'提交成功',
							icon:'none'
						})
						// 清空输入框
						this.contentVal = ''
					}else{
						uni.showToast({
							title:'未知错误',
							icon:'none'
						})
					}
				}).catch(err=>{
					uni.showToast({
						title:'未知错误',
						icon:'none'
					})
				})
			}
		}

	}
</script>

<style scoped>
	.advice-container {
		
		height: 100vh;
		width: 100vw;
		background-color: rgb(245, 245, 245)
	}

	.advice-form-container {
		/* padding: 30rpx; */
		width: 100%;
	}

	.advice-form-title {
		padding: 30rpx;
		font-size: 1.1em;
		font-weight: bold;
		box-sizing: border-box;

	}

	.uni-list-cell {
		display: flex;
		width: 100%;
		background-color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 18.12rpx;
		box-sizing: border-box;
	}
	.uni-list-cell-left{
		flex: 0 0 auto;
		width: 20%;
	}
	.uni-list-cell-db{
		flex: 1 1 auto;
	}
	.text-wrap{
		width: 100%;
		height:350rpx;
		background-color: #fff;
		padding: 10rpx;
	}
	.advice-form-item{
		margin-bottom: 40rpx;
	}
	.advice-btn {
		text-align: center;
		margin: 0 auto;
		height: 80rpx;
		font-size: 1em;
		line-height: 80rpx;
		width: 200rpx;
		border-radius: 40rpx;
	}
</style>
