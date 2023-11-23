// miniprogram/pages/OrderList/index.js
const until = require('../../../until/index.js')
const np = require('../../../until/number.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    showNotify: false,
    // 预计到达时间
    reachTime: null,
    ruleList: [],
    currentPg: 0,
    currentHours: 0,
    currentFee: 0,
    refoundConfig: '',
    departureTime: '',
    canrefound: false,
    refounding: false,
    refoundText: '申请退票'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      this.getOrderInfoById(options.orderId)
    } else if (options.orderInfo) {
      let orderInfo = JSON.parse(options.orderInfo)
      // this.setData({orderInfo: orderInfo})
      // this.getRefoundInfo(orderInfo) 
      this.getOrderInfoById(orderInfo.out_trade_no)
    }
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
  getRefoundInfo: function (info) {
    let orderInfo = info;
    let departureTime = ''
    if (orderInfo.car_info && orderInfo.car_info[0] && orderInfo.car_info[0].departureTime) {
      departureTime = orderInfo.car_info[0].departureTime
    } else if (orderInfo.departureTime) {
      departureTime = orderInfo.departureTime
    } else {
      wx.showModal({
        title: '退款提示',
        content: '订单异常，请联系管理员~'
      })
      return
    }
    let refoundConfig = '72-15;48-30;24-100'
    if (orderInfo.fleet_info && orderInfo.fleet_info[0] && orderInfo.fleet_info[0].refoundConfig) {
      refoundConfig = orderInfo.fleet_info[0].refoundConfig
    } else if (orderInfo.car_info && orderInfo.car_info[0] && orderInfo.car_info[0].refoundConfig) {
      refoundConfig = orderInfo.car_info[0].refoundConfig
    }
    this.getRuleList(refoundConfig, departureTime)

    // let hours = this.getHours(departureTime)

    // let configList = refoundConfig.split(';').map((item) => {
    //   let arr = item.split('-')
    //   return {
    //     hours: Number(arr[0]),
    //     pg: Number(arr[1])
    //   }
    // }).sort((a, b) => {
    //   return a.hours - b.hours
    // })
    // let currentPg = 100;
    // configList.some((item) => {
    //   if (hours < item.hours) {
    //     currentPg = item.pg
    //   }
    // })
    // if (currentPg <= 0) {
    //   wx.showToast({
    //     title: '退票时间已过，不予退票',
    //     icon: 'none'
    //   })
    //   return
    // }
    // let that = this
    // let orderIndex = item.target.dataset.index
    // let tip = this.CalculateThePrice(departureTime)
    // wx.showModal({
    //   title: '退款提示',
    //   content: tip,
    //   success: function (res) {
    //     if (res.confirm) {
    //       that.refound(orderInfo, orderIndex)
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  getRuleList (refoundConfig, departureTime) {
    let configList = refoundConfig.split(';').map((item) => {
      let arr = item.split('-')
      return {
        hours: Number(arr[0]),
        pg: Number(arr[1])
      }
    }).sort((a, b) => {
      return a.hours - b.hours
    })
    let hours = this.getHours(departureTime)
    let currentPg = 0;
    let currentHours = 0;
    let currentFee = this.data.orderInfo.fee;
    // let currentFee = 100
    configList.some((item) => {
      if (hours < item.hours) {
        currentPg = item.pg;
        currentHours = item.hours;
        return true
      }
    })

    if (this.data.orderInfo.status === 'onstandby' || this.data.orderInfo.status === 'inprogress') {
      currentPg = 0
    } else {
      if (currentPg > 0) {
        currentFee = np.minus(currentFee, np.times(currentFee, np.divide(currentPg, 100)))
      }
      currentFee = parseFloat(currentFee.toFixed(2)) 
    }

    this.setData({
      ruleList: configList,
      currentPg: currentPg,
      currentHours: currentHours,
      currentFee: currentFee,
      refoundConfig: refoundConfig,
      departureTime: departureTime,
      canrefound: true      
    })
  },
  getHours(departureTime) {
     // 创建Date对象  
      var startDate = new Date();  
      var endDate = new Date(departureTime);  
    
      // 计算时间差（毫秒）  
      var timeDiff = endDate - startDate;  
    
      // 将时间差转换为小时数  
      var hours = Math.floor(timeDiff / (1000 * 60 * 60)); // 1000ms = 1s, 60s = 1m, 60m = 1h  
    
      return hours;  
  },
  getOrderInfoById(id) {
    let that = this
    wx.showLoading({
      title: '订单获取中...',
    })
    until.request({
      action: 'app.line.getOrderById',
      data: {
        id: id
      }
    }).then(function (e) {
      console.log(e, ';;;')
      if (e.data.success) {
        let orderInfo = e.data.data[0];
        that.setData({orderInfo: orderInfo})
        that.getRefoundInfo(orderInfo)
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
  toContacts() {
    this.refound()
  },
  refound() {
    let that = this;
    if (this.data.refounding) {
      return
    }
    this.setData({
      refounding: true,
      refoundText: '退款中...'
    })
    wx.showLoading({
      title: '退款中...',
    })
    until.request({
      action: 'app.until.refund',
      data: { orderInfo: {
        fee: that.data.orderInfo.fee,
        out_trade_no: that.data.orderInfo.out_trade_no,
        status: that.data.orderInfo.status
      },
      departureTime: that.data.departureTime,
      refoundConfig: that.data.refoundConfig
    }
    }).then(function (e) {
      if (e.data.success) {
        let refoundInfo = e.data.data.xml
        if (refoundInfo.result_code && refoundInfo.result_code[0] === 'SUCCESS') {
          let data = that.data.order
          wx.showModal({
            title: '退款提示',
            content: '退款申请已提交，请关注到账信息！',
            success: function() {
              // wx.reLaunch({
              //   url: '/pages/booking/index/index?relation=ticket'
              // })
              that.setData({
                refoundText: '申请已提交,请关注到账信息！'
              })
            }
          })
        } else {
          that.setData({
            refoundText: '订单异常，请联系管理员~'
          })
        }
      } else {
        that.setData({
          refoundText: '订单异常，请联系管理员~'
        })
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
})