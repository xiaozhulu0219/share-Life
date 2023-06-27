<template>
    <!--个人页的一些页面--（我的助力)分页查询-->
    <scroll-view scroll-y class="page">
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">我的关注</block>
        </cu-custom>
        <mescroll-body ref="mescrollRef" bottom="88" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallback">
            <view v-for="item in myFocusList" :key="index" class="card">
                <image class="fans-avatar round sm" :src="fileUrl+item.avatar" alt="" @click="toMemberdetail(item.uuId)"></image>
                <view class="card-info">
                    <view class="card-nickname">{{item.nickname}}</view>
                    <view class="card-signature">{{item.signature}}</view>
                    <view class="card-createDate">{{item.createDate}}</view>
                    <button class="edit text-sm" @click="focusUser(item.uuId)" v-if="item.cover == 0">
                        关注
                    </button>
                    <button class="edit text-sm" @click="unFocusUser(item.uuId)" v-else-if="item.cover == 1">
                        取消关注
                    </button>
                    <button class="edit text-sm" @click="focusUser(item.uuId)" v-else-if="item.cover == 2">
                        回关
                    </button>
                    <button class="edit text-sm" @click="unFocusUser(item.uuId)" v-else-if="item.cover == 3">
                        互相关注
                    </button>
                </view>
            </view>
        </mescroll-body>
    </scroll-view>
</template>

<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import Mixin from "@/common/mixin/Mixin.js";
    import configService from '@/common/service/config.service.js'

    export default {
        name: 'focusModal',
        mixins: [MescrollMixin, Mixin],
        data() {
            return {
                findMyFocusPageUrl: '/information/followuser/findMyFocusPage',
                userFocusUrl: '/information/followuser/userFocus',
                userUnFocusUrl: '/information/followuser/userUnFocus',
                FocusORFansUrl: '/information/followuser/FocusORFans',
                myFocusList: [],
                iffocus: '',//0未关注对方、 1、我的关注、2、我的粉丝、3、互相关注 4、就是当前用户
                fileUrl: configService.fileSaveURL,
                uuId:'',
                upOption: {
                    auto: false, // 不自动加载
                    page: {
                        num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                        size: 6 // 每页数据的数量
                    },
                    // noMoreSize: 6, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        tip: '~ 空空如也 ~', // 提示
                        btnText: '去看看'
                    }
                },
            };
        },
        created() {
            this.getMyFocusList();
            //this.getFocusORFans(); //判断两个用户的关注关系
        },
        onLoad(option) {
            const item = JSON.parse(decodeURIComponent(option.item));
            this.uuId = item;
            console.log("关注页加载时拿到的uuid：", item)
            console.log("this.uuId：", this.uuId)
            //这里进来的 uuid 是当前登录用户的 因为是根据当前登录用户的信息查的关注列表
           // this.getFocusORFans(item); //判断两个用户的关注关系
        },
        methods: {
            getMyFocusList() {
                this.$http.get(this.findMyFocusPageUrl, {
                    params: {
                        page: 1,
                        pagesize: 20,
                        uuId: this.uuId
                    }
                }).then(res => {
                    if (res.data.success) {
                        console.log(res.data.result);
                        this.myFocusList = res.data.result.items;
                        //循环调用 getFocusORFans 判断两者之间的关系  然后将值赋给 cover 字段 然后根据循环列表 根据cover的值显示按钮
                        for (let d of this.myFocusList) {
                            this.$http.get(this.FocusORFansUrl, {params: {uuId: d.uuId}}).then((res) => {
                                if (res.data.success) {
                                    //console.log("两个用户的关注关系是：", res.data.result);
                                    d.cover = res.data.result;
                                    console.log("两个用户的关注关系是：", d.cover);
                                }
                            })
                        }

                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击头像跳转用户详情
            toMemberdetail(myFormData) {
                console.log("从关注页点击头像带进来了uuid为：", myFormData)
                uni.navigateTo({
                    url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                })
            },
            //判断两个用户的关注关系
            // getFocusORFans() {
            //     //从这里拿到列表的 关注列表的uuid
            //
            //     console.log("进来了判断两个用户的关注关系de方法", uuId)
            //     this.$http.get(this.FocusORFansUrl, {params: {uuId: uuId}}).then((res) => {
            //         if (res.data.success) {
            //             //console.log("两个用户的关注关系是：", res.data.result);
            //             this.iffocus = res.data.result;
            //
            //             //初始化判断这个页面是不是自己的  是自己的就把“关注”按钮去掉
            //             // if (this.uuId === uuId) {
            //             //     this.iffocus = "4"
            //             // }
            //             console.log("两个用户的关注关系是：", this.iffocus);
            //         }
            //     })
            // },
            //点击关注按钮、关注用户
            focusUser(item) {
                console.log("点击了关注方法：", item);
                this.$http.get(this.userFocusUrl, {
                    params: {
                        uuId: item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = false;
                        console.log("关注方法返回的提示信息为：", res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        //this.getFocusORFans(item);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            //点击取消关注按钮、不再关注用户
            unFocusUser(item) {
                console.log("点击了取消关注方法：", item);
                this.$http.get(this.userUnFocusUrl, {
                    params: {
                        uuId: item
                    }
                }).then(res => {
                    if (res.data.success) {
                        //关注成功后将 iffocus 置为 true 然后页面根据  iffocus 属性改变按钮的显示
                        //this.iffocus = true;
                        console.log("取消关注方法返回的提示信息为：", res.data.result);
                        //重新调用接口判断两个用户之间的关系
                        //this.getFocusORFans(item);
                        //重新调用列表方法、刷新列表
                        this.getMyFocusList();

                    }
                }).catch(err => {
                    console.log(err);
                });
            },
        }
    }
</script>

<style lang='scss'>
    .card {
        padding: 30rpx;
        border-bottom: #eee solid 1rpx;
        background-color: $uni-bg-color-grey;
        //padding: 20rpx 20rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        display: flex;
    }

    .card-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 150rpx;
    }

    .card-createDate {
        //font-weight: bold;
        font-size: 20rpx;
        //right: 20rpx;
        //margin-left: 550rpx;
    }

    .card-nickname {
        font-weight: bold;
        //position: absolute;
        //right: 20rpx;
        font-size: 35rpx;
        //margin-left: 100rpx;
    }
    .card-signature {
        //font-weight: bold;
        //position: absolute;
        //right: 20rpx;
        font-size: 28rpx;
        //margin-left: 100rpx;
    }
    .fans-avatar {
        max-width: 50px;
        width: 50px;
        width: expression(this.width > 50 ? "50px" : this.width);
        height: 50px;
        height: expression(this.height > 50 ? "50px" : this.height);
        position: absolute;
        font-size: 20rpx;
        //margin-top: 5rpx;
        //margin-right: 10rpx;
        margin-left: 20rpx;
    }


</style>
