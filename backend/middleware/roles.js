const { AccessDeniedError } = require("./errors")

function superAdmin(req,res,next){
    const role = req.user.role
    if (role !== "superadmin") throw new AccessDeniedError("Error: Access Denied!")
    next()
}

function admin(req,res,next){
    // const role = req.user.role
    // if(role === "admin" || role === "superAdmin") req.user.isAdmin = true
    if (!req.user.isAdmin) throw new AccessDeniedError("Error: Access Denied!")
    next()
}

function isVendor(req,res,next){
    const role = req.user.role
    if (role !== "vendor") throw new AccessDeniedError("Error: You do not have access to this resource")
    next()
}

module.exports = {admin, superAdmin, isVendor}

// function authRole(role) {
//     return (req, res, next) => {
//       if (req.user.role !== role) {
//         res.status(401);
//         return res.send("not allowed");
//       }
//       next();
//     };