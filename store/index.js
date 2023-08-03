import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/api';
import MinCache from '@/common/util/MinCache.js';
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
		}

	},
	mutations: {
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
	},
	actions: {
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
		}
	}
});
