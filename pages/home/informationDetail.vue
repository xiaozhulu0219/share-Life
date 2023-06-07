<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <scroll-view scroll-y class="page">
            <view class="card">
                <cu-custom :bgColor="NavBarColor" style="height: 1rpx;" isBack="t" :backRouterName="backRouteName">
                    <block slot="backText">
                    </block>
                    <block slot="content">动态详情</block>
                </cu-custom>
                <view class="search padding">
                    <view class="iptbox">
                        <image  class="medias_size" :src="fileUrl+myFormData.medias" mode="widthFix"  alt=""></image>
                        <view class="card-text">{{myFormData.textContent}}</view>
                        <view class="card-time">
                            {{myFormData.publishTime}}
                            <img class="icon-ipAddress" src="@/static/icon/ipAddress.png" mode="aspectFill">
                            {{myFormData.ipAddress}}
                        </view>
<!--                        <view class="card-title">{{myFormData.publishTime}}</view>-->
<!--                        <view class="card-title">{{myFormData.createDate}}-->
                        </view>
                </view>
            </view>
            <view class="">
                   <view class="card-title">
                        <img class="icon-like" src="@/static/icon/like.png" >{{myFormData.hasLiked}}
                        <img class="icon-love" src="@/static/icon/love.png" mode="aspectFill">{{myFormData.hasLoved}}
                        <img class="icon-comment" src="@/static/icon/comment.png" mode="aspectFill">{{myFormData.commentCount}}
                   </view>
            </view>
        </scroll-view>
    </view>

</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue'
    import configService from '@/common/service/config.service.js'

    export default {
        name: "informationDetail",
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
                url: {
                    findPublishInforByIdUrl: '/information/movements/findPublishInforById',
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
                },
                fileUrl: configService.fileSaveURL,
            }
        },
        created() {
            //this.initFormData();
            //this.findPublishInfor();
        },
        onLoad(option) {
            const pubId = JSON.parse(decodeURIComponent(option.item));
            this.publishId = pubId
            //console.log("pubId", pubId)
            //console.log("this.publishId", this.publishId)
            this.findPublishInfor(this.publishId);
        },
        methods: {
            findPublishInfor(publishId) {
                //console.log("进来了方法", publishId)
                this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: publishId}}).then((res) => {
                    if (res.data.success) {
                        //console.log("表单数据", res);
                        this.myFormData = res.data.result;
                    }
                })
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
        text-align:center;
        display: block;
        margin: 0 auto;
        /*width: 21rpx;*/
        /*height: 21rpx;*/
        /*border-radius: 8rpx;*/
    }

    .location {
        display: flex;
        border-radius: 5px;
        font-size: 18px;
        margin: 5px;
        justify-content: flex-start;
        align-items: center;
    }
</style>
