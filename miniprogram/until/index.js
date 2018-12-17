const config = require('../appConfig.js')

exports.login = function(){
  return new Promise((resolve, reject)=>{
    wx.login({
      success(res) {
        if (res.code) {
          exports.loginRequest({
            action: 'login',
            data: {
              code: res.code
            }
          }).then((e) => {
            if (e.data.sessionId) {
              wx.setStorage({
                key: 'sessionId',
                data: e.data.sessionId,
                success: function () {
                  resolve(e.data.sessionId)
                },fail:function(e){
                  reject(e)
                }
              })
            }
          })
        }
      }
    }) 
  }) 
}
exports.getSessionId = function(force){
  return new Promise((resolve,reject)=>{
      if(force){
        exports.login().then(function(e){
          resolve(e)
        })
      }else{
        if (wx.getStorageSync('sessionId')){
          console.log('本地存在')
          console.log(wx.getStorageSync('sessionId'))
          resolve(wx.getStorageSync('sessionId'))
        }else{
          exports.login().then(function (e) {
            console.log('本地不存在')
            console.log(e)
            resolve(e)
          })
        }
      }
  })
}
exports.request = function(data){
  var data = data;
  return new Promise(function (resolve, reject) {
  exports.getSessionId().then((sessionId)=>{
      data.sessionId = sessionId;
      wx.request({
        url: config.serverUrl,
        data: data,
        method: 'POST',
        success: function (e) {
          if (e.data.sessionExpire){
            console.log('session到期 重新请求');
            exports.getSessionId('force').then((sessionId) =>{
              data.sessionId = sessionId;
              wx.request({
                url: config.serverUrl,
                data: data,
                method: 'POST',
                success:function(e){
                  resolve(e)
                }
              })
            })
          }else{
            console.log(e)
            resolve(e)
          }
        },
        fail: function (e) {
          reject(e)
        }
      })
    })
  }) 
}
exports.loginRequest = function (data) {
  return new Promise(function (resolve, reject) {
      wx.request({
        url: config.serverUrl,
        data: data,
        method: 'POST',
        success: function (e) {
          resolve(e)
        },
        fail: function (e) {
          reject(e)
        }
      })
  })
}


exports.pay = function(obj){
 return new Promise((resolve,reject)=>{
   exports.request({
     action: 'app.until.pay',
     data: obj
   }).then(function (e) {
     wx.requestPayment({
       timeStamp: e.data.data.timeStamp,
       nonceStr: e.data.data.nonceStr,
       package: e.data.data.package,
       signType: e.data.data.signType,
       paySign: e.data.data.paySign,
       success(res) {
         resolve({data:e, successData: res})
       },
       fail(res) {
         reject(res)
       }
     })
   })
 }) 
}