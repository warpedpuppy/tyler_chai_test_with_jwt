'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const request = require('supertest');
const expect = chai.expect;
const auth_router = require('../auth/router');
const { Activity, Destination } = require('../destinations/');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
chai.use(chaiHttp);
describe('Destination Diary API', function () {


    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function () {
        //return seedDestinationData();
    })
    afterEach(function () {
        // return tearDownDb();
    })
    after(function () {
        return closeServer();
    });

    describe('User GET endpoint', function () {
        it('Should return all destinations for the current user', function () {
            let testing_token =  auth_router.createAuthToken({username: 'testing'})
            // console.log('testing_token = ', testing_token)
            return chai.request(app)
                .get('/api/destinations')
                .set('Authorization', `bearer ${testing_token}`)
                .then(function (res) {
                     expect(res).to.have.status(200);
                     expect(res).to.be.a('object');
                })
        })

    });
})

