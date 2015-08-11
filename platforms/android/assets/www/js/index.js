/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    var ns = document.getElementById("navigation-sidemenu"), //document.querySelector('#navigation-sidemenu')
      smitems = ns.querySelectorAll(".menu > li:not(.divider) > a");

    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.getElementById('btnMenuIcon').addEventListener('click', function() {
      SideMenu.toggle(ns)
    })
    function clickHandler() {
      return function() {
        if (Responsive.device != "desktop") {
          SideMenu.hide(ns);
        }
        for (var ind = 0; ind < smitems.length; ind++) {
          smitems[ind].parentNode.className = "";
        }
        this.parentNode.className = "selected color-blue-500";
        document.querySelector(".main-content").scrollTop = 0;
      };
    }
    for (var i = 0, len = smitems.length; i < len; i++) {
      smitems[i].addEventListener("click", clickHandler());
    }

    window.addEventListener("DOMContentLoaded", function() {
      document.getElementById('input-addr').addEventListener('input', function() {
        var v = document.getElementById("input-addr").value
        if (isNull(v)) {
          alert('Address(addr) can not be empty')
          return
        }
        autoPostion(function(pos) {
          if (pos.success) {
            setToast('latlng: ' + pos.latlng);
            jQuery('#cityList').append(
              '<li ripple><span class="item-text">' + pos.city +
              '<span class="secondary-text">' + pos.addr + '</span>' +
              '</span><i class="icon-chevron-right item-action"></i></li>');
            setWeather(pos.latlng);
          } else {
            setToast(pos.message);
          }
        });
      });

      document.querySelector("#external-fab-container a").addEventListener('click', function() {
        Dialog.show(document.querySelector('#dialog-add-city'));
      });

      var md = new Material();
      if ((window.location.hash === "") || (document.querySelector(".navigation-section" + window.location.hash) === null)) {
        window.location.hash = "#Weather";
      }
      document.querySelector("#navigation-sidemenu a[href='" + window.location.hash + "']").parentNode.className = "selected color-blue-500";

      SideMenu.hide(ns);
    });
  },
  /** 页面第一次初始化的时候加载列表
    $(document).on("pageinit", "#pageSingle", function () { loadSingleList(); });
  	每次页面显示时，重新加载列表
    $(document).on("pageshow", "#pageSingle", function () { loadSingleList(); });
   **/
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    getWeather();
    /*
    setToast('Received Event: ' + id);
    navigator.notification.alert('Received Event: ' + id);
    */

    console.log('Received Event: ' + id);
  }
};

app.initialize();
//getWeather();
