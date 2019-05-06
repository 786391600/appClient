// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startAddress: '',
    endAddress: '',
    HistoricalRecord: [{ star: '太原理工', end: '乡宁' }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTicketInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 变换地址
   */
  exchangeAddress: function() {
    let b;
    let a = this.data.startAddress;
    let c = this.data.endAddress;
    if (a && c) {
      b = a
      a = c
      c = b
      this.setData({startAddress: a, endAddress: c})
    } else {
      return 
    }
  },
  /** 
   * 获取首页数据
  */
  getTicketInfo: function() {
    this.setData({startAddress: '太原理工', endAddress: '乡宁'})
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
    this.changetime();
    this.data.activityPage.page1 = 1;
    this.setActivityList({ page: 1, type: 'down' });
  }
})