var app = getApp();
import common from '../../../common/common'

function getDayReportMonth(self) {
  self.data.dayReport.yearMonthArr = self.data.monthWork.yearMonthArr;
  self.setData({
    data: self.data.dayReport
  })

  getDayReportData(self);

}

function is_leap(year) {//是否闰年
  return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
}

function getDayReportData(self) {
  

  var defaultYM = self.data.dayReport.yearMonthArr[self.data.dayReport.yearMothSelect];
  //  defaultYM = "201703"
  
  var entYear = parseInt(defaultYM.substring(0, 4)); //.slice('年');
  var entMonth = parseInt(defaultYM.substring(4, 6)) - 1; //.slice('月');
 

  var monthDayCountArr = [31, 28 + is_leap(entYear), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];//每月天数
  var firstDateStr = new Date(entYear, entMonth, 1).format('yyyyMMdd');
  var lastDateStr = new Date(entYear, entMonth, monthDayCountArr[entMonth]).format('yyyyMMdd');

  var cmswhere = "DATES >= '" + firstDateStr + "' AND DATES <= '" + lastDateStr + "'";

  var param = {
    'resid': 543666594803,
    'subresid': '',
    'cmswhere': cmswhere,
    'key': ''
  }

  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {
      var dataArr = data.data.data;
      if(app.debug){
        var a = {};
        a.DATES = "2017-05-05";
        a.STARTTIMES = "09:00"
        a.ENDTIMES = "10:00"
        a.F_5 = "10h";
        a.C3_375377576828 = '单日班'
        a.F_1 = '12'
        a.F_2 = '单日班'
        a.F_14 = '单日班'
        a.F_15 = '单日班'
        dataArr = [a];
        console.log('---------------------->dataArr' + dataArr);
      }
      dataArr = common.dealNull(dataArr)
      self.data.dayReport.dataArr = dataArr;
      self.setData({
        data: self.data.dayReport
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
    data: self.data.dayReport
  })

}

function getDefaultData(self) {//正常数据
  var backupData = self.data.dayReport.backupData;
  self.data.dayReport.dataArr = backupData;
  self.setData({
    data: self.data.dayReport
  })

}

module.exports = {
  getDayReportMonth: getDayReportMonth,
  getDayReportData: getDayReportData,
  getErrorData:getErrorData,
  getDefaultData:getDefaultData
}