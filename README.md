[![Build Status](https://travis-ci.org/joemaidman/bloc.svg?branch=master)](https://travis-ci.org/joemaidman/bloc) [![Code Climate Coverage](https://codeclimate.com/github/joemaidman/bloc/badges/coverage.svg)](https://codeclimate.com/github/joemaidman/bloc)

![Logo](https://github.com/joemaidman/bloc/blob/master/screenshots/logo.png)
Bloc is a full stack, isometric, multiplayer building game inspired by lego and Minecraft.

It is a full stack javascript app built with Node.js and Socket-io.

The game is live and can be played at https://bloc-game.herokuapp.com


# User stories
```
MVP
As a game
So that I can exist
I want to display a block on a canvas in the browser

Version 2
As a player
So that I can make a structure
I want to put down a block when I left click the mouse

As a game
So that players can connect
I want to serve the index page on a server

As a shape
So that I can set and report my position
I want to have an X, Y and Z coordinate

As a shape
So that I can be different colours
I want to have a red, green and blue value
```
[Full list of user stories...](https://github.com/joemaidman/bloc/blob/master/user-stories.md)

## Screenshots
**Homepage**

![home](https://github.com/joemaidman/bloc/blob/master/screenshots/home.png)

**A small game**

![A small game](https://github.com/joemaidman/bloc/blob/master/screenshots/small.png)

**A large game**
![A large game with two players](https://github.com/joemaidman/bloc/blob/master/screenshots/large.png)

**A complete build**

![A complete build](https://github.com/joemaidman/bloc/blob/master/screenshots/complete.png)

## Technologies & tools
**Backend**
- Node.js: an open-source, cross-platform JavaScript runtime environment
- Webpack: a JavaScript module bundler
- Socket.io: a JavaScript library that allows for realtime communication between web clients and servers

**Frontend**
- Bootstrap: a front-end web framework for designing websites
- Socket.io: a JavaScript library that allows for realtime communication between web clients and servers
- isomer.js : an isometric graphics library for HTML5 canvas

**Database & authentication**
- MongoDB: an open source database that uses a document-oriented data model
- Passport.js: an authentication middleware for Node

**Testing & coverage**
- Mocha: a feature-rich JavaScript test framework
- Chai: a unit testing assertion library
- Sinon: a testing library for mocking and stubbing
- sinon-chai: a package to use Chai assertions with Sinon
- Timekeeper: a module to mock the Date class for testing
- Istanbul: a JavaScript code coverage tool

**Deployment**
- Heroku

**Tools**
- Trello: a collaborative project management tool

## Installation
- Clone the repo
- `cd` to the project folder
- Run `npm install`
- Run `brew install mongodb` and ensure Mongo is available locally on port 27017
- Create a local MongoDB called `bloc`
- You will need a Facebook App ID and Secret to enable Facebook sign in. This can be set up via Facebook Developers. Create a new app and set the site URL to http://localhost:8080. Create a `.env` file in the root directory including the following:
```
FACEBOOK_CLIENT_ID=[Your facebook app ID]
FACEBOOK_CLIENT_SECRET=[Your facebook app secret]
```

To test:
- Run `npm test`

To run the application locally:
- Run `node server.js`
- Visit http://localhost:8080/

## Potential feature improvements
* Refactor and test socket-io communication layer
* Refactor client javascript to MVC pattern
* Extract trigonometry to geometry library
* Improve responsiveness of design

## Credits
Bloc was built by [Sophie Mclean](https://github.com/Sophie5), [Christos Paraskeva](https://github.com/Christos-Paraskeva), [Ryan Chu](https://github.com/azntastic) and [Joe Maidman](https://github.com/joemaidman) as a final project for the February 2017 cohort at Makers Academy.
