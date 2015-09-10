const mysql = require('./mysqlAdapter')

const organization = function () {
    this.id = ""
    this.orgId = ""
    this.name = ""
    this.orgSecret = "ssh-secret"
  }

const fillOrg = function (row) {
    const result = new organization()
    result.id = row.id
    result.orgId = row.orgId
    result.name = row.name
    return result
  }


exports.find = function (id, done) {
    db.ReadData("  SELECT\
                   `id`,`orgId`,`name`\
                   FROM `team`.`organization`\
                   WHERE id = " + id + " ", function (rows, err) {
        if (err != null) {
          return done(err, null)
        } else if (rows == null) {
          return done('No organization found', null)
        } else {
          return done(null, fillOrg(rows[0]))
        }
      })
  }

exports.findByOrgId = function (orgId, done) {
    db.ReadData("  SELECT\
                   `id`,`orgId`,`name`\
                   FROM `team`.`organization`\
                   WHERE orgId = '" + orgId + "' ", function (rows, err) {
        if (err != null) {
          return done(err, null)
        } else if (rows == null) {
          return done('No organization found', null)
        } else {
          return done(null, fillOrg(rows[0]))
        }
      })
  }
