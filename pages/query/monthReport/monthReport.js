var app = getApp();
import common from '../../../common/common'

function getMonthReportData(self){
  var param = {
     'resid':543666672286,
    'subresid': '',
    'cmswhere': '',
    'key': ''
  }
  
  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {
      var dataArr = data.data.data;
      dataArr = common.dealNull(dataArr)
      self.setData({
        data: dataArr[0]
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