 // pages/shop.js
 const util = require('../../../until/index');
 const app = getApp();
 const ajax = app.globalData.ajax;
 const np = require('../../../until/number');
 const workGlobelData = require('../globleData.js')
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     shop: null, // 商品数据
     classifySeleted: '',
     defaultImg: 'http://img.beijixiong.club:4869/fde7f4b3d7256c82dfb17c15057b1e8b',
     cardDetailStatus: false,
     goodsModalStatus: false, // 选择规格弹窗
     activeSpecItemsId: '',
     activeSpec: [],
     cartList: [],
     // 商店底部总价展示
     cart: {
       count: 0,
       total: 0
     },
     localList: [], // 传输到商品结算页订单
     addAppMaskStatus: true, // 添加小程序提示
     orderType: 0, // 0为正常下单 1为修改订单
     foodList: [],
     scrollHeight: '',
     maskAllPage: true,
     schoolId: '',
     shopId: '',
     surcharge: [],
     titledomlist: [],
     pageMode: '', // 通过什么方式进来,
     className: '',
     addressInfo: {}, //商家地址 电话信息
     dvideId: '', // 分成id
     goodsType: 'delivery', // 配送类型  selflifting-自提  delivery-外卖
     pickupTime: [],
     // 除了按份设置外的平台费用规则
     feeConfig: {
       tApConfig: null, // 骑手费用
       extracharge: null, // 附加费用
       dfConfig: null // 抽成
     },
     severalConfig: null
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     var that = this;
     // 开启遮罩层
     that.showToast();
     // 下单类型
     if (options.type) {
       this.setData({
         orderType: Number(options.type)
       });
     }
     // 获取商品
     this.getGoodsList(options);
     // 是否需要显示添加小程序蒙层
     wx.getStorage({
       key: 'addAppMaskStatus',
       success: function(res) {
         console.log(res)
         that.setData({
           addAppMaskStatus: res.data
         })
       },
     });
     //获取系统的参数，scrollHeight数值,微信必须要设置style:height才能监听滚动事件
     wx.getSystemInfo({
       success: function(res) {
         let pages = getCurrentPages();
         that.setData({
           scrollHeight: res.windowHeight,
           pageMode: pages.length
         })
       }
     });
   },
   // 关闭添加小程序
   closeAddAppMask() {
     this.setData({
       addAppMaskStatus: false
     });
     wx.setStorage({
       key: 'addAppMaskStatus',
       data: false
     })
     console.log(this.data.addAppMaskStatus)
   },
   // 获取商品
   getGoodsList(options) {
    let that = this;
    util.request({
      action: 'app.school.getShopById',
      data: {
        schoolId: options.schoolId,
        shopId: options.shopId
      }
    }).then(function (e) {
      if (e.data.success){
        console.log(e.data, '店铺信息')
        let shopInfo = e.data.data;
        let shopData = e.data.data.shopData || [];
        let shopName = e.data.data.title || '校园商店';
        let dvideId = e.data.data.dvideId || ''
        let shop = {
          data: shopData,
          icon: e.data.data.icon || null,
          color: e.data.data.color || null,
          deliveryPrice: e.data.data.deliveryPrice || 0,
          close: e.data.data.close || false,
          notice: e.data.data.notice || '',
          headImg: e.data.data.headImg
        }
        let addressInfo = e.data.data.addressInfo || {}
        that.data.severalConfig = e.data.data.severalConfig || null
        //  配送方式
        let dtConfig =  e.data.data.dtConfig || ['delivery', 'selflifting']
        // let dtConfig =  ['delivery', 'selflifting']
        let pickupTime = e.data.data.pickupTime || []
        let dtType = dtConfig[0]
        let filterShop = that.filterShopDataByGoodsType(dtType, shop)
        that.setData({
          shop: filterShop,
          classifySeleted: shopData[0].id,
          schoolId: options.schoolId,
          shopId: options.shopId,
          shopName: shopName,
          addressInfo: addressInfo,
          dvideId: dvideId,
          dtConfig: dtConfig,
          goodsType: dtType,
          pickupTime: pickupTime,
          feeConfig: {
            tApConfig: shopInfo.tApConfig || null, // 骑手费用
            extracharge: shopInfo.extracharge || null, // 附加费用
            dfConfig: shopInfo.dfConfig || null // 抽成
          }
        }, () => {
          var query = wx.createSelectorQuery();
          query.selectAll('.classifytitle').boundingClientRect((res) => {
            that.data.titledomlist = res
          }).exec()
        })
        wx.setNavigationBarTitle({
          title: shopName
        })
        // 关闭遮罩层
        that.setData({
          maskAllPage: false
        })
      }
      that.hideToast()
    }) 
   },
   // 左边点击时触发
   tapClassify(e) {
     var id = e.target.dataset.id;
     // console.log(id);
     this.setData({
       classifyViewed: id
     });
     console.log(this.data.classifyViewed)
     var self = this;
     setTimeout(function() {
       self.setData({
         classifySeleted: id
       });
     }, 100);
   },
   // 右边滚动时触发
   onGoodsScroll(e) {
    //  var scale = e.detail.scrollWidth / 570,
    //    scrollTop = e.detail.scrollTop / scale,
    //    h = 0,
    //    classifySeleted,
    //    len = this.data.shop.data.length;
    //  this.data.shop.data.forEach(function(classify, i) {
    //    var _h = 74 + classify.menu.length * 156;
    //    if (scrollTop >= h - 100 / scale) {
    //      classifySeleted = classify.id;
    //    }
    //    h += _h;
    //  });
    let scale = e.detail.scrollTop / 750
    let titledomlist = this.data.titledomlist || []
    let classifySeleted = this.data.classifySeleted || ''
    let tTop = titledomlist[0].top
    let className = titledomlist[0].name || ''
    let len = titledomlist.length - 1
    for (let i=len;i>=0;i--) {
      if (e.detail.scrollTop >= (titledomlist[i].top - tTop - 60*scale )) {
        classifySeleted = titledomlist[i].id
        className = titledomlist[i].dataset.name
        break
      }
    }

     this.setData({
       classifySeleted: classifySeleted,
       className: className
     });
   },
   // 显示隐藏购物车详情
   changeCardDetailStatus() {
     this.setData({
       cardDetailStatus: !this.data.cardDetailStatus
     })
   },
   // 检测购物车中是否有相同的商品(名字判断)
   checkOrderSameName: function(name) {
     var list = this.data.cartList;
     for (var index in list) {
       if (list[index].name === name) {
         return index;
       }
     }
     return false;
   },
   // 检测购物车中是否有相同的商品 规格(名字判断)
   checkOrderSameSpecName: function(specName) {
     var list = this.data.activeSpec.menu;
     for (var index in list) {
       if (list[index].specName === specName) {
         return index;
       }
     }
     return false;
   },
   // 检测购物车中是否有相同的商品
   checkOrderSameId: function(id) {
     var list = this.data.cartList;
     for (var index in list) {
       if (list[index].id === id) {
         return index;
       }
     }
     return false;
   },

   // 添加商品到购物车
   addCart(e) {
     // 商品id
     var currentMenu = e.target.dataset.data;
     var id = e.target.dataset.id;
     var name = e.target.dataset.name;
     var price = parseFloat(e.target.dataset.price);
     var spec = e.target.dataset.spec;
     var num = e.target.dataset.num;
     var img = e.target.dataset.img;
     var surcharge = e.target.dataset.surcharge || null
     console.log(id, name, price, spec, num, img)
     var _shop = this.data.shop;
     var list = this.data.cartList;
     var sortedList = {};

     // 费用处理
     console.log(currentMenu, 'iiiiiiiiiiiiiiiiiiiii')
     // 附加费
     var extrachargeFee = currentMenu.extrachargeFee ? currentMenu.extrachargeFee : 0;
     // 配送费
     var rewardFee = currentMenu.rewardFee ? currentMenu.rewardFee : 0;
     // 抽成
     var dtFee = currentMenu.dtFee ? currentMenu.dtFee : 0;
     var index; // 购物车中相同id index
     if (index = this.checkOrderSameId(id)) { //相同商品id
       var num = list[index].num;
       list[index].surcharge = surcharge
       list[index].num = np.plus(num, 1);
       sortedList = list[index];
     } else { //不同商品id
       var order = {
         "id": id,
         "name": name,
         "price": price,
         "spec": spec,
         "num": 1,
         "img": img,
         'surcharge': surcharge,
         'extrachargeFee': extrachargeFee,
         'rewardFee': rewardFee, // 配送费
         'dtFee': dtFee,
         'settlement': currentMenu.settlement ? true : false
       }
       list.push(order);
       sortedList = order;
     }
     // 改变数据
     this.changeShopData(id, 'add');
     this.setData({
       cartList: list,
       localList: util.filterEmptyObject(list)
     });
     // 商店底部总价展示
     this.addCount(sortedList);
   },
   // 添加删除商品时改变数据；
   changeShopData(id, flag) {
     var _shop = this.data.shop;
     _shop.data.forEach((item1, index1) => { // 循环分类
       item1.menu.forEach((item2, index2) => { // 循环菜品
         if (item2.id === id) {
           if (flag === 'add') {
             item2.num++;
           } else {
             item2.num--;
           }
         }
         item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
           if (item3.id === id) {
            let surchargePrice = 0;
            if (item2.surcharge && item2.surcharge.length > 0) {
              item2.surcharge.forEach((sureitem) => {
                if (!sureitem.hide) {
                  surchargePrice = np.plus(surchargePrice, sureitem.price)
                }
             })
            }
             if (flag === 'add') {
               item3.num = np.plus(item3.num, 1);
               let price = np.plus(item3.price, surchargePrice);
               _shop.data[index1].menu[index2].num = np.plus(_shop.data[index1].menu[index2].num, 1);
               _shop.data[index1].menu[index2].total = np.plus(_shop.data[index1].menu[index2].total, price);
              } else {
               item3.num = np.minus(item3.num, 1);
               let price = np.plus(item3.price, surchargePrice);
               _shop.data[index1].menu[index2].num = np.minus(_shop.data[index1].menu[index2].num, 1);
               _shop.data[index1].menu[index2].total = np.minus(_shop.data[index1].menu[index2].total, price);
             }
           }
         })
       })
     })
     this.setData({
       shop: _shop
     })
   },
   // 清空数量；
   initShopData() {
    var _shop = this.data.shop;
    _shop.data.forEach((item1, index1) => { // 循环分类
      item1.menu.forEach((item2, index2) => { // 循环菜品
        item2.num = 0;
        item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
          item3.num = 0;
          _shop.data[index1].menu[index2].num = 0;
        })
      })
    })
    this.setData({
      shop: _shop
    })
  },
   // 删除购物车商品
   reduceCart(e) {
     // console.log(e);
     var id = e.target.dataset.id;
     var name = e.target.dataset.name;
     var price = parseFloat(e.target.dataset.price);
     var spec = e.target.dataset.spec;
     var num = e.target.dataset.num;
     console.log(id, name, price, spec, num)

     var _shop = this.data.shop;
     var list = this.data.cartList;
     var sortedList = {};
     var index; // 购物车中相同id index
     if (index = this.checkOrderSameId(id)) {
       var num = list[index].num;
       sortedList = list[index];
       if (num > 1) {
         list[index].num = num - 1;
       } else {
         list.splice(index, 1);
       }

       // 为初始数据添加数量
       this.changeShopData(id, 'reduce');

     }
     this.setData({
       cartList: list,
       localList: util.filterEmptyObject(list)
     });
     this.deduceCount(sortedList);
   },
   // 保留两位小数
   toFixed2(money) {
     if (String(money).indexOf(".") != -1 && String(money).split(".")[1].length > 2) {
       // money = Math.round(Number(money) * 100) / 100;
       money = parseFloat(money).toFixed(2);
     }
     return parseFloat(money)
   },
   // 添加商品计算商品总数和总价
   addCount: function(list) {
     var count = np.plus(this.data.cart.count, 1)
     let surchargePrice = 0;
     if (list.surcharge && list.surcharge.length > 0) {
      list.surcharge.forEach((sureitem) => {
        if (!sureitem.hide) {
          surchargePrice = np.plus(surchargePrice, sureitem.price)
        }
      })
     }
     let price = np.plus(list.price, surchargePrice);
     console.log(price, 'add price')
     var total = np.plus(this.data.cart.total, price);
     this.saveCart(count, total);
   },
   // 删除商品计算商品总数和总价
   deduceCount: function(list) {
     var count = np.minus(this.data.cart.count, 1);
     let surchargePrice = 0;
     if (list.surcharge && list.surcharge.length > 0) {
      list.surcharge.forEach((sureitem) => {
        if (!sureitem.hide) {
          surchargePrice = np.plus(surchargePrice, sureitem.price)
        }
      })
     }
     let price = np.plus(list.price, surchargePrice);
     var total = np.minus(this.data.cart.total, price);
     this.saveCart(count, total);
   },
   // 把选中的商品储存到本地
   saveCart: function(count, total) {
     if (typeof total == null) {
       total = 0;
     }
     this.setData({
       cart: {
         count: count,
         total: total
       }
     });
     if (this.data.orderType === 0) {
       wx.setStorage({
         key: 'orderList',
         data: {
           cartList: this.data.cartList,
           count: this.data.cart.count,
           total: this.data.cart.total,
         }
       })
     } else {
       var foodList = [];
       var order = {};
       this.data.cartList.forEach((item, index) => {
         order = {
           "dishesId": item.id,
           "dishesName": item.name,
           "unitPrice": item.price,
           "dishesSpecName": item.spec,
           "quantity": item.num,
           "imgUrl": item.img
         }
         foodList.push(order);
       })
       wx.setStorage({
         key: 'foodList',
         data: foodList
       })
     }
     console.log(foodList)
   },
   // 选择规格
   selectSpec(e) {
     var activeSpecItemsId = (e.target.dataset.id); // 当前多规格菜品 id
     var classifyIndex = (e.target.dataset.classifyindex); // 分类index
     var menuIndex = (e.target.dataset.menuindex); // 菜品index
     console.log(classifyIndex, menuIndex, activeSpecItemsId)


     this.setData({
       activeSpecItemsId: activeSpecItemsId,
       goodsModalStatus: !this.data.goodsModalStatus,
       activeSpec: this.data.shop.data[classifyIndex].menu[menuIndex]
     })
   },
   // 清空购物车
   clearCart() {
     var that = this;
     wx.showModal({
       title: '购物车清空',
       content: '确认要清空购物车吗？',
       success(res) {
         if (res.confirm) {
           that.setData({
             cart: {
               count: 0,
               total: 0
             },
             cartList: [],
             localList: []
           });
           that.initShopData();
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     })
   },
   // 选择规格模态框
   selectGoodsModalStatus() {
     this.setData({
       activeSpecItemsId: '',
       goodsModalStatus: !this.data.goodsModalStatus
     })
   },
   // 确认订单
   goSureOrder() {
     if (this.data.cart.count == 0) {
       wx.showToast({
         title: '请选择商品',
         icon: 'none',
         duration: 2000
       })
       return
     }
     let selectList = JSON.stringify(this.data.localList);
     let cartData = JSON.stringify(this.data.cart);
     let shopAddressInfo = JSON.stringify(this.data.addressInfo)
     let feeConfig = JSON.stringify(this.data.feeConfig)
     console.log(selectList, '结算商品列表')
     let severalConfig = JSON.stringify(this.data.severalConfig)
     wx.navigateTo({
       url: '../sureOrderNew/index?orderList=' + selectList + '&cart=' + cartData + '&schoolId=' + this.data.schoolId + '&shopId=' + this.data.shopId + '&shopName=' + this.data.shopName + '&feeConfig=' + feeConfig + '&shopAddressInfo=' + shopAddressInfo + '&dvideId=' + this.data.dvideId + '&type=' + this.data.goodsType + '&dtConfig=' + JSON.stringify(this.data.dtConfig) + '&pickupTime=' + JSON.stringify(this.data.pickupTime) + '&severalConfig=' + severalConfig
     })
   },
   // 核销商品结算
   goWriteOffSettlement (e) {
    let menuData = e.target.dataset.item
    // 商品id
    var id = menuData.id;
    var name = menuData.name;
    var price = parseFloat(menuData.price);
    var spec = menuData.spec;
    var num = menuData.num;
    var img = menuData.img;
    var detail = menuData.detail ? encodeURIComponent(menuData.detail) : ''
    var surcharge = menuData.surcharge || null
    var goodsType = menuData.goodsType || null
    console.log(id, name, price, spec, num, img)
    let feeConfig = JSON.stringify(this.data.feeConfig)
    var list = [];

    // 抽成
    var dividePrice = menuData.divide ? menuData.divide.price : 0;
    var reward = menuData.reward ? menuData.reward : 0;
    let severalConfig = JSON.stringify(this.data.severalConfig)
    
    var order = {
      "id": id,
      "name": name,
      "price": price,
      "spec": spec,
      "num": 1,
      "img": img,
      'surcharge': surcharge,
      'dividePrice': dividePrice,
      'reward': reward,
      'goodsType': goodsType
    }
    list.push(order);

     let selectList = JSON.stringify(list);
     let cartData = JSON.stringify({
       count: 1,
       total: price
     });
     let tosurcharge = JSON.stringify([]);
     let shopAddressInfo = JSON.stringify(this.data.addressInfo)
     wx.navigateTo({
       url: '../sureOrderNew/index?orderList=' + selectList + '&cart=' + cartData + '&schoolId=' + this.data.schoolId + '&shopId=' + this.data.shopId + '&shopName=' + this.data.shopName + '&surcharge=' + tosurcharge  + '&type=arrival&detail=' + detail + '&shopAddressInfo=' + shopAddressInfo + '&severalConfig=' + severalConfig + '&feeConfig=' + feeConfig
     })
   },
   // 确认修改
   goEditOrder() {
     wx.redirectTo({
       url: '../editOrder/editOrder?type=1'
     })
     // wx.navigateBack({
     //   delta: 1
     // })
   },
   // 去首页
   goIndex() {
     wx.reLaunch({
       url: '/pages/sweepCodePay/sweepCodePay'
     })
   },
   showToast() {
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '商品获取中...',
      icon: 'loading',
      duration: 2000,
      mask: true
    })
   },
   hideToast() {
     wx.hideNavigationBarLoading();
     wx.hideToast();
   },
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
    //  if (this.data.shop) {
    //   this.setData({
    //     classifySeleted: this.data.shop.data[0].id
    //   });
    //  }
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {
     
   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },
   homeClick (obj) {
    wx.redirectTo({
      url: '/pages/work/index/index?schoolId=' + this.data.schoolId
    })
   },
   onShareAppMessage: function (res) {
    let that = this;
    let shareImg = 'https://v7-fs-im.7moor.com/im/2100147/2100147/20220428172541/1651137941602/1fbbb2bb39184a57a64f86d2a1a6271d/%E5%9B%BE%E6%80%AA%E5%85%BD_625aea0740528bb8e2f48fcf850b8788_73867.jpg?imagediv2/2/w/300/h/300'
    let shareTitle = that.data.shopName
    
    return {
      title: shareTitle,
      path: '/pages/work/shop/index?schoolId=' + that.data.schoolId + '&shopId=' + that.data.shopId,
      imageUrl: '',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
     // 转发成功
          wx.showToast({
            title: "分享成功",
            icon: 'success',
            duration: 2000
          })
       },
      fail: function (res) {
        // 分享失败
      },
    }
  },
  selectDelivery (e) {
    let type = e.target.dataset.type
    let currentStatus = this.data.dtConfig.indexOf(type) > -1
    if (!currentStatus) {
      return
    }
    let filterShop = this.filterShopDataByGoodsType(type)
    let filterTotal = this.filterLocalList(type)
    this.setData({
      goodsType: type,
      shop: filterShop,
      localList: filterTotal.localList,
      cart: filterTotal.cart
    })
  },
  // 按份附加费
  getExtracharge (fee, type) {
    // sultType: [] 适用类型
    let feeConfig = this.data.severalConfig
    let extracharge = feeConfig.extracharge
    // 用于展示
    if (extracharge) {
      let currentFee = Number(fee)
      let setExtracharge = [];
      extracharge.forEach((item) => {
        if (item.trigger === 'bycost') {
          item.rule.some((ruleItem) => {
             let currentSection = ruleItem.section;
             let section0 = Number(currentSection[0]);
             let section1 = Number(currentSection[1]);
             let ruleFee = Number(ruleItem.fee);
             if (section1 > 0) {
               if (currentFee >= section0 && currentFee < section1) {
                 setExtracharge.push({
                   title: item.label,
                   price: ruleFee,
                   hide: item.sultType.indexOf(type) < 0,
                   // 用于localData 处理
                   type: item.sultType
                 })
                 return true
               }
             } else {
               if (currentFee > section0) {
                 setExtracharge.push({
                   title: item.label,
                   price: ruleFee,
                   hide: item.sultType.indexOf(type) < 0
                 })
                 return true
               }
             }  
          })
       }
      })

      let extrachargeFee = 0;
      setExtracharge.forEach((item) => {
       if (!item.hide) {
        extrachargeFee = np.plus(extrachargeFee, item.price)
       }
      })
      console.log('按份附加费用：', extrachargeFee)
      return {
       setExtracharge: setExtracharge,
       extrachargeFee: extrachargeFee
      }
    }
  },
  // 按份配送费
  getRewardInfo (fee, type) {
    let feeConfig = this.data.severalConfig
    let sultType = ['delivery']
    let tApConfig = feeConfig.tApConfig
    let returnFee = 0;
    if (tApConfig && sultType.indexOf(type) > -1) {
      let currentFee = Number(fee)
      console.log(tApConfig, '配送费配置')
      if (tApConfig.type === 'fixed') {
        // 固定费用
        returnFee = Number(tApConfig.value.value); 
      } else if (tApConfig.type === 'ladder') {
        let rule = tApConfig.value
        if (rule && rule.length > 0) {
           let isState = false
           rule.some((item) => {
             let section = item.section
             let section0 = Number(section[0])
             let section1 = Number(section[1])
             if (currentFee >= section0 && currentFee < section1) {
               // 结束
               console.log('命中配置ooo', item)
               isState = true
               returnFee = Number(item.fee)
               return true
             }
           })
           if (!isState) {
             returnFee = Number(rule[0].fee)
           }
        }
      }
    }
    console.log('按份配送费用：', returnFee)
    return {
      rewardFee: returnFee
    }
  },
  // 按份抽成
  getDtFee (currentFee, type) {
    let feeConfig = this.data.severalConfig
    let dfConfig = feeConfig.dfConfig;
    let fee = Number(currentFee)
    let returnFee = 0;
    if (dfConfig) {
      let currentType = dfConfig.type;
      if (currentType === 'fixed') {
         let currentValue = dfConfig.value;
         if (currentValue.type === 'bytype') {
           returnFee = Number(currentValue.typeValue[type])
         } else {
           returnFee = Number(currentValue.value)
         }
      } else if (currentType === 'percentage') {
        let currentValue = dfConfig.value
        let pg = 0;
        if (currentValue.type === 'bytype') {
           pg = Number(currentValue.typeValue[type])
        } else {
           pg = Number(currentValue.value)
        }
        returnFee = np.times(np.divide(pg, 100), fee)
      } else if (currentType === 'ladder') {
        let currentValue = dfConfig.value;
        let isState = false
        currentValue.some((item) => {
          let section = item.section
          let section0 = Number(section[0])
          let section1 = Number(section[1])
          if (fee >= section0 && fee <section1) {
            if (item.type === 'bytype') {
              returnFee = Number(item.typefee[type])
            } else {
              returnFee = Number(item.fee)
            }
            isState = true
            return true
          }
        })
        if (!isState) {
          let currentRule = currentValue[0]
          if (currentRule.type === 'bytype') {
            returnFee = Number(currentRule.typefee[type])
          } else {
            returnFee = Number(currentRule.fee)
          }
        }
      }
    }
    console.log('按份抽成费用:', Number(returnFee.toFixed(2)))
    return {
      fee: Number(returnFee.toFixed(2))
    }
  },
  filterShopDataByGoodsType (type, shopdata) {
    var that = this;
    var severalConfig = this.data.severalConfig || null
    var _shop = this.data.shop || shopdata;
     _shop.data.forEach((item1, index1) => { // 循环分类
       item1.menu.forEach((item2, index2) => { // 循环菜品
        let item2Total = 0
        if (item2.settlement) {
          // 是否按份配置
          // 按份附加费处理
          let getExtrachargeInfo = that.getExtracharge(item2.price, type)
          item2.surcharge = getExtrachargeInfo.setExtracharge
          item2.extrachargeFee = getExtrachargeInfo.extrachargeFee
          // // 按份配送费
          // let getRewardInfo = that.getRewardInfo(item2.price, type)
          // item2.rewardFee = getRewardInfo.rewardFee
          // // 按份抽成费用
          // let getDtFeeInfo = that.getDtFee(item2.price, type)
          // item2.dtFee = getDtFeeInfo.fee
        } else {
          item2.surcharge = null
        }
        if (item2.menu && item2.menu.length > 0) {
          item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
            // 每个规格费用
            if (item2.settlement && item2.extrachargeFee) {
              let item3surcharge = item2.extrachargeFee
              item2Total = np.plus(item2Total, np.times(item3.num, np.plus(item3.price, item3surcharge)))
            } else {
              item2Total = np.plus(item2Total, np.times(item3.num, item3.price))
            }
          })
        } else {
          if (item2.settlement && item2.extrachargeFee) {
            let item3surcharge = item2.extrachargeFee
            item2Total = np.plus(item2Total, np.times(item2.num, np.plus(item2.price, item3surcharge)))
          } else {
            item2Total = np.plus(item2Total, np.times(item2.num, item2.price))
          }
        }
        item2.total = item2Total
       })
     })
     return _shop
  },
  filterLocalList (type) {
    // 重新计算总价
    let _localList = this.data.localList;
    let _cart = this.data.cart;
    let total = 0;
    _localList.forEach((item) => {
      let menuTotal = item.price
      if (item.settlement) {
        // 处理购物车 按份计算
        if (item.surcharge && item.surcharge.length > 0) {
          item.surcharge.forEach((sureitem) => {
            // 配送类型  selflifting-自提  delivery-外卖
            if (sureitem.type && sureitem.type.indexOf(type) > -1) {
              sureitem.hide = false
            } else {
              sureitem.hide = true
            }
            if (!sureitem.hide) {
              menuTotal = np.plus(menuTotal, Number(sureitem.price))
            }
          })
        }
      }
      menuTotal = np.times(menuTotal, item.num)
      total = np.plus(total, menuTotal)
    })

    _cart.total = total
    return {
      localList: _localList,
      cart: _cart
    }
  }
 })