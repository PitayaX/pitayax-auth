import mysql from 'mysql'
import config from './config.json'
import app from '../../lib/app.js'


class Mysql {
  constructor () {
    this.connection = null
  }

  createConnection () {
    try {
      if (this.connection === null) {
        this.connection = mysql.createConnection({
          host: config["mysqlconnect"],
          user: config["mysqlUserID"],
          password: config["mysqlPassword"]
        })
        return this.connection
      }
    } catch (e) {
      app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.createConnection")
    }
  }

  connect () {
    try {
      if (this.connection === null) {
        createConnection ()
      }
      if (this.connection !== null) {
        this.connection.connect ()
      }
    } catch (e) {
      app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.connect")
    }
  }

  end ()  {
    try {
      if (this.connection === null) {
        return
      }
      else {
        this.connection.end ()
        this.connection = null
      }
    } catch (e) {
      app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.end")
    }
  }

}

module.exports = new Mysql()
