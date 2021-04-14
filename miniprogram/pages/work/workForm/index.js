let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
Page({
  data: {
    array: ['1公斤', '2公斤', '3公斤', '4公斤', '5公斤', '6公斤', '7公斤', '8公斤'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    multiArray: [['立即', '今天', '明天', '后天'], [], []],
    multiIndex: [0, 0, 0],
    placeholder: '请输入帮取信息，如xxx驿站，收件人xx，号码xxxxx',
    address: null
  },
  onLoad () {
    this.initAddress()
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [''];
            data.multiArray[2] = [''];
            break;
          case 1:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;
          case 2:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;
          case 3:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;  
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 1:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 2:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 3:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 4:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              default:
                data.multiArray[2] = ['00', '20', '40'];
                break;  
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
             default:
              data.multiArray[2] = ['00', '20', '40'];
              break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  toAdressList: function() {
    wx.navigateTo({
      url: '/pages/work/addressList/index'
    })
  },
  initAddress () {
    const addressList = globleData.getAdressList()
    this.setData({
      address: addressList[0] || null
    })
  },
  payForm () {
    until.workPay({
      body: '帮我取',
      fee: '0.01',
      type: 'work'
    }).then((res) => {
      wx.requestSubscribeMessage({
        tmplIds: ['QSris88nvy4XR0ldWbXuwOFQM4yfCIdsZsxYLS1_Nos', '6xO6Gbqw-REh6vGjA8eZIueDOEgfFQx9glA3RKdr7pc'],
        success (res) {}
      })
      wx.navigateTo({
        url: '/pages/work/paySuccess/index?type=success'
      })
    }).catch((res) => {
      wx.navigateTo({
        url: '/pages/work/paySuccess/index'
      })
    })
  }
})
