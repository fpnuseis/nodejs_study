import jwt from 'jsonwebtoken'
import config from '../config/index'

const {JWT_SECRET} = config

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).json({msg: "token not found"})
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET)
        next()
    } catch(e) {
        console.log(e)
        res.status(400).json({msg: e})
    }
}

export default auth;
