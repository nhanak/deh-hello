/**
 * Created by Neil on 9/13/2016.
 */
var path = require('path');
var express =require('express');
var bodyParser = require('body-parser')
var stormpath = require('express-stormpath');
var twilio = require('twilio');
var http = require('http').Server(app);
var Curl = require( 'node-libcurl' ).Curl;

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

var cleanNextURI=function(nextPageURI){
    var str = nextPageURI,
        delimiter = '/',
        start = 2;
    try {
        var tokens = str.split(delimiter).slice(start);
    }
    catch(err) {
        return null;
    }
    var result = tokens.join(delimiter);
    return "/"+result;
};

var setupCurl=function(messagesURI){
    var curl = new Curl();
    curl.setOpt( Curl.option.URL, messagesURI );
    curl.setOpt( Curl.option.USERNAME, TWILIO_ACCOUNT_SID );
    curl.setOpt( Curl.option.PASSWORD, TWILIO_AUTH_TOKEN );
    curl.setOpt( Curl.option.SSL_VERIFYPEER, 0 );
    return curl;
};

var getMessages=function(numberOfMessages,res){
    var messagesURI='https://api.twilio.com/2010-04-01/Accounts/'+String(TWILIO_ACCOUNT_SID)+"/Messages.json?PageSize="+String(numberOfMessages)+"&Page=0";
    var conversations = [];
    console.log("The URI for curling is: "+messagesURI);
    //SETUP CURL STUFF
    var curl = new setupCurl(messagesURI);
    curl.on( 'end', function( statusCode, body, headers ) {
        //work with response data
        var data = JSON.parse(body);
        data.messages.forEach(function (message) {
            //check if convo exists, create it if necessary
            checkConversationExists(conversations, message);
            //add message to a conversation
            addMessageToConversation(conversations, message)
        });
        var nextPageURI = cleanNextURI(data.next_page_uri);
        nextPageURI = 'https://api.twilio.com/2010-04-01'+nextPageURI;
        getMessagesAtNextURI(conversations,nextPageURI,res);
        this.close();
    });
    curl.on( 'error', function(){
        console.log("There was an error while cURLing");
        curl.close.bind( curl );
    } );
    curl.perform();
};

var getMessagesAtNextURI=function(conversations, nextPageURI,res) {
    var curl = setupCurl(nextPageURI);
    curl.on( 'end', function( statusCode, body, headers ) {
        //work with response data
        try {
            var data = JSON.parse(body);
        }
        catch(err){
            console.log('We have hit the end of the pages, proof: '+body);
            conversations.forEach(function(conversation){
                conversation.messages.reverse();
            });
            this.close();
            res.send(conversations);
            return;
        }
        data.messages.forEach(function (message) {
            //check if convo exists, create it if necessary
            checkConversationExists(conversations, message);
            //add message to a conversation
            addMessageToConversation(conversations, message)
        });
        var nextNextPageURI = data.next_page_uri;
        if (typeof nextNextPageURI !== null){
            console.log("GOING TO THE NEXT PAGE!");
            nextNextPageURI = cleanNextURI(nextNextPageURI);
            nextNextPageURI = "https://api.twilio.com/2010-04-01"+nextNextPageURI;
            getMessagesAtNextURI(conversations, nextNextPageURI,res);
        }
        else{
            console.log("NO MORE PAGES LEFT!");
            //Reverse conversations in the end
            conversations.forEach(function(conversation){
                conversation.messages.reverse();
            });
            //remove all conversations with no in them
            //conversations=getPositiveConversations(conversations);
            res.send(conversations);
        }
        this.close();
    });
    curl.on( 'error', function(){
        console.log("There was an error while cURLing");
        curl.close.bind( curl );
    } );
    curl.perform();
};

var getPositiveConversations=function(conversations){
    positiveConversations = [];
    conversations.forEach(function(conversation){
        if ((conversation.messages.length==2)&&(conversation.messages[1].body.toLowerCase()!=="no")){
            positiveConversations.push(conversation)
        }
        if ((conversation.messages.length>2)){
            positiveConversations.push(conversation)
        }
    });
    return positiveConversations;
};

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
