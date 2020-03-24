const database = require('../database/mysql.dao');
const constants = require('../config/constants');

module.exports = {
  postCheckOut: async (req, res, next) => {
    const userId = req.userid;
    const branchId = req.body.branchId;
    const departmentId = req.body.departmentId;
    const endTime = req.body.endTime;
    const pause = req.body.pause || 0;

    const query = 
    `UPDATE Worked_hours
    SET EndTime = ?,
    Pause = ?
    WHERE UserId = ?
    AND Branch_DepartmentId = (SELECT bd.Id FROM Branch_Department as bd WHERE bd.BranchId = ? AND bd.DepartmentId = ?)
    AND EndTime IS NULL;`;

    const inserts = [endTime, pause, userId, branchId, departmentId];

    await database.executePreparedQuery(query, inserts, (err, rows) => {
      const body = [req.body];
      constants.handleResponse(req, err, body, res);
    });
  }
};
