var self;
var app = getApp();

var startHours = [];
var startMins = [];

for (let i = 0; i < 24; i++) {
  if(i < 10) startHours.push('0' + i);
  else startHours.push(i);
}

for (let i = 0; i < 60; i++) {
   if(i < 10) startMins.push('0' + i);
   else startMins.push(i);
}

Page({
  data: {
    categoryModel: {
      selectDataIndex: 0,
      selectDataArr: []
    },

    startTime: '请选择',
    endTime: '请选择',
    files: [],
    startDateModel:{
      startDate: '请选择',
     startHour: '0',
      startHours: startHours,
      startMin: '0',
     startMins: startMins
    },

     endDateModel:{
      endDate: '请选择',
      endHour: '0',
      startHours: startHours,
      endMin: '0',
     startMins: startMins
    },

    tempApprove:'',
    noticeStr:'',
    hour:'',
    reason:''
    

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    let tmpM = self.data.categoryModel;
    tmpM.selectDataArr = app.globalData.vacationCategory;
    self.setData({
      categoryModel: tmpM
    })

    self.setData({
      tempApprove:app.globalData.teamApprove
    })


  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getData: function () {

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  chooseImage: function () {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        self.setData({
          files: self.data.files.concat(res.tempFilePaths)
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  pickSelect: function (e) {
    let kindStr = e.target.dataset.kind;
    if (kindStr == 'selectDataIndex') {
      let tmpM = self.data.categoryModel;
      tmpM.selectDataIndex = e.detail.value;
      self.setData({
        categoryModel: tmpM
      })

      var ruleArr = app.globalData.rule;
        var itemStr = self.data.categoryModel.selectDataArr[e.detail.value];
        for (var i = 0; i < ruleArr.length; i++) {
            var tempRuleM = ruleArr[i];
            if (tempRuleM.C3_533402301362 == itemStr) {
              self.setData({
                noticeStr:tempRuleM.C3_545771115865
              })
            }
        }

    } else if (kindStr == 'startDate') {
      let tmpM = self.data.startDateModel;
      tmpM.startDate = e.detail.value;
      self.setData({
        startDateModel: tmpM
      })

    } else if (kindStr == 'startHour') {
        let tmpM = self.data.startDateModel;
      tmpM.startHour = e.detail.value;
      self.setData({
        startDateModel: tmpM
      })

    } else if (kindStr == 'startMin') {
      let tmpM = self.data.startDateModel;
      tmpM.startMin = e.detail.value;
      self.setData({
        startDateModel: tmpM
      })
    }else if (kindStr == 'endDate') {
      let tmpM = self.data.endDateModel;
      tmpM.endDate = e.detail.value;
      self.setData({
        endDateModel: tmpM
      })

    } else if (kindStr == 'endHour') {
        let tmpM = self.data.endDateModel;
      tmpM.endHour = e.detail.value;
      self.setData({
        endDateModel: tmpM
      })

    } else if (kindStr == 'endMin') {
      let tmpM = self.data.endDateModel;
      tmpM.endMin = e.detail.value;
      self.setData({
        endDateModel: tmpM
      })
    }

  },
  hourCalculate:function(){
//  startDateModel:{
//       startDate: '请选择',
//      startHour: '0',
//       startHours: startHours,
//       startMin: '0',
//      startMins: startMins
//     },

//      endDateModel:{
//       endDate: '请选择',
//       endHour: '0',
//       startHours: startHours,
//       endMin: '0',
//      startMins: startMins
//     },
    var startTime = self.data.startDateModel.startDate + " " + self.data.startDateModel.startHours[self.data.startDateModel.startHour] + ":" + self.data.startDateModel.startMins[self.data.startDateModel.startMin];

     var endTime = self.data.endDateModel.endDate + " " + self.data.endDateModel.startHours[self.data.endDateModel.endHour] + ":" + self.data.endDateModel.startMins[self.data.endDateModel.endMin];

    var data1 = {
      "C3_546130034510":startTime,
      "C3_546130034799":endTime,
      "C3_546130035036":self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex],
      "C3_546181010461":app.globalData.userInfo.data.Dep1Code
    }

    

    var param = {
      'resid':546129993686,
      'data':data1
    }


    var data2 = {
      "C3_545822726730":startTime,
      "C3_545822726977":endTime,
      "C3_545822727444":self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex]
      
    }

     var param2 = {
      'resid':545822693342,
      'data':data2
    }

        // var standardHourCalModel = new Object();
        // standardHourCalModel.C3_546130034510 = '';
        // standardHourCalModel.C3_546130034799 = '';
        // standardHourCalModel.C3_546130035036 = self.data.categoryModel.selectDataArr[e.detail.value];
        // //一级企业编号
        // standardHourCalModel.C3_546181010461 = app.globalData.userInfo.data.Dep1Code;

        // //if (appConfig.app.debug) hourCalModel.C3_545822727218 = '544901984748';

        app.HttpService.hourCalculate(param, function (data) {
      if(data && data.data &&data.data.data){
          param2.data.C3_546180817741 = data.data.data[0].C3_546130076462;
                  app.HttpService.hourCalculate(param2, function (data) {
              if(data && data.data &&data.data.data){
                 self.setData({
                   hour:data.data.data[0].C3_545928354975
                 }) 
                
              }else self.setData({data:[]});
              wx.stopPullDownRefresh();
              wx.hideLoading();
            }, function () {
              wx.stopPullDownRefresh();
              wx.hideLoading();
            });
        
      }else self.setData({data:[]});
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });

  },
  addApply:function(){
    var startTime = self.data.startDateModel.startDate + " " + self.data.startDateModel.startHours[self.data.startDateModel.startHour] + ":" + self.data.startDateModel.startMins[self.data.startDateModel.startMin];

     var endTime = self.data.endDateModel.endDate + " " + self.data.endDateModel.startHours[self.data.endDateModel.endHour] + ":" + self.data.endDateModel.startMins[self.data.endDateModel.endMin];

     if(app.debug) {
       startTime = '2017-04-25 19:00';
       endTime = '2017-04-25 20:00';
       self.data.hour = '1';
     }
     
    var data = {
      "C3_533143179815":startTime,
      "C3_533143217561":endTime,
      "C3_533398158705":self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex],
      // "C3_546181010461":app.globalData.userInfo.data.Dep1Code
      "C3_542556605600":self.data.tempApprove,
      "C3_541449935726":self.data.hour,
      "C3_541450276993":"",
      "C3_545771156108":"",
      "C3_545771157350":"",
      "C3_545771158420":"",
      "C3_533143291117":self.data.reason,
      "C3_541449538456":"Y",
      "C3_541449606438":"N"
    }

    var param = {
      'resid':541502768110,
      'data':data
    }
      app.HttpService.hourCalculate(param, function (data) {
      if(data && data.data &&data.data.data){
        wx.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
      }else self.setData({data:[]});
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  }

})