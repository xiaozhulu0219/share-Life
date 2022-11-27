<template>
	<view>
		<scroll-view scroll-y class="page">
			<cu-custom bgColor="bg-gradual-pink" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">编辑资料</block>
				<!--<view slot="right"  @tap="rightClick">编辑</view>-->
			</cu-custom>

			<!-- list列表 -->
			<view class="cu-list menu">

				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">头像</text>
					</view>
					<view class="action">
						<view class="cu-avatar round sm" :style="{backgroundImage: 'url(' + personalMsg.avatar + ')'}"></view>
					</view>
				</view>
			</view>

			<view class="cu-list menu">
				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/nickName" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">昵称</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.realname}}</text>
					</view>
				</navigator>
			</view>

			<view class="cu-list menu">
				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/sex" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">性别</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.sex}}</text>
					</view>
				</navigator>
			</view>

			<view class="cu-list menu">
				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/signature" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">个性签名</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.signature}}</text>
					</view>
				</navigator>
			</view>
		
		     <view class="cu-list menu ">
				<my-date label="毕业时间" class="text-grey" v-model="personalMsg.graduationDate" placeholder="请选择毕业时间"  fields="day"></my-date>
			</view>
			

			<view class="cu-list menu">
				<my-date label="参加工作时间" class="text-grey" v-model="personalMsg.startWorkDate" placeholder="请选择参加工作时间"  fields="day"></my-date>
			</view>

			<!--  这个是配字典将来可以滚动选择  -->
			<view class="cu-list menu">
				<app-select label="职    业：" class="text-grey" v-model="personalMsg.job" placeholder="请选择职业" :dict="job_type" space ></app-select>
			</view>

			<view class="cu-list menu">
				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/dreamCompanySign" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">憧憬公司标签</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.dreamCompanySign}}</text>
					</view>
				</navigator>
			</view>

			<view class="cu-list menu">
				<navigator class="cu-item arrow animation-slide-bottom" url="/pages/member/dreamCompanySign" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">是否匿名</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.dreamCompanySign}}</text>
					</view>
				</navigator>
			</view>


		</scroll-view>
	</view>
</template>

<script>
	const job_type = [{text:'程序员',value:'1'},{text:'医生',value:'2'},{text:'宇航员',value:'3'},{text:'老师',value:'4'},{text:'销售',value:'5'}];
	import api from '@/api/api.js'
	import appSelect from '@/components/my-componets/appSelect.vue'
	import myImageUpload from '@/components/my-componets/my-image-upload.vue'
	import myDate from '@/components/my-componets/my-date.vue'

	export default {
		components:{
			appSelect,myImageUpload,myDate
		},
		data() {
			return {
				job_type,
				personalMsg:{
					avatar:'',
					realname:'',
					username:'',
					nickName:'',
					signature:'',
					graduationDate:'',
					startWorkDate:'',
					experience:'',
					job:'1',
					dreamCompanySign:'',
					sex:1,
					birthday:new Date(),
					orgCode:'',
					workNo:'',
					status:1,
					phone:'',
					telephone:'',
					email:'',
					post:'',
					departIds:'',
					identity:'',

				},
				userUrl:'/sys/user/queryById',
				positionUrl:'/sys/position/list',
				departUrl:'/sys/user/userDepartList'
			};
		},
		onLoad() {
			this.loadinfo()
		},
		methods: {
			getSubStringText(text,len){
				if(!text || text.length==0){
					return ''
				}
				if(text.length<len){
					return text;
				}
				return text.substr(0,len)+"..."
			},
			rightClick(){
				console.log("用户")
				this.$Router.push({name:'memberedit', params:this.personalMsg})
				/* uni.navigateTo({
				    url: '/pages/user/useredit?item='+item
				}); */
			},
			loadinfo(){
				console.log("用户")
				this.$http.get(this.userUrl,{params:{id:this.$store.getters.userid}}).then(res=> {
					console.log("用户",res)
					if (res.data.success) {
						let result = res.data.result
						if(result.avatar&&result.avatar.length >0)
							this.personalMsg.avatar = api.getFileAccessHttpUrl(result.avatar)
						this.personalMsg.realname = result.realname
						this.personalMsg.username= result.username
						this.personalMsg.post = result.post
						this.personalMsg.sex = result.sex===1?'男':'女'
						this.personalMsg.birthday = result.birthday== null?'无':result.birthday
						this.personalMsg.departIds= result.departIds
						this.personalMsg.workNo= result.workNo
						this.personalMsg.phone= result.phone
						this.personalMsg.telephone= result.telephone== null?'无':result.telephone
						this.personalMsg.email= result.email
						this.personalMsg.post= result.post
						this.personalMsg.identity= result.identity=== 1?'普通成员':'上级'
						this.personalMsg.status= result.status === 1?'正常':'冻结'
						this.personalMsg.orgCode= result.orgCode
					}
				}).catch(e=>{
					console.log("请求错误",e)
				})

				this.$http.get(this.departUrl,{params:{userId:this.$store.getters.userid}}).then(res=> {
					if (res.success) {
						for (let item of res.result){
							this.personalMsg.orgCode = item.title
							this.personalMsg.departIds = item.title
						}
					}
				}).catch(e=>{
					console.log("请求错误",e)
				})

				this.$http.get(this.positionUrl).then(res=> {
					if (res.success) {
						let postArr = res.result.records
						for (let item of postArr ){
							if (this.personalMsg.post == item.code){
								this.personalMsg.post = item.name
							}
						}
					}
				}).catch(e=>{
					console.log("请求错误",e)
				})
			},
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>
