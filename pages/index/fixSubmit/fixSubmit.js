import common from '../../../common/common'

var app = getApp();
Page({
  data: {
    // data
    files: [],
    noticeStr:''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    var item = JSON.parse(options.data);
    var urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
    // urls = urls.filter(x => x != null);
    self.setData({
      data: item,
      files: urls
    })


    var ruleM = common.getRule(item.C3_533398158705);
    var imageShowArr = common.kvoAttach(ruleM);
    self.setData({
      imageShowArr: imageShowArr,
      reason: self.data.data.C3_533143291117
    })

    var ruleM = common.getRule(item.C3_533398158705);
    self.setData({
      noticeStr: ruleM.C3_545771115865
    })

    self.getData();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    self.getData();
  },
  getData: function () {
    common.customLoading();

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
        pendedProcessData = common.promiseImageWithStyle(pendedProcessData, ['C3_543790707188', 'C3_541450438440'])
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
  chooseImage: function (e) {
    var tag = e.target.dataset.tag;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {


        app.HttpService.uploadImg(res.tempFilePaths[0], function (path) {
          // self.data.files[tag] = res.tempFilePaths[0];
          self.data.files[tag] = path;
          self.setData({
            files: self.data.files
          });
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
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
    var imgUrls = this.data.files.filter(function (val) {
      return val;
    })
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: imgUrls // 需要预览的图片http链接列表
    })
  },
  saveOrSubmitApply: function (e) {//提交
        self.data.data.C3_541450276993 = self.data.files[0];
        self.data.data.C3_545771156108 = self.data.files[1];
        self.data.data.C3_545771157350 = self.data.files[2];
        self.data.data.C3_545771158420 = self.data.files[3];
        

    var title = e.currentTarget.dataset.title;

    if (title == 'submit') {
      self.data.data.C3_541449606438 = 'N';
    }
    var item = self.data.data;
    common.reSaveAndSubmit(item, function () {
      common.successBack();
    }, function () {
      if (title == 'submit') {
        self.data.data.C3_541449606438 = 'Y';
      }

    });


  },
  cancel: function () {
    common.cancel(self.data.data);
  },
  textInput: function (e) {//监听text输入
    self.setData({
      reason: e.detail.value
    })
    self.data.data.C3_533143291117 = e.detail.value;
  }
})