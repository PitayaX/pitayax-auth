const mysql = require('mysql')
const config = require('./config.json')


exports.ReadData = function (command, callback) {
    const connection = mysql.createConnection({
      host: config["mysqlconnect"],
      user: config["mysqlUserID"],
      password: config["mysqlPassword"]
    })

    connection.connect()
    connection.query(command, function (err, rows, fields) {
        if (err) {
          connection.end()
          callback(null, err)
          throw err
        } else {
          connection.end()
          if (rows.length === 0) {
            callback(null, null)
          } else {
            callback(rows, null)
          }
        }
      })
  }
