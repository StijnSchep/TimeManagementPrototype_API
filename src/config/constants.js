module.exports = {
  handleResponse: (req, err, rows, res) => {
    if (!handleError(err, rows, res)) {
      if (req.token) {
        res.status(200).json({ result: rows, token: req.token });
      } else {
        res.status(200).json({ result: rows });
      }
    }
  },
  handePostResponse: (err, body, res) => {
      if (err) return res.status(500).json({ err });
      else return res.status(200).json({ result: body });
  },
  hasErr: (err, rows, res) => {
    return handleError(err, rows, res);
  },
  handleWorkedHoursResponse: (req, err, rows, res) => {
    if ( !handleError(err, rows, res) ) {
      for ( let i = 0; i < rows.length; i++ ) {
        let wh = rows[i];
        let pause = wh.Pause;
        let pauseMin = pause % 60;
        let pauseHour = Math.floor(pause / 60);

        if ( wh.EndTime !== null ) {
          let start = wh.StartTime.split(':');
          let end = wh.EndTime.split(':');
          let startHour = +start[0];
          let startMin = +start[1];
          let endHour = +end[0];
          let endMin = +end[1];

          let hours = endHour - startHour;
          if (endHour < startHour) {
            hours = 24 - (startHour - endHour);
          }
          let minutes = endMin - startMin;
          if (endMin < startMin) {
            minutes = 60 - (startMin - endMin);
            hours--;
          }

          hours -= pauseHour;
          if (minutes < pauseMin) {
            hours--;
            minutes = 60 - (pauseMin - minutes);
          } else {
            minutes -= pauseMin;
          }

          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          rows[i].Worked = hours + ":" + minutes;
        }

        if ( pauseMin < 10 ) {
          pauseMin = '0' + pauseMin;
        }
        rows[i].Pause = pauseHour + ":" + pauseMin;
      }

      if ( req.token ) {
        res.status(200).json({ result: rows, token: req.token});
      } else {
        res.status(200).json({ result:rows });
      }
    }
  },

  // Query for inserting test data
  queryAllForLogin: hash => {
    return (
      'INSERT INTO `fjQh5Ejw6Y`.`Company`\n' +
      '(`Name`,' +
      '`Domain`)\n' +
      'VALUES\n' +
      "('Avans'," +
      "'.avans.nl');\n" +
      '\n' +
      'INSERT INTO `fjQh5Ejw6Y`.`Employee`\n' +
      '(`Firstname`,\n' +
      '`Lastname`,\n' +
      '`Infix`,\n' +
      '`Postalcode`,\n' +
      '`HouseNumber`,\n' +
      '`HouseNumberAddition`,\n' +
      '`City`,\n' +
      '`PhoneNumber`,\n' +
      '`MobileNumber`,\n' +
      '`EmailAddress`,\n' +
      '`Gender`,\n' +
      '`BirthDate`,\n' +
      '`BirthPlace`,\n' +
      '`Motherland`,\n' +
      '`Nationality`,\n' +
      '`MaritalStatus`,\n' +
      '`Photo`,\n' +
      '`CompanyId`)\n' +
      'VALUES\n' +
      "('Tesssa',\n" +
      "'Numan',\n" +
      'null,\n' +
      "'4000 AB',\n" +
      '8,\n' +
      'null,\n' +
      "'Breda',\n" +
      "'0762345677',\n" +
      "'0623456789',\n" +
      "'tessa@avans.nl',\n" +
      "'Male',\n" +
      "'1990-01-01',\n" +
      "'Breda',\n" +
      "'Nederland',\n" +
      "'Nederland',\n" +
      "'Niet Gehuwd',\n" +
      '0,\n' +
      "(SELECT c.Id from Company as c where c.Name = 'Avans'));\n" +
      '\n' +
      'INSERT INTO `fjQh5Ejw6Y`.`User`\n' +
      '(`Username`,\n' +
      '`Password`,\n' +
      '`EmailAddress`,\n' +
      '`EmployeeId`)\n' +
      'VALUES\n' +
      "('tNuman',\n" +
      "'" +
      hash +
      "',\n" +
      "'tessa@avans.nl',\n" +
      "(SELECT e.Id from Employee as e where e.EmailAddress = 'tessa@avans.nl'));"
    );
  },

  // Query for inserting worked hours
  queryForAllWorked_hours: hash => {
    return `INSERT INTO \`fjQh5Ejw6Y\`.\`Company\`
                (\`Name\`,
                \`Domain\`)
                VALUES
                ('Avans',
                '.avans.nl');
                
                INSERT INTO \`fjQh5Ejw6Y\`.\`Employee\`
                (\`Firstname\`,
                \`Lastname\`,
                \`Infix\`,
                \`Postalcode\`,
                \`HouseNumber\`,
                \`HouseNumberAddition\`,
                \`City\`,
                \`PhoneNumber\`,
                \`MobileNumber\`,
                \`EmailAddress\`,
                \`Gender\`,
                \`BirthDate\`,
                \`BirthPlace\`,
                \`Motherland\`,
                \`Nationality\`,
                \`MaritalStatus\`,
                \`Photo\`,
                \`CompanyId\`)
                VALUES
                ('Tesssa',
                'Numan',
                null,
                '4000 AB',
                8,
                null,
                'Breda',
                '0762345677',
                '0623456789',
                'tessa@avans.nl',
                'Male',
                '1990-01-01',
                'Breda',
                'Nederland',
                'Nederland',
                'Niet Gehuwd',
                0,
                (SELECT c.Id from Company as c where c.Name = 'Avans'));
                
                INSERT INTO \`fjQh5Ejw6Y\`.\`User\`
                (\`Username\`,
                \`Password\`,
                \`EmailAddress\`,
                \`EmployeeId\`)
                VALUES
                ('tNuman',
                '${hash}',
                'tessa@avans.nl',
                (SELECT e.Id from Employee as e where e.EmailAddress = 'tessa@avans.nl'));

                INSERT INTO \`fjQh5Ejw6Y\`.\`Branch\`
                (\`Name\`,
                \`CompanyId\`,
                \`Latitude\`,
                \`Longitude\`)
                VALUES
                ('Breda',
                (SELECT c.Id FROM Company as c WHERE c.Name = 'Avans'),
                '10.00000000000001',
                '5.00000000000001');
                
                INSERT INTO \`fjQh5Ejw6Y\`.\`Department\`
                (\`Name\`)
                VALUES
                ('Informatica');
                
                INSERT INTO \`fjQh5Ejw6Y\`.\`Branch_Department\`
                (\`BranchId\`,
                \`DepartmentId\`)
                VALUES
                ((SELECT b.Id FROM Branch as b WHERE b.Name = 'Breda'),
                (SELECT d.Id FROM Department as d WHERE d.Name = 'Informatica'));
                
                INSERT INTO \`fjQh5Ejw6Y\`.\`Worked_hours\`
                (\`UserId\`,
                \`Branch_DepartmentId\`,
                \`Date\`,
                \`StartTime\`,
                \`EndTime\`,
                \`Pause\`)
                VALUES
                ((SELECT u.Id FROM \`User\` as u WHERE u.Username = 'tNuman'),
                (SELECT bd.Id FROM Branch_Department as bd WHERE bd.BranchId = (SELECT b.Id FROM Branch as b WHERE b.Name = 'Breda')),
                curdate(),
                '02:55',
                '08:35',
                123);`;
  },

  // Query for testing check-in
  queryAllForCheckIn: hash => {
    return `INSERT INTO \`fjQh5Ejw6Y\`.\`Company\`
    (\`Name\`,
    \`Domain\`)
    VALUES
    ('Avans',
    '.avans.nl');
    
    INSERT INTO \`fjQh5Ejw6Y\`.\`Employee\`
    (\`Firstname\`,
    \`Lastname\`,
    \`Infix\`,
    \`Postalcode\`,
    \`HouseNumber\`,
    \`HouseNumberAddition\`,
    \`City\`,
    \`PhoneNumber\`,
    \`MobileNumber\`,
    \`EmailAddress\`,
    \`Gender\`,
    \`BirthDate\`,
    \`BirthPlace\`,
    \`Motherland\`,
    \`Nationality\`,
    \`MaritalStatus\`,
    \`Photo\`,
    \`CompanyId\`)
    VALUES
    ('Tesssa',
    'Numan',
    null,
    '4000 AB',
    8,
    null,
    'Breda',
    '0762345677',
    '0623456789',
    'tessa@avans.nl',
    'Male',
    '1990-01-01',
    'Breda',
    'Nederland',
    'Nederland',
    'Niet Gehuwd',
    0,
    (SELECT c.Id from Company as c where c.Name = 'Avans'));
    
    INSERT INTO \`fjQh5Ejw6Y\`.\`User\`
    (\`Username\`,
    \`Password\`,
    \`EmailAddress\`,
    \`EmployeeId\`)
    VALUES
    ('tNuman',
    '${hash}',
    'tessa@avans.nl',
    (SELECT e.Id from Employee as e where e.EmailAddress = 'tessa@avans.nl'));

    INSERT INTO \`fjQh5Ejw6Y\`.\`Branch\`
    (\`Name\`,
    \`Longitude\`,
    \`Latitude\`,
    \`CompanyId\`,
    \`Id\`)
    VALUES
    ('Breda',
    '10.00000000000001',
    '5.00000000000001',
    (SELECT c.Id FROM Company as c WHERE c.Name = 'Avans'),
    '1');
    
    INSERT INTO \`fjQh5Ejw6Y\`.\`Department\`
    (\`Name\`,
    \`Id\`)
    VALUES
    ('Informatica',
    '1');
    
    INSERT INTO \`fjQh5Ejw6Y\`.\`Branch_Department\`
    (\`BranchId\`,
    \`DepartmentId\`)
    VALUES
    ((SELECT b.Id FROM Branch as b WHERE b.Name = 'Breda'),
    (SELECT d.Id FROM Department as d WHERE d.Name = 'Informatica'));`;
  }
};

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
