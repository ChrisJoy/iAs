"use strict";
/* Toast class(customStyle): toast toastCN boxFadeIn */
var setToast = function(hm, cb) {
  var bb = document.getElementsByTagName('body')[0]; // doucumnet.body
  var toast; //boxFadeIn
  if (getExplorer() == 0) {
    toast = document.createElement("<div id='toast' class='toast rounded'>");
  } else {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.display = 'none';
    toast.style.opacity = 0;
    toast.className = "toast rounded";
  }
  toast.innerHTML = '<label class="toast-label">' + hm + '</label>';
  bb.appendChild(toast);
  toast.style.display = 'block';
  toast.style.opacity = 1;
  setTimeout(function() {
    toast.style.opacity = 0;
    setTimeout(function() {
      toast.style.display = 'none'; toast.remove();
      callback(cb);
    }, 1000);
  }, 3000);
};

var setProcess = function() {
  //jQuery("#process").attr("hidden", "");
  Dialog.toggle(document.querySelector('#process'));
};
var openProcess = function(s, t) {
  if (isNull(s))
    s = 'ball-triangle';
  if (isNull(t))
    t = 'Positioning';
  var h = '<div id="process" class="dialog" hidden>' +
    '  <div class="dialog-title">' +
    '    <img src="svg/' + s + '.svg" width="40" alt="' + t + '">' +
    '    <span class="float-right color-blue-500 process">' + t + '</span>' +
    '  </div>' +
    '</div>';
  jQuery(document.body).append(h);
  setProcess();
//jQuery("#process").removeAttr("hidden");
};

var getExplorer = function() {
  var explorer = window.navigator.userAgent;
  if (explorer.indexOf("MSIE") >= 0) {
    return 0;
  } //ie
  else if (explorer.indexOf("Firefox") >= 0) {
    return 1;
  } //firefox
  else if (explorer.indexOf("Chrome") >= 0) {
    return 2;
  } //Chrome
  else if (explorer.indexOf("Opera") >= 0) {
    return 3;
  } //Opera
  else if (explorer.indexOf("Safari") >= 0) {
    return 4;
  } //Safari
  else return 9;
};

/// 执行回调函数
var callback = function(c, o) {
  if (typeof c == "function") c(o);
};

/// 0: location; 1: address
var getPosition = function(v, t, call) {
  var urv = '';
  switch (t) {
    case 0: urv = 'location=';
      break;
    case 1: urv = 'address=';
      break;
    default: callback(call, {
        status: 1,
        msg: 'error'
      }); return;
  }
  var urll = 'http://api.map.baidu.com/geocoder/v2/?ak=91197da1fa8cfcba70918ff258ae5a47&output=json&' + urv + v + '&callback=?';
  jQuery.ajax({
    url: urll,
    type: 'POST',
    async: false,
    dataType: 'jsonp',
    success: function(data) {
      callback(call, data);
    },
    error: function() {}
  });
};

var autoPostion = function(cb) {
  /*var result = {
    success: true,
    latitude: 31.162073,
    longitude: 121.425734,
    latlng: 31.162073 + ',' + 121.425734,
    accuracy: 20,
    timestamp: 1439032210
  };
  getPosition(result.latlng, 0, function(p) {
    if (p.status === 0) {
      var city = p.result.addressComponent.district;
      if (isNull(city)) {
        city = p.result.addressComponent.city;
      }
      var addr = p.result.addressComponent.country +
        p.result.addressComponent.province +
        p.result.addressComponent.city +
        p.result.addressComponent.district;
      //p.result.location.lat p.result.location.lng p.result.formatted_address p.result.business
      jQuery('#cityList').append(
        '<li ripple><span class="item-text">' + city +
        '<span class="secondary-text">I have an action on the right</span>' +
        '</span><i class="icon-chevron-right item-action"></i></li>');
    }
  });
  if (typeof cb == "function") {
    cb(result);
  }
  return;
  */
  navigator.geolocation.getCurrentPosition(
    function(position) {
      var result = {
        success: true,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latlng: position.coords.latitude + ',' + position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      getPosition(result.latlng, 0, function(p) {
        if (p.status === 0) {
          var city = p.result.addressComponent.district;
          if (isNull(city)) {
            city = p.result.addressComponent.city;
          }
          result.city = city;

          result.addr = p.result.addressComponent.country +
            p.result.addressComponent.province +
            p.result.addressComponent.city +
            p.result.addressComponent.district;
        //p.result.location.lat p.result.location.lng p.result.formatted_address p.result.business
        }
      });
      if (typeof cb == "function") {
        cb(result);
      }
    },
    function onError(error) {
      setProcess();
      var result = {
        success: false,
        message: '[' + error.code + ']' + error.message
      };
      if (typeof cb == "function") {
        cb(result);
      }
    },
    {
      maximumAge: 3000,
      timeout: 5000,
      enableHighAccuracy: false
    });
};

var accMul = function(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
