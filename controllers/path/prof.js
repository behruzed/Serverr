const Ucer = require('../../model/Role')
const jwt = require('jsonwebtoken')

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