var app = getApp();

function getMonthReportData(self){
  var param = {
     'resid':543666672286,
    'subresid': '',
    'cmswhere': '',
    'key': ''
  }
  
  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {
      self.setData({
        data: data.data.data[0]
      })
    }
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
  });
}

module.exports = {
  getMonthReportData:getMonthReportData
}