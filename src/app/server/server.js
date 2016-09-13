/**
 * Created by Neil on 9/13/2016.
 */
var path = require('path');
var express =require('express');
var bodyParser = require('body-parser')
var stormpath = require('express-stormpath');

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//use stormpath
app.use(stormpath.init(app, {
    web: {
        spa: {
            enabled: true,
            view: path.resolve(__dirname, '../../../', 'build/index.html')
        }
    }
}));

app.use(express.static('../../../build'));

app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../../../', 'build/index.html'));
});

var startServer = function(){
    var port = 3000;
    console.log('The server is listening on: '+port)
    app.listen(port);
};

//wait for stormpath, then start server
app.on('stormpath.ready', function () {
    console.log('Stormpath is ready');
    startServer();
});
