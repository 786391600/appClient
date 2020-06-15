// miniprogram/pages/OrderList/index.js
const until = require('../../../until/index.js')
Component({

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
    wx.hideShareMenu()
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getOrderList()
    },
    moved: function () {},
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
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
  methods: {
    getOrderList () {
      let that = this
      wx.showLoading({
        title: '订单获取中...',
      })
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
        wx.hideLoading()
      })
    },
    GoPopup: function (item) {
      let orderInfo = item.target.dataset.info
      let departureTime = orderInfo.car_info[0].departureTime
      let canRefound = this.getCurrentDay(departureTime)
      if (canRefound) {
        wx.showToast({
          title: '退票时间已过，不予退票',
          icon: 'none'
        })
        return
      }
      let that = this
      let orderIndex = item.target.dataset.index
      let tip = this.CalculateThePrice(departureTime)
      wx.showModal({
        title: '退款提示',
        content: tip,
        success: function (res) {
          if (res.confirm) {
            that.refound(orderInfo, orderIndex)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    refound(orderInfo, index) {
      let that = this
      let out_trade_no = orderInfo.out_trade_no
      wx.showLoading({
        title: '退款中...',
      })
      until.request({
        action: 'app.until.refund',
        data: { orderInfo: orderInfo }
      }).then(function (e) {
        if (e.data.success) {
          let refoundInfo = e.data.data.xml
          if (refoundInfo.result_code && refoundInfo.result_code[0] === 'SUCCESS') {
            let data = that.data.order
            data[index]['refound'] = true
            that.setData({ order: data })
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
    toTicket() {
      // wx.switchTab({
      //   url: '/pages/booking/ticket/index',
      // })
      
    },
    toContacts(e) {
      let phone = e.currentTarget.dataset.phone
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone //仅为示例，并非真实的电话号码
        })
      }
    },
    toOrderDetail(e) {
      let refound = e.currentTarget.dataset.orderinfo.refound
      let complete = e.currentTarget.dataset.orderinfo.line_info[0].complete
      console.log(e.currentTarget.dataset.orderinfo)
      if (refound) {
        return
      }
      if (complete) {
        return
      }
      let orderInfo = JSON.stringify(e.currentTarget.dataset.orderinfo)
      wx.navigateTo({
        url: '/pages/booking/OrderDetail/index?orderInfo=' + orderInfo,
      })
    },
    getCurrentDay(departureTime) {
      let date = departureTime ? new Date(departureTime) : new Date()
      let date1 = new Date().setHours(0, 0, 0, 0);
      let departureMonth = date.getMonth() + 1;
      departureMonth = (departureMonth < 10 ? "0" + departureMonth : departureMonth)
      let departureDay = date.getDate()
      departureDay = (departureDay < 10 ? "0" + departureDay : departureDay)
      let departure = date.getFullYear() + '/' + departureMonth + '/' + departureDay
      var d = new Date(Date.parse(departure)).setHours(0, 0, 0, 0)
      return date1 >= d
    },
    CalculateThePrice(time) {
      let departureTime = time.split(' ')[0]
      let date = departureTime ? new Date(departureTime) : new Date()
      let date1 = new Date();
      let timp = (date - date1) / 1000 / 60 / 60 / 24
      console.log(timp)
      let gl = 0
      if (timp < 0) {
        gl = 0
      } else if (0 <= timp && timp < 1) {
        gl = '据发车不到' + Math.ceil(timp) + '天，将扣除50%手续费，确定退票？'
      } else if (1 <= timp && timp <= 2) {
        gl = '据发车不到' + Math.ceil(timp) + '天，将扣除30% 手续费，确定退票？'
      } else if (2 < timp && timp <= 3) {
        gl = '据发车不到' + Math.ceil(timp) + '天，将扣除15% 手续费，确定退票？'
      } else if (timp > 3) {
        gl = '本次将全额退款，点击确定'
      }
      return gl
    }
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