<template>
	<view class="notice-msglist-container">
		<commonTab :isBack="true">
			<block slot="title"> 通知小助手 </block>
		</commonTab>
		<!-- :style="{marginTop:50+topSpace-5+'px'}" -->
		<view class="notice-msglist-main"
		 :style="{paddingTop:50+topSpace-5+'px'}">
			<scroll-view scroll-y="true" 
			
			class="list-scroll"
				:scroll-top="sTop"
				refresher-enabled="true"
				:refresher-triggered="triggered"
				:refresher-threshold="100" refresher-background="#fff"
				@refresherrefresh="onRefresh">
				<view class="list-wrap" id="scroll-view-content">
					<view  v-for="(item,index) in noticeList " :class="['item'+index]" :id="'s'+index" :key="index">
						<msgItem :item="item"></msgItem>
					</view>
				</view>
				<view class="footer-tag" id="footer-tag" style="height: 20px;">

				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import commonTab from '../component/commonTab.vue';
	import msgItem from "./msg-item.vue"
	export default {
		data() {
			return {
				noticeListUrl: '/sys/sysAnnouncementSend/getMySystemNoticeSend',
				readNoticeAllUrl:'/sys/sysAnnouncementSend/readSystemNoticeMsgAll',
				pageInfo: {
					num: 0,
					size: 10,
				},
				noticeList: [],
				scrollId: '',
				sTop:0,
				triggered:false,
				hasNext:false
			}
		},
		components: {
			commonTab,
			msgItem
		},
		created() {
			// 获取消息列表
			this.getNoticeList(true);
			// 一键已读所有的系统消息
			this.$http.get(this.readNoticeAllUrl).then(res=>{
				console.log(res,"已读消息")
			})
		},
		mounted() {
			
		},

		methods: {
			async onRefresh(){
				// 下拉刷新
				if(this.hasNext){
					console.log("下拉刷新")
					this.triggered = true;
					await this.getNoticeList();
					this.triggered = false;
				}else{
					uni.showToast({
						title:'没有更多消息',
						icon:'none'
					})
					this.triggered = true;
					setTimeout(()=>{
						this.triggered = false;
					},500)
				}
				
			},

			handleScroll() {
				console.log('11')
			},
			getNoticeList(first=false) {
				this.pageInfo.num+=1;
				return this.$http.get(this.noticeListUrl, {
					params: {
						pageNo: this.pageInfo.num,
						pageSize: this.pageInfo.size
					}
				}).then(res => {
					console.log("通知列表", res)
					uni.hideLoading();
					if (res.data.success) {
						console.log(res.data, '数据')
						const {
							pages,
							records,
							current
						} = res.data.result;
						this.hasNext = current < pages ? true : false
						// console.log(pages, records, total)
						this.noticeList.push(...records)
						if(first){
							this.$nextTick(()=>{
								uni.createSelectorQuery().in(this).select('.item0').boundingClientRect((rect) => {
									console.log('元素高度为：')
									console.log(rect)
									this.sTop = rect.top
								}).exec()
							})
						}else{
							// 需要定位到刚刚看的那条记录上面
							const targetClassName = '.item'+(this.pageInfo.num-1) + '0';
							console.log(targetClassName);
							this.$nextTick(()=>{
								uni.createSelectorQuery().in(this).select(targetClassName).boundingClientRect((rect) => {
									console.log('元素高度为：')
									console.log(rect)
									this.sTop = rect.top
								}).exec()
							})
						}

					}

				})
			}
		}
	}
</script>

<style scoped>
	.notice-msglist-main {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
	}

	.list-scroll {
		height: 100%;
	}

	.list-wrap {
		display: flex;
		flex-direction: column-reverse;
	}
</style>
