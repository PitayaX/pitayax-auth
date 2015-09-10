import crypto from "crypto"
import mysql from "./mysqlAdapter"

const user = function () {
  this.id = ""
  this.username = ""
  this.fullname = ""
  this.password = ""
  this.lastlogin = Date.now
}

const fillUser = function (row) {
  const result = new user()
  result.id = row.id
  result.username = row.username
  result.fullname = row.fullname
  result.password = row.password
  console.log (result)
  return result
}


exports.find = function (username, done) {
  mysql.ReadData("\
  SELECT\
    `id`,`username`,`fullname`,`password`,`lastlogin`\
  FROM `playground`.`user`\
  WHERE username = '" + username + "' ", function (rows, err) {
    if (err != null) {
      return done(err, null)
    } else if (rows == null) {
      return done("No user found", null)
    } else {
      return done(null, fillUser(rows[0]))
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
// exports.checkPassword = function (password, encodedPassword, done) {
// 	// get user info and post it back to user
//   const md5 = crypto.createHash("md5")
//   md5.update(password)
//   const md5Password = md5.digest("hex")
//   done(md5Password === encodedPassword)
// }
