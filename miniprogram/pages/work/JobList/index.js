// pages/Testpage/HomePage/index.js
const app = getApp()
const until = require('../../../until/index.js')
const workGlobelData = require('../globleData.js')
Component({
  properties: {
    currentState: {
      type: Boolean,
      observer: function (newObj, oldObj) {
        if (newObj) {
          
        }
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    jobList: [],
    schoolData: {}
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.setCurrentSchool()
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    toSchoolSelect () {
      wx.navigateTo({
        url: '/pages/work/schoolList/index'
      })
    },
    setCurrentSchool () {
      if (workGlobelData.currentSchool && Object.keys(workGlobelData.currentSchool).length > 0) {
        this.setData({schoolData: workGlobelData.currentSchool})
      } else {
        const schoolData = wx.getStorageSync('schoolData')
        if (schoolData && Object.keys(schoolData).length > 0){
          workGlobelData.currentSchool = schoolData
          this.setData({schoolData: workGlobelData.currentSchool})
        }
      }
    },
    toWorkForm (e) {
      const taskType = e.currentTarget.dataset.tasktype
      console.log(taskType)
      if (Object.keys(this.data.schoolData).length === 0) {
        this.toSchoolSelect()
        return
      }
      wx.navigateTo({
        url: '/pages/work/workForm/index?type=' + taskType
      })
    }
  }
})