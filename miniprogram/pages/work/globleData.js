const until = require('../../until/index.js')
module.exports = {
  currentSchool: {},
  addressData: {},
  schoolData: {},
  channelId: '',
  getAdressList() {
    this.schoolData = wx.getStorageSync('schoolData')
    this.addressData = wx.getStorageSync('addressData') || {}
    const schoolId = this.schoolData.id
    return this.addressData[schoolId] || []
  },
  setAddressData (addressList) {
    const schoolId = this.schoolData.id
    this.addressData[schoolId] = addressList
    wx.setStorageSync('addressData', this.addressData)
  },
  getSchoolInfo (id, callback) {
      let that = this
      if (Object.keys(this.currentSchool).length > 0) {
        callback({success: true, data: this.currentSchool})
        return
      } else {
        let query = {
          schoolId: id
        }
        until.request({
          action: 'app.crowd.getSchoolInfoById',
          data: query
        }).then(function (e) {
           console.log(e, 'ooooooooooooooooo')
           if (e.data.success) {
             that.currentSchool = e.data.data.schoolInfo
             callback({success: true, data: e.data.data.schoolInfo})
           } else {
             callback({success: false})
           }
        })
      }
  }
}