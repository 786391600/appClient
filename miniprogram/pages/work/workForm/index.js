let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
Page({
  data: {
    array: ['1公斤', '2公斤', '3公斤', '4公斤', '5公斤', '6公斤', '7公斤', '8公斤'],
    index: 0,
    multiArray: [['立即', '今天', '明天', '后天'], [], []],
    multiIndex: [0, 0, 0],
    placeholder: '请输入帮取信息，如xxx驿站，收件人xx，号码xxxxx',
    address: null,
    form: {
      taskTime: 'now',
      taskContent: '',
      apFee: 0, // 垫付费用
      fee: '2',
      taskFee: '',
      address: ''
    }
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
    let form = this.data.form
    form.address = addressList[0] || null
    this.setData({
      form: form
    })
  },
  payForm () {
    this.computedFee()
    if (this.valudateForm()) {
      return
    } else {
      until.workPay({
        body: '帮我取',
        fee: this.data.form.fee,
        form: this.data.form,
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
  },
  workTimeChange (e) {
    let valueArr = e.detail.value
    if (valueArr[0] === 0) {
      this.data.form.taskTime = 'now'
    } else {
      const yyyy = this.getDate().year
      const mth = this.getDate().month
      const dd = this.getDate().day + (valueArr[0] - 1)
      const hh = this.data.multiArray[1][valueArr[1]]
      const mm = this.data.multiArray[2][valueArr[2]]
      this.data.form.taskTime = new Date(yyyy,mth,dd,hh,mm, '00').getTime()
    }
  },
  valueChange (e) {
    let formKey = e.target.dataset.formkey
    let currentValue = e.detail.value
    this.data.form[formKey] = currentValue
  },
  getDate() {
    const date = new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
  },
  valudateForm () {
    let flag = false
    const desObj = {
      taskTime: '预约时间',
      taskContent: '任务内容',
      address: '任务地址'
    }
    const form = this.data.form
    Object.keys(desObj).forEach((key) => {
      if (!form[key]) {
        flag = true
        wx.showToast({
          title: desObj[key] + '必填！',
          icon: 'error',
          duration: 2000
        })
      }
    })
    return flag
  },
  computedFee () {
    const fee = parseFloat(this.data.form.fee) * 1000
    const taskFee = fee - fee * 0.3
    this.data.form.taskFee = taskFee / 1000
  }
})
