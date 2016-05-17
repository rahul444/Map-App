var express = require('express'),
app = express();
// foursquare api requires https not http
var http = require('https');
var escapeStr = require('querystring');
app.use('/', express.static(__dirname + '/'));
app.listen(8080);

app.get('/search', function(req, res) {
    var location = {};
    var searchQuery = escapeStr.escape(req['query']['searchQuery']);

    var options = {
        host: 'api.foursquare.com',
        path: '/v2/venues/search?near=' + searchQuery + '&client_id=OF0NPSOYORRW2A10MDV5NECMDQWSYBRHURMTXNO0JVWP1PLC&client_secret=CWFELAMDP5V02ES05D1KK1ETBZIYFS2QIT2ZGVRIN2KEPHFN&v=20160516'
    };

    http.get(options, function(res2) {
        console.log("Got response: " + res2.statusCode);
        var str = '';
        res2.on('data', function(chunk) {
            str += chunk;
        });
        res2.on('end', function() {
            var arr = [];
            if (res2.statusCode == 200) {
                var data = JSON.parse(str);
                var venues = data['response']['venues'];
                for (var i = 0; i < venues.length; i++) {
                    var venue = venues[i];
                    var location = {};
                    if (venue['location']['address'] && venue['categories'][0]) {
                        location['name'] = venue['name'];
                        location['address'] = venue['location']['address'];
                        location['type'] = venue['categories'][0]['name'];
                        if (venue['contact']['phone']) {
                            location['contact'] = venue['contact']['phone'];
                        } else {
                            location['contact'] = 'N/A';
                        }
                        arr.push(location);
                    }
                }
            }
            res.send(arr);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});
