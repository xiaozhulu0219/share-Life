<template>
    <!--个人页的一些页面--憧憬公司标签页-->
    <view>
        <view >
            <cu-custom bgColor="bg-gradual-pink" :isBack="true">
                <block slot="backText">返回</block>
                <block slot="content">憧憬公司标签</block>
				<view slot="right" @tap="saveTags">保存</view>
            </cu-custom>
        </view>
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
                <view class="margin-bottom flex flex-wrap" v-if="myLabelList.length > 0">
                    <text class="tag-item active" v-for="(item,index) in myLabelList" :key="index">
                        {{item}}
                    </text>
                </view>
                <view class="margin-bottom" v-else>
                    暂无
                </view>
            </view>
            <view class="">
                <view class="padding-bottom text-bold">自定义标签</view>
                <view class="margin-bottom flex flex-wrap">
                    <template v-if="customList.length">
                        <text :class='["tag-item", { "active": item.status }]' v-for="(item,index) in customListCmp"
                              :key="index" @tap="selectTag(item)">{{item.selfComSign}}
							  <text class="tags-close" v-if="editTagMode"
							  @click.stop="removeTags(item)">
							  	×
							  </text>
                        </text>
					
                    </template>
                    <text class="tag-item" @tap="addTag" v-if="customListCmp.length<9">
                        +
                    </text>
					<text v-if="customListCmp.length>0" class="tag-item" 
					:class="{active:editTagMode}"
					@tap="editTag"
					>
					    -
					</text>
                </view>
            </view>
            <view class="">
                <view class="padding-bottom text-bold">
                    憧憬公司标签
                </view>
                <view class="margin-bottom flex flex-wrap" v-if="tagList.length > 0">
                    <text :class='["tag-item", { "active": item.status }]' v-for="(item,index) in tagListCmp" :key="index"
                          @tap="selectTag(item)">
                        {{item.label}}
                    </text>
                </view>
                <view class="margin-bottom" v-else>
                    暂无
                </view>
            </view>
        </view>
        <!-- 自定义标签模态框 -->
        <view class="customTag-mask" v-if="showCustomModal">
            <view class="customTag-box">
                <view class="tag-title">自定义标签</view>
                <input type="text" class="tag-input" 
				v-model="tagName" 
				maxlength="6"
				@input="oninput"
                       placeholder="最长6个字" placeholder-color="#999"/>
                <view class="buttons">
                    <view class="btn" @tap.stop="showCustomModal = false">取消</view>
                    <view class="btn-confirm btn" @tap="getCustomTagConfirm">保存</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import {
		keyWords
	} from '@/common/util/constants';
	import textTip from "@/pages/component/textTip.js";
	import {mapState,mapMutations} from "vuex";
    export default {
        data() {
            return {
                index: -1,
                myFormData: {
                    dreamCompanySign: '',
                    sex: 1,
                    id: ''
                },
                selectedList: [], //选中标签列表
                customList: [], // 自定义标签列表
                tagList: [], // 默认官方标签列表
                tagName: '', // 自定义标签名
                showCustomModal: false, // 控制自定义标签模态框显示
				editTagMode:false,
				deleteTagsUrl:'/selfCompanySign/delete'
            };
        },
		mixins: [textTip],
        onLoad: function (option) {
			console.log("参数",this.$Route.query)
            this.queryTags(this.$Route.query);
        },
		computed:{
			...mapState(['myLabelList']),
			customListCmp(){
				return this.customList.map((item)=>{
					const tar = {...item,label:item.selfComSign}
					if(this.myLabelList.includes(item.selfComSign)){
						tar.status = true;
					}else{
						tar.status = false;
					}
					return tar
				})
			},
			tagListCmp(){
				return this.tagList.map(item=>{
					const tar = {...item}
					if(this.myLabelList.includes(item.label)){
						tar.status = true;
					}else{
						tar.status = false;
					}
					return tar
				})
			}
		},
        methods: {
			oninput(){
				let value= this.tagName;
				if (value !== null) {
					// console.log(value,'2222')
					for (const i in keyWords) {
						const reg = new RegExp(keyWords[i], 'g');
						value = value.replace(reg, ''.padEnd(keyWords[i].length, '*'));
					}
					// console.log(value,'3333')
					// 判断当前是否添加了标签
				this.$nextTick(() => {
					this.tagName = value;
				});
				}
			},
			removeTags(tar){
				// 移除当前选中的tags
				console.log("移除这一项",tar)
				// 通过id删除当前标签
				const id = tar.id;
				
				
				uni.showModal({
					confirmText:'确认删除',
					content:'确认删除当前标签吗',
					success:(res)=> {
						console.log(res);
						
						if(res.confirm){
							this.$http.get(this.deleteTagsUrl,{params:{id}})
							.then(res=>{
								if(res.data.success){
									// 删除成功;
									// 当前数组进行删除
									uni.showToast({
										title:'删除成功!',
										icon:'none'
									});
									if(tar.status){
										// 当前状态是选中状态
										// 从我的选中状态中移除
										const tempArr = [...this.myLabelList];
										const targetIndex = tempArr.indexOf(tar.selfComSign)
										tempArr.splice(targetIndex,1)
										this.changeMyLabelList(tempArr);
									}
									this.customList = this.customList.filter(item=>{
										return item.id!==id
									})
								}
							})
						}
					}
				})
				// this.$http.delete(this.deleteTagsUrl,{params:{id:id}}).then(res=>{
				// 	console.log(res,"删除结果")
				// })
				// console.log(this.customList,"所有标签");
				// console.log(this.myLabelList,"已选择标签")
			},
			editTag(){
				this.editTagMode=!this.editTagMode;
				
			},
			...mapMutations(['changeMyLabelList']),
            handleTagSelect(tags='') {
				console.log(tags,'这是什么')
                const tagSelectArr = tags.split(',');
				console.log(this.customList,"11")
                const customName = this.customList.map(item => item.label);
                const tagName = this.tagList.map(item => item.label);
				console.log(tagSelectArr,"这这着")
                tagSelectArr.forEach(item => {

                    // const cIndex = customName.indexOf(item);
                    // const tIndex = tagName.indexOf(item);
                    // if (cIndex !== -1) {
                    //     this.selectStatus(this.customList[cIndex], cIndex);
                    // }
                    // if (tIndex !== -1) {
                    //     this.selectStatus(this.tagList[tIndex], tIndex);
                    // }

                });
            },
            // 保存所选标签
            saveTags() {
				console.log("运行了保存")
				const target = this.myLabelList.join(',');
				console.log(target)

                const params = {
                    dreamCompanySign: target,
                    id: this.$store.getters.userid
                };
                this.$http.get('/sys/editDreamCompanySign', {params}).then(res => {
					// 成功返回上一页
					uni.showToast({
						title:'添加成功'
					})
                }).catch(e => {
                    console.log('请求错误', e);
                });
            },
            queryTags(tags) {
                this.$http.get('/sys/dict/querySomeDictItems', {params: {dicts: 'member_dream_company_sign'}}).then(res => {
                    if (res.data.success) {

                        const newList = res.data.result.member_dream_company_sign.map(item => {
                            item.status = false;
                            return item;
                        });
						// console.log(newList,"55")
                        this.tagList = newList;// 憧憬公司标签
                    }
                });
                this.getCustomTag(tags);
            },
            selectTag(item) {
				console.log("点击",item)
				// 如果item.status 需要像仓库中添加当前标签
				// 判断当前仓库有没有标签
				if(this.myLabelList.includes(item.label)){
					// 有了 要删除
					item.status = false;
					const tempArr = [...this.myLabelList];
					const targetIndex = tempArr.indexOf(item.label)
					tempArr.splice(targetIndex,1)
					this.changeMyLabelList(tempArr);
				}else{
					//不包括 就添加
					item.status = true;
					const tempArr = [...this.myLabelList,item.label]
					this.changeMyLabelList(tempArr);
				}
				// if(item.status){
				// 	// 向列表中添加当前标签
				// 	//判断
				// 	console.log("运行这里")
				// 	if(this.)
				// 	const tempArr = [...myLabelList,item.label]
				// 	this.changehomeListStore(tempArr);
				// }
                // const idx = this.selectedList.indexOf(item.label);
                // this.selectStatus(item, idx);
            },
            // 选中状态
            // selectStatus(item, idx) {
            //     if (item.status) {
            //         item.status = false;
            //         this.selectedList.splice(idx, 1);
            //     } else {
            //         item.status = true;
            //         this.selectedList.push(item.label);
            //     }
            // },
            addTag() {
                this.showCustomModal = true;
            },
            // 新增自定义标签
            getCustomTagConfirm() {
				uni.showLoading({
					title:'loading....',
					icon:'none'
				})
                const {tagName, $http} = this;
                if (!tagName.trim()) {
                    this.$tip.toast('请输入标签');
					uni.hideLoading()
                    return;
                }
				if(this.tagName.indexOf('*') != -1){
					// 关键词屏蔽
					this.showTextTip('标签');
					this.tagName = ''
					return;
				}
                const params = {selfComSign: tagName, id: this.$store.getters.userid};
                $http.get('/selfCompanySign/addSelfCompanySign', {params}).then(res => {
                    if (res.data.success) {
                        this.showCustomModal = false;
                        this.$tip.success('添加成功');
                        this.getCustomTag();
						this.tagName = '';
						uni.hideLoading()
                    }else{
						if(res.data.message=="该标签已存在!"){
							uni.hideLoading()
							uni.showToast({
								title:"该标签已经存在",
								icon:'none'
							});
							this.tagName = '';
						}
					}
                });
            },
            // 获取自定义标签
            getCustomTag(tags) {
				console.log(tags,'那里的tags')
                this.$http.get('/selfCompanySign/querySelfComSignByUserId',
                    {params: {id: this.$store.getters.userid}}).then(res => {
                    if (res.data.success) {
						// 自定义公司标签
						console.log(res.data,"自定义")
                        const customList = res.data.result.map(item => ({...item, label: item.selfComSign}));
                        this.customList = customList;
                        this.handleTagSelect(tags);
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .cu-form-group .title {
        min-width: calc(4em + 15px);
    }

    .content-box {
        height: calc(100vh - 90rpx);
    }

    .tag-item {
        margin: 10rpx;
        padding: 16rpx 35rpx;
        background-color: #ddd;
        border-radius: 50rpx;
        color: #fff;
		position: relative;
    }
	.tags-close{
		position: absolute;
		font-size: 1.2em;
		height: 100%;
		/* background-color: #666; */
		top: 0rpx;
		width: 30rpx;
		padding: 16rpx 10rpx;
	
	}

    .tag-item.active {
        background-color: #8874ff;
		
    }

    .customTag-mask {
        background-color: rgba(0, 0, 0, .3);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
    }

    .customTag-box {
        margin: auto;
        padding-top: 20rpx;
        width: 80%;
        overflow: hidden;
        text-align: center;
        background-color: #fff;
        border-radius: 20rpx;
    }

    .tag-title {
        font-size: 18px;
        color: #333;
    }

    .tag-input {
        background-color: #f9f9f9;
        margin: 20rpx 20rpx 60rpx;
        padding: 4rpx 10rpx;
        box-sizing: border-box;
        height: 80rpx;
        text-align: left;
    }

    .buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .btn {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        color: #666;
        background-color: #f0f0f0;
    }

    .btn-confirm {
        background-color: #0081ff;
        color: #fff;
    }
</style>
