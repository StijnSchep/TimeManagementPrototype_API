const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const constants = require('../src/config/constants');
const database = require('../src/database/mysql.dao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('authentication endpoints tests', () => {

  beforeEach((done) => {
    bcrypt.hash('nietbitchen', 10, (err, hash) => {
      if (hash) {
        database.executeQuery(constants.queryAllForLogin(hash), (err, callback) => {
          if (err) {
            console.log('providing data in tables failed:', err);
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

  it('POST /api/auth/login should return a token when domain, username and password is correct', async () => {
    const requestBody = {
      domain: '.avans.nl',
      username: 'tNuman',
      password: 'nietbitchen'
    };

    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(200);
    expect(result.body).to.have.property('token');
    expect(result.body).to.have.property('user');
  });

  it('POST /api/auth/login should return status code 401 when password is wrong', async () => {
    const requestBody = {
      domain: '.avans.nl',
      username: 'tNuman',
      password: 'pannenkoek'
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property(
      'message',
      'You are not authorized to enter'
    );
  });

  it('POST /api/auth/login should return status code 204 when the username is not known in the database', async () => {
    const requestBody = {
      domain: '.avans.nl',
      username: 'Banaaaaaaaaaaaaaaaaaaaaaaaaaan',
      password: 'nietbitchen'
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    console.log(result.body);

    expect(result).to.have.status(204);
  });

  it('POST /api/auth/login should return status code 400 when the body is empty', async () => {
    const requestBody = {};

    const result = await requester.post('/api/auth/login').send(requestBody);
    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'Invalid request');
  });

  it('POST /api/auth/login should return status 400 when no body is sent', async () => {
    const result = await requester.post('/api/auth/login');
    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'Invalid request');
  });

  it.skip('POST /api/auth/login should return status code 401 when the combination username/password and domain is wrong', async () => {
    const requestBody = {
      domain: 'Nostra',
      username: 'tNumani',
      password: 'banaan'
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property(
      'message',
      'You are not authorized to enter'
    );
  });

  it('POST /api/auth/login should return status code 400 when the domain is missing', async () => {
    const requestBody = {
      username: 'tNuman',
      password: 'nietbitchen'
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'Invalid request');
  });

  it('POST /api/auth/login should return status code 400 when the username is missing', async () => {
    const requestBody = {
      domain: '.avans.nl',
      password: 'nietbitchen'
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'Invalid request');
  });

  it('POST /api/auth/login should return status code 400 when the password is missing', async () => {
    const requestBody = {
      domain: '.avans.nl',
      username: 'tNuman',
    };
    const result = await requester.post('/api/auth/login').send(requestBody);

    expect(result).to.have.status(400);
    expect(result.body).to.have.property('message', 'Invalid request');
  });
});
