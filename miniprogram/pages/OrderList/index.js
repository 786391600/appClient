// miniprogram/pages/OrderList/index.js
const until = require('../../until/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: []
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
    console.log('uuuuuuuuuuuuu')
    this.getOrderList()
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
  GoPopup:function (item){
    let orderInfo = item.target.dataset.info
    let departureTime = orderInfo.line_info[0].departureTime
    let canRefound = this.getCurrentDay(departureTime)
    if (canRefound) {
      wx.showToast({
        title: '发车当天以后不能退票'
      })
    }
    return
    let that = this
    let orderIndex = item.target.dataset.index
    wx.showModal({
      title: '退款提示',
      content: '退款将会扣除违约费用，确认退票？',
      success: function (res) {
        if (res.confirm) {
          console.log(orderInfo, 'iiiiii')
          that.refound(orderInfo, orderIndex)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getOrderList () {
    let that = this
      until.request({
        action: 'app.line.getOrderList',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          console.log(e.data.data)
          let getdata = e.data.data
          that.setData({
            order: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
      })
  },
  refound (orderInfo, index) {
    let that = this
    let out_trade_no = orderInfo.out_trade_no
    wx.showLoading({
      title: '退款中...',
    })
    until.request({
      action: 'app.until.refund',
      data: {orderInfo: orderInfo}
    }).then(function (e) {
      if (e.data.success) {
       let refoundInfo = e.data.data.xml
        if (refoundInfo.result_code[0] === 'SUCCESS') {
          let data = that.data.order
          data[index]['refound'] = true
          that.setData({order: data})
          wx.showModal({
            title: '退款成功',
            content: '具体到账以微信到账为准。'
          })
        }
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
  toTicket () {
    wx.switchTab({
      url: '/pages/ticket/index',
    })
  },
  toContacts (e) {
    let phone = e.currentTarget.dataset.phone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    }
  },
  toOrderDetail (e) {
    let refound = e.currentTarget.dataset.orderinfo.refound
    console.log(e.currentTarget.dataset.orderinfo)
    if (refound) {
      return
    }
    let orderInfo = JSON.stringify(e.currentTarget.dataset.orderinfo)
    wx.navigateTo({
      url: '/pages/OrderDetail/index?orderInfo=' + orderInfo,
    })
  },
  getCurrentDay(departureTime) {
    let date = departureTime ? new Date(departureTime) :new Date()
    let date1 = new Date();
    let departureMonth = date.getMonth() + 1;
    departureMonth = (departureMonth < 10 ? "0" + departureMonth : departureMonth)
    let departureDay = date.getDate()
    departureDay = (departureDay < 10 ? "0" + departureDay : departureDay)
    let departure = date.getFullYear() + '/' + departureMonth + '/' + departureDay
    var d=new Date(Date.parse(departure))
    return date1 >= d
  }
})