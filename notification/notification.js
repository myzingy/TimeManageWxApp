var events = {}

// 注册通知
function on(name, self, callback) {
  var tuple = [self, callback];
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple);
  }
  else {
    events[name] = [tuple];
  }
}

// 移除通知
function remove(name, self) {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    events[name] = callbacks.filter((tuple) => {
      return tuple[0] != self;
    });
  }
}

//触发通知
function emit(name, data) {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.map((tuple) => {
      var self = tuple[0];
      var callback = tuple[1];
      callback.call(self, data);
    });
  }
}

module.exports = {
  on:on,
  remove:remove,
  emit:emit
}