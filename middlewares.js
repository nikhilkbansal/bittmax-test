const jwt = require('jsonwebtoken')

let privateKey = '123456werty3456';


exports.authorize = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, privateKey, function (err, decoded) {
            if (err) {
                res.status(403).send(err)
            }
        });
        next();
    }
    else {
        res.status(403).send('You are not authorized')
    }
}