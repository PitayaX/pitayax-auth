import { user } from "../DynamoDB"
import config from "../config.json"
import url from "url"


const inAllowHost = function (host) {
  for  (const one in config.allowHost) {
    if (config.allowHost[one].toLowerCase() === host.toLowerCase()) return true
  }
  return false
}

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
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query
  // We will show 404 if current request does not include the query strings that we need.
  if (query.redirect_uri === undefined)
  {
    res.statusCode = 404
    res.send ("Please add redirect_uri to your query string.")
    res.end()
  } else {
    res.render("createAccount", { message: "", userPassword: "", userEmail: "", nickName: "", passcode: "" })
  }
}

exports.createAccount_post = function (req, res) {
  const nickName = req.param("nicknameTextBox")
  const userPassword = req.param("passwordTextBox")
  const userEmail = req.param("emailTextBox")
  const passcode = req.param("passcodeTextBox")
  const url_parts = req.query.redirect_uri

  // we only accept post request from given host
  if ( !inAllowHost (req.hostname) ) {
    res.statusCode = 404
    res.end()
  }
  // we need to check passcode to make sure the form is verified
  if (passcode !== config.passcode) {
    showError ({ "message": "You cannot create account now! Passcode is incorrect!", userPassword, userEmail, nickName, passcode }, res)
  }
  else {
    user.insert(nickName, userPassword, userEmail, function (err, result) {
      if (err === null)
      {
        // redirect to return URL with code.
        const location = url_parts
        console.log (location)
        res.statusCode = 302
        res.append("Location", location)
        res.append("email", userEmail)
        res.end()
      }
      else {
        showError ({ "message": err, userPassword, userEmail, nickName, passcode }, res)
      }
    })
  }
}
