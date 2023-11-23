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
    console.log(option, 'ticket option')
    if (option.relation === 'ticket') {
      this.setData({ component_index : {
        searchData : option
      }})
    } else if (option.relation === 'orderList') {
      this.setData({ component_index : {
        searchData : option
      }})
      this.setCurrentTab(1)
    }
  },
  changeTab: function(tab) {
    console.log(tab, 'lll')
    this.setCurrentTab(tab.detail.value)
  },
  setCurrentTab: function (tab) {
    let that = this;
    this.setData({
      currentTab: tab
    })
    wx.setNavigationBarTitle({
      title: that.data.items[tab]['text']
    })
  },
  onShareAppMessage: function (res) {
    console.log(res)
    let shareTitle = '在线购票，轻松出行！'
    let shareS = ''
    let shareImg = 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDhHkxQ21QxBK5Uu8DjsET8vzdgsqTSPCnyBXaWHibemSxzCYIOh8gD4lrP4g8eicLicxcZQQQ6TGsbQw/0';
    if (res.target.dataset.info) {
      let info = res.target.dataset.info
      shareTitle ='【在线购票】' + info.start + '-' + info.end;
      shareS = '?relation=ticket&data=' + info.start + '&data2=' + info.end;
    }
    console.log(shareS)
    return {
      title: shareTitle,
      path: '/pages/booking/index/index' + shareS,
      imageUrl: shareImg,  //用户分享出去的自定义图片大小为5:4,
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
  },
  onShareTimeline: function(res) {
    let shareTitle = '在线购票，轻松出行！'
    let shareS = ''
    let shareImg = 'http://mmbiz.qpic.cn/mmbiz_png/5XHic5LQPCDhHkxQ21QxBK5Uu8DjsET8vzdgsqTSPCnyBXaWHibemSxzCYIOh8gD4lrP4g8eicLicxcZQQQ6TGsbQw/0';
    if (res && res.target && res.target.dataset.info) {
      let info = res.target.dataset.info
      shareTitle ='【在线购票】' + info.start + '-' + info.end;
      shareS = '?relation=ticket&data=' + info.start + '&data2=' + info.end;
    }
    console.log(shareS)
    return {
      title: shareTitle,
      path: '/pages/booking/index/index' + shareS,
      imageUrl: shareImg,  //用户分享出去的自定义图片大小为5:4,
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
