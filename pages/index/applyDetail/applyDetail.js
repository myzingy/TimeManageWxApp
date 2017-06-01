import common from "../../../common/common"

var app = getApp();
Page({
  data: {
    files: []
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    let item = JSON.parse(options.data);
    let urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
    urls = urls.filter(x => x != null);
    self.setData({
      data: item,
      files:urls
    })


     var ruleM = common.getRule(item.C3_533398158705);
     self.setData({
        noticeStr: ruleM.C3_545771115865
      })

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    self.getData();
  },
  getData: function () {


    var param = {
      'resid': 541502768110,
      'subresid': 541521075674,
      'cmswhere': '',
      'hostrecid':self.data.data.REC_ID,
      'cmsorder':''
    }
    app.HttpService.getSubData(param, function (data) {
      if (data && data.data && data.data.data) {
        let pendedProcessData = Array.from(data.data.data);
        self.setData({
          pendedProcessData:pendedProcessData
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
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
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  cancel:function(){
    common.cancel(self.data.data);
  }
})