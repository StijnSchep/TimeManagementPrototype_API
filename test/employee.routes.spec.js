const chai = require("chai");
const expect = chai.expect;
const requester = require("../test/config/requester.test");
const constants = require("../src/config/constants");
const database = require("../src/database/mysql.dao");
const bcrypt = require("bcryptjs");

describe("employee endpoints tests", () => {
  beforeEach(done => {
    bcrypt.hash("nietbitchen", 10, (err, hash) => {
      if (hash) {
        database.executeQuery(
          constants.queryAllForLogin(hash),
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

  it("GET /api/employee should return the details of an employee", async () => {
    const res = await requester.post("/api/auth/login").send({
      username: "tNuman",
      password: "nietbitchen",
      domain: ".avans.nl"
    });

    const token = res.body.token;

    const result = await requester
      .get(`/api/employee`)
      .set("Authorization", `Bearer ${token}`);

    expect(result).to.have.status(200);
    expect(result.body.result[0])
      .to.have.property("Firstname")
      .equal("Tesssa");
    expect(result.body.result[0])
      .to.have.property("EmailAddress")
      .equal("tessa@avans.nl");
    expect(result.body.result[0]).to.have.property("UserId");
    expect(result.body.result[0]).to.have.property("EmployeeId");
    expect(result.body).to.have.property('token');
  });

  it("GET /api/employee should not return the details of an employee if a wrong token is given", async () => {
    const res = await requester.post("/api/auth/login").send({
      username: "tNuman",
      password: "nietbitchen",
      domain: ".avans.nl"
    });

    const result = await requester
      .get(`/api/employee`)
      .set("Authorization", `Bearer WRONG TOKEN`);

    expect(result).to.have.status(401);
    expect(result.body).to.have.property("message", "Not a valid auth token");
  });

  it("GET /api/employee should not return details if user is not logged in", async () => {
    const result = await requester
      .get(`/api/employee`);

    expect(result).to.have.status(401);
  });
  
});
