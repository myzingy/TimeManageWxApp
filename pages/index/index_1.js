//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    imgPath: app.Config.imgPath,
    userInfo: {},
    ads: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onShow: function () {
    // 页面显示
    var that = this;
    app.HttpService.getAdsList({}, function (res) {
      app.Config.logger && console.log('广告列表', res);
      var ads = res.data.data.ads;
      for (let i = 0; i < ads.length; ++i) {
        // if (/^\/product\//.test(ads[i].url)) {
        if (/^[1-9]/.test(ads[i].url)) {
          // const product_id = ads[i].url.split('/')[1];
          const product_id = ads[i].url;
          ads[i].url = '/pages/product/detail?id=' + product_id;
        } else {
          delete ads[i].url;
        }
      }
      that.setData({ ads: ads });
    });
  },
  showAds: function (e) {
    app.Config.logger && console.log(e);
    wx.navigateTo({
      url: '/pages/ads/detail?id=' + e.currentTarget.dataset.adsId
    });
  }
});
