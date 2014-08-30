/* global getPositions, initMap, addMarker */

(function(){
  'use strict';

  $(document).ready(function(){
    getPostitions();
    initMap('smallmap', pos.lat, pos.lng, 7);
    addMarker(pos.lat, pos.lng, pos.name);
  });

    function getPositions(){
      'use strict';
      var $location = $('#location'),
          name      = $location.attr('data-name'),
          lat       = $location.attr('data-lat'),
          lng       = $location.attr('data-lng'),
          pos       = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
      console.log(pos);
      return(pos);
    }

})();

