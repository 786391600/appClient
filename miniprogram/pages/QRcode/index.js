// pages/Testpage/QRcode/index.js
const app = getApp()
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrUrl: "",
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQrImage(options)
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
  getQrImage: function(options){
    var partakeId = '';
    var address = '';
    if (options && options.partakeId){
      partakeId = options.partakeId
      address = options.address
    } else {
      return false;
    }
    var that = this;
    let query = {
      action: 'until',
      data: {
        name: 'getQrImage',
        str: partakeId
      }
    }
    until.getQrImage(query).then((e)=>{
      console.log(e)
      that.setData({qrUrl: e.data, address: address})
    })
  }
})