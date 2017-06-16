import common from "../../../common/common"

var app = getApp();
var self;
Page({
  data: {
    files: [],
    willRefuse: false,//是否可以有退回操作
    willCancel:false,//是否可以有撤销操作
    refuseArr:[],
    refuseIndex:0,
    isRefuseOther:false//选择退回理由其他时 需要显示退回原因
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;
    if(app.debug) console.log("--------->1" + options.data);

    if (options.data) {
      let item = JSON.parse(options.data);
      if (app.debug) console.log("--------->2" + item);
      let urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
      urls = urls.filter(function(x){
        return x != null;
      });
      self.setData({
        data: item,
        files: urls
      })
      
      if(app.debug) console.log("urls" + urls);


      var ruleM = common.getRule(item.C3_533398158705);
      self.setData({
        noticeStr: ruleM.C3_545771115865
      })

    }

    if (options.willRefuse) {
      var tmpWillRefuse = JSON.parse(options.willRefuse);
      self.setData({
        willRefuse: tmpWillRefuse
      })

      self.setData({
        refuseArr:app.globalData.refuseArr
      })
    }

    // willCancel
    if (options.willCancel) {
      var tmpWillCancel = JSON.parse(options.willCancel);
      self.setData({
        willCancel: tmpWillCancel
      })
    }

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    self.getData();
  },
  getData: function () {

    wx.showLoading({
      title: '加载中'
    })
    var param = {
      'resid': 541502768110,
      'subresid': 541521075674,
      'cmswhere': '',
      'hostrecid': self.data.data.REC_ID,
      'cmsorder': ''
    }
    app.HttpService.getSubData(param, function (data) {
      if (data && data.data && data.data.data) {
        var pendedProcessData = data.data.data;
        
        pendedProcessData = common.promiseImageWithStyle(pendedProcessData, ['C3_543790707188','C3_541450438440'])
        if (app.debug) {
          var a = [];
          for (var i = 0; i < 3; i++) {
            a.push(pendedProcessData[0]);
          }
          pendedProcessData = a;
        } 
        self.setData({
          pendedProcessData: pendedProcessData
        })
        
      } else self.setData({ pendedProcessData: [] });
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  previewImage: function (e) {
    wx.previewImage({ // 当前显示图片的http链接
      urls: self.data.files // 需要预览的图片http链接列表
    })
  },
  cancel: function () {
    // dataCancel
    common.cancel(self.data.data,function(){
      app.notification.emit("dataCancel", null);
    });
  },
  refuseChange:function(e){//退回理由选择
    self.setData({
      refuseIndex:e.detail.value
    })

    self.data.data.C3_541451198969 = self.data.refuseArr[self.data.refuseIndex];
    if (self.data.refuseArr[self.data.refuseIndex] == '其他'){
      self.setData({
        isRefuseOther:true
      })
    }else{
      self.setData({
        isRefuseOther: false
      })
    }
  },
  refuseClick:function(e){//退回
    // C3_541449606438

    self.data.data.C3_541449606438 = 'Y';
    let item = self.data.data;
    common.reSaveAndSubmit(item,function(){
      common.successBackModal("退回成功");
      app.notification.emit("dataReoperation", item);
    },function(){
      self.data.data.C3_541449606438 = '';
    });
  },
  textInput:function(e){//退回理由
    self.data.data.C3_547719838514 = e.detail.value;
  }
})