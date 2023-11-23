// miniprogram/pages/OrderPayment/index.js
const until = require('../../../until/index.js')
const np = require('../../../until/number.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    riderList: [],
    riderDetail: {},
    name: '',
    phone: '',
    showPrice: 0,
    startSelect: true,
    endSelect: true,
    point: {
      start: {},
      end: {}
    },
    // 预计到达点位时间
    reachTime: null,
    articleUrl: 'https://mp.weixin.qq.com/s/EWAI81BqmQij8j1RLwh-mw',
    isAgreement: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRiderData(options)
    wx.hideShareMenu()
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
    let showPrice = np.times(riderList.length, Number(this.data.lineInfo.price))
    this.setData({riderList: riderList, showPrice: showPrice})
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
    // let carId = this.data.carInfo.id;
    let fleetId = this.data.fleetInfo.id;
    // let formId = e.detail.formId;
    let start = this.data.lineInfo.start;
    let end = this.data.lineInfo.end;
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
    if (this.data.beingSubmit) {
      return
    }
    // this.data.beingSubmit = true
    this.setData({
      beingSubmit: true
    })
    wx.showLoading({
      title: '稍等片刻...',
    })
    until.pay({
      body: '汽车订单:' + start + '--' + end,
      fee: priceObj.price,
      lineId: priceObj.lineId,
      fleetId: fleetId,
      type: 'ticket',
      start: start,
      end: end,
      name: priceObj.name,
      phone: priceObj.phone,
      riderList: priceObj.riderList,
      departureTime: priceObj.departureTime,
      point: priceObj.point,
      pointNum: priceObj.pointNum
    }).then((res) => {
      wx.hideLoading()
      this.setData({
        beingSubmit: false
      })
      wx.navigateTo({
        url: '/pages/booking/paySuccess/index?type=success',
      })
    }).catch((res) => {
      wx.hideLoading()
      this.setData({
        beingSubmit: false
      })
      if (res.notEnough) {
        wx.showToast({
          title: '车票剩余不足,请查看其他线路',
          icon: 'none',
          duration: 3000
        })
      } else {
        if (res.out_trade_no) {
          // this.delOrder(res.out_trade_no)
        } else {
          wx.showToast({
            title: '服务异常，稍后再试',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  toRider () {
    if (this.data.riderList.length >=3) {
      wx.showToast({
        title: '最多添加三位乘车人',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/booking/rider/index'
    })
  },
  removeRider (e) {
    let index = e.target.dataset.index;
    this.data.riderList.splice(index, 1)
    this.setData({riderList: this.data.riderList})
    app.globalData.selectRiderList = this.data.riderList
  },
  initRiderData (options) {
    let carInfo = JSON.parse(options.carInfo);
    carInfo.departure = carInfo.departureTime;
    carInfo.departureTime = new Date(carInfo.departureTime).getTime()
    let lineInfo = JSON.parse(options.lineInfo)
    let fleetInfo = JSON.parse(options.fleetInfo)
    let that = this;
    that.getAddress(fleetInfo, lineInfo, carInfo)
    until.request({
      action: 'app.line.getRiderList',
      data: {isDefault: true}
    }).then(function (e) {
      if (e.data.success) {
        app.globalData.selectRiderList = e.data.data || []
        let name = wx.getStorageSync('name') || '';
        let phone = wx.getStorageSync('phone') || ''
        let showPrice = np.times(app.globalData.selectRiderList.length, Number(lineInfo.price))
        that.setData({ lineInfo: lineInfo, carInfo: carInfo, riderList: app.globalData.selectRiderList, name: name, phone: phone, showPrice: showPrice})
      }
    })
  },
  getAddress (fleetInfo, lineInfo, carInfo) {
    this.data.fleetInfo = fleetInfo;
    let start = lineInfo.start;
    let end = lineInfo.end;
    let startPointList = fleetInfo.point.start;
    let endPointList = fleetInfo.point.end;
    let startPoint = [];
    let endPoint = [];
    startPointList.some((item)=>{
      let mateList = item.mateList || []
      if (mateList.length === 0) {
        return true
      } else {
        console.log(mateList.indexOf(start), start)
        if (mateList.indexOf(start) > -1) {
          startPoint.push(item);
        } 
      }
    })
    endPointList.some((item)=>{
      let mateList = item.mateList || []
      if (mateList.length === 0) {
        return true
      } else {
        if (mateList.indexOf(end) > -1) {
          endPoint.push(item);
        } 
      }
    })
    let point = {
      start: null,
      end: null
    }
    console.log(startPoint, endPoint, 'tttttttttttttttttttttttttt')
    let startSelect = true;
    if (startPoint && startPoint.length > 0) {
      console.log(startPoint, '存在')
      if (startPoint.length === 1) {
        startSelect = false;
        point.start = startPoint[0] 
      } else {
        fleetInfo.point.start = startPoint
      }
    }
    let endSelect = true;
    if (endPoint && endPoint.length > 0) {
      if (endPoint.length === 1) {
        endSelect = false
        point.end = endPoint[0] 
      } else {
        fleetInfo.point.end = endPoint
      }
    }
    this.setData({
      fleetInfo: fleetInfo,
      carInfo: carInfo,
      lineInfo: lineInfo,
      startSelect: startSelect,
      endSelect: endSelect,
      point: point
    })
    this.getArrivalTime()
  },
  getArrivalTime () {
    let point = this.data.point;
    let startPoint = point.start || null;
    let that = this;
    if (startPoint) {
      let selectlocation = JSON.stringify(startPoint.point.location)
      let fleetInfo = this.data.fleetInfo;
      let pointList = fleetInfo.point.start;
      let currentDuration = 0;
      pointList.some((item, index) => {
        let timeRow = fleetInfo.timeRows[index];
        if (JSON.stringify(item.point.location) === selectlocation) {
          that.setData({
            reachTime: np.plus(currentDuration, that.data.carInfo.departureTime)
          })
          return true
        } else {
          currentDuration = np.plus(currentDuration, np.times(timeRow[index + 1].duration, 1000))
        }
      })
    }
  },
  mapSelect (e) {
    let type = e.currentTarget.dataset.type
    if (type === 'start') {
      if (!this.data.startSelect) {
        return
      }
    }
    if (type === 'end') {
      if (!this.data.endSelect) {
        return
      }
    }
    console.log(this.data.fleetInfo.point, 'kkkkkkkkkkkkkkkkk')
    let addressList = type === 'start' ? this.data.fleetInfo.point.start : this.data.fleetInfo.point.end;
    wx.navigateTo({
      url: '../maphandle/index?addressList=' + JSON.stringify(addressList) + '&type=' + type
    })
  },
  validateSubmit (data) {
    let title = ''
    let that = this;
    if (!this.data.isAgreement) {
      wx.showToast({
        title: '请同意并勾选《用车协议》',
        icon: 'none'
      })
      return
    }
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
        title: '请添加乘车人',
        icon: 'none'
      })
      return false
    }
    let currentPoint = this.data.point;
    if (!currentPoint.start) {
      wx.showToast({
        title: '请选择上车点',
        icon: 'none'
      })
      return false
    }
    if (!currentPoint.end) {
      wx.showToast({
        title: '请选择下车点',
        icon: 'none'
      })
      return false
    }
    let carInfo = this.data.carInfo;
    let price = np.times(this.data.riderList.length, this.data.lineInfo.price)
    let point = {
      start: that.data.point.start.point,
      end: that.data.point.end.point
    }
    let fleetInfo = this.data.fleetInfo
    console.log(fleetInfo, 'fleetinfoooooooooooooooo')
    let pointNum = this.getPointNumber(point, fleetInfo.point)
    console.log(pointNum, 'mmmmmmmmmmmmmmmmmmmmmmmmmmmm')
    return {pointNum: pointNum, point: point, departureTime: carInfo.departureTime, phone: data.phone, name: data.name, price: price, riderList: this.data.riderList, lineId: this.data.lineInfo.id}
  },
  getPointNumber (currentPoint, fleetPoint) {
    // 获取点位排序
    let startList = fleetPoint.start;
    let endList = fleetPoint.end;
    let currentNumber = 0;
    let returnNumber = 0;
    for (let i = 0; i<startList.length; i++) {
      for(let j = 0; j<endList.length; j++) {
        let startLocation = JSON.stringify(startList[i].point.location)
        let endLocation = JSON.stringify(endList[j].point.location)
        console.log(startLocation, endLocation)
        let currentStartLocation = JSON.stringify(currentPoint.start.location)
        let currentEndLocation = JSON.stringify(currentPoint.end.location)
        if (startLocation === currentStartLocation && endLocation === currentEndLocation) {
          returnNumber = currentNumber;
          break
        } else {
          currentNumber = currentNumber + 1;
        }
      }
    }
    return returnNumber;
  },
  delOrder(out_trade_no) {
    until.request({
      action: 'app.line.delOrder',
      data: { out_trade_no: out_trade_no}
    }).then(function (e) {
      if (e.data.success) {
        wx.navigateTo({
          url: '/pages/booking/paySuccess/index',
        })
      }
    })
  },
  numberToFix: function (value) {
    if (parseInt(value) === value) {
      return value
    } else {
      return value.toFixed(1)
    }
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
  toXieyi() {
    let agreementUrl = this.data.articleUrl
    if (this.data.fleetInfo.agreementUrl) {
      agreementUrl = this.data.fleetInfo.agreementUrl
    }
    wx.navigateTo({
      url: '/pages/common/getWebView/index?url=' + agreementUrl
    })
  },
  checkboxChange(value) {
    console.log(value, 'eeeeeeeeee')
    if (value.detail.value.length > 0) {
      this.data.isAgreement = true;
    } else {
      this.data.isAgreement = false;
    }
  }
})