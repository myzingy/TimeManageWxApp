import common from "../index/common"

var app = getApp();
var self;
Page({
  data:{
    navTitleArr:['待审批','已审批','已退回','历史记录'],
    pageName: 'unverify',//当前页的名称
    pageNameArr: ['unverify', 'pended','refuse','history'],
    selectDataArr:[],
    selectDataIndex:0,
    data:[],
    dataArr:[],
    pageIndex:0
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    self = this;
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成


    self.setData({
      selectDataArr:common.getAllRuleCategory()
    })

    self.getData(0); 
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
      if(!index){//刷新
        param.pageIndex = 0;
        
      }else{//加载
        param.pageIndex = self.data.dataArr[self.data.pageIndex].length;
      }

    if (self.data.pageIndex == 0) {//待审批
       param.resid = 541518842754
    } else if (self.data.pageIndex == 1) {//已审批
       param.resid = 541518986783
    }else if (self.data.pageIndex == 2) {//已退回
       param.resid =  541519417864
    }else if (self.data.pageIndex == 3) {//历史记录
       param.resid = 541520707421
    }
    app.HttpService.getApplyData(param, function (data) {
      if(!index){//刷新
          if (data && data.data && data.data.data) {
            let dataArr = Array.from(data.data.data);
            dataArr.forEach(x => x.selected = 'N');
            self.setData({ data: dataArr });
            self.data.dataArr[self.data.pageIndex] = dataArr;

            if(dataArr.length < param.pageSize) self.setData({ noMore: true });
            else self.setData({ noMore: false });
          } else {
            self.setData({ data: [] }); 
            self.setData({ noMore: true });
          }


      }else{//加载
          if (data && data.data && data.data.data) {
            let oldDataArr = self.data.dataArr[self.data.pageIndex];
            let dataArr = Array.from(data.data.data); 
            dataArr.forEach(x => x.selected = 'N');
            oldDataArr.concat(dataArr);
            self.setData({ data: oldDataArr });
            self.data.dataArr[self.data.pageIndex] = oldDataArr;

            if(dataArr.length < param.pageSize) self.setData({ noMore: true });
            else self.setData({ noMore: false });
          } else {
            self.setData({ noMore: true });
          }
      }


      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, function () {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });

  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  categoryChange:function(e){//类型筛选
      self.setData({
        selectDataIndex:e.detail.value
      })
      var conditionStr = self.data.selectDataArr[self.data.selectDataIndex];
      var conditionData = self.data.dataArr[self.data.pageIndex];
      if(conditionStr != '全部') conditionData = Array.from(conditionData).filter( x => x.C3_533398158705 == conditionStr)
      
      self.setData({
          data:conditionData
      })

  },
  pageClick: function (event) {//导航点击事件
    var self = this;
    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    this.getData(0);

  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if(e.detail.value == 'Y') e.detail.value = 'N'
    else e.detail.value = 'Y'
  }
})