var map;

var feature;
function cargar_mapa() {



	    var humanitarian = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		    attribution: 'Datos © Colaboradores de OpenStreetMap'
	    });
	    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '© Colaboradores de OpenStreetMap'
	    });
	    var ign = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '© Colaboradores de OpenStreetMap'
	    });

      var baseLayers = {
          "Humanitarian": humanitarian,
          "OSM.org": osm
      };

      map = new L.map('map', {
          center: [12.135,-86.293],
          zoom: 10,
          layers: [humanitarian]
      });

      var layers = L.control.layers(baseLayers);
      map.addControl(layers);
      map.addControl(new L.Control.Permalink({text: 'Permalink', layers: layers}));



}

    $(document).ready(function (){

      $('.modal-garmin').bind('click',function(){

            $('#modal-garmin').modal({show:true,backdrop:true});

      });

      $('#webirc').bind('click',function(){
            $('<div/>').modal({remote:'http://irc.lc/OFTC/osm-ni/invitadoweb'});

      });

      $('.modal-acerca').bind('click',function(){

            $('#modal-acerca').modal({show:true,backdrop:true});

		    $.ajax({
			    url: 'https://api.github.com/repos/f3rnando/osm-ar',
			    dataType: 'jsonp',

			    success: function(results){
				    var repo = results.data;

				    var date = new Date(repo.pushed_at);
				    var pushed_at = (date.getDate() + '-' + date.getMonth()+1) + '-' + date.getFullYear();

			        $('.github-widget').html('');
					$('.github-widget').append('<h4>Github Repo</h4><div><a class="repo" href="' + repo.url.replace('api.','').replace('repos/','') + '">' + repo.url.replace('api.','').replace('repos/','') + '</a></div>');
                    $('.github-widget').append('<h5 class="">Watchers: <a class="badge watchers" href="' + repo.url.replace('api.','').replace('repos/','') + '/watchers">' + repo.watchers + '</a></h5>');
                    $('.github-widget').append('<h5 class="">Forks: <a class="badge forks" href="' + repo.url.replace('api.','').replace('repos/','') + '/forks">' + repo.forks + '</a></h5>');
					$('.github-widget').append('<div><a class="btn btn-inverse download" href="' + repo.url.replace('api.','').replace('repos/','') + '/zipball/master">Descargar en zip</a></div>');

                    $('.github-widget').append('<p>Ultimo commit al branch <strong>master</strong> el día ' + pushed_at + '</p>');
                    $('.github-widget').append('<p>Reportar problemas, sugerir mejoras: <a href="https://github.com/f3rnando/osm-ar/issues">https://github.com/f3rnando/osm-ar/issues</a></p>');

			    }
		    });

      });

      $('#buscar').bind('click',function(){
        $('#modal-resultados').modal({show:true,backdrop:false});
        var inp = document.getElementById("addr");
        $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
            var items = [];

            $.each(data, function(key, val) {
                bb = val.boundingbox;
                items.push("<p><a href='#' onclick='elegirResultado(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></p>');
            });

		    $('#resultados').empty();
            if (items.length != 0) {
                $('#resultados').html(items.join(''));

            } else {
                $('<div/>', { html: "No se encontraron resultados." }).appendTo('#resultados');
            }

        });

      });


    });

    function elegirResultado(lat1, lng1, lat2, lng2, osm_type) {
        $('#modal-resultados').modal('toggle');
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


window.onload = cargar_mapa;
