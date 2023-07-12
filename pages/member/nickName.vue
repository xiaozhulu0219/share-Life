<template>
    <!--个人页的一些页面--昵称修改页-->
    <view>
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <view slot="backText">返回</view>
            <view slot="content">编辑昵称</view>
            <view slot="right" @click="onSubmit">保存</view>
        </cu-custom>
        <form>
            <view class="title text-grey " style="font-size:120%; height: 40px;padding: 10px;padding-left: 25px;">
                七天内可修改一次名字
            </view>
            <view class="cu-form-group" style="border-radius: 10px;width: 95%;margin: 0 auto;">
                <input placeholder="请输入昵称" name="input" v-model="myFormData.nickName" :maxlength="maxLength" @input="onInput(myFormData.nickName)"/>
                <view class="count-limit"> {{ (myFormData.nickName && myFormData.nickName.length) || 0 }} / {{ maxLength }}</view>
            </view>
            <view class="title text-grey "
                  style="font-size:30%;width: 300px; height: 40px;padding: 10px;padding-left:25px; ">请输入2-24个字符，不包括@<> /等无效字符哦
            </view>
        </form>
    </view>
</template>

<script>
    import { keyWords } from '../../common/util/constants';
    export default {
        data() {
            return {
                index: -1,
                maxLength: 12,
                myFormData: {
                    nickName: '',
                    id: ''
                }
            };
        },
        onLoad: function(option) {
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
                    this.myFormData.nickName = value;
                });
                console.log('置换后value:', value);
            },
            onSubmit() {
                const myForm = this.myFormData;
                if (this.myFormData.nickName === '' || this.myFormData.nickName.indexOf('*') != -1) {
                    console.log('昵称出现了违规词语、已被拦截：', this.myFormData.nickName);
                } else {
                console.log('myForm', myForm);
                this.$tip.loading();
                this.$http.get('/sys/editNickName', {
                    params: {
                        id: this.$store.getters.userid,
                        nickName: myForm.nickName
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

    .count-limit {
      font-size: 14rpx;
      color: #666;
    }

</style>
