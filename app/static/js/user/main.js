/* jshint unused: false, camelcase:false */
/* global google */

function geocode(address, cb){
  'use strict';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    var name = results[0].formatted_address,
        lat  = results[0].geometry.location.lat(),
        lng  = results[0].geometry.location.lng();

    cb(name, lat, lng);
  });
}

function initMap(selector, lat, lng, zoom){
  'use strict';

  var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP},
      map = new google.maps.Map(document.getElementById(selector), mapOptions);

  return map;
}

function getPositions(){
  'use strict';
  var $treasure = $('#treasure'),
      name = $treasure.attr('data-name'),
      lat  = $treasure.attr('data-lat'),
      lng  = $treasure.attr('data-lng'),
      pos  = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
  return(pos);
}

function addMarker(map, lat, lng, name, icon){
  'use strict';
  var latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: icon});
}
