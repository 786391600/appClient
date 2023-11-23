{
  "cloud": true,
  "pages": [
    "pages/index/index",
    "pages/work/ApplyList/index",
    "pages/memedeorder/index",
    "pages/work/index/index",
    "pages/work/workForm/index",
    "pages/work/schoolList/index",
    "pages/work/addressList/index",
    "pages/work/addressAdd/index",
    "pages/work/orderRemarks/index",
    "pages/work/jobDetail/index",
    "pages/work/myorder/index",
    "pages/work/money/index",
    "pages/work/shop/index",
    "pages/work/sureOrder/index",
    "pages/work/paySuccess/index",
    "pages/booking/index/index",
    "pages/booking/selectCity/index",
    "pages/booking/OrderPayment/index",
    "pages/booking/OrderDetail/index",
    "pages/booking/rider/index",
    "pages/booking/TicketDetails/index",
    "pages/booking/calendar/index",
    "pages/booking/VehicleList/index",
    "pages/booking/paySuccess/index",
    "pages/common/getShareImg/index",
    "pages/common/getWebView/index",
    "pages/work/business/settlement/index",
    "pages/work/business/withdrawal/index",
    "pages/work/business/toexamine/index",
    "pages/work/business/settlementlist/index",
    "pages/work/QRcode/index",
    "pages/work/dvide/settlement/index",
    "pages/work/dvide/settlementlist/index",
    "pages/job/index/index",
    "pages/job/jobDetail/index"
  ],
  "window": {
    "backgroundColor": "#F6F6F6",
    "backgroundTextStyle": "light",
    "navigationBarTitleText": "么么车票",
    "?navigationStyle": "custom",
    "navigationBarBackgroundColor": "#03a9f4",
    "navigationBarTextStyle": "white"
  },
  "sitemapLocation": "sitemap.json",
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  },
  "plugins": {
    "materialPlugin": {
        "version": "1.0.5",
        "provider": "wx4d2deeab3aed6e5a"
    }
  },
  "subpackages": [
    {
      "root": "pages/booking",
      "name": "booking",
      "pages": [
        "index/index",
        "selectCity/index",
        "OrderPayment/index",
        "OrderDetail/index",
        "rider/index",
        "TicketDetails/index",
        "calendar/index",
        "VehicleList/index",
        "paySuccess/index"
      ]
    },
    {
      "root": "pages/print",
      "name": "print",
      "pages": [
        "index/index",
        "fileUpload/fileUpload"
      ]
    }
  ],
}