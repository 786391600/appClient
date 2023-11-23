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
      lineList: [],
      startPoint: {label: ''},
      endPoint: {label: ''},
      currentDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let lineInfo = JSON.parse(options.lineInfo)
    let fleetInfo = JSON.parse(options.fleetInfo)
    // this.getCarList({departureTime: { $regex: options.date }, fleetId: lineInfo.fleet, start: lineInfo.start, end: lineInfo.end}).then((e) => {
    //   let getdata = e.data.data
    //   this.setData({
    //     carList: getdata,
    //     lineInfo: lineInfo
    //   })
    // })
    this.getDataList(options.date, lineInfo, fleetInfo)
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
    let currentCarInfo = e.currentTarget.dataset.detail;
    if (!currentCarInfo.state) {
      return
    }
    let carInfo = JSON.stringify(e.currentTarget.dataset.detail)
    let lineInfo = JSON.stringify(this.data.lineInfo)
    let fleetInfo = JSON.stringify(this.data.fleetInfo)
    // if (e.currentTarget.dataset.num <= 0) {
    //   wx.showToast({
    //     title: '票已售光',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.navigateTo({
      url: '../OrderPayment/index?carInfo=' + carInfo + '&lineInfo=' + lineInfo + '&fleetInfo=' + fleetInfo
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
  },
  getDataList: function(date, lineInfo, fleetInfo) {
    let fleetTask = fleetInfo.fleetTask || [];
    let setList = []
    fleetTask.forEach((item) => {
      if (item.taskType === 'time') {
        let timeValue = item.timeValue || []
        timeValue.forEach((timeItem) => {
          if (date.indexOf(timeItem.split(' ')[0]) > -1){
            setList.push({
              departureTime: timeItem,
              departureTimeTeml: new Date(timeItem).getTime(),
              state: item.state
            })
          }
        }) 
      }
    })
    this.setData({
      carList: setList,
      lineInfo: lineInfo,
      fleetInfo: fleetInfo,
      currentDate: new Date(date).getTime()
    })
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
  }
})