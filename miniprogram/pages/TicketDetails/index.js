// miniprogram/pages/TicketDetails/index.js
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 跳转订单支付页面
  goOrderPayment:function (){
    wx.navigateTo({
      url: '../OrderPayment/index'
    })
  },
  // 跳转购票须知页面
  goNotice: function () {
    wx.navigateTo({
      url: '../Notice/index'
    })
  },
  CallPhone:function (e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  payTest: function(){
    until.pay({
      body: '购买车票',
      fee: 0.2,
      type: 'test'
    }).then((res) => {
      console.log(res)
    }).catch((res) => {
      console.log(res, 'pay faile')
    })
  },
  refund: function(){
    until.request({
      action: 'app.until.refund',
      data: { "out_trade_no": "20190622111116197"}
    }).then(function (e) {
      if (e.data.success) {
       console.log(e)
       console.log('uuuuuuuuuu')
      } else {
        console.log(e)
        until.showToast(e.data.message, 'error');
      }
    })
  }
})