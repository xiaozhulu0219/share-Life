<template>
    <view>
        <cu-custom bgColor="bg-gradual-pink" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">憧憬公司标签</block>
        </cu-custom>
        <!-- <form>
            <view class="cu-form-group">
                <view class="title">憧憬公司标签</view>
                <input placeholder="憧憬公司标签" name="input" v-model="myFormData.dreamCompanySign" disabled></input>
            </view>

            <view class="padding flex flex-direction">
                <button class="cu-btn bg-blue lg" @click="onSubmit">提交</button>
            </view>
        </form> -->
		<view class="content-box padding bg-white">
			<view class="">
				<view class="padding-bottom text-bold">
					已选择标签
				</view>
				<view class="margin-bottom flex flex-wrap" v-if="selectedList.length > 0">
					<text class="tag-item active" v-for="(item,index) in selectedList" :key="index">
						{{item}}
					</text>
				</view>
				<view class="margin-bottom" v-else>
					暂无
				</view>
			</view>
			<view class="">
				<view class="padding-bottom text-bold">
					自定义标签
				</view>
				<view class="margin-bottom flex flex-wrap">
					<template v-if="customList.length > 0">
						<text class="tag-item active" v-for="(item,index) in customList" :key="index">{{item}}</text>
					</template>
					<text class="tag-item" @tap="addTag">
						+
					</text>
				</view>
			</view>
			<view class="">
				<view class="padding-bottom text-bold">
					憧憬公司标签
				</view>
				<view class="margin-bottom flex flex-wrap" v-if="tagList.length > 0">
					<text class="tag-item" :class="item.status ? 'active' : ''" v-for="(item,index) in tagList" :key="index" @tap="selectTag(item)">
						{{item.label}}
					</text>
				</view>
				<view class="margin-bottom" v-else>
					暂无
				</view>
			</view>
		</view>
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
                    dreamCompanySign: '',
                    sex: 1,
                    orgCode: '',
                    workNo: '',
                    id: '',
                },
				selectedList:[],
				customList:[],
				tagList:[],
            };
        },
        onLoad: function (option) {
			this.queryTags()
            console.log("this.$Route.query", this.$Route.query);
            let query = this.$Route.query
            if (query) {
                this.myFormData = query;
                if (this.myFormData.sex == '女') {
                    this.switchC = false
                } else if (this.myFormData.sex == '男') {
                    this.switchC = true
                }
                if (this.myFormData.avatar) {
                    this.imgList = [this.myFormData.avatar]
                }
                if (!this.myFormData.birthday) {
                    this.myFormData.birthday = '无'
                }
                if (this.myFormData.identity == '普通成员') {
                    this.myFormData.identity = 1
                } else if (this.myFormData.identity == '上级') {
                    this.myFormData.identity = 2
                }
                if (this.myFormData.status == '正常') {
                    this.myFormData.status = 1
                } else if (this.myFormData.status == '冻结') {
                    this.myFormData.status = 2
                }
                this.Avatar = this.myFormData.avatar

                Object.keys(this.myFormData).map(key => {
                    if (this.myFormData[key] == '无') {
                        this.myFormData[key] = ''
                    }
                })
                console.log("this.myFormData", this.myFormData)
            }
        },
        methods: {
			queryTags() {
				this.$http.get('/sys/dict/querySomeDictItems',{params:{'dicts':'member_dream_company_sign'}}).then(res => {
					if (res.data.success) {
						let newList = res.data.result.member_dream_company_sign.map(item => {
							item.status = false
							return item
						})
						this.tagList = newList
					}
				})
			},
			selectTag(item) {
				const idx = this.selectedList.indexOf(item.label)
				if (item.status) {
					item.status = false
					this.selectedList.splice(idx,1)
				} else {
					item.status = true
					this.selectedList.unshift(item.label)
				}
			},
			addTag() {
				
			},
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
                        this.$Router.replace({name: 'userdetail'})
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
	
	.content-box {
		height: calc(100vh - 90rpx);
	}
	
	.tag-item {
		margin: 10rpx;
		padding: 16rpx 30rpx;
		background-color: #ddd;
		border-radius: 50rpx;
		color: #fff;
	}
	
	.tag-item.active {
		background-color: #8874ff;
	}
</style>
