<template>
    <!--表单区域-->
    <view>
        <!--标题和返回-->
        <cu-custom :bgColor="NavBarColor" isBack :backRouterName="backRouteName">
            <block slot="backText">返回</block>
            <block slot="content">首页发布</block>
        </cu-custom>
        <!--表单区域-->
        <view>
            <form>
                <view class="cu-form-group">
                    <view class="flex align-center">

                        <input  placeholder="输入要助力的公司简称或者邮箱后缀" v-model="model.sysOrgCode" style="padding-right: 100px" />

                        <button class="cu-btn block bg-gray margin-tb-sm lg" @click="clear">
                            <text v-if="loading" class="cuIcon-loading2 cuIconfont-spin" style="padding-left: 500px"></text>取消
                        </button>

                    </view>
                </view>

            </form>
        </view>
    </view>
</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue'

    export default {
        name: "informationForm",
        components:{myDate},
        props:{
          formData:{
              type:Object,
              default:()=>{},
              required:false
          }
        },
        data(){
            return {
				CustomBar: this.CustomBar,
				NavBarColor: this.NavBarColor,
				loading:false,
                model: {},
                sysOrgCode: {},
                backRouteName:'index',
                url: {
                  queryById: "/member/queryById",
                  add: "/member/add",
                  edit: "/member/edit",
                  findPageByCompanyName: "/company/movements/findPageByCompanyName",  //助力新增页面模糊查询调用企查查
                },
            }
        },
        created(){
             this.initFormData();
        },
        methods:{
           initFormData(){
               if(this.formData){
                    let dataId = this.formData.dataId;
                    this.$http.get(this.url.queryById,{params:{id:dataId}}).then((res)=>{
                        if(res.data.success){
                            console.log("表单数据",res);
                            this.model = res.data.result;
                        }
                    })
                }
            },
            clear(){
                // 重置
                this.sysOrgCode = []
                this.model.sysOrgCode = []
                this.sysOrgCode = null
                this.queryParam = {}
                this.loadList(1)
            }
        }
    }
</script>
