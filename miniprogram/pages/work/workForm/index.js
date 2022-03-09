let app = getApp()
const until = require('../../../until/index.js');
const globleData = require('../globleData.js');
Page({
  data: {
    array: ['1公斤', '2公斤', '3公斤', '4公斤', '5公斤', '6公斤', '7公斤', '8公斤'],
    index: 0,
    multiArray: [['立即开始', '今天', '明天', '后天'], [], []],
    multiIndex: [0, 0, 0],
    address: null,
    form: {},
    labelConfig: {
      
    },
    payStatus: false, // 支付中状态
    taskType: '0',
    currentSpec: [{
      "type": "textarea",
      "label": "任务内容",
      "placeholder": "请点击上方选择一项业务"
    },{
      "label": "任务地址",
      "type": "address"
    },{
      "label": "预约时间",
      "type": "timeselect"
    }],
    labelList: [],
    showLabelTip: false,
    desObj: {
      taskTime: '预约时间',
      taskContent: '任务内容',
      address: '任务地址',
      fee: ''
    },
    setLabelIndex: -1
  },
  onLoad (options) {
    if (options.hasOwnProperty('businessIndex')) {
      this.setData({
        setLabelIndex: options.businessIndex
      })
    }
    this.initFormOptions(options.type)
    this.initAddress()
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [''];
            data.multiArray[2] = [''];
            break;
          case 1:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;
          case 2:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;
          case 3:
            data.multiArray[1] = ['07', '08', '09','10', '11', '12','13', '14', '15','16', '17', '18', '19', '20', '21', '22'];
            data.multiArray[2] = ['00', '20', '40'];
            break;  
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 1:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 2:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 3:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              case 4:
                data.multiArray[2] = ['00', '20', '40'];
                break;
              default:
                data.multiArray[2] = ['00', '20', '40'];
                break;  
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
             default:
              data.multiArray[2] = ['00', '20', '40'];
              break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  bindPickerChange: function(e) {
    const formKey = e.currentTarget.dataset.formkey
    if (formKey === 'weight') {
      this.data.form.fee = 2 + parseInt(e.detail.value);
    }
    let query = this.data.form;
    query[formKey] = e.detail.value
    this.setData({
      form: query
    })
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
    const addressList = globleData.getAdressList()
    let form = this.data.form
    form.address = addressList[0] || null
    this.setData({
      form: form
    })
  },
  payForm () {
    let that = this;
    if (this.validateForm()) {
      return
    } else {
      const formObj = this.getQueryForm();
      this.setData({
        payStatus: true
      })
      let handleFunction = formObj.fee <= 0 ? 'workAdd' : 'workPay';
 
      until[handleFunction]({
        body: '校帮手订单',
        fee: formObj.fee,
        form: formObj,
        schoolId: formObj.schoolId,
        channelId: globleData.channelId,
        type: 'work',
        workType: that.data.taskType
      }).then((res) => {
        wx.requestSubscribeMessage({
          tmplIds: ['QSris88nvy4XR0ldWbXuwOFQM4yfCIdsZsxYLS1_Nos', '6xO6Gbqw-REh6vGjA8eZIueDOEgfFQx9glA3RKdr7pc'],
          success (res) {}
        })
        wx.navigateTo({
          url: '/pages/work/paySuccess/index?type=success&config=' + JSON.stringify(that.data.labelConfig)
        })
        this.setData({
          payStatus: false
        })
      }).catch((res) => {
        this.setData({
          payStatus: false
        })
        wx.navigateTo({
          url: '/pages/work/paySuccess/index?config=' + JSON.stringify(that.data.labelConfig)
        })
      })
    }
  },
  workTimeChange (e) {
    let valueArr = e.detail.value
    if (valueArr[0] === 0) {
      this.data.form.taskTime = 'now'
    } else {
      const yyyy = this.getDate().year
      const mth = this.getDate().month
      const dd = this.getDate().day + (valueArr[0] - 1)
      const hh = this.data.multiArray[1][valueArr[1]]
      const mm = this.data.multiArray[2][valueArr[2]]
      this.data.form.taskTime = new Date(yyyy,mth,dd,hh,mm, '00').getTime()
    }
  },
  valueChange (e) {
    let formKey = e.target.dataset.formkey
    let currentValue = e.detail.value
    this.data.form[formKey] = currentValue
    this.setData({form: this.data.form})
  },
  getDate() {
    const date = new Date()
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
  },
  valudateForm () {
    const that = this;
    if (this.data.payStatus) {
      return true;
    }
    let currentSchool = globleData.currentSchool
    if (!currentSchool.id) {
      wx.showToast({
        title:'校园系统异常，请联系管理员',
        icon: 'error',
        duration: 2000
      })
    }
    let flag = false
    const desObj = this.data.desObj;
    const form = this.data.form
    if (!this.data.labelName) {
      flag = true;
      this.setData({
        showLabelTip: true
      })
      return flag
    }
    Object.keys(desObj).forEach((key) => {
      if (!form[key]) {
        flag = true
        wx.showToast({
          title: desObj[key] + '必填！',
          icon: 'error',
          duration: 2000
        })
      }
      if (key === 'fee') {
        if (form[key] <= 0) {
          flag = true;
          wx.showToast({
            title: '费用为0元',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
    return flag
  },
  validateForm () {
    const that = this;
    if (this.data.payStatus) {
      return true;
    }
    let currentSchool = globleData.currentSchool
    if (!currentSchool.id) {
      wx.showToast({
        title:'校园系统异常，请联系管理员',
        icon: 'error',
        duration: 2000
      })
    }
    let flag = false;
    if (!this.data.labelName) {
      flag = true;
      this.setData({
        showLabelTip: true
      })
      return flag
    }
    let currentSpec = that.data.currentSpec;
    for (let i = 0; i < currentSpec.length; i++) {
      if (currentSpec[i].label) {
        if (currentSpec[i].type === 'address') {
          if (!this.data.form.address) {
            let label = currentSpec[i].label || '地址';
            wx.showToast({
              title: label + '必填！',
              icon: 'error',
              duration: 2000
            })
            flag = true;
            break;
          } else {
            let address = that.data.form.address;
            currentSpec[i].value = address['schoolName'] + '-' + address['address'] + '\n\n' + address['name'] + '\n' + address['phone'];
          }
        } else if (currentSpec[i].type === 'select' ||  currentSpec[i].type === 'number') {} else if (currentSpec[i].type === 'timeselect'){
          currentSpec[i].value = that.data.form.taskTime === 'now' ? '立即开始' : that.data.form.taskTime;
        } else if (currentSpec[i].type){
          if (!currentSpec[i].value && !currentSpec[i].notRequired) {
            wx.showToast({
              title: currentSpec[i].label + '必填！',
              icon: 'none',
              duration: 2000
            })
            flag = true;
            break;
          }
        }
      }
    }
    console.log(this.data.currentSpec)
    return flag
  },
  imageClick (e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url]
    })
  },
  initFormOptions (taskType) {
    let labelConfig = globleData.currentSchool.labelConfig || {}
    this.data.taskType = taskType;
    if (taskType === '0') {
      this.data.form = {
        taskTime: 'now',
        taskContent: '',
        apFee: 0, // 垫付费用
        fee: 0,
        taskFee: '',
        address: '',
        weight: 0
      }
    } else if (taskType === '1') {
      this.data.form = {
        taskTime: 'now',
        taskContent: '',
        fee: 0,
        taskFee: '',
        address: ''
      }
    }
    this.setData({
      labelList: labelConfig[taskType] || []
    })
  },
  getQueryForm () {
    const taskType = this.data.taskType;
    const spec = this.data.currentSpec;
    let specArr = [this.data.labelName]
    for(let i = 0; i<spec.length; i++) {
      if (spec[i].type === 'number') {
        specArr.push(spec[i].label + ':' + spec[i].number);
      } else if (spec[i].type === 'select'){
        specArr.push(spec[i].label + ':' + spec[i].config[spec[i].index].name)
      } else {
        if (spec[i].label && spec[i].value) {
          specArr.push(spec[i].label + ':' + spec[i].value);
        }
      }
    }
    const schoolId = globleData.currentSchool.id;
    this.data.form.schoolId = schoolId;
    this.data.form.specArr = specArr;
    return this.data.form
  },
  labelSelect (e) {
    let currentSpec = e.detail.spec;
    let labelFee = e.detail.labelFee || 0;
    let payOffConfig = e.detail.payOffConfig
    let labelName = e.detail.labelName;
    let labelConfig = e.detail.labelConfig;
    // let formConfigList = this.getFormConfigList(labelConfig);
    // console.log(formConfigList)
    this.setData({
      currentSpec: currentSpec,
      labelFee: labelFee,
      payOffConfig: payOffConfig,
      labelName: labelName,
      showLabelTip: false,
      labelConfig: labelConfig
      // formConfigList: formConfigList
    })
    this.computedFee();
  },
  specSelectChange (e) {
    let specIndex = e.currentTarget.dataset.specindex;
    let rangeIndex = Number(e.detail.value)
    let currentSpec = this.data.currentSpec;
    currentSpec[specIndex].index = rangeIndex;
    this.setData({
      currentSpec: currentSpec
    })
    this.computedFee();
  },
  numberChange (e) {
    let currentNum = e.detail.value;
    let computed = e.detail.computed;
    let specIndex = e.currentTarget.dataset.specindex;
    let currentSpec = this.data.currentSpec;
    currentSpec[specIndex].number = currentNum;
    currentSpec[specIndex].computed = computed;
    this.setData({
      currentSpec: currentSpec
    })
    this.computedFee();
  },
  inputChange (e) {
    let specIndex = e.currentTarget.dataset.specindex;
    let value = e.detail.value;
    let currentSpec = this.data.currentSpec;
    currentSpec[specIndex].value = value;
    this.setData({
      currentSpec: currentSpec
    })
  },
  getLabelSpecFee () {
    let labelFee = this.data.labelFee
    let specFee = 0
    let NumberArr = [];
    for (let i = 0; i < this.data.currentSpec.length; i++) {
      if (this.data.currentSpec[i] && this.data.currentSpec[i]['config'] && this.data.currentSpec[i]['config'][this.data.currentSpec[i].index] && this.data.currentSpec[i]['config'][this.data.currentSpec[i].index].hasOwnProperty('price')){
        specFee = until.accAdd(specFee, this.data.currentSpec[i]['config'][this.data.currentSpec[i].index].price);
      }
      if (this.data.currentSpec[i] && this.data.currentSpec[i].type === 'number') {
        console.log(this.data.currentSpec[i])
        NumberArr.push(this.data.currentSpec[i])
      }
    }
    let addFee = until.accAdd(labelFee, specFee);

    // 相乘
    if (NumberArr.length > 0) {
      let MulFee = 0;
      for (let k = 0; k < NumberArr.length; k++) {
        MulFee = until.accMul(addFee, NumberArr[k].number)
        if (NumberArr[k].computed) {
          let computed = NumberArr[k].computed;
          const fenFee = parseFloat(MulFee) * 1000;
          MulFee = (fenFee * computed.per/100 + computed.money * 1000) / 1000;
        }
      }
      return MulFee;
    } else {
      return addFee;
    }
  },
  computedFee () {
    let payOffConfig = this.data.payOffConfig;
    let labelFee = this.getLabelSpecFee();
    let query = this.data.form;
    query.fee = labelFee;
    const fenFee = parseFloat(labelFee) * 1000;
    const taskFee = (fenFee * payOffConfig.per/100 + payOffConfig.money * 1000) / 1000;
    query.taskFee = taskFee;
    this.setData({
      form: query
    })
  },
  getFormConfigList (config) {
    // 此处处理自定义组件
    let returnArr = []
    let valiObj = {
      fee: '',
      taskTime: '预约时间'
    }
    Object.keys(config).forEach((item) => {
      if (item === 'content') {
        if (config[item]) {
          let obj = {
            type: 'textarea',
            title: '请输入任务内容',
            key: 'taskContent',
            placeholder: '请输入任务任务详情'
          }
          if (config['placeholder']) {
            obj['placeholder'] = config['placeholder'];
          }
          valiObj.taskContent = '任务内容'
          returnArr.push(obj)
        }
      }
      if (item === 'address') {
        if (config[item]) {
          let obj = {
            type: 'address',
            title: '任务地址',
            key: 'address'
          }
          valiObj.address = '任务地址'
          returnArr.push(obj);
        }
      }
    })
    returnArr.push({
      type: 'timeselect'
    })
    this.data.desObj = valiObj;
    return returnArr;
  },
  payMoneyClick () {
    if (this.data.labelConfig.tipImage) {
      let url = this.data.labelConfig.tipImage;
      wx.previewImage({
        urls: [url]
      })
    }
  }
})
