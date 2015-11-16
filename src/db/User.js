import crypto from "crypto"
import mysql from "./mysql/mysqlAdapter"
import config from './mysql/config.json'
import app from '../lib/app.js'
import uuid from "node-uuid"
import { sha1 } from '../lib/tool.js'

export default class User {

  constructor () {
    this.id = ""
    this.email = ""
    this.nickname = ""
    this.password = ""
    this.lastlogin = null
    this.passwordEncoded = false
  }

  fill (row) {
    try {
      if (row !== null && row !== undefined) {
        this.id = row.id
        this.email = row.email
        this.nickname = row.nickname
        this.password = row.password
        app.logger.info (JSON.stringify(this), "User.fill")
      }
    } catch (e) {
      app.logger.error ("Fill data error. Data is " + row, "User.fill")
    } finally {
      return this
    }
  }

  getByEmail (done) {
    try {
      mysql.createConnection().query("\
      SELECT * FROM `" + config.databaseName + "`.`user` WHERE `email` = ?", [ this.email ],
        (err, result) => {
          if (err !== null) {
            return done(err, null)
          } else if (result === null || result.length === 0 ) {
            return done(null, null)
          } else {
            const user = new User()
            return done(null, user.fill(result[0]))
          }
        })
    } catch (e) {
      app.logger.error ("Get user from email failed. Data is " + row, "User.getByEmail")
    } finally {
      return done("Failed to get user info.", null)
    }
  }

  get (done) {
    try {
      mysql.createConnection().query("\
      SELECT * FROM `" + config.databaseName + "`.`user` WHERE `id` = ?", [ this.id ],
        (err, result) => {
          if (err != null) {
            return done(err, null)
          } else if (result === null || result.length === 0 ) {
            return done(null, null)
          } else {
            const user = new User()
            return done(null, user.fill(result[0]))
          }
        })
    } catch (e) {
      app.logger.error ("Get user from email failed. Data is " + row, "User.get")
    } finally {
      return done("Failed to get user info.", null)
    }
  }

  add (done) {
    try {
      // Check email address
      this.getByEmail ((err, result) => {
        if (result === null) {
          this.password = sha1(this.password)
          this.passwordEncoded = true
          app.logger.info ("New account. Data is" + uuid.v4() + " | " + this.email +" | " + this.nickname + " | " + this.password, "User.add")

          mysql.createConnection().query("INSERT INTO `" + config.databaseName + "`.`user` set ? ",
                      { "id": uuid.v4(), "email": this.email, "nickname": this.nickname, "password": this.password },
              (err, result) => {
                if (err === null) {
                  done(null, this)
                } else {
                  done (err, null)
                }
              })
        }
        else {
          done ("Email has been used.", null)
        }
      })
    } catch (e) {
      app.logger.error ("Add user failed. Data is " + row, "User.add")
    } finally {
      return done("Failed to add user.", null)
    }
  }

  checkPassword (done) {
    try {
      this.getByEmail ((err, result) => {
        if (err == null && result !== null)
        {
          // get user info and post it back to user
          if (!this.passwordEncoded) {
            this.password = sha1(this.password)
            this.passwordEncoded = true
          }
          if (this.password === result.password) {
            done(null, result)
          }
          else {
            done("User passwod is incorrect.", null)
          }
        }
        else {
          done("Cannot find user.", null)
        }
      })
    } catch (e) {
      app.logger.error ("get user failed. Data is " + row, "User.checkPassword")
    } finally {
      return done("Failed to check user login info.", null)
    }
  }

}
