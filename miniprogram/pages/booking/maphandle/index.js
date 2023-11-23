var QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    lineTitle: '',
    lineId: '',
    currentCarNo: '',
    currentCarTab: -1,
    recommend: '',
    longitude: '',
    latitude: '',
    markers: [],
    polyline: [{
      points: [],
      color: "#CCCCCC",
      width: 10,
      dottedLine: true
    }],
    includePoints: [{
      latitude: 35.890723,
      longitude: 110.73842,
    }, {
      latitude: 35.890723,
      longitude: 120.73842,
    }],
    'show-compass': true,
    'include-points': [],
    addressList: [
      {label: '测试地点', point: {
        label: '吕梁学院',
        location: [111.147156, 37.582589]
      }}
    ],
    addressText: '上车点',
    addressType: ''
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad (options) {
    if (options && options.addressList && options.type) {
      let type = options.type;
      let addressList = JSON.parse(options.addressList);
      console.log(addressList)
      wx.setNavigationBarTitle({
        title: type === 'start' ? '选择上车点' : '选择下车点'
      })
      this.setData({
        addressList: addressList,
        addressText: type === 'start' ? '上车点' : '下车点',
        addressType: type        
      })
      this.getWeiXinInfo(addressList, -2)
    }
    qqmapsdk = new QQMapWX({
      key: 'QHWBZ-HC36J-OP6FG-KAWAP-AD3W6-BCBDC'
    });
    
  },
  refresh() {
    if (this.data.carRequest) {
      return
    }
    this.data.carRequest = true
    this.getCarInfo()
  },
  getPhoneNumber (data) {
    var that = this;
    if (!data.detail.encryptedData || !data.detail.iv) {
      return
    }
    DS.request({
      action: 'app.transit.getPhoneNumber',
      data: data.detail
    }, 'force').then(function (e) {
      if (e.data.success) {
        let phone = e.data.data.phoneNumber
        if (phone) {
          wx.setStorageSync('phone', phone)
          that.setData({havePhone: true})
        }
      }
    })
  },
  getWeiXinInfo(addressinfoList, Index) {
    let that = this
    if (that.data.isGetWeiXinInfo || Index === that.data.currentCarTab) {
      return
    }
    var markers = []
    addressinfoList.forEach((item) => {
      let currentPoint = item.point
      let currentLocation = item.point.location
      let path = './aaa.png'
      if (this.data.addressType === 'start') {
        path = './start.png'
      } else if (this.data.addressType === 'end') {
        path = './end.png'
      }
      markers.push({
        iconPath: path,
        id: 0,
        latitude: currentLocation[1],
        longitude: currentLocation[0],
        width: 30,
        height: 35.7,
        rotate: currentPoint.label,
        label: {
          // content: that.data.addressText + ':' + currentPoint.label,
          content: currentPoint.label,
          anchorY:-73,
          anchorX: -80,
          bgColor: '#FFFFFF',
          padding: 10,
          fontSize: 12,
          borderRadius: addressinfoList.length > 1 ? 4 : 5,
          color: '#000'
        }
      })
    })
    console.log(markers, 'shhhhhhhhhhhhhhhhhhhhhhh')
    that.data.isGetWeiXinInfo = true
    // qqmapsdk.reverseGeocoder({
    //   sig: 'aGiWaOaTVM4hHZ4NnZW4GKBtLGQfKdSx',
    //   location: {
    //     latitude: markers[0].latitude, 
    //     longitude: markers[0].longitude
    //   },
    //   coord_type: 1,
    //   success: function (res) {
    //     wx.hideLoading()
        
    //   }
    // })
    that.setData({ markers: markers, latitude: markers[0].latitude, longitude: markers[0].longitude, currentCarTab: Index})
    that.data.isGetWeiXinInfo = false
  },
  addressClick(res) {
    let adressinfo = res.currentTarget.dataset.addressinfo;
    let Index = res.currentTarget.dataset.index || 0;
    this.getWeiXinInfo([adressinfo], Index)
  },
  saveAddress(obj) {
    this.setAdress()
  },
  setAdress () {
    let that = this;
    if (this.data.currentCarTab < 0) {
      wx.showModal({
        title: '提示',
        content: '请选择' + that.data.addressText,
        success: function (res) {
          
        }
      })
      return
    }
    let obj = {}
    obj[that.data.addressType] = that.data.addressList[this.data.currentCarTab]
    console.log(obj, '------------------------')
    let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    console.log(prevPage, 'vvvvvvvvvvvvvv')
    let currentSearchData = prevPage.data.point
    let setData = {
      ...currentSearchData,
      ...obj
    }
    prevPage.setData(
      { point : setData }
    )
    prevPage.getArrivalTime()
    wx.navigateBack({})
  }
})