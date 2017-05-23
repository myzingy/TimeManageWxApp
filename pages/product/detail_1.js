// pages/product/detail.js
var app = getApp();

Page({
  data: {
    imgPath: app.Config.imgPath,
    product: '',
    scrollTop: 0,
    parseDetail: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.HttpService.getProductDetail(options.id, function (res) {
      app.Config.logger && console.log('product', res);
      app.WxParse.wxParse('parseDetail', 'html', res.data.data.product.detail, that, 10);
      that.setData({ product: res.data.data.product });
    });
  },
  onShow: function () {
    // 页面显示
  },
  addToCart: function (e) {
    app.Config.logger && console.log('添加购物车事件', e);

    let cart = app.globalData.cart;
    let has = !1;
    for (let i = 0; i < cart.length; ++i) {
      if (this.data.product.id == cart[i].product_id) {
        has = !0;
        cart[i].num += 1;
        break;
      }
    }

    if (!has) {
      cart.unshift({
        id: cart.length + 1,
        product_id: this.data.product.id,
        num: 1,
        product: this.data.product
      });
    }

    app.globalData.cart = cart;
    app.Config.logger && console.log('购物车', app.globalData.cart);
    wx.showToast({ title: '操作成功' });
  },
  tapToTop: function () {
    this.setData({ scrollTop: 0 });
  }
})