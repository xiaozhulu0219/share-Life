<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <scroll-view scroll-y class="page">
            <view class="card">
                <cu-custom :bgColor="NavBarColor" isBack="t" :backRouterName="backRouteName">
                    <block slot="backText">
                    </block>
                    <block slot="content">动态详情</block>
                </cu-custom>
                <view class="search padding">
                    <view class="iptbox">
                        <img class="medias_size" :src="fileUrl+myFormData.medias" alt="">
                        <view class="card-text">{{myFormData.textContent}}</view>
                        <img class="icon" src="@/static/icon/zuobiao.png" mode="aspectFill">{{myFormData.ipAddress}}
                        <view class="card-title">{{myFormData.createDate}}</view>
                        <view class="card-title">{{myFormData.publishTime}}</view>
                    </view>
                </view>
            </view>
            <view class="">
                   <view class="card-title">
                        <img class="icon" src="@/static/icon/like.png" >{{myFormData.hasLiked}}
                        <img class="icon" src="@/static/icon/love.png" mode="aspectFill">{{myFormData.hasLoved}}
                        <img class="icon" src="@/static/icon/comment.png" mode="aspectFill">{{myFormData.commentCount}}
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

        .card-nickname {
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

        .card-icon {
            width: 36rpx;
            height: 36rpx;
            margin-right: 10rpx;
            margin-left: 120rpx;
        }
    }

    .icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 10rpx;
        margin-left: 120rpx;
    }


    .medias_size {
        max-width: 180px;
        width: 180px;
        width: expression(this.width > 180 ? "180px" : this.width);
        height: 180px;
        height: expression(this.height > 180 ? "180px" : this.height);
        overflow: hidden;
        /*text-align:center;*/
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
