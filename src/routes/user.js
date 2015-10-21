
import db from "../db"
import config from "../config.json"

const showError = function (message, res) {
  res.render("createAccount", {})
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


exports.createAccount_get = function (req, res) {
  res.render("createAccount", {})
}

exports.createAccount_post = function (req, res) {
  const userID = req.param("userIDTextBox")
  const userPassword = req.param("passwordTextBox")
  const userEmail = req.param("emailTextBox")
  const nickName = req.param("nicknameTextBox")
  const passcode = req.param("passcodeTextBox")

  if (passcode !== config.passcode) {
    showError ("You cannot create account now! Passcode is incorrect!", res)
  }
  else {
    db.users.create(userID, userPassword, userEmail, nickName, function (result, err) {
      if (result)
      {
        res.send("Accout Created!")
        res.end()
      }
      else {
        showError (err, res)
      }
    })
  }
}
