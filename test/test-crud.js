const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('App', function () {

    before(function () {
        // return runServer();
    });
    after(function () {
        // return closeServer();
    });

    it('Should return 200 GET', function () {
        return chai.request(app)
            .get('/')
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});