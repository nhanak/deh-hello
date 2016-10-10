/**
 * Created by Neil on 9/13/2016.
 */
var path = require('path');
var express =require('express');
var bodyParser = require('body-parser')
var stormpath = require('express-stormpath');
var twilio = require('twilio');
var http = require('http').Server(app);

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
            view: path.resolve(__dirname, '/build/index.html')
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
app.use(express.static('build'));

app.post('/api/messages',stormpath.loginRequired,function(req,res){
    var recipients = req.body.recipients;
    var message = req.body.message;
    for (var recipient in recipients){
        //console.log('User wants to message: '+recipients[recipient]);
        //console.log('with message: '+message);
        sendTwilioMessage(recipients[recipient],message);
    }
    res.sendStatus(200);
});

var getMessages=function(numberOfMessages,res){
    var messagesURI='/Accounts/'+String(TWILIO_ACCOUNT_SID)+"/Messages.json?PageSize="+String(numberOfMessages)+"&Page=0";
    var requestPromise=client.request({
        url: messagesURI,
        method: 'GET'
    });
    requestPromise.then(function(data){
        var conversations = [];
        //work with response data
        data.messages.forEach(function (message) {
            nextPageURI = message.next_page_uri;
            //check if convo exists, create it if necessary
            checkConversationExists(conversations, message);
            //add message to a conversation
            addMessageToConversation(conversations, message)
        });
        //console.log('Conversations looks like: ');
        //console.log(conversations);
        conversations.forEach(function(conversation){
            conversation.messages.reverse();
        });
        res.send(conversations);
    },function(err){
        console.log('There was an error'+JSON.stringify(err));
    });
}

var getNewestMessage=function(callback){
    var messagesURI='/Accounts/'+String(TWILIO_ACCOUNT_SID)+"/Messages.json?PageSize=1&Page=0";
    var requestPromise=client.request({
        url: messagesURI,
        method: 'GET'
    });
    requestPromise.then(function(data){
        var conversations = [];
        //work with response data
        data.messages.forEach(function (message) {
            nextPageURI = message.next_page_uri;
            //check if convo exists, create it if necessary
            checkConversationExists(conversations, message);
            //add message to a conversation
            addMessageToConversation(conversations, message)
        });
        conversations.forEach(function(conversation){
            conversation.messages.reverse();
        });
        console.log('Calling callback...')
        callback(conversations);
    },function(err){
        console.log('There was an error'+JSON.stringify(err));
    });
}

app.get('/api/messages',stormpath.loginRequired,function(req,res){
    var numberOfMessages=500;
    getMessages(numberOfMessages,res);
});

//see if we have a place to put this message
var checkConversationExists=function(conversations,message){
    recipient=getRecipient(message);
    var conversationExists = false;
    conversations.forEach(function(conversation){
        if (conversation.recipient===recipient){
            conversationExists=true;
        }
    });
    if (conversationExists===false){
        conversations.push(createConversation(message));
    }
};

//if conversation does not exist create it
var createConversation=function(message){
    return({
        recipient:getRecipient(message),
        messages:[]
    });

};

//returns who the recipient is in the conversation
var getRecipient=function(message){
    if (message.from===TWILIO_PHONE_NUMBER){
        return message.to;
    }
    else{
        return message.from;
    }
};

//add message to a conversation
var addMessageToConversation=function(conversations,message){
    var recipient=getRecipient(message);
    conversations.forEach(function(conversation){
        if (conversation.recipient===recipient){
            //console.log('The message is: ');
            //console.log(message);
            var themOrUs='';
            if (message.from===TWILIO_PHONE_NUMBER){
                themOrUs='us'
            }
            else{
                themOrUs='them'
            }
            conversation.messages.push({body: message.body, from: themOrUs, date:message.date_sent, them:recipient});
        }
    });


};
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
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

var getIncomingRecipient=function(bodyObject){
    if (bodyObject.From===TWILIO_PHONE_NUMBER){
        return bodyObject.To;
    }
    else{
        return bodyObject.From;
    }
};

var getIncomingThemOrUs=function(bodyObject){
    var themOrUs='';
    if (bodyObject.From===TWILIO_PHONE_NUMBER){
        themOrUs='us';
    }
    else{
        themOrUs='them';
    }
    return themOrUs;
};

var startServer = function(){
    var port = 3000;
    console.log('The server is listening...');
    var server = app.listen(process.env.PORT || port);
    var io = require('socket.io').listen(server);
    //use socket.io
    io.on('connection', function(socket){
        console.log('a user connected');
    });
    //twilio will notify us that we are recieving a message
    //conversation.messages.push({body: message.body, from: themOrUs, date:message.date_sent, them:recipient});
    app.post('/api/incoming', function(req,res){
        //console.log('The request body appears to be...');
        //console.log(req.body);
        var thisRecipient = getIncomingRecipient(req.body);
        var themOrUs = getIncomingThemOrUs(req.body);
        var nowDate = new Date();
        var conversation = [{recipient:thisRecipient,messages:[{body:req.body.Body,from:themOrUs,date:nowDate,them:thisRecipient}]}];
        //console.log('Got newest message!');
        //console.log(JSON.stringify(conversation));
        io.emit('new message', conversation);
        var twiml = new twilio.TwimlResponse();
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });
};

//wait for stormpath, then start server
app.on('stormpath.ready', function () {
    console.log('Stormpath is ready');
    startServer();
});
