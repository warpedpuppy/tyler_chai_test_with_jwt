'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var path = require('path');
var appDir = path.dirname(require.main.filename);
const config = require('../config');
const router = express.Router();

const createAuthToken = function (user) {
  console.log("createAuthToken has been hit")
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
router.createAuthToken = createAuthToken;

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());

router.post('/login-test', (req, res) => {
  console.log('login-test ')
  // const authToken = createAuthToken(req.user.serialize());
  // const jwtAuth = passport.authenticate('jwt', { session: false });
  // res.json({ authToken, user: req.user });
});

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  const jwtAuth = passport.authenticate('jwt', { session: false });
  res.json({ authToken, user: req.user });
});


const jwtAuth = passport.authenticate('jwt', { session: false });
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.get('/app_protected', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  console.log(`${req.user.username} is logged in.`);
  res.json({ authToken });
});

module.exports = { router, createAuthToken };
