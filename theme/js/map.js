var map;
var feature;


function load_map() {

  var humanitarian = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Colaboradores de <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });http:
  var opencyclemap = L.tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>, información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var stamen_watercolor = L.tileLayer('https://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Teselas © <a href="https://maps.stamen.com/">Stamen Design</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var mapbox_hybrid = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jaakkoh.map-f5t6yxb5/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://mapbox.com/">Mapbox</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var pub_transport = L.tileLayer('https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://memomaps.de/">MeMoMaps</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });
  var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jaakkoh.map-4ch3dsvl/{z}/{x}/{y}.png', {
    attribution: 'Teselas © <a href="https://mapbox.com/">Mapbox</a>; Información geográfica © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  });

  var baseLayers = {
    "Humanitarian": humanitarian,
    "OpenStreetMap": osm,
    "Terreno": mapbox,
    "Hibrido": mapbox_hybrid,
    //"Transporte público": pub_transport,
    "Topográfico": opencyclemap,
    "Acuarela": stamen_watercolor
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
