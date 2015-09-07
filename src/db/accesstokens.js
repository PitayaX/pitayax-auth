const tokens = {}

exports.find = function (key, done) {
    const token = tokens[key]
    return done(null, token)
  }

exports.save = function (token, userID, orgID, done) {
    tokens[token] = { userID, orgID }
    return done(null)
  }
