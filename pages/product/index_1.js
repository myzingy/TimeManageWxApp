// pages/product/index.js
var app = getApp();
var catagory = [], product = [];
var currCatagory = 0;
var scrollLeft = 0;

Page({
  data: {
    imgPath: app.Config.imgPath,
    scrollLeft: 0,
    scrollTop: 0,
    currCatagory: 0,
    catagory: [],
    product: []
  },
  switchCatagory: function (e) {
    currCatagory = e.currentTarget.dataset.catagory;
    this.setData({ currCatagory: currCatagory, product: product });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    currCatagory = 0;
    scrollLeft = 0;
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // 读取产品分类
    let that = this;
    app.HttpService.getConfig(function (res) {
      app.Config.logger && console.log('config', res);
      that.setData({ welcome: res.data.data.config.welcome });
    });

    const cart = app.globalData.cart;
    app.HttpService.getProductCatagoryList({}, function (res) {

      app.Config.logger && console.log('catagorys', res);
      catagory = res.data.data.category;

      // 设置最大产品分类编号
      if (catagory.length > 0) {
        if (currCatagory == 0) {
          currCatagory = catagory[0].id;
          that.setData({
            currCatagory: currCatagory,
            scrollLeft: 0
          });
        }
      }

      // 读取产品列表
      if (currCatagory > 0) {
        app.HttpService.getProductList({}, function (res) {

          app.Config.logger && console.log('products', res);
          product = res.data.data.product;
          for (let i = 0; i < product.length; ++i) {
            for (let j = 0; j < cart.length; ++j) {
              if (product[i].id == cart[j].product_id) {
                product[i].show = 1;
                break;
              }
            }
          }

          that.setData({
            catagory: catagory,
            product: product
          });
        });
      }
    });
  },
  tapToRight: function (e) {
    scrollLeft += 15;
    this.setData({
      scrollLeft: scrollLeft
    });
  },
  scroll: function (e) {
    scrollLeft = e.detail.scrollLeft;
    this.setData({
      scrollLeft: scrollLeft
    });
  },
  addToCart: function (e) {
    app.Config.logger && console.log('添加购物车事件', e);
    let productTemp = this.data.product;
    const data = e.currentTarget.dataset;

    let cart = app.globalData.cart;
    let has = !1;
    for (let i = 0; i < cart.length; ++i) {
      if (data.pid == cart[i].product_id) {
        has = !0;
        cart[i].num += 1;
        break;
      }
    }

    if (!has) {
      cart.unshift({
        id: cart.length + 1,
        product_id: data.pid,
        num: 1,
        product: productTemp[data.idx]
      });
    }

    app.globalData.cart = cart;
    app.Config.logger && console.log('购物车', app.globalData.cart);
    productTemp[data.idx].show = 1;
    this.setData({ product: productTemp });
  },
  tapToTop: function () {
    this.setData({ scrollTop: 0 });
  }
});