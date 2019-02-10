// pages/Testpage/personal/index.js
const app = getApp()
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",//窗口高度,
    navHeight: 0,
    activityList: [],
    authShow: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({ navHeight: app.globalData.navHeight, winHeight: app.globalData.windowHeight}) 
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
    this.onPullDownRefresh()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    this.data.page++;
    that.getExchangeCard().then((list) => {
      if (list.length > 0){
        var list = that.data.activityList.concat(list);
        that.setData({activityList: list})  
      } else {
        that.data.page--;
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 切换个人中心订单与活动
   */
  changestate: function(e) {
    this.setData({
      active: e.currentTarget.dataset.active
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    console.log(e.detail.current)
    this.setData({
      active: e.detail.current
    });
  },
  //下拉刷新
  upper: function () {
    console.log("刷新");
    wx.setNavigationBarTitle({
      title: '刷新中……'
    }) //动态设置当前页面的标题。
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
    //this.loadProduct2();//重新加载产品信息
    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
    wx.setNavigationBarTitle({
      title: ''
    }) //动态设置当前页面的标题。
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    // page = page + 1;
    console.log('加载中')
    // 隐藏加载弹框
    wx.hideLoading();
    console.log('加载完成')
  },
  getExchangeCard: function (query) {
    var query = query || {};
    query.limit = 10;
    query.skip = (this.data.page -1)*query.limit;
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.personalCenter.getExchangeCard',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e.data.data)
        }
      })
    })
  },
  toQRcode: function (e) {
    var that = this;
    var data = e.currentTarget.dataset.details;
    wx.navigateTo({
      url: '/pages/QRcode/index?partakeId=' + data.id + '&address=' + data.activity.merchants.address
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画。
    that.data.page = 1;
    that.getExchangeCard().then((list) => {
      that.setData({ activityList: list })
      wx.stopPullDownRefresh()
    })
  },
  setInfoSuccess(e) {
    this.setData({ userAuth: false, userInfo: e.detail})
  },
  GoHome: function () {
    var that = this;
    wx.switchTab({
      url: '/pages/home/index'
    })
  }
})