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
npm start
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
cd <project folder>/src/app/server
node server
```

## Description of [Webpack](http://webpack.github.io/docs/)

Webpack is a module bundler that we are using to run our documentation site.
This is a quick overview of how the configuration file works.

### Webpack Configuration:

#### Entry

Webpack creates entry points for the application to know where it starts.

#### Output

This is where the bundled project will go to and any other files necessary for it to run.

#### Plugins

These are plugins Webpack uses for more functionality.
The HTML Webpack Plugin, for example, will add the index.html to your build folder.

#### Modules

Modules and other things that are required will usually need to be loaded and interpreted by Webpack when bundling, and this is where Webpack looks for the different loaders.
*Loading .js files in es6 and es7 will require a loader like babel-loader to interpret the files into es5.
