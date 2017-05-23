// pages/user/index.js
var app = getApp();

Page({
  data: {
    imgPath: app.Config.imgPath,
    user: {},
    order: [],
    historyPage: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    wx.setStorageSync('prevUrl', '/pages/user/index');
    if (!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/public/login'
      });
    } else {
      app.HttpService.getUserInfo(function (res) {
        app.Config.logger && console.log('用户信息', res.data.data.user);
        that.setData({ user: res.data.data.user });
      });
      app.HttpService.getOrderList({ page: that.data.historyPage }, function (res) {
        app.Config.logger && console.log('历史订单', res);
        that.setData({ order: res.data.data.order.data });
      });
    }
  },
  pay: function (e) {
    var that = this;
    const data = e.currentTarget.dataset;
    if (data.payment.indexOf('微信') != -1) {
      wx.login({
        success: function (loginData) {
          // success
          app.HttpService.wxpay(data.orderId, {code: loginData.code}, function (res) {
            app.Config.logger && console.log('微信支付', res);
            const jsApiParameters = res.data.data.jsApiParameters;
            wx.requestPayment({
              timeStamp: jsApiParameters.timeStamp,
              nonceStr: jsApiParameters.nonceStr,
              'package': jsApiParameters.package,
              signType: jsApiParameters.signType,
              paySign: jsApiParameters.paySign,
              success: function (res) {
                // success
                app.HttpService.saveOrder({ id: data.orderId, pay_status: 1 }, function (res) {
                  that.refreshOrder();
                });
              }
            });
          });
        }
      });
    } else if (data.payment.indexOf('余额') != -1) {
      app.HttpService.balance(data.orderId, function (res) {
        app.Config.logger && console.log('余额支付', res);
        if (res.data.code == 1) {
          order.pay_status = '已支付';
          that.refreshOrder();
        } else if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: !1
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '该订单付款方式为货到付款',
        showCancel: !1
      });
    }
  },
  cancel: function (e) {
    var that = this;
    const data = e.currentTarget.dataset;
    app.Config.logger && console.log('取消订单', e.currentTarget.dataset);
    app.HttpService.cancelOrder(data.orderId, function (res) {
      wx.showToast({
        title: '取消成功',
        success: function () {
          that.refreshOrder();
        }
      });
    });
  },
  refund: function (e) {
    var that = this;
    const data = e.currentTarget.dataset;
    app.Config.logger && console.log('申请退款', e.currentTarget.dataset);
    app.HttpService.refundOrder(data.orderId, function (res) {
      wx.showModal({
        title: '提示',
        content: '申请已提交，我们的客服将会尽快与您联系，请保持手机畅通。',
        success: function () {
          that.refreshOrder();
        }
      });
    });
  },
  refreshOrder: function () {
    var that = this;
    app.HttpService.getOrderList({}, function (res) {
      that.setData({ order: res.data.data.order });
      app.Config.logger && console.log('refresh order history', that.data.order);
    });
  },
  hurryUp: function (e) {
    wx.showModal({
      title: '提示',
      content: '赶快发货啊',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '10086'
          });
        }
      }
    });
  },
  loadMoreRecord: function (e) {
    var that = this;
    let order = that.data.order;
    app.HttpService.getOrderList({ page: that.data.historyPage + 1 }, function (res) {
      app.Config.logger && console.log('加载更多历史订单', res);
      if (res.data.data.order.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有啦!'
        });
      } else {
        that.setData({
          historyPage: that.data.historyPage + 1,
          order: order.concat(res.data.data.order)
        });
      }
    });
  },
  logout: function () {
    app.globalData.userInfo = null;
    app.globalData.cart = [];
    wx.removeStorageSync('token');
    wx.showModal({
      title: '提示',
      content: '已退出登录',
      showCancel: !1,
      success: function () {
        wx.redirectTo({
          url: '/pages/public/login'
        });
      }
    });
  }
});