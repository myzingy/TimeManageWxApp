function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function cmp(x, y) {
  // If both x and y are null or undefined and exactly the same 
  if (x === y) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects 
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor. 
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined 
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal 
      if (x[p] === y[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal 
      if (typeof (x[p]) !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively 
      if (!cmp(x[p], y[p])) {
        return false;
      }
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined 
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

function hasEmptyProperty(obj, checkItems) {
  if ((obj && typeof obj == 'object') && (checkItems && typeof checkItems === 'object' &&
    Array == checkItems.constructor)) {
    for (var p in checkItems) {
      // allows x[ p ] to be set to undefined 
      if (obj[checkItems[p]] == '') {
        return false;
      }
    }
  } else {
    throw new TypeError('first argument must be a object and second argument must be an array.');
  }
  return true;
}

function findProvince(provinceArr, provinceId) {
  for (let i = 0; i < provinceArr.length; ++i) {
    if (provinceId == provinceArr[i].id) {
      return i;
    }
  }
}

function findCity(cityArr, cityId) {
  for (let i = 0; i < cityArr.length; ++i) {
    if (cityId == cityArr[i].id) {
      return i;
    }
  }
}

/**
 * offetHeight  滚动计算部分到顶部距离
 * scrollTop   滚动高度
 * height      每个模块的高度
 * colunm      列数
**/
function countIndex(offetHight, scrollTop, height, colunm) {
  // 单例获取屏幕宽度比
  if (!countIndex.pix) {
    try {
      let res = wx.getSystemInfoSync()
      countIndex.pix = res.windowWidth / 375
    } catch (e) {
      countIndex.pix = 1
    }
  }
  let scroll = scrollTop - offetHight * countIndex.pix
  let hei = height * countIndex.pix
  return scroll > 0 ? Math.floor(scroll / hei) * colunm : 0
}

module.exports = {
  formatTime: formatTime,
  hasEmptyProperty: hasEmptyProperty,
  findProvince: findProvince,
  findCity: findCity,
  cmp: cmp,
  countIndex: countIndex
}
