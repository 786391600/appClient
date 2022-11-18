 // pages/shop.js
 const until = require('../../../until/index');
 const app = getApp();
 const globleData = require('../globleData.js');
 const np = require('../../../until/number');
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     form : {
       address: {
         phone: '',
         name: '',
         schoolName: '',
         address: ''
       }
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
     feeTotal: 0,
     // 结算
     settlement: {},
     remarks: '',
     goodsType: 'delivery', // selflifting-自提  delivery-外卖 arrival-核销 堂食
     goodsTypeList: [{title: '帮手配送', type: 'delivery'},{title: '到店自提', type: 'selflifting'}],
     goodsDetail: '',
     shopAddressInfo: {},
     buildingConfig: [], // 校园楼栋
     building: '', // 选择楼栋
     showBuildingDialog: false,
     cloneOptions: {},
     showTakeTime: false, // 选择取餐时间
     takeTimeObj: {},
     pickupTime: []
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
    // 核销逻辑
    this.data.cloneOptions = options;
    this.data.dtConfig = options.dtConfig ?  JSON.parse(options.dtConfig) :  ['delivery', 'selflifting']
    this.initData(options);
    this.initSchoolInfo();
    this.initAddress();
   },
   onShow: function(options) {},
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
    if (addressList[0]) {
      form.address = addressList[0]
    }
    this.setData({
      form: form
    })
   },
   initData (options) {
     let orderList = JSON.parse(options.orderList);
     let goodsDetail = options.detail ? decodeURIComponent(options.detail) : '';
     // 按份自提抽成
     let selfliftingDivide = 0;
     // 核销商品抽成
     let arrivalDivide = 0;
     // 按份堂食抽成
     let eatinDivide = 0;
     // 外卖按份抽成总费用
     let dividePrice = 0;
     // 按份奖励总费用
     let reward = 0;
     // 不按份收取的总价
     let lyFee = 0
     orderList.forEach((item)=>{
       if (!item.surcharge) {
         lyFee = np.plus(lyFee, np.times(item.price, item.num));
       }
       // 按份抽成
       if (item.dividePrice && item.dividePrice > 0) {
         let itemDvidePrice = np.times(item.dividePrice, item.num)
         dividePrice = np.plus(dividePrice, itemDvidePrice);
       }

       
       // 按份骑手奖励
       if (item.reward && item.reward > 0) {
        let itemReward = np.times(item.reward, item.num); 
        reward = np.plus(reward, itemReward);
       }

       // 按份自取分成
       if (item.selfliftingDivide && item.selfliftingDivide > 0) {
        selfliftingDivide = np.plus(selfliftingDivide, item.selfliftingDivide)
       }

       // 按份核销分成
       if (item.arrivalDivide && item.arrivalDivide > 0) {
         arrivalDivide = np.plus(arrivalDivide, item.arrivalDivide)
       }

       // 按份堂食分成
       if (item.eatinDivide && item.eatinDivide > 0) {
         eatinDivide = np.plus(eatinDivide, item.eatinDivide)
       }
     })

     // 按订单价格结算
     let surchargeConfig = JSON.parse(options.surchargeConfig) || {
       section: 9, // 涨价区间
       divide: 1.2, // 抽成费用
       reward: 1, // 骑手费用
       selfliftingDivide: 1, // 自提基础抽成
       arrivalDivide: 1, // 核销基础抽成
       eatinDivide: 1 // 堂食基础抽成
     }
     console.log(surchargeConfig, '基础费用配置')
     // 收费项目
     let surcharge = JSON.parse(options.surcharge);
     let share = 1; // 计算份数
     if (lyFee > 10) {
       share = parseInt(lyFee/surchargeConfig.section); // 按涨价区间
     }
     if (lyFee === 0) {
       share = 0;
     }
     
     // 总基础配送费
     let surchargeFee = 0;
     // 基础抽成费用-外卖
     let sDvidePrice = np.times(share, surchargeConfig.divide);
     dividePrice = np.plus(dividePrice, sDvidePrice); // 总抽成费用
     console.log(dividePrice, 'dividePrice')
     // 基础自提抽成
     let sSelfliftingDivide = np.times(share, surchargeConfig.selfliftingDivide || 1)
     selfliftingDivide = np.plus(selfliftingDivide, sSelfliftingDivide) // 总自提抽成
     
     console.log(selfliftingDivide, 'selfliftingDivide')
     // 基础核销抽成
     let sArrivalDivide = np.times(share, surchargeConfig.arrivalDivide || 1)
     arrivalDivide = np.plus(sArrivalDivide, arrivalDivide) // 核销总抽成
     console.log(arrivalDivide, 'arrivalDivide')
     // 基础堂食抽成 
     let sEatinDivide = np.times(share, surchargeConfig.eatinDivide || 1)
     eatinDivide = np.plus(sEatinDivide, eatinDivide) // 堂食总抽成
     console.log(eatinDivide, 'eatinDivide')
     // 配送费
     let sReward = np.times(share, surchargeConfig.reward);
     reward = np.plus(reward, sReward);

     surcharge = surcharge.map((item) => {
       if (options.type === 'selflifting') {
         if (item.label.indexOf('跑') > -1 || item.label.indexOf('送') > -1 || item.label.indexOf('配') > -1) {
          return
         }
       }
       let price = np.times(item.price, share);
       surchargeFee = np.plus(surchargeFee, price);
       if (price > 0) {
        return {
          label: item.label,
          price: price
        }
       }
     })


     let cart = JSON.parse(options.cart);
     
     // 订单总价
     let feeTotal = np.plus(cart.total, surchargeFee);
     
     // 骑手提现手续费 1.2%
     if (reward > 0) {
       reward = np.minus(reward, np.times(reward, 0.012)); 
       reward = Math.floor(reward * 100)/100;
     }

      // 总抽成
      let totalDivide = 0
     // 总提现费用
     let initsettlementTotal = 0;
     if (options.type === 'selflifting') {
      // 自提
      initsettlementTotal = np.minus(feeTotal, selfliftingDivide);
      totalDivide = selfliftingDivide
    }

    if (options.type === 'delivery') {
      // 帮手配送
      initsettlementTotal = np.minus(feeTotal, dividePrice);  
      totalDivide = dividePrice
    }

    if (options.type === 'arrival') {
      // 帮手配送
      initsettlementTotal = np.minus(feeTotal, arrivalDivide);
      totalDivide = arrivalDivide
    }

    if (options.type === 'eatin') {
      // 堂食
      initsettlementTotal = np.minus(feeTotal, eatinDivide);  
      totalDivide = eatinDivide
    }

     // 手续费
     let settlementTotalSc = np.times(initsettlementTotal, 0.012);
     settlementTotalSc = Math.floor(settlementTotalSc * 100)/100;
     // 实际提现费用
     let settlementTotal = np.minus(initsettlementTotal, settlementTotalSc);
     settlementTotal = Math.floor(settlementTotal * 100)/100;


     // 店家地址信息
     let shopAddressInfo = JSON.parse(options.shopAddressInfo);



     this.setData({
       orderList: orderList,
       cart: cart,
       schoolId: options.schoolId,
       shopId: options.shopId,
       shopName: options.shopName,
       surcharge: surcharge,
       feeTotal: feeTotal,
       settlement: {
        // 除了基础配送费的总收入 
        total: feeTotal,
        // 抽成总费用
        totalDivide: totalDivide,
        // 骑手佣金
        reward: reward,
        // 提现手续费
        settlementTotalSc: settlementTotalSc,
        // 最终提现费用
        settlementTotal: settlementTotal
       },
       // 核销商品介绍
       goodsDetail: goodsDetail,
       // 店家信息
       shopAddressInfo: shopAddressInfo,
       dvideId: options.dvideId, // 分成ID
       goodsType: options.type || 'delivery', // 配送类型
       pickupTime: options.pickupTime ? JSON.parse(options.pickupTime) : []
     })
     console.log(this.data.settlement, 'jjjjjjjjjjjjjjjjjjj')
   },
   payForm () {
     // 配送员配送必填
     if (this.data.goodsType === 'delivery') {
      // 配送需要地址
      if (!this.data.form.address.phone || !this.data.form.address.address) {
        wx.showToast({
          title: '请选配送地址',
          duration: 3000,
          icon: 'error'
        })
        return
      }

      if (this.data.buildingConfig && this.data.buildingConfig.length > 0 && !this.data.building) {
        this.setData({
          showBuildingDialog: true
        })
        return
      }
    }

    if (this.data.goodsType === 'selflifting') {
      // 核销必填
      if (!this.data.form.address.phone) {
        this.bindPhone()
        return
      }
      this.data.form.address.shopAddressInfo = this.data.shopAddressInfo
    }

    if (this.data.goodsType === 'arrival') {
      // 核销必填
      if (!this.data.form.address.phone) {
        this.bindPhone()
        return
      }
      this.data.form.address.shopAddressInfo = this.data.shopAddressInfo
    }
    if (this.data.payStatus) {
      return
    }
    this.setPayLoading(true);
    let that = this;
    let custom = {}
    if (that.data.goodsType === 'selflifting') {
      // 自提
      custom = {
        takefoodTime: that.data.takeTimeObj.key,
        takeAddress: that.data.shopAddressInfo.address || that.data.shopName
      }
    }

    if (that.data.goodsType === 'delivery') {
      // 帮手配送
      custom = {
        building: that.data.building || '' // 配送楼栋
      }
    }


    until.shopPay({
      body: that.data.shopName || '校园小店',
      fee: that.data.feeTotal,
      goods: that.data.orderList,
      schoolId: that.data.schoolId,
      shopId: that.data.shopId,
      address: that.data.form.address,
      type: 'school_shop',
      settlement: that.data.settlement,
      remarks: that.data.remarks || '',
      dvideId: that.data.dvideId || '',
      custom: custom,
      goodsType: that.data.goodsType
    }).then((res) => {
      this.setPayLoading(false);
      wx.requestSubscribeMessage({
        tmplIds: ['QSris88nvy4XR0ldWbXuwOFQM4yfCIdsZsxYLS1_Nos', 'yTas2pqWLsyX0gr6mjmkhzMzJecrRao3zOH3P-wt6TE', 'LkujRkoBqnOK-7xKwz8645EF9ZrI6ROu1FCHmMHXuvE'],
        success (res) {}
      })
      wx.navigateTo({
        url: '/pages/work/paySuccess/index?type=success'
      })
    }).catch((res) => {
      this.setPayLoading(false);
      wx.navigateTo({
        url: '/pages/work/paySuccess/index'
      })
    })
   },
   setPayLoading (status) {
     this.setData({
      payStatus: status
     })
   },
   toRemarks () {
    wx.navigateTo({
      url: '/pages/work/orderRemarks/index?remarks='+ this.data.remarks,
      fail (err) {
        
      }
    })
   },
   bindPhone () {
    let that = this;
    let currentPhone = that.data.form.address.phone || ''
    wx.showModal({
      title: '核销手机号',
      content: currentPhone,
      editable: true,
      placeholderText: '请输入核销手机号',
      success (res) {
        if (res.confirm) {
          if (res.content) {
            let form = that.data.form
            form.address.phone = res.content
            that.setData({
              form: form
            })
          }
        }
      }
    })
   },
   selectBuilding () {
     this.setData({
      showBuildingDialog: true
     })
   },
   initSchoolInfo () {
    let that = this 
    globleData.getSchoolInfo(this.data.schoolId, function(e){
       if (e.success) {
         let schoolInfo = e.data
         let buildingConfig = schoolInfo.buildingConfig ? schoolInfo.buildingConfig : []
         if (buildingConfig && buildingConfig.length > 0) {
           if (buildingConfig[buildingConfig.length - 1].title !== '其他') {
             buildingConfig.push({title: '其他'})
           }
           that.setData({
            buildingConfig: buildingConfig
           })
         }
       }
    })
   },
   buildingChange (building) {
     let config = building.detail.data.title
     this.setData({
      building: config,
      showBuildingDialog: false
     })
   },
   changeGoodsType (e) {
     let goodsType = e.currentTarget.dataset.type
     let dtConfig = this.data.dtConfig
     if (dtConfig.indexOf(goodsType) < 0) {
      wx.showToast({
        title: '商家暂未开通~',
        icon: 'none',
        duration: 3000
       })
       return
     }
     this.data.cloneOptions.type = goodsType
     let changeObj = this.filterLocalList(goodsType)
     this.data.cloneOptions.orderList = JSON.stringify(changeObj.localList)
     this.data.cloneOptions.cart = JSON.stringify(changeObj.cart)
     this.initData(this.data.cloneOptions)
   },
   filterLocalList (type) {
    // 重新计算总价
    let _localList = JSON.parse(this.data.cloneOptions.orderList);
    let _cart = JSON.parse(this.data.cloneOptions.cart);
    let total = 0;
    _localList.forEach((item) => {
      let menuTotal = item.price
      if (item.surcharge && item.surcharge.length > 0) {
        item.surcharge.forEach((sureitem) => {
          // 配送类型  selflifting-自提  delivery-外卖
          if (type === 'selflifting') {
            if (sureitem.title.indexOf('跑') > -1 || sureitem.title.indexOf('送') > -1 || sureitem.title.indexOf('配') > -1) {
              sureitem.hide = true
            }
          } else if (type === 'delivery') {
            sureitem.hide = false
          }
          if (!sureitem.hide) {
            menuTotal = np.plus(menuTotal, Number(sureitem.price))
          }
        })
      }
      menuTotal = np.times(menuTotal, item.num)
      total = np.plus(total, menuTotal)
    })

    _cart.total = total
    return {
      localList: _localList,
      cart: _cart
    }
  },
  selectTackTime () {
    this.setData({
      showTakeTime: true
    })
  },
  getTakeTime (obj) {
    this.setData({
      takeTimeObj: obj.detail,
      showTakeTime: false
    })
  }
 })