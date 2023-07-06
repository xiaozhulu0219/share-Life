<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <cu-custom  style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
            <block slot="backText">
            </block>
            <!--				<block slot="content">我的动态</block>-->

            <block slot="right">
                <button class="cu-btn block bg-gray margin-tb-sm " size="small" v-if="this.pubOrLove==1" @click="toInforPublishForm(myFormData)">
                    编辑  <!--跳新页面还是到informationForm.vue 而且可编辑 还可设置可见状态-->
                </button>
            </block>
            <block slot="right">
                <button class="cu-btn block bg-gray margin-tb-sm" type="warn" size="mini" v-if="this.pubOrLove==1" @click="deleteInfor(myFormData)">删除
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

                <view class="card-line">
                    <view class="card-createDate">{{myCommentForm.createDate}}</view>
                    <view class="iconfont ml-1" style="color: #dd524d;"> &#xe636</view>
                    <view class="card-ipAddress">{{myFormData.ipAddress}}</view>
                </view>
            </view>

        <view class="card-line">
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe60f</view>
            <view class="card-likeCount">{{myCommentForm.likeCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe617</view>
            <view class="card-loveCount">{{myCommentForm.loveCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe601</view>
            <view class="card-commentCount">{{myCommentForm.commentCount}}</view>
        </view>

            <view v-for="(item,index) in inforCommentsList" :key="index" class="comment">
                <view class="comment-parent">
                    <image class="comment-avatar round sm" :src="item.avatar" alt=""></image>
                    <view class="comment-nickcon">
                        <view class="comment-nickname">{{ item.nickname }}</view>
                        <view class="comment-content">{{ item.content }}</view>
                        <view class="comment-createDate">{{item.createDate}}</view>
                    </view>
                    <view class="comment-iconlikeCount">
                        <view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;">&#xe617</view>
                        <view class="comment-likeCount">{{item.likeCount}}</view>
                    </view>
                </view>
                <view class="iconfont ml-1" style="font-size: 40rpx;  margin-left: 200rpx" @click="getSonCommentsList(item)">&#xe631</view>
                <!--                    <view>展开{{}}条回复</view>-->
                <view v-for="(sonitem,index) in inforSonCommentsList" :key="index">
                    <view class="comment-son">
                        <image class="comment-avatar round sm" :src="sonitem.avatar" alt=""></image>
                        <view class="comment-nickcon">
                            <view class="comment-nickname">{{ sonitem.nickname }}</view>
                            <view class="comment-content">{{ sonitem.content }}</view>
                            <view class="comment-createDate">{{sonitem.createDate}}</view>
                        </view>
                        <view class="comment-iconlikeCount">
                            <view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;">&#xe617</view>
                            <view class="comment-likeCount">{{sonitem.likeCount}}</view>
                        </view>
                    </view>
                </view>
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
                    findInforCommentsPageUrl: '/information/comments/list',
                    findSonCommentListPageUrl: '/information/comments/findSonCommentListById',
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
                myCommentForm: {
                    latitude: '',
                    longitude: '',
                    location: '',
                    medias: '',
                    textContent: '',
                    uuId: '',
                    avatar: '',
                },
                fileUrl: configService.fileSaveURL,
                inforCommentsList: [],
                inforSonCommentsList: [],
                pubOrLove: '',
            }
        },
        watch: {
            cur: {
                immediate: true,
                handler() {
                    console.log('watch', this.cur);
                    this.userId = this.$store.getters.userid;
                    this.uuId = this.$store.getters.uuId;
                    //this.load();
                    console.log('uuId666：', this.uuId);
                    console.log('userId888：', this.userId);
                }
            }
        },
        created() {
            //this.initFormData();
            this.findPublishInfor(this.myFormData.inforId);
            this.getInforCommentsList(this.myFormData.inforId);
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.myFormData = item
            console.log("获取到了列表传过来的对象：", item);
            console.log("对象的id：", item.id);
            if(this.uuId == this.myFormData.uuId ){
                //从我的发布、我赞过 跳的详情都是这一个页面 然后是否展示 编辑和删除按钮就得判断
                //如果是我的发布进来的 就需要有编辑以及删除按钮   反之从我赞过进来的不要
                // 如果不相等 赋值为2 代表是我赞过
                // 如果相等 赋值为1 代表是我的发布
                this.pubOrLove = 1;
            }
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
            //根据id获取详情
            findPublishInfor(inforId) {
                console.log("进来了方法", inforId)
                this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: inforId}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.myCommentForm = res.data.result;
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
            //获取评论列表
            getInforCommentsList(inforId) {
                console.log("进来了方法2222", inforId)
                this.$http.get(this.url.findInforCommentsPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        id: inforId
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("res.data.result:",res.data.result);
                        console.log("数据条数:", res.data.result);
                        this.inforCommentsList = res.data.result.items;
                        for (let d of this.inforCommentsList) {
                            d.avatar = this.fileUrl + d.avatar
                        }
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
                        for (let d of this.inforSonCommentsList) {
                            d.avatar = this.fileUrl + d.avatar
                        }
                    }
                }).catch(err => {
                    console.log(err);
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

        .card-line {
            font-weight: bold;
            display: flex;
            margin-bottom: 30rpx; /*盒子间的距离*/
        }

        .card-createDate {
            font-weight: bold;
            margin-right: 400rpx;
            margin-left: 10rpx;
        }

        .card-ipAddress {
            font-weight: bold;
            margin-left: 15rpx;
        }

        .card-likeCount {
            font-weight: bold;
            margin-right: 200rpx;
            margin-left: 20rpx;
        }

        .card-loveCount {
            font-weight: bold;
            margin-right: 200rpx;
            margin-left: 20rpx;
        }

        .card-commentCount {
            font-weight: bold;
            margin-right: 80rpx;
            margin-left: 20rpx;
        }

        .card-text {
            width: 95%;
            font-size: 38rpx;
            margin-bottom: 20rpx; /*盒子间的距离*/
            line-height: 50rpx; /*行高*/
        }

        .card-text {
            font-size: 32rpx;
            margin-bottom: 20rpx; /*盒子间的距离*/
        }

        .comment {
            background-color: #fff;
            //padding: 20rpx 20rpx;
            //border-radius: 20rpx;
            margin-bottom: 10rpx; /*盒子间的距离*/
            margin-top: 30rpx; /*盒子距离顶部的距离*/
            //line-height: 35rpx; /*行高*/
            //margin-bottom: 16px; /*内容和标题间的间距*/

            //这个虽然目前没用但是要留下来、这个是绝对位置的样式
            .comment-parent {
                /*position: absolute; 绝对定位*/
                /*left: 20rpx;*/
                /*font-size: 20rpx;*/
                display: flex;
                justify-content: space-between;

                /*.card-line {*/
                /*    font-weight: bold;*/
                /*    display: flex;*/
                /*    margin-bottom: 30rpx; !*盒子间的距离*!*/
                /*}*/
                .comment-avatar {
                    max-width: 25px;
                    width: 25px;
                    width: expression(this.width > 25 ? "25px" : this.width);
                    height: 25px;
                    height: expression(this.height > 25 ? "25px" : this.height);
                    position: absolute;
                    left: 20rpx;
                    font-size: 20rpx;
                    margin-top: 15rpx;
                }

                .comment-nickcon {
                    //font-weight: bold;
                    //margin-right: 80rpx;
                    margin-left: 70rpx;
                    //display: flex;
                    //justify-content: space-between;

                    .comment-nickname {
                        font-size: 30rpx;
                        color: #6e6e6e;
                        //font-weight: bold;
                        //margin-right: 80rpx;
                        //margin-left: 40rpx;
                    }

                    .comment-content {
                        font-size: 35rpx;
                        color: #2c2c2c;
                        //font-weight: bold;
                        //margin-right: 10rpx;
                        //margin-left: 40rpx;
                    }
                    .comment-createDate {
                        //margin-right: 80rpx;
                        margin-left: 10rpx;
                        display: flex;
                    }
                }
                .comment-iconlikeCount {
                    //font-weight: bold;
                    margin-right: 25rpx;
                    //margin-left: 35rpx;
                    margin-top: 30rpx;
                    display: flex;
                    //justify-content: space-between;

                    .comment-likeCount {
                        //font-weight: bold;
                        //margin-right: 80rpx;
                        margin-left: 10rpx;
                    }
                }

            }

            .comment-son {
                /*position: absolute; 绝对定位*/
                /*left: 20rpx;*/
                /*font-size: 20rpx;*/
                display: flex;
                justify-content: space-between;
                margin-left: 85rpx;

                /*.card-line {*/
                /*    font-weight: bold;*/
                /*    display: flex;*/
                /*    margin-bottom: 30rpx; !*盒子间的距离*!*/
                /*}*/
                .comment-avatar {
                    max-width: 25px;
                    width: 25px;
                    width: expression(this.width > 25 ? "25px" : this.width);
                    height: 25px;
                    height: expression(this.height > 25 ? "25px" : this.height);
                    position: absolute;
                    left: 80rpx;
                    font-size: 20rpx;
                    margin-top: 15rpx;
                }

                .comment-nickcon {
                    //font-weight: bold;
                    margin-right: 80rpx;
                    margin-left: 40rpx;

                    .comment-nickname {
                        font-size: 30rpx;
                        color: #6e6e6e;
                        //font-weight: bold;
                        //margin-right: 80rpx;
                        //margin-left: 40rpx;
                    }

                    .comment-content {
                        font-size: 35rpx;
                        color: #2c2c2c;
                        //font-weight: bold;
                        margin-right: 10rpx;
                        //margin-left: 40rpx;
                    }
                    .comment-createDate {
                        //margin-right: 80rpx;
                        margin-left: 60rpx;
                        //display: flex;
                        //justify-content: space-between;
                    }
                }

                .comment-iconlikeCount {
                    //font-weight: bold;
                    margin-right: 25rpx;
                    margin-top: 30rpx;
                    //margin-left: 35rpx;
                    display: flex;
                    //justify-content: space-between;

                    .comment-likeCount {
                        //font-weight: bold;
                        //margin-right: 80rpx;
                        margin-left: 10rpx;
                    }
                }
            }
        }
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
