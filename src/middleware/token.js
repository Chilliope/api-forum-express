const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({
            status: 'unauthorized',
            message: 'Token not provided'
        })
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) {
            return res.status(401).json({
                status: 'forbidden',
                message: 'Invalid token'
            })
        }

        req.user = user;
        next()
    })
}