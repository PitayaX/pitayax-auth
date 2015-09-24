import crypto from "crypto"


exports.cipher = function (key, content) {
    const cip = crypto.createCipher("aes-256-cbc", key)
    cip.update(content, "utf8", "hex")
    return cip.final("hex")
  }

exports.decipher = function (key, content) {
    const decipher = crypto.createDecipher("aes-256-cbc", key)
    decipher.update(content, 'hex', 'utf8')
    return decipher.final('utf8')
  }
