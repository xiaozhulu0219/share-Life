<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <scroll-view scroll-y class="page">
            <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
                <block slot="backText">
                </block>
                <view slot="content">
                        <image class="medias_avatar" :src="fileUrl+myFormData.avatar" alt=""></image>ShareLife
                </view>
            </cu-custom>
            <view class="card">
                <view class="iptbox">
                    <!-- <image  class="medias_size" :src="myFormData.medias[0]" mode="widthFix"  alt=""></image>-->
                    <view class="uni-list" v-for="(item, index) in myFormData.medias" :index="index" :key="index">
                        <image :src="item" @click="TanPreviewImage(index)" mode="scaleToFill"></image>
                    </view>
                    <view class="card-text" @click="toMemberdetail(myFormData)">{{myFormData.textContent}}</view>
                    <view class="card-time">
                        <view class="iconfont ml-1" style="font-size: 50rpx; color: #dd524d;"> {{myFormData.publishTime}} &#xe636 {{myFormData.ipAddress}}</view>
<!--                        <image class="icon-ipAddress" src="@/static/icon/ipAddress.png" mode="aspectFill"></image>-->
                    </view>
                    <!--    <view class="card-title">{{myFormData.publishTime}}</view>-->
                    <!--    <view class="card-title">{{myFormData.createDate}}-->
                </view>
            </view>
            <view class="">
                <view class="card-title">
                    <view class="iconfont ml-1" style="font-size: 50rpx; color: #dd524d;">&#xe60f {{myCommentForm.likeCount}} &#xe617 {{myCommentForm.loveCount}} &#xe601 {{myCommentForm.commentCount}} </view>
<!--                    <img class="icon-like" src="@/static/icon/like.png" mode="aspectFill">{{myCommentForm.likeCount}}-->
<!--                    <img class="icon-love" src="@/static/icon/love.png" mode="aspectFill">{{myCommentForm.loveCount}}-->
<!--                    <img class="icon-comment" src="@/static/icon/comment.png" mode="aspectFill">{{myCommentForm.commentCount}}-->
                </view>
            </view>

<!--            <form @submit="formSubmit" @reset="formReset">-->
            <form>
                <view class="uni-form-item uni-column">
                    <input class="uni-input" v-model="inputValue" maxlength="100" placeholder="最大输入长度为200"/>
                    <button form-type="submit" @click="saveComment(inputValue)">评论</button>
<!--                    <button type="default" form-type="reset">重置</button>-->
                </view>
            </form>

            <view class="card">
                <view class="iptbox">
                    <view v-for="(item,index) in inforCommentsList" :key="index" class="card">
                        <view>{{ item.nickname }} {{ item.content }}
                            <view class="iconfont ml-1" style="font-size: 50rpx; color: #dd524d;">&#xe60f {{ item.likeCount }}{{ item.createDate }}</view>
                            <!-- <img class="icon-like" src="@/static/icon/like.png" mode="aspectFill">-->
                        </view>
                        <view class="iconfont ml-1" style="font-size: 50rpx;"  @click="getSonCommentsList(item)">&#xe631</view>
                        <view v-for="(item,index) in inforSonCommentsList" :key="index" class="card">
                            <view>{{ item.nickname }} {{ item.content }}
                                <view class="iconfont ml-1" style="font-size: 50rpx; color: #dd524d;">&#xe60f {{ item.likeCount }}{{ item.createDate }}</view>
<!--                                <img class="icon-like" src="@/static/icon/like.png" mode="aspectFill">-->

                            </view>
                        </view>

                    </view>
                </view>
            </view>
        </scroll-view>
    </view>

</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue'
    import configService from '@/common/service/config.service.js'

    export default {
        name: "homeInformationDetail",
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
                inputValue: '',
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    findInforCommentsPageUrl: '/information/comments/list',
                    findSonCommentListPageUrl: '/information/comments/findSonCommentListById',
                    saveCommentUrl: '/information/comments/saveCommentForInfor',

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
                },
                myCommentForm: {
                    latitude: '',
                    longitude: '',
                    location: '',
                    medias: '',
                    textContent: '',
                    uuId: '',
                    avatar: '',
                    likeCount: '',
                    createDate: '',
                    nickname: '',
                    id: '',


                },
                fileUrl: configService.fileSaveURL,
                inforCommentsList: [],
                inforSonCommentsList: [],
            }
        },
        created() {
            //this.initFormData();
            this.getInforCommentsList(this.myFormData.inforId);
            this.findPublishInfor(this.myFormData.inforId);
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.myFormData = item
            //console.log("输出item", item)
            //this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
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
            //根据inforId查询详情
            findPublishInfor(inforId) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: inforId}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.myCommentForm = res.data.result;
                    }
                })
            },
            //获取评论列表
            getInforCommentsList(inforId) {
                //console.log("进来了方法2222", inforId)
                this.$http.get(this.url.findInforCommentsPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        id: inforId
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("res.data.result:",res.data.result);
                        //console.log("数据条数:",res.data.result);
                        this.inforCommentsList = res.data.result.items;
                        //console.log("数据条数222:",this.inforCommentsList.length);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //获取评论的评论列表
            getSonCommentsList(item) {
                //console.log("进来了方法33333", item)
                this.$http.get(this.url.findSonCommentListPageUrl, {
                    params: {
                        id: item.id
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("33333res:",res.data.result);
                        this.inforSonCommentsList = res.data.result;
                        //console.log("数据:",this.inforSonCommentsList);
                        //console.log("数据条数222:",this.inforSonCommentsList.length);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //头像跳转用户详情
            toMemberdetail(myFormData) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/member/member?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
            //保存评论 这里有两种评论、一种是对动态 一种是对评论
            saveComment(inputValue) {
                const InforCommentDto = {};
                InforCommentDto.publishId = this.myCommentForm.id;
                InforCommentDto.comment = inputValue;
                this.$http.post(this.url.saveCommentUrl, InforCommentDto).then(res => {
                    //刷新留言列表、并将返回的评论数量 回显页面上 并将输入框文字置空
                    if (res.data.success) {
                        //console.log("33333res:",res.data.result);
                        //回显最新评论数
                        this.myCommentForm.commentCount = res.data.result
                        //刷新评论列表
                        this.getInforCommentsList(this.myFormData.inforId);
                        //置空输入框
                        this.setinputValue = '';
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
