// pages/Testpage/OrderNumber/OrderNumber.js
const app = getApp()
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: '0',
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ navHeight: app.globalData.navHeight })
    this.getOrderList()
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

  },
  getOrderList: function() {
    var limit = 10;
    var skip = 0;
    var that = this;
    until.request({
      action: 'app.commodity.getOrderList',
      data: {
        limit: limit,
        skip: skip
      }
    }).then(function (e) {
      if(e.data.success){
        console.log(e.data.data)
        var orderList = that.data.orderList.concat(e.data.data)
        that.setData({ orderList: orderList})
      }
    })
  }
})