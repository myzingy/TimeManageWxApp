import common from '../../../common/common'

var self;
var app = getApp();

var startHours = [];
var startMins = ['00', '30'];

for (var i = 0; i < 24; i++) {
  if (i < 10) startHours.push('0' + i);
  else startHours.push(i + '');
}
var startDateModel = {
  startDate: '请选择',
  startHour: '0',
  startHours: startHours,
  startMin: '0',
  startMins: startMins
}

var endDateModel = {
  endDate: '请选择',
  endHour: '0',
  startHours: startHours,
  endMin: '0',
  startMins: startMins
}


Page({
  data: {
    isCard: false,
    isDraft: false,
    draftData: {},//草稿数据
    categoryModel: {
      selectDataIndex: 0,
      selectDataArr: []
    },

    startTime: '请选择',
    endTime: '请选择',
    files: ['', '', '', ''],//附件路径
    startDateModel: startDateModel,
    endDateModel: endDateModel,

    tempApprove: '',//审批人
    noticeStr: '',//注意事项
    hour: '',//时长
    reason: '',//事由
    imageShowArr: [],//4个照片控件的显示

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    //配置所有类型
    var tmpM = self.data.categoryModel;
    tmpM.selectDataArr = app.globalData.vacationCategory;
    self.setData({
      categoryModel: tmpM
    })

    

    //设置审批人
    self.setData({
      tempApprove: app.globalData.teamApprove
    })



    var item;
    if (options.data && options.data != 'undefined') {//草稿数据
      if(app.debug) console.log("draftdata");
      self.setData({
        isDraft: true
      })
      if (app.debug) console.log("data1" + JSON.stringify(options));
      item = JSON.parse(options.data);
      if (app.debug) console.log("data2" +item);
      self.setData({ draftData: item });
      var tmpCategoryModel = self.data.categoryModel;
      tmpCategoryModel.selectDataIndex = tmpCategoryModel.selectDataArr.indexOf(item.C3_533398158705); //tmpCategoryModel.selectDataArr.findIndex((value, index, arr) => value == );
      // C3_533143179815
      // C3_533143217561
      if (app.debug) console.log("starttime");
      //开始时间
      var tmpStartDateModel = self.data.startDateModel;
      tmpStartDateModel.startDate = item.C3_533143179815.split(' ')[0];

      var tmpSartHour = item.C3_533143179815.split(' ')[1].split(':')[0];
      var tmpSartMin = item.C3_533143179815.split(' ')[1].split(':')[1];
      tmpStartDateModel.startHour = tmpStartDateModel.startHours.indexOf(tmpSartHour)
      tmpStartDateModel.startMin = tmpStartDateModel.startMins.indexOf(tmpSartMin)

     

      var ruleM = common.getRule(item.C3_533398158705);
      var imageShowArr = common.kvoAttach(ruleM);
      self.setData({
        imageShowArr: imageShowArr
      })
      if (app.debug) console.log("setdata");
      self.setData({
        categoryModel: tmpCategoryModel,
        reason: item.C3_533143291117,
        tempApprove: item.C3_542556605600,
        hour: item.C3_541449935726,
        files: [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420],
        startDateModel: tmpStartDateModel

      })
    }






    //配置类型对应的控件
    self.getSetWithCategory();





    if (options.data && options.data != 'undefined'){
      item = JSON.parse(options.data); 
      //设置结束小时的间隔
      // var itemStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];
      var hor, endHours;
      var valueInt = parseInt(self.data.startDateModel.startHour);
      if (item.C3_533398158705 == '丧假' || item.C3_533398158705 == '路程假') hor = 8;
      else hor = 1;

      endHours = startHours.filter(function (item) {
        return ((parseInt(item) - valueInt) % hor == 0);
      })
      self.data.endDateModel.startHours = endHours;
      self.setData({
        endDateModel: self.data.endDateModel
      })


      //更具请假类型筛选出结束时间的范围，再重新进行赋值
      if (app.debug) console.log("endtime");
      var tmpEndDateModel = self.data.endDateModel;
      tmpEndDateModel.endDate = item.C3_533143217561.split(' ')[0];

      var tmpEndHour = item.C3_533143217561.split(' ')[1].split(':')[0];
      var tmpEndMin = item.C3_533143217561.split(' ')[1].split(':')[1];
      tmpEndDateModel.endHour = tmpEndDateModel.startHours.indexOf(tmpEndHour)
      tmpEndDateModel.endMin = tmpEndDateModel.startMins.indexOf(tmpEndMin)

      self.setData({
        endDateModel: tmpEndDateModel
      })
    }

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成


  },

  chooseImage: function (e) {
    var tag = e.target.dataset.tag;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        app.HttpService.uploadImg(res.tempFilePaths[0], function (path) {
          self.data.files[tag] = path;
          self.setData({
            files: self.data.files
          });
          common.customModal("上传成功")
        })
      },
      fail: function (res) {
        // fail
        common.customModal("选择图片失败")
      },
      complete: function (res) {
        // complete
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
    urls: self.data.files.filter( function(x) {return x != null}) // 需要预览的图片http链接列表
    })
  },
  pickSelect: function (e) {
    var kindStr = e.target.dataset.kind;
    if (kindStr == 'selectDataIndex') {
      var tmpM = self.data.categoryModel;
      tmpM.selectDataIndex = e.detail.value;
      self.setData({
        categoryModel: tmpM
      })
      
      self.resetTimeModel();//重置所有控件的值
      self.getSetWithCategory();
      

    } else if (kindStr == 'startDate') {
      var itemStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];
      var tmpM = self.data.startDateModel;
      tmpM.startDate = e.detail.value;
      self.setData({
        startDateModel: tmpM,
        hour: ''
      })

    } else if (kindStr == 'startHour') {

      var tmpM = self.data.startDateModel;
      tmpM.startHour = e.detail.value;
      self.setData({
        startDateModel: tmpM
      })

      var itemStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];
      var hor, endHours;
      var valueInt = parseInt(self.data.startDateModel.startHour);
      if (itemStr == '丧假' || itemStr == '路程假') hor = 8;
      else hor = 1;

      endHours = startHours.filter(function (item) {
        return ((parseInt(item) - valueInt) % hor == 0);
      })
      self.data.endDateModel.startHours = endHours;
      self.setData({
        endDateModel: self.data.endDateModel,
        hour: ''
      })

    } else if (kindStr == 'startMin' ) {
      var startTmpM = self.data.startDateModel;
      startTmpM.startMin = e.detail.value;
      self.setData({
        startDateModel: startTmpM,
        hour: ''
      })
    } else if (kindStr == 'endDate') {
      var tmpM = self.data.endDateModel;
      tmpM.endDate = e.detail.value;
      self.setData({
        endDateModel: tmpM,
        hour: ''
      })

    } else if (kindStr == 'endHour') {

      self.data.endDateModel.endHour = e.detail.value;
      self.setData({
        endDateModel: self.data.endDateModel,
        hour: ''
      })

    } else if ( kindStr == 'endMin'){
      var endTmpM = self.data.endDateModel;
      endTmpM.endMin = e.detail.value;
      self.setData({
        endDateModel: endTmpM,
        hour: ''
      })
    }

  },
  //计算时长
  hourCalculate: function () {

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
    wx.showLoading({
      title: '加载中'
    })
    app.HttpService.hourCalculate(param, function (data) {
      if (data && data.data && data.data.data) {
        param2.data.C3_546180817741 = data.data.data[0].C3_546130076462;
        app.HttpService.hourCalculate(param2, function (data) {
          if (data && data.data && data.data.data) {
            self.setData({
              hour: data.data.data[0].C3_545928354975
            })

          } else self.setData({ data: [] });
          wx.hideLoading();
        }, function () {
          wx.hideLoading();
        });

      } else self.setData({ data: [] });
      wx.hideLoading();
    }, function () {
      wx.hideLoading();
    });

  },

  //修改 提交
  saveOrSubmitApply: function (e) {
    var title = e.currentTarget.dataset.title;
    var data = self.fixData(title);

    if (self.data.isDraft) {//草稿 重新修改
      for (var key in data) {
        self.data.draftData[key] = data[key];
      }
      common.reSaveAndSubmit(self.data.draftData, function (resData) {
        if (title == 'save') common.successBackModal("保存成功");
        else common.successBackModal("提交成功");
        app.notification.emit("dataFix", resData);
      })
    } else {
      common.saveAndSubmit(data, function (resData) {
        if (title == 'save') common.successBackModal("保存成功");
        else common.successBackModal("提交成功");
        app.notification.emit("dataAdd", resData);
      });
    }

  },

  // 提交数据合并
  fixData: function (str) {
    var startTime = self.data.startDateModel.startDate + " " + self.data.startDateModel.startHours[self.data.startDateModel.startHour] + ":" + self.data.startDateModel.startMins[self.data.startDateModel.startMin];

    var endTime = self.data.endDateModel.endDate + " " + self.data.endDateModel.startHours[self.data.endDateModel.endHour] + ":" + self.data.endDateModel.startMins[self.data.endDateModel.endMin];

    var data = {
      "C3_533143179815": startTime,
      "C3_533143217561": endTime,
      "C3_533398158705": self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex],
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
  textInput: function (e) {//监听text输入
    self.setData({
      reason: e.detail.value
    })
  },
  
  //根据类型获取对应的规则
  getSetWithCategory: function (categoryStr) {
    

    var ruleStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];

    var ruleM = common.getRule(ruleStr);
    if (ruleM) {
      self.setData({
        noticeStr: ruleM.C3_545771115865 ? ruleM.C3_545771115865 : ''
      })
      var imageShowArr = common.kvoAttach(ruleM);
      self.setData({
        imageShowArr: imageShowArr
      })

      if (ruleStr == '补打卡') self.setData({ isCard: true })
      else self.setData({ isCard: false })

      //设置结束小时的间隔
      // var itemStr = self.data.categoryModel.selectDataArr[self.data.categoryModel.selectDataIndex];
      var hor, endHours;
      var valueInt = parseInt(self.data.startDateModel.startHour);
      if (ruleStr == '丧假' || ruleStr == '路程假') hor = 8;
      else hor = 1;

      endHours = startHours.filter(function (item) {
        return ((parseInt(item) - valueInt) % hor == 0);
      })
      self.data.endDateModel.startHours = endHours;
      self.setData({
        endDateModel: self.data.endDateModel
      })
    }
  },
  resetTimeModel: function () {//切换类型时重置时间规则
    self.setData({
      startDateModel: startDateModel,
      endDateModel: endDateModel,
      hour: '',
      files: ['', '', '', '']
    })

  }

})
