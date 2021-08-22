import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../../middleware/auth'
import config from '../../config/index'
const {JWT_SECRET} = config

import User from '../../models/user'

const router = express.Router()

router.post('/', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({msg: "parameter not found"})
    }

    User.findOne({email}).then((user) => {
        if (!user) return res.status(400).json({msg: "user not found"})

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) return res.status(400).json({msg: "password not matched"})

            jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: "2 days"}, (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                })
            })
        })
    })
})

router.post('/logout', (req, res) => {
    res.json('logout success')
})

router.get('/user', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) throw Error("user not found")
        res.json(user)
    } catch(e) {
        console.log(e)
        res.status(400).json({msg:e.message})
    }
})

export default router