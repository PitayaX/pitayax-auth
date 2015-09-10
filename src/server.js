import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
import path from "path"
import config from "./config.json"
import db from "./db"
import user from "./routes/user"
import authorization from "./routes/authorization"

const app = express()
app.set("views", "./views")
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static(path.join(__dirname, 'views/public')))

// site introduce page
app.get("/", function (req, res) {
  res.send(config.description + "<br>Current Version: " +  config.version + "<br>Author: " + config.author)
})

// user authorization page
app.get("/authorize", authorization.getAuth)
app.post("/authorize", authorization.postAuth)


// API interface
app.get('/api/user/:userid', user.get)
app.post("/api/user/grant", authorization.grant)

const server = app.listen(config.port, function () {
    console.log('Listening on port %d', server.address().port)
  })
