const sql = require('mysql');
const config = require('../config/appconfig');

const logger = config.logger;
const dbconfig = config.dbconfig;

module.exports = {
  executeQuery: (query, callback) => {
    const connection = sql.createConnection(dbconfig);

    connection.connect(err => {
      if (err) {
        logger.error(err.message);
      }
      connection.query(query, (err, result) => {
        if (err) {
          logger.error('error', err.toString());
          callback(err, null);
          connection.destroy();
          return;
        }
        if (result) {
          callback(null, result);
          connection.destroy();
          return;
        }
      });
    });
  },
  executePreparedQuery: (query, inserts, callback) => {
    const connection = sql.createConnection(dbconfig);

    query = sql.format(query, inserts)

    connection.connect(err => {
      if (err) {
        logger.error(err.message);
      }
      connection.query(query, (err, result) => {
        if (err) {
          logger.error('error', err.toString());
          callback(err, null);
          connection.destroy();
          return;
        }
        if (result) {
          callback(null, result);
          connection.destroy();
          return;
        }
      });
    });
  }
};
