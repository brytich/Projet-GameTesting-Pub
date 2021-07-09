const jwt = require('jsonwebtoken');
module.exports = {
    authenticateToken (req,res,next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) 
        {
            return res.status(401).json('no authentificate');
        }
        jwt.verify(token,process.env.JWT_SIGN_SECRET , (err,user) => {
            if (err) {
                return res.status(403).json('access refused')
            }
            req.user = user;
        })
        next();    
    }

}