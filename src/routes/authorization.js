import { User, Client } from "../db"
import url from "url"
import oauth from "../lib/oauth"
import app from '../lib/app.js'

exports.signout = function (req, res) {
  oauth.remove (req.param("authorization"), req.param("client"), function (error, result) {
    if (error === null) {
      res.statusCode = 204
      res.end()
    }
    else {
      res.statusCode = 400
      res.json ({ error, "data": "" })
      res.end()
    }
  })
}

exports.feed = function (req, res) {
  oauth.feed (req.get("authorization"), req.get("client"), req.get("page"), req.get("section"), req.get("action"), function (result) {
    if (result === null || result === 'undefined') {
      app.logger.error ("feed failed. " + req, "authorization.feed")
      res.statusCode = 400
      res.end()
    }
    else {
      res.statusCode = 200
      res.json (result)
      res.end()
    }
  })
}

// This is used to:
// 1. Get auth token from code
// 2. Refresh token
exports.token = function (req, res) {
  const granttype = req.param("grant_type")

  switch (granttype) {
  case "authorization_code":
    try {
      oauth.authCode (req.param("code"), req.param("redirect_uri"), req.param("client_id"), function (error, result) {
        if (error !== null) {
          app.logger.error ("Failed to auth user. " + req, "authorization.authorization_code")
          res.statusCode = 401
          res.json({ error, "data": "" })
          res.end()
        }
        else {
          res.statusCode = 200
          res.json({ "error": "", "data": Json.stringify(result) })
          res.end()
        }
      })
    } catch (e) {
      app.logger.error ("Failed to auth user. " + e, "authorization.authorization_code")
      res.statusCode = 400
      res.json({ error, "data": "" })
      res.end()
    }
    break
  case "refresh_token":
    oauth.reflushKey (req.param("refresh_token"), function (error, result) {
      if (error === null) {
        res.statusCode = 200
        res.json({ "error": "", "data": Json.stringify(result) })
        res.end()
      } else {
        app.logger.error ("Failed to reflush token. " + error, "authorization.refresh_token")
        res.statusCode = 400
        res.json({ error, "data": "" })
        res.end()
      }
    })
    break
  default :
    res.statusCode = 400
    res.json({ "error": "", "data": "" })
    res.end()
  }

}

exports.remoteAuth = (req, res) => {
  const userEmail = req.param("email")
  const userPassword = req.param("password")
  const passcode = req.param("passcode")
  const clientID = req.param("clientID")

  // We will show 404 if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined || passcode === undefined || clientID === undefined)
  {
    res.statusCode = 400
    res.json({ "error": "please including clientID, userEmail, userPassword, and passcode.", "data": "" })
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
        res.statusCode = 200
        res.json({ "error": "", "code": authCache.code, "email": authCache.user_email })
        res.end()
      })
    }
    else {
      app.logger.error ("user info is: email=" + userEmail + " password=" + userPassword, "authorization.remoteAuth")
      res.statusCode = 400
      res.json({ error, "code": "", "email": "" })
      res.end()
    }
  })
}


// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const userEmail = req.param("emailTextBox")
  const userPassword = req.param("passwordTextBox")

  // We will show bad request if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined)
  {
    res.statusCode = 400
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
      res.end()
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
    res.statusCode = 400
    res.json({ "error": "please including querystring client_id, response_type, state, and redirect_uri.", "data": "" })
    res.end()
  } else {
    // Init client
    const client = new Client()
    client.code = query.client_id

    client.get(function (error, result) {
      if (error !== null) {
        // We cannot find the client.
        app.logger.info ("Client id is incorrect.", "authorization.getAuth")
        res.statusCode = 400
        res.json({ "error": "Client id is incorrect.", "data": "" })
        res.end()
      } else {
        res.render("login", { warning: "" } )
        res.end()
      }
    })
  }
}
