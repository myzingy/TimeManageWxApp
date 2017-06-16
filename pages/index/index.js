import applying from '/applying/applying'
import common from '../../common/common'

//获取应用实例
var app = getApp();
var self;
Page({
  data: {
    navTitle: {
      navTitleArr: ['申请中', '已审核', '已退回', '历史记录'],
      activeIndex: 0,
      navWidth: '25%'
    },
    userInfo: {},
    selectDataArr: [],
    selectDataIndex: 0,//类型当前索引
    pageIndex: 0,//当前第几页
    pageName: 'applying',//当前页的名称
    pageNameArr: ['applying', 'pended', 'refuse', 'history'],
    data: [],//当前页的数据
    dataArr: [],//所有页的数据
    noMore: false,
    fixIndex: null,
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

    //修改数据
    app.notification.on("dataFix", self, function (data) {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr[self.data.fixIndex] = data;
      self.setData({
        data: selectDataArr
      })
    })

    //添加数据
    app.notification.on("dataAdd", self, function (data) {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr.unshift(data);
      self.setData({
        data: selectDataArr
      })
    })

    //撤销数据
    app.notification.on("dataCancel", self, function () {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr.splice(self.data.fixIndex, 1);
      self.setData({
        data: selectDataArr
      })

    });

    //已退回提交
    app.notification.on("dataReoperation", self, function (data) {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr.splice(self.data.fixIndex, 1);

      let applyingDataArr = self.data.dataArr[0];
      applyingDataArr.unshift(data);
      self.setData({
        data: selectDataArr
      })

    });

  },
  onReady: function () {
    if (!app.globalData.userInfo) { return }
    self.setData({
      selectDataArr: common.getAllRuleCategory()//获取请假类别
    })

    self.getData(0);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    self.getData(0);
  },
  //上拉加载
  onReachBottom: function () {
    if (!self.data.noMore) self.getData(1);
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

  /*----------获取数据--------------- */
  getData: function (index) {

    wx.showLoading({
      title: '加载中'
    })

    var keyStr;
    if (self.data.selectDataIndex < self.data.selectDataArr.length) {
      keyStr = self.data.selectDataArr[self.data.selectDataIndex];
      keyStr = keyStr == '全部' ? '' : keyStr;
    }

    var param = {
      'subresid': '',
      'cmswhere': '',
      'key': keyStr
    }


    param.pageSize = 10;
    if (!index) {//刷新
      param.pageIndex = 0;

    } else {//加载
      param.pageIndex = self.data.dataArr[self.data.pageIndex].length;
    }

    if (self.data.pageIndex == 0) {//申请中
      param.resid = 541502768110
    } else if (self.data.pageIndex == 1) {//已审核
      param.resid = 541518522808
    } else if (self.data.pageIndex == 2) {//已退回
      param.resid = 543000345781
      // if(app.debug) param.resid = 541502768110
    } else if (self.data.pageIndex == 3) {//历史记录
      param.resid = 541518678060
    }
    app.HttpService.getApplyData(param, function (data) {

      if (data && data.data && data.data.data) {
        var dataArr = data.data.data;

        if (dataArr.length < param.pageSize) self.setData({ noMore: true });
        else self.setData({ noMore: false });

        dataArr = common.promiseImageWithStyle(dataArr, ['C3_542383374989', 'C3_543518801920'])

        if (index == 1) {//加载
          var oldDataArr = self.data.dataArr[self.data.pageIndex];
          oldDataArr = oldDataArr.concat(dataArr);
          dataArr = oldDataArr;
        }

        self.setData({ data: dataArr });
        self.data.dataArr[self.data.pageIndex] = dataArr;


      } else {
        self.setData({ data: [] });
        self.setData({ noMore: true });
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });

  },


  /*---------事件类-------------*/
  bindPickerChange: function (e) {//picker 选择事件
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.setData({
      selectDataIndex: e.detail.value
    })
  },
  pageClick: function (event) {//导航点击事件
    var index = event.target.dataset.id;
    self.setData({ pageIndex: index, data: [], selectDataIndex:0});

    //设置page的模板
    self.setData({ pageName: self.data.pageNameArr[index] });

    //切换激活导航的样式
    self.data.navTitle.activeIndex = index;
    self.setData({
      navTitle: self.data.navTitle
    })
    //内存缓存数据提取
    if (self.data.dataArr[self.data.pageIndex].length) {
      self.setData({ data: self.data.dataArr[self.data.pageIndex] });

    } else self.getData(0);

  },
  gotoAddApply: function () {//添加请假等
    applying.gotoAddApply();
  },
  gotoApplyDetail: function (e) {//详情
    let tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    self.data.fixIndex = tag;
    let item = self.data.data[tag];
    let urlStr = '';
    if (!self.data.pageIndex) {
      urlStr = '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(item) + "&willCancel=true"
    } else {
      urlStr = '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(item)
    }
    wx.navigateTo({
      url: urlStr
    })
  },
  attachShow: function (e) {//附件
    var item = e.currentTarget.dataset.item != undefined ? e.currentTarget.dataset.item : e.target.dataset.item;
    var urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
    urls = urls.filter(function (x) { return x != null });
    console.log("=========>urls" + urls);
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
  },
  draftModify: function (e) {//修改
    var tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    var item = self.data.data[tag];
    self.data.fixIndex = tag;//记录点击修改的记录的索引

    wx.navigateTo({
      url: '/pages/index/addApply/addApply?data=' + JSON.stringify(item)
    })
  },
  submit: function (e) {//提交
    var tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    applying.submit(e, self, function (resData) {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr[tag] = resData;
      self.data.data[tag] = resData;
      self.setData({
        data: self.data.data
      })
    });
  },
  draftModifySubmit: function (e) {//修改并提交
    var tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    var item = self.data.data[tag];
    self.data.fixIndex = tag;
    wx.navigateTo({
      url: '/pages/index/fixSubmit/fixSubmit?data=' + JSON.stringify(item)
    })
  },
  categoryChange: function (e) {//类型筛选
    self.setData({
      selectDataIndex: e.detail.value
    })
    var conditionStr = self.data.selectDataArr[self.data.selectDataIndex];
    var conditionData = self.data.dataArr[self.data.pageIndex];
    if (conditionStr != '全部') conditionData = Array.from(conditionData).filter(x => x.C3_533398158705 == conditionStr)

    self.setData({
      data: conditionData
    })

  },
  /*---------通知事件------------ */
  onUnload: function () {
    // 移除通知
    app.notification.remove("dataFix", self);
    app.notification.remove("dataAdd", self);
  }
});
