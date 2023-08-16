<template>
	<view class="margin-top">
		<view class="cu-bar bg-white ">
			<view class="action">
				{{label}}
			</view>
			<view class="action">
				{{imgList.length}}/{{maxImg}}
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
					:data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length<maxImg">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import configService from '../../common/service/config.service.js'
	
	export default {
		name: 'MyImageUpoad',
		// props: {
		// 	value: {
		// 		// type: Array,
		// 		// default: []
		// 	},
		// 	label: {
		// 		type: String,
		// 		default: '上传图片'
		// 	},
		// 	maxImg: {
		// 		type: Number,
		// 		default: 9
		// 	},
		// },
		props: ['value'],
		mounted() {
			console.log(this.value,"图片数组")
			if(!this.value){
				return 
			}
			this.value.forEach(res => {
				this.imgList.push(res);
				const tempStr = res.replace(configService.fileSaveURL,'')
				this.pathlist.push(tempStr)
			});
			console.log(this.imgList,'列表1')
			console.log(this.pathlist)
			// 初始化pathlist 
			// PathList 是用来提交图片列表的
			//imgList是用来渲染当前图片列表
			
			
		},
		data() {
			return {
				imgList: [],
				pathlist: [],
				label: '上传图片',
				maxImg: 9
			}
		},
		methods: {
			ChooseImage() {
				// 长度需要减去当前的图片列表长度
				uni.chooseImage({
					count: this.maxImg - this.pathlist.length, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						console.log(res,"选择成功")
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							uni.uploadFile({
								url: `${configService.fileUploadURL}`,
								filePath: res.tempFilePaths[i],
								name: 'file',
								success: (uploadFileRes) => {
									// console.log("上传成功后",uploadFileRes)
									let path = JSON.parse(uploadFileRes.data).message
									// console.log(path,"图片路径")
									this.pathlist.push(path);
									// console.log(this.pathlist,"数组");
									//imgList同时改变
									this.imgList.push(res.tempFilePaths[i])
									this.$emit('input', this.pathlist.join(','))
									// 在这里添加
									
								}
							})
							//这是之前的
							// if (this.imgList.length != 0) {
							// 	this.imgList = this.imgList.concat(res.tempFilePaths)
							// } else {
							// 	this.imgList = res.tempFilePaths
							// }
							//这是为了同时可选择多张做的修改后的版本
							// console.log(this.imgList,"原始列表");
							// console.log( res.tempFilePaths,"路径")
							// this.imgList = res.tempFilePaths;
							
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确认要删除吗',
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.pathlist.splice(e.currentTarget.dataset.index, 1)
							this.imgList.splice(e.currentTarget.dataset.index, 1)
							this.$emit('input', this.pathlist.join(','))
						}
					}
				})
			},
		}
	}
</script>

<style>

</style>