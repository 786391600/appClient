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
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (option) {
    if (option.relation === 'ticket') {
      this.setData({ component_index : {
        searchData : option
      }})
    } else if (option.relation === 'orderList') {
      this.setData({ currentTab : 1})
    }
  }
})
