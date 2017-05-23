// pages/public/repass.js
var app = getApp();

Page({
  data: {
    passtype: 'password',
    passTypeStyle: 'can-see',
    pass2type: 'password',
    pass2TypeStyle: 'can-see',
    repassFormDisplay: 'none',
    inputContainerDisplay: 'show',
    sendSmsTo: '',
    sendText: '发送验证码',
    sendTimer: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.WxValidate = app.WxValidate({
      captcha: { required: true },
      password: { required: true },
      password2: { required: true, equalTo: 'password' }
    }, {
        captcha: { required: '请输入验证码' },
        password: { required: '请输入密码' },
        password2: { required: '请输入确认密码', equalTo: '两次密码输入不一致' }
      });
  },
  onShow: function () {
    // 页面显示
  },
  setPhone: function (e) {
    app.Config.logger && console.log('setting phone number', e);
    this.setData({ sendSmsTo: e.detail.value });
  },
  switchDisplay: function () {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.sendSmsTo)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: !1
      });
      return false;
    }
    if (this.data.repassFormDisplay == 'none') {
      this.setData({
        repassFormDisplay: 'show',
        inputContainerDisplay: 'none'
      });
    } else {
      this.setData({
        repassFormDisplay: 'none',
        inputContainerDisplay: 'show'
      });
    }
  },
  sendSmsCode: function (e) {

    if (this.data.sendTimer == 0) {
      var that = this;
      app.HttpService.sendSmsCaptcha({ phone: that.data.sendSmsTo }, function (res) {
        app.globalData.captcha_uuid = res.data.data.uuid;
        app.Config.logger && console.log('获取手机验证码', res);
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        });

        let timer = 60;
        that.data.intervarID = setInterval(function () {
          that.setData({
            sendTimer: timer,
            sendText: timer + ''
          });
          timer--;
          if (that.data.sendTimer == 0) {
            clearInterval(that.data.intervarID);
            that.setData({
              sendTimer: 0,
              sendText: '发送验证码'
            });
          }
        }, 1000);
      });
    }
  },
  switchPassType: function (e) {
    if (this.data.passtype == 'password') {
      this.setData({
        passtype: 'text',
        passTypeStyle: 'cant-see',
      });
    } else {
      this.setData({
        passtype: 'password',
        passTypeStyle: 'can-see',
      });
    }
  },
  switchPass2Type: function (e) {
    if (this.data.pass2type == 'password') {
      this.setData({
        pass2type: 'text',
        pass2TypeStyle: 'cant-see',
      });
    } else {
      this.setData({
        pass2type: 'password',
        pass2TypeStyle: 'can-see',
      });
    }
  },
  submitRepass: function (e) {
    let params = e.detail.value;    

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      wx.showModal({
        title: '提示',
        content: error.msg,
        showCancel: !1
      });
    } else {
      delete params.password2;
      params.captcha_uuid = app.globalData.captcha_uuid;
      app.Config.logger && console.log('用户忘记密码提交信息', params);
      app.HttpService.resetPassword(params, function (res) {
        // success
        app.Config.logger && console.log('用户重置密码反馈信息', res);
        const response = res.data;
        if (response.code == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            success: function () {
              wx.redirectTo({
                url: '/pages/public/login'
              });
            }
          });
        } else {
          wx.showModal({
            title: '操作失败',
            content: res.data.msg,
            showCancel: !1
          });
        }
      });
    }
  }
})