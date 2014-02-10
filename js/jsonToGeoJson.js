/**
 * Created by yj on 9/2/14.
 */
// Utility to convert JSON to geoJSON (see the geoJSON specification: http://www.geojson.org)
function geoJSON( data ) {
    //
    // Input JSON data format:
    //	"original address": "string"
    //      "returned address": "string"
    //	"latitude": "number"
    //	"longitude": "number"
    //

    // Convert JSON data to GeoJSON:
    var _geoJSON = {
        'type': 'FeatureCollection',
        'features': [ ]
    };

    for (var i = 0; i < data.length; i++) {
        _geoJSON.features.push( {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [data[i].longitude, data[i].latitude] // [x,y]
            },
            'properties': {
                'name': data[i]['returned address']
            }
        });

    }; // end FOR i

    return _geoJSON;

}; // end FUNCTION geoJSON(data)
