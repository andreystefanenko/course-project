const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const StatusCodes = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {check,validationResult} = require('express-validator')
const User = require ('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('firstname', 'First name must be more than 1 character')
            .isLength({min:2}),
        check('firstname', 'Last name must be more than 1 character')
            .isLength({min:2}),
        check('email', 'Incorrect email!').isEmail(),
        check('password', 'Password must be more than 1 character')
            .isLength({min: 1})
    ],
    async (req, res) => {
        try{

            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            
            const {firstname, lastname, email, password} = req.body

            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: "This email already using"})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const regDate = new Date()
            const user = new User({firstname, lastname, email, password: hashedPassword, regDate })

            await user.save()

            res.status(StatusCodes.CREATED).json({message: "User created successfully"})

        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Use correct email').normalizeEmail().isEmail(),
        check ('password', 'Enter correct password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errors: errors.array(),
                    message: 'Incorrect login data'
                })
            }
            const {email, password} = req.body

            const user = await User.findOne({email})
            const isMatchByPassword = await bcrypt.compare(password, user.password)

            if (!user || !isMatchByPassword) {
                return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid email or password! Try again!'})
            }



            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )
            

            res.status(StatusCodes.OK).json({ token, userId: user.id, message:"Successfully login",})


        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong! Try again!'})
        }

    })

module.exports = router