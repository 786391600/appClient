 // pages/shop.js
 const util = require('../../../until/index');
 const app = getApp();
 const ajax = app.globalData.ajax;
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     shop: {}, // 商品数据
     classifySeleted: '',
     defaultImg: 'http://img.beijixiong.club:4869/fde7f4b3d7256c82dfb17c15057b1e8b',
     cardDetailStatus: false,
     goodsModalStatus: false, // 选择规格弹窗
     activeSpecItemsId: '',
     activeSpec: [],
     cartList: [],
     cart: {
       count: 0,
       total: 0
     },
     localList: [],
     addAppMaskStatus: true, // 添加小程序提示
     orderType: 0, // 0为正常下单 1为修改订单
     foodList: [],
     scrollHeight: '',
     maskAllPage: true,
     schoolId: '',
     shopId: '',
     surcharge: []
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
         that.setData({
           scrollHeight: res.windowHeight
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
        console.log(e.data)
        let shopData = e.data.data.shopData || [];
        let shopName = e.data.data.title || '校园商店';
        let surcharge = e.data.data.surcharge || [{label: '配送费', price: 1}];
        let shop = {
          data: shopData,
          icon: e.data.data.icon || null,
          color: e.data.data.color || null,
          deliveryPrice: e.data.data.deliveryPrice || 0,
          close: e.data.data.close || false,
          notice: e.data.data.notice || ''
        }
        that.setData({
          shop: shop,
          classifySeleted: shopData[0].id,
          schoolId: options.schoolId,
          shopId: options.shopId,
          shopName: shopName,
          surcharge: surcharge
        })
        wx.setNavigationBarTitle({
          title: shopName
        })
        // 获取本地已储存数据
       //  if (this.data.orderType == 0) {
       //    this.getLocalData();
       //  } else {
       //    this.getLocalDataModify();
       //  }
        // 关闭遮罩层
        that.setData({
          maskAllPage: false
        })
      }
      that.hideToast()
    }) 
   },
   // 获取本地订单数据
   getLocalData() {
     var res = wx.getStorageSync('orderList');
     if (res) {
       this.setData({
         cart: {
           count: res.count,
           total: res.total
         }
       });
       if (!util.isEmptyObject(res.cartList)) {
         this.setData({
           cartList: res.cartList,
           localList: util.filterEmptyObject(res.cartList)
         });
         // 用本地数据覆盖获取的数据
         res.cartList.forEach((localItem, index) => {
           var _id = localItem.id;
           var _shop = this.data.shop;
           _shop.data.forEach((item1, index1) => { // 循环分类
             // console.log(1111111,item1);
             item1.menu && item1.menu.forEach((item2, index2) => { // 循环菜品
               // console.log(222222,item2);
               if (item2.id === _id) {
                 item2.num = localItem.num;
               }
               item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
                 if (item3.id === _id) {
                   item3.num = localItem.num;
                   _shop.data[index1].menu[index2].num += localItem.num;
                   _shop.data[index1].menu[index2].total += localItem.num * localItem.price;
                 }
               })
             })
           })
           this.setData({
             shop: _shop
           })
         })
       }
     }
   },
   // 获取本地修改订单数据
   getLocalDataModify() {
     var foodList = wx.getStorageSync('foodList');
     var count = 0;
     var total = 0;
     var cartList = [];
     var order = {};
     if (foodList) {
       foodList.forEach((item, index) => {
         count += item.quantity;
         total += item.quantity * item.unitPrice;
         total = this.toFixed2(total)
         order = {
           "id": item.dishesId,
           "name": item.dishesName,
           "price": item.unitPrice,
           "spec": item.dishesSpecName,
           "num": item.quantity,
           "img": item.imgUrl
         }
         cartList.push(order);
       })

       this.setData({
         cart: {
           count: count,
           total: total
         }
       });
       if (!util.isEmptyObject(cartList)) {
         this.setData({
           cartList: cartList,
           localList: util.filterEmptyObject(cartList)
         });
         // 用本地数据覆盖获取的数据
         cartList.forEach((localItem, index) => {
           var _id = localItem.id;
           var _shop = this.data.shop;
           _shop.data.forEach((item1, index1) => { // 循环分类
             // console.log(1111111,item1);
             item1.menu && item1.menu.forEach((item2, index2) => { // 循环菜品
               // console.log(222222,item2);
               if (item2.id === _id) {
                 item2.num = localItem.num;
               }
               item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
                 if (item3.id === _id) {
                   item3.num = localItem.num;
                   _shop.data[index1].menu[index2].num += localItem.num;
                   _shop.data[index1].menu[index2].total += localItem.num * localItem.price;
                 }
               })
             })
           })
           this.setData({
             shop: _shop
           })
         })
       }
     }
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
     var scale = e.detail.scrollWidth / 570,
       scrollTop = e.detail.scrollTop / scale,
       h = 0,
       classifySeleted,
       len = this.data.shop.data.length;
     this.data.shop.data.forEach(function(classify, i) {
       var _h = 74 + classify.menu.length * 156;
       if (scrollTop >= h - 100 / scale) {
         classifySeleted = classify.id;
       }
       h += _h;
     });

     this.setData({
       classifySeleted: classifySeleted
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
     // console.log(e);
     var id = e.target.dataset.id;
     var name = e.target.dataset.name;
     var price = parseFloat(e.target.dataset.price);
     var spec = e.target.dataset.spec;
     var num = e.target.dataset.num;
     var img = e.target.dataset.img;
     console.log(id, name, price, spec, num, img)

     var _shop = this.data.shop;
     var list = this.data.cartList;
     var sortedList = {};
     var index; // 购物车中相同id index
     if (index = this.checkOrderSameId(id)) { //相同商品id
       sortedList = list[index];
       var num = list[index].num;
       list[index].num = num + 1;
     } else { //不同商品id
       var order = {
         "id": id,
         "name": name,
         "price": price,
         "spec": spec,
         "num": 1,
         "img": img
       }
       console.log(spec)
       list.push(order);
       sortedList = order;
     }
     // 改变数据
     this.changeShopData(id, 'add');
     this.setData({
       cartList: list,
       localList: util.filterEmptyObject(list)
     });
     this.addCount(sortedList);
   },
   // 添加删除商品时改变数据；
   changeShopData(id, flag) {
     var _shop = this.data.shop;
     _shop.data.forEach((item1, index1) => { // 循环分类
       // console.log(1111111,item1);
       item1.menu.forEach((item2, index2) => { // 循环菜品
         // console.log(222222,item2);
         if (item2.id === id) {
           if (flag === 'add') {
             item2.num++;
           } else {
             item2.num--;
           }
         }
         item2.menu && item2.menu.forEach((item3, index3) => { // 循环规格
           if (item3.id === id) {
             if (flag === 'add') {
               item3.num++;
               _shop.data[index1].menu[index2].num++;
               _shop.data[index1].menu[index2].total += item3.price;
             } else {
               item3.num--;
               _shop.data[index1].menu[index2].num--;
               _shop.data[index1].menu[index2].total -= item3.price;
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
      // console.log(1111111,item1);
      item1.menu.forEach((item2, index2) => { // 循环菜品
        // console.log(222222,item2);
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
     var count = this.data.cart.count + 1,
       total = this.data.cart.total + list.price;
     total = this.toFixed2(total);
     this.saveCart(count, total);
   },
   // 删除商品计算商品总数和总价
   deduceCount: function(list) {
     var count = this.data.cart.count - 1,
       total = this.data.cart.total - list.price;
     total = this.toFixed2(total);
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
     let surcharge = JSON.stringify(this.data.surcharge);
     wx.navigateTo({
       url: '../sureOrder/index?orderList=' + selectList + '&cart=' + cartData + '&schoolId=' + this.data.schoolId + '&shopId=' + this.data.shopId + '&shopName=' + this.data.shopName + '&surcharge=' + surcharge
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

   }
 })