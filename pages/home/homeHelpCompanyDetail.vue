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
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" @click="likeCom(comModel.id)">&#xe8ad</view>
            <view class="company-upLikeCount">{{comModel.upLikeCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;" @click="downLikeCom(comModel.id)">&#xe614</view>
            <view class="company-downLikeCount">{{comModel.downLikeCount}}</view>
            <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe601</view>
            <span class="company-commentCount">{{comModel.commentCount}}</span>
        </view>

        <view class="companyTag">
            <span>#歧视女生</span> <span>#可接受残疾人</span> <span>#体恤员工</span> <span>#米面粮油</span>
        </view>

        <view v-for="item in commentsList" :key="index" class="detail">
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
                    <view class="iconfont ml-1" style="font-size: 45rpx; color: #dd524d;">&#xe8ad</view>
                    <span class="comment-likeCount">{{item.likeCount}}</span>
                </view>
            </view>
        </view>
        <view style="width: 100%;height: 100rpx;"></view>
        <view class="footer">
            <input class="input-form" v-model="inputValue" maxlength="200" placeholder="最多输入200评论" @input="onInput(inputValue)"/>
            <image class="avatar round sm" :src="comModel.avatar" alt=""></image>
            <button class="input-button" form-type="submit" @click="saveComment(inputValue)">发送</button>
        </view>
    </view>
</template>

<script>
    import configService from '@/common/service/config.service.js'

    export default {
        name: "helpCompanyDetailForm",
        components: {},
        props: {

        },
        data() {
            return {
                companyName: '',
                NavBarColor: this.NavBarColor,
                backRouteName: 'index',
                url: {
                    findHelpComByIdUrl: "/company/findHelpComById", //根据助力公司的tianyanchaId拿到详情
                    likeComUrl: "/company/upLike", //向上点赞公司
                    upDislikeComUrl: "/company/upDislike", //取消向上点赞公司
                    downLikeComUrl: "/company/downLike", //向下点赞公司
                    downDislikeComUrl: "/company/downDislike", //取消向下点赞公司
                    findPageCommentByIdUrl: "/company/comments/list", //根据助力公司的id拿到所有评论
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
            //根据 tianyanchaId 查询详情
            findHelpComById(tianyanchaId) {
                //console.log("进来了查询详情方法", tianyanchaId)
                this.$http.get(this.url.findHelpComByIdUrl, {
                    params: {
                        id: Number(tianyanchaId),
                    }
                }).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据9999", res);
                        this.comModel = res.data.result;
                        this.comModel.avatar = this.fileUrl + res.data.result.avatar
                    }
                })
            },
            //获取评论列表
            findPageCommentById(id) {
                //console.log("进来了获取评论列表方法", id)
                this.$http.get(this.url.findPageCommentByIdUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        id: Number(id),
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("res.data.result:",res.data.result);
                        //console.log("数据条数:",res.data.result);
                        this.commentsList = res.data.result.items;
                        for (let d of this.commentsList) {
                            d.avatar = this.fileUrl + d.avatar
                        }
                        //console.log("数据条数222:",this.inforCommentsList.length);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
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
            //保存评论 这里有两种评论、一种是对动态 一种是对评论
            saveComment(inputValue) {
                //console.log("inputValue:",inputValue);
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
                            //console.log("33333res:",res.data.result);
                            //回显最新评论数
                            this.comModel.commentCount = res.data.result
                            //console.log("保存了评论、重新调用评论列表方法11:",this.comModel.id);
                            //console.log("保存了评论、重新调用评论列表方法22:",this.model.tianyanchaId);
                            //刷新评论列表
                            //this.findPageCommentById(this.comModel.id);
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
                    }
                })
            },
            //点赞评论
            likeComment(id) {
                console.log("进来了点赞评论方法", id)
                this.$http.get(this.url.likeCommentUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        //this.myCommentForm.likeCount = res.data.result;
                    }
                })
            },
            //取消点赞评论
            dislikeComment(id) {
                console.log("进来了取消点赞评论方法", id)
                this.$http.get(this.url.dislikeCommentUrl, {params: {id: id}}).then((res) => {
                    if (res.data.success) {
                        console.log("表单数据", res);
                        //this.myCommentForm.likeCount = res.data.result;
                    }
                })
            },
        }
    }
</script>

<style>

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


</style>
