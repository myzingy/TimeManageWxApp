var self;
var app = getApp();

Page({
  data: {
    selectDataIndex:0,
    selectDataArr:[],
    startTime:'请选择',
    endTime:'请选择',
    files:[],
    startDate:'请选择',
    startHour:'请选择',
    // startHour
    startMin:'请选择'

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    self = this;
    self.setData({
      selectDataArr:app.globalData.vacationCategory
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getData:function(){
    
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
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  chooseImage:function(){
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        self.setData({
                    files: self.data.files.concat(res.tempFilePaths)
                });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
   previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    pickSelect:function(e){
      let kindStr = e.target.dataset.kind;
      if(kindStr == 'selectDataIndex'){
             this.setData({
               selectDataIndex: e.detail.value
             })
      }else if(kindStr == 'startDate'){
          this.setData({
               startDate: e.detail.value
             })
      }else if(kindStr == 'startHour'){
          this.setData({
               startHour: e.detail.value
             })
      }else if(kindStr == 'startMin'){
          this.setData({
               startMin: e.detail.value
             })
      }
   
    }
})