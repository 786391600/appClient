// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: '1', //切换标题 1：活动 2：首页 3：商品,
    newDate: '',
    activityList: [],
    commodityList: [],
    activityPage: {
      page1: 1,
      page2: 1
    },
    navHeight: 0,
    lodingTip: '暂时没有更多数据，稍后再来~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({ navHeight: app.globalData.navHeight})
    this.changetime()
    this.setActivityList({type:'up', page: that.data.activityPage.page1})
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
   * 切换首页
   */
  changestate: function(e) {
    this.setData({
      active: e.currentTarget.dataset.active
    })
    if (e.currentTarget.dataset.active === '1'){
      this.data.activityPage.page1 = 1;
      this.setActivityList({ page: 1, type: 'down' });
    } else {
      this.data.activityPage.page2 = 1;
      this.setCommodityList({ page: 1, type: 'down' });
    }
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
   * 改变时间
   */
  changetime: function() {
    var data = new Date()
    var year = data.getFullYear()
    var month = data.getMonth() + 1
    var day = data.getDate()
    var time = [year, month, day].map(formatNumber).join('/')
    function formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    console.log(time)
    this.setData({
      newDate: time //改变时间
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    this.data.activityPage.page1++
    this.setActivityList({ page: that.data.activityPage.page1, type: 'up'});
  },
  getActivityList: function(query){
    var query = query || {};
    return new Promise((resolve, reject) => {
      console.log(query)
      until.request({
        action: 'app.activity.getActivityList',
        data: query
      }).then(function (e) {
        if (e.data.success){
          resolve(e.data.data)
        }
      }) 
    })
  },
  getCommodityList: function (query) {
    var that = this;
    var query = query || {}
    return new Promise((resolve, reject)=>{
      until.request({
        action: 'app.commodity.getCommodityList',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e.data.data)
        }
      })
    })
  },
  getActivityInfo (e) {
    var data = e.currentTarget.dataset.details;
    wx.navigateTo({
      url: '/pages/activity/index?activityId='+data.id
    })
  },
  getCommodityInfo (e) {
    var data = e.currentTarget.dataset.details;
    wx.navigateTo({
      url: "/pages/commodity/index?clickId=" + data.id
    })
  },
  setActivityList (obj) {
    var that = this;
    // obj.page 页数  type 上拉 下滑
    var page = obj.page || 1;
    var type = obj.type || 'up'
    that.setData({ lodingTip: "玩命加载中！" })
    this.getActivityList({ page: page}).then((data) => {
      if (data && data.length > 0) {
        if (type === 'up') {
          var list = that.data.activityList.concat(data)
        } else {
          wx.stopPullDownRefresh()
          var list = data;
        }
        that.setData({ activityList: list })
      } else {
        that.data.activityPage.page1 = (page - 1)!=0 ? page-1 : 1;
        that.setData({ lodingTip: "暂时没有更多数据，稍后再来~" })
      }
    })
  },
  setCommodityList (obj) {
    var that = this;
    // obj.page 页数  type 上拉 下滑
    var page = obj.page || 1;
    var type = obj.type || 'up'
    that.setData({ lodingTip: "玩命加载中！" })
    this.getCommodityList({ page: page }).then((data) => {
      if (data && data.length > 0) {
        if (type === 'up') {
          var list = that.data.activityList.concat(data)
        } else {
          wx.stopPullDownRefresh()
          var list = data;
        }
        that.setData({commodityList: list })
      } else {
        that.data.activityPage.page2 = (page - 1) != 0 ? page - 1 : 1;
        that.setData({ lodingTip: "暂时没有更多数据，稍后再来~" })
      }
    })
  }
})