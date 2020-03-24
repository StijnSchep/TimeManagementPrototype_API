module.exports = {
  logger: require("tracer").colorConsole({
    format: [
      "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})", //default format
      {
        error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})" // error format
      }
    ],
    dateformat: "HH:MM:ss.L",
    preprocess: function (data) {
      data.title = data.title.toUpperCase();
    },
    level: "debug"
  }),
  dbconfigProd: {
    host: process.env.DB_HOSTNAME || 'remotemysql.com',
    user: process.env.DB_USERNAME || 'oLlabGVQDJ',
    password: process.env.DB_PASSWORD || 'swbHOjTR0B',
    database: process.env.DB_DATABASENAME || 'oLlabGVQDJ',
    multipleStatements: true
  },
  dbconfig: { 
    host: process.env.DB_HOSTNAME || 'remotemysql.com', 
    user: process.env.DB_USERNAME || 'fjQh5Ejw6Y', 
    password: process.env.DB_PASSWORD || 'GXTk1dWYcZ', 
    database: process.env.DB_DATABASENAME || 'fjQh5Ejw6Y', 
    multipleStatements: true 
    } 
}
