'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Activity, Destination } = require('../destinations/');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// Seed database with random data

function seedDestinationData() {
    console.info('Seeding destination data');
    let seedData = [];

    for (let i = 0; i <= 10; i++) {
        seedData.push(generateDestinationData());
    }

    console.log(`seedData equals`, JSON.stringify(seedData, null, 4));
    return Destination.insertMany(seedData);
}

// Generate an activity object

function generateActivityData(username) {
    return {
        name: `${faker.hacker.verb()} ${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        url: "",
        user: username
    }
}

// Generate a destination object

function generateDestination(idArray, username) {
    return {
        complete: faker.random.boolean(),
        published: faker.random.boolean(),
        activities: idArray,
        name: faker.address.city(),
        user: username
    };
}

// Generate a destination object

function generateDestinationData() {

    const username = faker.internet.userName();
    let activityArr = []
    const activityQty = Math.ceil(Math.random() * 5);

    for (let i = 0; i < activityQty; i++) {
        activityArr.push(generateActivityData(username))
    }

    Activity.insertMany(activityArr)
        .then(resArray => {
            let idArray = [];
            for (let res of resArray) {
                idArray.push(res._id);
            };
            return generateDestination(idArray, username);
        })
        .catch(err => {
            throw err;
        })
}

// Delete the database

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Destination Diary API', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function () {
        return seedDestinationData();
    })
    afterEach(function () {
        return tearDownDb();
    })
    after(function () {
        return closeServer();
    });

    // describe('User GET endpoint'), function () {

    it('Should have status OK', function () {
        return chai.request(app)
            .get('/api/destinations')
            .then(function (res) {
                console.log(`res equals`, res);
                expect(res).to.have.status(200);
            });
    });
    // }
});
