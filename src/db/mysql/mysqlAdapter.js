import mysql from 'mysql'
import config from './config.json'
import app from '../../lib/app.js'


exports.createConnection = () => {
  try {
    const connection = mysql.createConnection({
      host: config["mysqlconnect"],
      user: config["mysqlUserID"],
      password: config["mysqlPassword"]
    })
    connection.connect()
    return connection
  } catch (e) {
    app.logger.error ("Cannot create connection to database!", "mysqlAdapter.createConnection")
  }
}
// 
// exports.query = function (sql, values, cb) {
//   const connection = createConnection()
//   connection.query(sql, values, function (err, rows, fields) {
//     if (err) {
//       connection.end()
//       callback(null, err)
//       throw err
//     } else {
//       connection.end()
//       if (rows.length === 0) {
//         callback(null, null)
//       } else {
//         callback(rows, null)
//       }
//     }
//   })
// }
