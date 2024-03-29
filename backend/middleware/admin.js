const { AccessDeniedError } = require("./errors")

module.exports = function (req,res,next){
    if (!req.user.isAdmin) throw new AccessDeniedError("Error: Access Denied!")

    next()
}