const routes = [{
    path: '/pages/login/login',
    name: 'login',
    meta: {
        title: '新登录'
    }
},
    {
        path: '/pages/login/forgetPass',
        name: 'forgetPass',
        meta: {
            title: '忘记密码'
        }
    },
    {
        path: '/pages/engine/engine',
        name: 'engine',
        meta: {
            title: '启动页'
        }
    },
    {
        path: '/pages/register/register',
        name: 'register',
        meta: {
            title: '注册'
        }
    },
    {
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
        path: '/pages/index/index',
        name: 'index',
        meta: {
            title: '主页'
        }
    },
    {
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
        path: '/pages/home/home',
        //aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
        name: 'home',
        meta: {
            title: '主页'
        }
    },
    {
        path: '/pages/information/inforPublishForm',
        name: 'inforPublishForm',
        meta: {
            title: '动态新增页'
        }
    },
    {
        path: '/pages/helpcompany/helpCompanyLikeQueryList',
        name: 'informationForm',
        meta: {
            title: '助力公司新增时模糊查询结果列表页'
        }
    },
    {
        path: '/pages/home/homeHelpCompanyDetail',
        name: 'homeHelpCompanyDetail',
        meta: {
            title: '助力公司详情'
        }
    },
    {
        path: '/pages/member/member',
        name: 'member',
        meta: {
            title: '个人页'
        }
    },
    {
        path: '/pages/message/message',
        name: 'message',
        meta: {
            title: '消息页'
        }
    },
    {
        path: '/pages/message/loveMsgModal',
        name: 'loveMsgModal',
        meta: {
            title: '赞与收藏消息页'
        }
    },
    {
        path: '/pages/message/focusMsgModal',
        name: 'focusMsgModal',
        meta: {
            title: '新增关注消息页'
        }
    },
    {
        path: '/pages/message/commentMsgModal',
        name: 'commentMsgModal',
        meta: {
            title: '评论消息页'
        }
    },
    {
        path: '/pages/home/homeMemberDetail',
        name: 'homeMemberDetail',
        meta: {
            title: '点击用户头像跳转的可见个人页'
        }
    },
    {
        path: '/pages/home/memberLikeCountModal',
        name: 'memberLikeCountModal',
        meta: {
            title: '点击用户头像跳转后的可见个人页中点击获赞和收藏弹出的modal'
        }
    },
    {
        path: '/pages/member/memberdetail',
        name: 'memberdetail',
        meta: {
            title: '个人详情'
        }
    },
    {
        path: '/pages/member/dreamCompanySign',
        name: 'dreamCompanySign',
        meta: {
            title: '憧憬公司标签编辑'
        }
    },
    {
        path: '/pages/member/nickName',
        name: 'nickName',
        meta: {
            title: '昵称编辑'
        }
    },
    {
        path: '/pages/member/signature',
        name: 'signature',
        meta: {
            title: '个性签名编辑'
        }
    },
    {
        path: '/pages/member/sex',
        name: 'sex',
        meta: {
            title: '性别编辑'
        }
    },
    {
        path: '/pages/member/fansModal',
        name: 'fansModal',
        meta: {
            title: '粉丝页'
        }
    },
    {
        path: '/pages/member/focusModal',
        name: 'focusModal',
        meta: {
            title: '关注页'
        }
    },
    {
        path: '/pages/home/homeInforDetail',
        name: 'homeInforDetail',
        meta: {
            title: '动态详情页'
        }
    },
    {
        path: '/pages/home/homeSearch',
        name: 'homeSearch',
        meta: {
            title: '动态搜索页'
        }
    },
    {
        path: '/pages/home/homeSearchResultPage',
        name: 'homeSearchResultPage',
        meta: {
            title: '动态搜索结果展示页'
        }
    },
    {
        path: '/pages/member/memberInforDetail',
        name: 'memberInforDetail',
        meta: {
            title: '我的发布动态详情页'
        }
    },
    {
        path: '/pages/setting/setting',
        name: 'setting',
        meta: {
            title: '设置页'
        }
    },
    {
        path: '/pages/user/userexit',
        name: 'userexit',
        meta: {
            title: '原退出'
        }
    },
    // {
    // 	path: '/pages/user/location',
    // 	name: 'location',
    // 	meta: {
    // 		title: '原定位'
    // 	}
    // },
    {
        path: '/pages/common/exit',
        name: 'exit',
        meta: {
            title: '退出'
        }
    },
    {
        path: '/pages/common/success',
        name: 'success',
        meta: {
            title: 'success'
        }
    },
    {
        path: '/pages/addressbook/member',
        name: 'member',
        meta: {
            title: 'member'
        }
    }
];
export default routes;
