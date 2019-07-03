// pages/Testpage/Paysuccess/Paysuccess.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // this.data.commodityId = options.id;
    // this.data.title = options.title;
    let type = ''
    if (options.type === 'success') {
      type = 'success'
    } else {
      type = 'fail'
    }
    this.setData({ type: type})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   var that = this;
   console.log(app.globalData)
    return {
      title: that.data.title,
      imageUrl: app.globalData.shareData.imageUrl,
      path: "/pages/commodity/index?clickId="+that.data.commodityId
    }
  },
  paySuccess () {
    wx.reLaunch({
      url: '/pages/OrderList/index'
    })
  },
  payFail (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    if (type === 'reload') {
      wx.navigateBack({
        url: '/pages/OrderPayment/index'
      })
    } else {
      wx.reLaunch({
        url: '/pages/ticket/index'
      })
    }
  }
})