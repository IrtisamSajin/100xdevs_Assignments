const { User } = require("../db");

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    try{
        const token=req.headers['authorization'].split(" ")[1];
        const verified=jwt.verify(token,process.env.JWT_KEY);
        req.username=verified.username;
        next();
    }catch(err){
        res.status(500).json({
            message: "Server Error",
        })
    }
}

module.exports = userMiddleware;