const { Router } = require('express')
const {
    profileSt, 
    turners,
    rand,
} = require('../../controllers/path/prof')

const router = Router()


// http://localhost:3000/prof/profileSt
router.get('/profilest', profileSt)

// http://localhost:3000/prof/turners
router.get('/turners', turners)

// http://localhost:3000/prof/search?idUcer
router.get('/search', rand)

module.exports = router