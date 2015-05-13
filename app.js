
window.app = (function($) {
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

    app.init = function(map, filters_toolbar){
        app.map = map;
        app.filters_toolbar = $(filters_toolbar);
        app.load_data();
    };

    app.load_data = function(){
        // var url = 'https://data.pr.gov/resource/admit.json?$app_token=wNItlTM01zprvFa8K62Tu3LJj';
        var url = '/sample-data.json';

        $.get('recintos.json', function(recintos) {
            app.recintos = recintos;

            $.get(url, function(data){
                app.set_data(data);
            });
        });
    };

    app.set_data = function(data) {
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
        app.make_filters();

        app.drawData(app.data);
    };

    app.make_filters = function(){
        app.filters={};
        app.filters_toolbar.empty();
        for(var f in app.fields){
            app.filters_toolbar.append(app.make_filter_ctrl(f));
        }
        app.filters_toolbar.removeClass('hidden');
    };

    app.make_filter_ctrl = function(f){
        var vals = app.fields[f];
        var el = $(
            '<div class="btn-group">' +
                '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                    f + ' <span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '</ul>' +
            '</div>'
        );
        el.find('.dropdown-menu').click(function(e){if($(this).is(':visible')){e.stopPropagation();}});
        var dd = el.find('.dropdown-menu');
        vals.forEach(function(value){
            app.set_filter(f, value, true, true);
            var item=$('<li></li>').append(
                $('<label></label>').append(
                    $('<input type="checkbox" checked="checked" />').change(function(){
                        app.set_filter(f, value, $(this).is(':checked'));
                    })
                ).append(value)
            ).appendTo(dd);
        });
        return el;
    };

    app.set_filter = function(filter, value, checked, ignore){
        if(!app.filters[filter]){app.filters[filter]={};}
        app.filters[filter][value] = checked;
        if(!ignore){
            var filtered = app.filter_data(app.data, app.filters);
            app.clear_map(app.data);
            app.drawData(filtered);
        }
    };

    app.filter_data = function(data, filters){
        var filtered = data.filter(function(item){
            for(var f in filters){
                var filter = filters[f];
                if(filter && !filter[item[f]]){
                    return false;
                }
            }
            return true;
        });
        return filtered;
    };

    app.drawData = function(data) {
        Object.keys(app.recintos).forEach(app.addUprMarker.bind(app));
        data.forEach(app.addHighSchoolMaker.bind(app));

        // console.log(Object.keys(app.recintos));

    };

    app.clear_map = function(data) {
        for(var i=0, e=data.length; i < e; ++i){
            if(data[i].marker){
                data[i].marker.setMap(null);
                data[i].marker = null;
            }
            if(data[i].arrow){
                data[i].arrow.setMap(null);
                data[i].arrow = null;
            }
        }
    };

    app.addHighSchoolMaker = function(item) {
        item.marker = new google.maps.Marker({
            position: item.location = new google.maps.LatLng(+item.location_1.latitude, +item.location_1.longitude),
            map: app.map,
            title: item.institucion_de_procedencia,
            icon: {
                anchor: new google.maps.Point(16,16),
                url: '/img/green4.png',
            },
        });
        item.arrow = app.addArrow({
            lat: +item.location_1.latitude, lon:+item.location_1.longitude
        }, app.recintos[item.campus]);
    };

    app.addUprMarker = function(id) {
        var item = app.recintos[id];
        item.marker = new google.maps.Marker({
            position: item.location = new google.maps.LatLng(item.lat, item.lon),
            map: app.map,
            title: item.name,
            icon: {
                anchor: new google.maps.Point(16,16),
                url: '/img/torre2.png',
            },
        });
    };

    app.addArrow = function(hs, upr) {
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

        var lineCoordinates = [
            new google.maps.LatLng(hs.lat, hs.lon),
            new google.maps.LatLng(upr.lat, upr.lon)
        ];

        var line = new google.maps.Polyline({
            path: lineCoordinates,
            icons: [{
                icon: lineSymbol,
                offset: '100%'
            }],
            map: app.map,
            strokeColor: "#575757",
            strokeWeight: 1
        });
        return line;
    };

    return app;


})($);
