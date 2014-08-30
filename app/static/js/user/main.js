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

  //add snazzy maps by replaying the styles line.
  var styles     = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}],
      mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles},
      map        = new google.maps.Map(document.getElementById(selector), mapOptions);

  return map;
}


function addMarker(map, lat, lng, name, icon){
  'use strict';
  var latLng = new google.maps.LatLng(lat, lng);
  new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP, icon: icon});
}
