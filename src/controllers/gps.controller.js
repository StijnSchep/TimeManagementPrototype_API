const database = require('../database/mysql.dao');
const constants = require('../config/constants');
const logger = require('../config/appconfig').logger

module.exports = {
    validateGPS: async (req, res, next) => {
        let longitudeIn = req.body.longitude;
        let latitudeIn = req.body.latitude;

        console.log()
        logger.info('id: ' + req.body.branchId)

        const query =
        `SELECT b.Longitude as Longitude, b.Latitude as Latitude 
        FROM Branch as b
        WHERE b.Id = ?`;

        const inserts = [req.body.branchId];

        await database.executePreparedQuery(query, inserts, (err, rows) => {
          if (!handleError(err, rows, res)) {
            logger.info('longIn: ' + longitudeIn + ' latIn: ' + latitudeIn)
            logger.info('longDb: ' + rows[0].Longitude + ' latDb: ' + rows[0].Latitude)
            if( checkGPS(longitudeIn, rows[0].Longitude) && checkGPS(latitudeIn, rows[0].Latitude) ){
              logger.info("Correct coordinates");
              next();
            } else {
              logger.error("Invalid coordinates");
              res
                .status(500)
                .json({ message: 'Wrong coordinates' })
                .end();
              }
            }
          }
        )
    }
}

function checkGPS(coordinateIn, coordinateOut){
    //0.0011454 equals 300 meters
    let coordinateMin = +coordinateIn - 0.0011454;
    let coordinateMax = +coordinateIn + 0.0011454;
    return coordinateOut > coordinateMin && coordinateOut < coordinateMax;
}

const handleError = (err, rows, res) => {
    if (err) {
      res
        .status(500)
        .json({ message: 'Something went wrong in the database' })
        .end();
      return true;
    }
    if (rows) {
      if (!rows[0]) {
        res.status(204).end();
        return true;
      } else {
        return false;
      }
    }
  };
