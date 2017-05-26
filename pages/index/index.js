import applying from '/applying/applying'
import common from '/common'

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
    pageNameArr: ['applying', 'pended','refuse','history'],
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
  isLaunch: function () {
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
      title: '加载中'
    })

     var param = {
        'subresid': '',
        'cmswhere': '',
        'key': ''
      }

    if (self.data.pageIndex == 0) {//申请中
       param.resid = 541502768110
    } else if (self.data.pageIndex == 1) {//已审核
       param.resid = 541518522808
    }else if (self.data.pageIndex == 2) {//已退回
      //  param.resid =  543000345781
      param.resid = 541502768110
    }else if (self.data.pageIndex == 3) {//历史记录
       param.resid = 541518678060
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        let dataArr = Array.from(data.data.data);
        self.setData({ data: dataArr });
        self.data.dataArr[self.data.pageIndex] = dataArr;
      } else self.setData({ data: [] });
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
  gotoAddApply: function () {
    applying.gotoAddApply();
  },
  gotoApplyDetail: function (e) {
    wx.navigateTo({
      url: '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(e.target.dataset.item),
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
  },
  attachShow: function (e) {//附件
    let item = e.target.dataset.item;
    let urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
    urls = urls.filter(x => x != null);
    wx.previewImage({
      urls: urls, // 需要预览的图片http链接列表
      success: function () {

      },
      fail: function () {

      }
    })
  },
  draftModify:function(e){
    wx.navigateTo({
      url: '/pages/index/addApply/addApply?data=' + JSON.stringify(e.target.dataset.item),
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
  },
  submit:function(e){//提交
    let tag = e.target.dataset.tag;
    self.data.data[tag].C3_541449538456 = 'Y';
    let item = self.data.data[tag];
     common.saveAndSubmit(item,function(){
        self.setData({
          data:self.data.data
        })
     },function(){
        self.data.data[tag].C3_541449538456 = 'N';
     });
  },
  draftModifySubmit:function(e){
    wx.navigateTo({
      url: '/pages/index/fixSubmit/fixSubmit?data=' + JSON.stringify(e.target.dataset.item),
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
});
