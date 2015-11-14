import crypto from "crypto"
import config from "../config.json"

// exports.cipher = function (key, content) {
//     const cip = crypto.createCipher("aes-256-cbc", key)
//     cip.update(content, "utf8", "hex")
//     return cip.final("hex")
//   }
//
// exports.decipher = function (key, content) {
//     const decipher = crypto.createDecipher("aes-256-cbc", key)
//     decipher.update(content, 'hex', 'utf8')
//     return decipher.final('utf8')
//   }
//
// exports.cross_domain = function (req, res) {
//     res.set('Access-Control-Allow-Origin', '*')
//   }
//
// exports.remoteValidation = (req, res, next) => {
//   const passcode = req.get("passcode")
//   if (passcode === config.remotePasscode) {
//     next (req, res)
//   } else {
//     res.statusCode = 404
//     res.end()
//   }
// }


exports.sha1 = function (content) {
  const sha1 = crypto.createHash("sha1")
  sha1.update(content)
  return sha1.digest("hex")
}
