// pages/order/confirm.js
var util = require('../../helpers/util.js');
var app = getApp();
var consigneeTemp = {
  name: "",
  phone: "",
  province_id: "",
  city_id: "",
  address: ""
};

Page({
  data: {
    region: {},
    payments: [],
    consignee: {},
    payment: 1,
    arrProvince: [],
    provinceIdx: 0,
    arrCity: [],
    cityIdx: 0,
    arrDeliveryTime: [
      { id: 1, text: '10:30 - 11:30' },
      { id: 2, text: '13:30 - 16:30' }
    ],
    deliveryTimeIdx: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.WxValidate = app.WxValidate({
      name: { required: true },
      phone: { required: true, tel: true },
      address: { required: true }
    }, {
        name: { required: '请输入姓名' },
        phone: { required: '请输入手机号', tel: '请输入正确的手机号' },
        address: { required: '请输入详细地址' }
      });
  },
  onShow: function () {
    // 页面显示
    var that = this;
    if (!wx.getStorageSync('token')) {
      wx.setStorageSync('prevUrl', '/pages/order/confirm');
      wx.redirectTo({
        url: '/pages/public/login'
      });
      return false;
    }

    // 获取支付方式
    app.HttpService.getPayments(function (res) {
      app.Config.logger && console.log('支付方式', res);
      var payments = res.data.data.payment;
      for (let i = 0; i < payments.length; ++i) {
        if (payments[i].name.indexOf('支付宝') != -1) {
          payments.splice(i, 1);
        }
      }
      that.setData({
        payments: payments,
        payment: payments[0].id
      });
    });

    // 获取配送时间
    app.HttpService.getConfig(function (res) {
      app.Config.logger && console.log('配送时间', res);
      var deliveryTime = res.data.data.config.delivery_time;
      that.setData({
        arrDeliveryTime: deliveryTime
      });
    });

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    // 获取省市二级信息
    app.HttpService.getRegion(function (res) {
      var province = res.data.data.location[0].sub;
      app.Config.logger && console.log('省份信息', province);
      app.Config.logger && console.log('城市信息', province[0].sub);

      that.setData({
        arrProvince: province,
        arrCity: province[0].sub
      });

      // 获取联系人信息
      app.HttpService.getConsignees(function (res) {
        wx.hideToast();
        app.Config.logger && console.log('收货人信息', res);
        if (res.data.data.contact.length > 0) {
          consigneeTemp = res.data.data.contact[0];
          var provinceIdx = util.findProvince(province, consigneeTemp.province_id);
          app.Config.logger && console.log('当前省份', province[provinceIdx].name);
          var cityIdx = util.findCity(province[provinceIdx].sub, consigneeTemp.city_id);
          app.Config.logger && console.log('当前城市', province[provinceIdx].sub[cityIdx].name);
          that.setData({
            consignee: consigneeTemp,
            provinceIdx: provinceIdx,
            arrCity: province[provinceIdx].sub,
            cityIdx: cityIdx
          });
        }
      });
    });
  },
  switchPayment: function (e) {
    this.setData({
      payment: e.currentTarget.dataset.payment
    });
    app.Config.logger && console.log('payment', this.data.payment);
  },
  bindProvinceChange: function (e) {
    app.Config.logger && console.log('province changed', this.data.arrProvince[e.detail.value].name);
    this.setData({
      provinceIdx: e.detail.value,
      arrCity: this.data.arrProvince[e.detail.value].sub,
      cityIdx: 0
    });
  },
  bindCityChange: function (e) {
    app.Config.logger && console.log('city changed', this.data.arrCity[e.detail.value].name);
    this.setData({
      cityIdx: e.detail.value
    });
  },
  bindDeliveryTimeChange: function (e) {
    app.Config.logger && console.log('deliveryTime changed', e);
    this.setData({
      deliveryTimeIdx: e.detail.value
    });
  },
  orderSubmit: function (e) {

    const params = e.detail.value;
    const payment = this.data.payment;
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      wx.showModal({
        title: '提示',
        content: error.msg,
        showCancel: !1
      });
    } else {
      consigneeTemp.name = params.name;
      consigneeTemp.phone = params.phone;
      const province = this.data.arrProvince;
      consigneeTemp.province_id = province[params.province].id;
      consigneeTemp.city_id = province[params.province].sub[params.city].id;
      consigneeTemp.address = params.address;
      let consigneeParams = {};
      let orderParams = {
        cartData: [],
        payment_id: payment,
        delivery_time: this.data.arrDeliveryTime[params.deliveryTime],
        remark: params.remark
      };

      const cart = app.globalData.cart;
      for (let i = 0; i < cart.length; ++i) {
        orderParams.cartData.push({
          id: cart[i].product_id,
          num: cart[i].num
        });
      }

      // 无收货人ID，新增收货人数据
      let saveConsigneeFlag = !1;
      if (!consigneeTemp.id) {
        app.Config.logger && console.log('add new consignee', consigneeTemp);
        saveConsigneeFlag = !0;
      } else {
        // 有收货人ID，检查收货人信息有无变更
        if (!util.cmp(consigneeTemp, this.data.consignee)) {
          app.Config.logger && console.log('save consignee change', consigneeTemp);
          saveConsigneeFlag = !0;
        } else {
          orderParams.contact_id = consigneeTemp.id;
        }
      }

      if (saveConsigneeFlag) {
        consigneeParams = {
          name: consigneeTemp.name,
          phone: consigneeTemp.phone,
          province_id: consigneeTemp.province_id,
          city_id: consigneeTemp.city_id,
          address: consigneeTemp.address
        };
        if (consigneeTemp.id) consigneeParams.id = consigneeTemp.id;
        app.HttpService.saveConsignee(consigneeParams, function (res) {
          // success
          app.Config.logger && console.log('保存收货人反馈信息', res);
          orderParams.contact_id = res.data.data.contact.id;

          app.Config.logger && console.log('提交订单信息', orderParams);
          app.HttpService.saveOrder(orderParams, function (res) {
            // success
            app.Config.logger && console.log('提交订单反馈信息', res);
            const response = res;

            if (response.data.code == 1) {
              app.globalData.cart = [];
              wx.redirectTo({
                url: '/pages/order/success?order_id=' + response.data.data.order.id
              });
            } else {
              wx.showModal({
                title: '提示',
                content: response.data.msg,
                showCancel: !1
              });
            }
          });
        });
      } else {

        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 10000,
          mask: true
        })
        app.Config.logger && console.log('提交订单信息', orderParams);
        app.HttpService.saveOrder(orderParams, function (res) {
          wx.hideToast();
          // success
          app.Config.logger && console.log('提交订单反馈信息', res);
          const response = res;
          if (response.data.code == 1) {
            app.globalData.cart = [];
            wx.redirectTo({
              url: '/pages/order/success?order_id=' + response.data.data.order.id
            });
          } else {
            wx.showModal({
              title: '提示',
              content: response.data.msg,
              showCancel: !1
            });
          }
        });
      }
    }
  }
});