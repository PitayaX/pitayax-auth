import crypto from "crypto"
import mysql from "./mysqlAdapter"
import config from './config.json'

class User {
  constructor () {
    this.id = ""
    this.username = ""
    this.fullname = ""
    this.password = ""
    this.lastlogin = Date.now
  }

  fillUser (row) {
    console.log ("start fill")
    this.id = row.id
    this.username = row.username
    this.fullname = row.fullname
    this.password = row.password
    console.log (this)
    return this
  }
}

exports.create = function (userid, password, email, nickName, done) {
  // check user id
  exports.findByUserID (userid, function (found, result) {
    if (result === null) {
      // Check email address
      exports.findByEmail (email, function (found, result) {
        if (result === null) {
          // Convert password to md5 encode.
          const md5 = crypto.createHash("md5")
          md5.update(password)

          mysql.ExecQuery("INSERT INTO `" + config.databaseName + "`.`user` (`username`,`fullname`,`password`,`email`)\
                          VALUES (?,?,?,?);", [ userid, nickName, md5.digest("hex"), email ], function (result, err) {
            done(result, err)
          })
        }
        else {
          done (false, "Email has been used.")
        }
      })
    } else {
      done (false, "User id has been used.")
    }
  })
}

exports.findByEmail = function (email, done) {
  mysql.ReadData("\
  SELECT\
    `id`,`username`,`fullname`,`password`,`lastlogin`,`email`\
  FROM `" + config.databaseName + "`.`user`\
  WHERE email = '" + email + "' ", function (rows, err) {
    if (err != null) {
      return done(err, null)
    } else if (rows == null) {
      return done("No user found", null)
    } else {
      const user = new User()
      return done(null, user.fillUser(rows[0]))
    }
  })
}

exports.findByUserID = function (userID, done) {
  mysql.ReadData("\
  SELECT\
    `id`,`username`,`fullname`,`password`,`lastlogin`,`email`\
  FROM `" + config.databaseName + "`.`user`\
  WHERE username = '" + userID + "' ", function (rows, err) {
    if (err != null) {
      return done(err, null)
    } else if (rows == null) {
      return done("No user found", null)
    } else {
      const user = new User()
      return done(null, user.fillUser(rows[0]))
    }
  })
}

exports.checkPassword = function (username, password, done) {
  exports.findByUserID(username, function (error, result) {
    if (error == null)
    {
      // get user info and post it back to user
      const md5 = crypto.createHash("md5")
      md5.update(password)
      const md5Password = md5.digest("hex")
      console.log (md5Password)
      if (md5Password === result.password) {
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
}
