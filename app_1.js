//app.js
import Config from 'etc/config';
import WxValidate from 'helpers/WxValidate';
import HttpService from 'helpers/HttpService';
import WxParse from 'helpers/wxParse/wxParse.js';

App({
  currTab: 1,
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    wx.removeStorageSync('token');
    wx.removeStorageSync('prevUrl');
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    captcha_uuid: '',
    userInfo: null,
    cart: []
  },
  Config: Config,
  WxParse: WxParse,
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpService: HttpService
});