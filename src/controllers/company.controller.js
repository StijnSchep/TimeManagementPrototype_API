const database = require('../database/mysql.dao');
const constants = require('../config/constants');

module.exports = {
    getAllDomains: async (req, res, next) => {
        const query =
            `SELECT c.Domain FROM Company as c`;

        await database.executeQuery(query, (err, rows) => {
            constants.handleResponse(req, err, rows, res);
        })
    }
}
