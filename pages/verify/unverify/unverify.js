var app = getApp();
var self;
Page({
  data:{
    navTitleArr:['待审批','已审批','已退回','历史记录'],
    pageName: 'applying',//当前页的名称
    pageNameArr: ['applying', 'pended','refuse','history'],
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    self = this;
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成


     
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
  }
})