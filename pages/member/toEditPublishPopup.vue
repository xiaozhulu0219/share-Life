<template>
    <!--我的动态点击右上角的三个黑点按钮弹出来的modal-->
    <uni-popup ref="popup" type="bottom">
        <view class="popup-card bg-gray">
            <view class="padding text-right cuIcon-close" @tap="closeModal"></view>

            <view class="icon-line-list">
                <view class="edit" @click="toInforPublishForm(myFormData)">
                    <text class="cuIcon-edit icon-style"></text>
                    <view class="icon-text">编辑</view>
                </view>
                <view class="delete" @click="deleteInfor(myFormData)">
                    <text class="cuIcon-delete icon-style"></text>
                    <view class="icon-text">删除</view>
                </view>
                <view class="seeType">
                    <text class="cuIcon-post icon-style"></text>
                    <view class="icon-text">权限</view>
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
		width: 100%;
		height: 400rpx;
		border-radius: 18rpx;
	}

    .icon-line-list {
        display: flex;
	}

	.edit {
        //display: inline;
        margin-left: 20rpx;
		margin-right: 220rpx;
        //position: absolute; //绝对定位
	}

    .delete {
        //display: inline;
        margin-right: 190rpx;
        //position: absolute; //绝对定位
    }

    .seeType {
        //display: inline;
        //margin-right: 50rpx;
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

</style>
