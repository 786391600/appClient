// miniprogram/pages/VehicleList/index.js
const until = require('../../../until/index.js')
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
      ],
      lineList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lineInfo = JSON.parse(options.lineInfo)
    this.getCarList({departureTime: { $regex: options.date }, fleetId: lineInfo.fleet, start: lineInfo.start, end: lineInfo.end}).then((e) => {
      let getdata = e.data.data
      this.setData({
        carList: getdata,
        lineInfo: lineInfo
      })
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
  // 跳转车次详情
  goTicketDetails:function (e) {
    let carInfo = JSON.stringify(e.currentTarget.dataset.detail)
    let lineInfo = JSON.stringify(this.data.lineInfo)
    console.log(e, '000000000000')
    if (e.currentTarget.dataset.num <= 0) {
      wx.showToast({
        title: '票已售光',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../OrderPayment/index?carInfo=' + carInfo + '&lineInfo=' + lineInfo
    })
  },
  // 获取数据
  getCarList: function (query) {
    let that = this
    wx.showLoading({
      title: '车辆获取中...',
    })
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.line.getCarList',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e)
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    })
  }
})