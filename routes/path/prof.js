const { Router } = require('express')
const {
    profileSt,
} = require('../../controllers/path/prof')

const router = Router()


// http://localhost:3000/prof/profileSt
router.get('/profilest', profileSt)

module.exports = router