/*
 * jie.cai
 * 2015-08-03 0.0.1 Create 'Basic Weather'
 * Next: 1、Local Storage(V)；
 * 		 2、Location；
 * 		 3、Custom Add Location；
 * */
(function(window, undefined) {
  function forPosition() {
    this.init();
  }
  var result = {
      success: false,
      message: ''
    },
    keyLocationList = "keyLocationList";

  forPosition.prototype = {
    init: function() {},
    setStorage: function(v) {
      var s = JSON.stringify(v);
      localStorage.setItem(keyLocationList, s);
    },
    delItem: function(k, cb) {
      var data = this.getList();
      for (var i in data) {
        if (data[i].key == k) {
          delete data[i];
          break;
        }
      }
      this.setStorage(data);
      result = {
        success: true
      };
      if (typeof cb == "function") {
        cb(result);
      }
    },
    enableList: function(k, cb) {
      var data = this.getList();
      for (var i in data) {
        data[i].made = data[i].key == k;
      }
      result = {
        success: true
      };
      this.setStorage(data);
      if (typeof cb == "function") {
        cb(result);
      }
    },
    saveList: function(k, v, d) {
      var data = this.getList(),
        index = 0,
        isAdd = true;
      for (var i in data) {
        if (data[i].key === k) {
          isAdd = false;
          data[i].value = v;
          data[i].desc = d;
        }
        index++;
      }
      if (isAdd) {
        console.log('Index:' + index);
        if (index < 1)
          index = 0;
        data[index] = {
          key: k,
          value: v,
          desc: d,
          made: false
        };
      }
      this.setStorage(data);
    },
    getList: function() {
      //var v = plus.storage.getItem(keyLocationList);
      var v = localStorage.getItem(keyLocationList);
      var s = JSON.parse(v) || {};
      return s;
    },
    autoPosition: function(c) {
      //通过百度sdk来获取经纬度,并且alert出经纬度信息
      var noop = function() {
        if (typeof c == "function") {
          c(result);
        } //执行回调函数
      }
      window.locationService.getCurrentPosition(function(pos) {
        result = {
          success: true,
          latitude: p.latitude, // 纬度
          longitude: p.longitude // 经度
        };
        setToast(JSON.stringify(pos))
        window.locationService.stop(noop, noop)
      }, function(e) {
        result = {
          success: false,
          message: e.message
        };
        window.locationService.stop(noop, noop)
      });
    },
    manualPosition: function(addr, c) {
      this.getPosition(addr);
      if (typeof c == "function") {
        c(result);
      } //执行回调函数
    },
    getAddress: function(ll) {
      if (isNull(ll)) {
        result = {
          success: false,
          message: "Latitude and longitude(ll) can not be empty"
        };
        return;
      }
      var url = 'http://api.map.baidu.com/geocoder/v2/?ak=91197da1fa8cfcba70918ff258ae5a47&output=json&location=' + ll;
      jQuery.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: 'post',
        timeout: 10000,
        success: function(p) {
          if (p.status === 0) {
            result = {
              success: true,
              latitude: p.result.location.lat,
              longitude: p.result.location.lng,
              address: p.result.formatted_address,
              business: p.result.business,
              country: p.result.addressComponent.country,
              province: p.result.addressComponent.province,
              city: p.result.addressComponent.city,
              district: p.result.addressComponent.district,
              street: p.result.addressComponent.street
            };
          }
          else
            result = {
              success: false,
              message: p.message,
              status: p.status
            };
        },
        error: function(xhr, type, errorThrown) {
          result = {
            success: false,
            message: type,
            status: xhr.status
          };
        }
      });
      if (result.success) { // 加入缓存
        var d = result.country + result.province + result.city + result.district,
          v = isNull(result.district) ? result.city : result.district;
        this.saveList(ll, v, d);
      }
    },
    getPosition: function(addr) {
      if (isNull(addr)) {
        result = {
          success: false,
          message: "Address(addr) can not be empty"
        };
        return;
      }
      var url = 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=91197da1fa8cfcba70918ff258ae5a47&address=' + addr;
      Zepto.ajax({
        url: url,
        async: false,
        dataType: 'json',
        type: 'post',
        timeout: 10000,
        success: function(p) {
          if (p.status === 0) {
            result = {
              success: true,
              latitude: p.result.location.lat,
              longitude: p.result.location.lng
            };
          } else
            result = {
              success: false,
              message: p.msg,
              status: p.status
            };
        },
        error: function(xhr, type, errorThrown) {
          console.log("Addr error(1): " + JSON.stringify(xhr));
          console.log("Addr error(2): " + JSON.stringify(type));
          console.log("Addr error(3): " + JSON.stringify(errorThrown));
          result = {
            success: false,
            message: type,
            status: xhr.status
          };
        }
      });
      if (result.success) this.getAddress(result.latitude + ',' + result.longitude);
    }
  };

  var obj = new forPosition();
  window.enableCachePosition = function(k, cb) {
    obj.enableList.call(obj, k, cb);
  }
  window.delCachePosition = function(k, cb) {
    obj.delItem.call(obj, k, cb);
  }
  window.getCachePosition = function() {
    return obj.getList.call()
  }
  window.autoPosition = function(cb) {
    obj.autoPosition.call(obj, cb);
  };
  window.manualPosition = function(addr, cb) {
    obj.manualPosition.call(obj, addr, cb);
  };
})(window);
