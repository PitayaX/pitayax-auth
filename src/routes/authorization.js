import { User, Client } from "../db"
import url from "url"
import oauth from "../lib/oauth"
import app from '../lib/app.js'


exports.feed = function (req, res) {
  oauth.feed (req.get("authorization"), req.get("client"), req.get("page"), req.get("section"), req.get("action"), function (result) {
    if (result === null || result === 'undefined') {
      res.statusCode = 404
      res.end()
    }
    else {
      res.json (result)
    }
  })
}

// This is used to:
// 1. Get auth token from code
// 2. Refresh token
exports.token = function (req, res) {
  console.log ("Enter post request!")

  const granttype = req.param("grant_type")

  switch (granttype) {
  case "authorization_code":
    try {
      oauth.authCode (req.param("code"), req.param("redirect_uri"), req.param("client_id"), function (error, result) {
        if (error !== null) {
          res.statusCode = 404
          res.send (error)
        }
        else {
          res.json (result)
        }
      })
    } catch (e) {
      console.log ("error:" + e)
      res.statusCode = 404
      res.send (error)
    }
    break
  case "refresh_token":
    oauth.reflushKey (req.param("refresh_token"), function (error, result) {
      if (error === null) {
        res.set('Access-Control-Allow-Origin', '*')
        res.json (result)
      } else {
        res.statusCode = 404
        res.send (error)
        res.end()
      }
    })
    break
  default :
    res.statusCode = 404
    res.end()
  }

}

exports.remoteAuth = (req, res) => {
  const userEmail = req.param("email")
  const userPassword = req.param("password")
  const passcode = req.param("passcode")

  // We will show 404 if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined || passcode === undefined)
  {
    res.statusCode = 404
    res.json({ "error": "please including userEmail, userPassword, and passcode.", "data": "" })
    res.end()
  }

  const user = new User()
  user.email = userEmail
  user.password = userPassword

  user.checkPassword(userEmail, userPassword, function (error, result) {
    if (error == null)
    {
      oauth.grant (req.query.client_id, "", userEmail, function (authCache) {
        // redirect to return URL with code.
        res.json({ "error": "", "code": authCache.code, "email": authCache.user_email })
        res.end()
      })
    }
    else {
      console.log (error)
      console.log ("user info is: email=" + userEmail + " password=" + userPassword)
      res.json({ error, "code": "", "email": "" })
    }
  })
}


// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const userEmail = req.param("emailTextBox")
  const userPassword = req.param("passwordTextBox")

  // We will show 404 if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined)
  {
    res.statusCode = 404
    res.json({ "error": "please including userEmail and userPassword.", "data": "" })
    res.end()
  }

  const user = new User()
  user.email = userEmail
  user.password = userPassword

  user.checkPassword(function (error, result) {
    if (error == null)
    {
      oauth.grant (req.query.client_id, req.query.redirect_uri, userEmail, function (authCache) {
        // redirect to return URL with code.
        res.statusCode = 302
        res.append('Location', authCache.redirect_uri + "?code=" + authCache.code + "&state=" + req.query.state + "&email=" + authCache.user_email)
        res.end()
      })
    }
    else {
      app.logger.error ("User login failed. Data is following ", "authorization.postAuth")
      app.logger.error ("user info is: email=" + userEmail + " password=" + userPassword, "authorization.postAuth")
      res.render("login", { warning: "登录失败！用户不存在或者密码错误." } )
    }
  })
}

// This method is return user login page
exports.getAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query

  // We will show 404 if current request does not include the query strings that we need.
  if (query.response_type === undefined || query.response_type !== "code"
      || query.state === undefined || query.redirect_uri === undefined || query.client_id === undefined)
  {
    res.statusCode = 404
    res.json({ "error": "please including querystring client_id, response_type, state, and redirect_uri.", "data": "" })
    res.end()
  }

  // Init client
  const client = new Client()
  client.code = query.client_id

  client.get(function (error, result) {
    if (error !== null) {
      // We cannot find the client.
      app.logger.info (JSON.stringify(client), "authorization.getAuth")
      res.statusCode = 404
      res.json({ "error": "Client id is incorrect.", "data": "" })
      res.end()
    } else {
      res.render("login", { warning: "" } )
    }
  })
}
