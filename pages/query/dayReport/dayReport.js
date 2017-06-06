var app = getApp();

function getDayReportMonth(self){
        self.data.dayReport.yearMonthArr = self.data.monthWork.yearMonthArr;
        self.setData({
          data: self.data.dayReport
        })
      
}

function getDayReportData(self){
   var param = {
     'resid':543666594803,
    'subresid': '',
    'cmswhere': '',
    'key': ''
  }
  
  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {

    }
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
  });
}

module.exports = {
  getDayReportMonth:getDayReportMonth,
  getDayReportData:getDayReportData
}