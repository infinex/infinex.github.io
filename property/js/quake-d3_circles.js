var container = L.DomUtil.get('quake'),
    map = L.map(container).setView([1.3715473, 103.8075655], 12);
    map.scrollWheelZoom.disable();


//L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
//    attribution: '<a href="http://content.stamen.com/dotspotting_toner_cartography_available_for_download">Stamen Toner</a>, <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
//    maxZoom: 17
//}).addTo(map);


L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
    attribution: '&copy; 2013 OpenStreetMap &copy; 2013 CloudMade',
    key: 'db1f78ccee5f480b82c56ff9b18639e9',//Please don't use my key. It's free!!!
    styleId:122089  //82102  108996          //Go to www.cloudmade.com to get a key.
}).addTo(map);


var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide"),
    padding = 100,
//    color = d3.scale.log()
//        .domain([5, 7, 15, 30])
//        .range(["#d7191c", "#ffffbf", "#2c7bb6"])
//        .interpolate(d3.interpolateHcl);

 color = d3.scale.linear()
    .domain([300000,500000, 1000000])
    .range(["#d7191c", "#ffffbf", "#2c7bb6"])
     .interpolate(d3.interpolateHcl);



var tooltip = d3.select("body")
    .append("div")
    .attr("id","tooltip")
    .style("position", "fixed")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")



d3.json(container.dataset.source, function(collection) {
    var path = d3.geo.path().projection(project),
        bounds = d3.geo.bounds(collection),
        feature = g.selectAll("path")
            .data(collection.features)
            .enter()
            .append("path")
            .attr('stroke', get_color)
            .attr('fill', get_color)
            .on("mouseover", function (d)

            {

                function toTitleCase(str){
                    return str.replace(/\w\S*/g, function(txt){
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                }

                function objToString (obj) {
                    var str = '';
                    for (var p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            str +=  '<b>' + toTitleCase(p) + '</b>' + ':' + obj[p] + '<br>';
                        }
                    }
                    return str;
                }


                var displayToolBoxText="<div style='margin:5px'>" + objToString(d.properties) + "</div>";


                tooltip.style("visibility", "visible");
                tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                tooltip.html(displayToolBoxText)

            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
                return d});

    path.pointRadius(function (d) {
        var mag = d.properties.sqft;
        return mag/150;
    });

    map.on('viewreset', reset);
    reset();

    function reset() {
        var bottomLeft = project(bounds[0]),
            topRight = project(bounds[1]);

        svg .attr("width", topRight[0] - bottomLeft[0] + padding * 2)
            .attr("height", bottomLeft[1] - topRight[1] + padding * 2)
            .style("margin-left", bottomLeft[0] - padding + "px")
            .style("margin-top", topRight[1] - padding + "px");
        g   .attr("transform", "translate(" + -1 * (bottomLeft[0] - padding) + "," + -1 * (topRight[1] - padding) + ")");

        feature.attr('d', path)
            .attr("fill-opacity", 0.6)
            .attr("stroke-width", 0);
    }

    function project(x) {
        var point = map.latLngToLayerPoint([x[1], x[0]]);
        return [point.x, point.y];
    }

    function get_price(d) {
        return d.properties.price;
    }

    function get_color(d) {
        return d3.rgb(color(get_price(d))).toString();
    }
});


