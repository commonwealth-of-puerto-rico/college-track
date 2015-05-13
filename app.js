
window.app = (function($, map){
    var API_KEY = ' wNItlTM01zprvFa8K62Tu3LJj';
    var app = {};

    app.init = function(map){
        app.map = map;
        app.load_data();
    };

    app.load_data = function(){
        // var url = 'https://data.pr.gov/resource/admit.json?$app_token=wNItlTM01zprvFa8K62Tu3LJj';
        var url = '/sample-data.json';
        $.get(url, function(data){
            app.set_data(data);
        });
    };
    app.set_data = function(data){
        app.data = data;

        data.forEach(app.add_item.bind(app));

        var mlat=0, mlon=0;
        for(var i=0, e=data.length; i < e; ++i){
            mlat += +data[i].location_1.latitude;
            mlon += +data[i].location_1.longitude;
        }
        console.log(mlat, mlon);
        app.map.setCenter(new google.maps.LatLng(mlat/data.length, mlon/data.length));
    };

    app.add_item = function(item){
        item.marker = new google.maps.Marker({
            position: item.location = new google.maps.LatLng(+item.location_1.latitude, +item.location_1.longitude),
            map: app.map,
            title: 'Hello World!'
        });
    }

    return app;

})($);
