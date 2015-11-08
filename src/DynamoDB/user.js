import crypto from "crypto"
import DBAdapter from "./DynamoDBAdapter"

const cannot_find_user = "Cannot find user."
const password_in_incorrect = "User password is incorrect."

class User {
  constructor () {
    this.email = ""
    this.nickname = ""
    this.password = ""
    this.lastlogin = Date.now
  }

  fill (item) {
    console.log ("start fill")
    this.email = item.email
    this.nickName = item.nickName
    this.password = item.password
    console.log (this)
    return this
  }

  add (done) {
    // Convert password to md5 encode.
    const md5 = crypto.createHash("md5")
    md5.update(this.password)
    // Create Params to add a new user
    const params = {
      "TableName": "user",
      "Item": {
        "nickname": this.nickname,
        "password": md5.digest("hex"),
        "email": this.email
      },
      ConditionExpression: "#e <> :email",
      ExpressionAttributeNames: {
        "#e": "email"
      },
      ExpressionAttributeValues: {
        ":email": this.email
      }
    }

    DBAdapter.add (params, (error, data) => {
      done (error, data)
    })
  }

  get (done) {
    // Create Params to add a new user
    const params = {
      "TableName": "user",
      KeyConditionExpression: "#e = :email",
      ExpressionAttributeNames: {
        "#e": "email"
      },
      ExpressionAttributeValues: {
        ":email": this.email
      }
    }
    DBAdapter.query (params, (error, data) => {
      done (error, data)
    })
  }
}

// Interface used to provide User operation

exports.insert = function (nickname, password, email, done) {
  const user = new User()
  user.nickname = nickname
  user.password = password
  user.email = email
  user.add ((error, data) => {
    done (error, data)
  })
}

exports.find = function (email, done) {
  const user = new User()
  user.email = email
  user.get ((error, data) => {
    if (error === null && result !== null && result.Count !== 0)
    {
      user.fill (result.Items[0])
      done(null, user)
    } else {
      done(cannot_find_user, null)
    }
  })
}

exports.check = function (email, password, done) {
  const user = new User()
  user.email = email

  user.get( (error, result) => {
    if (error === null && result !== null && result.Count !== 0)
    {
      const item = result.Items[0]
      // get user info and post it back to user
      const md5 = crypto.createHash("md5")
      md5.update(password)
      const md5Password = md5.digest("hex")
      if (md5Password === item.password) {
        user.fill (item)
        done(null, user)
      }
      else {
        done(password_in_incorrect, null)
      }
    }
    else {
      done(cannot_find_user, null)
    }
  })
}
