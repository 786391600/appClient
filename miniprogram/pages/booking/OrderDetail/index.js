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
    reachTime: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      this.getOrderInfoById(options.orderId)
    } else if (options.orderInfo) {
      let orderInfo = JSON.parse(options.orderInfo)
      this.setData({orderInfo: orderInfo})
      this.getArrivalTime()  
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
    this.getNotifyPermission()
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
  toAddress (e) {
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
  getArrivalTime () {
    let orderInfo = this.data.orderInfo;
    let point = this.data.orderInfo.point;
    let startPoint = point.start || null;
    let fleetInfo = this.data.orderInfo.fleet_info && this.data.orderInfo.fleet_info[0] ? this.data.orderInfo.fleet_info[0] : null;
    let that = this;
    // 发车时间
    let departureTime = null
    if (orderInfo.car_info && orderInfo.car_info[0] &&  orderInfo.car_info[0].departureTime) {
      departureTime = orderInfo.car_info[0].departureTime
    } else if (orderInfo.departureTime) {
      departureTime = orderInfo.departureTime
    } else {
      return
    }
    departureTime = new Date(departureTime).getTime()
    if (!point || !startPoint || !fleetInfo) {
      return
    }
    
    if (startPoint) {
      let selectlocation = JSON.stringify(startPoint.location)
      let pointList = fleetInfo.point.start;
      let currentDuration = 0;

      // 计算当前上车时间
      if (orderInfo.car_info && orderInfo.car_info[0] && orderInfo.car_info[0].routeList) {
        let lastIndex = 0;
        orderInfo.car_info[0].routeList.some((routeItem, index)=>{
          let routeLocation = JSON.stringify(routeItem.point.location)
          if (selectlocation === routeLocation) {
            let timeRows = fleetInfo.timeRows[lastIndex];
            let currentIndex = 0
            pointList.some((pointItem, pointIndex) => {
              if (JSON.stringify(pointItem.point.location) === routeLocation) {
                currentIndex = pointIndex;
                return true
              }
            })
            if (index !== 0) {
              currentDuration = np.plus(currentDuration, np.times(timeRows[currentIndex].duration, 1000)) 
            }
            that.setData({
              reachTime: np.plus(currentDuration, departureTime)
            })
          } else {
            let timeRows = fleetInfo.timeRows[lastIndex];
            let currentIndex = 0
            pointList.some((pointItem, pointIndex) => {
              if (JSON.stringify(pointItem.point.location) === routeLocation) {
                currentIndex = pointIndex;
                return true
              }
            })
            currentDuration = np.plus(currentDuration, np.times(timeRows[currentIndex].duration, 1000))
            lastIndex = currentIndex
          }
        })
      } else {
        pointList.some((item, index) => {
          let timeRow = fleetInfo.timeRows[index];
          if (JSON.stringify(item.point.location) === selectlocation) {
            that.setData({
              reachTime: np.plus(currentDuration, departureTime)
            })
            return true
          } else {
            console.log(orderInfo, 'that.data.car_info')
            currentDuration = np.plus(currentDuration, np.times(timeRow[index + 1].duration, 1000))
          }
        })    
      }
    }
  },
  toContacts (e) {
    let phone = e.currentTarget.dataset.phone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    }
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
    // wx.openSetting({
    //   withSubscriptions: true,
    //   success(res){
    //     console.log(res, 'setting')
    //   }
    // })
    wx.openSetting({
      withSubscriptions: true,
      success(res){
        console.log(res, 'setting')
      }
    })     
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
        console.log(orderInfo, 'ooooooooooooooooooooo')
        that.setData({orderInfo: orderInfo})
        that.getArrivalTime() 
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
  GoPopup: function (item) {
    let orderInfo = this.data.orderInfo;
    wx.navigateTo({
      url: '/pages/booking/refoundInfo/index?orderInfo=' + JSON.stringify(orderInfo),
    })
  },
})