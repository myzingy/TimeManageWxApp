// pages/cart/index.js
var app = getApp();

Page({
  data: {
    cart: [],
    totalPrice: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数    
  },
  onShow: function () {
    // 页面显示
    // 读取购物车信息
    // 页面显示
    const cart = app.globalData.cart;
    const totalPrice = this.clearing();
    this.setData({ cart: cart, totalPrice: totalPrice });
  },
  clearing: function () {
    const cart = app.globalData.cart;
    let totalPrice = 0;
    for (let i = 0; i < cart.length; ++i) {
      totalPrice += cart[i].num * cart[i].product.price;
    }
    return totalPrice;
  },
  // 减少购物车中商品数量
  reduceCartItemAmount: function (e) {
    const itemIdx = e.currentTarget.dataset.itemidx;
    let cart = this.data.cart;
    let cartItem = cart[itemIdx];
    if (cartItem.num > 1) {
      cartItem.num--;
      cart[itemIdx] = cartItem;
      app.globalData.cart = cart;
      const totalPrice = this.clearing();
      this.setData({ cart: cart, totalPrice: totalPrice });
    }
  },
  // 增加购物车中商品数量
  increaseCartItemAmount: function (e) {
    const itemIdx = e.currentTarget.dataset.itemidx;
    let cart = this.data.cart;
    let cartItem = cart[itemIdx];
    cartItem.num++;
    cart[itemIdx] = cartItem;
    app.globalData.cart = cart;
    const totalPrice = this.clearing();
    this.setData({ cart: cart, totalPrice: totalPrice });
  },
  // 移除购物车中的商品
  removeCartItem: function (e) {
    const itemIdx = e.currentTarget.dataset.itemidx;
    let cart = this.data.cart;
    cart.splice(itemIdx, 1);
    app.globalData.cart = cart;
    const totalPrice = this.clearing();
    this.setData({ cart: cart, totalPrice: totalPrice });
  },
  // 跳转至确认提交订单页面
  goConfirmOrder: function () {
    if (this.data.cart.length > 0) {
      wx.navigateTo({
        url: '/pages/order/confirm'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '购物车里空空的..'
      });
    }
  }
})