const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const constants = require('../src/config/constants');
const database = require('../src/database/mysql.dao');
const bcrypt = require('bcryptjs');

describe("worked hours endpoint tests", () => {
    let token = '';
    beforeEach((done) => {
        bcrypt.hash('nietbitchen', 10, (err, hash) => {
            if (hash) {
                database.executeQuery(constants.queryForAllWorked_hours(hash), (err, callback) => {
                    if (err) {
                        console.log('providing data in tables failed: ');
                    }
                    if (callback) {
                        console.log('tables are filled');
                    }
                    done();
                });
            }
            if (err) {
                console.log(err);
                console.log('Something went wrong with hashing password');
            }
        });
    });

    it('GET /api/workedHours should return a list of all the worked hours of all the users with a correct token', async () => {
        const res = await requester
            .post('/api/auth/login')
            .send({
                username: 'tNuman',
                password: 'nietbitchen',
                domain: '.avans.nl'
            });

        const token = res.body.token;

        const result = await requester
            .get('/api/workedHours')
            .set("Authorization", `Bearer ${token}`);

        expect(result).to.have.status(200);
        expect(result.body).to.have.property('result');
        expect(result.body.result).to.be.an('array');
        expect(result.body.result[0]).to.be.an('object');
        expect(result.body.result[0]).to.have.property("BranchName").equal('Breda')
    });

    it('GET /api/workedHours should give error 401 No authorization header, when no header is been set', async () => {
        const result = await requester
            .get('/api/workedHours');

        expect(result).to.have.status(401);
        expect(result.body).to.have.property(
            'message',
            'No authorization header'
        );
    });

    it('GET /api/workedHours should get error 401 when send an incorrect token', async () => {
        const result = await requester
            .get('/api/workedHours')
            .set("Authorization", `Bearer NOT_CORRECT_TOKEN`);

        expect(result).to.have.status(401);
        expect(result.body).to.have.property(
            'message',
            'Not a valid auth token'
        );
    });

    it('GET /api/workedHours/dashboard should return a list of the latest 5 worked hours of all the users with a correct token', async () => {
        const res = await requester
            .post('/api/auth/login')
            .send({
                username: 'tNuman',
                password: 'nietbitchen',
                domain: '.avans.nl'
            });

        const token = res.body.token;

        const result = await requester
            .get('/api/workedHours/dashboard')
            .set("Authorization", `Bearer ${token}`);

        expect(result).to.have.status(200);
        expect(result.body).to.have.property('result');
        expect(result.body.result).to.be.an('array');
        expect(result.body.result[0]).to.be.an('object');
        expect(result.body.result[0]).to.have.property("BranchName").equal('Breda')
    });

    it('GET /api/workedHours/dashboard should give error 401 No authorization header, when no header is been set', async () => {
        const result = await requester
            .get('/api/workedHours/dashboard');

        expect(result).to.have.status(401);
        expect(result.body).to.have.property(
            'message',
            'No authorization header'
        );
    });

    it('GET /api/workedHours/dashboard should get error 401 when send an incorrect token', async () => {
        const result = await requester
            .get('/api/workedHours/dashboard')
            .set("Authorization", `Bearer NOT_CORRECT_TOKEN`);

        expect(result).to.have.status(401);
        expect(result.body).to.have.property(
            'message',
            'Not a valid auth token'
        );
    });
});
