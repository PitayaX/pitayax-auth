import AWS from "aws-sdk"

AWS.config.loadFromPath('./credentials.json')
const dynamodb = new AWS.DynamoDB()

exports.Init_User = () => {

  // Create User table
  const user_table = {
    TableName: 'user',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    KeySchema: [
      { AttributeName: 'email', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'email', AttributeType: 'S' }
    ]
  }

  dynamodb.createTable (user_table, function (err, data) {
    if (err) {
      console.error("Unable to create table user. Error JSON:", JSON.stringify(err, null, 2))
    } else {
      console.log("Created table user. Table description JSON:", JSON.stringify(data, null, 2))
    }
  })
}

exports.Init_Client = () => {
  // Create User table
  const client_table = {
    TableName: 'client',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    KeySchema: [
      { AttributeName: 'client_id', KeyType: 'HASH' },
      { AttributeName: 'client_name', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'client_id', AttributeType: 'S' },
      { AttributeName: 'client_name', AttributeType: 'S' }
    ]
  }

  dynamodb.createTable (client_table, function (err, data) {
    if (err) {
      console.error("Unable to create table client. Error JSON:", JSON.stringify(err, null, 2))
    } else {
      console.log("Created table client. Table description JSON:", JSON.stringify(data, null, 2))
    }
  })
}
