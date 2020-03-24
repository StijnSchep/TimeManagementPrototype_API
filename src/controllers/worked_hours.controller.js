const database = require('../database/mysql.dao');
const constants = require('../config/constants');

module.exports = {
    getAllWorkedHours: async (req, res, next) => {
        const userId = req.userid;
        const query = `select wh.Id, wh.Branch_DepartmentId, wh.Date, wh.StartTime, wh.EndTime, wh.Pause, wh.UserId, bp.BranchId, bp.DepartmentId, b.Name as BranchName, d.Name as DepartmentName
        from Worked_hours as wh
        JOIN Branch_Department as bp on bp.Id = wh.Branch_DepartmentId
        JOIN Branch as b on b.Id = bp.BranchId
        JOIN Department as d on d.Id = bp.DepartmentId
        WHERE wh.UserId = ?
        ORDER BY wh.Date DESC, wh.StartTime DESC;`;

        const inserts = [userId];

        await database.executePreparedQuery(query, inserts, (err, rows) => {
            constants.handleWorkedHoursResponse(req, err, rows, res);
        })
    },
    getLast5WorkedHours: async (req, res, next) => {
        const userId = req.userid;
        const query =
            `select wh.Id, wh.Branch_DepartmentId, wh.Date, wh.StartTime, wh.EndTime, wh.Pause, wh.UserId, bp.BranchId, bp.DepartmentId, b.Name as BranchName, d.Name as DepartmentName
            from Worked_hours as wh
            JOIN Branch_Department as bp on bp.Id = wh.Branch_DepartmentId
            JOIN Branch as b on b.Id = bp.BranchId
            JOIN Department as d on d.Id = bp.DepartmentId
            WHERE wh.UserId = ?
            ORDER BY wh.Date DESC
            LIMIT 5;`;

        const inserts = [userId];

        await database.executePreparedQuery(query, inserts, (err, rows) => {
            constants.handleWorkedHoursResponse(req, err, rows, res);
        })
    }
}
