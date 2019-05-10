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
    HistoricalRecord: [],
    RecommendedRoute: [{ star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }, { star: '太原理工', end: '乡宁', time: '四月29日 19：10', monery: '30' }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTicketInfo()
    this.getHistorical()
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
  },
  /** 
  * 获取历史记录数据
 */
  getHistorical: function () {
    const value = wx.getStorageSync('Historical')
    if(value){
      this.setData({
        HistoricalRecord: value
      })
    }else{
      wx.setStorageSync('Historical', [])
    }
  },
  // 查询
  serch:function() {
    const value = wx.getStorageSync('Historical')
    if (value.some(this.checkAdult)==false){
      value.unshift({ star: this.data.startAddress, end: this.data.endAddress })
      if (value.length > 4) {
        value.pop()
      }
      wx.setStorageSync('Historical', value)
      this.setData({
        HistoricalRecord: value
      })
    }
    wx.navigateTo({
      url: '../calendar/index?star=' + this.data.startAddress + '&end=' + this.data.endAddress
    })
  },
  //查重
  checkAdult:function(data) {
    return data.star === this.data.startAddress && data.end===this.data.endAddress
  },
  //删除历史记录
  DelHistory:function() {
    wx.setStorageSync('Historical', [])
    this.setData({
      HistoricalRecord: []
    })
  },
  //历史查询
  HistoricalQuery:function (e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../calendar/index?star=' + e.currentTarget.dataset.star + '&end=' + e.currentTarget.dataset.end
    })
  }
})