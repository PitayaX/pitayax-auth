
import db from "../db"
import config from "../config.json"

const showError = function (inputs, res) {
  res.render("createAccount", inputs)
  res.end()
}

exports.get = function (req, res) {
  const userid = req.params.userid
  db.users.find(userid, function (error, result) {
    if (error != null) {
      res.statusCode = 404
      return res.send('Error 404: ' + error)
    } else {
      res.json(result)
    }
  })
}

exports.createAccount_get = function (req, res) {
  res.render("createAccount", { message: "", userID: "", userPassword: "", userEmail: "", nickName: "", passcode: "" })
}

exports.createAccount_post = function (req, res) {
  const userID = req.param("userIDTextBox")
  const userPassword = req.param("passwordTextBox")
  const userEmail = req.param("emailTextBox")
  const nickName = req.param("nicknameTextBox")
  const passcode = req.param("passcodeTextBox")
  const url_parts = url.parse (req.url, true)

  if (passcode !== config.passcode) {
    showError ({ "message": "You cannot create account now! Passcode is incorrect!", userID, userPassword, userEmail, nickName, passcode }, res)
  }
  else {
    db.users.create(userID, userPassword, userEmail, nickName, function (result, err) {
      if (result)
      {
        // redirect to return URL with code.
        res.statusCode = 302
        res.append('Location', url_parts.query.redirect_uri)
        res.end()
      }
      else {
        showError ({ "message": err, userID, userPassword, userEmail, nickName, passcode }, res)
      }
    })
  }
}
