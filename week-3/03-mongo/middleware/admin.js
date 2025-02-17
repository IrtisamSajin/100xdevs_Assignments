const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try{
        const username=req.headers.username;
        const password=req.headers.password;
        const admin=await Admin.findOne({username:username});
        if(admin && admin.password===password){
            next();
        }else{
            res.status(404).json({
                message: "Invalid credentials",
            })
        }
    }catch(err){
        res.status(500).json({
            message: "Server Error",
        })
    }
}

module.exports = adminMiddleware;