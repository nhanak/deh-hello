/**
 * Created by Neil on 9/13/2016.
 */
var path = require('path');
var express =require('express');
var bodyParser = require('body-parser')
var stormpath = require('express-stormpath');
var twilio = require('twilio');

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//use stormpath
app.use(stormpath.init(app, {
    web: {
        spa: {
            enabled: true,
            view: path.resolve(__dirname, '../../../', 'build/index.html')
        },
        register: {
            enabled: false
        }
    }
}));
//TWILIO
//require the Twilio module and create a REST client
var TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN;
var TWILIO_PHONE_NUMBER=process.env.TWILIO_PHONE_NUMBER;
var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

var sendTwilioMessage=function(recipient,message){
    client.messages.create({
        to: recipient,
        from: TWILIO_PHONE_NUMBER,
        body: message,
    }, function(err, message) {
        console.log(message.sid);
    });
};


//END TWILIO
app.use(express.static('../../../build'));

app.post('/api/messages',function(req,res){
    var recipients = req.body.recipients;
    var message = req.body.message;
    for (var recipient in recipients){
        console.log('User wants to message: '+recipients[recipient]);
        console.log('with message'+message);
        //sendTwilioMessage(recipients[recipient],message);
    }
    res.sendStatus(200);
});

//Required Stompath path
app.post('/me', bodyParser.json(), stormpath.loginRequired, function (req, res) {
    function writeError(message) {
        res.status(400);
        res.json({ message: message, status: 400 });
        res.end();
    }

    function saveAccount() {
        req.user.givenName = req.body.givenName;
        req.user.surname = req.body.surname;
        req.user.email = req.body.email;

        req.user.save(function (err) {
            if (err) {
                return writeError(err.userMessage || err.message);
            }
            res.end();
        });
    }

    if (req.body.password) {
        var application = req.app.get('stormpathApplication');

        application.authenticateAccount({
            username: req.user.username,
            password: req.body.existingPassword
        }, function (err) {
            if (err) {
                return writeError('The existing password that you entered was incorrect.');
            }

            req.user.password = req.body.password();

            saveAccount();
        });
    } else {
        saveAccount();
    }
});


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
