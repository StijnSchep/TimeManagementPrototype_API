const sql = require('mysql');
const database = require('../../src/database/mysql.dao');
const constants = require('../../src/config/constants');

before(done => {
  done();
});

beforeEach(done => {
  const query = 'DELETE FROM Worked_hours; DELETE FROM Branch_Department; DELETE FROM Department; DELETE FROM Branch; DELETE FROM Employee; DELETE FROM User; DELETE FROM Company;';
  database.executeQuery(query, (err, callback) => {
    if (err) {
      console.log('cleaning the tables failed: ', err);
    }
    done();
  });

  //testvalues:
  //username: richardjongh
  //password: wachtwoord123!
  //companyname: Nostradamus
});
