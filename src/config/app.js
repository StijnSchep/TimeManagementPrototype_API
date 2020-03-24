const logger = require('./appconfig').logger;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthenticationRoutes = require('../../src/routes/auth.routes');
const EmployeeRoutes = require('../routes/employee.routes');
const WorkedHoursRoutes = require('../routes/worked_hours.routes');
const CompanyRoutes = require('../routes/company.routes');
const checkInRoutes = require('../routes/check_in.routes'); 
const checkOutRoutes = require('../routes/check_out.routes'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

const port = process.env.PORT || 3000;

app.use('/api/auth', AuthenticationRoutes);
app.use('/api/employee', EmployeeRoutes);
app.use('/api/workedHours', WorkedHoursRoutes);
app.use('/api/company', CompanyRoutes);
app.use('/api/checkIn', checkInRoutes);
app.use('/api/checkOut', checkOutRoutes);


// No endpoint found
app.all('*', (req, res, next) => {
  logger.trace('User connected, but no endpoint was found');
  const errorBody = {
    error: {
      message: 'Endpoint not found',
      code: 404
    }
  };

  next(errorBody);
});

// Error handler
/*
    Required body: {
        details: -> error dump, if necessary
        error: {
            message: -> user friendly message
            code: -> error code
        }

    }
*/
app.use((body, req, res, next) => {
  if (body.details) {
    logger.warn('error handler: ' + body.details);
  }
  res.status(body.error.code).json(body.error);
});

module.exports = app;
