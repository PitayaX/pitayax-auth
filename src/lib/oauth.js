import db from "../db"
import url from "url"
import uuid from "node-uuid"
import app from "./app"
import config from "../config.json"
import key from "./config.json"
import tool from "./tool"


// This method is used to list all authes we saved.
// This is used to debug codes.
const showAllAuthes = function () {
  console.log ( app.locals.cache.size())
  const test = app.locals.cache.keys()
  for (let i = 0 ; i < test.length ; i++) {
    console.log ( app.locals.cache.get(test[i]))
  }
}

exports.feed = function (req, res) {
  const securityKey = req.params.securityKey
  const request = req.params.request


  const client = req.params.client
  const page = req.params.page
  const section = req.params.section
  const action = req.params.action


  const test = tool.cipher( key.client_key.blog, "test" )
  console.log (test)
  console.log (tool.decipher( key.client_key.blog, test ))

  //   const md5 = crypto.createHash("md5")
  //   md5.update(password)
  //   const md5Password = md5.digest("hex")

  return { "pass": "1" }
}

// This method is used to reflush an auth token
exports.reflushKey = function (req, res) {
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
exports.authCode = function (req, res) {
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

exports.grant = function (req, res) {
  // create authCache entity to save auth info
  let authCache = {}
  authCache.code = uuid.v4()
  authCache.redirect_uri = req.query.redirect_uri
  authCache.client_id = req.query.client_id
  authCache = app.locals.cache.put(authCache.code, authCache, config.code_timeout)
  return authCache
}
