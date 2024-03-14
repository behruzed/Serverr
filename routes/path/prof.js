const { Router } = require('express')
const {
    profileSt, 
    turners,
    rand,
    sendMess,
    crGroup,
    crTurnir,
    addStudentToGroup,
    showMem,
    removeStudentFromGroup,
} = require('../../controllers/path/prof')

const router = Router()


// http://localhost:3000/prof/profileSt
router.get('/profilest', profileSt)

// http://localhost:3000/prof/turners
router.get('/turners', turners)

// http://localhost:3000/prof/search?idUcer
router.get('/search', rand)

// http://localhost:3000/prof/sendMess?idAuthor
router.post('/sendMess', sendMess)

// http://localhost:3000/prof/crGroup
router.post('/crGroup', crGroup)

// http://localhost:3000/prof/crTurnir
router.post('/crTurnir', crTurnir)

// http://localhost:3000/prof/addStToGr
router.post('/addStToGr', addStudentToGroup)

// http://localhost:3000/prof/delMem
router.delete('/delMem', removeStudentFromGroup)

// http://localhost:3000/prof/group/members/id teacher?idGroup
router.get('/group/members/:id', showMem)

module.exports = router