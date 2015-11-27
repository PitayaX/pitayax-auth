import { User } from "../db"
import config from "../config.json"
import url from "url"
import app from '../lib/app.js'

exports.get = function (req, res) {
  const userEmail = req.params.email
  if (userEmail === undefined || userEmail === null) {
    app.logger.error ("userEmail is blank. ", "routes/user.get")
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end ()
  } else {
    user.find(userEmail, function (error, result) {
      if (error != null) {
        app.logger.error ("Cannot find user. " + userEmail, "routes/user.get")
        res.statusCode = 400
        res.json({ "error": { "id": "404", "description": exception._404 } })
        res.end()
      } else {
        res.statusCode = 200
        return res.json(result)
        res.end()
      }
    })
  }
}

exports.create_get = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query

  // We will show 404 if current request does not include the query strings that we need.
  if (query.redirect_uri === undefined)
  {
    res.statusCode = 400
    app.logger.error ("Do not include redirect_uri. ", "routes/user.create_get")
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
  } else {
    res.render("createAccount", { message: "", userPassword: "", userEmail: "", nickName: "", passcode: "" })
  }
}

exports.create_post = function (req, res) {
  const nickName = req.param("nicknameTextBox")
  const userPassword = req.param("passwordTextBox")
  const userEmail = req.param("emailTextBox")
  const passcode = req.param("passcodeTextBox")
  const redirect_uri = req.query.redirect_uri

  if (nickName === undefined || userPassword === undefined || userEmail === undefined || passcode === undefined || redirect_uri === undefined ) {
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
  }

  // we need to check passcode to make sure the form is verified
  if (passcode !== config.passcode) {
    showError ({ "message": "You cannot create account now! Passcode is incorrect!", userPassword, userEmail, nickName, passcode }, res)
  }
  else {
    const user = new User()
    user.email = userEmail
    user.nickname = nickName
    user.password = userPassword

    user.add((err, result) => {
      if (err === null)
      {
        // redirect to return URL with code.
        res.statusCode = 302
        res.append("Location", redirect_uri)
        res.append("data", user)
        res.end()
      }
      else {
        showError ({ "message": err, userPassword, userEmail, nickName, passcode }, res)
      }
    })
  }
}
