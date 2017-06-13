var app = getApp();
var self;

Page({
  data:{
    
  },
  onLoad:function(options){self = this;
    // 生命周期函数--监听页面加载
    var item;
    if(options.data){
      item = JSON.parse(options.data);
      self.setData({
        data:item
      })
    }
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
    
  }
})