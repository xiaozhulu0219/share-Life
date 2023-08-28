import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/api';
import MinCache from '@/common/util/MinCache.js';
import { http } from '@/common/service/service.js';
import {
	ACCESS_TOKEN,
	USER_NAME,
	USER_INFO
} from '@/common/util/constants';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: '',
		userid: '',
		username: '',
		realname: '',
		welcome: '',
		avatar: '',
		uuId: '',
		nickname: '',
		placeholdertext: '你可以在这里:1.爆料职场新鲜事 2.分享面试跳槽经验 3.与同行交流、吐槽解压',
		homeListStore: [],
		scrollIdStore: '',
		pageInfoStore: {
			num: 0,
			size: 10
		},
		followListStore: [],
		followListPage: {
			num: 0,
			size: 10
		},
		hotListStore:[],
		hotListPage:{
			num:0,
			size:10
		},
		myLabelList:[],
		selfLabelList:[],
		lovesCount:0,
		followCount:0,
		commentsCount:0,
		userSearchList: JSON.parse(uni.getStorageSync('searchHisList')?uni.getStorageSync('searchHisList'):"[]")|| [],
	},

	mutations: {
		// 请求当前未读消息的action方法
		// 登录成功 或者在app中调用
		
		SET_TOKEN: (state, token) => {
			state.token = token;
		},
		SET_NAME: (state, {
			username,
			realname,
			welcome
		}) => {
			state.username = username;
			state.realname = realname;
			state.welcome = welcome;
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar;
		},
		changeMyLabelList(state,payload){
			state.myLabelList = payload 
		},
		changeSelfLabelList(state,payload){
			state.selfLabelList = payload
		},
		changehomeListStore: (state, payload) => {
			state.homeListStore = payload
		},
		loveInforStore(state, payload) {
			const {
				index,
				count
			} = payload
			const targetObj = state.homeListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 1

		},
		unloveInforStore(state, payload) {
			const {
				index,
				count
			} = payload
			const targetObj = state.homeListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 0
		},
		changeScrollIdStore(state, payload) {
			state.scrollIdStore = payload
		},
		pageNext(state) {
			state.pageInfoStore.num += 1;
		},
		initPage(state) {
			state.pageInfoStore.num = 0;
		},
		changeFollowListStore(state, payload) {
			state.followListStore = payload
		},
		followPageNext(state) {
			state.followListPage.num += 1;
		},
		followInitPage(state) {
			state.followListPage.num = 0
		},
		loveInforFollowStore(state, payload) {
			const {
				index,
				count
			} = payload;
			const targetObj = state.followListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 1
		},
		unloveInforFollowStore(state,payload){
			const {
				index,
				count
			} = payload;
			const targetObj = state.followListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 0
		}
		,
		changeHotListStore(state,payload){
			state.hotListStore = payload
		},
		hotPageNext(state){
			state.hotListPage.num += 1;
		},
		hotPageInit(state){
			state.hotListPage.num = 0;
		},
		loveInforHotStore(state, payload) {
			const {
				index,
				count
			} = payload;
			const targetObj = state.hotListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 1
		},
		unloveInforHotStore(state,payload){
			const {
				index,
				count
			} = payload;
			const targetObj = state.hotListStore[index];
			targetObj.loveCount = count;
			targetObj.hasLoved = 0
		},
		// 重新登录或者初次进入程序调用
		// 重置所有请求的数据
		clearUserStoreList(state){
			console.log("运行了")
			state.homeListStore=[];
			state.pageInfoStore.num = 0;
			state.followListStore = [];
			state.followListPage.num = 0;
			state.hotListStore = [];
			state.hotListPage.num = 0
		},
		changLoveCount(state,payload){
			state.lovesCount = payload;
			
		},
		changeFollowCount(state,payload){
			state.followCount = payload;
		},
		changeCommentsCount(state,payload){
			state.commentsCount = payload;
		},
		changeSearchList(state,payload){
			// 判断当前列表有没有新的值
			// 没有就添加
			if(!state.userSearchList.includes(payload)){
				state.userSearchList.push(payload);
				const targetStorage = JSON.stringify(state.userSearchList)
				// 存储本地数据
				uni.setStorage({
					key:'searchHisList',
					data: targetStorage,
				})
			}else{
				return
			}
		},
		initSearchList(state){
			// 删除所有历史记录
			state.userSearchList = [];
			uni.setStorage({
				key:'searchHisList',
				data: JSON.stringify([]),
			})
			
		}
	},
	actions: {
		getMessageCount(ctx){
			const listMsgUrl = '/sys/annountCement/listMsg';
			http.get(listMsgUrl).then(res=>{
				console.log("拿到当前消息",res)
				const {commentMsgTotal,focusMsgTotal,loveMsgTotal}= res.data.result;
				// 改变仓库数据
				ctx.commit('changLoveCount',loveMsgTotal);
				ctx.commit('changeFollowCount',focusMsgTotal);
				ctx.commit('changeCommentsCount',commentMsgTotal);
			})
			
		},
		// 登录
		mLogin({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				api.login(userInfo).then(response => {
					if (response.data.code == 200) {
						const result = response.data.result;
						const userInfo = result.userInfo;
						uni.setStorageSync(ACCESS_TOKEN, result.token);
						uni.setStorageSync(USER_INFO, userInfo);
						commit('SET_TOKEN', result.token);
						commit('SET_AVATAR', userInfo.avatar);
						commit('SET_NAME', {
							username: userInfo.username,
							realname: userInfo.realname
						});
						resolve(response);
					} else {
						resolve(response);
					}
				}).catch(error => {
					console.log('catch===>response', response);
					reject(error);
				});
			});
		},
		//手机号登录
		PhoneLogin({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				api.phoneNoLogin(userInfo).then(response => {
					if (response.data.code == 200) {
						const result = response.data.result;
						const userInfo = result.userInfo;
						uni.setStorageSync(ACCESS_TOKEN, result.token);
						uni.setStorageSync(USER_INFO, userInfo);
						commit('SET_TOKEN', result.token);
						commit('SET_NAME', {
							username: userInfo.username,
							realname: userInfo.realname
						});
						commit('SET_AVATAR', userInfo.avatar);
						resolve(response);
					} else {
						reject(response);
					}
				}).catch(error => {
					reject(error);
				});
			});
		},
		// 新手机号密码登录
		newMLogin({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				api.newMLogin(userInfo).then(response => {
					if (response.data.code == 200) {
						const result = response.data.result;
						const userInfo = result.userInfo;
						uni.setStorageSync(ACCESS_TOKEN, result.token);
						uni.setStorageSync(USER_INFO, userInfo);
						commit('SET_TOKEN', result.token);
						commit('SET_NAME', {
							username: userInfo.username,
							realname: userInfo.realname
						});
						commit('SET_AVATAR', userInfo.avatar);
						resolve(response);
					} else {
						reject(response);
					}
				}).catch(error => {
					reject(error);
				});
			});
		},
		// 登出
		Logout({
			commit,
			state
		}) {
			return new Promise((resolve) => {
				const logoutToken = state.token;
				commit('SET_TOKEN', '');
				uni.removeStorageSync(ACCESS_TOKEN);
				api.logout(logoutToken).then(() => {
					resolve();
				}).catch(() => {
					resolve();
				});
			});
		}

	},
	getters: {
		token: state => state.token,
		username: state => {
			state.username = uni.getStorageSync(USER_INFO).username;
			return state.username;
		},
		nickname: state => {
			state.nickname = uni.getStorageSync(USER_INFO).realname;
			return state.user.realname;
		},
		avatar: state => {
			state.avatar = uni.getStorageSync(USER_INFO).avatar;
			return state.user.avatar;
		},
		userid: state => {
			state.userid = uni.getStorageSync(USER_INFO).id;
			return state.userid;
		},
		uuId: state => {
			state.uuId = uni.getStorageSync(USER_INFO).uuId;
			return state.uuId;
		},
		totalCount(state){
			return state.lovesCount+state.followCount+state.commentsCount
		}
		
	}
});
