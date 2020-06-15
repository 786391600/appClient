// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if (newObj) {
          this.getUserResume()
        }
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    resume: {}
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    getUserResume() {
      wx.showLoading({
        title: '简历获取中...',
      })
      let that = this
      until.request({
        action: 'app.job.getResumeInfo',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          that.setData({ resume: e.data.data })
        } else {
          until.showToast(e.data.message, 'error');
        }
          wx.hideLoading()
      })
    },
    updateResume () {
      let resumeData = {}
      if (this.data.resume) {
        resumeData = this.data.resume
      }
      wx.navigateTo({
        url: '/pages/job/resumeEdit/index?type=resume&resumeData=' + JSON.stringify(resumeData)
      })
    }
  }
})