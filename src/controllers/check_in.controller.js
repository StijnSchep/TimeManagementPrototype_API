const database = require('../database/mysql.dao');
const constants = require('../config/constants');

module.exports = {
  getAllBranchesWithDepartmentsByUser: async (req, res, next) => {
    const userId = req.userid;
    const query = `SELECT b.Id as BranchId, b.Name as BranchName, json_arrayagg(JSON_OBJECT('DepartmentId', d.Id, 'DepartmentName', d.Name)) as Departments
    FROM Branch as b
    join Branch_Department as bd on bd.BranchId = b.Id
    join Department as d on bd.DepartmentId = d.Id
    join Employee as e on e.CompanyId = b.CompanyId
    join User as u on u.EmployeeId = e.Id
    where u.Id = ?
    group by b.Id`;

    const inserts = [userId];

    await database.executePreparedQuery(query, inserts, (err, rows) => {
      constants.handleResponse(req, err, rows, res);
    });
  },
  postCheckIn: async (req, res, next) => {
    const userId = req.userid;
    const body = req.body;
    const query = `INSERT INTO Worked_hours
    (UserId,
    Branch_DepartmentId,
    Date,
    StartTime,
    EndTime)
    VALUES
    (?,
    (SELECT bd.Id FROM Branch_Department as bd WHERE bd.BranchId = ? And bd.DepartmentId = ? ),
    ?,
    ?,
    null)`;

    const inserts = [userId, req.body.branchId, req.body.departmentId, req.body.dateCorrectFormat, req.body.startTime]
    await database.executePreparedQuery(query, inserts, (err, rows) => {
      constants.handePostResponse(err, body, res);
    });
  }
};
