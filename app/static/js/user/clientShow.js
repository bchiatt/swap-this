/* global initMap, addMarker */

(function(){
  'use strict';

  $(document).ready(function(){
    var pos = getPosition(),
        map = initMap('smallmap', pos.lat, pos.lng, 10);
    addMarker(map, pos.lat, pos.lng, pos.name);
  });

  function getPosition(){
    var $location = $('#location'),
        name      = $location.attr('data-location'),
        lat       = $location.attr('data-lat'),
        lng       = $location.attr('data-lng'),
        pos       = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};

    return(pos);
  }

})();

