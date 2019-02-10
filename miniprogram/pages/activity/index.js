// pages/Testpage/ActivityOne/index.js
const app = getApp()
const until = require('../../until/index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ActTelephone:false,
    loading: true,
    activityState: {
      ActState: 0, //手机号活动：1,集赞活动：2，支付领取活动：3
      Someone: 0, //朋友:1, 自己:2
      QRState: 0,   //集赞中：1 ,已集满:2,已领取:3,活动已经结束:0
    },
    activity: {
      imgUrl: '',
      describe:'',
      title: '',
      id:''
    },
    userInfo:{

    },
    partakeId: '',
    activityId: '',
    showUserInfo:false,
    userLikeInfo:{
      userLikeList: [],
      userLikeNum: 0
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options && options.partakeId) {
      this.data.partakeId = options.partakeId
    }
    if (options && options.activityId){
      this.data.activityId = options.activityId;
    }
    until.getUserAuth().then((e) => {
      if (!e.auth) {
        that.setData({ userAuth: true })
        return
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('进来参数')
    console.log(options)
    console.log(this.data)
    this.getActivityInfo({ partakeId: this.data.partakeId, activityId: this.data.activityId}) 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    if (this.data.activityState.ActState === 1 || this.data.activityState.ActState === 3) {
      var path = "pages/activity/index?activityId="+that.data.activityId;
    } else {
      var path = "pages/activity/index?partakeId="+that.data.partakeId+"&activityId="+ that.data.activityId;
    }
    console.log('转发路径')
    console.log(path)
    return {
      title: that.data.activity.title,
      path: path,
      imageUrl: that.data.activity.imgUrl
    }
  },

  // 手机号部分
  inputPhoneNum: function (e) {
    let phoneNumber = e.detail.value
    if (phoneNumber.length === 11) {
      this.checkPhoneNum(phoneNumber)
    }else{
      if (this.data.ActTelephone==true){
        this.setData({
          ActTelephone: false
        })
      }
    }
  },
  checkPhoneNum: function (phoneNumber) {
    let str = /^1[34578]\d{9}$/
    if (str.test(phoneNumber)) {
      this.setData({
        ActTelephone: true
      })
    } else {
      until.showToast('手机号不正确','error');
      this.setData({
        ActTelephone: false
      })
    }
  },
  //form数据
  formSubmit(e) {
    var that = this;
    if (this.data.ActTelephone==false){
      until.showToast('手机号不正确', 'error');
    }else{
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      var query = {};
      query.actionType = 'type1'
      query.phone = e.detail.value.phone;
      query.partakeId = this.data.partakeId;
      query.activityId = this.data.activity.id;
      this.partakeActivity(query).then((e)=>{
        until.showToast('参与成功')
        this.getActivityInfo({ partakeId: that.data.partakeId, activityId: that.data.activityId})
      })
    }
  },
  toQRcode: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/QRcode/index?partakeId=' + that.data.partakeId + '&address=' + that.data.activity.merchants.address,
    })
  },
  getActivityInfo: function(query) {
    var that = this;
    var query = query || {activityId: that.data.activityId}
    until.request({
      action: 'app.activity.getActivityInfo',
      data: query
    }).then(function (e) {
      console.log(e)
      var resultData = e.data;
      if (!resultData.success){
        until.showToast(resultData.data.message, 'error');
        return;
      }
      var activityData = resultData.data.activity;
      var userInfo = resultData.data.userInfo;
      if (resultData.data.isOverdue){
        that.setData({ activityState: { QRState: 0, ActState:1}, activity: activityData, loading: false});
      }else{
        if (resultData.data.partakeId){
          that.data.partakeId = resultData.data.partakeId;
        }
        var state = resultData.data.activityState;
        console.log(state)
        console.log('第一次进入state')
        if (userInfo && userInfo.success) {
          var setData = { activity: activityData, activityState: state, userInfo: userInfo.userInfo, showUserInfo: true,loading: false}
        } else {
          var setData = { activity: activityData, activityState: state, showUserInfo: false, loading: false}
        }
        that.setData(setData);
        //是否加载点赞用户列表
        if (that.data.activityState.ActState === 2){
          that.getLikeUserList({partakeId: that.data.partakeId}).then((e)=>{
            var userList = e.data.data.userList;
            that.setData({userLikeInfo: {userLikeList: userList, userLikeNum: userList.length}})
          })
        }
      }
    })
  },
  partakeActivity (query) {
   return new Promise((resolve, reject)=>{
     until.request({
       action: 'app.activity.partakeActivity',
       data: query
     }).then(function (e) {
       if (e.data.success){
         resolve(e)
       } else {
         console.log(e)
         until.showToast(e.data.message, 'error');
       }
     })
   }) 
  },
  praiseClick () {
    var that = this;
    that.userPraise()
  },
  setInfoSuccess (e) {
   this.setData({userAuth: false})
  },
  userPraise () {
    // 点赞逻辑
    let query = {};
    var that = this;
    query.actionType = 'type2';
    query.partakeId = this.data.partakeId;
    query.activityId = this.data.activity.id;
    query.type2nums = this.data.activity.conditions.type2nums;
    this.partakeActivity(query).then((e)=>{
      var data = e.data;
      if (data.data&&data.data.likeRepeat){
        until.showToast('不能重复助力！','error');
        return;
      }
      var myInfo = wx.getStorageSync('userInfo')
      var newNum = that.data.userLikeInfo.userLikeList.unshift(myInfo)
      that.data.userLikeInfo.userLikeNum = newNum;
      until.showToast('助力成功！');
      var state = that.data.activityState;
      state.QRState = 4;
      that.setData({ userLikeInfo: that.data.userLikeInfo, activityState: state})
    })
  },
  getMyException () {
      this.getActivityInfo()
  },
  getLikeUserList(query){
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.activity.getLikeUserList',
        data: query
      }).then(function (e) {
        if (e.data.success) {
          resolve(e)
        } else {
          until.showToast(e.data.message, 'error');
        }
      })
    })
  },
  getPosterImage(){
    return new Promise((resolve, reject) => {
      until.request({
        action: 'app.activity.getQrCode',
        data: {}
      }).then(function (e) {
        if (e.data.success) {
          const fsm = wx.getFileSystemManager();
          const FILE_BASE_NAME = 'tmp_base64src';
          var base64data = e.data.data.img;
          const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
          if (!format) {
            reject(new Error('ERROR_BASE64SRC_PARSE'));
          }
          const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
          const buffer = wx.base64ToArrayBuffer(bodyData);
          fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success() {
             console.log(filePath)
              wx.getImageInfo({
                src: filePath,
                success: function(e){
                  console.log(e)
                  console.log('getImageInfo')
                  const context = wx.createCanvasContext('shareCanvas')
                  context.drawImage(e.path,0,0,100,100)
                  context.setTextAlign('center')    // 文字居中
                  context.setFillStyle('#000000')  // 文字颜色：黑色
                  context.setFontSize(22)         // 文字字号：22px
                  context.fillText("123456", 600 / 2, 500)
                  context.draw()
                }
              })
            },
            fail() {
              reject(new Error('ERROR_BASE64SRC_WRITE'));
            },
          });
          resolve(e)
        } else {
          until.showToast(e.data.message, 'error');
        }
      })
    })
  },
  getShareImg () {
    var that = this;
    wx.navigateTo({
      url: '/pages/getShareImg/index?shareType=activity&activityInfo=' + JSON.stringify(that.data.activity)
    })
  },
  marketingPay () {
    var that = this;
    var data = that.data.activity;
    until.pay({
      body: data.title,
      fee: data.conditions.type3price,
      commodityId: data.id,
      address: data.merchants.address,
      type: 'activity'
    }).then((res) => {
      let query = {};
      query.actionType = 'type3';
      query.partakeId = that.data.partakeId;
      query.activityId = that.data.activity.id;
      query.payState = true;
      that.partakeActivity(query).then((e) => {
        var data = e.data;
        that.setData({ activityState: { QRState: 2, ActState: 3, Someone: 2}})
        until.showToast('领取成功！');
      })
    }).catch((res) => {
      console.log(res, 'pay faile')
    })
  }
})