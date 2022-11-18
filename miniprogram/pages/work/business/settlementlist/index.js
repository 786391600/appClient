const until = require('../../../../until/index.js')
const np = require('../../../../until/number')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    showMore: true,
    shopId: ''
  },
  onLoad (options) {
    this.data.shopId = options.id;
    this.getWithDrawalList(this.data.shopId);
  },
  getWithDrawalList (shopId) {
    wx.showLoading({
      title: '记录获取中...',
    })
    // shopId = '2fef7557-4227-5c26-4012-fcdd9373d6ab'
    let that = this;
    until.request({
      action: 'app.school.getSettlementlist',
      data: {
        id: shopId,
        page: that.data.page
      }
    }).then(function (e) {
      let res = e.data;
      if (res.success) {
        let showMore = true;
        let list = that.data.list.concat(res.data);
        if (res.data.length < 10) {
          showMore = false;
        }
        let totalPrice = 0;
        list.forEach((item)=>{
          totalPrice = np.plus(totalPrice, item.settlement.settlementTotal)
        })
        that.setData({
          list: list,
          showMore: showMore,
          totalPrice: totalPrice
        })
      }
      wx.hideLoading();
    })
  },
  showMore () {
    this.data.page++;
    this.getWithDrawalList(this.data.shopId);
  }
})