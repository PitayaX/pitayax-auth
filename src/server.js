import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
import path from "path"
import config from "./config.json"

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static(path.join(__dirname, 'public')))

// site page interface
app.get("/", function (req, res) {
  res.send(config.description + "<br>Current Version: " +  config.version + "<br>Author: " + config.author)
})

// API interface
app.get('/api/get/:userid', user.get)

const server = app.listen(config.port, function () {
    console.log('Listening on port %d', server.address().port)
  })
