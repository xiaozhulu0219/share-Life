<template>
	<view class="uploadVideo-container">
		<view class="uni-uploader__file">
			<view class="uploader_video">
				<view class="cuIcon-add add-btn" @tap="chooseVideo"   ></view>
				<!-- @tap="delectVideo" -->
				<video :src="src" class="video" objectFit="contain"  v-if="src!==''"></video>
			</view>
		</view>
		<!-- <view class="uni-uploader__input-box" v-if="VideoOfImagesShow">
			<view class="uni-uploader__input" @tap="chooseVideoImage"></view>

		</view>
 -->

	</view>
</template>

<script>
	import configService from '../../common/service/config.service.js'
	export default {
		data() {
			return {
				VideoOfImagesShow: true,
				src: '',
				resultSrc:''
			}
		},
		methods: {
			delectVideo() {},
			chooseVideo() {
				// 上传视频
				uni.chooseVideo({
					maxDuration: 60,
					count: 1,
					success: (responent) => {
						console.log(responent)
						let videoFile = responent.tempFilePath;
						this.src = responent.tempFilePath;
						console.log(configService,"hh ")
						uni.uploadFile({
							url: `${configService.fileUploadURL}`,
							method: "POST",
							filePath: videoFile,
							name: 'file',
							maxDuration:60,
							success: (res) => {
								// let videoUrls = JSON.parse(res.data) //微信和头条支持
								console.log(res);
								
								console.log(res.data,'222')
								const target = res.data.split(',')[1].split(':')[1].replaceAll('"','')
								console.log(target,"目标")
								this.resultSrc = target
								this.$emit('uploadVedio',this.resultSrc)
								// const target = JSON.parse(res.data);
								// console.log(target,"目标")
								// this.resultSrc = JSON.parse(res.data)
								// console.log(this.resultSrc)
								
								// let videoUrls = res.data //百度支持
								// this.imagesUrlPath = this.imagesUrlPath.concat(videoUrls.result
								// 	.filePath);
								// this.src = videoUrls.result.filePath; //微信
								// if (this.src) {
								// 	this.itemList = ['图片']
								// } else {
								// 	this.itemList = ['图片', '视频']
								// }

							}
						})
						// this.src = responent.tempFilePath;  //头条
					}
				})
			},
		}
	}
</script>

<style scoped>
	.uploadVideo-container{
		transform: translateY(-150rpx);
	}
	.uni-uploader__file,
	.uploader_video {
		position: relative;
		z-index: 1;
		width: 600upx;
		height:400upx;
		border: 1px solid #ccc;
		margin: 0 auto;
		
	}
	.add-btn{
		position: absolute;
		font-size: 3em;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		color: #ccc;
	}
	.video{
		height: 100%;
		width: 100%;
	}
</style>
