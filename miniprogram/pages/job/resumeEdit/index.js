let app = getApp()
const until = require('../../../until/index.js')
Page({
  data: {
    
  },
  onLoad () {
   console.log('输出测试')
  },
  formSubmit (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})
