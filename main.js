import Vue from 'vue';
import App from './App';
import store from './store';
import MinCache from './common/util/MinCache.js';
import tip from './common/util/tip.js';
import configService from './common/service/config.service.js';

import router from './common/router';
import { RouterMount } from './plugin/uni-simple-router/index.js';

//引入mescroll插件
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';

// request请求
import { http } from '@/common/service/service.js';

import home from './pages/home/home.vue';

//以下几个是将来的登录注册

import register from './pages/register/register.vue';

import engine from './pages/engine/engine.vue';

import forgetPass from './pages/login/forgetPass.vue';

//以下一个是将来的用户
import member from './pages/member/member.vue';

//以下两个是新首页
import information from './pages/information/informationList.vue';

import informationForm from './pages/information/informationForm.vue';

//以下两个是助力公司
import helpCompanyList from './pages/helpcompany/helpCompanyList.vue';

import helpCompanyLikeQueryList from './pages/helpcompany/helpCompanyLikeQueryList.vue';

import helpCompanySelectForm from './pages/helpcompany/helpCompanySelectForm.vue';

import helpCompanyDetailForm from './pages/helpcompany/helpCompanyDetailForm.vue';

import people from './pages/user/people.vue';

// 自定义组件
import mySelect from './components/my-componets/my-select.vue';

import myImageUpload from './components/my-componets/my-image-upload.vue';

import myPage from './components/my-componets/my-page.vue';

import basics from './pages/basics/home.vue';

import components from './pages/component/home.vue';

import plugin from './pages/plugin/home.vue';

import cuCustom from './plugin/colorui/components/cu-custom.vue';
Vue.component('mescroll-body', MescrollBody);
Vue.component('mescroll-uni', MescrollUni);

// 注册缓存器
Vue.use(MinCache, { timeout: 6 });

// store
Vue.prototype.$store = store;
// tip
Vue.prototype.$tip = tip;
// config
Vue.prototype.$config = configService;
Vue.prototype.$http = http;
Vue.component('home', home);
//Vue.component('login', login);
Vue.component('register', register);
Vue.component('engine', engine);
Vue.component('forgetPass', forgetPass);
Vue.component('member', member);
Vue.component('information', information);
Vue.component('informationForm', informationForm);
Vue.component('helpCompanyList', helpCompanyList);
Vue.component('helpCompanyLikeQueryList', helpCompanyLikeQueryList);
Vue.component('helpCompanySelectForm', helpCompanySelectForm);
Vue.component('helpCompanyDetailForm', helpCompanyDetailForm);
Vue.component('people', people);
Vue.component('mySelect', mySelect);
Vue.component('myImageUpload', myImageUpload);
Vue.component('myPage', myPage);
Vue.component('basics', basics);
Vue.component('components', components);
Vue.component('plugin', plugin);
Vue.component('cu-custom', cuCustom);

// import VConsole from './js_sdk/vconsole.min'

//   var vConsole = new VConsole();

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	store,
	MinCache,
    ...App
});
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app, '#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
