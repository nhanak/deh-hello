# deh-hello
Twilio powered mass messaging WebApp (Node.js, React, MongoDB).

## Installation

After cloning the repository, install dependencies:
```sh
cd <project folder>
npm install
```

Now you can run your local dev server:
```sh
npm run devStart
```
Server is located at http://localhost:3000

Note: To allow external viewing of the demo, change the following value in `webpack-dev-server.config.js`
```
host: 'localhost'  //Change to '0.0.0.0' for external facing server
```

As this application uses Stormpath and Twilio, you will have to set up your environment variables. In Windows Powershell:
```sh
$env:STORMPATH_CLIENT_APIKEY_ID=YOUR_ID_HERE
$env:STORMPATH_CLIENT_APIKEY_SECRET=YOUR_SECRET_HERE
$env:STORMPATH_APPLICATION_HREF=YOUR_APP_HREF
$env:TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACC_SID_HERE
$env:TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN_HERE
$env:TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE
```

To run the production version of this application:
```sh
cd <project folder>
webpack -p --config webpack-production.config.js
npm start
```