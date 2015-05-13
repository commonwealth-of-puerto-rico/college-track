
window.app = (function($, map){
    var API_KEY = ' wNItlTM01zprvFa8K62Tu3LJj';
    var app = {};

    app.init = function(map){
        app.map = map;
        app.load_data();
    };

    app.load_data = function(){
        // var url = 'https://data.pr.gov/resource/admit.json?$$app_token=wNItlTM01zprvFa8K62Tu3LJj';
        var url = '/sample-data.json';
        $.get(url, function(data){
            app.set_data(data);
        });
    };
    app.set_data = function(data){
        app.data = data;
        // TODO: process data
    };

    return app;

})($);
