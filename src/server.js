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

app.set("views", "./views")
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static(path.join(__dirname, 'views/static')))
app.locals.cache = cache

// site introduce page
app.get("/", function (req, res) {
  res.send(config.description + "<br>Current Version: " +  config.version + "<br>Author: " + config.author)
})
// user authorization page
app.get("/auth", authorization.getAuth)
app.post("/auth", authorization.postAuth)

app.post("/remote/auth", cors(), authorization.remoteAuth)
app.options("/remote/auth", cors(), (req, res) => {  res.end() })

app.post("/token", cors(), authorization.token)
app.options("/token", cors(), (req, res) => {  res.end() })

app.get("/feed", authorization.feed)

// user
app.get("/user/createAccount", user.createAccount_get)
app.post("/user/createAccount", user.createAccount_post)
app.get("/api/user/:userid", user.get)

const server = app.listen(config.port, function (error) {
    console.log('Listening on port %d', server.address().port)
  })
