import common from '../../common/common'

var app = getApp();
var self;
Page({
  data: {
    navTitle: {
      navTitleArr: ['待审批', '已审批', '已退回', '历史记录'],
      activeIndex: 0,
      navWidth: '25%'
    },
    pageName: 'unverify',//当前页的名称
    pageNameArr: ['unverify', 'pended', 'pended', 'history'],
    selectDataArr: [],
    selectDataIndex: 0,
    allSelectDataIndex: [0, 0, 0, 0],
    data: [],
    dataArr: [],
    pageIndex: 0,
    inputShowed: false,
    inputVal: "",
    allInputVal:["","","",""],
    noMore: false,
    fixIndex: null,

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;

    self.initData();

    self.getData(0);

    //退回通知
    app.notification.on("dataReoperation", self, function (data) {
      let selectDataArr = self.data.dataArr[self.data.pageIndex];
      selectDataArr.splice(self.data.fixIndex, 1);

      let applyingDataArr = self.data.dataArr[2];
      applyingDataArr.unshift(data);
      self.setData({
        data: selectDataArr
      })

    });
  },

  //数据初始化
  initData: function () {
    var a = [];
    for (var i = 0; i < 4; i++) {
      a.push([]);
    }
    self.setData({
      dataArr: a,
      selectDataArr: common.getAllRuleCategory()
    })
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },

  //导航点击事件
  pageClick: function (event) {

    var index = event.target.dataset.id;
    self.setData({
      data: [],
      selectDataIndex: self.data.allSelectDataIndex[index],
      inputVal: self.data.allInputVal[index]
    })

    self.data.navTitle.activeIndex = index;

    this.setData({
      pageIndex: index,
      pageName: self.data.pageNameArr[index],
      navTitle: this.data.navTitle
    })

    if (self.data.dataArr[self.data.pageIndex].length) {
      self.setData({ data: self.data.dataArr[self.data.pageIndex] });
      self.setData({ noMore: false });

    } else self.getData(0);
  },

  //获取数据
  getData: function (index) {

    wx.showLoading({
      title: '加载中'
    })
    var keyStr = self.data.selectDataArr[self.data.selectDataIndex];
    keyStr = keyStr == '全部' ? '' : "C3_533398158705 ='" + keyStr + "'"
    var param = {
      'subresid': '',
      'cmswhere':  keyStr,
      'key': self.data.inputVal ? self.data.inputVal : ''
    }

    param.pageSize = 3;
    if (!index) {//刷新
      param.pageIndex = 0;

    } else {//加载
      param.pageIndex = Math.ceil(self.data.dataArr[self.data.pageIndex].length / param.pageSize);
    }

    if (self.data.pageIndex == 0) {//待审批
      param.resid = 541518842754
    } else if (self.data.pageIndex == 1) {//已审批
      param.resid = 541518986783
    } else if (self.data.pageIndex == 2) {//已退回
      param.resid = 541519417864
    } else if (self.data.pageIndex == 3) {//历史记录
      param.resid = 541520707421
    }
    app.HttpService.getApplyData(param, function (data) {
      if (data && data.data && data.data.data) {
        var dataArr = data.data.data;
        dataArr = common.dealNull(dataArr);

        if (dataArr.length < param.pageSize) self.setData({ noMore: true });
        else self.setData({ noMore: false });

        dataArr = common.promiseImageWithStyle(dataArr, ['C3_542383374989', 'C3_543518801920'])
        dataArr.forEach(x => x.selected = false);

       
  

        if (index) {//加载
          // var oldDataArr = self.data.data;
          // oldDataArr = oldDataArr.concat(dataArr);
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

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    self.getData(0);
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    if (!self.data.noMore) self.getData(1);
  },

  //类型筛选
  categoryChange: function (e) {
    self.setData({
      selectDataIndex: e.detail.value
    })
    self.data.allSelectDataIndex[self.data.pageIndex] = parseInt(e.detail.value)
    self.getData(0);

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    self.data.allInputVal[self.data.pageIndex] = e.detail.value;
  },
  inputConfim: function (e) {//确认搜索按钮
    this.setData({
      inputVal: e.detail.value
    });
    self.getData(0)
  },
  gotoApplyDetail: function (e) {//详情
    let tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    let item = self.data.data[tag];
    wx.navigateTo({
      url: '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(item) + "&willRefuse=false"
    })
  },
  attachShow: function (e) {//附件
    var item = e.currentTarget.dataset.item != undefined ? e.currentTarget.dataset.item : e.target.dataset.item;//e.target.dataset.item;
    var urls = [item.C3_541450276993, item.C3_545771156108, item.C3_545771157350, item.C3_545771158420];
    urls = urls.filter(x => x != null);
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
  },


  //################待审批
  //退回操作界面
  gotoUnverifyDetailPage: function (e) {
    if(self.data.pageIndex) return;
    let tag = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    let item = self.data.data[tag];
    self.data.fixIndex = tag;
    wx.navigateTo({
      url: '/pages/index/applyDetail/applyDetail?data=' + JSON.stringify(item) + '&willRefuse=true'
    })
  },

  //全选
  selectAllChange: function (e) {
    var tmpDataArr = self.data.dataArr[self.data.pageIndex];
    for (var i = 0; i < tmpDataArr.length; i++) {
      if (e.detail.value.length) tmpDataArr[i].selected = true;
      else tmpDataArr[i].selected = false;
    }
    self.setData({
      data: tmpDataArr
    })
  },

  //审批
  approve: function () {
    // for(var i = 0 ; i < self.data.selectMap.le)
    var submitArr = [];
    self.data.data.forEach(function (item) {
      if (item.selected) {
        var i = {
          REC_ID: item.REC_ID,
          _id: 1,
          _state: "modified",
          C3_541454801460: 'Y'
        };

        submitArr.push(i);
      }
    })
    if (!submitArr.length){
       common.customModal("请勾选至少一个事件");
       return;
    }

    var param = {
      'resid': 541518842754,
      'data': submitArr
    }
    common.customLoading();
    app.HttpService.saveDataArr(param, function (data) {
      let pendDataArr = self.data.dataArr[self.data.pageIndex];
      pendDataArr = pendDataArr.filter(x => x.selected != true);
      self.setData({
        data: pendDataArr
      })

      let pendedDataArr = self.data.dataArr[1];
      pendedDataArr = data.data.data.concat(pendedDataArr);

      wx.hideLoading();
      common.customModal('审批成功');
    },function(){
      common.customModal('审批失败');
      wx.hideLoading();
    });

  },

  checkboxChange: function (e) {
    var index = e.currentTarget.dataset.tag != undefined ? e.currentTarget.dataset.tag : e.target.dataset.tag;
    var tmpDataArr = self.data.dataArr[self.data.pageIndex];
    var tempData;
    if (index < tmpDataArr.length) tempData = tmpDataArr[index];
    if (e.detail.value.length) tempData.selected = true;
    else tempData.selected = false;

    self.setData({
      data: tmpDataArr
    })

  }
})