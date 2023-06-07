<template>
    <!--这个是首页点击动态后跳转的动态详情页-->
    <view>
        <cu-custom :bgColor="NavBarColor" isBack="t" :backRouterName="backRouteName">
            <block slot="backText">
            </block>
            <block slot="content">动态详情</block>
        </cu-custom>
        <view class="search padding">
            <view class="iptbox">
                <img class="medias_size" :src="fileUrl+myFormData.medias" alt="">
                {{myFormData.textContent}}
            </view>
        </view>
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
                    findPublishInforByIdUrl:'/information/movements/findPublishInforById',
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
                publishId:"",
                myFormData: {
                    	latitude:'',
                    	longitude:'',
                    	location:'',
                        medias:'',
                        textContent:'',
                        uuId:'',
                },
                fileUrl: configService.fileSaveURL ,
            }
        },
        created() {
            //this.initFormData();
            //this.findPublishInfor();
        },
        onLoad(option) {
            const pubId = JSON.parse(decodeURIComponent(option.item));
            this.publishId = pubId
            console.log("pubId",pubId)
            console.log("this.publishId",this.publishId)
            this.findPublishInfor(this.publishId);
        },
        methods: {
            findPublishInfor(publishId) {
                console.log("进来了方法",publishId)
                    this.$http.get(this.url.findPublishInforByIdUrl, {params: {id: publishId}}).then((res) => {
                        if (res.data.success) {
                            console.log("表单数据", res);
                            this.myFormData = res.data.result;
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>

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

    .location {
        display: flex;
        border-radius: 5px;
        font-size: 18px;
        margin: 5px;
        justify-content: flex-start;
        align-items: center;
    }
</style>
