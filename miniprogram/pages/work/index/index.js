let app = getApp()
const workGlobelData = require('../globleData.js')
Page({
  data: {
    currentTab: null,
    items: [
      {
        "iconPath": "./img/index2.png",
        "selectedIconPath": "./img/index1.png",
        "text": "下单中心"
      },
      {
        "iconPath": "./img/jz2.png",
        "selectedIconPath": "./img/jz1.png",
        "text": "接单大厅"
      },
      {
        "iconPath": "./img/car2.png",
        "selectedIconPath": "./img/car1.png",
        "text": "我的订单"
      },
      // {
      //   "iconPath": "./img/my2.png",
      //   "selectedIconPath": "./img/my1.png",
      //   "text": "个人中心"
      // }
    ],
    schoolId: '',
    bs: '' // 初始业务
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setCurrentTab(e.target.dataset.current)
    }
  },
  onLoad: function (option) {
    console.log(option)
    console.log('onload==================================')
    if (option.channelId) {
      workGlobelData.channelId = option.channelId;
    }
    let currentTab = 0
    if (option && option.currentTab) {
       currentTab = option.currentTab
    }
    this.setCurrentTab(currentTab)
    this.setSchoolId(option);
  },
  onShow: function(options) {
    console.log(options, '------------------')
    console.log('onshow=======================')
    // this.setCurrentSchool()
  },
  setCurrentTab: function(tab){
    let that = this;
    this.setData({
      currentTab: tab
    })
    wx.setNavigationBarTitle({
      title: that.data.items[tab]['text']
    })
  },
  setSchoolId (options) {
    let schoolId = '';
    if (options.schoolId) {
      schoolId = options.schoolId;
    } else {
      if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
        schoolId = workGlobelData.currentSchool.id;
      } else {
        const schoolData = wx.getStorageSync('schoolData')
        if (schoolData && Object.keys(schoolData).length > 0){
          schoolId = schoolData.id;
        }
      }
    }
    if (!schoolId) {
      wx.navigateTo({
        url: '/pages/work/schoolList/index'
      })
      return;
    }
    if (options.schoolId) {
      let setData = {};
      ['schoolId', 'bs'].forEach((item) => {
        if (options[item]) {
          setData[item] = options[item];
        }
      });
      this.setData(setData)
    }
  },
  onShareAppMessage: function (res) {
    let schoolData = wx.getStorageSync('schoolData');
    let title = '么么校帮手'
    if (schoolData && schoolData.name) {
      title = '校帮手-' + schoolData.name;
    }
    console.log(schoolData.id)
    return {
      title: title,
      path: '/pages/work/index/index?schoolId=' + schoolData.id,
      imageUrl: 'http://img.beijixiong.club:8081/img/dc62939444f589a3e0de8fbbb642217b',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
     // 转发成功
          wx.showToast({
            title: "分享成功",
            icon: 'success',
            duration: 2000
          })
       },
      fail: function (res) {
        // 分享失败
      },
    }
  }
})
