// component/mc-nav/mc-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      value: [],
      type: Array
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabstest: [{title: '凤凰餐厅'}, {title: '逸夫图书馆'}, {title: '一号楼'}, {title: '一号楼'}, {title: '一号楼'}, {title: '一号楼'}]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick: function(e) {
     let that = this
      this.setData({
        activeIndex: e.detail.index
      });
      this.triggerEvent('change', {activeIndex: e.detail.index, row: that.data.tabs[e.detail.index]})
    }
  }
})
