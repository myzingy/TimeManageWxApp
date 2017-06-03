import common from '../../common/common'

var app = getApp();
var self;
Page({
  data: {
    navTitleArr: ['当月排班', '考勤日报', '考勤月报'],
    pageName: 'unverify',//当前页的名称
    pageNameArr: ['unverify', 'pended', 'pended'],
    data:null,
    monthWork: {
      'yearMothSelect': 0
    },
    pageIndex: 0

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;


    // self.getData(0); 
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getData: function (index) {//获取数据
    var self = this;

    // if (self.data.dataArr[self.data.pageIndex].length) {//内存缓存数据提取
    //   self.setData({ data: self.data.dataArr[self.data.pageIndex] });
    //   return;
    // }

    wx.showLoading({
      title: '加载中'
    })

    var param = {
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }

    param.pageSize = 20;
    if (!index) {//刷新
      param.pageIndex = 0;

    } else {//加载
      param.pageIndex = self.data.dataArr[self.data.pageIndex].length;
    }

    if (self.data.pageIndex == 0) {//当月排班
      param.resid = 543946502584
    } else if (self.data.pageIndex == 1) {//已审批
      param.resid = 541518986783
    } else if (self.data.pageIndex == 2) {//已退回
      param.resid = 541519417864
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        var dataArr = data.data.data;
        var yearMonthArr = [];
        dataArr.forEach(function (index, item) {
          console.log("--------------->type" + typeof (data[index].C3_542128471153));
          var yearMonthM = data[index].C3_542128471153;
          var yearMonthStr = yearMonthM.toString();
          yearMonthArr.push(yearMonthStr);

        });
        var tmpMonthWork = self.data.monthWork;
        tmpMonthWork.yearMonthArr = yearMonthArr;
        self.setData({
          monthWork: tmpMonthWork
        })
      }


      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
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

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  pageClick: function (event) {//导航点击事件
    self.setData({
      data: []
    })

    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    // this.getData(0);

  }
})