import express from "express"
import cookie from "cookie-parser"
import bodyParser from "body-parser"
// import api from "./api"
import path from "path"
// import user from "./user"
// import oauth from "./oAuth"
import site from "./site"

const app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(cookie())
app.use(bodyParser())
// define the path of static files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', site.index)

// API interface
// app.get('/api/get/:userid', user.get)

const server = app.listen(8002, function () {
    console.log('Listening on port %d', server.address().port)
  })
