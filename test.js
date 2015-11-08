import { user, client } from "./src/DynamoDB"

// user.add("yemol2", "yemol yuan 1", "123456", "yemol@pitayax.net", function (result) {
//   // console.log (result)
// })

client.insert("pitayax-web", "pitayax project web site", function (error, result) {
  console.log (result)
  console.log (error)
})

client.insert("schoolloop", "school loop project", function (error, result) {
  console.log (result)
  console.log (error)
})
