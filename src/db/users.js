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


exports.find = function (username, done) {
  mysql.ReadData("\
  SELECT\
    `id`,`username`,`fullname`,`password`,`lastlogin`\
  FROM `" + config.databaseName + "`.`user`\
  WHERE username = '" + username + "' ", function (rows, err) {
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
  exports.find(username, function (error, result) {
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

// exports.findByUserName = function (name, done) {
//   mysql.ReadData("  SELECT\
//                    `UserID`,`UserName`,`LoginPassword`,`LastLogin`,`IsTrainee`,`IsDeparted`,\
//                    `EmailAddress`,`EMAccount`,`EMPassword`,`JIRAToken`\
//                    FROM `team`.`users`\
//                    WHERE UserName = '" + name + "' ", function (rows, err) {
//                       if (err != null) {
//                         return done(err, null)
//                       } else if (rows == null) {
//                         return done("No user found", null)
//                       } else {
//                         return done(null, fillUser(rows[0]))
//                       }
//                     })
// }
//
