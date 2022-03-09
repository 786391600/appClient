const until = require('../../../until/index.js');
const workGlobelData = require('../../work/globleData.js')
Component({
  properties: {
  
  },
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { }
  },
  observers: {
    
  },
  methods: {
    concatUs () {
      console.log(workGlobelData)
      let schoolInfo = workGlobelData.currentSchool;
      if (schoolInfo.contactConfig) {
        if (schoolInfo.contactConfig.url) {
          let url = schoolInfo.contactConfig.url;
          wx.previewImage({
            urls: [url]
          })
          return;
        }
        if (schoolInfo.contactConfig.phone) {
          wx.makePhoneCall({
            phoneNumber: schoolInfo.contactConfig.phone
          })
          return;
        }
      } else {
        wx.makePhoneCall({
          phoneNumber: '13934691550'
        })
      }
    }
  }
})
