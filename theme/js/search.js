var modal = (function(){
  var
  method = {},
  $modal,
  $content,
  $close;

  // Open the modal
  method.open = function (settings) {
      $content.empty().append(settings.content);

      $modal.css({
          width: settings.width || 'auto',
          height: settings.height || 'auto'
      })
      $modal.show();
  };

  // Close the modal
  method.close = function () {
    $modal.hide();
    $content.empty();
    $(window).unbind('resize.modal');
  };

  $modal = $('<div id="modal"></div>');
  $content = $('<div id="modal-content"></div>');
  $close = $('<a id="modal-close" href="#">close</a>');

  $modal.hide();
  $modal.append($content, $close);

  $(document).ready(function(){
    $('body').append($modal);
  });

  $close.click(function(e){
    e.preventDefault();
    method.close();
  });

  return method;
}());

$(document).ready(function (){

  $('#searchlink').on('click', function(e){
    if($('#searchform').hasClass('open')) {
      $('#searchform').removeClass('open');
      $('#searchlink').removeClass('open');
      $('#searchlink .fa-times').addClass('fa-search');
      $('#searchlink .fa-times').removeClass('fa-times');
      modal.close();
    }
    else {
      $('#searchform').addClass('open');
      $('#searchlink').addClass('open');
      $('#searchlink .fa-search').addClass('fa-times');
      $('#searchlink .fa-search').removeClass('fa-search');
    }
  });

  var search = function(){
    var inp = document.getElementById("search-string");
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
    var items = [];
    $.each(data, function(key, val) {
      bb = val.boundingbox;
      items.push("<p><a href='#' onclick='elegirResultado(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></p>');
    });

    $('#modal-content').empty();
      if (items.length != 0) {
        $('#modal-content').html(items.join(''));
      } else {
        $('<div/>', { html: "No se encontraron resultados." }).appendTo('#modal-content');
      }
    });

  }

  // Search callback
  $('#search').bind('click',function(e){

    // Avoiding reload of page after form submit
    e.preventDefault();

    // Define modal
    modal.open({content: '<img src="/theme/img/loading.gif" alt="Cargando"/>'});

    // Search callback logic
    var inp = document.getElementById("search-string");
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value + ", Nicaragua", function(data) {
      var items = [];
      $.each(data, function(key, val) {
        bb = val.boundingbox;
        items.push("<p><a href='#' onclick='chooseResult(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></p>');
      });

      $('#modal-content').empty();
      if (items.length != 0) {
        $('#modal-content').html(items.join(''));
      } else {
        $('<div/>', { html: "No se encontraron resultados." }).appendTo('#modal-content');
      }
    });
  });
});

function chooseResult(lat1, lng1, lat2, lng2, osm_type) {

  modal.close();
  var loc1 = new L.LatLng(lat1, lng1);
  var loc2 = new L.LatLng(lat2, lng2);
  var bounds = new L.LatLngBounds(loc1, loc2);

  if (feature) {
    map.removeLayer(feature);
  }

  if (osm_type == "node") {
    feature = L.circle( loc1, 16, {color: 'cyan', fill: false}).addTo(map);
    feature.bindPopup(loc1+" ");
    map.fitBounds(bounds);
    map.setZoom(18);
  } else {
    var loc3 = new L.LatLng(lat1, lng2);
    var loc4 = new L.LatLng(lat2, lng1);

    feature = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(map);
    feature.bindPopup(loc1+" "+loc1+" "+loc2+" "+loc3);
    map.fitBounds(bounds);
  }
}
