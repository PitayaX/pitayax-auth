
import db from "../db"
import url from "url"

exports.grant = function (req, res) {
}


exports.postAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query
  console.log (query)
}

exports.getAuth = function (req, res) {
  const url_parts = url.parse (req.url, true)
  const query = url_parts.query
  console.log (query.client_id)

  // We will show 404 if current request does not include the query strings that we need.
  // TODO: In future, we need to check client id and redirect uri here.
  if (query.response_type !== "code" || query.client_id === undefined || query.state === undefined || query.redirect_uri === undefined)
  {
    res.statusCode = 404
    res.end()
    return
  }

  res.render("default", {})
}
