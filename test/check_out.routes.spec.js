const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const constants = require('../src/config/constants');
const database = require('../src/database/mysql.dao');
const bcrypt = require('bcryptjs');

describe('Checkout endpoint tests', () => {

    beforeEach(done => {
        bcrypt.hash("nietbitchen", 10, (err, hash) => {
            if (hash) {
                database.executeQuery(
                    constants.queryAllForCheckIn(hash),
                    (err, callback) => {
                    if (err) {
                        console.log("providing data in tables failed: ", err);
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
    })

    it('Should let a user check out', async () => {
        const resLogin = await requester.post("/api/auth/login").send({
            username: "tNuman",
            password: "nietbitchen",
            domain: ".avans.nl"
        });
      
        const token = resLogin.body.token;

        // Checkin with token and location
        let result = await requester.post('/api/checkIn').set("Authorization", `Bearer ${token}`).send({
            longitude: "10.00000000000001",
            latitude: "5.00000000000001",
            branchId: "1",
            departmentId: "1",
            dateCorrectFormat: "2019-12-19",
            startTime: "08:50:00"
        });

        expect(result).to.have.status(200);

        // Check user out
        result = await requester.patch('/api/checkOut').set("Authorization", `Bearer ${token}`).send({
            branchId: "1",
            departmentId: "1",
            endTime: "09:50:00",
            pause: 30
        });

        expect(result).to.have.status(200);
    })
})
