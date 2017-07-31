var app = getApp();
var self;
Page({
  data: {
    vacationCategorySuccess: false,
    refuseArrSuccess: false,
    imgHeight: 0
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    var width, height;
    wx.getImageInfo({
      src: '../../images/kaoqin-1.png',
      success: function (res) {
        width = res.width;
        height = res.height;

        wx.getSystemInfo({
          success: function (res) {
            self.setData({
              imgHeight: res.screenWidth * height / width
            })
          },
        })
      },
      fail: function (res) {

      }
    })

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

    wx.showNavigationBarLoading();


    var param = {
      'apitoken': 'KingOfDinner123456789',
      'clienttype': 'mobile',
      'openid': 'oqWaVwKG0Yj0_8cbsSB3b9R31YcA'
    }
    //登录
    app.HttpService.customWxLogin(param, function (data) {
      if (data.data.error == 0) {
        app.globalData.userInfo = data.data;

        var needLoginParam = {
          'resid': 539606519726,
          'cmswhere': ''
        }
        app.HttpService.getData(needLoginParam, function (data) {

          if (data && data.data && data.data.data && data.data.data[0]) {
            if (data.data.data["0"].C3_554828307258 == 'Y') {
              self.getVacationCategory();
              self.getTeamApprove();
              self.getRefuseData();
              console.log("debug account")
            } else {
              self.login();
              console.log("default account")
            }
          }else{
            wx.showModal({
              title: '获取公众号数据失败'
            })
          }

        }, function () {
          wx.showModal({
            title: '获取公众号数据失败'
          })
        });



      } else {
        wx.showModal({
          title: '登录失败'
        })
      }
    }, function () {
      wx.showModal({
        title: '登录失败'
      })
    });

  },

  login: function () {
    var code;
    wx.login({
      success: function (e) {
        console.log(e);
        code = e.code;
        wx.getUserInfo({
          success: function (e) {
            console.log(e);

            var param = {
              code: code,
              encrypteddata: e.encryptedData,
              iv: e.iv,
              AppId: app.Config.appid,
              AppSecret: app.Config.app_secret

            }
            //获取uniid
            app.HttpService.customLogin(param, function (data) {
              console.log("--------<登录成功" + data);
              wx.setStorageSync("openid", data.data.openId);
              wx.setStorageSync("unionid", data.data.unionId);

              var param = {
                'apitoken': 'KingOfDinner123456789',
                'clienttype': 'mobile',
                'openid': data.data.unionId
              }
              //登录
              app.HttpService.customWxLogin(param, function (data) {
                if (data.data.error == 0) {
                  app.globalData.userInfo = data.data;
                  self.getVacationCategory();
                  self.getTeamApprove();
                  self.getRefuseData();
                } else {
                  wx.redirectTo({
                    url: '/pages/account/account',
                  })
                }
              }, function () {

              });
            })
          }
        })
      }
    })
  },

  getVacationCategory: function () {
    var param = {
      'resid': 542128856156,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        let dataArr = Array.from(data.data.data);
        let tmpArr = [];
        for (let i = 0; i < dataArr.length; i++) {
          tmpArr.push(dataArr[i].C3_533402301362);
        }
        app.globalData.rule = dataArr;
        app.globalData.vacationCategory = tmpArr;
        self.setData({
          vacationCategorySuccess: true
        })
        self.gotoApplyPage();
      } else {
        wx.showModal({
          title: '获取假期类别失败'
        })
      }
      wx.hideLoading();
    }, function () {
      wx.hideLoading();
      wx.showModal({
        title: '获取假期类别失败'
      })
    });
  },
  getTeamApprove: function () {
    var param = {
      'resid': 542225544503,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        let dataArr = Array.from(data.data.data);

        if (dataArr[0].C3_541450807755 == dataArr[0].C3_541450797951) {
          app.globalData.teamApprove = dataArr[0].C3_541467332728;
        } else {
          app.globalData.teamApprove = dataArr[0].C3_541450797951;
        }

        console.log('app.globalData.teamApprove' + app.globalData.teamApprove);
        self.gotoApplyPage();
      } else {
        wx.showModal({
          title: '获取审批组长类别失败'
        })
      }
      wx.hideLoading();
    }, function () {
      wx.hideLoading();
      wx.showModal({
        title: '获取审批组长类别失败'
      })
    });
  },
  gotoApplyPage: function () {
    if (self.data.vacationCategorySuccess && self.data.refuseArrSuccess) {

      wx.hideNavigationBarLoading();
      wx.switchTab({
        url: '/pages/index/index',
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
    } else {

    }

  },
  getRefuseData: function () {
    var param = {
      'resid': 541705605790,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        var dataArr = data.data.data;
        var tmpArr = [];
        for (var i = 0; i < dataArr.length; i++) {
          tmpArr.push(dataArr[i].C3_541705620055);
        }
        app.globalData.refuseArr = tmpArr;

        self.setData({
          refuseArrSuccess: true
        })
        self.gotoApplyPage();
      } else {
        wx.showModal({
          title: '获取退回理由失败'
        })
      }
      wx.hideLoading();
    }, function () {
      wx.hideLoading();
      wx.showModal({
        title: '获取退回理由失败'
      })
    });
  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  }
})