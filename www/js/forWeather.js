/*
 * jie.cai
 * 2015-07-01 0.0.0701 Create 'Basic Query'
 * 2015-07-02 0.0.0702 Update 'Pull-down refresh'
 * Doc: https://developer.forecast.io/docs/v2
 * Next: 1、Local Storage(V)；
 * 		 2、Location；
 * 		 3、Custom Add Location；
 * */
(function(window, undefined) {
  function forWeather() {
    this.init();
  }

  var result = {
      message: '',
      state: 0,
      success: false
    },
    keyLocationList = "keyLocationList",
    keyLocationCurrent = "keyLocationCurrent";

  forWeather.prototype = {
    init: function() {},
    getWeek: function(utime) {
      var ttime = new Date(utime * 1000);
      //var Week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var Week = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
      return Week[ttime.getDay()];
      Week = ['日', '一', '二', '三', '四', '五', '六']; //星期
      return '周' + Week[ttime.getDay()];
    },
    getWind: function(v) {
      if (v > 0 && v < 45)
        v = 15; else {
        if (v > 45 && v < 90)
          v = 60; else {
          if (v > 90 && v < 135)
            v = 105; else {
            if (v > 135 && v < 180)
              v = 150; else {
              if (v > 180 && v < 225)
                v = 195; else {
                if (v > 225 && v < 270)
                  v = 240; else {
                  if (v > 270 && v < 315)
                    v = 285; else {
                    if (v > 315 && v < 360)
                      v = 330;
                  }
                }
              }
            }
          }
        }
      }
      switch (v) {
        case 0: case 360: v = '北风';
          break;
        case 15: v = '北风偏东';
          break;
        case 30: v = '北风偏东';
          break;
        case 45: v = '东北风';
          break;
        case 60: v = '东风偏北';
          break;
        case 75: v = '东风偏北';
          break;
        case 90: v = '东风';
          break;
        case 105: v = '东风偏南';
          break;
        case 120: v = '东风偏南';
          break;
        case 135: v = '东南风';
          break;
        case 150: v = '南风偏东';
          break;
        case 165: v = '南风偏东';
          break;
        case 180: v = '南风';
          break;
        case 195: v = '南风偏西';
          break;
        case 210: v = '南风偏西';
          break;
        case 225: v = '西南风';
          break;
        case 240: v = '西风偏南';
          break;
        case 255: v = '西风偏南';
          break;
        case 270: v = '西风';
          break;
        case 285: v = '西风偏北';
          break;
        case 300: v = '西风偏北';
          break;
        case 315: v = '西北风';
          break;
        case 330: v = '北风偏西';
          break;
        case 345: v = '北风偏西';
          break;
      }
      return v;
    },
    convertIcon: function(v) {
      var r = v;
      switch (v) {
        case 'clear-day': r = 'wi wi-day-sunny';
          break;
        case 'clear-night': r = 'wi wi-night-clear';
          break;
        case 'rain': r = 'wi wi-rain';
          break;
        case 'snow': r = 'wi wi-snow';
          break;
        case 'sleet': r = 'wi wi-sleet';
          break;
        case 'wind': r = 'wi wi-windy';
          break;
        case 'fog': r = 'wi wi-fog';
          break;
        case 'cloudy': r = 'wi wi-cloudy';
          break;
        case 'partly-cloudy-day': r = 'wi wi-day-cloudy';
          break;
        case 'partly-cloudy-night': r = 'wi wi-night-partly-cloudy';
          break;
        case 'hail': r = 'wi wi-hail';
          break;
        case 'thunderstorm': r = 'wi wi-thunderstorm';
          break;
        case 'tornado': r = 'wi wi-tornado';
          break;
      }
      return r;
    },
    getTime: function(utime) {
      var ttime = this.getFullTime(utime);
      var t = '',
        hh = ttime.getHours(),
        mm = ttime.getMinutes();
      t = hh > 9 ? hh.toString() : '0' + hh;
      t = t + ':' + (mm > 9 ? mm.toString() : '0' + mm);
      return t;
    },
    getFullTime: function(utime) {
      return new Date(utime * 1000);
    },
    getFormatTime: function(utime) {
      var t = this.getFullTime(utime);
      return t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate() +
        ' ' + t.getHours() + ':' + t.getMinutes(); // + ':' + t.getSeconds();
    },
    processData: function(data) {
      if (isNull(data)) return {};
      var v = localStorage.getItem(keyLocationCurrent);
      if (!isNull(v)) {
        try {
          v = JSON.parse(v);
          if (!isNull(v) && v.key == data.currently.time)
            return v;
        } catch (e) {}
      }
      data.key = data.currently.time;
      data.latlng = data.latitude + ',' + data.longitude;
      //localStorage.setItem(keyLocationLastTime, data.key + ''); // Last Update Time
      if (data.currently) {
        data.currently.icon = this.convertIcon(data.currently.icon);
        data.currently.week = this.getWeek(data.currently.time);
        data.currently.time = this.getTime(data.currently.time);
        var w = data.currently.windBearing;
        data.currently.windBearing = this.getWind(w);
        data.currently.windBearingIcon = 'wi wi-wind-default _' + w + '-deg';
        data.currently.precipProbability = accMul(data.currently.precipProbability, 100);
        data.currently.precipIntensity = data.currently.precipIntensity.toFixed(2) + ' mm';
      }
      if (data.hourly) {
        data.hourly.icon = this.convertIcon(data.hourly.icon);
        if (data.hourly.data) {
          for (var i in data.hourly.data) {
            data.hourly.data[i].icon = this.convertIcon(data.hourly.data[i].icon);
            data.hourly.data[i].time = this.getTime(data.hourly.data[i].time);
            var w = data.hourly.data[i].windBearing;
            data.hourly.data[i].windBearing = this.getWind(w);
            data.hourly.data[i].windBearingIcon = 'wi wi-wind-default _' + w + '-deg';
            data.hourly.data[i].precipProbability = accMul(data.hourly.data[i].precipProbability, 100);
            data.hourly.data[i].precipIntensity = data.hourly.data[i].precipIntensity.toFixed(2) + ' mm';
          }
        }
      }
      if (data.daily) {
        data.daily.icon = this.convertIcon(data.daily.icon);
        if (data.daily.data) {
          for (var i in data.daily.data) {
            data.daily.data[i].icon = this.convertIcon(data.daily.data[i].icon);
            data.daily.data[i].time = this.getWeek(data.daily.data[i].time);
            data.daily.data[i].sunriseTime = this.getTime(data.daily.data[i].sunriseTime);
            data.daily.data[i].sunsetTime = this.getTime(data.daily.data[i].sunsetTime);
            var w = data.daily.data[i].windBearing;
            data.daily.data[i].windBearing = this.getWind(w);
            data.daily.data[i].windBearingIcon = 'wi wi-wind-default _' + w + '-deg';
            data.daily.data[i].precipProbability = accMul(data.daily.data[i].precipProbability, 100);
            data.daily.data[i].precipIntensity = data.daily.data[i].precipIntensity.toFixed(2) + ' mm';
          }
        }
      }
      this.saveCurrent(data.latlng, data.currently.icon, data.currently.summary, data.daily.summary);
      var s = JSON.stringify(data);
      localStorage.setItem(keyLocationCurrent, s);
      return data;
    },
    saveCurrent: function(l, wi, d, s) {
      var v = localStorage.getItem(keyLocationList);
      if (isNull(v)) return;
      try {
        var data = JSON.parse(v);
        for (var i in data) {
          if (data[i].key === l) {
            data[i].icon = wi;
            data[i].day = d;
            data[i].summary = s;
            data[i].made = true;
          } else {
            data[i].made = false;
          }
        }
        var s = JSON.stringify(data);
        localStorage.setItem(keyLocationList, s);
      } catch (e) {}
    },
    getUrl: function(latlng) {
      return 'https://api.forecast.io/forecast/6b7c311c709d91d1711ec151a6dd9965/' +
        latlng + '?rand=' + Math.random() + '&units=si&callback=?'; // lang=zh&
    },
    call: function(cb) {
      if (typeof cb == "function") {
        cb(result);
      } //执行回调函数
    },
    getOnlineData: function(latlng, cb) {
      var ths = this;
      jQuery.ajax({
        url: ths.getUrl(latlng),
        async: false,
        dataType: 'jsonp',
        type: 'get',
        timeout: 10000,
        success: function(p) {
          var data = ths.processData(p);
          result = data;
          result.success = true;
          ths.call(cb);
        },
        error: function(xhr, type, errorThrown) {
          result = {
            message: 'The update is failed: ' + JSON.stringify(xhr),
            state: -1,
            success: false
          };
          ths.call(cb);
        }
      });
    },
    getStorageData: function() {
      var v = localStorage.getItem(keyLocationCurrent);
      if (isNull(v)) {
        result = {
          message: 'The update is failed: Network is not available',
          state: -1,
          success: false
        };
      } else {
        v = JSON.parse(v);
        v.success = true;
        this.showWeaher(v);
      }
    },
    getCurrTime: function() {
      return Date.parse(new Date()) / 1000;
    },
    getCurrentLL: function() {
      try {
        return eval(localStorage.getItem(keyLocationCurrent));
      } catch (e) {
        return null;
      }
    //var v = localStorage.getItem(keyLocationCurrent) || '{message: "No Data"}';
    //return eval(v);
    }
  };

  var addNode = function(iid, h) {
    var d = document.createElement('li');
    d.setAttribute('ripple', '');
    d.innerHTML = h;
    document.getElementById(iid).appendChild(d);
  };
  var showCurrently = function(wic, ws, wk) {
    document.getElementById("currently").innerHTML = '<i class="' + wic + ' font-5x"></i><h1 class="cleft">' +
      ws + '</h1><h1 class="cright">' + wk + '</h1>';
  };
  var showSummary = function(wic, v1, v2) {
    /*<li ripple></li>*/
    var h = '';
    if (isNull(wic))
      h = '<span class="footer">' + v1 + '</span>';
    else
      h = '<i class="' + wic + '"></i><span class="item-text">' +
        v1 + '</span><span class="item-text">' + v2 + '</span>';
    addNode('summary', h);
  };
  var showDaily = function(data) {
    var daily = '';
    for (var k = 1; k < data.length; k++) {
      var ths = data[k];
      daily += '<li ripple>';
      daily += '	<span class="item-weight">' + ths.time + '</span>';
      daily += '  <span class="item-text">' + ths.icon;
      var v = ths.precipProbability + '%&nbsp;' + ths.precipIntensity + ths.temperatureMin + '-' + ths.temperatureMax + '°';
      daily += '  	<span class="secondary-text">' + ths.summary + '</span>';
      daily += '  </span>';
      daily += '  <i class="' + ths.icon + ' item-action"></i>';
      daily += '</li>';
    }
    if (!isNull(daily)) {
      document.getElementById('daily').innerHTML = daily;
    }
  };
  var showWeaher = function(data) {
    if (isNull(data)) {
      setToast('Unknown Error');
      return;
    }
    var isShowDaily = false;
    // 1.currently currently
    showCurrently(data.currently.icon, data.currently.summary, data.currently.week);
    // 2.currently summary
    if (data.daily.data && data.daily.data.length > 0) {
      ths = data.daily.data[0];
      isShowDaily = true;
      // 2.1 sunrise
      showSummary('wi wi-sunrise', ths.sunriseTime, ths.sunsetTime);
      // 2.2 temperature °
      showSummary('wi wi-thermometer', ths.temperatureMin, ths.temperatureMax);
    }
    // 2.3 wind
    showSummary(data.currently.windBearingIcon, data.currently.windSpeed,
      data.currently.windBearing);
    // 2.4 sprinkles
    showSummary('wi wi-sprinkles', data.currently.precipProbability + '%',
      data.currently.precipIntensity);
      // 2.5 visibility
      //v = '能见度：' + data.currently.visibility + 'km&nbsp;&nbsp;气压：' + data.currently.pressure + ' Pa';

    // 2.6 timezone
    var v = data.timezone + '(' + data.offset + ')';
    showSummary('', v, '');
    // 2.7 time
    v = 'Last time is ' + obj.getFormatTime.call(obj, data.key);
    showSummary('', v, '');

    v = data.currently.temperature + '&nbsp;°';
    if (isShowDaily) { // daily
      showDaily(data.daily.data);
    }
    setToast('The update is complete');
  };

  var obj = new forWeather();
  window.setWeather = function(ll) {
    obj.getOnlineData.call(obj, ll, function(v) {
      showWeaher(v);
      setProcess();
    });
  }
  window.getWeather = function(k, cb) {
    openProcess('rings', 'Loading');
    try {
      var v = obj.getCurrentLL.call(),
        c = obj.getCurrTime.call();
      if (isNull(v)) { // Automatic positioning
        autoPostion(function(pos) {
          if (pos.success) {
            setToast('latlng: ' + pos.latlng);
            obj.getOnlineData.call(obj, pos.latlng, function(v) {
              showWeaher(v);
              setProcess();
            });
          } else {
            setToast(pos.message);
          }
        });
      } else if ((c - v.key) > 300) {
        // The interval is less than 5 minutes from the cache
        obj.getOnlineData.call(obj, v.latlng, function(v) {
          showWeaher(v);
          setProcess();
        });
      } else {
        showWeaher(v);
        setProcess();
      }
    } catch (e) {
      //setToast('The update is failed: ' + e.message);
      setProcess();
      navigator.notification.alert(JSON.stringify(e.stack));
    }
  };
})(window);
