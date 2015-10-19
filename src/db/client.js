import mysql from "./mysqlAdapter"
import config from './config.json'

class Client {

  constructor () {
    this.clientID = ""
    this.clientName = ""
  }

  fillClient (row) {
    this.clientID = row.ClientID
    this.clientName = row.ClientName
    return this
  }
}


exports.getClient = function (clientID, done) {
  mysql.ReadData("\
    SELECT\
      `ClientID`,\
      `ClientName`\
      FROM `" + config.databaseName + "`.`client`\
    WHERE ClientID = '" + clientID + "' ", function (rows, err) {
    if (err != null) {
      return done(err, null)
    } else if (rows == null) {
      return done("No client found", null)
    } else {
      const client = new Client ()
      return done(null, client.fillClient(rows[0]))
    }
  })
}
