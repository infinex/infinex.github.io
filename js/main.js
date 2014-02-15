
/**
 * Created with JetBrains WebStorm.
 * User: yj
 * Date: 21/1/14
 * Time: 11:25 PM
 * To change this template use File | Settings | File Templates.
 */



require.config({
    paths: {
        d3: '../bower_components/d3/d3',
        /* Load jquery from google cdn. On fail, load local file. */
        "waypoints": "//cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.3/waypoints",
        'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery', 'libs/jquery-min'],
        /* Load bootstrap from cdn. On fail, load local file. */
        'bootstrap': ['//netdna.bootstrapcdn.com/bootstrap/3.1.0/js/bootstrap', 'libs/bootstrap-min'],
        'leaflet': ['http://cdn.leafletjs.com/leaflet-0.7.2/leaflet', 'libs/leaflet-min'],
        'stamen': 'http://maps.stamen.com/js/tile.stamen.js?v1.2.4',
         'json2GeoJson': './jsonToGeoJson'

    },
    shim: {
        'bootstrap' : ['jquery'],
        'stamen' : ['leaflet']

    }

});



require(['jquery','d3','bootstrap','waypoints','leaflet','stamen','json2GeoJson'], function($,d3,app) {



        var flickrgetImage=function()
        {
            $.getJSON("http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=420a8f733406d76db842e853962104a8&extras=url_o&page=1&format=json&nojsoncallback=1", function( data ) {
                var photos = data.photos.photo;
                ;
                var list=[];
                $.each( photos, function( key, photoId )
                {

                    if("url_o" in photoId){
                        list.push(photoId);
                }

                 });

                var randomNum=Math.floor(Math.random()*list.length);
                $("#wrapper").css("background-image","url('"+ list[randomNum].url_o+ "')");
                return;

                })};

      //  flickrgetImage();


        $( "#flickrBtn" ).bind( "click", function() {
            flickrgetImage();
        });




        $('#topNavbar').waypoint('destroy');
        $('#topNavbar').waypoint(function(direction) {
                if (direction === 'down'){
           $(this).css("background","rgba(255, 255, 255, 1)");
            $('#logo').css("color","rgba(0,0,0,1)");
                }
            else
                {
                    $(this).css("background","rgba(255, 255, 255, 0)");
                    $('#logo').css("color","rgba(255,255,255,1)");

                }
        console.log('abc');
        }, { offset: -20 });



    window.onload = function() {

        createMap();



        function createMap() {

            var loc = {'lat': 1.3715473, 'lon':103.8075655},
                zoomLevel = 12,
                maxZoom = 15,
                mapID = 'map';

            var map = L.map('map').setView(
                [loc.lat, loc.lon],
                zoomLevel
            );

            map.scrollWheelZoom.disable();

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                'maxZoom': maxZoom,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.'
            }).addTo(map);


            var watercolor = new L.StamenTileLayer("toner-lite")
                .addTo(map);


            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };


            map._initPathRoot()
            var svg = d3.select("#map").select("svg"),
                g = svg.append("g");

            d3.json("./js/data/output.geojson", function(collection) {
                /* Add a LatLng object to each item in the dataset */
                collection.features.forEach(function(d) {
                    d.LatLng = new L.LatLng(d.geometry.coordinates[1],d.geometry.coordinates[0])
                })

                var node = g.selectAll(".node")
                    .data(collection.features)
                    .enter().append('g');



                var feature = node.append("circle").attr("r", function (d) { return 20/20 }).attr('fill','lightcoral');


//                var feature = g.selectAll("circle")
//                    .data(collection.features)
//                    .enter().append("circle").attr("r", function (d) { return 20/20 }).attr('fill','lightcoral');

                var circle=node.append("svg:text")
                    .text(function(d) {
                        return d.properties.name;
                    }).attr("font-family", "sans-serif")
                                 .attr("font-size", "5px")
                                 .attr("fill", "black");;

                feature.on("mouseover",function(d) { console.warn(d3.select(this));


                    d3.select(this).transition().delay(300).
                        duration(1000).attr('r',function (d){ return (100/20)*3 }).attr('fill','purple')
                    }

                );

                function update() {
                    feature.attr("cx",function(d) { return map.latLngToLayerPoint(d.LatLng).x})
                    feature.attr("cy",function(d) { return map.latLngToLayerPoint(d.LatLng).y})
                    feature.attr("r",function(d) { return 5/1400*Math.pow(2,map.getZoom())})
                    circle.attr("dx",function(d) { return map.latLngToLayerPoint(d.LatLng).x})
                    circle.attr("dy",function(d) { return map.latLngToLayerPoint(d.LatLng).y})
                    circle.attr("font-size",function(d) { return 1/2500*Math.pow(2,map.getZoom())})


                }
                map.on("viewreset", update);
                update();
            })



            }



        }
    });