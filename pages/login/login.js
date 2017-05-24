var app = getApp();
var self;
Page({
  data:{
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    self = this;
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成

    wx.showNavigationBarLoading();

    var param = {
      'apitoken': 'KingOfDinner123456789',
      'clienttype': 'mobile',
      'openid': 'oqWaVwGcgX9cQhwYQs8e1fg7e9U8'
    }
    app.HttpService.customWxLogin(param, function (data) {
      app.globalData.userInfo = data.data;
      self.getVacationCategory();
    }, function () {

    });

  },
  getVacationCategory:function(){
    var param = {
      'resid':542128856156,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    app.HttpService.getApplyData(param, function (data) {
      if(data && data.data && data.data.data){
          let dataArr = Array.from(data.data.data);
          let tmpArr = [];
          for(let i = 0; i < dataArr.length; i ++){
            tmpArr.push(dataArr[i].C3_533402301362);
          }
          app.globalData.vacationCategory = tmpArr;
          wx.switchTab({
              url: '/pages/index/index',
              success: function(res){
                // success
               
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
            })
      }else {
            wx.showModal({
              title:'获取假期类别失败'
            })
      }
      wx.hideLoading();
    }, function () {
      wx.hideLoading();
    });
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})