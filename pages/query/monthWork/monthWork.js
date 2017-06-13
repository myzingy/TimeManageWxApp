var app = getApp();

function getMonthWorkData(self) {//获取考勤月份
  var param = {
    'subresid': '',
    'cmswhere': '',
    'key': ''
  }
  param.resid = 543946502584
  app.HttpService.getApplyData(param, function (data) {
    if (data && data.data && data.data.data) {
      var dataArr = data.data.data;
      var yearMonthArr = [];
      dataArr.forEach(function (item, index) {
        console.log("--------------->type" + typeof (item.C3_542128471153));
        var yearMonthM = item.C3_542128471153;
        var yearMonthStr = yearMonthM.toString();
        yearMonthArr.push(yearMonthStr);

      });
      
      self.data.monthWork.yearMonthArr = yearMonthArr;
      self.setData({
        data: self.data.monthWork
      })
      getCalendar(yearMonthArr[0],self);
    }
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
  });
}


function getCalendar(defaultYM,self) {
  defaultYM = defaultYM.toString();
  var yearArr = defaultYM.substring(0, 4); //.slice('年');
  var MonthArr = defaultYM.substring(4, 6); //.slice('月');

  var entMonth = parseInt(MonthArr), entYear = parseInt(yearArr);
  var date = new Date(entYear, entMonth - 1);
  var dateM = date.getMonth();
  var y = date.getFullYear();


  function is_leap(year) {//是否闰年
    return (year % 100 == 0 ? year % 400 == 0 ? 1 : 0 : year % 4 == 0 ? 1 : 0);
  }

  var monthDayCountArr = [31, 28 + is_leap(y), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31];//每月天数

  var firstDate = new Date(entYear, entMonth - 1, 1);
  var firstWeek = firstDate.getDay();//1号星期几

  var firstDateStr = new Date(entYear, entMonth - 1, 1).format('yyyyMMdd');
  var lastDateStr = new Date(entYear, entMonth - 1, monthDayCountArr[entMonth - 1]).format('yyyyMMdd');
  var cmswhere = "DATES >= '" + firstDateStr + "' AND DATES <= '" + lastDateStr + "'";



  var param = {
    'resid': 543666594803,
    'subresid': '',
    'cmswhere': cmswhere,
    'key': ''
  }

  app.HttpService.getApplyData(param, function (data) {
    // if (data && data.data && data.data.data) 
    data = data.data.data;
    if(app.debug) {
      for(var i = 0 ; i < 31 ; i ++){
        var a = {
          C3_375377576828:'常日班',
          DATES:i
        }
        data.push(a)
      }
    }
    var textColorArr = [];//字体颜色数组
    var monthDayCount = monthDayCountArr[dateM];//当月天数
    // data.splice(10, 5);
    var arrLength = data.length;
    if (data.length != monthDayCount) {//返回数据有误处理
      for (var i = 0; i < arrLength; i++) {
        var str = data[i].DATES;
        var curDay = new Date(entYear, entMonth - 1, i + 1).format('yyyyMMdd');
        if (parseInt(str) != curDay) {
          var dataM = new Object();
          dataM.C3_375377576828 = '';
          data.splice(i, 0, dataM);
        }


      }
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].C3_375377576828 == '白班') {
        textColorArr.push('red');
      } else {
        textColorArr.push('blue');
      }

    }

    var numberArr = [];
    for (var i = 0; i < firstWeek; i++) {
      numberArr.push('');
      textColorArr.unshift('');

      var dataM = new Object();
      dataM.C3_375377576828 = '';
      data.unshift(dataM);
    }
    for (var i = 0; i < monthDayCount; i++) numberArr.push(i + 1 + '');
    // console.log(numberArr + "----------->count" + numberArr.length);

    function viewModel(sun, mon, tus, wen, thur, fri, sat) {
      this.sun = sun;
      this.mon = mon;
      this.tus = tus;
      this.wen = wen;
      this.thur = thur;
      this.fri = fri;
      this.sat = sat;
      this.sunWork = sunWork;
    }
    var viewModelArr = [];
    for (var i = 0; i < numberArr.length / 7; i++) {
      var sunWork;
      var textColorSun;

      var m = new viewModel([numberArr[i * 7], i * 7 < data.length ? data[i * 7].C3_375377576828 : "", textColorArr[i * 7]],
        [numberArr[i * 7 + 1], i * 7 + 1 < data.length ? data[i * 7 + 1].C3_375377576828 : "", textColorArr[i * 7 + 1]],
        [numberArr[i * 7 + 2], i * 7 + 2 < data.length ? data[i * 7 + 2].C3_375377576828 : "", textColorArr[i * 7 + 2]],
        [numberArr[i * 7 + 3], i * 7 + 3 < data.length ? data[i * 7 + 3].C3_375377576828 : "", textColorArr[i * 7 + 3]],
        [numberArr[i * 7 + 4], i * 7 + 4 < data.length ? data[i * 7 + 4].C3_375377576828 : "", textColorArr[i * 7 + 4]],
        [numberArr[i * 7 + 5], i * 7 + 5 < data.length ? data[i * 7 + 5].C3_375377576828 : "", textColorArr[i * 7 + 5]],
        [numberArr[i * 7 + 6], i * 7 + 6 < data.length ? data[i * 7 + 6].C3_375377576828 : "", textColorArr[i * 7 + 6]]);
      viewModelArr.push(m);
    }

    console.log("viewModelArr==>" + JSON.stringify(viewModelArr));
    self.data.monthWork.dateArr = viewModelArr;
    self.setData({
      data: self.data.monthWork
    })
    wx.stopPullDownRefresh();
    wx.hideLoading();
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
  });

}

module.exports = {
  getMonthWorkData: getMonthWorkData,
  getCalendar: getCalendar
}