import db from "../db"
import url from "url"
import oauth from "../lib/oauth"


exports.feed = function (req, res) {
  const result = oauth.feed (req, res)
  if (result === null || result === 'undefined') {
    res.statusCode = 404
    res.end()
  }
  else {
    res.json (result)
  }
}

// This is used to:
// 1. Get auth token from code
// 2. Refresh token
exports.token = function (req, res) {
  const granttype = req.param("grant_type")

  switch (granttype) {
  case "authorization_code":
    oauth.authCode (req, res)
    break
  case "refresh_token":
    oauth.reflushKey (req, res)
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
  // TODO: We have to check user name and password here.

  const authCache = oauth.grant (req, res)
  // redirect to return URL with code.
  res.statusCode = 302
  res.append('Location', authCache.redirect_uri + "?code=" + authCache.code + "&state=" + req.query.state)
  res.end()
}

// This method is return user login page
exports.getAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query

  // We will show 404 if current request does not include the query strings that we need.
  // TODO: In future, we need to check client id and redirect uri here.
  if (query.response_type !== "code" || query.client_id === undefined || query.state === undefined || query.redirect_uri === undefined)
  {
    res.statusCode = 404
    res.end()
  }
  else {
    res.render("default", {})
  }
}
