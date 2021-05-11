let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
Page({
  data: {
    array: ['1公斤', '2公斤', '3公斤', '4公斤', '5公斤', '6公斤', '7公斤', '8公斤'],
    index: 0,
    multiArray: [['立即开始', '今天', '明天', '后天'], [], []],
    multiIndex: [0, 0, 0],
    placeholder: '请输入帮取信息，如xxx驿站，收件人xx，号码xxxxx',
    address: null,
    form: {},
    formConfigList: []
  },
  onLoad (options) {
    console.log(options)
    this.initFormOptions(options.type)
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
    const formKey = e.currentTarget.dataset.formkey
    if (formKey === 'weight') {
      this.data.form.fee = 2 + parseInt(e.detail.value);
    }
    let query = this.data.form;
    query[formKey] = e.detail.value
    this.setData({
      form: query
    })
  },
  toAdressList: function() {
    wx.navigateTo({
      url: '/pages/work/addressList/index',
      fail (err) {
        console.log(err, 'uuuuuuu')
      }
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
      const formObj = this.getQueryForm()
      until.workPay({
        body: '帮我取',
        fee: formObj.fee,
        form: formObj,
        schoolId: formObj.schoolId,
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
    this.setData({form: this.data.form})
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
    let currentSchool = globleData.currentSchool
    if (!currentSchool.id) {
      wx.showToast({
        title:'校园系统异常，请联系管理员',
        icon: 'error',
        duration: 2000
      })
    }
    let flag = false
    const desObj = {
      taskTime: '预约时间',
      taskContent: '任务内容',
      address: '任务地址',
      fee: ''
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
      console.log(key, 'ooo')
      if(key === 'fee') {
        if (!form[key] || form[key] < 2) {
          flag = true;
          wx.showToast({
            title: '价格需超过两元',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
    return flag
  },
  computedFee () {
    const fee = parseFloat(this.data.form.fee) * 1000
    const taskFee = fee - fee * 0.3
    this.data.form.taskFee = taskFee / 1000
  },
  initFormOptions (taskType) {
    this.data.taskType = taskType;
    if (taskType === '0') {
      this.data.form = {
        taskTime: 'now',
        taskContent: '',
        apFee: 0, // 垫付费用
        fee: 2,
        taskFee: '',
        address: '',
        weight: 0
      }
      this.setData({
        formConfigList: [
          {
            type: 'textarea',
            title: '请输入帮取信息',
            key: 'taskContent',
            placeholder: '请输入帮取信息，如xxx驿站，收件人xx，号码xxxxx'
          },
          {
            type: 'address',
            title: '收货地址',
            key: 'address'
          },
          {
            type: 'select',
            title: '物品重量',
            handle: 'bindPickerChange',
            range: ['1公斤', '2公斤', '3公斤', '4公斤', '5公斤', '6公斤', '7公斤', '8公斤'],
            key: 'weight',
            content: '小于'
          },
          {
            type: 'timeselect'
          },
          // {
          //   type: 'input',
          //   title: '物品价格',
          //   key: 'apFee',
          //   placeholder: '填写物品价格',
          //   content: '元'
          // }
        ]
      })
    } else if (taskType === '2') {
      this.data.form = {
        taskTime: 'now',
        taskContent: '',
        fee: 0,
        taskFee: '',
        address: ''
      }
      this.setData({
        formConfigList: [
          {
            type: 'textarea',
            title: '请输入任务内容',
            key: 'taskContent',
            placeholder: '请输入任务信息，代买，代送，其他需求'
          },
          {
            type: 'address',
            title: '收货地址',
            key: 'address'
          },
          {
            type: 'timeselect'
          },
          {
            type: 'input',
            title: '出价',
            key: 'fee',
            placeholder: '填写任务出价',
            content: '元',
            inputtype: 'number'
          }
        ]
      })
    }
  },
  getQueryForm () {
    const taskType = this.data.taskType;
    const schoolId = globleData.currentSchool.id;
    this.data.form.schoolId = schoolId;
    return this.data.form
  }
})
