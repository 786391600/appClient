const until = require('../../../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isprocess: false
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
      action: 'app.school.oprateWithDrawalList',
      data: {}
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        that.setData({
          list: res.data
        })
      }
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
  },
  toExamine (e) {
    if (this.data.isprocess) {
      return;
    }
    this.data.isprocess = true;
    let queryData = e.target.dataset;
    let index = queryData.itemindex;
    let that = this;
    wx.showLoading({
      title: '审核中...',
      mask: true
    })
    until.request({
      action: 'app.school.confirmWithdrawal',
      data: {
        id: queryData.id
      }
    }).then(function (e) {
      let res = e.data;
      wx.hideLoading()
      if (res.success) {
        wx.showModal({
          title: '提示',
          content: '提现审核成功!'
        })
        that.data.list.splice(index, 1);
        that.setData({
          list: that.data.list
        })
      } else {
        wx.showModal({
          title: '审核失败',
          content: res.message || ''
        })
      }
      this.data.isprocess = false;
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
  },
  onPullDownRefresh () {
    this.getWithDrawalList();
  },
  toSettlementlist (e) {
    console.log(e)
    let item = e.currentTarget.dataset.item;
    if (item.shopId) {
      let shopId = item.shopId;
      if (!shopId) {
        return
      }
      wx.navigateTo({
        url: '/pages/work/business/settlementlist/index?id=' + shopId
      })
    }
  }
})