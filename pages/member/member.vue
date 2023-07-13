<template>
    <!--个人页的一些页面--个人页主页-->
    <view>
        <scroll-view scroll-y class="page">
            <!-- 头部logo-->
            <view class="UCenter-bg">
                <view class="padding text-right text-xl text-exit">
                    <view class="iconfont ml-1 search-icon" style="; margin-top: 250rpx"   @click="toSetting()">&#xe8b8</view>

                </view>
                <view class="padding">
                    <view class="margin-bottom-xl flex personInfo">
                        <!--<image src="https://static.jeecg.com/upload/test/login4_1595818039175.png" class="png round" mode="aspectFit"></image>-->
                        <!-- <img src="../../static/avatar_boy.png" mode="" @click="updateHeadPic" class="png round"></img>-->

                        <image class="png_avatar round" :src="fileUrl+personalList.avatar" alt=""></image>
                        <!-- <image src="https://static.jeecg.com/upload/test/wave_1595818053612.gif" mode="scaleToFill" class="gif-wave"></image> -->
                        <view class="margin-left-xl flex flex-sub flex-direction justify-around">
                            <text class="text-bold">{{personalList.nickName}}</text>
                            <text :class="[{'cuIcon-male text-blue': personalList.sex === 1},{'cuIcon-female text-pink': personalList.sex === 2}]"></text>
                        </view>
                    </view>
                    <text class="flex flex-sub flex-direction signature">{{personalList.signature}}</text>
                    <view class="flex justify-between align-center personData">
                        <view class="flex text-sm">
                            <view class="flex flex-direction align-center margin-right-xl" @click="toFocus(personalList.uuId)">
                                <text>{{FocusFansNumVo.focusCount}}</text>
                                <text :style="{color:'#ddd'}">关注</text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl" @click="toFans(personalList.uuId)">
                                <text>{{FocusFansNumVo.fansCount}}</text>
                                <text :style="{color:'#ddd'}">粉丝</text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl" @click="tomemberLikeCountModal(FocusFansNumVo)">
                                <text>{{FocusFansNumVo.loveCollectCount}}</text>
                                <text :style="{color:'#ddd'}">获赞与收藏</text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl" @click="toHelpCom(personalList.uuId)">
                                <text>{{HelpCompanyNumVo.helpComCount}}</text>
                                <text :style="{color:'#ddd'}">助力</text>
                            </view>
                        </view>
<!--                        <navigator url="/pages/member/memberdetail">-->
<!--                            <view class="edit text-sm">-->
<!--                                编辑资料-->
<!--                            </view>-->
<!--                        </navigator>-->
                    </view>
                </view>
            </view>

            <!-- <view class="cu-tabbar-height"></view> -->
            <view class="mine-tab">
                <view class="tab-title flex justify-center">
                    <view class="padding-sm" v-for="(item,index) in tabs" :key="index" @tap="clickTab(index)">
                        <text :class="activeTab === index ? 'active' : ''">{{item.name}}</text>
                    </view>
                </view>
<!--                <swiper :current="activeTab" class="padding" style="height: 100%;" circular @change="changeSwiper">-->
                <swiper :current="activeTab" class="padding" style="height: 100%;"  @change="changeSwiper">
                    <swiper-item v-for="(item,index) in tabs" :key="index">
                        <MyHelpCompanyList v-if="index === 0"/>
                        <MyPublishList v-if="index === 1"/>
                        <MyCollectList v-if="index === 2"/>
                        <MyLoveInforList v-if="index === 3"/>
                        <view v-if="index !== 0 && index !== 1 && index !== 3" class="swiper-item">收藏列表功能暂时还未开发</view>
                    </swiper-item>
                </swiper>
            </view>
        </scroll-view>
        <bottomTab PageCur="member"></bottomTab>
    </view>
</template>

<script>
    import api from '@/api/api';
    import MyPublishList from './memberPublishList';
    import MyHelpCompanyList from './memberHelpCompanyList';
    import MyCollectList from './memberCollectList';
    import MyLoveInforList from './memberLoveInforList';
    import configService from '@/common/service/config.service.js';
    import bottomTab from '../component/bottomTab.vue';

    export default {
        name: 'member',
        components: {
            MyPublishList,
            MyHelpCompanyList,
            MyCollectList,
            MyLoveInforList,
            bottomTab
        },
        data() {
            return {
                activeTab: 0,
                tabs: [{
                    id: 1,
                    name: '我的助力'
                } ,{
                    id: 2,
                    name: '我的动态'
                }, {
                    id: 3,
                    name: '收藏'
                }, {
                    id: 4,
                    name: '赞过'
                }],
                personalList: {
                    avatar: '',
                    realname: '',
                    username: '',
                    nickName: '',
                    post: '',
                    signature: '',
                    uuId: ''
                },
                FocusFansNumVo: {
                    focusCount: '',
                    fansCount: '',
                    loveCount: '',
                    collectCount: '',
                    loveCollectCount: ''
                },
                HelpCompanyNumVo: {
                    helpComCount: ''
                },
                userUrl: '/sys/user/queryById',
                queryfocusFansByUuIdUrl: '/inforcommon/queryfocusFansByUuId',
                queryHelpComNumByUuIdUrl: '/comcommon/queryHelpComNumByUuId',
                userId: '',
                id: '',
                fileUrl: configService.fileSaveURL
            };
        },
        watch: {
            cur: {
                immediate: true,
                handler() {
                    //console.log('watch', this.cur);
                    this.userId = this.$store.getters.userid;
                    this.uuId = this.$store.getters.uuId;
                    this.load();
                }
            }
        },
        created() {
            this.queryfocusFansByUuId();
            this.queryHelpComNumByUuId();
        },
        methods: {
          changeSwiper(e) {
            const curTab = e.detail.current;
            this.activeTab = curTab;
          },
            scan() {
                console.log('进来了');
                // #ifndef H5
                uni.scanCode({
                    success: function(res) {
                        console.log('条码res：' + res);
                        console.log('条码类型：' + res.scanType);
                        console.log('条码内容：' + res.result);
                    }
                });
                // #endif
                // #ifdef H5
                this.$tip.alert('暂不支持');
                // #endif
            },
            load() {
                if (!this.userId) {
                    return;
                }
                this.$http.get(this.userUrl, {
                    params: {
                        id: this.userId
                    }
                }).then(res => {
                    if (res.data.success) {
                        //const {avatar: originalAvatar, departIds, post} = res.data.result;
                        this.personalList = res.data.result;
                        console.log('this.personalList.avatar', this.personalList.avatar);
                        console.log('res.data.result.avatar', res.data.result.avatar);
                        if (res.data.result.avatar === '') {
                            console.log('头像不存在');
                        } else {
                            console.log('有头像', res.data.result.avatar);
                        }
                        //console.log("头像", res.data.result)
                        // const avatar = (originalAvatar && originalAvatar.length > 0)
                        //     ? api.getFileAccessHttpUrl(originalAvatar)
                        //     : '/static/avatar_boy.png';
                        //this.personalList.avatar = avatar;
                        //this.personalList.depart = departIds;
                        //this.getpost(post);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            clickTab(index) {
                if (this.activeTab === index) return;
                this.activeTab = index;
            },
            //点击"关注"
            toFocus(uuID) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/member/focusModal?item=' + uuID
                });
            },
            //点击"粉丝"
            toFans(uuID) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/member/fansModal?item=' + uuID
                });
            },
            //点击“获赞与收藏”
            tomemberLikeCountModal(item) {
                console.log('点击了跳转modal', item);
                uni.navigateTo({
                    url: '/pages/home/memberLikeCountModal?item=' + encodeURIComponent(JSON.stringify(item))
                });
            },
            //获取用户的粉丝和关注和获赞与收藏数量
            queryfocusFansByUuId() {
                const a = this.uuId;
                console.log('获取登录用户的粉丝和关注和获赞与收藏数量：', this.uuId);
                this.$http.get(this.queryfocusFansByUuIdUrl, { params: { uuId: a } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据2222', res);
                        this.FocusFansNumVo = res.data.result;
                    }
                });
            },
            //获取助力数量
            queryHelpComNumByUuId() {
                const a = this.uuId;
                console.log('获取登录用户助力数量：', this.uuId);
                this.$http.get(this.queryHelpComNumByUuIdUrl, { params: { uuId: a } }).then((res) => {
                    if (res.data.success) {
                        console.log('表单数据333', res);
                        this.HelpCompanyNumVo = res.data.result;
                    }
                });
            },
            toSetting() {
                console.log('跳转到设置页');
                uni.navigateTo({
                    url: '/pages/setting/setting'
                });
            }
        }
    };
</script>

<style>
    .UCenter-bg {
        /* #ifdef MP-WEIXIN */
        /* background-image: url('https://static.jeecg.com/upload/test/blue_1595818030310.png'); */
        /* #endif */
        /* #ifndef MP-WEIXIN */
        /* background-image: url('/static/blue.png'); */
        /* #endif */
        /* background-size: cover; */
        background-color: rgba(0, 0, 0, .5);
        height: 500rpx;
        /* display: flex; */
        /* justify-content: center; */
        /* padding-top: 40rpx; */
        overflow: hidden;
        /* position: relative; */
        /* flex-direction: column; */
        /* align-items: center; */
        color: #fff;
        /* font-weight: 300; */
        /* text-shadow: 0 0 3px rgba(0, 0, 0, 0.3); */
    }

    /* .UCenter-bg text {
        opacity: 0.8;
    } */

    .text-exit {
        margin-top: 30rpx;
        position: absolute;
        top: 10px;
        right: 0;
        bottom: 0;
    }

    .UCenter-bg .edit {
        padding: 10rpx 20rpx;
        border: 2rpx solid #fff;
        border-radius: 30rpx;
    }

    .UCenter-bg image {
        width: 160rpx;
        height: 160rpx;
    }

    .UCenter-bg .personInfo {
        /* background-color: aquamarine; */
        margin-top: 30rpx;
    }

    .UCenter-bg .signature {
        margin-top: -30rpx;
        width: 100%;
        height: 110rpx;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .UCenter-bg .personData {
        margin-top: 30rpx;
    }

    .UCenter-bg .gif-wave {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 99;
        mix-blend-mode: screen;
        height: 100rpx;
    }

    map,
    .mapBox {
        left: 0;
        z-index: 99;
        mix-blend-mode: screen;
        height: 100rpx;
    }

    map,
    .mapBox {
        width: 750rpx;
        height: 300rpx;
    }

    .mine-tab {
        position: relative;
        top: -50rpx;
        height: calc(100vh - 200rpx - env(safe-area-inset-bottom) / 2);
        background-color: #fff;
        border-radius: 30rpx 30rpx 0 0;
    }

    .tab-title {
        color: #888;
        border-bottom: 1px solid #eee;
    }

    .tab-title text.active {
        color: #000;
        font-weight: bold;
    }

    .png_avatar {
        max-width: 100px;
        width: 100px;
        width: expression(this.width > 100 ? "100px" : this.width);
        height: 100px;
        height: expression(this.height > 100 ? "100px" : this.height);
    }

</style>
