const { Router } = require('express')
const { checkLogin } = require('../../middleware/checkLogin')
const { signIn, signUp } = require('../../controllers/auth/auntification')
const routes = Router()


// http://localhost:3000/auth
routes.route("/")
    .post(checkLogin, signIn)
routes.route("/register")
    .post(signUp)

module.exports = routes