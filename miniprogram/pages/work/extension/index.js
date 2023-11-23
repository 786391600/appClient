// pages/work/extension/index.js
const app = getApp()
const until = require('../../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['分享小程序', '分享文案', '公众号对接'],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getPosterImage()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    let title = '大巴车票预定'
    let path = '/pages/booking/index/index'
    return {
      title: title,
      path: path,
      imageUrl: 'https://s2.ax1x.com/2020/01/02/lYKjYR.png'
    }
  },
  tabChange (e) {
    let activeIndex = Number(e.detail.activeIndex);
    this.setData({
      activeIndex: activeIndex
    })
  },
  getPosterImage(){
    var that = this;
    wx.showLoading({
      title: '链接获取中'
    })
    until.request({
      action: 'app.job.generatescheme',
      data: {}
    }).then(function (e) {
      wx.hideLoading()
      if (e.data.success) {
        console.log(e)
      } else {
        until.showToast(e.data.message, 'error');
      }
    })
  },
  // 我的钱包
  toMoney() {
    wx.navigateTo({
      url: '/pages/work/money/index'
    })
  }
})