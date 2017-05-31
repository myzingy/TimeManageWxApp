var app = getApp();

function saveAndSubmit(data, success, fail) { //提交 保存
  //  success();
  //  return;
  var param = {
    'resid': 541502768110,
    'data': data
  }

  app.HttpService.addData(param, function (data) {
    wx.stopPullDownRefresh();
    wx.hideLoading();

    if (data.data.error == 0) {
      if(success) success();

    } else {
      wx.showModal({
        title: '失败',
        content: data.data.message
      })
      if(fail) fail();
    }

  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
    if(fail) fail();
  });
}

function reSaveAndSubmit(data, success, fail) { //重新提交 保存
  //  success();
  //  return;
  var param = {
    'resid': 541502768110,
    'data': data
  }

  app.HttpService.saveData(param, function (data) {
    wx.stopPullDownRefresh();
    wx.hideLoading();

    if (data.data.error == 0) {
      success();

    } else {
      wx.showModal({
        title: '失败',
        content: data.data.message
      })
      fail();
    }

  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
    fail();
  });
}

function successBack() {
  wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 1000,
    success: function () {
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function (res) {
          // success
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    }
  })
}

//撤销
function cancel(data) {
  //541502768110
  data.C3_541449646638 = 'Y';
  var param = {
    'resid': 541502768110,
    'data': data
  }


  app.HttpService.saveData(param, function (data) {
    wx.stopPullDownRefresh();
    wx.hideLoading();

    if (data.data.error == 0) {
      // success();
      successBack();
    } else {
      wx.showModal({
        title: '失败',
        content: data.data.message
      })
      data.C3_541449646638 = 'N';
    }
  }, function () {
    wx.stopPullDownRefresh();
    wx.hideLoading();
    data.C3_541449646638 = 'N';
  });
}

//筛选出请假规则
function getRule(str) {
  var ruleArr = app.globalData.rule;
  for (var i = 0; i < ruleArr.length; i++) {
    var tempRuleM = ruleArr[i];
    if (tempRuleM.C3_533402301362 == str) {
      return tempRuleM

    }
  }
  return null;
}

//获取所有请假类型
function getAllRuleCategory(){
  var ruleArr = Array.from(app.globalData.rule);
  var dataArr = ['全部'];
  for (var i = 0; i < ruleArr.length; i++) {
    var tempRuleM = ruleArr[i];
      dataArr.push(tempRuleM.C3_533402301362);
  }
  return dataArr;
}

//配置图片路径
function getLocalImageUrl(str){
//   const overtimeArr = ['overtime'];
//   // background-image: url(../../../images/jiaban.png);
// // }

//   const fillout fillout {
//   background-image: url(../../../images/bushuaka.png);
// }

// .annual,.business,.maternity,.trip,.compassionate,.breastfeeding,
// .sicks,.personal,.annual{
//   background-image: url(../../../images/qingjia.png);
// }
  const vacationStrArr = ['annual','business','maternity','trip','compassionate','breastfeeding',
 'sicks','personal','annual']
  if(str == 'overtime') return '/images/jiaban.png';
  else if(str == 'fillout') return '/images/bushuaka.png';
  else if(vacationStrArr.indexOf(str)) return '/images/qingjia.png';
}



module.exports = {
  saveAndSubmit: saveAndSubmit,
  reSaveAndSubmit:reSaveAndSubmit,
  successBack: successBack,
  cancel: cancel,
  getRule:getRule,
  getAllRuleCategory:getAllRuleCategory,
  getLocalImageUrl:getLocalImageUrl
}