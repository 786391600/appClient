let app = getApp()

Page({
  data: {
    currentTab: 0,
    items: [
      {
        "iconPath": "./img/Reserve.png",
        "selectedIconPath": "./img/Reserve-select.png",
        "text": "预定"
      },
      {
        "iconPath": "./img/ticket.png",
        "selectedIconPath": "./img/ticket-select.png",
        "text": "乘车订单"
      }
    ],
    component_index: {
      searchData: {}
    }
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
    if (option.relation === 'ticket') {
      this.setData({ component_index : {
        searchData : option
      }})
    } else if (option.relation === 'orderList') {
      this.setCurrentTab(1)
    }
  },
  setCurrentTab: function (tab) {
    let that = this;
    this.setData({
      currentTab: tab
    })
    wx.setNavigationBarTitle({
      title: that.data.items[tab]['text']
    })
  }
})
