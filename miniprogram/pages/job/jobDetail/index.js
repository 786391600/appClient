let app = getApp()
const until = require('../../../until/index.js')
Page({
  data: {
    jobData: {}
  },
  onLoad: function (option) {
    if (option.jobData) {
      this.getUserResume()
      this.setData({jobData: JSON.parse(option.jobData)})
    }
  },
  jobApplication () {
    if (this.data.resume) {
      let that = this
      wx.showLoading({
        title: '职位申请中...',
      })
      until.request({
        action: 'app.job.jobApplication',
        data: {}
      }).then(function (e) {
        if (e.data.success) {

        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    } else {
      wx.navigateTo({
        url: '/pages/job/resumeEdit/index'
      })
    }
  },
  getUserResume () {
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
  }
})
