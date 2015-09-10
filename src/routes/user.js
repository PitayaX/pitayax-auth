
import db from "../db"

exports.get = function (req, res) {
  const userid = req.params.userid
  db.users.find(userid, function (error, result) {
    if (error != null) {
      res.statusCode = 404
      return res.send('Error 404: ' + error)
    } else {
      res.json(result)
    }
  })
}

exports.grant = function (req, res) {

}

// exports.login = function (userid, password, callback) {
//    db.ReadData("   SELECT\
//                    `UserID`,`UserName`,`LoginPassword`,`LastLogin`,`IsTrainee`,`IsDeparted`,\                                                                           `EmailAddress`,`EMAccount`,`EMPassword`,`JIRAToken`\
//                    FROM `team`.`users`\
//                    WHERE userid = '" + userid + "' ", function (rows, err) {
//        debugger;
//        if (err != null) {
//            callback(err);
//        } else if (rows == null) {
//            callback('Error: No user found');
//        } else {
//
//            //get user info and post it back to user
//            var md5 = crypto.createHash('md5');
//            md5.update(password);
//            var md5_password = md5.digest('hex');
//            check_result = md5_password == rows[0].LoginPassword;
//
//            if (check_result) {
//                var result = new user();
//                result.UserID = rows[0].UserID;
//                result.UserName = rows[0].UserName;
//                result.LastLogin = Date.now;
//                result.IsTrainee = rows[0].IsTrainee == 1;
//                result.IsDepated = rows[0].IsDeparted == 1;
//                result.Email = rows[0].EmailAddress;
//                result.EMAccount = function EMAccount() {
//                    var Account = rows[0].EMAccount;
//                    var Password = rows[0].EMPassword;
//                    var JIRAToken = rows[0].JIRAToken;
//                }
//                callback(null, result);
//            } else {
//                callback('Error: No user found');
//            }
//
//        }
//    });
// }

// exports.Authenticate = function (req, res) {
//    db.ReadData("   SELECT\
//                    `UserID`,`UserName`,`LoginPassword`,`LastLogin`,`IsTrainee`,`IsDeparted`,\                                                                           `EmailAddress`,`EMAccount`,`EMPassword`,`JIRAToken`\
//                    FROM `team`.`users`\
//                    WHERE userid = '" + req.params.userid + "' ", function (rows, err) {
//        if (err != null) {
//            res.statusCode = 404;
//            return res.send('Error 404: ' + err);
//        } else if (rows == null) {
//            res.statusCode = 404;
//            return res.send('Error 404: No user found');
//        } else {
//            //get user info and post it back to user
//            var md5 = crypto.createHash('md5');
//            md5.update(passowrd);
//            var md5_password = md5.digest('hex');
//            check_result = md5_password == rows[0].LoginPassword;
//
//            if (check_result) {
//                var result = new user();
//                result.UserID = rows[0].UserID;
//                result.UserName = rows[0].UserName;
//                result.LastLogin = Date.now;
//                result.IsTrainee = rows[0].IsTrainee == 1;
//                result.IsDepated = rows[0].IsDeparted == 1;
//                result.Email = rows[0].EmailAddress;
//                result.EMAccount = function EMAccount() {
//                    var Account = rows[0].EMAccount;
//                    var Password = rows[0].EMPassword;
//                    var JIRAToken = rows[0].JIRAToken;
//                }
//                res.json(result);
//            } else {
//
//            }
//
//        }
//    });
// }
