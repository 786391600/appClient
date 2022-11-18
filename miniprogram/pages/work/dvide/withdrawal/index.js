const until = require('../../../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  onLoad (options) {
    this.getWithDrawalList();
  },
  getWithDrawalList () {
    wx.showLoading({
      title: '记录获取中...',
    })
    let that = this;
    until.request({
      action: 'app.school.getWithDrawalList',
      data: {}
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        that.setData({
          list: res.data
        })
      }
      wx.hideLoading();
    })
  }
})