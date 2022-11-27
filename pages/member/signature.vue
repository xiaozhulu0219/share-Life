<template>
    <view>
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">编辑简介</block>
        </cu-custom>
        <form>
            <view class="title text-grey " style="font-size:120%; height: 40px;padding: 10px;padding-left: 30px; ">七天内可修改三次简介</view>

            <view class="cu-form-group textarea" >
                <textarea placeholder="个性签名" style="width: 18px; height: 200px; " name="input" v-model="myFormData.signature" ></textarea>
            </view>

            <view class="padding flex flex-direction">
                <button class="cu-btn bg-blue lg" @click="onSubmit">提交</button>
            </view>
        </form>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                index: -1,
                switchC: true,
                imgList: [],
                uploadUrl: "/sys/common/upload",
                myFormData: {
                    signature: '',
                    sex: 1,
                    orgCode: '',
                    workNo: '',
                    id: '',
                },
            };
        },
        onLoad: function (option) {
            console.log("this.$Route.query", this.$Route.query);
            let query = this.$Route.query
            if (query) {
                this.myFormData = query;
                Object.keys(this.myFormData).map(key => {
                    if (this.myFormData[key] == '无') {
                        this.myFormData[key] = ''
                    }
                })
                console.log("this.myFormData", this.myFormData)
            }
        },
        methods: {
            onSubmit() {
                let myForm = this.myFormData
                console.log("myForm", myForm)
                this.myFormData.id = this.$store.getters.userid
                if (this.switchC) {
                    this.myFormData.sex = 1
                } else {
                    this.myFormData.sex = 2
                }
                console.log('myform', this.myFormData)
                this.$tip.loading();
                this.$http.put('/sys/user/appEdit', this.myFormData).then(res => {
                    console.log(res)
                    this.$tip.loaded();
                    if (res.data.success) {
                        this.$tip.toast('提交成功')
                        this.$Router.replace({name: 'memberdetail'})
                        /* uni.navigateTo({
                            url: '/pages/user/userdetail'
                        }) */
                    }
                }).catch(() => {
                    this.$tip.loaded();
                    this.$tip.error('提交失败')
                });
            },
            DateChange(e) {
                this.myFormData.birthday = e.detail.value
            },
            SwitchC(e) {
                this.switchC = e.detail.value
            },
            ChooseImage() {
                var that = this;
                uni.chooseImage({
                    count: 4, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: (res) => {
                        that.$http.upload(that.$config.apiUrl + that.uploadUrl, {
                            filePath: res.tempFilePaths[0],
                            name: 'file'
                        })
                            .then(res => {
                                that.myFormData.avatar = res.data.message;
                            })
                            .catch(err => {
                                that.$tip.error(err.data.message)
                            });
                        this.imgList = res.tempFilePaths
                    }
                });
            },
            ViewImage(e) {
                uni.previewImage({
                    urls: this.imgList,
                    current: e.currentTarget.dataset.url
                });
            },
            DelImg(e) {
                uni.showModal({
                    title: '召唤师',
                    content: '确定要删除这段回忆吗？',
                    cancelText: '再看看',
                    confirmText: '再见',
                    success: res => {
                        if (res.confirm) {
                            this.imgList.splice(e.currentTarget.dataset.index, 1)
                        }
                    }
                })
            }
        }
    }
</script>

<style>
    .cu-form-group .title {
        min-width: calc(4em + 15px);
		
    }
	.textarea{
		margin-top: 10px;
		border-radius: 20px;
		width: 90%;
		margin: 0 auto;
	}
</style>
