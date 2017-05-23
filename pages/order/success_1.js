// pages/order/success.js
var app = getApp();
Page({
  data: {
    order: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.HttpService.getOrderDetail(options.order_id, function (res) {
      app.Config.logger && console.log('订单详情', res.data.data.order);
      const order = res.data.data.order;
      that.setData({ order: order });

      if (order.payment.indexOf('微信') != -1) {
        wx.login({
          success: function (loginData) {
            // success
            app.HttpService.wxpay(order.id, {code: loginData.code}, function (res) {
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
                    that.setData({
                      order: res.data.data.order
                    });
                  });
                }
              });
            });
          }
        });
      } else if (order.payment.indexOf('余额') != -1) {
        app.HttpService.balance(order.id, function (res) {
          app.Config.logger && console.log('余额支付', res);
          if (res.data.code == 1) {
            order.pay_status = '已支付';
            that.setData({ order: order });
          } else if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: !1
            });
          }
        });
      }
    });
  }
})