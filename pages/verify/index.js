import common from '../../common/common'

var app = getApp();
var self;
Page({
  data:{
    navTitleArr:['待审批','已审批','已退回','历史记录'],
    pageName: 'unverify',//当前页的名称
    pageNameArr: ['unverify', 'pended','pended','history'],
    selectDataArr:[],
    selectDataIndex:0,
    data:[],
    dataArr:[],
    pageIndex:0,
    selectMap:{},
    inputShowed: false,
        inputVal: ""
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    self = this;

    var a = [];
    for (var i = 0; i < 4; i++) {
      a.push([]);
    }
    self.setData({ dataArr: a });//初始化数据
    self.setData({
      selectDataArr:common.getAllRuleCategory()
    })

    self.getData(0); 
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成

  },
  pageClick: function (event) {//导航点击事件
    var self = this;
    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    this.getData(0);

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
            var dataArr;
            if(common.isArray(data.data.data)) dataArr = data.data.data;
            dataArr = common.promiseImageWithStyle(dataArr,['C3_542383374989','C3_543518801920'])
            dataArr.forEach(x => x.selected = false);
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
            var oldDataArr = self.data.dataArr[self.data.pageIndex];
            var dataArr;
            if(common.isArray(data.data.data)) dataArr = data.data.data;
            dataArr = common.promiseImageWithStyle(dataArr,['C3_542383374989','C3_543518801920'])
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
  self.setData({
    data:[]
  })
    
    var index = event.target.dataset.id;
    this.setData({ pageIndex: index });

    this.setData({ pageName: self.data.pageNameArr[index] });

    this.getData(0);

  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    // var index = e.target.dataset.tag;
    // var tempData;
    // if(index < self.data.data.length) tempData = self.data.data[index];
    // if(e.detail.value.length) self.data.selectMap[index] = tempData;
    // else delete self.data.selectMap[index]

    var index = e.target.dataset.tag;
     var tempData;
    if(index < self.data.data.length) tempData = self.data.data[index];
    if(e.detail.value.length) tempData.selected = true;
    else tempData.selected = false;
    
  },
  approve :function(){//审批
    // for(var i = 0 ; i < self.data.selectMap.le)
    var submitArr = [];
    for(var key in self.data.selectMap){
      var item = self.data.selectMap[key];
      var i = {
                REC_ID: item.REC_ID,
                _id: 1,
                _state: "modified",
                C3_541454801460: 'Y'
            }

            submitArr.push(i);
    }

    var param = {
    'resid': 541518842754,
    'data': submitArr
  }

    app.HttpService.saveDataArr(param,function(data){
      wx.showModal({
        title:"dddddddddd"
      })
    });

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
    },
    inputConfim:function(e){//确认搜索按钮
        var param = {
        'subresid': '',
        'cmswhere': '',
        'key': e.detail.value,
        'pageIndex':0
      }
        param.pageSize = self.data.dataArr[self.data.pageIndex].length;
      

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
     
          if (data && data.data && data.data.data) {
            var dataArr;
            if(common.isArray(data.data.data)) dataArr = data.data.data;
            dataArr = common.promiseImageWithStyle(dataArr,['C3_542383374989','C3_543518801920'])
            dataArr.forEach(x => x.selected = false);
            self.setData({ data: dataArr });
            self.data.dataArr[self.data.pageIndex] = dataArr;

            if(dataArr.length < param.pageSize) self.setData({ noMore: true });
            else self.setData({ noMore: false });
          } else {
            self.setData({ data: [] }); 
            self.setData({ noMore: true });
          }


      })
    },
    gotoUnverifyDetailPage:function(e){//退回操作界面
      // pages/verify/unverifyDetail/unverifyDetail
      wx.navigateTo({
        url: '/pages/index/applyDetail/applyDetail?data='+JSON.stringify(e.target.dataset.item)+'&willRefuse=true',
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
    },
    selectAllChange:function(e){//全选
        for(var i = 0 ; i < self.data.data.length ; i ++){
          // self.data.selectMap[i] = self.data.data[i];
          if(e.detail.value.length)self.data.data[i].selected = true;
          else self.data.data[i].selected = false;
        }
        self.setData({
          data:self.data.data
        })
      
    }
})