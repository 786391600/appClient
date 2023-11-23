let app = getApp()
const until = require('../../../until/index.js')
Page({
  data: {
    jobData: {}
  },
  onLoad: function (option) {
    this.getUserResume(option)
    if (option.scene) {
      var scene = decodeURIComponent(option.scene)
    }
    if (option.jobData) {
      this.setData({jobData: JSON.parse(option.jobData)})
    } else if (option.jobId) {
      this.getJobInfo(option.jobId)
    } else if (option.scene) {
      this.getJobInfo(scene, true)
    }
  },
  jobApplication () {
    if (this.data.resume) {
      let that = this
      let query = {}
      query.jobId = this.data.jobData.id
      query.resume = this.data.resume
      wx.showLoading({
        title: '职位申请中...',
      })
      until.request({
        action: 'app.job.jobApplication',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            duration: 2000
          }); 
        } else {
          until.showToast(e.data.message, 'error');
        }
        //wx.hideLoading()
      })
    } else {
      wx.navigateTo({
        url: '/pages/job/resumeEdit/index?type=jobDetail'
      })
    }
  },
  getUserResume (option) {
    let that = this
    if (option.resumeData) {
      that.setData({ resume:JSON.parse(option.resumeData)})
      return
    }
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
  getJobInfo(id, isScene){
    let that = this
    let query = {}
    if (isScene) {
      query.scene = id
    } else {
      query.jobId = id
    }
    wx.showLoading({
      title: '职位获取中...',
    })
    until.request({
      action: 'app.job.getJobList',
      data: query
    }).then(function (e) {
      if (e.data.success) {
        that.setData({ jobData: e.data.data[0] })
      } else {
        until.showToast(e.data.message, 'error');
      }
      wx.hideLoading()
    })
  },
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    console.log(this.data.jobData)
    let jobId = this.data.jobData.id
    let jobName = this.data.jobData.recruit_name
    let path = '/pages/job/jobDetail/index?jobId=' + jobId
    return {
      title: jobName,
      path: path,
      imageUrl: 'https://s2.ax1x.com/2020/01/02/lYKjYR.png'
    }
  },
  getShareImage () {
    let jobData = this.data.jobData
    let qrInfo = {}
    let shareCon = {
      text1: jobData.recruit_name,
      text2: '薪资：' + jobData.recruit_wages,
      text3: "扫码了解详情！",
      text4: "么么校园兼职！"
    }
    if (!jobData.scene) {
      return
    }
    // qrInfo.scene = jobData.scene
    // qrInfo.page = 'pages/job/jobDetail/index'
    qrInfo.page = 'pages/booking/index/index'
    qrInfo.scene = 'oJ-T_0gTeP-6AaAtLftWJHmBELxs'
    wx.navigateTo({
      url: '/pages/common/getShareImg/index?qrInfo=' + JSON.stringify(qrInfo) + '&shareCon=' + JSON.stringify(shareCon)
    })
  }
})
