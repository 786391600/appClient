// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if(newObj) {
          this.getApplyList()
        }
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    applyList: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {

    },
    moved: function () { },
    detached: function () { },
  },
  methods: {
    toJobDetail (obj) {
      console.log(obj, 'lll')
      let jobId = obj.currentTarget.dataset.jobobj.jobId
      wx.navigateTo({
        url: '/pages/job/jobDetail/index?jobId=' + jobId
      })
    },
    getApplyList () {
      let query = {}
      let that = this
      wx.showLoading({
        title: '记录获取中...',
      })
      until.request({
        action: 'app.job.getJobApplication',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          let getdata = e.data.data
          that.setData({
            applyList: getdata
          })
        } else {
          until.showToast(e.data.message, 'error');
        }
        wx.hideLoading()
      })
    }
  }
})