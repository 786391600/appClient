let app = getApp()
const until = require('../../../until/index.js')
Page({
  data: {
    source: '',
    resumeData: {}
  },
  onLoad (option) {
    let data = {}
    if (option && option.type) {
      data.source = option.type
    }
    if (option.resumeData) {
      data.resumeData = JSON.parse(option.resumeData)
    }

    this.setData(data)
  },
  formSubmit (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let submitData = e.detail.value;
    let data = this.formValidate(submitData)
    if (data) {
      this.setData({ resumeData: submitData})
      this.addOrUpdateResume(submitData)
    }
  },
  formReset () {
    console.log('form发生了reset事件')
  },
  formValidate (data) {
    let obj = {
      'name': '姓名',
      'sex': '性别',
      'school': '学校',
      'phone': '手机'
    }
    for (var k in data) {
      if (!data[k] && obj[k]) {
        until.showToast(obj[k] + '必填！', 'error')
        return false
      }
    }
    return true
  },
  addOrUpdateResume (data) {
    let that = this
    until.request({
      action: 'app.job.addOrUpdateResume',
      data: data
    }).then(function (e) {
      if (e.data.success) {
        if (that.data.source === 'jobDetail' ) {
          wx.reLaunch({
            url: '/pages/job/index/index?currentTab=1'
          })
        } else {
          wx.reLaunch({
            url: '/pages/job/index/index?currentTab=2'
          })
        }
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  }
})
