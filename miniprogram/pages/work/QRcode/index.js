// pages/Testpage/QRcode/index.js
const app = getApp()
const until = require('../../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrUrl: "",
    address: {},
    phoneStr: '',
    name: '' // 商家名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.getQrImage(options)
   const businessInfo = JSON.parse(options.businessInfo) || null
   const address = businessInfo.address || null;
   const shopAddressInfo = address.shopAddressInfo || null
   const phone = address.phone || ''
   const phoneStr = phone.substr(-4)
    this.setData({
      name: businessInfo.name,
      address: shopAddressInfo,
      phoneStr: phoneStr
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

  },
  getQrImage: function(options){
    let that = this
    wx.showLoading({
      title: '核销码获取中...',
    })
    let query = {
      str: options.str
    }
    until.request({
      action: 'app.crowd.getQrImage',
      data: query
    }).then(function (e) {
      if (e.data.success) {
        that.setData({qrUrl: e.data.data})
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
  toAddress (e) {
    const info = e.currentTarget.dataset.info;
    if (!info.coordinate) {
      return
    }
    let coordinate = info.coordinate.split(',')
    const that = this;
    wx.openLocation({
      name: that.data.name,  // 位置名
      latitude: new Number(coordinate[0]),
      longitude: new Number(coordinate[1]),
      address: info.address,  // 要去的地址详情说明
    });
  },
  mackPhoneCall (e) {
    console.log(e, 'eee')
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log('成功拨打电话')
      }
    })
  }
})