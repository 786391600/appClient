 // pages/shop.js
 const until = require('../../../until/index');
 const app = getApp();
 const globleData = require('../globleData.js');
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     form : {
       address: {}
     },
     orderList: [],
     cart: {
       total: 0,
       count: 0
     },
     schoolId: '',
     shopId: '',
     payStatus: false,
     shopName: '校园小店',
     feeTotal: 0
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
    this.initData(options);
    this.initAddress();
   },
   onShow: function(options) {
     
   },
   toAdressList: function() {
    wx.navigateTo({
      url: '/pages/work/addressList/index',
      fail (err) {
        console.log(err, 'uuuuuuu')
      }
    })
   },
   initAddress () {
    const addressList = globleData.getAdressList();
    let form = this.data.form
    form.address = addressList[0] || null
    this.setData({
      form: form
    })
   },
   initData (options) {
     console.log(options)
     let orderList = JSON.parse(options.orderList);
     let cart = JSON.parse(options.cart);
     let surcharge = JSON.parse(options.surcharge)
     let feeTotal = cart.total;
     surcharge.forEach((item) => {
       feeTotal+= item.price;
     })
     this.setData({
       orderList: orderList,
       cart: cart,
       schoolId: options.schoolId,
       shopId: options.shopId,
       shopName: options.shopName,
       surcharge: surcharge,
       feeTotal: feeTotal
     })
   },
   payForm () {
    if (!this.data.form.address) {
      wx.showToast({
        title: '请选择地址',
        duration: 3000,
        icon: 'error'
      })
      return
    }
    if (this.data.payStatus) {
      return
    }
    this.setPayLoading(true);
    let that = this;
    until.shopPay({
      body: that.data.shopName || '校园小店',
      fee: that.data.feeTotal,
      goods: that.data.orderList,
      schoolId: that.data.schoolId,
      shopId: that.data.shopId,
      address: that.data.form.address,
      type: 'school_shop'
    }).then((res) => {
      this.setPayLoading(false);
      wx.navigateTo({
        url: '/pages/work/paySuccess/index?type=success'
      })
    }).catch((res) => {
      this.setPayLoading(false);
      wx.requestSubscribeMessage({
        tmplIds: ['QSris88nvy4XR0ldWbXuwOFQM4yfCIdsZsxYLS1_Nos', '6xO6Gbqw-REh6vGjA8eZIueDOEgfFQx9glA3RKdr7pc'],
        success (res) {}
      })
      wx.navigateTo({
        url: '/pages/work/paySuccess/index'
      })
    })
   },
   setPayLoading (status) {
     this.setData({
      payStatus: status
     })
   }
 })