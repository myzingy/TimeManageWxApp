var app = getApp();

function saveAndSubmit(data, success, fail) { //提交 保存
  var valiateBool = valiateForm(data);
  if(!valiateBool) return;
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
  var valiateBool = valiateForm(data);
  if (!valiateBool) return;
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

function valiateForm(data){//验证提交数据

  if (data.C3_533398158705 != '补打卡') {//非补打卡时长的验证
    if (data.C3_541449935726 == undefined || data.C3_541449935726 == '') { 
        customModal("时长不能为空！"); 
        return false;
      }
    }

  var selectRuleM = getRule(data.C3_533398158705);

    var cameraNeccesseryArr = [selectRuleM.C3_545770918237,
selectRuleM.C3_545770921226,
selectRuleM.C3_545770922361,
selectRuleM.C3_545770923478];
    var addressArr = [data.C3_541450276993, data.C3_545771156108, data.C3_545771157350, data.C3_545771158420];
    for (var i = 0; i < addressArr.length; i++) {
      if (i >= cameraNeccesseryArr.length) { alert(cameraNeccesseryArr); return false; }
      if (cameraNeccesseryArr[i] == 'Y' && (addressArr[i] == undefined || addressArr[i] == '' || addressArr[i] == null)) {
        customModal("必填未填完！");
        return false;
      }
    }
    return true;
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
  const vacationStrArr = ['annual','business','maternity','trip','compassionate','breastfeeding',
 'sicks','personal','annual'];



  if(str == 'overtime') return '/images/jiaban.png';
  else if(str == 'fillout') return '/images/bushuaka.png';
  else if(vacationStrArr.indexOf(str) != -1) return '/images/qingjia.png';
  else if(str == 'spcg') return '/images/caogao.png';
  else if(str == 'zzsp') return '/images/zhuzhang.png';
  else if(str == 'zgsp') return '/images/zhuguan.png';
  else if(str == 'jlsp') return '/images/jingli.png';
  else if (str == 'spjl') return '/images/wangjingli.png';
  else if (str == 'spzg') return '/images/zhangzhuguan.png';
  else if (str == 'spzz') return '/images/lizhuzhang.png';
}

//处理data中的样式和图片匹配
function promiseImageWithStyle(data,strArray){
  for(var i = 0 ; i < strArray.length ; i ++){
    var keyStr = strArray[i];
      for(var j = 0 ; j < data.length ; j ++){
        var item = data[j];
        if (keyStr == 'C3_541450438440'){
          if (item[keyStr] == 'Y'){
            item[keyStr] = '/images/gouxuankuang-2.png'
          } else item[keyStr] = '/images/gouxuankuang-1.png'
        }else{
          item[keyStr] = getLocalImageUrl(item[keyStr]);
        }
      }
  }
  return data;
}

//获取照片非必填
function kvoAttach(selectRuleM) {//附件
  if (selectRuleM == null) return ["", "", "", ""];
  var imgShowArr = [];//拍照是否显示
  imgShowArr.push([selectRuleM.C3_545770918237 == 'Y' ? true : false, selectRuleM.C3_545770982165 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032511]);
  imgShowArr.push([selectRuleM.C3_545770921226 == 'Y' ? true : false, selectRuleM.C3_545770982361 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032706]);
  imgShowArr.push([selectRuleM.C3_545770922361 == 'Y' ? true : false, selectRuleM.C3_545770982566 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032913]);
  imgShowArr.push([selectRuleM.C3_545770923478 == 'Y' ? true : false, selectRuleM.C3_545770990395 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771067208]);
  return imgShowArr;
}




/*************util 工具类 */
function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

Date.prototype.format = function (format)
 {
  var o = {
  "M+" : this.getMonth()+1, //month
  "d+" : this.getDate(),    //day
  "h+" : this.getHours(),   //hour
  "m+" : this.getMinutes(), //minute
  "s+" : this.getSeconds(), //second
  "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
  "S" : this.getMilliseconds() //millisecond
  }
  if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
  (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)if(new RegExp("("+ k +")").test(format))
  format = format.replace(RegExp.$1,
  RegExp.$1.length==1 ? o[k] :
  ("00"+ o[k]).substr((""+ o[k]).length));
  return format;
 }  

function customModal(title){
  wx.showModal({
    title: title
  })
}

function customLoading(){
  wx.showLoading({
    title: '加载中',
  })
}



module.exports = {
  saveAndSubmit: saveAndSubmit,
  reSaveAndSubmit:reSaveAndSubmit,
  successBack: successBack,
  cancel: cancel,
  getRule:getRule,
  getAllRuleCategory:getAllRuleCategory,
  getLocalImageUrl:getLocalImageUrl,
  promiseImageWithStyle:promiseImageWithStyle,
  isArray:isArray,
  kvoAttach:kvoAttach,
  customModal:customModal,
  customLoading:customLoading
}