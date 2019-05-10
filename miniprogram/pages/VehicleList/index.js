// miniprogram/pages/VehicleList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RidingScheme: [
      { LicensePlate: 'GS1740', Price: 30, Route: [
        { Throughout: 1, time: '17:40', content: '小北地铁站B出口' },
        { Throughout: 0, time: '17:50', content: '小北地铁站A出口' },
        ], distance: 90, Surplus: '充足', provider:'意点科技'}
      ]
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

  }
})