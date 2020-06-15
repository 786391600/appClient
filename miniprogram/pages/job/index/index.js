let app = getApp()

Page({
  data: {
    currentTab: null,
    items: [
      {
        "iconPath": "./img/index2.png",
        "selectedIconPath": "./img/index1.png",
        "text": "首页"
      },
      {
        "iconPath": "./img/car2.png",
        "selectedIconPath": "./img/car1.png",
        "text": "申请记录"
      },
      {
        "iconPath": "./img/my2.png",
        "selectedIconPath": "./img/my1.png",
        "text": "我的简历"
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
  setCurrentTab: function(tab){
    let that = this;
    this.setData({
      currentTab: tab
    })
    wx.setNavigationBarTitle({
      title: that.data.items[tab]['text']
    })
  }
})
