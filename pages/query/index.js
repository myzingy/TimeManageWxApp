import common from '../../common/common'
import monthWork from '/monthWork/monthWork'
import dayReport from '/dayReport/dayReport'

var app = getApp();
var self;
Page({
  data: {
    navTitleArr: ['当月排班', '考勤日报', '考勤月报'],
    pageName: 'monthWork',//当前页的名称
    pageNameArr: ['monthWork', 'dayReport', 'pended'],
    data:{},
    monthWork: {
      yearMothSelect: 0,
      yearMonthArr:['201705','201705'],
      dateArr:[[{sun:[1111,2222,'red']}],[{sun:[1111,2222,'red']}]]
    },
    dayReport:{
      yearMothSelect: 0,
      yearMonthArr:['201705','201705']
    },
    pageIndex: 0

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;


    
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    self.getData(0); 
  },
  getData: function (index) {//获取数据
    wx.showLoading({
      title: '加载中'
    })
    

    if (self.data.pageIndex == 0) {//当月排班
      monthWork.getMonthWorkData(self);
    } else if (self.data.pageIndex == 1) {//已审批
      dayReport.getDayReportMonth(self);
      dayReport.getDayReportData(self);
    } else if (self.data.pageIndex == 2) {//已退回
      param.resid = 541519417864
    }
    

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
  pageClick: function (event) {//导航点击事件
    // self.setData({
    //   data: []
    // })

    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    this.getData(index);

  },
  monthWorkChange:function(e){//日期选择
    var tag = e.currentTarget.dataset.tag;
    console.log("--------------->tag"+tag);
    if(tag == "monthWork"){
        self.data.monthWork.yearMothSelect = e.detail.value;
      self.setData({
        data:self.data.monthWork
      })
      monthWork.getCalendar(self.data.monthWork.yearMonthArr[self.data.monthWork.yearMothSelect],self);
    }else if(tag == "dayReport"){
        self.data.dayReport.yearMothSelect = e.detail.value;
      self.setData({
        data:self.data.dayReport
      })
    }
    
  }
})