const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretkey = require('../assets/variables').secretkey;
const database = require('../database/mysql.dao');
const constants = require('../config/constants');

module.exports = {
    getEmployeeById: (req, res, next) => {
        const userId = req.userid;

        const query = `
        SELECT u.Id as UserId, u.EmailAddress, e.Firstname, e.Lastname, e.Infix, e.Postalcode, e.HouseNumber,
        e.HouseNumberAddition, e.City, e.PhoneNumber, e.MobileNumber, e.Gender, e.BirthDate, e.BirthPlace,
        e.Motherland, e.Nationality, e.MaritalStatus, e.Photo, u.EmployeeId, e.Nickname
        FROM User as u
        JOIN Employee as e on e.Id = u.EmployeeId
        WHERE u.Id = ?
        `;

        const inserts = [userId]

        database.executePreparedQuery(query, inserts, (err, rows) => {
            constants.handleResponse(req, err, rows, res);
        })
    }
}