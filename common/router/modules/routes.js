const routes = [
	{
	 path: "/pages/login/login",
	 name: 'login',
		 meta: {
			 title: '登录',
		 },
	},
	{
		path: "/pages/login2/login2",
		name: 'login2',
		meta: {
			title: '新登录',
		},
	},
	{
		path: "/pages/login2/forgetPass",
		name: 'forgetPass',
		meta: {
			title: '忘记密码',
		},
	},
	{
		path: "/pages/engine/engine",
		name: 'engine',
		meta: {
			title: '启动页',
		},
	},
	{
		path: "/pages/register/register",
		name: 'register',
		meta: {
			title: '注册',
		},
	},
	{
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
      path: '/pages/index/index',
      name: 'index',
        meta: {
	        title: '主页',
	    },
    },
	{
	    //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
	  path: '/pages/home/home',
	  //aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
	  name: 'home',
	    meta: {
	        title: '原主页',
	    },
	},
	{
		path: '/pages/information/informationList',
		name: 'information',
		meta: {
			title: '新首页列表',
		},
	},
	{
		path: '/pages/information/informationForm',
		name: 'informationForm',
		meta: {
			title: '新首页新增页',
		},
	},
	{
		path: '/pages/helpcompany/helpCompanyLikeQueryList',
		name: 'informationForm',
		meta: {
			title: '助力公司新增时模糊查询结果列表页',
		},
	},
	{
		path: '/pages/helpcompany/helpCompanyList',
		name: 'informationList',
		meta: {
			title: '助力公司列表',
		},
	},
    {
	    path: '/pages/user/people',
        name: 'people',
        meta: {
	        title: '原个人中心',
	    },
	},
	{
		path: '/pages/member/member',
		name: 'member',
		meta: {
			title: '新个人',
		},
	},
	{
		path: '/pages/member/memberdetail',
		name: 'memberdetail',
		meta: {
			title: '新个人详情',
		},
	},
	{
		path: '/pages/member/dreamCompanySign',
		name: 'dreamCompanySign',
		meta: {
			title: '新憧憬公司标签编辑',
		},
	},
	{
		path: '/pages/member/nickName',
		name: 'nickName',
		meta: {
			title: '新昵称编辑',
		},
	},
	{
		path: '/pages/member/signature',
		name: 'signature',
		meta: {
			title: '新个性签名编辑',
		},
	},
	{
		path: '/pages/member/sex',
		name: 'sex',
		meta: {
			title: '新性别编辑',
		},
	},
	{
	    path: '/pages/user/userdetail',
	    name: 'userdetail',
	    meta: {
	        title: '原个人详情',
	    },
	},
	{
	    path: '/pages/user/useredit',
	    name: 'useredit',
	    meta: {
	        title: '原个人编辑',
	    },
	},
	{
	    path: '/pages/user/userexit',
	    name: 'userexit',
	    meta: {
	        title: '原退出',
	    },
	},
	{
	    path: '/pages/user/location',
	    name: 'location',
	    meta: {
	        title: '原定位',
	    },
	},
	{
	    path: '/pages/common/exit',
	    name: 'exit',
	    meta: {
	        title: '退出',
	    },
	},
	{
	    path: '/pages/common/success',
	    name: 'success',
	    meta: {
	        title: 'success',
	    },
	},{
	  path: '/pages/addressbook/address-book',
	  name: 'addressBook',
	    meta: {
	        title: 'addressBook',
	    },
	},
	{
	  path: '/pages/addressbook/level-address-book',
	  name: 'levelAddressBook',
	    meta: {
	        title: 'levelAddressBook',
	    },
	},
	{
	  path: '/pages/addressbook/member',
	  name: 'member',
	    meta: {
	        title: 'member',
	    },
	},
	{
	  path: '/pages/addressbook/address-detail',
	  name: 'addressDetail',
	    meta: {
	        title: 'addressDetail',
	    },
	},
	{
	    path: '/pages/annotation/annotationList',
	    name: 'annotationList',
	    meta: {
	        title: '通知公告',
	    },
	},
	{
	    path: '/pages/annotation/annotationDetail',
	    name: 'annotationDetail',
	    meta: {
	        title: '通知详情',
	    },
	},
	{
	    path: '/pages/common/helloWorld',
	    name: 'helloWorld',
	    meta: {
	        title: 'helloWorld',
	    },
	},
]
export default routes
