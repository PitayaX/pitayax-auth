const crypto = require("crypto"),
  db = require("./db")

const user = function () {
  	this.id = ""
  	this.username = ""
  	this.name = ""
  	this.password = ""
  	this.lastlogin = Date.now
}

const fillUser = function (row) {
  	const result = new user()
  	result.id = row.UserID
  	result.username = row.UserName
  	result.password = row.LoginPassword
  	return result
}


exports.find = function (id, done) {
  	db.ReadData("  SELECT\
                   `UserID`,`UserName`,`LoginPassword`,`LastLogin`,`IsTrainee`,`IsDeparted`,\                                                  `EmailAddress`,`EMAccount`,`EMPassword`,`JIRAToken`\
                   FROM `team`.`users`\
                   WHERE userid = '" + id + "' ", function (rows, err) {
                      if (err != null) {
                        return done(err, null)
                      } else if (rows == null) {
                        return done("No user found", null)
                      } else {
                        return done(null, fillUser(rows[0]))
		                  }
                    })
}

exports.findByUserName = function (name, done) {
  db.ReadData("  SELECT\
                   `UserID`,`UserName`,`LoginPassword`,`LastLogin`,`IsTrainee`,`IsDeparted`,\                                                  `EmailAddress`,`EMAccount`,`EMPassword`,`JIRAToken`\
                   FROM `team`.`users`\
                   WHERE UserName = '" + name + "' ", function (rows, err) {
                      if (err != null) {
                        return done(err, null)
                      } else if (rows == null) {
                        return done("No user found", null)
                      } else {
                        return done(null, fillUser(rows[0]))
                      }
                    })
}

exports.checkPassword = function (password, encodedPassword, done) {
	// get user info and post it back to user
  const md5 = crypto.createHash("md5")
  md5.update(password)
  const md5Password = md5.digest("hex")
  done(md5Password === encodedPassword)
}
