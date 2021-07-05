const {StatusCodes} = require("http-status-codes");
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
       return next()
    }

    try {

        const token = req.header.authorization.split(' ')[1]

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'No authorization'})
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded
        next()

    } catch (e) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'No authorization'})
    }
}