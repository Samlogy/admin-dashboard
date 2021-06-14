const bcrypt = require('bcrypt')
const createError = require('http-errors')
const router = require('express').Router()

const User = require("../models/user.model");
// const Notification = require("../models/notification.model")

const { sendEmail } = require('../utils/email')
const { signAccessToken, verifyAccessToken,
        signRefreshToken, verifyRefreshToken } = require('../utils/jwt_helper');
// const { registerSchema, loginSchema, 
//         forgotPasswordSchema, resetPasswordSchema } = require('../utils/validation_schema');


// create json web token
const maxAge = 3 * 24 * 60 * 60;

// Functions


router.post('/login', async (req, res) => {
    try {
        // validate data using yup + schema validation
        const valid = req.body // await loginSchema.validate(req.body)

        const { email } = valid

        const user = await User.findOne({ email: email })
        if (!user) throw createError.NotFound('User not registered')

        // check if user account is active --> (active: true)
        if (!user.active) console.log('Please activate your to login ! --> check your email')

        // check password validity
        const isMatch = await bcrypt.compare(valid.password, user.password)
        if (!isMatch)
          throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(user.id)
        // const refreshToken = await signRefreshToken(user.id)

        // delete secret values
        // const ForbidenKeys = ["password", "active", "secret_answer", "__v"]
        // ForbidenKeys.forEach(el => {
        //   if (el === user[el]) delete user
        // })

        // console.log(user)
        
        res.status(201).send({  
          message: 'User Logged !',
          data: user // { accessToken, refreshToken }
        }) 
        
      
    } catch (err) {
      res.status(500).send({ error: err.message  })
    }
});   
router.get('/logout', async (req, res) => {
    try {
      res.status(201).send({
        message: 'User Account logged out !',
        data: {}
      })
      // const { refreshToken } = req.body

      // if (!refreshToken) throw createError.BadRequest()
      // res.status(201).send(refreshToken)
      // const userId = await verifyRefreshToken(refreshToken)

      // client.DEL(userId, (err, val) => {
      //   if (err) {
      //     console.log(err.message)
      //     throw createError.InternalServerError()
      //   }
      //   console.log(val)
      //   res.sendStatus(204)
      // })
    } catch (err) {
      res.status(500).send({ error: err.message  })
    }
});
router.post('/refresh-token', async (req, res) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      // const refreshToken = await signRefreshToken(userId)

      res.status(201).send({
        message: 'Token refreshed !',
        data: {
          accessToken,
          // refreshToken
        }
      })

    } catch (err) {
      res.status(500).send({ error: err.message })
    }
});

module.exports = router;