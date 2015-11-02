import db from "../db"
import url from "url"
import oauth from "../lib/oauth"


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
    oauth.authCode (req.param("code"), req.param("redirect_uri"), req.param("client_id"), function (error, result) {
      if (error !== null) {
        res.statusCode = 404
        res.send (error)
      }
      else {
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER')
        res.set('Access-Control-Max-Age', '1728000')
        res.json (result)
      }
    })
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

// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const userName = req.param("userIDTextBox")
  const userPassword = req.param("passwordTextBox")

  db.users.checkPassword(userName, userPassword, function (error, result) {
    if (error == null)
    {
      oauth.grant (req.query.client_id, req.query.redirect_uri, function (authCache) {
        // redirect to return URL with code.
        res.statusCode = 302
        res.append('Location', authCache.redirect_uri + "?code=" + authCache.code + "&state=" + req.query.state)
        res.end()
      })
    }
    else {
      console.log (error)
      res.statusCode = 401
      res.send("User authorization failed.")
      res.end()
    }
  })
}

// This method is return user login page
exports.getAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query

  db.client.getClient(query.client_id, function (error, result) {
    if (error !== null) {
      // We cannot find the client.
      res.statusCode = 404
      res.send(error)
      res.end()
    } else {
      // We will show 404 if current request does not include the query strings that we need.
      if (query.response_type !== "code" || query.state === undefined || query.redirect_uri === undefined)
      {
        res.statusCode = 404
        res.end()
      }
      else {
        res.render("default", {})
      }
    }
  })
}
