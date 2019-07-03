// miniprogram/pages/OrderPayment/index.js
const until = require('../../until/index.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    riderList: [],
    riderDetail: {},
    name: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRiderData(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let riderList = app.globalData.selectRiderList || []
    this.setData({riderList: riderList})
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
  // 表单信息
  formSubmit: function (e) {
    console.log(e)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let priceObj = this.validateSubmit(e.detail.value)
    let formId = e.detail.formId
    wx.setStorage({
      key: 'name',
      data: priceObj.name
    })
    wx.setStorage({
      key: 'phone',
      data: priceObj.phone
    })
    if (!priceObj) {
      return
    }
    until.pay({
      body: '汽车订单',
      fee: priceObj.price,
      lineId: priceObj.lineId,
      type: 'ticket',
      name: priceObj.name,
      phone: priceObj.phone,
      riderList: priceObj.riderList,
      formId: formId
    }).then((res) => {
      wx.navigateTo({
        url: '/pages/paySuccess/index?type=success',
      })
    }).catch((res) => {
      if (res.notEnough) {
        wx.showToast({
          title: '车票剩余不足,请查看其他线路',
          icon: 'none',
          duration: 3000
        })
      } else {
        if (res.out_trade_no) {
          this.delOrder(res.out_trade_no)
        }
      }
    })
  },
  toRider () {
    wx.navigateTo({
      url: '/pages/rider/index'
    })
  },
  removeRider (e) {
    let index = e.target.dataset.index;
    this.data.riderList.splice(index, 1)
    this.setData({riderList: this.data.riderList})
    app.globalData.selectRiderList = this.data.riderList
  },
  initRiderData (options) {
    let riderDetail = JSON.parse(options.detail);
    let that = this;
    until.request({
      action: 'app.line.getRiderList',
      data: {isDefault: true}
    }).then(function (e) {
      if (e.data.success) {
        app.globalData.selectRiderList = e.data.data || []
        let name = wx.getStorageSync('name') || '';
        let phone = wx.getStorageSync('phone') || ''
        that.setData({ riderDetail: riderDetail, riderList: app.globalData.selectRiderList, name: name, phone: phone})
      }
    })
  },
  validateSubmit (data) {
    let title = ''
    if (!data.name) {
      wx.showToast({
        title: '联系人必填',
        icon: 'none'
      })
      return false
    }
    if (!data.phone) {
      wx.showToast({
        title: '联系手机必填',
        icon: 'none'
      })
      return false
    }
    if (this.data.riderList.length === 0) {
      wx.showToast({
        title: '乘车人必填',
        icon: 'none'
      })
      return false
    }
    let price = this.data.riderList.length * this.data.riderDetail.price
    return {phone: data.phone, name: data.name, price: price, riderList: this.data.riderList, lineId: this.data.riderDetail.id}
  },
  delOrder(out_trade_no) {
    until.request({
      action: 'app.line.delOrder',
      data: { out_trade_no: out_trade_no}
    }).then(function (e) {
      if (e.data.success) {
        wx.navigateTo({
          url: '/pages/paySuccess/index',
        })
      }
    })
  }
})