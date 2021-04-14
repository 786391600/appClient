module.exports = {
  currentSchool: {},
  getAdressList() {
    if (!this.schoolData) {
      this.schoolData = wx.getStorageSync('schoolData')
    }
    if (!this.addressData) {
      this.addressData = wx.getStorageSync('addressData') || {}
    }
    const schoolId = this.schoolData.id
    return this.addressData[schoolId] || []
  },
  setAddressData (addressList) {
    const schoolId = this.schoolData.id
    this.addressData[schoolId] = addressList
    wx.setStorageSync('addressData', this.addressData)
  }
}