import db from "../db"
import url from "url"
import uuid from "node-uuid"
import app from "../lib/app"
import config from "../config.json"

const reflushKey = function (req, res) {
  res.statusCode = 302
  res.append('Location', query.redirect_uri + "?access_token=" + token +"&token_type=auth_key&expires_in=3600" + "&state=" + query.state)
  res.end()
}

const auth_code = function (req, res) {
  const code = req.param("code")
  const redirect_uri = req.param("redirect_uri")
  const access_token = uuid.v4()
  const refresh_token = uuid.v4()
  res.json( { access_token, "token_type": "none", expires_in: 3600, refresh_token })
}

exports.token = function (req, res) {
  const granttype = req.param("granttype")

  switch (granttype) {
  case "authorization_code":
    auth_code (req, res)
    break
  case "refreshtoken":
    reflushKey (req, res)
    break
  default :
    res.statusCode = 404
    res.end()
  }

}

// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query

  // create authCache entity to save auth info
  const authCache = {}
  authCache.code = uuid.v4()
  authCache.redirect_uri = query.redirect_uri
  authCache.client_id = query.client_id
  app.locals.cache.put(authCache.code, authCache, config.code_timeout)

  console.log ( app.locals.cache.size())
  console.log ( app.locals.cache.keys())

  // redirect to return URL with code.
  res.statusCode = 302
  res.append('Location', authCache.redirect_uri + "?code=" + authCache.code + "&state=" + query.state)
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
