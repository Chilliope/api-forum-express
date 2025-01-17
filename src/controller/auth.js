const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/auth')

const SECRET_KEY = process.env.SECRET_KEY


const login = async (req, res) => {
    const { body } = req
    try {
        const [ data ] = await AuthModel.loginProcess(body)
        if(data.length === 0) {
            return res.status(404).json({
                status: 'not found',
                message: 'Username not found'
            })
        } 

        const user = data[0]

        const isPasswordMatch = await bcrypt.compare(body.password, user.password)
        if(!isPasswordMatch) {
            return res.status(401).json({
                'status': 'unauthorized',
                'message': 'invalid password'
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                image: user.image,
                circle_id: user.circle_id
            },
            SECRET_KEY,
            { 
                algorithm: "HS256",
                expiresIn: "24h"
            }
        )
        

        res.status(201).json({
            status: 'success',
            message: 'Login Success',
            data: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                token: token
            }
        })

    } catch (error) {
        res.status(403).json({
            message: 'Login Gagal',
            errorMessage: error
        })
    }
}

const registration = async (req, res) => {
    const { body } = req
    const saltRounds = 10
    const currentDate = new Date().toISOString().split('T')[0];

    try {
        const hashedPassword = await bcrypt.hash(body.password, saltRounds)
        const data = {
            fullname: body.fullname,
            username: body.username,
            password: hashedPassword,
            image: 'default.jpg',
            created_at: currentDate
        }

        await AuthModel.registrationProcess(data)
        
        res.status(201).json({
            message: 'Registration Success',
            data: data
        })
    } catch (error) {
       res.status(403).json({
        message: 'Registration Failed',
        error: error.message
       }) 
    }
}

const authUser = (req, res) => {
    res.json({
        user: req.user
    })
}

module.exports = {
    login,
    registration,
    authUser
}