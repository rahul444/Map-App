var express = require('express'),
app = express();
var http = require('https');
var escapeStr = require('querystring');
var mysql = require('mysql');
app.use('/', express.static(__dirname + '/'));
app.listen(8000);

var connection = mysql.createConnection({
  host: 'localhost',
  port: '8080',
  user: 'root',
  password: 'my_password',
  database: 'app_db'
});

connection.connect(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('You are now connected...');
  }
});

app.get('/views', function(req, res) {
    var name = req['query']['venueName'];
    connection.query("INSERT INTO Views (`venueName`, `views`) VALUES (" + "'" + name + "', " + "2) ON DUPLICATE KEY UPDATE views = views + 1;",
        function(err, result) {
            if (err) {
                console.error(err);
                res.send('FAILURE: Views not uploaded');
            } else {
                // console.log(result);
                res.send('SUCCESS: Views updated');
            }
        });
});

app.get('/comment', function(req, res) {
    var comment = {
        venueName: req['query']['venue'],
        name: req['query']['name'],
        comment: req['query']['comment'],
        time: req['query']['id']
    }

    connection.query('INSERT INTO Comments SET ?', comment, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            // console.log(result);
            res.send('SUCCESS Comment updated');
        }
    });
});

app.get('/search', function(req, res) {
    var searchQuery = escapeStr.escape(req['query']['searchQuery']);

    var options = {
        host: 'api.foursquare.com',
        path: '/v2/venues/search?near=' + searchQuery + '&client_id=OF0NPSOYORRW2A10MDV5NECMDQWSYBRHURMTXNO0JVWP1PLC'
        + '&client_secret=CWFELAMDP5V02ES05D1KK1ETBZIYFS2QIT2ZGVRIN2KEPHFN&v=20160516'
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
                // TODO put comments associated with venue into data object
                var data = JSON.parse(str);
                var venues = data['response']['venues'];
                // var commentList = getCommentList(venues);
                // var viewList = getViewList(venues);
                for (var i = 0; i < venues.length; i++) {
                    var venue = venues[i];
                    var location = {};
                    if (venue['location']['address'] && venue['categories'][0]) {
                        // SET FROM DB
                        location['comments'] = [{name: 'Josh', comment: 'I love the city', id: 2}, {name: venue['name'], comment:'comment num 1', id: 1}];
                        location['views'] = 1;
                        // location['comments'] = commentList[i];
                        // location['views'] = viewList[i];


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
