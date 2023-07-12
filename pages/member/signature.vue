<template>
    <!--个人页的一些页面--简介修改页-->
    <view>
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <view slot="backText">返回</view>
            <view slot="content">编辑简介</view>
            <view slot="right" @click="onSubmit">保存</view>
        </cu-custom>
        <form>
            <view class="title text-grey " style="font-size:120%; height: 40px;padding: 10px;padding-left: 30px; ">
                七天内可修改三次简介
            </view>

            <view class="cu-form-group textarea">
				<textarea placeholder="个性签名" style="width: 18px; height: 200px; " name="input" :maxlength="maxLength"
                          v-model="myFormData.signature" @input="onInput(myFormData.signature)"></textarea>
                <view class="count-limit"> {{ (myFormData.signature && myFormData.signature.length) || 0 }} / {{ maxLength }}
                </view>
            </view>

        </form>
    </view>
</template>

<script>
    import {keyWords} from '../../common/util/constants';

    export default {
        data() {
            return {
                index: -1,
                maxLength: 60,
                myFormData: {
                    signature: '',
                    id: ''
                }
            };
        },
        onLoad: function (option) {
            console.log('this.$Route.query', this.$Route.query);
            const query = this.$Route.query;
            if (query) {
                this.myFormData = query;
                Object.keys(this.myFormData).map(key => {
                    if (this.myFormData[key] == '无') {
                        this.myFormData[key] = '';
                    }
                });
                console.log('this.myFormData', this.myFormData);
            }
        },
        methods: {
            onInput(value) {
                if (value !== null) {
                    for (const i in keyWords) {
                        const reg = new RegExp(keyWords[i], 'g');
                        value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
                    }
                }
                // 数据改变是异步的
                this.$nextTick(() => {
                    this.myFormData.signature = value;
                });
                console.log('置换后value:', value);
            },
            onSubmit() {
                const myForm = this.myFormData;
                console.log('myForm', myForm);
                this.myFormData.id = this.$store.getters.userid;
                this.myFormData.signature = this.myFormData.signature;
                if (this.myFormData.signature === '' || this.myFormData.signature.indexOf('*') != -1) {
                    console.log('签名出现了违规词语、已被拦截：', this.myFormData.signature);
                } else {
                    console.log('myform', this.myFormData);
                    this.$tip.loading();
                    this.$http.get('/sys/editSignature', {
                        params: {
                            id: this.$store.getters.userid,
                            signature: this.myFormData.signature
                        }
                    }).then(res => {
                        console.log(res);
                        this.$tip.loaded();
                        if (res.data.success) {
                            this.$tip.toast('提交成功');
                            this.$Router.replace({
                                name: 'memberdetail'
                            });
                            /* uni.navigateTo({
                                url: '/pages/user/userdetail'
                            }) */
                        }
                    }).catch(() => {
                        this.$tip.loaded();
                        this.$tip.error('提交失败');
                    });
                }
            },
        }
    };
</script>

<style>

    .cu-form-group .title {
        min-width: calc(4em + 15px);

    }

    .textarea {
        margin-top: 10px;
        border-radius: 20px;
        width: 90%;
        margin: 0 auto;
        position: relative;
    }

    .count-limit {
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        font-size: 14rpx;
        color: #666;
    }

</style>
