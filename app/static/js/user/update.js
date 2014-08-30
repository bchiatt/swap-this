/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('button').click(updateProfile);
  });

  function updateProfile(e){
    var location = $('#location').val();

    geocode(location, function(name, lat, lng){
      console.log(name, lat, lng);
      $('#location').val(name);
      $('#lat').val(lat);
      $('#lng').val(lng);

      $('form').submit();
    });

    e.preventDefault();

  }

})();

