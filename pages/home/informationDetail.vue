<template>
    <!--这个是首页点击动态跳转的动态详情页-->
    <view>


    </view>
</template>

<script>
    import myDate from '@/components/my-componets/my-date.vue'
    import myImageUpload from '@/components/my-componets/my-image-upload.vue'

    export default {
        name: "informationDetail",
        components: {myDate, myImageUpload},
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
                model: {},
                sysOrgCode: {},
                backRouteName: 'index',
                url: {
                    //submitUrl:'/information/movements/savePublish',
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
                myFormData: {
                    	latitude:'123.564646',
                    	longitude:'34.256356',
                    	location:'北京',
                        medias:'',
                        textContent:'',
                        uuId:'',
                        ipAddress,
                },
            }
        },
        created() {
            this.initFormData();
            this.shijiao();
        },
        methods: {
            initFormData() {
                if (this.formData) {
                    let dataId = this.formData.dataId;
                    this.$http.get(this.url.queryById, {params: {id: dataId}}).then((res) => {
                        if (res.data.success) {
                            console.log("表单数据", res);
                            this.model = res.data.result;
                        }
                    })
                }
            },

            //失焦
            shijiao() {
                if (this.text == '') {
                    uni.createSelectorQuery().select('.default_text').boundingClientRect(() => {
                        this.vBlock = "block"
                    })
                } else {
                    this.vBlock = "none"
                }
            },
            //聚焦
            jujiao() {
                const that = this
                if (this.text != '') {
                    uni.createSelectorQuery().select('.default_text').boundingClientRect(() => {
                        that.vBlock = "none"
                    })

                }
            },
            //投票
            vote() {
                console.log("投票")
                this.toupiao = true;
                this.voteBc = "gray";
            },
            //关闭投票
            closeVote() {
                console.log("关闭投票")
                this.toupiao = false;
                this.voteBc = "white";
            },
            //添加观点
            addIdea() {
                // var newIdea={id:this.voteList.length,content:''}
                this.voteList.push({"id": this.voteList.length + 1, "content": ''});
            },
            clear() {
                // 重置
                this.sysOrgCode = []
                this.model.sysOrgCode = []
                this.sysOrgCode = null
                this.queryParam = {}
                this.loadList(1)
            },
			submit(){
                console.log('medias2', this.myFormData.medias)
				this.$http.post(this.url.submitUrl, this.myFormData,{
				}).then(res => {
                    console.log('myFormData', this.myFormData)
                    console.log('res',res);
					if (res.data.success) {
						console.log('发布成功');
						console.log('res.data',res.data);
                        uni.showToast({
                            title: '发布成功',
                            complete() {
                                setTimeout(() => {
                                    uni.redirectTo({
                                        url: '/pages/home/home'
                                    });
                                }, 1500);
                            }
                        });
					}
				})
			}
        }
    }
</script>
<style lang="scss" scoped>
    .middle {
        display: flex;
        align-items: center;
    }

    .huati {
        display: flex;
        border-radius: 5px;
        font-size: 18px;
        margin: 5px;
        padding: 5px;
        justify-content: center;
        align-items: center;
    }

    .huati p:nth-child(1) {
        margin-top: 2px;
        margin-right: 5px;
    }

    .location {
        display: flex;
        border-radius: 5px;
        font-size: 18px;
        margin: 5px;
        justify-content: flex-start;
        align-items: center;
    }

    .main {
        position: absolute;
        width: 100%;
        height: calc(100% - 45px);
        display: flex;
        flex-direction: column;

        .main_content {
            height: 70%;
        }

        .default_text {
            position: absolute;
            top: 0;
            left: 10px;
        }

        .bottom_bar {
            height: 30%;
        }
    }

    /* 图标大小 */
    .lg {
        width: 30px;
        height: 30px;
        font-size: 24px;
        line-height: 30px;
    }

    .vote_window {
        background-color: white;
        width: 100%;
        height: 500px;
        position: absolute;
        bottom: 0;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;

        .vote_top_bar {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #e0e2e3;
            display: flex;

            p {
                font-size: 16px;
                width: 60px;
                display: block;
                margin: auto;
            }

            .vote_close {
                font-size: 18px;
                justify-content: flex-end;
                width: 40px;
            }
        }

        .vote_content {
            margin: 10px;

            .cuIcon-mark {
                font-size: 20px;
                color: black;
            }

            input {
                border-bottom: 1px solid #e0e2e3;
                height: 40px;
            }

            input:nth-child(1) {
                font-size: 20px;
                margin: 10px;
                float: center;
            }

            .idea_list {
                display: flex;
                align-items: center;
                height: 80px;
                padding: 5px;

                p {
                    font-size: 12px;
                    color: black;
                    background-color: #e0e2e3;
                    padding: 3px 10px;
                    border-radius: 3px;
                }

                input {
                    width: 80%;
                    margin-left: 10px;
                    font-size: 14px;
                }
            }

            .add {
                display: flex;
                align-items: center;
                margin-left: 8px;
                font-size: 16px;

                .cuIcon-roundadd {
                    font-size: 16px;
                    color: black;
                }

                p {
                    margin-left: 10px;
                }
            }

        }
    }
</style>
