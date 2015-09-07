const codes = {}


exports.find = function (key, done) {
    const code = codes[key]
    return done(null, code)
  }

exports.save = function (code, orgID, redirectURI, userID, done) {
    codes[code] = { orgID, redirectURI, userID }
    return done(null)
  }

exports.delete = function (key, done) {
    delete codes[key]
    return done(null)
  }
