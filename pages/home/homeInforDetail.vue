<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view class="container">
        <commonTab :isBack="true" :backRouterName="backRouteName">
            <block slot="title"> <image class="medias_avatar round" :src="myFormData.avatar" alt="" @click="toMemberdetail(myFormData.uuId)" style="margin-right: 20rpx"></image>
                {{myCommentForm.nickname}}
            </block>
        </commonTab>
        <view class="card">

            <swiper  v-if="myFormData.medias.length>1" indicator-dots indicator-color="#94afce" indicator-active-color="red" style="height: 1000rpx;width: 750rpx">
                <swiper-item v-for="(item, index) in myFormData.medias" :index="index" :key="index" >
                    <image :src="item" @click="TanPreviewImage(index)" mode="aspectFit" style="height: 980rpx;width: 720rpx"></image>
                </swiper-item>
            </swiper>
            <swiper  v-else  style="height: 1000rpx;width: 750rpx">
                <swiper-item v-for="(item, index) in myFormData.medias" :index="index" :key="index" >
                    <image :src="item" @click="TanPreviewImage(index)" mode="aspectFit" style="height: 980rpx;width: 720rpx"></image>
                </swiper-item>
            </swiper>
            <view class="card-text">{{myFormData.textContent}}</view>

            <view class="card-line">
                <view class="card-createDate">{{myCommentForm.createDate}}</view>
                <view class="cuIcon-location"> </view>
                <view class="card-ipAddress">{{myFormData.ipAddress}}</view>
            </view>

            <view class="card-line">
                <view class="iconfont ml-1" style="font-size: 45rpx; color: #fbbd08;" v-if="myCommentForm.hasLiked == 0"
                      @click="likeInfor(myCommentForm.id)">&#xe8ad
                </view>
                <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" v-else
                      @click="dislikeInfor(myCommentForm.id)">&#xe60f
                </view>
                <view class="card-likeCount">{{myCommentForm.likeCount}}</view>
                <view class="cuIcon-like" style="font-size: 45rpx; color: #fbbd08;" v-if="myCommentForm.hasLoved == 0"
                      @click="loveInfor(myCommentForm.inforId)"></view>
                <view class="cuIcon-likefill" style="font-size: 45rpx; color: #dd524d;" v-else
                      @click="unloveInfor(myCommentForm.inforId)"></view>
                <view class="card-loveCount">{{myCommentForm.loveCount}}</view>
                <view class="cuIcon-comment" style="font-size: 45rpx;"></view>
                <view class="card-commentCount">{{myCommentForm.commentCount}}</view>
            </view>
			<view class="card-divider"></view>
            <view class="list-wrap">
                <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">

                    <view v-for="(item,index) in inforCommentsList" :key="index" class="comment">
                        <view class="comment-parent">
                            <image class="comment-avatar round sm" :src="item.avatar" alt=""
                                   @click="toMemberdetail(item.uuId)"></image>
                            <view class="comment-nickcon">
                                <view class="comment-nickname">{{ item.nickname }}</view>
                                <view class="comment-content" >{{ item.content }}</view>
                                <view class="comment-createDate">{{item.createDate}}</view>
                            </view>
                            <view class="comment-iconlikeCount">
                                <view class="iconfont ml-1" style="font-size: 30rpx; color: #fbbd08;;"
                                      v-if="item.hasLiked == 0" @click="likeComment(item.id)">&#xe8ad
                                </view>
                                <view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;" v-else
                                      @click="dislikeComment(item.id)">&#xe60f
                                </view>
                                <view class="comment-likeCount">{{item.likeCount}}</view>
                            </view>
                        </view>
                        <view class="cuIcon-triangledownfill" style="font-size: 40rpx;  margin-left: 200rpx"
                              @click="getSonCommentsList(item)" v-if="item.hasChild=1">
                        </view>
                        <!--  <view>展开{{}}条回复</view>-->
                        <view v-for="(sonitem,index) in inforSonCommentsList" :key="index">
                            <view class="comment-son">
                                <image class="comment-avatar round sm" :src="sonitem.avatar" alt=""
                                       @click="toMemberdetail(sonitem.uuId)"></image>
                                <view class="comment-nickcon">
                                    <view class="comment-nickname">{{ sonitem.nickname }}</view>
                                    <view class="comment-content">{{ sonitem.content }}</view>
                                    <view class="comment-createDate">{{sonitem.createDate}}</view>
                                </view>

                                <view class="comment-iconlikeCount">
                                    <view class="iconfont ml-1" style="font-size: 30rpx; color: #fbbd08;;"
                                          v-if="sonitem.hasLiked == 0" @click="likeSonComment(sonitem.id)">&#xe8ad
                                    </view>
                                    <view class="iconfont ml-1" style="font-size: 30rpx; color: #dd524d;" v-else
                                          @click="likeSonComment(sonitem.id)">&#xe60f
                                    </view>
                                    <view class="comment-likeCount">{{sonitem.likeCount}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-if='isDownLoading' class="load-text">评论加载中....</view>
                    <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多评论了，快快留下你的赞美吧---</view>

                </scroll-view>
            </view>

        </view>
        <view class="footer">
            <input class="input-form" v-model="inputValue" maxlength="200" placeholder="最多输入200评论"
                   @input="onInput(inputValue)"/>
            <button class="input-button" form-type="submit" @click="saveComment(inputValue)">发送</button>
        </view>
    </view>

</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue';
    import configService from '@/common/service/config.service.js';
    import commonTab from '../component/commonTab.vue';
    import { keyWords } from '../../common/util/constants';
    export default {
        name: 'homeInformationDetail',
        components: {
            myDate,
            commonTab
        },
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

                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                CustomBar: this.CustomBar,
                NavBarColor: this.NavBarColor,
                loading: false,
                backRouteName: 'index',
                arr: [],
                inputValue: '',
                findInforCommentsPageUrl: '/information/comments/list',
                findSonCommentListPageUrl: '/information/comments/findSonCommentListById',
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
                    saveCommentUrl: '/information/comments/saveCommentForInfor',
                    saveCommentForCommentUrl: '/information/comments/saveCommentForComment',
                    likeCommentUrl: '/information/comments/like',
                    dislikeCommentUrl: '/information/comments/dislike',
                    likeSonCommentUrl: '/information/comments/like',
                    deleteCommentUrl: '/information/comments/deleteComment',
                    likeInforUrl: '/information/movements/like',
                    dislikeInforUrl: '/information/movements/dislike',
                    loveInforUrl: '/information/movements/love',
                    unloveInforUrl: '/information/movements/unlove'
                },
                text: '',
                vBlock: 'block',
                toupiao: false,
                voteBc: 'white',
                voteList: [
                    { id: 1, content: '' },
                    { id: 2, content: '' },
                    { id: 3, content: '' }
                ],
                publishId: '',
                myFormData: {
                    latitude: '',
                    longitude: '',
                    location: '',
                    medias: '',
                    textContent: '',
                    uuId: '',
                    avatar: ''
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
                    loveCount: '',
                    createDate: '',
                    nickname: '',
                    id: '',
                    inforId: ''
                },
                fileUrl: configService.fileSaveURL,
                inforCommentsList: [],
                inforSonCommentsList: []
            };
        },
        watch: {
            cur: {
                immediate: true,
                handler() {
                    console.log('watch', this.cur);
                    this.userId = this.$store.getters.userid;
                    this.uuId = this.$store.getters.uuId;
                }
            }
        },
        created() {
            this.getInforCommentsList(this.myFormData.inforId);
            this.findPublishInfor(this.myFormData.inforId);
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.myFormData = item;
            console.log('this.myFormData1:',this.myFormData);
            console.log('this.myFormData2:',this.myFormData.medias);
            console.log('this.myFormData3:',this.myFormData.medias.length);
            this.findPublishInfor(item.inforId); //这是传参后继续调用方法的示例
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getInforCommentsList(this.myFormData.inforId);
            },
            onInput(value) {
                if (value !== null) {
                    for (const i in keyWords) {
                        const reg = new RegExp(keyWords[i], 'g');
                        value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
                    }
                }
                // 数据改变是异步的
                this.$nextTick(() => {
                    this.inputValue = value;
                });
                console.log('置换后value:', value);
            },

            //点击图片进入函数，传入当前列表的索引index
            TanPreviewImage(indexa) {
                uni.previewImage({ // 预览图片  图片路径必须是一个数组 => ["http://21111889:8970/6_1597822634094.png"]
                    current: indexa, //这里是判断到点击列表上的某个图片，就读取索引的图片
                    urls: this.myFormData.medias, //这是整个内容的图片数组，放一个数组里，就可以左右切换了
                    longPressActions: { //长按保存图片到相册
                        itemList: ['保存图片'],
                        success: (data) => {
                            console.log(data);
                            uni.saveImageToPhotosAlbum({ //保存图片到相册
                                filePath: payUrl,
                                success: function() {
                                    uni.showToast({
                                        icon: 'success',
                                        title: '保存成功'
                                    });
                                },
                                fail: (err) => {
                                    uni.showToast({
                                        icon: 'none',
                                        title: '保存失败，请重新尝试'
                                    });
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
                this.$http.get(this.url.findPublishInforByIdUrl, { params: { id: inforId } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        this.myCommentForm = res.data.result;
                    }
                });
            },
            //获取评论列表
            getInforCommentsList(inforId) {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const { findInforCommentsPageUrl, pageInfo: { num, size } } = this;
                this.$http.get(findInforCommentsPageUrl, {
                    params: { page: num, pagesize: size, id: inforId }
                }).then(res => {
                    const { success, result } = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const { pages, items, page } = result;
                        if (num === 1) this.inforCommentsList = [];
                        if (items.length) {
                            for (const d of items) {
                                d.avatar = this.fileUrl + d.avatar;
                            }
                        }
                        this.inforCommentsList = this.inforCommentsList.concat(items);
                        this.hasNext = pages > page;
                        this.isDownLoading = false;
                    } else {
                        this.isDownLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.isDownLoading = false;
                });
            },
            //获取评论的子级评论列表
            getSonCommentsList(item) {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const { findSonCommentListPageUrl, pageInfo: { num, size } } = this;
                this.$http.get(this.findSonCommentListPageUrl, {
                    params: { page: 1, pagesize: 10, id: item.id }
                }).then(res => {
                    const { success, result } = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const { pages, items, page } = result;
                        if (num === 1) this.inforSonCommentsList = [];
                        if (items.length) {
                            for (const d of items) {
                                d.avatar = this.fileUrl + d.avatar;
                            }
                        }
                        this.inforSonCommentsList = this.inforSonCommentsList.concat(items);
                        this.hasNext = pages > page;
                        this.isDownLoading = false;

                        console.log('子级评论列表', this.inforSonCommentsList);

                    } else {
                        this.isDownLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.isDownLoading = false;
                });
            },
            //点击头像跳转用户详情
            toMemberdetail(myFormData) {
                console.log('进来了666应该是uuid', myFormData);
                //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
                //判断如果跳转的动态页的uuid 不是当前登录用户的  那就跳到用户的个人页
                if (this.uuId == myFormData) {
                    uni.navigateTo({
                        url: '/pages/member/member'
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                    });
                }
            },
            //保存评论 这里有两种评论、一种是对动态 一种是对评论
            saveComment(inputValue) {
                //若评论中包含 “*” 或者为空 不允许保存
                //console.log("inputValue值为空1：", inputValue);
                if (inputValue === '' || inputValue.indexOf('*') != -1) {
                    console.log('评论出现了违规词语、已被拦截：', inputValue);
                } else {
                    const InforCommentDto = {};
                    InforCommentDto.publishId = this.myCommentForm.id;
                    InforCommentDto.comment = inputValue;
                    this.$http.post(this.url.saveCommentUrl, InforCommentDto).then(res => {
                        //刷新留言列表、并将返回的评论数量 回显页面上 并将输入框文字置空
                        if (res.data.success) {
                            //回显最新评论数
                            this.myCommentForm.commentCount = res.data.result;
                            //刷新评论列表
                            this.getInforCommentsList(this.myFormData.inforId);
                            //console.log('当前页数是：', this.pageInfo.num);
                            //置空输入框
                            this.inputValue = '';
                        }
                    });
                }
            },
            //保存对评论进行的评论
            saveCommentForComment(publishId,inputValue) {
                //若评论中包含 “*” 或者为空 不允许保存
                //console.log("inputValue值为空1：", inputValue);
                if (inputValue === '' || inputValue.indexOf('*') != -1) {
                    console.log('评论出现了违规词语、已被拦截：', inputValue);
                } else {
                    const InforCommentDto = {};
                    InforCommentDto.publishId = publishId; //这个应该是评论的id
                    InforCommentDto.comment = inputValue;
                    this.$http.post(this.url.saveCommentForCommentUrl, InforCommentDto).then(res => {
                        //刷新子级留言列表  并将输入框文字置空
                        if (res.data.success) {
                            //刷新子级评论列表
                            this.getSonCommentsList(publishId);//拿的也不是动态id  而应该是评论的id
                            //置空输入框
                            this.inputValue = '';
                        }
                    });
                }
            },
            //点赞动态
            likeInfor(id) {
                console.log('进来了点赞动态方法', id);
                this.$http.get(this.url.likeInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        this.myCommentForm.likeCount = res.data.result;
                        //刷新页面
                        this.findPublishInfor(this.myFormData.inforId);
                    }
                });
            },
            //取消点赞动态
            dislikeInfor(id) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.dislikeInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        this.myCommentForm.likeCount = res.data.result;
                        //刷新页面
                        this.findPublishInfor(this.myFormData.inforId);
                    }
                });
            },
            //喜欢动态
            loveInfor(id) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.loveInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        this.myCommentForm.loveCount = res.data.result;
                        //刷新页面
                        this.findPublishInfor(this.myFormData.inforId);
                    }
                });
            },
            //取消喜欢动态
            unloveInfor(id) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.unloveInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        this.myCommentForm.loveCount = res.data.result;
                        //刷新页面
                        this.findPublishInfor(this.myFormData.inforId);
                    }
                });
            },
            //点赞评论
            likeComment(id) {
                console.log('进来了点赞评论方法', id);
                this.$http.get(this.url.likeCommentUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        //this.myCommentForm.likeCount = res.data.result;
                        //重新赋页码数、并刷新评论列表
                        //this.pageInfo.num = 0;
                        this.getInforCommentsList(this.myFormData.inforId);
                    }
                });
            },
            //取消点赞评论
            dislikeComment(id) {
                //console.log("进来了方法", inforId)
                this.$http.get(this.url.dislikeCommentUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据', res);
                        //this.myCommentForm.likeCount = res.data.result;
                        //重新赋页码数、并刷新评论列表
                        //this.pageInfo.num = 0;
                        this.getInforCommentsList(this.myFormData.inforId);
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .list-wrap {
        height: calc(100vh - 280rpx);
    }

    .container{
        background-color: #ffffff;
    }

    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 10rpx; /*盒子间的距离*/
        margin-top: 100rpx; /*盒子距离顶部的距离*/
        line-height: 35rpx; /*行高*/

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
            margin-bottom: 10rpx; /*盒子间的距离*/
            margin-top: 30rpx; /*盒子距离顶部的距离*/

            //这个虽然目前没用但是要留下来、这个是绝对位置的样式
            .comment-parent {
                display: flex;
                justify-content: space-between;

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
                    margin-left: 80rpx;

                    .comment-nickname {
                        font-size: 30rpx;
                        color: #6e6e6e;
                    }

                    .comment-content {
                        font-size: 35rpx;
                        color: #2c2c2c;
                    }
                    .comment-createDate {
                        margin-left: 10rpx;
                        display: flex;
                    }
                }
                .comment-iconlikeCount {
                    margin-right: 25rpx;
                    margin-top: 30rpx;
                    display: flex;

                    .comment-likeCount {
                        margin-left: 10rpx;
                    }
                }

            }

            .comment-son {
                display: flex;
                justify-content: space-between;
                margin-left: 85rpx;

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
                    margin-right: 80rpx;
                    margin-left: 40rpx;

                    .comment-nickname {
                        font-size: 30rpx;
                        color: #6e6e6e;
                    }

                    .comment-content {
                        font-size: 35rpx;
                        color: #2c2c2c;
                        margin-right: 10rpx;
                    }
                    .comment-createDate {
                        margin-left: 60rpx;
                    }
                }

                .comment-iconlikeCount {
                    margin-right: 25rpx;
                    margin-top: 30rpx;
                    display: flex;

                    .comment-likeCount {
                        margin-left: 10rpx;
                    }
                }
            }
        }

    }

    .medias_avatar {
        max-width: 35px;
        width: 35px;
        width: expression(this.width > 35 ? "35px" : this.width);
        height: 35px;
        height: expression(this.height > 35 ? "35px" : this.height);
        overflow: hidden;
        display: inline;
        float: left;
    }

    .footer{
        width: 100%;
        background-color: #eee;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .input-form{
        width: 250px;
        height: 40px;
    }

    .input-button{
        width: 75px;
        height: 40px;
        margin-right: 6rpx;
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

    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }

    .noMore {
        color: #ccc;
    }
	.card-divider{
		height: 10rpx;
		 border-bottom:1px dashed #CCC
	}

</style>
