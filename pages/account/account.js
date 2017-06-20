import common from '../../common/common'

var app = getApp();
var self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textPhone:'',
    textCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { self = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  textInput:function(e){
    var tag = e.currentTarget.dataset.tag;
    if(tag == "phone"){
      self.data.textPhone = e.detail.value;
    } else if (tag == "code") {
      self.data.textCode = e.detail.value;
    }
  },
  getvalidcode: function () {
    if (!self.data.textPhone){
      common.customModal("请输入手机号码");
      return;
    }
    var param = {
      telephone: self.data.textPhone
    }
    common.customLoading();
    app.HttpService.sendValidMsg(param,
      function (data) {
        // alert(JSON.stringify(data));
        common.customModal("验证码已发送");
        wx.hideLoading();
      },
      function(e){
        common.customModal("发送失败");
        wx.hideLoading();
      });

  },
  validatecode:function () {
    if (!self.data.textPhone) {
      common.customModal("请输入手机号码");
      return;
    }

    if (!self.data.textCode) {
      common.customModal("请输入验证码");
      return;
    }

    var param = {
      telephone: self.data.textPhone,
      validCode : self.data.textCode
    }
    common.customLoading();
    app.HttpService.authClient(param,
      function (data) {
        if (data.data.error == 0) {
          wx.redirectTo({
            url: '/pages/login/login',
          })
          localStorage.clear();
        }else{
          common.customModal("验证失败")
        }
        wx.hideLoading();
      },
      function(e){
        common.customModal("验证失败")
        wx.hideLoading();
      });

  }
})