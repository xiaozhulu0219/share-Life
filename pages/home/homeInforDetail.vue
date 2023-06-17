<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <scroll-view scroll-y class="page">
            <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
                <block slot="backText">
                </block>
                <block slot="right">
                    <image class="medias_avatar" :src="myFormData.avatar" alt=""
                           @click="toMemberdetail(myFormData)"></image>
                    ShareLifeShareLifeShareLifeShareLifeShareLife
                </block>

            </cu-custom>
            <view class="card">
                <swiper indicator-dots indicator-color="#008c8c" indicator-active-color="red">
                    <swiper-item v-for="(item, index) in myFormData.medias" :index="index" :key="index">
                        <image :src="item" @click="TanPreviewImage(index)" mode="scaleToFill"></image>
                    </swiper-item>
                </swiper>

                <view class="card-text">{{myFormData.textContent}}</view>

                <view class="card-line">
                    <view class="card-createDate">{{myFormData.createDate}}</view>
                    <view class="iconfont ml-1" style="color: #dd524d;"> &#xe636</view>
                    <view class="card-ipAddress">{{myFormData.ipAddress}}</view>
                </view>

                <view class="card-line">
                    <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe60f</view>
                    <view class="card-likeCount">{{myCommentForm.likeCount}}</view>
                    <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe617</view>
                    <view class="card-loveCount">{{myCommentForm.loveCount}}</view>
                    <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe601</view>
                    <view class="card-commentCount">{{myCommentForm.commentCount}}</view>
                </view>

                <view class="input-comment">
                    <input class="input-form" v-model="inputValue" maxlength="200" placeholder="最多输入200评论"
                           @input="onInput(inputValue)"/>
                    <button class="input-button" form-type="submit" @click="saveComment(inputValue)">评论</button>
                </view>

                <view v-for="(item,index) in inforCommentsList" :key="index" class="comment">
                    <view class="comment-parent">
                        <image class="comment-avatar round sm" :src="item.avatar" alt=""
                               @click="toMemberdetail(myFormData)"></image>
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
                    <view class="iconfont ml-1" style="font-size: 40rpx;  margin-left: 200rpx"
                          @click="getSonCommentsList(item)">&#xe631
                    </view>
                    <!--  <view>展开{{}}条回复</view>-->
                    <view v-for="(sonitem,index) in inforSonCommentsList" :key="index">
                        <view class="comment-son">
                            <image class="comment-avatar round sm" :src="sonitem.avatar" alt=""
                                   @click="toMemberdetail(myFormData)"></image>
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
                keyWords: [
                    '尼玛', '我操你妈', '我草泥马', '操', '草', '我擦', '尼玛批', 'nm', 'wocaonima', 'cao', 'ca', 'woca', 'nmp', 'nimapi', 'fuck',
                    '傻逼', '沙北', '傻杯', '鸡巴', '鸡毛', 'sb', 'jb', 'jiba',
                    '习近平', '军队', '国家领导人', '党', '领袖', '政府', 'zf', 'zhengfu', 'xijinping', 'xjp', 'gjldr', 'guojialingdaoren', 'guojia', 'lingdaoren', 'dang', 'lingxiu',
                    '毒品', '黄赌毒', '色情', '迷药', '杀', '强奸', '诱奸', '死', 'dupin', 'hdd', 'huangdudu', 'seqing', 'sese', 'se', 'miyao', 'qj', 'qiangjian', 'youjian', 'si',
                    '尼格', '黑鬼', 'nige', 'heigui',
                    '史无前例', '前无古人', '史无前例', '前无古人', '史无前例', '前无古人',
                    '史无前例', '前无古人', '史无前例', '前无古人', '史无前例', '前无古人', '史无前例', '前无古人',
                    '史无前例', '前无古人', '史无前例', '前无古人', '史无前例', '前无古人', '史无前例', '前无古人',
                ],
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
            onInput(value) {
                const word = this.keyWords
                if (value !== null) {
                    for (const i in word) {
                        const reg = new RegExp(word[i], 'g')
                        //console.log("reg:",reg)
                        if (value.indexOf(word[i]) != -1) {
                            //console.log("value.indexOf(word[i]):",value.indexOf(word[i]))
                            //const result = value.replace(reg, `<span style="color:#f03b2c">${word[i]}</span>`)
                            const result = value.replace(reg, '*')
                            //console.log("result:",result)
                            value = result
                            //console.log("value:",value)
                        }
                    }
                }
                this.inputValue = value
                //console.log("置换后value:",value)
            },


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
                        for (let d of this.inforCommentsList) {
                            // let arr = d.medias.split(',')
                            // let arr2 = []
                            // for (let e of arr) {
                            //     e = this.fileUrl+e
                            //     arr2.push(e)
                            // }
                            d.avatar = this.fileUrl + d.avatar
                            //d.medias = arr2
                        }
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
                        for (let d of this.inforSonCommentsList) {
                            // let arr = d.medias.split(',')
                            // let arr2 = []
                            // for (let e of arr) {
                            //     e = this.fileUrl+e
                            //     arr2.push(e)
                            // }
                            d.avatar = this.fileUrl + d.avatar
                            //d.medias = arr2
                        }
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
                //若评论中包含 “*” 或者为空 不允许保存
                //console.log("inputValue值为空1：", inputValue);
                if (inputValue === "" || inputValue.indexOf("*") != -1) {
                    console.log("评论出现了违规词语、已被拦截：", inputValue);
                } else {
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
                            this.inputValue = '';
                        }
                    });
                }
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
            margin-top: 30rpx;
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

    .input-comment{
        display: flex;

        .input-form{
            //display: flex;
            width: 250px;
            height: 40px;
        }
        .input-button{
            //display: flex;
            //display: inline;
            //float: right;
            width: 65px;
            height: 40px;
            //display: block;
            margin-right: 15rpx;
            //margin-left: 40rpx;
        }

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


