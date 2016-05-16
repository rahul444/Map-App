var express = require('express'),
app = express();
var http = require('http');
app.use('/', express.static(__dirname + '/'));
app.listen(8080);
// var React = require('react');
// var ReactDOM = require('react-dom');


// var zipcode = 95014;
// var location = {};

app.get('/search', function(req, res) {
    var location = {};
    var zipcode = req['query']['zipcode'];

    var options = {
        host: 'www.zipcodeapi.com',
        path: '/rest/ji5DVPh9RX9K2NTiLctF6xP45h7TJSG2aLG6BYftVpdXd7gYjJEqgtvmLDfuvVxG/info.json/' + zipcode + '/degrees'
    };

    http.get(options, function(res2) {
        console.log("Got response: " + res2.statusCode);
        res2.on('data', function(chunk) {
            var data = JSON.parse(chunk);
            location['lon'] = data['lng'];
            location['lat'] = data['lat'];
            res.send(location);
            console.log(location);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    // if (location['lon'] != undefined) {
    //     res.json(location);
    // }
});
