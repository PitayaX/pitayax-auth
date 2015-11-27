import { User, Client } from "../db"
import url from "url"
import oauth from "../lib/oauth"
import app from '../lib/app.js'
import exception from "../lib/exception.js"

exports.signout = function (req, res) {
  const token = req.param("token")
  const clientid = req.param("client_id")

  if (token === undefined || clientid === undefined)
  {
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
  } else {
    oauth.remove (token, clientid, function (error, result) {
      if (error === null) {
        res.statusCode = 204
        res.set("Content-Type", "application/json")
        res.end()
      }
      else {
        app.logger.error ("signout failed. Error is " + error, "authorization.signout")
        res.statusCode = 400
        res.json({ "error": { "id": "400", "description": exception._400 } })
        res.end()
      }
    })
  }
}

exports.feed = function (req, res) {
  oauth.feed (req.get("authorization"), req.get("client"), req.get("page"), req.get("section"), req.get("action"), function (result) {
    if (result === null || result === 'undefined') {
      app.logger.error ("feed failed. " + req, "authorization.feed")
      res.statusCode = 400
      res.json({ "error": { "id": "401", "description": exception._401 } })
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
      // We will show 400 if current request does not include what we need.
      if (req.param("code") === undefined || req.param("redirect_uri") === undefined || req.param("client_id") === undefined)
      {
        res.statusCode = 400
        res.json({ "error": { "id": "100", "description": exception._100 } })
        res.end()
        return
      }

      oauth.authCode (req.param("code"), req.param("redirect_uri"), req.param("client_id"), function (error, result) {
        if (error !== null) {
          app.logger.error ("Failed to auth user. " + req, "authorization.authorization_code")
          res.statusCode = 401
          res.json({ "error": { "id": "401", "description": exception._401 } })
          res.end()
        }
        else {
          res.statusCode = 200
          res.json({ "data": result })
          res.end()
        }
      })
    } catch (e) {
      app.logger.error ("Failed to auth user. " + e, "authorization.authorization_code")
      res.statusCode = 400
      res.json({ "error": { "id": "401", "description": exception._401 } })
      res.end()
    }
    break
  case "refresh_token":
    const token = req.param("refresh_token")
    // We will show 400 if current request does not include what we need.
    if (token === undefined)
    {
      res.statusCode = 400
      res.json({ "error": { "id": "100", "description": exception._100 } })
      res.end()
    }
    else {
      oauth.reflushKey (token, function (error, result) {
        if (error === null) {
          res.statusCode = 200
          res.json({ "data": result })
          res.end()
        } else {
          app.logger.error ("Failed to reflush token. " + error, "authorization.refresh_token")
          res.statusCode = 400
          res.json({ "error": { "id": "401", "description": exception._401 } })
          res.end()
        }
      })
    }
    break
  default :
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
  }

}

exports.remoteAuth = (req, res) => {
  const userEmail = req.param("email")
  const userPassword = req.param("password")
  const passcode = req.get("passcode")
  const clientID = req.get("clientID")

  // We will show 404 if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined || passcode === undefined || clientID === undefined)
  {
    console.log ("userEmail=" + userEmail + "|userPassword=" + userPassword + "|passcode=" + passcode + "|clientID=" +  clientID )
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
    return
  }
  else {
    const user = new User()
    user.email = userEmail
    user.password = userPassword

    user.checkPassword(function (error, result) {
      if (error == null)
      {
        oauth.grant (result, clientID, "", function (authCache) {
          // redirect to return URL with code.
          res.statusCode = 200
          res.json({ "code": authCache.code, "email": authCache.user_email })
          res.end()
        })
      }
      else {
        app.logger.error ("user info is: email=" + userEmail + " password=" + userPassword, "authorization.remoteAuth")
        res.statusCode = 400
        res.json({ "error": { "id": "402", "description": exception._402 } })
        res.end()
      }
    })
  }
}


// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const userEmail = req.param("emailTextBox")
  const userPassword = req.param("passwordTextBox")

  // We will show bad request if current request does not include the query strings that we need.
  if (userEmail === undefined || userPassword === undefined || req.query.client_id === undefined || req.query.redirect_uri === undefined )
  {
    res.statusCode = 400
    res.json({ "error": { "id": "100", "description": exception._100 } })
    res.end()
    return
  }

  const user = new User()
  user.email = userEmail
  user.password = userPassword
  user.checkPassword(function (error, result) {
    if (error == null)
    {
      oauth.grant (result, req.query.client_id, req.query.redirect_uri, function (authCache) {
        // redirect to return URL with code.
        res.statusCode = 302
        res.append('Location', authCache.redirect_uri +
          "?code=" + authCache.code + "&state=" + req.query.state + "&userid=" + authCache.user_id + "&nickname=" + authCache.nickname)
        res.end()
      })
    }
    else {
      app.logger.error ("User login failed. Data is following ", "authorization.postAuth")
      app.logger.error ("user info is: email=" + userEmail + " password=" + userPassword, "authorization.postAuth")
      res.json({ "error": { "id": "402", "description": exception._402 } })
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
    res.json({ "error": { "id": "100", "description": exception._100 } })
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
        res.json({ "error": { "id": "403", "description": exception._403 } })
        res.end()
      } else {
        res.statusCode = 200
        res.render("login", { warning: "" } )
        res.end()
      }
    })
  }
}
