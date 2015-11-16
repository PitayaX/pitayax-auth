import mysql from "./mysql/mysqlAdapter"
import config from './mysql/config.json'
import app from '../lib/app.js'

export default class Client {
  constructor () {
    this.id = ""
    this.code = ""
    this.name = ""
  }



  fill (row) {
    try {
      if (row !== null && row !== undefined) {
        this.id = row.id
        this.code = row.code
        this.name = row.name
        app.logger.info (JSON.stringify(this), "Client.fill")
      }
    } catch (e) {
      app.logger.error ("Fill data error. Data is " + row, "Client.fill")
    } finally {
      return this
    }
  }


  get (done) {
    try {
      mysql.createConnection().query("\
        SELECT * FROM `" + config.databaseName + "`.`client` WHERE `code` = ?", [ this.code ],
        (err, result) => {
          if (err != null) {
            return done(err, null)
          } else if (result === null || result.length === 0) {
            return done("No client found", null)
          } else {
            const client = new Client()
            return done(null, client.fill(result[0]))
          }
        })
    } catch (e) {
      app.logger.error ("get data error. Data is " + this, "Client.get")
    }
  }
}
