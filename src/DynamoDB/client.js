import DBAdapter from "./DynamoDBAdapter"

const cannot_find_client = "Cannot find client."

class Client {
  constructor () {
    this.client_id = ""
    this.client_name = ""
  }

  fill (item) {
    console.log ("start fill client object")
    this.client_id = item.client_id
    this.client_name = item.client_name
    console.log (this)
    return this
  }

  add (done) {
    // Create Params to add a new user
    const params = {
      "TableName": "client",
      "Item": {
        "client_id": this.client_id,
        "client_name": this.client_name
      },
      ConditionExpression: "#id <> :clientid",
      ExpressionAttributeNames: {
        "#id": "client_id"
      },
      ExpressionAttributeValues: {
        ":clientid": this.client_id
      }
    }

    DBAdapter.add (params, (error, data) => {
      done (error, data)
    })
  }

  get (done) {
    // Create Params to add a new user
    const params = {
      "TableName": "client",
      KeyConditionExpression: "#id = :clientid",
      ExpressionAttributeNames: {
        "#id": "client_id"
      },
      ExpressionAttributeValues: {
        ":clientid": this.client_id
      }
    }
    DBAdapter.query (params, (error, data) => {
      done (error, data)
    })
  }
}

// Interface used to provide Client operation
exports.insert = function (clientid, clientname, done) {
  const client = new Client()
  client.client_id = clientid
  client.client_name = clientname
  client.add ((error, data) => {
    done (error, data)
  })
}

exports.find = function (clientid, done) {
  const client = new Client()
  client.client_id = clientid
  client.get ((error, data) => {
    console.log ("[client.find]error = " + error)
    console.log ("[client.find]data = " + data)
    if (error === null && data !== null && data.Count !== 0)
    {
      client.fill (data.Items[0])
      done(null, client)
    } else {
      done(cannot_find_client, null)
    }
  })
}
