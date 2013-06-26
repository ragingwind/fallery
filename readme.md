# FALLERY
*WARN THIS PROJECT STILL CONCEPT VERSION. IT MAY HAS A SOME PROBLEM.*

fallery, make own facebook gallery on big-screen. it's built up on [backbone.tv](https://github.com/ragingwind/backbone.tv). this project can be run on both [yeoman 0.9.6 express-stack](https://github.com/yeoman/yeoman/tree/express-stack) or foreman of heroku. you can choose either to develop the project.

## DEMO
you can use the [live demo](http://fallery.herokuapp.com) or watch the [youtube video](http://www.youtube.com/watch?v=JyMTakoxYew)

# SETUP
## ENV

    // create .env file at base path of app and put your facebook client id and
    // secret into .env file. see the sample below.
    FACEBOOK_CLIENTID=$YOUR_FACEBOOK_CLIENTID
    FACEBOOK_SECRET=$YOUR_FACEBOOK_SECRET

## config.js
this project using [node-settings](git://github.com/mgutz/node-settings). you should change to ip and port what you want use. config.js is at /server. note that yeoman using 3501 port number internally.

## YEOMAN - EXPRESS-STACK
### INSTALL YEOMAN 0.9.6 and grunt 3.X

    // clone project and checkout express-stack
    git clone git://github.com/yeoman/yeoman.git
    cd yeoman
    git checkout express-stack

    // install yeoman 0.9.6 and grunt
    npm install -g yeoman@0.9.6
    npm install -g grunt@3.x.x

    // add yeoman custom cli path to your system path. here is sample for you
    export PATH=$PATH:$HOME/yeoman/yeoman-custom/cli/bin/

    // run with yeoman command (not yeom'a'n)
    yeomem server

## HEROKU (NODE.JS)
if you want to use heroku? you shoud create a new app on heroku. after then you should install [heroku toolbelt](https://toolbelt.heroku.com/).

    // run with foreman
    foreman start

    // add env properties to heroku
    heroku config:set NODE_ENV=production
    heroku config:add FACEBOOK_CLIENTID=$YOUR_FACEBOOK_CLIENTID
    heroku config:add FACEBOOK_SECRET=$YOUR_FACEBOOK_SECRET

    // deploy application to heroku
    heroku git@heroku.com:$YOUR-APP-NAME.git
    git push heroku master


## TROUBLESHOOTING

- redirect_uri error from facebook
check your url in config.js or make sure using same redirect url with development and production environment.

# LICENCE - MIT
Copyright (c) 2013 MOONANDYOU
