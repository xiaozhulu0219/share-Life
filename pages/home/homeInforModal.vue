<template>
    <view class="list-wrap">
        <scroll-view scroll-y @scrolltolower="reachBottom" style="height: 100%;">
            <view v-for="(item,index) in homeList" :key="index" class="card">
<!--                <image class="medias_size" :src="item.medias[0]" mode="aspectFit" alt="" @click="toInformationDetail(item)"></image>-->
                <image class="medias_size" :src="item.medias[0]" mode="widthFix" alt="" @click="toInformationDetail(item)"></image>
                <view class="card-text" @click="toInformationDetail(item)">
                  {{ contentFormat(item.textContent) }}
                <view class="colpose"></view>
                </view>
                <view class="card-line">
                  <view class="left">
                    <image class="card-avatar round" :src="item.avatar" mode="aspectFit" alt="" @click="toMemberdetail(item.uuId)"></image>
                    <view class="card-nickname">{{item.nickname.substr(0, 12)}}</view>
                  </view>
                  <view class="right">
                    <view class="cuIcon-location"> </view>
                    <view class="card-ipAddress">{{item.ipAddress}}</view>
                    <view class="cuIcon-like" style="color: #fbbd08" v-if="item.hasLoved == 0" @click="loveInfor(item.inforId,index)"></view>
                    <view class="cuIcon-likefill" style="color: #dd524d" v-else @click="unloveInfor(item.inforId,index)"></view>
                    <view class="card-loveCount">{{item.loveCount}}</view>
                  </view>
                </view>
            </view>
            <view v-if='isDownLoading' class="load-text">加载中....</view>
            <view v-if="!isDownLoading && !hasNext" class="noMore">---没有更多动态了，快去分享你的美好生活吧---</view>
        </scroll-view>
    </view>
</template>

<script>
    import configService from '@/common/service/config.service.js';

    export default {
        data() {
            return {
                pageInfo: {
                    num: 0,
                    size: 10
                },
                hasNext: true,
                isDownLoading: false,
                unloveInforUrl: '/information/movements/unlove',
                loveInforUrl: '/information/movements/love',
                homeListUrl: '/information/movements/findHomePublishInforList',
                homeList: [], // 上拉加载的配置(可选, 绝大部分情况无需配置)
                fileUrl: configService.fileSaveURL,
            };
        },
        computed: {
          contentFormat() {
            return function(content) {
              return `${content.substring(0, 38)}${content.length > 38 ? ' ...' : ''}`;
            };
          }
        },
        created() {
         //activated() {
            console.log(9999);
            this.getHomePublishInforList();
        },
        methods: {
            // 触底加载
            reachBottom() {
                if (!this.hasNext) return;
                console.log('//// 触底加载');
                this.getHomePublishInforList();
            },
            getHomePublishInforList() {
                if (this.isDownLoading) return;
                this.isDownLoading = true;
                this.pageInfo.num++;
                const { homeListUrl, pageInfo: { num, size } } = this;
                this.$http.get(homeListUrl, {
                    params: { page: num, pagesize: size }
                }).then(res => {
                    const { success, result } = res.data;
                    console.log('。。。。。', result.items);
                    if (success) {
                        const { pages, items, page } = result;
                        if (num === 1) this.homeList = [];
                        if (items.length) {
                            for (const d of items) {
                                const arr = d?.medias?.split(',');
                                const arr2 = [];
                                for (let e of arr) {
                                    e = this.fileUrl + e;
                                    arr2.push(e);
                                }
                                d.avatar = this.fileUrl + d.avatar;
                                d.medias = arr2;
                            }
                        }
                        this.homeList = this.homeList.concat(items);
                        this.hasNext = pages > page;
                        this.isDownLoading = false;
                    } else {
                        this.isDownLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.isDownLoading = false;
                });
            },
            toInformationDetail(item) {
                uni.navigateTo({
                    url: '/pages/home/homeInforDetail?item=' + encodeURIComponent(JSON.stringify(item))
                });
            },
            //喜欢动态
            loveInfor(id) {
                this.$http.get(this.loveInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        this.getHomePublishInforList();
                    }
                });
            },
            //取消喜欢动态
            unloveInfor(id) {
                this.$http.get(this.unloveInforUrl, { params: { id: id } }).then((res) => {
                    if (res.data.success) {
                        this.getHomePublishInforList();
                    }
                });
            },
            //点击头像跳转用户详情
            toMemberdetail(myFormData) {
                //判断如果跳转的动态页的uuid 是当前登录用户的  那就跳到自己的个人页
                if (this.$store.getters.uuId == myFormData) {
                    uni.navigateTo({
                        url: '/pages/member/member'
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/home/homeMemberDetail?item=' + encodeURIComponent(JSON.stringify(myFormData))
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .list-wrap {
        height: calc(100vh - 280rpx);
    }
    .card {
        background-color:  #fff;
        padding: 20rpx 20rpx;
        border-radius: 20rpx;
        line-height: 35rpx;  /*行高*/
        border-bottom: #eee solid 5rpx;

        .card-line {
            font-weight: bold;
            display: flex;
        }

        .card-nickname {
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 80%;
            overflow: hidden;
        }

        .card-ipAddress, .card-loveCount {
            font-weight: bold;
            margin-left: 8rpx;
        }
        .card-ipAddress {
          margin-right: 50rpx;
        }
        .card-loveCount {
            font-weight: bold;
            margin-left: 8rpx;
        }

        .card-text {
            font-size: 36rpx;
            margin-bottom: 10rpx; /*盒子间的距离*/
            line-height: 55rpx;  /*行高*/
        }

        .card-location {
            position: absolute;
            right: 20rpx;
            font-size: 20rpx;
        }

        .card-avatar {
            max-width: 20px;
            width: 20px;
            height: 20px;
        }

    }
    .medias_size {
        max-width: 180px;
        width: 180px;
        height: 180px;
        overflow:hidden;
        margin-bottom: 20rpx; /*盒子间的距离*/
    }

    .load-text, .noMore {
        background-color: #fff;
        text-align: center;
        padding: 4rpx;
    }

    .noMore {
        color: #ccc;
    }
    .left,.right {
      display: flex;
      align-items: center;
      flex: 1;
    }
    .left {
      overflow: hidden;
      flex: 2;
    }
    .right{
      flex-shrink: 0;
      flex: 1;
    }
</style>
