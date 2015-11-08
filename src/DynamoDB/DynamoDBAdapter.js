import AWS from "aws-sdk"
import path from "path"

AWS.config.loadFromPath('./credentials.json')
const dynamodb = new AWS.DynamoDB.DocumentClient()


exports.add = function (params, done) {
  dynamodb.put(
    params, function (error, data) {
      if (error !== null) {
        done(error, null)
      } else if (data.statusCode === 400) {
        done("Duplicate primary key.", null)
      } else {
        done(null, data)
      }
    })
}

exports.update = function (params, done) {
  dynamodb.update(
    params, function (error, data) {
      if (error !== null) {
        done(error, null)
      } else if (data.statusCode === 400) {
        done("Duplicate primary key.", null)
      } else {
        done(null, data)
      }
    })
}

exports.delete = function (params, done) {
  dynamodb.delete(
    params, function (error, data) {
      if (error !== null) {
        done(error, null)
      } else if (data.statusCode === 400) {
        done("Duplicate primary key.", null)
      } else {
        done(null, data)
      }
    })
}

exports.query = function (params, done) {
  dynamodb.query(
    params, function (error, data) {
      done(null, data)
    })
}
