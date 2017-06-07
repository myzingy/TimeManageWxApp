var app = getApp();

function getDayReportMonth(self) {
  self.data.dayReport.yearMonthArr = self.data.monthWork.yearMonthArr;
  self.setData({
    data: self.data.dayReport
  })

}

function getDayReportData(self) {
  var param = {
    'resid': 543666594803,
    'subresid': '',
    'cmswhere': '',
    'key': ''
  }

  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {
      var dataArr = data.data.data;
      self.data.dayReport.dataArr = dataArr;
      self.setData({
        dayReport: self.data.dayReport
      })

      self.data.dayReport.backupData = dataArr;
    }
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
  });
}

function getErrorData(self) {//异常数据

  var backupData = self.data.dayReport.backupData;
  var filterArray = [];
  for (var i = 0; i < backupData.length; i++) {
    var dataModel = backupData[i];
    if (parseInt(dataModel.F_1) > 0 || parseInt(dataModel.F_2) > 0 || parseInt(dataModel.F_3) > 0) {
      filterArray.push(dataModel);
    }
  }
  self.data.dayReport.dataArr = filterArray;
  self.setData({
    dayReport: self.data.dayReport
  })

}

function getDefaultData(self) {//正常数据
  var backupData = self.data.dayReport.backupData;
  self.data.dayReport.dataArr = backupData;
  self.setData({
    dayReport: self.data.dayReport
  })

}

module.exports = {
  getDayReportMonth: getDayReportMonth,
  getDayReportData: getDayReportData,
  getErrorData:getErrorData,
  getDefaultData:getDefaultData
}