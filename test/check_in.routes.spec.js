const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const constants = require('../src/config/constants');
const database = require('../src/database/mysql.dao');
const bcrypt = require('bcryptjs');

describe("Check_in endpoint tests", () => {
    let branchId;
    let departmentId;

    beforeEach((done) => {
        bcrypt.hash("nietbitchen", 10, (err, hash) => {
          if (hash) {
            database.executeQuery(
              constants.queryAllForCheckIn(hash),
              (err, callback) => {
                if (err) {
                  console.log("providing data in tables failed: ");
                }
                if (callback) {
                  console.log("tables are filled");
                }
                done();
              }
            );
          }
          if (err) {
            console.log(err);
            console.log("Something went wrong with hashing password");
          }
        });
    });


    it('POST checkin will succeed with correct token and location', async () => {
        //Login in of user to get token
        const resLogin = await requester.post("/api/auth/login").send({
            username: "tNuman",
            password: "nietbitchen",
            domain: ".avans.nl"
          });
      
        const token = resLogin.body.token;
        console.log('logged in')

        //Checkin with token and location
        const result = await requester.post('/api/checkIn').set("Authorization", `Bearer ${token}`).send({
            longitude: "10.00000000000001",
            latitude: "5.00000000000001",
            branchId: "1",
            departmentId: "1",
            dateCorrectFormat: "2019-12-19",
            startTime: "08:50:00"
          });

        expect(result).to.have.status(200);
        expect(result.body).to.have.property('result');
        expect(result.body.result).to.be.an('object');
        expect(result.body.result).to.have.property('longitude').equal('10.00000000000001');
        expect(result.body.result).to.have.property('latitude').equal('5.00000000000001');
    });

    it('POST checkin will not succeed with correct token and wrong location', async () => {
        //Login in of user to get token
        const resLogin = await requester.post("/api/auth/login").send({
            username: "tNuman",
            password: "nietbitchen",
            domain: ".avans.nl"
          });
      
          const token = resLogin.body.token;

          //Checkin with token and wrong location
        const resCheck = await requester.post('/api/checkIn').set("Authorization", `Bearer ${token}`).send({
            longitude: "11.00000000000001",
            latitude: "6.00000000000001",
            branchId: "1",
            departmentId: "1",
            dateCorrectFormat: "2019-12-19",
            startTime: "08:50:00"
          });

        console.log(resCheck.body)
        expect(resCheck).to.have.status(500);
        expect(resCheck.body).to.have.property('message').equal('Wrong coordinates');
    });

    it('GET all branches with departments should return a list with status 200', async () => {
      // Login in of user to get token
      const resLogin = await requester.post("/api/auth/login").send({
        username: "tNuman",
        password: "nietbitchen",
        domain: ".avans.nl"
      });
  
      const token = resLogin.body.token;
      const result = await requester.get('/api/checkIn').set("Authorization", `Bearer ${token}`)

      expect(result).to.have.property('body');
      expect(result.body).to.have.property('result');
      expect(result.body.result[0]).to.have.property('BranchId').that.equals(1);
      expect(result.body.result[0]).to.have.property('BranchName').that.equals("Breda");

    })

})
