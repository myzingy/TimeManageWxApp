import common from '../../../common/common'

var self;
var app = getApp();

var startHours = [];
var startMins = [];

for (let i = 0; i < 24; i++) {
  if (i < 10) startHours.push('0' + i);
  else startHours.push(i);
}

for (let i = 0; i < 60; i++) {
  if (i < 10) startMins.push('0' + i);
  else startMins.push(i);
}

Page({
  data: {
    isCard: false,
    isDraft: false,
    draftData:{},
    categoryModel: {
      selectDataIndex: 0,
      selectDataArr: []
    },

    startTime: '请选择',
    endTime: '请选择',
    files: ['', '', '', ''],
    startDateModel: {
      startDate: '请选择',
      startHour: '0',
      startHours: startHours,
      startMin: '0',
      startMins: startMins
    },

    endDateModel: {
      endDate: '请选择',
      endHour: '0',
      startHours: startHours,
      endMin: '0',
      startMins: startMins
    },

    tempApprove: '',
    noticeStr: '',
    hour: '',
    reason: '',
    imageShowArr: []

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
      tempApprove: app.globalData.teamApprove
    })


    if (options.data) {
      self.setData({
        isDraft:true
      })
      let item = JSON.parse(options.data);
      self.setData({draftData:item});
      let tmpCategoryModel = self.data.categoryModel;
      tmpCategoryModel.selectDataIndex = tmpCategoryModel.selectDataArr.findIndex((value, index, arr) => value == item.C3_533398158705);
      // C3_533143179815
      // C3_533143217561
      //开始时间
      let tmpStartDateModel = self.data.startDateModel;
      tmpStartDateModel.startDate = item.C3_533143179815.split(' ')[0];

      let tmpSartHour = item.C3_533143179815.split(' ')[1].split(':')[0];
      let tmpSartMin = item.C3_533143179815.split(' ')[1].split(':')[1];
      tmpStartDateModel.startHour = tmpStartDateModel.startHours.findIndex((value, index, arr) => value == tmpSartHour)
      tmpStartDateModel.startMin = tmpStartDateModel.startMins.findIndex((value, index, arr) => value == tmpSartMin)

      let tmpEndDateModel = self.data.endDateModel;
      tmpEndDateModel.endDate = item.C3_533143217561.split(' ')[0];

      let tmpEndHour = item.C3_533143217561.split(' ')[1].split(':')[0];
      let tmpEndMin = item.C3_533143217561.split(' ')[1].split(':')[1];
      tmpEndDateModel.endHour = tmpEndDateModel.startHours.findIndex((value, index, arr) => value == tmpEndHour)
      tmpEndDateModel.endMin = tmpEndDateModel.startMins.findIndex((value, index, arr) => value == tmpEndMin)

      self.setData({
        categoryModel: tmpCategoryModel,
        reason: item.C3_533143291117,
        tempApprove: item.C3_542556605600,
        hour: item.C3_541449935726,
        files: [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420],
        startDateModel: tmpStartDateModel,
        endDateModel: tmpEndDateModel

      })
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    // var e;
    // e.target.dataset.kind = 'selectDataIndex';
    // self.pickSelect();
     var ruleStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];

     var ruleM = common.getRule(ruleStr);
     if(ruleM){
     self.setData({
        noticeStr: ruleM.C3_545771115865
      })
      var imageShowArr = self.kvoAttach(ruleM);
      self.setData({
        imageShowArr: imageShowArr
      })
     }
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
  chooseImage: function (e) {
    let tag = e.target.dataset.tag;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        self.data.files[tag] = res.tempFilePaths[0];
        self.setData({
          files: self.data.files
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

      var itemStr = self.data.categoryModel.selectDataArr[e.detail.value];
      var ruleM = common.getRule(itemStr);
      self.setData({
        noticeStr: ruleM.C3_545771115865
      })
      var imageShowArr = self.kvoAttach(ruleM);
      self.setData({
        imageShowArr: imageShowArr
      })

      if (itemStr == '补打卡') {
        self.setData({
          isCard: true
        })
      } else {
        self.setData({
          isCard: false
        })
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
    } else if (kindStr == 'endDate') {
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
  hourCalculate: function () {//计算时长
    var startTime = self.data.startDateModel.startDate + " " + self.data.startDateModel.startHours[self.data.startDateModel.startHour] + ":" + self.data.startDateModel.startMins[self.data.startDateModel.startMin];

    var endTime = self.data.endDateModel.endDate + " " + self.data.endDateModel.startHours[self.data.endDateModel.endHour] + ":" + self.data.endDateModel.startMins[self.data.endDateModel.endMin];

    var data1 = {
      "C3_546130034510": startTime,
      "C3_546130034799": endTime,
      "C3_546130035036": self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex],
      "C3_546181010461": app.globalData.userInfo.data.Dep1Code
    }



    var param = {
      'resid': 546129993686,
      'data': data1
    }


    var data2 = {
      "C3_545822726730": startTime,
      "C3_545822726977": endTime,
      "C3_545822727444": self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex]

    }

    var param2 = {
      'resid': 545822693342,
      'data': data2
    }

    app.HttpService.hourCalculate(param, function (data) {
      if (data && data.data && data.data.data) {
        param2.data.C3_546180817741 = data.data.data[0].C3_546130076462;
        app.HttpService.hourCalculate(param2, function (data) {
          if (data && data.data && data.data.data) {
            self.setData({
              hour: data.data.data[0].C3_545928354975
            })

          } else self.setData({ data: [] });
          wx.stopPullDownRefresh();
          wx.hideLoading();
        }, function () {
          wx.stopPullDownRefresh();
          wx.hideLoading();
        });

      } else self.setData({ data: [] });
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });

  },
  saveApply: function () {//修改
    let data = self.fixData('save');
    if(self.data.isDraft){//草稿 重新修改
      for(var key in data){
        self.data.draftData[key] = data[key];
      }
      common.reSaveAndSubmit(self.data.draftData,function(){
        common.successBack();
      })
    }else{
      common.saveAndSubmit(data, function () {
      common.successBack();
     });
    }
    
  },
  addApply: function () {//提交
    let data = self.fixData('submit');
    if(self.data.isDraft){//草稿 重新修改
      for(var key in data){
        self.data.draftData[key] = data[key];
      }
      common.reSaveAndSubmit(self.data.draftData,function(){
        common.successBack();
      })
    }else{
    common.saveAndSubmit(data, function () {
      common.successBack();
    });
    }
  },
  kvoAttach: function (selectRuleM) {//附件
    if (selectRuleM == null) return ["", "", "", ""];
    var imgShowArr = [];//拍照是否显示
    imgShowArr.push([selectRuleM.C3_545770918237 == 'Y' ? true : false, selectRuleM.C3_545770982165 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032511]);
    imgShowArr.push([selectRuleM.C3_545770921226 == 'Y' ? true : false, selectRuleM.C3_545770982361 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032706]);
    imgShowArr.push([selectRuleM.C3_545770922361 == 'Y' ? true : false, selectRuleM.C3_545770982566 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771032913]);
    imgShowArr.push([selectRuleM.C3_545770923478 == 'Y' ? true : false, selectRuleM.C3_545770990395 == 'Y' ? "必填" : "非必填", selectRuleM.C3_545771067208]);
    return imgShowArr;
  },
  fixData: function (str) {
    var startTime = self.data.startDateModel.startDate + " " + self.data.startDateModel.startHours[self.data.startDateModel.startHour] + ":" + self.data.startDateModel.startMins[self.data.startDateModel.startMin];

    var endTime = self.data.endDateModel.endDate + " " + self.data.endDateModel.startHours[self.data.endDateModel.endHour] + ":" + self.data.endDateModel.startMins[self.data.endDateModel.endMin];

    // if (app.debug) {
    //   startTime = '2017-04-25 19:00';
    //   endTime = '2017-04-25 20:00';
    //   self.data.hour = '1';
    // }


    var data = {
      "C3_533143179815": startTime,
      "C3_533143217561": endTime,
      "C3_533398158705": self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex],
      // "C3_546181010461":app.globalData.userInfo.data.Dep1Code
      "C3_542556605600": self.data.tempApprove,
      "C3_541449935726": self.data.hour,
      "C3_541450276993": self.data.files[0],
      "C3_545771156108": self.data.files[1],
      "C3_545771157350": self.data.files[2],
      "C3_545771158420": self.data.files[3],
      "C3_533143291117": self.data.reason,
      "C3_541449606438": "N"
    }

    if (str == 'save') {
      data.C3_541449538456 = "N"
    } else {
      data.C3_541449538456 = "Y"
    }
    return data;
  },
  textInput:function(e){//监听text输入
    self.setData({
      reason:e.detail.value
    })
  }

})
