<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText">
            </block>
            <!--				<block slot="content">我的动态</block>-->
            <block slot="right">
                <button class="cu-btn block bg-gray margin-tb-sm " size="small" @click="toInforPublishForm(myFormData)">
                    编辑  <!--跳新页面还是到informationForm.vue 而且可编辑 还可设置可见状态-->
                </button>
            </block>
            <block slot="right">
                <button class="cu-btn block bg-gray margin-tb-sm" type="warn" size="mini"
                        @click="deleteInfor(myFormData)">
                    删除
                </button>
            </block>
        </cu-custom>
        <view class="card">
            <view class="iptbox">
                <!-- <image  class="medias_size" :src="myFormData.medias[0]" mode="widthFix"  alt=""></image>-->
                <view class="uni-list" v-for="(item, index) in myFormData.medias" :index="index" :key="index">
                    <image :src="item" @click="TanPreviewImage(index)" mode="scaleToFill"></image>
                </view>

                <view class="card-text">{{myFormData.textContent}}</view>
                <view class="card-time">
                    {{myFormData.publishTime}}
                    <img class="icon-ipAddress" src="@/static/icon/ipAddress.png" mode="aspectFill"></img>
                    {{myFormData.ipAddress}}
                </view>
                <!--    <view class="card-title">{{myFormData.publishTime}}</view>-->
                <!--    <view class="card-title">{{myFormData.createDate}}-->
            </view>
        </view>
        <view class="">
            <view class="card-title">
                <img class="icon-like" src="@/static/icon/like.png" mode="aspectFill">{{myFormData.hasLiked}}
                <img class="icon-love" src="@/static/icon/love.png" mode="aspectFill">{{myFormData.hasLoved}}
                <img class="icon-comment" src="@/static/icon/comment.png" mode="aspectFill">{{myFormData.commentCount}}
            </view>
        </view>
    </view>

</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue'
    import configService from '@/common/service/config.service.js'

    export default {
        name: "memberInforDetail",
        components: {myDate},
        props: {
            formData: {
                type: Object,
                default: () => {
                },
                required: false
            }
        },
        data() {
            return {
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                loading: false,
                backRouteName: 'index',
                arr: [],
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    deleteInforUrl: '/information/movements/deleteInfor',
                },
                text: '',
                vBlock: "block",
                toupiao: false,
                voteBc: "white",
                voteList: [
                    {id: 1, content: ''},
                    {id: 2, content: ''},
                    {id: 3, content: ''}
                ],
                publishId: "",
                myFormData: {
                    latitude: '',
                    longitude: '',
                    location: '',
                    medias: '',
                    textContent: '',
                    uuId: '',
                    avatar: '',
                    id: '',
                },
                fileUrl: configService.fileSaveURL,
            }
        },
        created() {
            //this.initFormData();
            //this.findPublishInfor();
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.myFormData = item
            console.log("获取到了列表传过来的对象：", item);
            console.log("对象的id：", item.id);
            //console.log("myFormData", this.myFormData.id);
            //this.findPublishInfor(this.publishId); 这是传参后继续调用方法的示例
        },
        methods: {
            //点击图片进入函数，传入当前列表的索引index
            TanPreviewImage(indexa) {
                uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://21111889:8970/6_1597822634094.png"]
                    current: indexa,//这里是判断到点击列表上的某个图片，就读取索引的图片
                    urls: this.myFormData.medias,//这是整个内容的图片数组，放一个数组里，就可以左右切换了
                    longPressActions: { //长按保存图片到相册
                        itemList: ['保存图片'],
                        success: (data) => {
                            console.log(data);
                            uni.saveImageToPhotosAlbum({ //保存图片到相册
                                filePath: payUrl,
                                success: function () {
                                    uni.showToast({
                                        icon: 'success',
                                        title: '保存成功'
                                    })
                                },
                                fail: (err) => {
                                    uni.showToast({
                                        icon: 'none',
                                        title: '保存失败，请重新尝试'
                                    })
                                }
                            });
                        },
                        fail: (err) => {
                            console.log(err.errMsg);
                        }
                    }
                });
            },
            //根据id获取详情、暂时未用
            findPublishInfor(item) {
                console.log("根据id获取详情：", item)
                this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: item.id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.myFormData = res.data.result;
                    }
                })
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

<style lang="scss" scoped>

    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx; /*行高*/
        //margin-bottom: 16px; /*内容和标题间的间距*/

        .card-title {
            font-weight: bold;
        }
        .card-time {
            font-weight: bold;
            margin-right: 100rpx;
            margin-left: 25rpx;
        }

        .card-nickname {
            font-weight: bold;
        }

        .card-text {
            font-size: 32rpx;
            margin-bottom: 20rpx; /*盒子间的距离*/
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }

        .card-icon {
            width: 36rpx;
            height: 36rpx;
            margin-right: 10rpx;
            margin-left: 120rpx;
        }
    }

    .icon-ipAddress {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 200rpx;
    }
    .icon-like {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 60rpx;
    }
    .icon-love {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 240rpx;
    }
    .icon-comment {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 200rpx;
    }


    .medias_size {
        max-width: 300px;
        width: 300px;
        width: expression(this.width > 300 ? "300px" : this.width);
        height: 300px;
        height: expression(this.height > 300 ? "300px" : this.height);
        overflow: hidden;
        //text-align:center;
        display: block;
        margin: 0 auto;
        /*width: 21rpx;*/
        /*height: 21rpx;*/
        /*border-radius: 8rpx;*/
        margin-bottom: 30rpx; /*盒子间的距离*/
    }

    .medias_avatar {
        max-width: 30px;
        width: 30px;
        width: expression(this.width > 30 ? "30px" : this.width);
        height: 30px;
        height: expression(this.height > 30 ? "30px" : this.height);
        overflow: hidden;
        //margin-right: 10rpx;
        // margin-left: 2rpx;
        display: inline;
        float: left;
    }

    .location {
        display: flex;
        border-radius: 5px;
        font-size: 18px;
        margin: 5px;
        justify-content: flex-start;
        align-items: center;
    }

    //居左
    .alignleft {
        display: inline;
        float: left;
    }

    //居右
    .alignright {
        display: inline;
        float: right;
    }

    //居中
    .aligncenter {
        clear: both;
        display: block;
        margin:auto;
    }
</style>
