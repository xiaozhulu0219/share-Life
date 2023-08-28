<template>
	<view class="selftags-container">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个性标签</block>
			<view slot="right" @tap="saveTags">保存</view>
		</cu-custom>
		<view class="selftags-container-body" :style="{height:'calc(100vh - ' +CustomBar + 'px' }">
			<view class="selftags-container-top">
				<view class=" text-bold">
					已选择标签
				</view>
				<view class="margin-bottom flex flex-wrap" v-if="selfLabelList.length > 0">
					<text class="tag-item active" v-for="(item,index) in selfLabelList" :key="index">
						{{item}}
					</text>
				</view>
				<view class="no-status" v-if="selfLabelList.length== 0">
					暂无已选择标签,快去添加~
				</view>
			</view>
			<view class="selftags-container-top">
				<view class=" text-bold">
					自定义标签
				</view>
				<view class="margin-bottom flex flex-wrap" >
					<text :class='["tag-item", { "active": item.isActive }]'
					 v-for="(item,index) in customeLabelList" 
					 :key="index"
					  @click="addCustomTag(item,index)">
					  {{item.label}}
					  <text class="tags-close" v-if="editTagMode"
					  @click.stop="removeTags(item)">
					  	×
					  </text>
						
					</text>
					<text class="tag-item" @tap="addcustomTag" v-if="customeLabelList.length<9">
					    +
					</text>
					<!-- :class="{active:editTagMode}"
					@tap="editTag" -->
					<text v-if="customeLabelList.length>0"
					 class="tag-item"
					 :class="{active:editTagMode}"
					  @click="editTag">
					    -
					</text>
				</view>
				
			</view>
			<view class="selftags-tabs">
				<view class="selftags-tabs-item" @click="activeTab=0">
					爱好
					<view v-if="activeTab==0" class="active-tab bg-gradual-red">
						
					</view>
				</view>
				<view class="selftags-tabs-item" @click="activeTab=1">
					个人特质
					<view v-if="activeTab==1" class="active-tab bg-gradual-red">
						
					</view>
				</view>
				<view class="selftags-tabs-item" @click="activeTab=2">
					最近状态
					<view v-if="activeTab==2" class="active-tab bg-gradual-red">
						
					</view>
				</view>
			</view>
			
			<view class="selftags-res-list">
				<view class="" v-if="activeTab==0">
					<view class="margin-bottom flex flex-wrap" v-if="hobbiesList.length > 0">
						<text :class='["tag-item", { "active": item.isActive }]' @click="addTags(item,index)" v-for="(item,index) in hobbiesList" :key="index">
							{{item.label}}
						</text>
					</view>
				</view>
				<view class="" v-if="activeTab==1">
					<view class="margin-bottom flex flex-wrap" v-if="personalityList.length > 0">
						<text :class='["tag-item", { "active": item.isActive }]' @click="addTags(item,index)" v-for="(item,index) in personalityList" :key="index">
							{{item.label}}
						</text>
					</view>
				</view>
				<view class="" v-if="activeTab==2">
					<view class="margin-bottom flex flex-wrap" v-if="statusList.length > 0">
						<text :class='["tag-item", { "active": item.isActive }]' @click="addTags(item,index)" v-for="(item,index) in statusList" :key="index">
							{{item.label}}
						</text>
					</view>
				</view>
				<!-- 自定义标签模态框 -->
				<view class="customTag-mask" v-if="showCustomModal">
				    <view class="customTag-box">
				        <view class="tag-title">自定义标签</view>
				        <input type="text" class="tag-input" v-model="cusTagName" maxlength="6"
				               placeholder="最长6个字" placeholder-color="#999"/>
				        <view class="buttons">
				            <view class="btn" @tap.stop="showCustomModal = false">取消</view>
				            <view class="btn-confirm btn" @tap="getCustomTagConfirm">保存</view>
				        </view>
				    </view>
				</view>
			</view>
			
		</view>
	</view>
</template>


<script>
	import {mapState,mapMutations} from "vuex"
	export default {
		created() {
			console.log(this.CustomBar);
			this.queryTags();
			this.getCustomTag();
		},
		computed:{
			...mapState(['selfLabelList']),
			
		},
		// watch:{
		// 	selfLabelList(a,b){
		// 		console.log(a,b)
		// 	}
		// },
		data() {
			return {
				myLabelList: [],// 已选择标签
				customeLabelList:[],
				activeTab:0,
				queryUrl:'/sys/dict/querySomeDictItems',
				saveTagsUrl:'/sys/editMemTags',
				addcustomTagUrl:'/memselftags/addMemSelfTags',
				getcustomTagUrl:'/memselftags/queryMemSelfTagsByUserId',
				deleteCustomTagUrl:'/memselftags/delete',
				queryList:['member_self_tags_hobby','member_self_tags_personality','member_self_tags_state'],
				hobbiesList:[],
				personalityList:[],
				statusList:[],
				cusTagName:'',
				showCustomModal:false,
				editTagMode:false,
			}
		},
		methods:{
			// 获取自定义标签
			removeTags(tar){
				console.log("移除这一项",tar)
				// 通过id删除当前标签
				const id = tar.id;
				
				
				uni.showModal({
					confirmText:'确认删除',
					content:'确认删除当前标签吗',
					success:(res)=> {
						console.log(res);
						
						if(res.confirm){
							const url = this.deleteCustomTagUrl+ '?id='+id;
							this.$http.delete(url)
							.then(res=>{
								
								if(res.data.success){
									// 删除成功;
									// 当前数组进行删除
									uni.showToast({
										title:'删除成功!',
										icon:'none'
									});
									console.log(res.data);
									// 判断当前是否是选中
									if(tar.isActive){
										// 当前状态是选中状态
										// 从我的选中状态中移除
										const tempArr = [...this.selfLabelList];
										const targetIndex = tempArr.indexOf(tar.label)
										tempArr.splice(targetIndex,1)
										this.changeSelfLabelList(tempArr);
									}
									this.customeLabelList = this.customeLabelList.filter(item=>{
										return item.id!==id
									})
								}
							})
						}
					}
				})
			},
			editTag(){
				this.editTagMode=!this.editTagMode;
				
			},
			...mapMutations(['changeSelfLabelList']),
			getCustomTag(tags) {
				// console.log(tags,'那里的tags')
			    this.$http.get(this.getcustomTagUrl,
			        {params: {id: this.$store.getters.userid}}).then(res => {
			        if (res.data.success) {
						console.log(res.data,"自定义");
			            const customList = res.data.result.map(item =>{
							let isActive = this.selfLabelList.includes(item.selfComSign)
							return {...item, label: item.selfComSign,isActive}
						}
						 );
			            this.customeLabelList = customList;
			            // this.handleTagSelect(tags);
			        }
			    });
			},
			getCustomTagConfirm(){
				// 确定添加
				uni.showLoading({
					title:'loading....',
					icon:'none'
				})
				if (this.cusTagName.trim()=='') {
				    this.$tip.toast('请输入标签');
					uni.hideLoading()
				    return;
				}
				const params = {selfComSign: this.cusTagName, id: this.$store.getters.userid};
				this.$http.get(this.addcustomTagUrl, {params}).then(res => {
                    if (res.data.success) {
                        this.showCustomModal = false;
                        this.$tip.success('添加成功');
                        this.getCustomTag();
						this.cusTagName = '';
						uni.hideLoading()
                    }else{
						if(res.data.message=="该标签已存在!"){
							uni.hideLoading()
							uni.showToast({
								title:"该标签已经存在",
								icon:'none'
							});
							this.cusTagName = '';
						}
					}
                });
			},
			addcustomTag(){
				// 添加自定义标签
				this.showCustomModal = true;
			},
			saveTags(){
				// 保存用户所选的标签
				const target = this.selfLabelList.join(',');
				console.log(target)
				
				const params = {
				    sign: target,
				    id: this.$store.getters.userid
				};
				console.log(params)
				this.$http.get(this.saveTagsUrl, {params}).then(res => {
					// 成功返回上一页
					uni.showToast({
						title:'添加成功'
					})
					uni.navigateBack({
						delta:-1
					})
					console.log(res)
				}).catch(e => {
				    console.log('请求错误', e);
				});
			},
			queryTags(tags) {
				const queryTasks = this.queryList.map(item=>{
					return new Promise(resolve=>{
						this.$http.get(this.queryUrl,{params:{dicts:item}}).then(res=>{
							if(res.data.success){
								const target = res.data.result[item].map(it=>{
									// 判断当前label是是否被选中 
									const isActive = this.selfLabelList.includes(it.label)
									
									
									 return {
										 ...it,
										 isActive
										 
									 }
								 })
								console.log(target)
								resolve(target)
							}
						})
					})
				})
				Promise.all(queryTasks).then((res)=>{
					console.log("结果",res);
					this.hobbiesList = res[0];
					this.personalityList = res[1];
					this.statusList = res[2];
					
				})
			   //  this.$http.get(this.queryUrl, {params: {dicts: 'member_self_tags_hobby'}}).then(res => {
			   //      if (res.data.success) {
						// console.log(res.data,'结果')
			           
						// // console.log(newList,"55")
			   //      }
			   //  });
			},
			addCustomTag(item){
				//
				 if(item.isActive){
					 // 已经选中
					 //删除
					 item.isActive = false;
					 // 从仓库删除
					const tempArr = this.selfLabelList.filter(it=>{
						return it!=item.label
					})
					 this.changeSelfLabelList(tempArr)
				 }else{
					item.isActive = true;
					 const tempArr=[...this.selfLabelList,item.label];
					 this.changeSelfLabelList(tempArr)
				 }
			},
			addTags(item,idx){
				// 当前tags 激活状态
				let tar;
				if(this.activeTab==0){
					tar = this.hobbiesList[idx]
				}else if(this.activeTab ==1){
					tar = this.personalityList[idx]
				}else if(this.activeTab==2){
					tar = this.statusList[idx]
				}
				if(tar.isActive){
					// 已经选中了 从我的标签中剔除
					tar.isActive = false;
					const tempArr = this.selfLabelList.filter(it=>{
						return it!=tar.label
					})
					// 更改仓库数据
					this.changeSelfLabelList(tempArr)
				}else{
					//未选中,加入我的标签
					tar.isActive = true;
					const tempArr=[...this.selfLabelList,tar.label];
					this.changeSelfLabelList(tempArr)
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.selftags-container {
		height: 100vh;
		width: 100vw;

	}

	.selftags-container-body {
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx;
	}

	.tag-item {
		margin: 10rpx;
		padding: 16rpx 35rpx;
		background-color: #ddd;
		border-radius: 50rpx;
		color: #fff;
		position: relative;
	}

	.selftags-tabs {
		display: flex;
		align-items: center;
		height: 80rpx;
	}

	.selftags-tabs-item {
		width: 33%;
		text-align: center;
		color: #000;
		font-size: 1.2em;
		font-weight: bold;
		position: relative;
		height:100%;
		line-height: 80rpx;
	}
	.active-tab{
		width: 30%;
		height:5rpx;
		bottom: 0rpx;
		left: 50%;
		transform: translateX(-50%);
		position: absolute;
	}
	.no-status{
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #aaa;
	}
	.selftags-res-list{
		margin-top:30rpx ;
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
	.tags-close{
		position: absolute;
		font-size: 1.2em;
		height: 100%;
		/* background-color: #666; */
		top: 0rpx;
		width: 30rpx;
		padding: 16rpx 10rpx;
	
	}
	
</style>
