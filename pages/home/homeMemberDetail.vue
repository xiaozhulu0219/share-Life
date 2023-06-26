<template>
    <!--点击用户头像跳转的用户页（区别于用户自己看自己的个人页）-->
    <view>
        <scroll-view scroll-y class="page">
            <cu-custom style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
                <block slot="backText"></block>
            </cu-custom>
            <view class="UCenter-bg">
                <block slot="backText"></block>

                <view class="padding">
                    <view class="margin-bottom-xl flex personInfo">
                        <image class="png_avatar round" :src="fileUrl+personalList.avatar" alt=""></image>
                        <view class="margin-left-xl flex flex-sub flex-direction justify-around">
                            <text class="text-bold">{{personalList.nickName}}</text>
                            <text :class="[{'cuIcon-male text-blue': personalList.sex === 1},{'cuIcon-female text-pink': personalList.sex === 2}]"></text>
                        </view>
                    </view>
                    <text class="flex flex-sub flex-direction signature">{{personalList.signature}}</text>
                    <view class="flex justify-between align-center personData">
                        <view class="flex text-sm">
                            <view class="flex flex-direction align-center margin-right-xl" @click="toFocus(personalList.uuId)">
                                <text>12</text>
                                <text
                                        :style="{color:'#ddd'}">关注
                                </text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl" @click="toFans(personalList.uuId)">
                                <text>16</text>
                                <text
                                        :style="{color:'#ddd'}">粉丝
                                </text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl" @click="tomemberLikeCountModal()">
                                <text>85</text>
                                <text
                                        :style="{color:'#ddd'}">获赞与收藏
                                </text>
                            </view>
                            <view class="flex flex-direction align-center margin-right-xl">
                                <text>2</text>
                                <text
                                        :style="{color:'#ddd'}">助力
                                </text>
                            </view>
                        </view>
                        <view>
                            <button class="edit text-sm" @click="focusUser(personalList.uuId)" v-if="iffocus == 0">
                                关注
                            </button>
                            <button class="edit text-sm" @click="unFocusUser(personalList.uuId)" v-else-if="iffocus == 1">
                                取消关注
                            </button>
                            <button class="edit text-sm" @click="focusUser(personalList.uuId)" v-else-if="iffocus == 2">
                                回关
                            </button>
                            <button class="edit text-sm" @click="unFocusUser(personalList.uuId)" v-else="iffocus == 3">
                                互相关注
                            </button>
                        </view>
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
                <swiper :current="activeTab" class="padding" style="height: 100%;">
                    <swiper-item v-for="(item,index) in tabs" :key="index">

                        <view v-for="(ite,inde) in focusOrFansPublishInforList" :key="inde" class="card-PublishInfor" v-if="index === 0" @click="toMemInformationDetail(ite)">
                            <image class="medias_size" :src="ite.medias[0]" mode="widthFix" alt=""></image>
                            <view>{{ ite.textContent.substr(0, 35) }}</view>
                        </view>
<!--                        <MemberPublishListModal v-if="index === 0"/>-->

<!--                        <MemberHelpCompanyListModal v-if="index === 1"/>-->
                        <view v-for="(ite,inde) in focusOrFansHelpList" :key="inde" class="card-Help" v-if="index === 1">
                            <view class="card-location">{{ite.commentCreateDate}}</view>
                            <view class="card-title">{{ite.companyName}}</view>
                            <view class="card-text">{{ite.content}}</view>
                        </view>
                        <view v-if="index !== 0 && index !== 1" class="swiper-item">{{item.name}}</view>

                    </swiper-item>
                </swiper>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import api from '@/api/api';
    import configService from '@/common/service/config.service.js'

    export default {
        name: 'homeMemberDetail',
        components: {

        },
        data() {
            return {
                iffocus: '',//0未关注对方、 1、我的关注、2、我的粉丝、3、互相关注
                activeTab: 0,
                tabs: [{
                    id: 1,
                    name: '动态'
                }, {
                    id: 2,
                    name: '助力'
                }],
                personalList: {
                    avatar: '',
                    realname: '',
                    username: '',
                    nickName: '',
                    post: '',
                    signature: ''
                },
                userUrl: '/sys/user/queryById',
                queryByUuIdUrl: '/sys/user/queryByUuId',
                findFocusOrFansPublishInforPageUrl: '/information/movements/findFocusOrFansPublishInforPage',
                findFocusOrFansPublishComPageUrl: '/company/findFocusOrFansPublishComPage',//用户信息页公开可见助力返回列表
                userFocusUrl: '/information/followuser/userFocus',
                userUnFocusUrl: '/information/followuser/userUnFocus',
                FocusORFansUrl: '/information/followuser/FocusORFans',
                userId: '',
                uuId: '',
                id: '',
                fileUrl: configService.fileSaveURL,
                backRouteName: 'index',
                focusOrFansPublishInforList: [],
                focusOrFansHelpList: [],

            };
        },
        watch: {
            cur: {
                immediate: true,
                handler() {
                    console.log('watch2222', this.$store.getters);
                    this.userId = this.$store.getters.userid;
                    this.uuId = this.$store.getters.uuId;

                   // this.initFocusORFans();
                }
            }
        },
        created() {
            //this.initFormData();
            //this.findPersonInfor(this.myFormData.inforId);
            //this.findPublishInfor(this.myFormData.inforId);
            //this.getFocusORFans(item); //判断两个用户的关注关系
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            //this.myFormData = item
            console.log("个人页拿到了uuid准备大干一番", item)
            this.findPersonInfor(item); //这是传参后继续调用方法的示例
            this.getFocusOrFansPublishInforList(item); //获取动态列表
            this.getFocusOrFansHelpCompanyList(item); //获取助力列表
            this.getFocusORFans(item); //判断两个用户的关注关系

        },
        methods: {
            scan() {
                console.log('进来了');
                // #ifndef H5
                uni.scanCode({
                    success: function (res) {
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
            //根据uuId查询详情
            findPersonInfor(uuId) {
                console.log("进来了方法", uuId)
                this.$http.get(this.queryByUuIdUrl, {params: {uuId: uuId}}).then((res) => {
                    if (res.data.success) {
                        this.personalList = res.data.result;
                        //console.log("this.personalList.avatar", this.personalList.avatar);
                        //console.log("res.data.result.avatar", res.data.result.avatar);
                        console.log("查询个人信息返回的数据是：", res.data.result);
                        if (res.data.result.avatar === "") {
                            console.log("头像不存在")
                        } else {
                            console.log("有头像", res.data.result.avatar)
                        }
                    }
                })
            },
            //获取用户公开的动态列表
            getFocusOrFansPublishInforList(item) {
                this.$http.get(this.findFocusOrFansPublishInforPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        uuId:item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //console.log("res.data.result:",res.data.result);
                        //console.log("数据条数:",res.data.result.items.length);
                        this.focusOrFansPublishInforList = res.data.result.items;
                        for (let d of this.focusOrFansPublishInforList) {
                            let arr = d.medias.split(',')
                            let arr2 = []
                            for (let e of arr) {
                                e = this.fileUrl+e
                                arr2.push(e)
                            }
                            d.medias = arr2
                        }
                        //console.log("数据条数222:",this.myPublishInforList.length);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //获取用户助力列表
            getFocusOrFansHelpCompanyList(item) {
                this.$http.get(this.findFocusOrFansPublishComPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        uuId:item
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log(res.data.result);
                        this.focusOrFansHelpList = res.data.result.items;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //获取用户"关注"modal
            toFocus(uuID) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/member/focusModal?item=' + uuID
                })
            },
            //获取用户"粉丝"modal
            toFans(uuID) {
                //console.log("进来了666", myFormData)
                uni.navigateTo({
                    url: '/pages/member/fansModal?item=' + uuID
                })
            },
            //点击关注按钮、关注用户
            focusUser(item) {
                console.log("点击了关注方法：",item);
                this.$http.get(this.userFocusUrl, {
                    params: {
                        uuId:item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = false;
                        console.log("关注方法返回的提示信息为：",res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        this.getFocusORFans(item);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击取消关注按钮、不再关注用户
            unFocusUser(item) {
                console.log("点击了取消关注方法：",item);
                this.$http.get(this.userUnFocusUrl, {
                    params: {
                        uuId:item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = true;
                        console.log("取消关注方法返回的提示信息为：",res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        this.getFocusORFans(item);

                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //判断两个用户的关注关系
            getFocusORFans(uuId) {
                console.log("进来了方法", uuId)
                this.$http.get(this.FocusORFansUrl, {params: {uuId: uuId}}).then((res) => {
                    if (res.data.success) {
                        console.log("两个用户的关注关系是：", res.data.result);
                        this.iffocus=res.data.result;
                        //this.personalList = res.data.result;
                        //console.log("this.personalList.avatar", this.personalList.avatar);
                        //console.log("res.data.result.avatar", res.data.result.avatar);
                        //console.log("查询个人信息返回的数据是：", res.data.result);
                        // if (res.data.result.avatar === "") {
                        //     console.log("头像不存在")
                        // } else {
                        //     console.log("有头像", res.data.result.avatar)
                        // }
                    }
                })
            },
            // load() {
            //     if (!this.userId) {
            //         return;
            //     }
            //     this.$http.get(this.userUrl, {
            //         params: {
            //             id: this.userId
            //         }
            //     }).then(res => {
            //         console.log("this.userId：", this.userId);
            //         if (res.data.success) {
            //             //const {avatar: originalAvatar, departIds, post} = res.data.result;
            //             this.personalList = res.data.result;
            //             //console.log("this.personalList.avatar", this.personalList.avatar);
            //             //console.log("res.data.result.avatar", res.data.result.avatar);
            //             console.log("查询个人信息返回的数据是：", res.data.result);
            //             if (res.data.result.avatar === "") {
            //                 console.log("头像不存在")
            //             } else {
            //                 console.log("有头像", res.data.result.avatar)
            //             }
            //         }
            //     }).catch(err => {
            //         console.log(err);
            //     });
            // },
            clickTab(index) {
                if (this.activeTab === index) return;
                this.activeTab = index;
            },
            tomemberLikeCountModal() {
                console.log("点击了跳转modal");
                uni.navigateTo({
                    url: './memberLikeCountModal'
                })

            }

        }
    };
</script>

<style>
    .UCenter-bg {
        background-color: rgba(0, 0, 0, .5);
        height: 500rpx;
        overflow: hidden;
        color: #fff;

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
        margin-top: 50rpx;
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
        max-width: 120px;
        width: 120px;
        width: expression(this.width > 120 ? "120px" : this.width);
        height: 120px;
        height: expression(this.height > 120 ? "120px" : this.height);
    }

    .card-PublishInfor {
        background-color: $uni-bg-color-grey;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;

        .card-title {
            font-weight: bold;
        }

        .card-text {
            font-size: 20rpx;
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }
    }

    .medias_size {
        max-width: 180px;
        width: 180px;
        width:expression(this.width > 180 ? "180px" : this.width);
        height: 180px;
        height:expression(this.height > 180 ? "180px" : this.height);
        overflow:hidden;
        /*text-align:center;*/
        /*width: 21rpx;*/
        /*height: 21rpx;*/
        /*border-radius: 8rpx;*/
    }

    .card-Help {
        background-color: $uni-bg-color-grey;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;

        .card-title {
            font-weight: bold;
        }

        .card-text {
            font-size: 20rpx;
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }
    }
</style>

