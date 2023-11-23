// miniprogram/pages/OrderList/index.js
const until = require('../../../until/index.js')
Component({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    showNotify: false
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
      this.getNotifyPermission()
    },
    moved: function () {},
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.getNotifyPermission()
    },
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
  },
  methods: {
    toAddress (e) {
      console.log(e, 'sssssss')
      let data = e.currentTarget.dataset.point;
      let coordinate = data.location;
      const that = this;
      wx.openLocation({
        name: data.label,  // 位置名
        latitude: new Number(coordinate[1]),
        longitude: new Number(coordinate[0]),
        address: data.label,  // 要去的地址详情说明
      });
    },
    getNotifyPermission () {
      let that = this
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          var itemSettings = res.subscriptionsSetting.itemSettings;
          let state = false
          if (itemSettings) {
            let state1 = false
            let state2 = false
            if (itemSettings['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg'] && (itemSettings['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg']=='accept' || itemSettings['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg'] == 'acceptWithForcePush')) {
              state1 = true
            }
           //  console.log(itemSettings['l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'], 'lllllllllllllllllllllllllllll')
            if (itemSettings['l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'] && (itemSettings['l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'] == 'accept' || itemSettings['l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'] == 'acceptWithForcePush')) {
              state2 = true
            }
            state = !(state2 && state1)
          }
          if (!res.subscriptionsSetting.mainSwitch) {
            state = true
          }
          that.setData({
            showNotify: state
          })
        }
      })
    },
    setNotify () {
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          var itemSettings = res.subscriptionsSetting.itemSettings;
          if (!itemSettings['l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'] || !itemSettings['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg']) {
            wx.requestSubscribeMessage({
              tmplIds: ['sRP9Y3eQiha6Vp9Ix2lhvDRppUMFyw6IO0A7xZuUJSg', 'l_NqHPehAxx2cNpVFAFVdFZypD_bdq3yvvJenUW-R1c'],
              success(res) {}
            })
          } else {
            wx.openSetting({
              withSubscriptions: true,
              success(res){
                console.log(res, 'setting')
              }
            })
          }
        }
      })     
    },
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
      // console.log(orderInfo, 'ooooooooooooooooooooooooo')
      // let departureTime = ''
      // if (orderInfo.car_info && orderInfo.car_info[0] && orderInfo.car_info[0].departureTime) {
      //   departureTime = orderInfo.car_info[0].departureTime
      // } else if (orderInfo.departureTime) {
      //   departureTime = orderInfo.departureTime
      // } else {
      //   wx.showModal({
      //     title: '退款提示',
      //     content: '订单异常，请联系管理员~'
      //   })
      //   return
      // }
      // let refoundConfig = '72-15;48-30;24-0'

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
      wx.navigateTo({
        url: '/pages/booking/refoundInfo/index?orderInfo=' + JSON.stringify(orderInfo),
      })
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
    // GoPopup: function (item) {
    //   let orderInfo = item.target.dataset.info
    //   if (orderInfo.status !== 'success') {
    //     wx.showModal({
    //       title: '退款提示',
    //       content: '候补订单请联系负责人全额退款~',
    //       success: function (res) {
            
    //       }
    //     })
    //     return
    //   }
    //   let departureTime = orderInfo.car_info[0].departureTime
    //   let canRefound = this.getCurrentDay(departureTime)
    //   if (canRefound) {
    //     wx.showToast({
    //       title: '退票时间已过，不予退票',
    //       icon: 'none'
    //     })
    //     return
    //   }
    //   let that = this
    //   let orderIndex = item.target.dataset.index
    //   let tip = this.CalculateThePrice(departureTime)
    //   wx.showModal({
    //     title: '退款提示',
    //     content: tip,
    //     success: function (res) {
    //       if (res.confirm) {
    //         that.refound(orderInfo, orderIndex)
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // },
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
      //   url: '/pages/booking/index/index?relation=orderList',
      // })
      this.triggerEvent('changeTab', {value: '0'})
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
      // let complete = e.currentTarget.dataset.orderinfo.line_info[0].complete
      let status = e.currentTarget.dataset.orderinfo.status
      console.log(e.currentTarget.dataset.orderinfo)
      // if (status === 'inprogress' || status === 'onstandby') {
      //   return
      // }
      if (refound) {
        return
      }
      // if (complete) {
      //   return
      // }
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