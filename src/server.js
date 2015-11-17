import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
import path from "path"
import config from "./config.json"
import db from "./db"
import user from "./routes/user"
import authorization from "./routes/authorization"
import cache from "memory-cache"
import app from "./lib/app"
import tool from "./lib/tool"
import cors from "cors"


const Logger = require('pitayax-service-core').Logger
const outputter = Logger.createFileOutputter(path.join(__dirname, '/output.log'))
console.log (path.join(__dirname, '/output.log'))
app.logger = new Logger(outputter)
app.logger.setLogLevel(config.log_level)


app.set("views", "./views")
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static('./views/static'))
app.locals.cache = cache

// site introduce page
app.get("/", function (req, res) {
  res.send(config.description + "<br>Current Version: " +  config.version + "<br>Author: " + config.author)
})

// user authorization page
app.route('/auth')
  .get(authorization.getAuth)
  .post(authorization.postAuth)

app.route('/token')
  .options(cors(), (req, res) => {  res.end() })
  .post(cors(), authorization.token)

app.route('/signout')
    .options(cors(), (req, res) => {  res.end() })
    .post(cors(), authorization.signout)

app.get("/feed", authorization.feed)


// Interface to do remote auth.
// Accept post auth info from other site.
app.route('/remote/auth')
  .options(cors(), (req, res) => {  res.end() })
  .post(cors(), (req, res) => { tool.remoteValidation(req, res, authorization.remoteAuth) })

// Create account page routing
app.route('/user/createAccount')
  .get(user.create_get)
  .post(user.create_post)

// Get user info routing
app.get("/api/user/:email", user.get)

const server = app.listen(config.port, function (error) {
  console.log('Listening on port %d', server.address().port)
})
