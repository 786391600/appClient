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
        "iconPath": "./img/car2.png",
        "selectedIconPath": "./img/car1.png",
        "text": "抢单中心"
      },
      {
        "iconPath": "./img/my2.png",
        "selectedIconPath": "./img/my1.png",
        "text": "个人中心"
      }
    ]
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
    let currentTab = 0
    if (option && option.currentTab) {
       currentTab = option.currentTab
    }
    this.setCurrentTab(currentTab)
  },
  onShow: function() {
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
  setCurrentSchool () {
    if (!workGlobelData.currentSchool || Object.keys(workGlobelData.currentSchool).length <=0) {
      const schoolData = wx.getStorageSync('schoolData')
      if (schoolData && Object.keys(schoolData).length > 0){
        workGlobelData.currentSchool = schoolData
      } else {
        wx.navigateTo({
          url: '/pages/work/schoolList/index'
        })
      } 
    }
  }
})
