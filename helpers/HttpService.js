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
function coustomRequest(url, data, method, doSuccess, doFail, doComplete) {
  data.uiver = 200;
  data.dynlogin = 1;
  data.user = getApp().globalData.userInfo.user;
  data.AccessToken = getApp().globalData.userInfo.ucode;
  if (method == 1) {
    data.method = 'ShowHostTableDatas_Ajax';

  } else if (method == 2 || method == 4) {
    data.method = 'SaveData_Ajax';

    data.data._id = 1;

    if (method == 2) {
      data.data._state = "added";
      data.data.REC_ID = 0;
    } else {
      data.data._state = "modified";
    }
    data.data = JSON.stringify([data.data]);

  } else if (method == 3) {
    data.method = 'ajax_GetRelTableByHostRecord';

  }else if(method == 5){
    data.method = 'SaveData_Ajax';
    data.data = JSON.stringify(data.data);
  }

  var str = getApp().Config.basePath + url + '?';
  for (var key in data) {
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
          if ('error' in res.data){
            if (res.data.error == 0) {
              doSuccess(res);
            } else {
              if (res.data.message) {
                wx.showModal({
                  title: '失败',
                  content: res.data.message
                })
              }
              doFail();
            }
          }else{
            doSuccess(res);
          }
          

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

function customWxLogin(params, doSuccess, doFail) {
  getRequest(path.login, params, doSuccess, doFail);
}

function getApplyData(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 1, doSuccess, doFail);
}



function hourCalculate(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 2, doSuccess, doFail);
}

//添加申请
function addApply(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 2, doSuccess, doFail);
}

function getSubData(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 3, doSuccess, doFail);
}

// 获取数据
function getData(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 1, doSuccess, doFail);
}

// 添加数据
function addData(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 2, doSuccess, doFail);
}

// 修改数据
function saveData(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 4, doSuccess, doFail);
}

// 修改多条数据
function saveDataArr(params, doSuccess, doFail) {
  coustomRequest(path.apply, params, 5, doSuccess, doFail);
}

//图片上传
function uploadImg(tempFilePath,callback){
  //res.tempFilePaths[0]
  wx.uploadFile({
    url: getApp().Config.uploadImgPath + tempFilePath,
    filePath: tempFilePath,
    name: 'file',
    success: function (e) {
      var data = e.data;
      console.log("image-====>" + e.data);
      var imgModel = JSON.parse(e.data);
      if(imgModel.Data){
        callback(getApp().Config.basePath + imgModel.Data)
      }else{
        wx.showModal({
          title: '注意',
          content: '上传错误',
        })
      }
      
    },
    fail: function (e) {
      wx.showModal({
        title: '注意',
        content: '图片上传失败',
      })
    }
  })
}



module.exports = {
  customWxLogin: customWxLogin,
  getApplyData: getApplyData,
  hourCalculate: hourCalculate,
  addApply: addApply,
  getSubData: getSubData,
  saveData: saveData,
  addData: addData,
  getData:getData,
  saveDataArr:saveDataArr,
  uploadImg: uploadImg
}