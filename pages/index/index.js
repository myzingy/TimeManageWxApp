import applying from '/applying/applying'

//获取应用实例
var app = getApp();
var self;
Page({
  data: {
    userInfo: {},
    selectDataArr: ['全部', '申请中'],
    selectDataIndex: 0,
    pageIndex: 0,//当前第几页
    pageName: 'applying',//当前页的名称
    pageNameArr: ['applying', 'pended'],
    data: [],//当前页的数据
    dataArr: [],//所有页的数据
    loadMore: false,
    noMore: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    self = this;
    var a = [];
    for (var i = 0; i < 4; i++) {
      a.push([]);
    }
    self.setData({ dataArr: a });//初始化数据
    self.isLaunch();//登录
  },
  isLaunch:function(){
    if (!app.globalData.userInfo) {//判断是否登录
      wx.redirectTo({
        url: '/pages/login/login',
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
  },
  onShow: function () {
    
  },
  onReady: function () {
    self.getData();
  },
  onHide: function () {

  },
  getData: function () {//获取数据
    var self = this;
   

    if (self.data.dataArr[self.data.pageIndex].length) {//内存缓存数据提取
      self.setData({ data: self.data.dataArr[self.data.pageIndex] });
      return;
    }

    wx.showLoading({
      title:'加载中'
    })

    if(self.data.pageIndex == 0){//申请中
         var param = {
      'resid': 541502768110,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    }else if(self.data.pageIndex == 1){//已审核
       var param = {
      'resid': 541518522808,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    }
    app.HttpService.getApplyData(param, function (data) {
      if(data && data.data &&data.data.data){
        let dataArr = Array.from(data.data.data);
         self.setData({ data: dataArr });
         self.data.dataArr[self.data.pageIndex] = dataArr;
      }else self.setData({data:[]});
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
    
  },
  bindPickerChange: function (e) {//picker 选择事件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectDataIndex: e.detail.value
    })
  },
  pageClick: function (event) {//导航点击事件
    var self = this;
    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    this.getData();

  },
  onPullDownRefresh: function () {
    self.getData();
  },
  onReachBottom: function () {
    if (!self.data.loadMore) self.loadMore();
  },
  loadMore: function () {
    if (self.data.loadMore) return;
    console.log('loadmore');

    self.setData({ loadMore: true });

    var a = self.data.data;
    var l = self.data.data.length;
    if (l > 150) {
      self.setData({ noMore: true });
      return;
    }
    for (var i = l; i < 20 + l; i++)  a.push(i);
    setTimeout(function () {
      self.setData({ data: a });
      self.setData({ loadMore: false });
    }, 3000)


  },
  scrolling: function (event) {
    console.log('scroll');
  },
  gotoAddApply:function(){
    applying.gotoAddApply();
  },
  gotoApplyDetail:function(e){
    wx.navigateTo({
      url: '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(e.target.dataset.item),
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  }
});
