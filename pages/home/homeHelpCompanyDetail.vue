<template>
    <!--助力公司详情页面-->
    <view class="container">
        <!--标题和返回-->
        <cu-custom :bgColor="NavBarColor" isBack :backRouterName="backRouteName">
            <block slot="backText">返回</block>
            <block slot="content">{{model.title}}详情</block>
        </cu-custom>
        <!--详情区域-->
        <view class="company">
            <view class="company-companyName">{{model.companyName}}</view>
            <view class="company-legalPerson">{{model.legalPerson}}</view>
        </view>
        <view class="company">
            <view class="company-registerTime">{{model.registerTime.substr(0, 15)}}</view>
            <view class="company-registeredCapital">{{model.registeredCapital}}</view>
        </view>
        <view class="company">
            <view class="company-companyStatus">{{model.companyStatus}}</view>
            <view class="company-bussinessAddress">{{model.bussinessAddress}}</view>
            <view class="company-organizationCode">{{model.organizationCode}}</view>
        </view>
        <view class="company">
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #fbbd08;" v-if="comModel.hasUpLiked == 0"
                  @click="likeCom(comModel.id)">&#xe8ad
            </view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" v-else
                  @click="dislikeCom(comModel.id)">&#xe60f
            </view>
            <view class="company-upLikeCount">{{comModel.upLikeCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #fbbd08" v-if="comModel.hasDownLiked == 0"
                  @click="downLikeCom(comModel.id)">&#xe614
            </view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" v-else
                  @click="downDisLikeCom(comModel.id)">&#xe644
            </view>
            <view class="company-downLikeCount">{{comModel.downLikeCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe601</view>
            <span class="company-commentCount">{{comModel.commentCount}}</span>
        </view>

        <view class="companyTag">
            <span>#歧视女生</span> <span>#可接受残疾人</span> <span>#体恤员工</span> <span>#米面粮油</span>
        </view>
        <view class="list-wrap">
            <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">

                <view v-for="(item,index) in commentsList" :key="index" class="detail">
                    <view class="detail-title">
                        <view>有理有据</view>
                        <image class="comment-avatar round sm" :src="item.avatar" alt=""></image>
                    </view>

                    <view class="detail-content">
                        <view class="detail-info">
                            <view style="background-color: antiquewhite;">{{item.nickname}}（在职）</view>
                            <view>{{item.content}}</view>
                            <view style="margin-right: 10rpx;">{{item.createDate}} 北京</view>
                        </view>
                        <view class="comment-iconlikeCount">
                            <view class="iconfont ml-1" style="font-size: 45rpx; color: #fbbd08;"
                                  v-if="item.hasUpLiked == 0" @click="likeComment(item.id)">&#xe8ad
                            </view>
                            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" v-else
                                  @click="dislikeComment(item.id)">&#xe60f
                            </view>
                            <span class="comment-likeCount">{{item.likeCount}}</span>
                        </view>
                    </view>
                </view>
                <view v-if='isDownLoading' class="load-text">评论加载中....</view>
                <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多评论了，快去助力感兴趣的公司吧---</view>
            </scroll-view>
        </view>
        <view style="width: 100%;height: 100rpx;"></view>
        <view class="footer">
            <input class="input-form" v-model="inputValue" maxlength="200" placeholder="最多输入200评论"
                   @input="onInput(inputValue)"/>
            <image class="avatar round sm" :src="comModel.avatar" alt=""></image>
            <button class="input-button" form-type="submit" @click="saveComment(inputValue)">发送</button>
        </view>
    </view>
</template>

<script>
    import configService from '@/common/service/config.service.js'
    import { keyWords } from '../../common/util/constants';

    export default {
        name: "helpCompanyDetailForm",
        components: {},
        props: {},
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                companyName: '',
                NavBarColor: this.NavBarColor,
                backRouteName: 'index',
                findPageCommentByIdUrl: "/company/comments/list", //根据助力公司的id拿到所有评论
                url: {
                    findHelpComByIdUrl: "/company/findHelpComById", //根据助力公司的tianyanchaId拿到详情
                    likeComUrl: "/company/upLike", //向上点赞公司
                    upDislikeComUrl: "/company/upDislike", //取消向上点赞公司
                    downLikeComUrl: "/company/downLike", //向下点赞公司
                    downDislikeComUrl: "/company/downDislike", //取消向下点赞公司
                    saveCommentUrl: '/company/comments/saveCommentForCom', //助力详情发布接口
                    likeCommentUrl: '/company/comments/like', //点赞评论
                    dislikeCommentUrl: '/company/comments/dislike', //取消点赞评论
                },
                //点击跳转后直接传过来的表单、但是id已经变了不能用id进行详情查询
                model: {
                    bussinessAddress: '',
                    companyName: '',
                    companyType: '',
                    creditCode: '',
                    id: '',
                    legalPerson: '',
                    organizationCode: '',
                    regNumber: '',
                    registeredCapital: '',
                    tianyanchaId: '',
                    upLikeCount: '',
                    downLikeCount: '',
                    commentCount: '',
                    pic: '',
                    textContent: '',
                    companySign: '',
                    businessScope: '',
                    email: '',
                    registerTime: '',
                    levelId: '',
                    logo: '',
                    //companyId: '',
                    companyStatus: '',
                    avatar: '',
                    nickname: '',
                    gender: '',
                    title: '',

                },
                //通过 tianyanchaId 查到的详情表单
                comModel: {
                    bussinessAddress: '',
                    companyName: '',
                    companyType: '',
                    creditCode: '',
                    id: '',
                    legalPerson: '',
                    organizationCode: '',
                    regNumber: '',
                    registeredCapital: '',
                    tianyanchaId: '',
                    upLikeCount: '',
                    downLikeCount: '',
                    commentCount: '',
                    pic: '',
                    textContent: '',
                    companySign: '',
                    businessScope: '',
                    email: '',
                    registerTime: '',
                    levelId: '',
                    logo: '',
                    //companyId: '',
                    companyStatus: '',

                },
                //评论列表的表单
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
                    helpCompanyId: '',
                },
                commentsList: [],
                fileUrl: configService.fileSaveURL,
                inputValue: '',
            }
        },
        created() {
            //this.initFormData();
            //先通过 tianyanchaId 查到详情，可以展示点赞数之类，然后利用id再去查询评论
            //console.log("this.model.tianyanchaId", this.model.tianyanchaId)
            this.findHelpComById(this.model.tianyanchaId);
            //查询评论列表时用助力公司的id、但不是从列表跳过来的（那个经过json转化已经变了。需要的是查询单条的接口返回的id）
            this.findPageCommentById(this.model.tianyanchaId);//临时传 tianyanchaId 到了后台再转为id去查询
        },
        onLoad(option) {
            //console.log("params过来了", option)
            const item = JSON.parse(decodeURIComponent(option.item));
            this.model = item
            this.model.title = item.companyName.substr(5)
            // this.model.companyName = "公司名称：" + item.companyName
            // this.model.legalPerson = "法人：" + item.legalPerson
            // this.model.registerTime = "注册时间：" + item.registerTime
            // this.model.registeredCapital = "注册资金：" + item.registeredCapital
            // this.model.companyStatus = "经营状态：" + item.companyStatus
            // this.model.bussinessAddress = "经营地：" + item.bussinessAddress
            // this.model.organizationCode = "组织编码：" + item.organizationCode

        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.findPageCommentById(this.model.tianyanchaId);
            },
            //根据 tianyanchaId 查询详情
            findHelpComById(tianyanchaId) {
                //console.log("进来了查询详情方法", tianyanchaId)
                this.$http.get(this.url.findHelpComByIdUrl, {
                    params: {
                        id: Number(tianyanchaId),
                    }
                }).then((res) => {
                    if (res.data.success) {
                        console.log("查询详情返回的数据", res);
                        this.comModel = res.data.result;
                        //console.log("赋值以后的数据", this.comModel);
                        this.comModel.avatar = this.fileUrl + res.data.result.avatar
                    }
                })
            },
            findPageCommentById(id) {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const {findPageCommentByIdUrl, pageInfo: {num, size}} = this;
                this.$http.get(findPageCommentByIdUrl, {
                    params: {page: num, pagesize: size, id: Number(id),}
                }).then(res => {
                    const {success, result} = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const {pages, items, page} = result;
                        if (num === 1) this.commentsList = [];
                        if (items.length) {
                            for (const d of items) {
                                d.avatar = this.fileUrl + d.avatar
                            }
                        }
                        this.commentsList = this.commentsList.concat(items);
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
            //保存评论 这里有两种评论、一种是对动态 一种是对评论
            saveComment(inputValue) {
                //若评论中包含 “*” 或者为空 不允许保存
                //console.log("inputValue值为空1：", inputValue);
                if (inputValue === "" || inputValue.indexOf("*") != -1) {
                    console.log("评论出现了违规词语、已被拦截：", inputValue);
                } else {
                    const HelpCompanyCommentDto = {};
                    HelpCompanyCommentDto.helpCompanyId = this.comModel.id;
                    HelpCompanyCommentDto.comment = inputValue;
                    this.$http.post(this.url.saveCommentUrl, HelpCompanyCommentDto).then(res => {
                        //刷新留言列表、并将返回的评论数量 回显页面上 并将输入框文字置空
                        if (res.data.success) {
                            //回显最新评论数
                            this.comModel.commentCount = res.data.result
                            //重新赋页码数、并刷新评论列表
                            this.pageInfo.num = 0;
                            this.findPageCommentById(this.model.tianyanchaId);
                            //置空输入框
                            this.inputValue = '';
                        }
                    });
                }
            },
            //向上点赞公司
            likeCom(id) {
                console.log("进来向上点赞公司方法", id)
                this.$http.get(this.url.likeComUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.comModel.upLikeCount = res.data.result;
                        //重新根据 tianyanchaId 查询公司详情
                        this.findHelpComById(this.model.tianyanchaId);
                    }
                })
            },
            //取消向上点赞公司
            dislikeCom(id) {
                console.log("进来了取消向上点赞公司方法", id)
                this.$http.get(this.url.upDislikeComUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.comModel.upLikeCount = res.data.result;
                        //重新根据 tianyanchaId 查询公司详情
                        this.findHelpComById(this.model.tianyanchaId);
                    }
                })
            },
            //向下点赞公司
            downLikeCom(id) {
                console.log("进来了向下点赞公司方法", id)
                this.$http.get(this.url.downLikeComUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.comModel.downLikeCount = res.data.result;
                        //重新根据 tianyanchaId 查询公司详情
                        this.findHelpComById(this.model.tianyanchaId);
                    }
                })
            },
            //取消向下点赞公司
            downDisLikeCom(id) {
                console.log("进来了取消向下点赞公司方法", id)
                this.$http.get(this.url.downDislikeComUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        this.comModel.downLikeCount = res.data.result;
                        //重新根据 tianyanchaId 查询公司详情
                        this.findHelpComById(this.model.tianyanchaId);
                    }
                })
            },
            //点赞评论
            likeComment(id) {
                console.log("进来了点赞评论方法", id)
                this.$http.get(this.url.likeCommentUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        //重新赋页码数、并刷新评论列表
                        this.pageInfo.num = 0;
                        this.findPageCommentById(this.model.tianyanchaId);
                    }
                })
            },
            //取消点赞评论
            dislikeComment(id) {
                console.log("进来了取消点赞评论方法", id)
                this.$http.get(this.url.dislikeCommentUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        //重新赋页码数、并刷新评论列表
                        this.pageInfo.num = 0;
                        this.findPageCommentById(this.model.tianyanchaId);
                    }
                })
            },
        }
    }
</script>


<style>

    .list-wrap {
        height: calc(100vh - 280rpx);
    }

    .container{
        background-color: #ffffff;
    }

    .company {
    //margin: 20rpx; /*margin:5px 10px 15px 20px; 依次表示 上右下左*/
        display: flex;
        margin-bottom: 30rpx; /*盒子间的距离*/
        font-weight: bold;
        margin-top: 20rpx; /*盒子距离顶部的距离*/
    }

    .company-companyName {
        font-weight: bold;
        margin-left: 10rpx;
        margin-right: 180rpx;

    }

    .company-legalPerson {
        font-weight: bold;
    }

    .company-registerTime {
        font-weight: bold;
        margin-left: 10rpx;
        margin-right: 150rpx;
    }

    .company-registeredCapital {
        font-weight: bold;
    }

    .company-companyStatus {
        font-weight: bold;
        margin-left: 10rpx;
        margin-right: 40rpx;
    }

    .company-bussinessAddress {
        font-weight: bold;
    //margin-left: 10rpx;
        margin-right: 40rpx;
    }

    .company-organizationCode {
        font-weight: bold;
    }

    .company-upLikeCount {
        font-weight: bold;
        margin-right: 220rpx;
        margin-left: 20rpx;
        margin-top: 10rpx;

    }

    .company-downLikeCount {
        font-weight: bold;
        margin-right: 220rpx;
        margin-left: 20rpx;
        margin-top: 10rpx;
    }

    .company-commentCount {
        font-weight: bold;
        margin-right: 60rpx;
        margin-left: 20rpx;
        margin-top: 10rpx;
    }

    .companyTag {
        margin-top: 20rpx;
    }

    .detail {
        padding: 30rpx;
        border-bottom: #eee solid 1rpx;
    }

    .detail-title {
    //display: flex;
        margin-right: 100rpx;
    // justify-content: space-between;
    }

    .detail-content {
        display: flex;
        justify-content: space-between;
        margin-left: 80rpx;
    }

    .detail-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }


    .detail-icon {
        width: 40rpx;
        height: 40rpx;
    }

    .comment-iconlikeCount {
    //font-weight: bold;
        margin-right: 25rpx;
    //margin-left: 35rpx;
        margin-top: 30rpx;
        display: flex;
    //justify-content: space-between;

        .comment-likeCount {
            font-weight: bold;
        //margin-right: 80rpx;
            margin-left: 10rpx;
            margin-top: 10rpx;
        }
    }

    .comment-avatar {
        max-width: 25px;
        width: 25px;
        width: expression(this.width > 25 ? "25px" : this.width);
        height: 25px;
        height: expression(this.height > 25 ? "25px" : this.height);
        position: absolute;
        font-size: 20rpx;
        margin-top: 15rpx;
    //margin-right: 10rpx;
        margin-left: 20rpx;
    }

    .footer{
        width: 100%;
        background-color: #eee;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    //padding:10rpx;
    }

    .input-form{
    //display: flex;
        width: 250px;
        height: 40px;
    }

    .input-button{
        width: 75px;
        height: 40px;
        margin-right: 6rpx;
    }
    .avatar {
        max-width: 25px;
        width: 25px;
        width: expression(this.width > 25 ? "25px" : this.width);
        height: 25px;
        height: expression(this.height > 25 ? "25px" : this.height);
        position: absolute;
        font-size: 20rpx;
        margin-top: 15rpx;
    //margin-right: 10rpx;
        margin-left: 520rpx;
    }
    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }
    .noMore {
        color: #ccc;
    }

</style>
