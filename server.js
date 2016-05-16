var express = require('express'),
app = express();
// foursquare api requires https not http
var http = require('https');
app.use('/', express.static(__dirname + '/'));
app.listen(8080);

app.get('/search', function(req, res) {
    var location = {};
    var zipcode = req['query']['zipcode'];

    var options = {
        host: 'api.foursquare.com',
        path: '/v2/venues/search?near=' + zipcode + '&client_id=OF0NPSOYORRW2A10MDV5NECMDQWSYBRHURMTXNO0JVWP1PLC&client_secret=CWFELAMDP5V02ES05D1KK1ETBZIYFS2QIT2ZGVRIN2KEPHFN&v=20160516'
    };

    http.get(options, function(res2) {
        console.log("Got response: " + res2.statusCode);
        var str = '';
        res2.on('data', function(chunk) {
            str += chunk;
        });
        res2.on('end', function() {
            var data = JSON.parse(str);
            var arr = [];
            var venues = data['response']['venues'];
            for (var i = 0; i < venues.length; i++) {
                var venue = venues[i];
                var location = {};
                location['name'] = venue['name'];
                location['address'] = venue['location']['address'];
                // only add locations with an address
                if (location['address']) {
                    arr.push(location);
                }
            }
            res.send(arr);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});
