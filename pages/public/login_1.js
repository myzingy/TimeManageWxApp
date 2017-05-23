// pages/public/login.js
var app = getApp();
Page({
  data: {
    passtype: 'password',
    passTypeStyle: 'can-see'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.WxValidate = app.WxValidate({
      phone: { required: true },
      password: { required: true }
    }, {
        phone: { required: '请输入手机号' },
        password: { required: '请输入密码' }
      });
  },
  onShow: function () {
    // 页面显示
  },
  switchPassType: function (e) {
    if (this.data.passtype == 'password') {
      this.setData({
        passtype: 'text',
        passTypeStyle: 'cant-see'
      });
    } else {
      this.setData({
        passtype: 'password',
        passTypeStyle: 'can-see'
      });
    }
  },
  submitLogin: function (e) {
    let params = e.detail.value;
    app.Config.logger && console.log('用户登录提交信息', e);

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      wx.showModal({
        title: '提示',
        content: error.msg,
        showCancel: !1
      });
    } else {
      app.HttpService.login(params, this.loginResponse);
    }
  },
  loginResponse: function (res) {
    // success
    app.Config.logger && console.log('用户登录反馈信息', res);
    const response = res.data.data;
    if (response.token) {
      wx.setStorageSync('token', response.token);
      var jumpTo = wx.getStorageSync('prevUrl');
      wx.redirectTo({
        url: jumpTo,
        fail: function () {
          wx.switchTab({
            url: jumpTo
          });
        }
      });
    } else {
      app.Config.logger && console.log('用户登录失败', res);
      wx.showModal({
        title: '登录失败',
        content: '请检查您填写的用户信息！',
        showCancel: !1
      });
    }
  },
  wxAuth: function () {
    var that = this;
    wx.login({
      success: function (loginData) {
        app.Config.logger && console.log('wxlogin', loginData);
        wx.getUserInfo({
          success: function (userData) {
            // success
            app.Config.logger && console.log('微信授权自动登录', userData);
            app.HttpService.wxOauth({
              code: loginData.code,
              userInfo: userData.userInfo
            }, that.loginResponse);
          }
        });
      }
    });
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})