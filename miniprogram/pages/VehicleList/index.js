// miniprogram/pages/VehicleList/index.js
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RidingScheme: [
      { LicensePlate: 'GS1740', Price: 30, Route: [
        { Throughout: 1, time: '17:40', content: '小北地铁站B出口' },
        { Throughout: 0, time: '17:50', content: '小北地铁站A出口' },
      ], distance: 90, Surplus: '充足', provider: '意点科技'
      }, {
        LicensePlate: 'GS1740', Price: 30, Route: [
          { Throughout: 1, time: '17:40', content: '小北地铁站B出口' },
          { Throughout: 0, time: '17:50', content: '小北地铁站A出口' },
        ], distance: 90, Surplus: '充足', provider: '意点科技'
      }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      star: options.star,
      end: options.end
    })
    this.getLineManage({ start: options.star, departureTime: "2019-06-12" })
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
  // 跳转车次详情
  goTicketDetails:function () {
    wx.navigateTo({
      url: '../TicketDetails/index'
    })
  },
  // 获取数据
  getLineManage: function (query) {
    let that = this
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.line.getLineManage',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e)
          let getdata = e.data.data
          that.setData({
            RecommendedRoute: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
      })
    })
  }
})