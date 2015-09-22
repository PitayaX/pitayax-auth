import db from "../db"
import url from "url"
import uuid from "node-uuid"
import app from "../lib/app"
import config from "../config.json"

// This method is used to list all authes we saved.
// This is used to debug codes.
const showAllAuthes = function () {
  console.log ( app.locals.cache.size())
  const test = app.locals.cache.keys()
  for (let i = 0 ; i < test.length ; i++) {
    console.log ( app.locals.cache.get(test[i]))
  }
}

// This method is used to reflush an auth token
const reflushKey = function (req, res) {
  console.log ("Do reflush key.")

  const refresh_token = req.param("refresh_token")
  const savedAuth = app.locals.cache.get(refresh_token)

  // We cannot find code in cache
  if ( savedAuth === null || savedAuth === 'undefined' ) {
    res.statusCode = 404
    res.end()
    console.log ("We cannot find the auth info.")
  }
  else {
    app.locals.cache.del (refresh_token)
    savedAuth.access_token = uuid.v4()
    app.locals.cache.put (savedAuth.access_token, savedAuth, config.expires_in)

    showAllAuthes ()
    res.json( { "access_token": savedAuth.access_token, "token_type": "pitayax-auth", expires_in: config.expires_in })
  }

}

// This method is used to conver a auth code to auth token
const authCode = function (req, res) {
  console.log ("Do authorizate.")
  const code = req.param("code")
  const redirect_uri = req.param("redirect_uri")
  const clientid = req.param("client_id")
  const savedAuth = app.locals.cache.get(code)

  // We cannot find code in cache
  if ( savedAuth === null || savedAuth === 'undefined' ) {
    res.statusCode = 404
    res.end()
    console.log ("We cannot find the auth info.")
  }
  // The URL is different from we saved URL
  else if ( savedAuth.redirect_uri !== redirect_uri ) {
    res.statusCode = 404
    res.end()
    console.log ("Redirect URI has been changed.")
  }
  else {
    savedAuth.access_token = uuid.v4()
    app.locals.cache.del (code)
    app.locals.cache.put (savedAuth.access_token, savedAuth, config.expires_in)

    // showAllAuthes ()
    res.json( { "access_token": savedAuth.access_token, "token_type": "pitayax-auth", expires_in: config.expires_in })
  }
}

exports.token = function (req, res) {
  const granttype = req.param("grant_type")

  switch (granttype) {
  case "authorization_code":
    authCode (req, res)
    break
  case "refresh_token":
    reflushKey (req, res)
    break
  default :
    res.statusCode = 404
    res.end()
  }

}

exports.feed = function (req, res) {
  const token = req.params.authorization
  const client = req.params.client
  const page = req.params.page
  const section = req.params.section
  const action = req.params.action
  res.json({ "pass": "1" })
}

// This is method use to save code and return to redirect uri with generated code
exports.postAuth = function (req, res) {
  const userName = req.param("userIDTextBox")
  const userPassword = req.param("passwordTextBox")
  // TODO: We have to check user name and password here.

  // create authCache entity to save auth info
  let authCache = {}
  authCache.code = uuid.v4()
  authCache.redirect_uri = req.query.redirect_uri
  authCache.client_id = req.query.client_id
  authCache = app.locals.cache.put(authCache.code, authCache, config.code_timeout)

  // showAllAuthes ()
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
