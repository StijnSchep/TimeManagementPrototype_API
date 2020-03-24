const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretkey = require('../assets/variables').secretkey;
const database = require('../database/mysql.dao');
const constants = require('../config/constants');
const logger = require("../config/appconfig").logger;
const auth = require('../controllers/auth.controller');

router.post('/login', async (req, res) => {
  logger.info("/api/auth/login has been called")
  if (!req.body.username || !req.body.password || !req.body.domain) {
    res
      .status(400)
      .json({ message: 'Invalid request' })
      .end();
    return;
  }

  const query = `
    SELECT u.Id as UserId, u.Username, u.Password, u.EmailAddress, e.Firstname, e.Lastname, u.EmployeeId
    FROM Company as c
    JOIN Employee as e on e.CompanyId = c.Id
    JOIN \`User\` as u on u.EmployeeId = e.Id
    WHERE BINARY u.Username = ? AND c.Domain = ?;
    `;

  const inserts = [req.body.username, req.body.domain]

  await database.executePreparedQuery(query, inserts, (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong in the database' })
        .end();
      return;
    }
    if (rows) {
      if (!rows[0]) {
        res.status(204).end();
        return;
      } else {
        bcrypt.compare(req.body.password, rows[0].Password,(err, hashres) => {
          if (hashres) {
            const payload = { 
              username: rows[0].Username, 
              userid: rows[0].UserId
            };
            jwt.sign(payload, secretkey, {expiresIn: "14d"}, (err, token) => {
              if (err) {
                res.status(500).json({ message: 'Something went wrong..' });
                return;
              } else {
                //nog aanpassen
                res.status(200).json({
                  token: token,
                  user: {
                    firstname: rows[0].Firstname,
                    lastname: rows[0].Lastname,
                    emailAddress: rows[0].EmailAddress,
                    employeeId: rows[0].EmployeeId
                  }});
                return;
              }
            });
          }
          if (err || !hashres) {
            res
              .status(401)
              .json({ message: 'You are not authorized to enter' });
            return;
          }
        });
      }
    }
  });
});

router.get('/validateToken', auth.validateToken, auth.validateTokenEnd);

module.exports = router;
