// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    searchData: {
      type: Object,
      observer: function (newObj, oldObj) {
        this.getTicketInfo(newObj)
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    jobList: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.getJobList()
    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    checkboxChange (checkObj) {
      console.log(checkObj)
    },
    toJobDetail (e) {
      let jobData = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/pages/job/jobDetail/index?jobData=' + JSON.stringify(jobData)
      })
    },
    getJobList() {
      let that = this
      wx.showLoading({
        title: '职位获取中...',
      })
      until.request({
        action: 'app.job.getJobList',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          console.log(e.data.data)
          let getdata = e.data.data
          that.setData({
            jobList: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    }
  }
})