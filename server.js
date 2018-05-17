'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const { router: usersRouter } = require('./users');
const { router: destRouter } = require('./destinations');
const mongoose = require('mongoose');
const passport = require('passport');
app.use('/api/users/', usersRouter);
app.use('/api/destinations', destRouter);
app.use(express.static('public'));
 
const { PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`App is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };