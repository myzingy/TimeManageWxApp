// 发起get请求
const path = {
  config: '/config',
  login: 'rispweb/rispservice/apiSvrLogin.aspx',
  apply: 'rispweb/risphost/data/AjaxService.aspx'
}

function getRequest(url, data, doSuccess, doFail, doComplete) {
  wx.request({
    url: getApp().Config.basePath + url,
    data: data,
    method: 'GET',
    header: { Authorization: wx.getStorageSync('token') }, // 设置请求的 header
    success: function (res) {
      if (res.statusCode == 401) {
        getApp().globalData.userInfo = null;
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/public/login'
        });
      } else if (res.statusCode == 404) {
        wx.showToast({
          title: '请求出错',
          icon: 'loading'
        });
      } else {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

//获取数据
function getData(url, data,method, doSuccess, doFail, doComplete) {
  
  if(method == 1){
    data.method = 'ShowHostTableDatas_Ajax';
    data.uiver = 200;
     data.dynlogin = 1;
     data.AccessToken = getApp().globalData.userInfo.ucode;
      data.user = getApp().globalData.userInfo.user;
   }else if(method == 2){
    data.method = 'SaveData_Ajax';
     data.uiver = 200;
     data.dynlogin = 1;
     data.user = getApp().globalData.userInfo.user;


    data.data._id = 1;
    data.data._state = "added";
    data.data.REC_ID = 0;

    data.data = JSON.stringify([data.data]);
     
    data.AccessToken = getApp().globalData.userInfo.ucode;



  }

  var str = getApp().Config.basePath + url + '?';
  for(var key in data){
    str = str + '&' + key + '=' + data[key];
  }
  console.log(str);
  wx.request({
    url: getApp().Config.basePath + url,
    data: data,
    method: 'GET',
    header: { Authorization: wx.getStorageSync('token') }, // 设置请求的 header
    success: function (res) {
      console.log(res);
      if (res.statusCode == 401) {
        getApp().globalData.userInfo = null;
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/public/login'
        });
      } else if (res.statusCode == 404) {
        wx.showToast({
          title: '请求出错',
          icon: 'loading'
        });
      } else {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}



// 发起post请求
function postRequest(url, data, doSuccess, doFail, doComplete) {
  wx.request({
    url: getApp().Config.basePath + url,
    data: data,
    method: 'POST',
    header: { Authorization: wx.getStorageSync('token') }, // 设置请求的 header
    success: function (res) {
      if (res.statusCode == 401) {
        wx.showModal({
          title: '提示',
          content: '连接超时,请重新登录',
          showCancel: !1,
          success: function () {
            getApp().globalData.userInfo = null;
            wx.removeStorageSync('token');
            wx.redirectTo({
              url: '/pages/public/login'
            });
          }
        });

      } else if (res.statusCode == 404 || res.statusCode == 500) {
        wx.showToast({
          title: '请求出错',
          icon: 'loading'
        });
      } else {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      } else {
        wx.showModal({
          title: '提示',
          content: '系统繁忙, 请稍后再试',
          showCancel: !1
        });
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

// 获取配置
function getConfig(doSuccess) {
  // getRequest(path.config, {}, doSuccess);
}

function customWxLogin(params,doSuccess,doFail){
  getRequest(path.login,params,doSuccess,doFail);
}

function getApplyData(params,doSuccess,doFail){
  getData(path.apply,params,1,doSuccess,doFail);
}

function hourCalculate(params,doSuccess,doFail){
  getData(path.apply,params,2,doSuccess,doFail);
}

//添加申请
function addApply(params,doSuccess,doFail){
  getData(path.apply,params,2,doSuccess,doFail);
}

module.exports = {
  customWxLogin:customWxLogin,
  getApplyData:getApplyData,
  hourCalculate:hourCalculate,
  addApply:addApply
}