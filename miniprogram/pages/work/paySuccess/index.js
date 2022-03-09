// pages/Testpage/Paysuccess/Paysuccess.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityId: '',
    config: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let config = options.config ? JSON.parse(options.config) : {};
    let type = ''
    if (options.type === 'success') {
      type = 'success'
    } else {
      type = 'fail'
    }
    this.setData({ type: type, config: config})
    wx.setNavigationBarTitle({
      title: '支付状态'
    })
    wx.setNavigationBarColor({
      backgroundColor: '#FCD844',
      frontColor: '#ffffff'
    })
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
      url: '/pages/work/index/index?currentTab=1'
    })
  },
  payFail (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    if (type === 'reload') {
      wx.navigateBack({})
    } else {
      wx.reLaunch({
        url: '/pages/work/index/index'
      })
    }
  },
  customClick () {
    if (this.data.config.tipImage) {
      let url = this.data.config.tipImage;
      wx.previewImage({
        urls: [url]
      })
    }
  }
})