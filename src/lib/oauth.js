import db from "../db"
import url from "url"
import uuid from "node-uuid"
import app from "./app"
import config from "../config.json"
import tool from "./tool"


class AuthCache {
  constructor () {
    this.code = ""
    this.redirect_uri = ""
    this.client_id = ""
    this.access_token = ""
    this.user_email = ""
    this.user_id = ""
    this.nickname = ""
  }

  pushToCache (key) {
    app.locals.cache.put(key, this, config.code_timeout)
    return this
  }

  getFromCache (code) {
    return app.locals.cache.get(code)
  }

  removeFromCache (code) {
    app.locals.cache.del (code)
  }

  // This method is used to list all authes we saved.
  // This is used to debug codes.
  showAllAuthes () {
    console.log ( app.locals.cache.size())
    const test = app.locals.cache.keys()
    for (let i = 0 ; i < test.length ; i++) {
      console.log ( app.locals.cache.get(test[i]))
    }
  }
}

exports.remove = function (token, client, callback) {
  console.log ("token = " + token )
  console.log ("=======================")

  const savedAuth = new AuthCache().getFromCache(token)

  // We cannot find code in cache
  if ( savedAuth === null || savedAuth === 'undefined' ) {
    callback ("We cannot find the token.", null)
  }
  else {
    savedAuth.removeFromCache (token)
    callback (null,  null)
  }
}

exports.feed = function (authorization, client, page, section, action, callback) {
  let savedAuth = new AuthCache ()
  // savedAuth.showAllAuthes ()
  savedAuth = savedAuth.getFromCache (authorization)
  console.log (savedAuth)
  console.log (savedAuth.client_id)
  console.log (client)

  if (savedAuth === null || savedAuth.client_id !== client) {
    callback({ "pass": "0" })
  } else {
    callback({ "pass": "1" })
  }
}

// This method is used to reflush an auth token
exports.reflushKey = function (refresh_token,  callback) {
  const savedAuth = new AuthCache().getFromCache(refresh_token)

  // We cannot find code in cache
  if ( savedAuth === null || savedAuth === 'undefined' ) {
    callback ("We cannot find the auth info.", null)
  }
  else {
    savedAuth.removeFromCache (refresh_token)
    savedAuth.access_token = uuid.v4()
    savedAuth.pushToCache (savedAuth.access_token)
    callback (null,  { "access_token": savedAuth.access_token, "token_type": "pitayax-auth", expires_in: config.expires_in })
  }

}


// This method is used to conver a auth code to auth token
exports.authCode = function (code, redirect_uri, clientid, callback) {
  console.log ("Do authorizate.")
  try {
    const savedAuth = new AuthCache ().getFromCache (code)

    new AuthCache().showAllAuthes()

    // We cannot find code in cache
    if ( savedAuth === null || savedAuth === 'undefined' ) {
      callback ("We cannot find the auth info.", null)
    }
    // The URL is different from we saved URL
    else if ( savedAuth.redirect_uri !== redirect_uri ) {
      callback ("Redirect URI has been changed.", null)
    }
    // The Client ID is different from we saved Client ID
    else if ( savedAuth.client_id !== clientid ) {
      callback ("Client id has been changed.", null)
    }
    else {
      savedAuth.removeFromCache  (savedAuth.access_token)
      savedAuth.access_token = uuid.v4()
      savedAuth.pushToCache (savedAuth.access_token)
      savedAuth.showAllAuthes ()
      callback (null, { "access_token": savedAuth.access_token, "userid": savedAuth.user_id, "nickname": savedAuth.nickname, "token_type": "pitayax-auth", expires_in: config.expires_in })
    }
  } catch (e) {
    console.log ("error:" + e)
    callback (null, { error: e })
  }
}

exports.grant = function (user, client_id, redurect_uri, callback) {
  // create authCache entity to save auth info
  let authCache = new AuthCache ()
  authCache.code = uuid.v4()
  authCache.redirect_uri = redurect_uri
  authCache.client_id = client_id
  authCache.user_email = user.email
  authCache.user_id = user.id
  authCache.nickname = user.nickname
  authCache = authCache.pushToCache (authCache.code)
  authCache.showAllAuthes()
  callback(authCache)
}
