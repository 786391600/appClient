let app = getApp()

Page({
  data: {
    currentTab: 0,
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
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (option) {
     
  }
})
