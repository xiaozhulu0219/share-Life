<template>
    <!--我的动态点击右上角的三个黑点按钮弹出来的modal-->
	<view class="pp-container">
		<uni-popup ref="popup" type="bottom" >
		    <view class="popup-card bg-gray">
		        <view class="padding text-right cuIcon-close" @tap="closeModal"></view>
		
		        <view class="icon-line-list">
		            <view class="edit list-item" @click="toInforPublishForm(myFormData)">
		                <!-- <text class="cuIcon-edit icon-style"></text> -->
						<image src="../../static/icon／bianji.png" mode="" class="image-icon"></image>
		                <view class="icon-text">编辑</view>
		            </view>
		            <view class="delete list-item" @click="deleteInfor(myFormData)">
		                <!-- <text class="cuIcon-delete icon-style"></text> -->
						<image src="../../static/icon／shanchu.png" mode="" class="image-icon"></image>
		                <view class="icon-text">删除</view>
		            </view>
		            <view class="seeType list-item" @click="changeAuth">
		                <!-- <text class="cuIcon-post icon-style"></text> -->
						<image src="../../static/icon／quanxian.png" mode="" class="image-icon"></image>
		                <view class="icon-text">权限</view>
		            </view>
		        </view>
		
		    </view>
			
		</uni-popup>
		<uni-popup ref="status" :mask-click="true"  type="bottom" >
			<view class="popup-card bg-gray" style="height: 100px;" >
				<view class="st-container">
					<view class="st-item" @click="handleChangeStatus('toPublic')">
						<view class="st-item-left">
							<text class="cuIcon-unlock"></text>
						</view>
						<view class="st-item-right">
							公开可见
						</view>
						<view class="st-item-check"  v-if="myFormData.seeType==1">
							<text class="cuIcon-check" style="color:red"></text>
						</view>
					</view>
					<view class="st-item" @click="handleChangeStatus('toPrivate')">
						<view class="st-item-left">
							<text class="cuIcon-lock"></text>
						</view>
						<view class="st-item-right">
							私密
						</view>
						<view class="st-item-check" v-if="myFormData.seeType==2">
							<text class="cuIcon-check" style="color:red"></text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
    
</template>

<script>

    export default {
        name: 'toEditPublishPopup',
        data() {
            return {
				deleteInforUrl:'/information/movements/deleteInfor',
				authChangeUrl:'/information/movements/editSeeType'
			};
        },
        props: {
            myFormData: {
                type: Object,
                default: () => ({})
            }
        },
        created() {

        },
        methods: {
			handleChangeStatus(to){
				// 点击更改权限
				if(to==='toPublic'){
					// 判断当前的状态
					console.log(this.myFormData)
					if(this.myFormData.seeType==1){
						// 已经是公开状态不需要处理关闭modal
						this.$refs.status.close()
						return 
					} else if(this.myFormData.seeType==2){
						// 当前是公开状态想改成私密状态
						// console.log()
						const {inforId} = this.myFormData;
						this.$http.get(this.authChangeUrl,{
							params:{
								inforId,
								seeType:1
							}
						}).then(res=>{
							if(res.data.success){
								uni.showToast({
									title:'修改成功',
									icon:'none'
								})
								this.$emit("authChange",inforId,1);
								this.$refs.status.close()
							}
						})
					}
				}
				if(to==='toPrivate'){
					// 当前是私密
					if(this.myFormData.seeType==2){
						this.$refs.status.close()
						return 
					}else if(this.myFormData.seeType==1){
						// 当前是公开的状态 需要修改为私密
						const {inforId} = this.myFormData
						this.$http.get(this.authChangeUrl,{
							params:{
								inforId,
								seeType:2
							}
						}).then(res=>{
							console.log(res,"res")
							if(res.data.success){
								// 修改成功
								uni.showToast({
									title:'修改成功',
									icon:'none'
								})
								this.$emit("authChange",inforId,2);
								this.$refs.status.close()
							}
						})
					}
				}
			},
			changeAuth(){
				// 更改权限 
				// 弹出另外一个modal
				 this.$refs.status.open()
			},
            showModal() {
                this.$refs.popup.open();
            },
            closeModal() {
                this.$refs.popup.close();
            },
            //带数据跳转到编辑页
            toInforPublishForm(myFormData) {
                console.log("点击带数据跳转到编辑页：", myFormData)
                uni.navigateTo({
                    url: '/pages/information/inforPublishForm?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
            //点击删除按钮
            deleteInfor(item) {
                console.log("点击了删除按钮：", item)
                uni.showModal({
                    title: '确认删除吗？',
                    success: res => {
                        if (res.confirm) {
                            console.log('用户点击确定', item);
							// console.log(this.url,"打印url地址")
                            this.$http.delete(this.deleteInforUrl + '?id=' + item.inforId).then(res => {
                                console.log("结果数据", res)
                                if (res.data.success) {
                                    console.log("删除成功", item.inforId);
                                    uni.navigateTo({
                                        url: '/pages/member/member'
                                    })
                                }
                            }).catch(e => {
                                console.log("al delUrl请求错误2", e)
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
        }
    }
</script>

<style lang='scss' scoped>
	.st-item-right{
		margin-left: 20rpx;
		flex:1 1 auto;
	}
	.st-item{
		padding: 0 30rpx;
		box-sizing: border-box;
		
		display:flex;
		height:80rpx;
		width:100%;
		line-height: 80rpx;
		align-items: center;
		
		
	}
	.st-item-check{
		width:5%;
		flex: 0 0 auto;
	}
	.st-item-left{
		width:5%;
	}
	.st-container{
		
		padding: 15rpx;
		height: 100%;
		width: 100%;
		boxbox-sizing: border-box;
	
	}
	.image-icon{
		height:100rpx;
		width: 100rpx;
	}
    .popup-card {
		width:100vw;
		height: 400rpx;
		border-radius: 18rpx;
	}

    .icon-line-list {
        display: flex;
		width:100%;
	}
	.icon-line-list .list-item{
		display:flex;
		flex-direction: column;
		align-items: center;
	}
	.edit {
		
        //display: inline;
		width:33%;
		
        //position: absolute; //绝对定位
	}

    .delete {
        //display: inline;
        width:33%;
        //position: absolute; //绝对定位
    }

    .seeType {
        /* //display: inline; */
        width:33%;
        //position: absolute; //绝对定位
    }

    .icon-style {
        font-size: 80rpx;
        //background: #e1d7f0;
        background: white;
    }

	.icon-text {
        //justify-content: space-between;
        text-align:center;
        font-size: 30rpx;
        font-weight: bold;
        //margin-left: 20rpx;
        margin-top: 15rpx;
	}
	.status-container{
		height: 200rpx;
		width: 100%;
		background-color: #fff;
	}
</style>
