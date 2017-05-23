// 发起get请求
const path = {
  ads: '/ads',
  config: '/config',
  login: '/public/login',
  signUp: '/public/register',
  resetPassword: '/public/resetPassword',
  sendSmsCaptcha: '/public/sendSmsCaptcha',
  product: '/product',
  catagory: '/product/category',
  payment: '/payment',
  cart: '/cart',
  order: '/order',
  contact: '/contact',
  wxOauth: '/public/x_oauth',
  wxpay: '/pay/x_wxpay',
  balance: '/pay/balance',
  user: '/user',
  consignee: '/contact',
  location: '/location'
}

function getRequest(url, data, doSuccess, doFail, doComplete) {
  wx.request({
    url: getApp().Config.basePath + url,
    data: data,
    method: 'GET',
    header: { Authorization: wx.getStorageSync('token') }, // 设置请求的 header
    success: function (res) {
      if (res.statusCode == 401) {
        getApp().globalData.userInfo = null;
        wx.removeStorageSync('token');
        wx.redirectTo({
          url: '/pages/public/login'
        });
      } else if (res.statusCode == 404) {
        wx.showToast({
          title: '请求出错',
          icon: 'loading'
        });
      } else {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

// 发起post请求
function postRequest(url, data, doSuccess, doFail, doComplete) {
  wx.request({
    url: getApp().Config.basePath + url,
    data: data,
    method: 'POST',
    header: { Authorization: wx.getStorageSync('token') }, // 设置请求的 header
    success: function (res) {
      if (res.statusCode == 401) {
        wx.showModal({
          title: '提示',
          content: '连接超时,请重新登录',
          showCancel: !1,
          success: function () {
            getApp().globalData.userInfo = null;
            wx.removeStorageSync('token');
            wx.redirectTo({
              url: '/pages/public/login'
            });
          }
        });

      } else if (res.statusCode == 404 || res.statusCode == 500) {
        wx.showToast({
          title: '请求出错',
          icon: 'loading'
        });
      } else {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      }
    },
    fail: function () {
      if (typeof doFail == "function") {
        doFail();
      } else {
        wx.showModal({
          title: '提示',
          content: '系统繁忙, 请稍后再试',
          showCancel: !1
        });
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

// 获取配置
function getConfig(doSuccess) {
  getRequest(path.config, {}, doSuccess);
}

// 获取商品列表
function getProductList(params, doSuccess, doFail) {
  getRequest(path.product, params, doSuccess, doFail);
}

// 获取商品详情
function getProductDetail(id, doSuccess, doFail) {
  getRequest(`${path.product}/${id}`, {}, doSuccess, doFail);
}

// 获取商品分类列表
function getProductCatagoryList(params, doSuccess, doFail) {
  getRequest(path.catagory, params, doSuccess, doFail);
}

// 获取商品分类详情
function getProductCatagoryDetail(id, doSuccess, doFail) {
  getRequest(`${path.catagory}/${id}`, {}, doSuccess, doFail);
}

// 获取广告列表
function getAdsList(params, doSuccess, doFail) {
  getRequest(path.ads, params, doSuccess, doFail);
}

// 获取广告详情
function getAdsDetail(id, doSuccess, doFail) {
  getRequest(`${path.ads}/detail?id=${id}`, {}, doSuccess, doFail);
}

// 获取支付方式
function getPayments(doSuccess, doFail) {
  getRequest(path.payment, {}, doSuccess, doFail);
}

// 重置密码
function resetPassword(params, doSuccess, doFail) {
  postRequest(path.resetPassword, params, doSuccess, doFail);
}

// 发送验证码
function sendSmsCaptcha(params, doSuccess, doFail) {
  postRequest(path.sendSmsCaptcha, params, doSuccess, doFail);
}

// 微信授权登录
function wxOauth(params, doSuccess, doFail) {
  postRequest(path.wxOauth, params, doSuccess, doFail);
}

// 微信支付
function wxpay(order_id, params, doSuccess, doFail) {
  getRequest(`${path.wxpay}/${order_id}`, params, doSuccess, doFail);
}

// 余额支付
function balance(order_id, doSuccess, doFail) {
  getRequest(`${path.balance}/${order_id}`, {}, doSuccess, doFail);
}

// 获取订单列表
function getOrderList(params, doSuccess, doFail) {
  getRequest(path.order, params, doSuccess, doFail);
}

// 获取订单详情
function getOrderDetail(orderId, doSuccess, doFail) {
  getRequest(`${path.order}/${orderId}`, {}, doSuccess, doFail);
}

// 提交订单信息
function saveOrder(params, doSuccess, doFail) {
  postRequest(path.order, params, doSuccess, doFail);
}

// 取消订单
function cancelOrder(orderId, doSuccess, doFail) {
  postRequest(path.order, {id: orderId, status: -1}, doSuccess, doFail);
}

// 申请退款
function refundOrder(orderId, doSuccess, doFail) {
  postRequest(path.order, {id: orderId, status: -2}, doSuccess, doFail);
}

// 获取用户信息
function getUserInfo(doSuccess, doFail) {
  getRequest(path.user, {}, doSuccess, doFail);
}

// 获取收货人列表
function getConsignees(doSuccess, doFail) {
  getRequest(path.consignee, {}, doSuccess, doFail);
}

// 获取收货人信息
function getConsignee(id, doSuccess, doFail) {
  getRequest(`${path.consignee}/${id}`, {}, doSuccess, doFail);
}

// 保存收货人信息
function saveConsignee(params, doSuccess, doFail) {
  postRequest(path.consignee, params, doSuccess, doFail);
}

// 获取地区列表信息
function getRegion(doSuccess, doFail) {
  getRequest(path.location, {}, doSuccess, doFail);
}

// 用户登录
function login(params, doSuccess, doFail) {
  postRequest(path.login, params, doSuccess, doFail);
}

// 用户注册
function signUp(params, doSuccess, doFail) {
  postRequest(path.signUp, params, doSuccess, doFail);
}

module.exports = {
  getConfig: getConfig,
  getProductList: getProductList,
  getProductDetail: getProductDetail,
  getProductCatagoryList: getProductCatagoryList,
  getProductCatagoryDetail: getProductCatagoryDetail,
  getAdsList: getAdsList,
  getAdsDetail: getAdsDetail,
  getPayments: getPayments,
  resetPassword: resetPassword,
  sendSmsCaptcha: sendSmsCaptcha,
  wxOauth: wxOauth,
  wxpay: wxpay,
  balance: balance,
  getOrderList: getOrderList,
  getOrderDetail: getOrderDetail,
  cancelOrder: cancelOrder,
  refundOrder: refundOrder,
  saveOrder: saveOrder,
  getUserInfo: getUserInfo,
  getConsignees: getConsignees,
  getConsignee: getConsignee,
  saveConsignee: saveConsignee,
  getRegion: getRegion,
  login: login,
  signUp: signUp
}