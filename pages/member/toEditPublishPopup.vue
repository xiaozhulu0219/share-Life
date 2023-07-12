<template>
    <!--我的动态点击右上角的三个黑点按钮弹出来的modal-->
    <uni-popup ref="popup" type="bottom">
        <view class="popup-card bg-white">
            <view class="padding text-right cuIcon-close" @tap="closeModal"></view>
            <view class="flex">
                <view class="edit" @click="toInforPublishForm(myFormData)">
                    <text class="cuIcon-edit"></text>
                    <view>编辑</view>
                </view>
                <view class="delete" @click="deleteInfor(myFormData)">
                    <text class="cuIcon-delete" style="font-size: 40rpx; margin-left: 40rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view>删除</view>
                </view>
                <view class="seeType">
                    <text class="cuIcon-post" style="font-size: 40rpx; margin-left: 40rpx; margin-right: 12rpx; margin-bottom: 8rpx"></text>
                    <view>权限设置</view>
                </view>
            </view>
        </view>
    </uni-popup>
</template>

<script>

    export default {
        name: 'toEditPublishPopup',
        data() {
            return {};
        },
        created() {

        },
        methods: {
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
                            this.$http.delete(this.url.deleteInforUrl + '?id=' + item.inforId).then(res => {
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

<style lang='scss'>
	.popup-card {
		//margin: 0 auto 40rpx;
		width: 100%;
		height: 400rpx;
		border-radius: 18rpx;
	}

	.edit {
		//margin: 0 auto 40rpx;
		width: 100%;
		height: 400rpx;
		border-radius: 18rpx;
		//display: inline;
		//display: flex;
		//justify-content: space-between;
		//margin-left: 80rpx;
		//flex-direction: column;
		//align-items: flex-start;
	}

	.delete {
        width: 100%;
        height: 400rpx;
        border-radius: 18rpx;
	}

	.seeType {
        width: 100%;
        height: 400rpx;
        border-radius: 18rpx;
	}

</style>
