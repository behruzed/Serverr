const Ucer = require('../../model/Role')
const jwt = require('jsonwebtoken')
const Turnir = require('../../model/Role2')

exports.profileSt = async (req, res) => {
    jwt.verify(req.headers.authorization, 'Key', async function (err, decoded) {
        if (err) {
            res.json(err)
        } else if (decoded) {
            let data = await Ucer.findById(decoded.id)
            if (data) {
                res.json({ title: "Your profile", data })
            }
        }
    });
}

exports.turners = async (req, res) => {
    let data = await Turnir.find({ status: 'progressing' })
    if (data) {
        res.json({ title: "All turners", data })
    }
}

exports.rand = async (req, res) => {
    let { idUcer } = req.query
    let data = await Ucer.find({ status: "talaba" })
    let arr = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].randomNumber == idUcer) {
            arr.push(data[i])
        }
    }
    if (arr) {
        res.json({ title: "Ucer", arr })
    } else {
        res.json({ title: "Error! User not found..." })
    }
}