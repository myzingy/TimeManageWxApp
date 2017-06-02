//app.js
import Config from 'etc/config';
import WxValidate from 'helpers/WxValidate';
import HttpService from 'helpers/HttpService';
import WxParse from 'helpers/wxParse/wxParse.js';

App({
  currTab: 1,
  onLaunch: function () {
   
  },
  globalData: {
    userInfo: null,
    refuseArr:null//退回理由数据
  },
  Config: Config,
  WxParse: WxParse,
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpService: HttpService,
  debug:true
});