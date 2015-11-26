import mysql from 'mysql'
import config from './config.json'
import app from '../../lib/app.js'


class Mysql {
  constructor () {
    this.connection = null
  }

  connect () {
    try {
      if (this.connection === null) {
        this.connection = mysql.createConnection({
          host: config["mysqlconnect"],
          user: config["mysqlUserID"],
          password: config["mysqlPassword"]
        })
      }
      if (this.connection !== null) {
        this.connection.connect ()
        return this.connection
      } else {
        throw new UserException ("connection cannot be created")
      }
    } catch (e) {
      app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.connect")
      return null
    }
  }

  end ()  {
    try {
      if (this.connection === null) {
        return false
      }
      else {
        this.connection.end ()
        this.connection = null
        return true
      }
    } catch (e) {
      app.logger.error ("Cannot create connection to database! Error is " + e, "mysqlAdapter.end")
      return false
    }
  }

}


module.exports = new Mysql()
