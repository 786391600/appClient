let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
Page({
  data: {
    withdrawalAmount: 0
  },
  onLoad (options) {
    this.getUserAuth()
  },
  withdrawalClick () {
    wx.showModal({
      title: '提现提示',
      content: '自动提现功能暂未开放，提现请联系负责人！',
      showCancel: false
    })
  },
  getUserCapital () {
    let that = this;
    app.getUserInfo(function(e){
      let capital = e.capital || 0;
      that.setData({
        withdrawalAmount: capital
      })
    }, true)
  },
  getUserAuth () {
    let that = this;
    wx.showLoading({
      title: '任务获取中...',
    })
    until.request({
      action: 'app.crowd.getUserAuth',
      data: {}
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        let resData = e.data.data;
        if (resData && resData.account) {
          let fee = resData.hasOwnProperty('settlement') ? resData['settlement'] : 0;
          that.setData({
            withdrawalAmount: fee
          })
        } else {
          that.setData({
            noAuth: true
          })
        }
      } else {
        that.setData({
          noAuth: true
        })
      }
      wx.hideLoading()
    })
  }
})
