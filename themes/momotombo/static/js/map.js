var map;
var feature;


function load_map() {

  var humanitarian = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Colaboradores de <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });http:

  var baseLayers = {
    "Humanitarian": humanitarian,
    "OpenStreetMap": osm,
  };

  // Obtain parameters from url
  var url_paramas = get_params();

  // Initialize map
  map = new L.map('map', {
    center: [13,-85],
    zoom: 8,
    attributionControl: false,
    layers: baseLayers[url_paramas.layers] || osm
  });

  // Adding hash for position in url
  var hash = new L.Hash(map);

  // Adding attribution to desired position
  L.control.attribution({position: 'bottomleft'}).addTo(map);

  // Adding layer functionality
  var layers = L.control.activeLayers(baseLayers);
  layers.setPosition('topright').addTo(map);

  // Permalink
  //map.addControl(new L.Control.Permalink({text: 'Compartir', layers: layers}));

  // Marker
  if (!isNaN(url_paramas.mlat) && !isNaN(url_paramas.mlon)) {

    // Adding marker
    var marker = L.marker([url_paramas.mlat,url_paramas.mlon]).addTo(map);

    // Popup
    if (typeof url_paramas.popup !== 'undefined') {
      if (url_paramas.popup.match(/^[^\\\/&]*$/)) {
        marker.bindPopup(url_paramas.popup).openPopup();
      }
    }
  }
}


function get_params(search) {
  var params = {};

  search = (search || window.location.search).replace('?', '').split(/&|;/);

  for (var i = 0; i < search.length; ++i) {
    var pair = search[i],
    j = pair.indexOf('='),
    key = pair.slice(0, j),
    val = pair.slice(++j);
    params[key] = decodeURIComponent(val);
  }

  return params;
}

window.onload = load_map;
