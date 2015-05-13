
window.app = (function($, map){
    var API_KEY = ' wNItlTM01zprvFa8K62Tu3LJj';
    var app = {};

    var get_field_values = function(data, fields, f){
        if(!f){ f = {}; }
        data.forEach(function(item){
            for(var i=0,e=fields.length; i<e; ++i){
                var field=fields[i];
                var fentry = f[field] || (f[field]={});
                if(!fentry[item[field]]){ fentry[item[field]]=1; }
            }
        });
        for(var i=0,e=fields.length; i<e; ++i){
            var field=fields[i];
            var fentry=f[field];
            var farr=[];
            for(var j in fentry){
                farr.push(j);
            }
            f[field]=farr;
        }
        return f;
    };

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

        get_field_values(data, [
            "igs",
            "genero",
            "program",
            "calendario",
            "gpa",
            "institucion_de_procedencia",
            "campus",
        ], app.fields={});

        app.apply_data(app.data);
    };

    app.apply_data = function(data){
        var mlat=0, mlon=0;
        for(var i=0, e=data.length; i < e; ++i){
            mlat += +data[i].location_1.latitude;
            mlon += +data[i].location_1.longitude;
        }
        console.log(mlat, mlon);

        data.forEach(app.add_item.bind(app));
        app.map.setCenter(new google.maps.LatLng(mlat/data.length, mlon/data.length));
    };

    app.clear_map = function(item){
        for(var i=0, e=data.length; i < e; ++i){
            if(data[i].marker){
                data[i].marker.setMap(null);
                data[i].marker = null;
            }
        }
    };

    app.add_item = function(item){
        item.marker = new google.maps.Marker({
            position: item.location = new google.maps.LatLng(+item.location_1.latitude, +item.location_1.longitude),
            map: app.map,
            icon: 'green4.png',
            title: 'Hello World!'
        });
    }


    return app;


})($);
