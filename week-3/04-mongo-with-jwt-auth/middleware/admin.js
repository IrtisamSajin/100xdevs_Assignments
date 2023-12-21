const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try{
        const token=req.headers['authorization'].split(" ")[1];
        const verified=jwt.verify(token,process.env.JWT_KEY);
        req.username=verified.adminUsername;
        next();
    }catch(err){
        res.status(500).json({
            message: "Server Error",
        })
    }
}

module.exports = adminMiddleware;