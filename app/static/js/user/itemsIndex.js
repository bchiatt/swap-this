/* global _, getPositions, initMap, addMarker */

(function(){
  'use strict';

  var map, marker;

  $(document).ready(function(){
    var locations = getPositions();
    map = initMap('bigmap', 39.5, -98.35, 4);

    locations.forEach(function(loc){
      addMarker(map, loc.lat, loc.lng, loc.name);
    });
  });

  function getPositions(){
    var positions = $('table tbody tr').toArray().map(function(tr){
      var name = $(tr).attr('data-name'),
          lat  = $(tr).attr('data-lat'),
          lng  = $(tr).attr('data-lng'),
          pos  = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};

      return (name ? pos : null);
    });

    return _.compact(positions);
  }

})();

